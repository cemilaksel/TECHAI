
import { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ESSENTIAL_WORDS } from '../data/essentialWords';
import * as ApiKeyModel from '../models/ApiKeyModel';

export interface StudyCard {
  word: string;
  synonym: string;
  phrase: string;
  isEssential?: boolean;
}

const FLASH_MODEL_NAME = 'gemini-3-flash-preview';

export const useStudyGuide = () => {
  const [wordStats, setWordStats] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('techInterpreter_wordStats');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const [studyGuide, setStudyGuide] = useState<Record<string, StudyCard>>(() => {
    try {
      const saved = localStorage.getItem('techInterpreter_studyGuide');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);

  const essentialMatches = useMemo(() => {
    return Object.keys(wordStats).filter(word => ESSENTIAL_WORDS.includes(word.toLowerCase()));
  }, [wordStats]);

  const updateWordStats = (text: string, language: 'EN' | 'TR' | 'Detecting...') => {
    if (language !== 'EN') return;
    const normalized = text.toLowerCase();
    const words = normalized.match(/[a-z']+/gu);
    if (words) {
      setWordStats(prev => {
        const next = { ...prev };
        words.forEach(word => {
          if (word.length > 1 || word === 'i' || word === 'a') {
            next[word] = (next[word] || 0) + 1;
          }
        });
        localStorage.setItem('techInterpreter_wordStats', JSON.stringify(next));
        return next;
      });
    }
  };

  const generateStudyGuide = async () => {
    const key = ApiKeyModel.getApiKey();
    if (!key) {
      alert("Please set your API key in settings first.");
      return;
    }

    const essentialToGenerate = essentialMatches.filter(word => !studyGuide[word]).slice(0, 10);
    const topWords = Object.entries(wordStats)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([word]) => word)
      .filter(word => !essentialToGenerate.includes(word) && !studyGuide[word])
      .slice(0, 20 - essentialToGenerate.length);

    const targetList = [...essentialToGenerate, ...topWords];
    if (targetList.length === 0) {
        alert("No new words to generate guides for yet!");
        return;
    }

    setIsGeneratingGuide(true);
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const schema = {
        type: Type.OBJECT,
        properties: {
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                synonym: { type: Type.STRING },
                phrase: { type: Type.STRING }
              },
              required: ["word", "synonym", "phrase"]
            }
          }
        },
        required: ["cards"]
      };

      const response = await ai.models.generateContent({
        model: FLASH_MODEL_NAME,
        contents: `Generate a study guide for: ${targetList.join(', ')}. Return strictly JSON.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema
        }
      });

      const jsonText = response.text;
      if (jsonText) {
        const data = JSON.parse(jsonText);
        if (data.cards) {
          const newGuide: Record<string, StudyCard> = { ...studyGuide };
          data.cards.forEach((card: any) => {
            newGuide[card.word] = { ...card, isEssential: ESSENTIAL_WORDS.includes(card.word.toLowerCase()) };
          });
          setStudyGuide(newGuide);
          localStorage.setItem('techInterpreter_studyGuide', JSON.stringify(newGuide));
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate guide.");
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const exportGuideAsText = () => {
    const sortedWords = Object.entries(wordStats).sort((a, b) => b[1] - a[1]).map(([word]) => word);
    if (sortedWords.length === 0) return;
    let content = "STUDY GUIDE\n===========\n\n";
    sortedWords.forEach((word) => {
      const guide = studyGuide[word];
      content += `${word.toUpperCase()} (Used ${wordStats[word]}x)\n`;
      if (guide) content += `   Synonym: ${guide.synonym}\n   Phrase: ${guide.phrase}\n`;
      content += "---\n";
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `StudyGuide.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearStats = () => {
    if (confirm('Clear stats?')) {
      setWordStats({}); setStudyGuide({});
      localStorage.removeItem('techInterpreter_wordStats');
      localStorage.removeItem('techInterpreter_studyGuide');
    }
  };

  return { wordStats, studyGuide, isGeneratingGuide, updateWordStats, generateStudyGuide, exportGuideAsText, clearStats };
};
