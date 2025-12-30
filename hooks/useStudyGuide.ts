
import { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ESSENTIAL_WORDS } from '../data/essentialWords';

// Interfaces for Study Guide
export interface StudyCard {
  word: string;
  synonym: string;
  phrase: string;
  isEssential?: boolean;
}

// Fix: Using recommended model name for text tasks
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

  // Computed: Find which words from the Essential list the user has actually used
  const essentialMatches = useMemo(() => {
    return Object.keys(wordStats).filter(word => ESSENTIAL_WORDS.includes(word.toLowerCase()));
  }, [wordStats]);

  // Logic to parse and update word usage - Only for English
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
    // Priority 1: Essential words that haven't been generated yet
    const essentialToGenerate = essentialMatches
        .filter(word => !studyGuide[word])
        .slice(0, 10); // Take top 10 ungenerated essential words

    // Priority 2: High frequency words (excluding ones already picked)
    const topWords = Object.entries(wordStats)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([word]) => word)
      .filter(word => !essentialToGenerate.includes(word) && !studyGuide[word]) // Don't duplicate
      .slice(0, 20 - essentialToGenerate.length);

    const targetList = [...essentialToGenerate, ...topWords];

    if (targetList.length === 0) {
        alert("No new words to generate guides for yet!");
        return;
    }

    setIsGeneratingGuide(true);
    try {
      // Fix: Correct initialization using named parameter and process.env.API_KEY directly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const schema = {
        type: Type.OBJECT,
        properties: {
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                synonym: { type: Type.STRING, description: "A common single-word synonym or alternative." },
                phrase: { type: Type.STRING, description: "A short, natural daily conversation phrase using the word." }
              },
              required: ["word", "synonym", "phrase"],
              propertyOrdering: ["word", "synonym", "phrase"]
            }
          }
        },
        required: ["cards"]
      };

      const prompt = `I have a list of English words I use: ${targetList.join(', ')}. 
              Please generate a study guide. 
              Important: These words: [${essentialToGenerate.join(', ')}] are from a target vocabulary list. make sure the phrases for these are very high quality.
              For each word, provide:
              1. A common synonym (most used alternative).
              2. A useful, natural conversation phrase (idiom or pattern) I can use in daily life.
              Return strictly JSON.`;

      const response = await ai.models.generateContent({
        model: FLASH_MODEL_NAME,
        contents: prompt,
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
            const isEssential = ESSENTIAL_WORDS.includes(card.word.toLowerCase());
            newGuide[card.word] = {
              word: card.word,
              synonym: card.synonym,
              phrase: card.phrase,
              isEssential: isEssential
            };
          });
          setStudyGuide(newGuide);
          localStorage.setItem('techInterpreter_studyGuide', JSON.stringify(newGuide));
        }
      }
    } catch (e) {
      console.error("Failed to generate study guide", e);
      alert("Could not generate study guide. Please try again.");
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const exportGuideAsText = () => {
    // Sort: Essential words first, then frequency
    const sortedWords = Object.entries(wordStats)
      .sort((a, b) => {
        const isAEssential = ESSENTIAL_WORDS.includes(a[0]);
        const isBEssential = ESSENTIAL_WORDS.includes(b[0]);
        if (isAEssential && !isBEssential) return -1;
        if (!isAEssential && isBEssential) return 1;
        return (b[1] as number) - (a[1] as number);
      })
      .map(([word]) => word);

    if (sortedWords.length === 0) {
       alert("No words to export.");
       return;
    }

    let content = "ENGLISH STUDY GUIDE & ESSENTIAL VOCABULARY TRACKER\nGenerated by Tech Interpreter AI\n==================================================\n\n";

    content += `Total Essential Words Found: ${essentialMatches.length}\n\n`;

    sortedWords.forEach((word, index) => {
      const guide = studyGuide[word];
      const count = wordStats[word];
      const isEssential = ESSENTIAL_WORDS.includes(word.toLowerCase());
      
      content += `${index + 1}. WORD: ${word.toUpperCase()} ${isEssential ? '[TARGET WORD]' : ''} (Used ${count} times)\n`;
      if (guide) {
        content += `   Synonym: ${guide.synonym}\n`;
        content += `   Phrase:  "${guide.phrase}"\n`;
      } else {
        content += `   (No AI guide generated yet)\n`;
      }
      content += `---------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `StudyGuide_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearStats = () => {
    if (confirm('Are you sure you want to delete all word usage history? This cannot be undone.')) {
      setWordStats({});
      setStudyGuide({});
      localStorage.removeItem('techInterpreter_wordStats');
      localStorage.removeItem('techInterpreter_studyGuide');
    }
  };

  return {
    wordStats,
    studyGuide,
    isGeneratingGuide,
    essentialMatches,
    updateWordStats,
    generateStudyGuide,
    exportGuideAsText,
    clearStats
  };
};
