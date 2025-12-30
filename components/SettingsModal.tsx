import React, { useEffect, useState } from 'react';
import { XMarkIcon, SpeakerWaveIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

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

  useEffect(() => {
    if (!isOpen) return;

    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioInputs);
        
        // Default selection logic if none selected
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
         <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
           <h2 className="text-lg font-semibold text-white">Audio Settings</h2>
           <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
             <XMarkIcon className="w-5 h-5 text-slate-400" />
           </button>
         </div>
         <div className="p-6 space-y-6">
            
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
              <p className="text-xs text-slate-500">Your primary voice input.</p>
            </div>

            {/* System Audio Toggle */}
            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
               <div className="space-y-0.5">
                 <span className="text-sm font-medium text-white flex items-center gap-2">
                   <ComputerDesktopIcon className="w-4 h-4 text-primary-400" />
                   Include System Audio
                 </span>
                 <p className="text-xs text-slate-400 leading-relaxed">
                    Capture audio from other tabs (e.g., Sesame).<br/>
                    <span className="text-amber-500 font-medium">Desktop Only (Chrome/Edge).</span>
                 </p>
               </div>
               <button 
                 onClick={() => onSystemAudioChange(!isSystemAudioEnabled)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSystemAudioEnabled ? 'bg-primary-600' : 'bg-slate-700'}`}
               >
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSystemAudioEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
               </button>
            </div>

            {/* Ambient Mode Toggle */}
            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
               <div className="space-y-0.5">
                 <span className="text-sm font-medium text-white flex items-center gap-2">
                   <SpeakerWaveIcon className="w-4 h-4 text-primary-400" />
                   Ambient / TV Mode
                 </span>
                 <p className="text-xs text-slate-400">Enhance pickup for room conversations (Noise cancellation off).</p>
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