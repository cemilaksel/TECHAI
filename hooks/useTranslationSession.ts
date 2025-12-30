
import { useRef, useEffect, useCallback, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { useAudioController } from '../controllers/AudioController';
import { useTranslationController } from '../controllers/TranslationController';
import { pcmTo16kBase64, decodeBase64, decodeAudioData, downsampleBuffer } from '../services/audioUtils';
import { AUDIO_CONSTANTS } from '../models/AudioModel';
import * as ApiKeyModel from '../models/ApiKeyModel';

const SYSTEM_INSTRUCTION = `You are a real-time simultaneous technical interpreter. 
Listen to the audio input and provide high-quality translation between English and Turkish. 
Maintain technical accuracy and context. 
If input is English, translate to Turkish. If input is Turkish, translate to English.`;

export const useTranslationSession = ({ onWordDetected, isAudioOutputEnabled }: any) => {
  const audio = useAudioController();
  const translation = useTranslationController(onWordDetected);
  
  const isConnectedRef = useRef(false);
  const isSessionActiveRef = useRef(false);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const [activeMode, setActiveModeState] = useState<'AUTO' | 'EN_INPUT' | 'TR_INPUT'>('AUTO');
  const activeModeRef = useRef(activeMode);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  const isAudioOutputEnabledRef = useRef(isAudioOutputEnabled);

  useEffect(() => {
    isAudioOutputEnabledRef.current = isAudioOutputEnabled;
  }, [isAudioOutputEnabled]);

  const stopAll = useCallback(() => {
    isConnectedRef.current = false;
    isSessionActiveRef.current = false;
    audio.cleanupAudio();
    sourcesRef.current.forEach(s => {
      try {
        s.stop();
      } catch (e) {}
    });
    sourcesRef.current.clear();
    if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
    }
  }, [audio]);

  const handleMessage = async (message: any) => {
    const { serverContent } = message;
    if (!serverContent) return;

    if (serverContent.inputTranscription) {
      translation.inputBufferRef.current += serverContent.inputTranscription.text;
      translation.setCurrentInputText(translation.inputBufferRef.current);
    }
    if (serverContent.outputTranscription) {
      translation.outputBufferRef.current += serverContent.outputTranscription.text;
      translation.setCurrentOutputText(translation.outputBufferRef.current);
    }

    if (serverContent.modelTurn?.parts?.[0]?.inlineData && isAudioOutputEnabledRef.current) {
      const base64Audio = serverContent.modelTurn.parts[0].inlineData.data;
      const ctx = audio.audioContextRef.current;
      if (base64Audio && ctx) {
        if (ctx.state === 'suspended') await ctx.resume();
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
        const buffer = await decodeAudioData(decodeBase64(base64Audio), ctx, AUDIO_CONSTANTS.SAMPLE_RATE_OUTPUT);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += buffer.duration;
        sourcesRef.current.add(source);
        source.onended = () => sourcesRef.current.delete(source);
      }
    }

    if (serverContent.turnComplete) translation.commitToHistory(activeModeRef.current);
  };

  const downloadHistoryAsText = useCallback(() => {
    if (translation.history.length === 0) {
      alert("No conversation history to download.");
      return;
    }
    let content = "TECH INTERPRETER - CONVERSATION HISTORY\n========================================\n\n";
    translation.history.forEach((pair) => {
      const time = new Date(pair.input.timestamp).toLocaleTimeString();
      content += `[${time}] Speaker (${pair.input.language}): ${pair.input.text}\n`;
      if (pair.output && pair.output.text) {
        content += `[${time}] Interpreter (${pair.output.language}): ${pair.output.text}\n`;
      }
      content += "----------------------------------------\n";
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Conversation_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [translation.history]);

  const connect = async (deviceId: string, isAmbientMode: boolean, captureSystemAudio: boolean) => {
    const key = ApiKeyModel.getApiKey();
    if (!key) {
      translation.setStatus('error');
      alert("API Key is required to connect.");
      return;
    }

    try {
      isSessionActiveRef.current = true;
      const { audioContext, inputContext } = audio.initContexts();
      
      let finalStream: MediaStream;
      const micStream = await navigator.mediaDevices.getUserMedia({ 
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined, echoCancellation: !isAmbientMode, noiseSuppression: !isAmbientMode, autoGainControl: true } 
      });

      if (captureSystemAudio) {
        const systemStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const mixCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const dest = mixCtx.createMediaStreamDestination();
        mixCtx.createMediaStreamSource(micStream).connect(dest);
        if (systemStream.getAudioTracks().length > 0) {
          mixCtx.createMediaStreamSource(systemStream).connect(dest);
        }
        finalStream = dest.stream;
      } else {
        finalStream = micStream;
      }

      audio.setStream(finalStream);
      translation.setStatus('connecting');

      const ai = new GoogleGenAI({ apiKey: key });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: { 
            systemInstruction: SYSTEM_INSTRUCTION, 
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {}, 
            outputAudioTranscription: {} 
        },
        callbacks: {
          onopen: () => {
            translation.setStatus('connected');
            isConnectedRef.current = true;
            audio.startTimer();
          },
          onmessage: handleMessage,
          onclose: () => {
              translation.setStatus('disconnected');
              stopAll();
          },
          onerror: (e) => {
            console.error("Session error:", e);
            translation.setStatus('error');
          }
        }
      });

      const source = inputContext.createMediaStreamSource(finalStream);
      const processor = inputContext.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(inputContext.destination);

      processor.onaudioprocess = (e) => {
        if (!isConnectedRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(inputData, inputContext.sampleRate, AUDIO_CONSTANTS.TARGET_INPUT_SAMPLE_RATE);
        const base64 = pcmTo16kBase64(downsampled);
        if (base64) {
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
        }
      };

    } catch (e) {
      console.error("Connection failed:", e);
      translation.setStatus('error');
      stopAll();
    }
  };

  return {
    ...translation,
    stream: audio.stream,
    duration: audio.duration,
    connect,
    disconnect: stopAll,
    clearHistory: () => translation.setHistory([]),
    downloadHistoryAsText,
    activeMode,
    setActiveMode: setActiveModeState
  };
};
