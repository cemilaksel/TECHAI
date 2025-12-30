
import React, { useEffect, useState } from 'react';
import { XMarkIcon, SpeakerWaveIcon, ComputerDesktopIcon, KeyIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import * as ApiKeyModel from '../models/ApiKeyModel';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
  isAmbientMode: boolean;
  onAmbientModeChange: (isAmbient: boolean) => void;
  isSystemAudioEnabled: boolean;
  onSystemAudioChange: (enabled: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, selectedDeviceId, onDeviceChange, isAmbientMode, onAmbientModeChange,
  isSystemAudioEnabled, onSystemAudioChange
}) => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [apiKeyInput, setApiKeyInput] = useState(ApiKeyModel.getApiKey() || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioInputs);
        
        if (!selectedDeviceId && audioInputs.length > 0) {
           const defaultDevice = audioInputs.find(d => d.deviceId === 'default');
           onDeviceChange(defaultDevice ? defaultDevice.deviceId : audioInputs[0].deviceId);
        }
      } catch (e) {
        console.error("Error fetching devices", e);
      }
    };

    getDevices();
  }, [isOpen]);

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      ApiKeyModel.setApiKey(apiKeyInput.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleClearKey = () => {
    ApiKeyModel.removeApiKey();
    setApiKeyInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
         <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
           <h2 className="text-lg font-semibold text-white">Application Settings</h2>
           <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
             <XMarkIcon className="w-5 h-5 text-slate-400" />
           </button>
         </div>
         <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* API Key Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <KeyIcon className="w-4 h-4 text-primary-400" />
                Gemini API Key
              </label>
              <div className="space-y-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveKey}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    {isSaved ? <CheckCircleIcon className="w-4 h-4 text-emerald-400" /> : null}
                    {isSaved ? 'Saved' : 'Save Key'}
                  </button>
                  <button
                    onClick={handleClearKey}
                    className="px-4 py-2 bg-red-950/20 hover:bg-red-900/30 text-red-400 text-xs font-bold rounded-lg transition-all border border-red-900/20"
                  >
                    Clear
                  </button>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1 transition-colors"
                >
                  How to get API Key <ArrowTopRightOnSquareIcon className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <div className="h-px bg-slate-800 w-full"></div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Microphone Source</label>
              <select 
                value={selectedDeviceId}
                onChange={(e) => onDeviceChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
              >
                {audioDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.slice(0,5)}...`}
                  </option>
                ))}
                {audioDevices.length === 0 && <option value="">Default Microphone</option>}
              </select>
            </div>

            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
               <div className="space-y-0.5">
                 <span className="text-sm font-medium text-white flex items-center gap-2">
                   <ComputerDesktopIcon className="w-4 h-4 text-primary-400" />
                   Include System Audio
                 </span>
                 <p className="text-xs text-slate-400 leading-relaxed">
                    Capture audio from other tabs.<br/>
                    <span className="text-amber-500 font-medium text-[10px]">Desktop Only (Chrome/Edge).</span>
                 </p>
               </div>
               <button 
                 onClick={() => onSystemAudioChange(!isSystemAudioEnabled)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSystemAudioEnabled ? 'bg-primary-600' : 'bg-slate-700'}`}
               >
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSystemAudioEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
               </button>
            </div>

            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
               <div className="space-y-0.5">
                 <span className="text-sm font-medium text-white flex items-center gap-2">
                   <SpeakerWaveIcon className="w-4 h-4 text-primary-400" />
                   Ambient / TV Mode
                 </span>
                 <p className="text-[10px] text-slate-400">Enhance pickup for room conversations.</p>
               </div>
               <button 
                 onClick={() => onAmbientModeChange(!isAmbientMode)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAmbientMode ? 'bg-primary-600' : 'bg-slate-700'}`}
               >
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAmbientMode ? 'translate-x-6' : 'translate-x-1'}`} />
               </button>
            </div>

         </div>
         <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
           <button onClick={onClose} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors">
             Done
           </button>
         </div>
      </div>
    </div>
  );
};

export default SettingsModal;
