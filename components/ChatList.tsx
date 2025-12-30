
import React, { useRef, useEffect } from 'react';
import { ConversationPair } from '../types';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { LanguageIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface ChatListProps {
  history: ConversationPair[];
  currentInputText: string;
  currentOutputText: string;
}

const ChatList: React.FC<ChatListProps> = ({ history, currentInputText, currentOutputText }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, currentInputText, currentOutputText]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      ref={chatContainerRef}
      className="h-full overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth pb-40"
    >
        {history.length === 0 && !currentInputText && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-60">
                <LanguageIcon className="w-16 h-16" />
                <p className="text-sm">Start speaking to translate...</p>
                <div className="text-xs max-w-md text-center leading-relaxed px-4">
                    Ensure you select the correct microphone in settings <Cog6ToothIcon className="w-3 h-3 inline" /> if capturing TV or room audio.
                </div>
            </div>
        )}

        {history.map((pair) => (
            <div key={pair.id} className="w-full max-w-4xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Input Message (User / Speaker) */}
                <div className="flex flex-col gap-1">
                    {/* Minimal Header */}
                    <div className="flex items-center gap-2 px-4 opacity-70">
                        <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest">
                            Speaker
                        </span>
                        <span className="text-[10px] text-slate-500">
                            • {formatTime(pair.input.timestamp)} •
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            ({pair.input.language})
                        </span>
                    </div>

                    {/* Bubble */}
                    <div className="bg-slate-900 rounded-2xl rounded-tl-none p-5 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
                        <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">{pair.input.text}</p>
                    </div>
                </div>

                {/* Output Message (AI / Interpreter) */}
                {pair.output && pair.output.text && (
                    <div className="flex flex-col gap-1 pl-8 md:pl-16">
                        {/* Minimal Header - Right Aligned */}
                        <div className="flex items-center justify-end gap-2 px-4 opacity-70">
                             <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                                ({pair.output.language})
                            </span>
                             <span className="text-[10px] text-slate-500">
                                • {formatTime(pair.output.timestamp)} •
                            </span>
                            <span className="text-xs font-medium text-blue-500 uppercase tracking-widest">
                                Interpreter
                            </span>
                        </div>

                        {/* Bubble */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl rounded-tr-none p-5 border border-slate-700/50 shadow-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <SparklesIcon className="w-10 h-10 text-blue-400" />
                            </div>
                            <p className="text-white font-medium text-lg leading-relaxed whitespace-pre-wrap font-sans relative z-10">
                                {pair.output.text}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        ))}

        {/* Real-time Buffers */}
        {(currentInputText || currentOutputText) && (
             <div className="w-full max-w-4xl mx-auto space-y-4 opacity-80">
                {currentInputText && (
                    <div className="flex flex-col gap-1">
                        <div className="px-4 text-xs font-bold text-slate-500 animate-pulse uppercase tracking-widest">Listening...</div>
                        <div className="bg-slate-900/40 rounded-2xl p-5 border border-dashed border-slate-700">
                            <p className="text-slate-400 text-lg">{currentInputText}</p>
                        </div>
                    </div>
                )}
             </div>
        )}
    </div>
  );
};

export default ChatList;
