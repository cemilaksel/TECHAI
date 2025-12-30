
import { useRef, useState } from 'react';
import { AUDIO_CONSTANTS } from '../models/AudioModel';

export const useAudioController = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [duration, setDuration] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const initContexts = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContextClass({ 
        sampleRate: AUDIO_CONSTANTS.SAMPLE_RATE_OUTPUT,
        latencyHint: 'playback' 
      });
    }
    if (!inputContextRef.current || inputContextRef.current.state === 'closed') {
      inputContextRef.current = new AudioContextClass({ latencyHint: 'playback' });
    }
    return { audioContext: audioContextRef.current, inputContext: inputContextRef.current };
  };

  const startTimer = () => {
    setDuration(0);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setDuration(0);
  };

  const cleanupAudio = () => {
    stopTimer();
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
      inputContextRef.current.close();
    }
  };

  return {
    stream,
    setStream,
    duration,
    audioContextRef,
    inputContextRef,
    initContexts,
    startTimer,
    stopTimer,
    cleanupAudio
  };
};
