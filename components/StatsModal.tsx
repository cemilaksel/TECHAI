import React, { useState } from 'react';
import { XMarkIcon, ChartBarIcon, ArrowDownTrayIcon, TrashIcon, SparklesIcon as SparklesIconOutline, BookOpenIcon } from '@heroicons/react/24/outline';
import { StudyCard } from '../hooks/useStudyGuide';
import { ESSENTIAL_WORDS } from '../data/essentialWords';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordStats: Record<string, number>;
  studyGuide: Record<string, StudyCard>;
  isGeneratingGuide: boolean;
  onGenerateGuide: () => void;
  onExport: () => void;
  onClear: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({
  isOpen, onClose, wordStats, studyGuide, isGeneratingGuide, onGenerateGuide, onExport, onClear
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'essential'>('all');

  if (!isOpen) return null;

  const totalWords = Object.values(wordStats).reduce((a: number, b: number) => a + b, 0);
  
  // Calculate stats
  const essentialMatches = Object.keys(wordStats).filter(w => ESSENTIAL_WORDS.includes(w.toLowerCase()));
  const totalEssential = ESSENTIAL_WORDS.length;
  const progressPercentage = Math.round((essentialMatches.length / totalEssential) * 100);

  // Sorting logic based on tab
  let displayWords = Object.entries(wordStats).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  
  if (activeTab === 'essential') {
      displayWords = displayWords.filter(([word]) => ESSENTIAL_WORDS.includes(word.toLowerCase()));
  } else {
      displayWords = displayWords.slice(0, 50); // Show top 50 general words to avoid lag
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 flex-none">
           <div className="flex items-center gap-2">
               <ChartBarIcon className="w-5 h-5 text-primary-400" />
               <h2 className="text-lg font-semibold text-white">English Study Guide</h2>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
             <XMarkIcon className="w-5 h-5 text-slate-400" />
           </button>
         </div>
         
         {/* Dashboard Area */}
         <div className="p-6 bg-slate-950 border-b border-slate-800 flex-none">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* General Stats */}
                 <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                    <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Total Spoken Words</div>
                    <div className="text-2xl font-bold text-white">{totalWords}</div>
                 </div>

                 {/* Curriculum Progress */}
                 <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-xl p-4 border border-indigo-500/30 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <div className="text-indigo-300 text-xs uppercase tracking-wide mb-1 flex items-center gap-1">
                                <BookOpenIcon className="w-3 h-3" /> Target Vocabulary
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {essentialMatches.length} <span className="text-sm text-slate-400 font-normal">/ {totalEssential}</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 text-indigo-300 text-xs font-bold">
                            {progressPercentage}%
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden relative z-10">
                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(2, progressPercentage)}%` }}></div>
                    </div>
                 </div>
             </div>
         </div>

         {/* List Controls */}
         <div className="flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex-none">
             <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
                 <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 >
                    Top Usage
                 </button>
                 <button 
                    onClick={() => setActiveTab('essential')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'essential' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 >
                    Target Words ({essentialMatches.length})
                 </button>
             </div>

             <button 
                    onClick={onGenerateGuide}
                    disabled={isGeneratingGuide || displayWords.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                >
                    {isGeneratingGuide ? (
                         <>Analyzing...</>
                    ) : (
                         <>
                            <SparklesIconOutline className="w-3 h-3" />
                            {Object.keys(studyGuide).length > 0 ? 'Update AI Guide' : 'Generate Guide'}
                         </>
                    )}
            </button>
         </div>
         
         {/* Word List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
            <div className="space-y-1 p-2">
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-950 z-10 border-b border-slate-900">
                    <div className="col-span-3">Word</div>
                    <div className="col-span-1 text-center">Freq</div>
                    <div className="col-span-3">Synonym / Alt</div>
                    <div className="col-span-5">Practice Phrase</div>
                </div>

                {displayWords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2">
                        <BookOpenIcon className="w-8 h-8 opacity-50" />
                        <p className="text-sm">No words found for this category yet.</p>
                        {activeTab === 'essential' && <p className="text-xs">Try using words from the essential list!</p>}
                    </div>
                ) : (
                    displayWords.map(([word, count]) => {
                        const guide = studyGuide[word];
                        const isEssential = ESSENTIAL_WORDS.includes(word.toLowerCase());
                        
                        return (
                            <div key={word} className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg transition-colors items-center border-b border-slate-800/50 last:border-0 ${isEssential ? 'bg-indigo-950/10 hover:bg-indigo-900/20' : 'hover:bg-slate-900/50'}`}>
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className="font-medium text-slate-200 capitalize text-sm">{word}</span>
                                    {isEssential && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Target</span>
                                    )}
                                </div>
                                <div className="col-span-1 text-center text-slate-400 text-xs bg-slate-900 rounded-md py-0.5">{count}</div>
                                <div className="col-span-3 text-sm text-indigo-300">
                                    {guide ? guide.synonym : <span className="text-slate-700 text-xs italic">-</span>}
                                </div>
                                <div className="col-span-5 text-sm text-emerald-300/90 italic">
                                    {guide ? `"${guide.phrase}"` : <span className="text-slate-700 text-xs not-italic">Click 'Generate Guide' to see suggestions</span>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
         </div>

         {/* Footer Actions */}
         <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center flex-none">
           <button 
             onClick={onClear}
             className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg text-sm transition-colors"
           >
             <TrashIcon className="w-4 h-4" />
             Reset
           </button>
           <button 
             onClick={onExport}
             className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
           >
             <ArrowDownTrayIcon className="w-4 h-4" />
             Export TXT
           </button>
         </div>
      </div>
    </div>
  );
};

export default StatsModal;