
import { useRef, useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { initialTranslationState, detectLanguage } from '../models/TranslationModel';
import { ConversationPair, ConnectionStatus } from '../types';

const LIVE_MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';
const SYSTEM_INSTRUCTION = `You are a real-time simultaneous technical interpreter...`;

export const useTranslationController = (onWordDetected: any) => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [history, setHistory] = useState<ConversationPair[]>(initialTranslationState.history);
  const [currentInputText, setCurrentInputText] = useState('');
  const [currentOutputText, setCurrentOutputText] = useState('');
  
  const inputBufferRef = useRef('');
  const outputBufferRef = useRef('');
  const sessionRef = useRef<any>(null);

  const commitToHistory = useCallback((activeMode: string) => {
    if (!inputBufferRef.current.trim() && !outputBufferRef.current.trim()) return;

    const detected = detectLanguage(inputBufferRef.current);
    const inLang = activeMode === 'AUTO' ? detected : (activeMode === 'EN_INPUT' ? 'EN' : 'TR');
    const outLang = inLang === 'EN' ? 'TR' : 'EN';

    onWordDetected(inputBufferRef.current, inLang);
    onWordDetected(outputBufferRef.current, outLang);

    const newPair: ConversationPair = {
      id: Date.now().toString(),
      input: {
        id: `in-${Date.now()}`,
        text: inputBufferRef.current.trim() || "(Speech detected)",
        isFinal: true,
        language: inLang,
        type: 'input',
        timestamp: Date.now()
      },
      output: {
        id: `out-${Date.now()}`,
        text: outputBufferRef.current.trim(),
        isFinal: true,
        language: outLang,
        type: 'output',
        timestamp: Date.now()
      }
    };

    setHistory(prev => [...prev, newPair]);
    inputBufferRef.current = '';
    outputBufferRef.current = '';
    setCurrentInputText('');
    setCurrentOutputText('');
  }, [onWordDetected]);

  return {
    status,
    setStatus,
    history,
    setHistory,
    currentInputText,
    setCurrentInputText,
    currentOutputText,
    setCurrentOutputText,
    inputBufferRef,
    outputBufferRef,
    sessionRef,
    commitToHistory
  };
};
