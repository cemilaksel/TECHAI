
import { ConversationPair } from '../types';

export interface TranslationState {
  history: ConversationPair[];
  currentInputText: string;
  currentOutputText: string;
  lastInputLang: 'EN' | 'TR' | 'Detecting...';
}

export const initialTranslationState: TranslationState = {
  history: [],
  currentInputText: '',
  currentOutputText: '',
  lastInputLang: 'Detecting...',
};

export function detectLanguage(text: string): 'EN' | 'TR' {
  const lower = text.toLowerCase();
  const trChars = /[ğüşıöç]/;
  if (trChars.test(lower)) return 'TR';
  const enUniqueChars = /[wqx]/;
  if (enUniqueChars.test(lower)) return 'EN';
  const commonTrWords = /\b(bir|ve|bu|ile|da|de|mi|mı|mu|mü|ama|fakat|için|ben|sen|o|var|yok|ne|nasıl|merhaba|selam|günaydın|iyi|tamam|evet|hayır|belki|ne|neden|niçin|kim)\b/;
  if (commonTrWords.test(lower)) return 'TR';
  return 'EN'; 
}
