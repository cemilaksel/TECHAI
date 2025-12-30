
import React from 'react';
import AudioVisualizer from './AudioVisualizer';
import { MicrophoneIcon, StopIcon, ComputerDesktopIcon, ArrowTopRightOnSquareIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ConnectionStatus } from '../types';

interface ControlBarProps {
  status: ConnectionStatus;
  stream: MediaStream | null;
  duration: number;
  activeMode: string;
  isAmbientMode: boolean;
  isSystemAudioEnabled: boolean;
  onSystemAudioChange: (enabled: boolean) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({ 
  status, stream, duration, activeMode, isAmbientMode, 
  isSystemAudioEnabled, onSystemAudioChange,
  onConnect, onDisconnect 
}) => {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="flex-none bg-slate-900 border-t border-slate-800 p-6 relative z-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          
          <div className="w-full h-16 bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
              {status === 'connected' ? (
                   <>
                     <AudioVisualizer stream={stream} isActive={status === 'connected'} />
                     {/* Floating Timer Badge */}
                     <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 shadow-lg">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        <span className="text-white font-mono text-sm md:text-base font-bold tracking-wider">
                          {formatTime(duration)}
                        </span>
                     </div>
                   </>
              ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs font-mono tracking-widest uppercase">
                      Waiting for audio...
                  </div>
              )}
          </div>

          <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-6">
                  {status === 'connected' || status === 'connecting' ? (
                      <button 
                          onClick={onDisconnect}
                          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 transition-all duration-300"
                      >
                          <StopIcon className="w-8 h-8" />
                          <span className="absolute -bottom-8 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Stop Session</span>
                      </button>
                  ) : (
                      <button 
                          onClick={onConnect}
                          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] text-white transition-all duration-300 transform hover:scale-105"
                      >
                          <MicrophoneIcon className="w-8 h-8" />
                          <span className="absolute -bottom-8 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {isSystemAudioEnabled ? 'Select Tab & Listen' : 'Start Listening'}
                          </span>
                      </button>
                  )}
              </div>

              {/* System Audio Toggle & Helper Links (Only visible when disconnected) */}
              {status === 'disconnected' && (
                <div className="flex flex-col items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group bg-slate-800/40 hover:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700/50 transition-all">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={isSystemAudioEnabled}
                          onChange={(e) => onSystemAudioChange(e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                      </div>
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white flex items-center gap-1.5">
                         <ComputerDesktopIcon className="w-3.5 h-3.5" />
                         Capture Tab Audio
                      </span>
                    </label>

                    {/* Quick Link for Sesame */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>External App:</span>
                        <a 
                           href="https://app.sesame.com/" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-950/30 px-2 py-1 rounded border border-indigo-500/20 hover:border-indigo-500/50"
                        >
                           <img src="https://www.google.com/s2/favicons?domain=app.sesame.com" alt="" className="w-3 h-3 opacity-80" />
                           Open Sesame
                           <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </a>
                    </div>
                </div>
              )}
          </div>

          <div className="text-slate-500 text-xs text-center font-mono flex items-center justify-center gap-2 min-h-[20px]">
              {status === 'connected' && (
                  <span className="animate-pulse flex items-center gap-1">
                      Listening to {activeMode === 'AUTO' ? 'Auto-detect' : activeMode === 'EN_INPUT' ? 'English' : 'Turkish'} 
                      {isAmbientMode ? ' (Ambient Mode)' : ''}
                  </span>
              )}
               {status === 'disconnected' && (
                  <span className="text-slate-600">Ready to start</span>
               )}
          </div>
      </div>
    </footer>
  );
};

export default ControlBar;
