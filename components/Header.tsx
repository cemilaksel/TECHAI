
import React from 'react';
import { ConnectionStatus } from '../types';
import { ChatBubbleLeftRightIcon, ChartBarIcon, Cog6ToothIcon, ArrowDownTrayIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  status: ConnectionStatus;
  activeMode: 'AUTO' | 'EN_INPUT' | 'TR_INPUT';
  setActiveMode: (mode: 'AUTO' | 'EN_INPUT' | 'TR_INPUT') => void;
  isAudioOutputEnabled: boolean;
  onToggleAudioOutput: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onDownloadChat: () => void;
  onClearChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  status, 
  activeMode, 
  setActiveMode,
  isAudioOutputEnabled,
  onToggleAudioOutput,
  onOpenStats, 
  onOpenSettings,
  onDownloadChat,
  onClearChat
}) => {
  return (
    <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg shadow-lg shadow-primary-500/20">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Tech Interpreter</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <span className="flex items-center gap-1">
               <span className={`w-1.5 h-1.5 rounded-full ${
                  status === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 
                  status === 'connecting' ? 'bg-amber-400' : 
                  status === 'error' ? 'bg-red-500' :
                  'bg-slate-600'
                }`}></span>
               {status === 'connected' ? 'Live' : 
                status === 'connecting' ? 'Connecting...' : 
                status === 'error' ? <span className="text-red-400 font-medium flex items-center gap-1">Error <ExclamationTriangleIcon className="w-3 h-3"/></span> : 
                'Offline'}
             </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={() => setActiveMode('AUTO')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeMode === 'AUTO' ? 'bg-slate-800 text-white border border-slate-600' : 'text-slate-400 hover:text-white'}`}
        >
          Auto Detect
        </button>
        <div className="h-4 w-px bg-slate-700 mx-1 hidden md:block"></div>
        <button 
          onClick={() => setActiveMode('EN_INPUT')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeMode === 'EN_INPUT' ? 'bg-slate-800 text-white border border-slate-600' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="hidden md:inline">EN Input</span>
          <span className="md:hidden">EN</span>
        </button>
        <button 
          onClick={() => setActiveMode('TR_INPUT')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeMode === 'TR_INPUT' ? 'bg-slate-800 text-white border border-slate-600' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="hidden md:inline">TR Input</span>
          <span className="md:hidden">TR</span>
        </button>
        
        <div className="h-6 w-px bg-slate-700 mx-1"></div>
        
        <button 
          onClick={onToggleAudioOutput}
          className={`p-2 transition-colors rounded-lg bg-slate-800/50 hover:bg-slate-800 ${isAudioOutputEnabled ? 'text-primary-400' : 'text-slate-500'}`}
          title={isAudioOutputEnabled ? "Mute Translations" : "Unmute Translations"}
        >
           {isAudioOutputEnabled ? <SpeakerWaveIcon className="w-5 h-5" /> : <SpeakerXMarkIcon className="w-5 h-5" />}
        </button>

        <button 
          onClick={onClearChat}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-800/50 hover:bg-slate-800 rounded-lg"
          title="Reset Chat"
        >
          <TrashIcon className="w-5 h-5" />
        </button>

        <button 
          onClick={onDownloadChat}
          className="p-2 text-slate-400 hover:text-emerald-400 transition-colors bg-slate-800/50 hover:bg-slate-800 rounded-lg"
          title="Save Conversation"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={onOpenStats}
          className="p-2 text-slate-400 hover:text-primary-400 transition-colors bg-slate-800/50 hover:bg-slate-800 rounded-lg"
          title="Study Guide"
        >
          <ChartBarIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 rounded-lg"
          title="Audio Settings"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
