
import React, { useState } from 'react';
import Header from './components/Header';
import ChatList from './components/ChatList';
import ControlBar from './components/ControlBar';
import SettingsModal from './components/SettingsModal';
import StatsModal from './components/StatsModal';
import { useTranslationSession } from './hooks/useTranslationSession';
import { useStudyGuide } from './hooks/useStudyGuide';
import { defaultSettings } from './models/SettingsModel';

const App: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  const { wordStats, studyGuide, isGeneratingGuide, updateWordStats, generateStudyGuide, exportGuideAsText, clearStats } = useStudyGuide();

  const { 
    status, activeMode, setActiveMode, history, stream, duration,
    currentInputText, currentOutputText, connect, disconnect, clearHistory, downloadHistoryAsText 
  } = useTranslationSession({
    onWordDetected: updateWordStats,
    isAudioOutputEnabled: settings.isAudioOutputEnabled,
  });

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedDeviceId={settings.selectedDeviceId}
        onDeviceChange={(id) => setSettings({...settings, selectedDeviceId: id})}
        isAmbientMode={settings.isAmbientMode}
        onAmbientModeChange={(val) => setSettings({...settings, isAmbientMode: val})}
        isSystemAudioEnabled={settings.isSystemAudioEnabled}
        onSystemAudioChange={(val) => setSettings({...settings, isSystemAudioEnabled: val})}
      />

      <StatsModal 
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        wordStats={wordStats}
        studyGuide={studyGuide}
        isGeneratingGuide={isGeneratingGuide}
        onGenerateGuide={generateStudyGuide}
        onExport={exportGuideAsText}
        onClear={clearStats}
      />

      <Header 
        status={status}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        isAudioOutputEnabled={settings.isAudioOutputEnabled}
        onToggleAudioOutput={() => setSettings({...settings, isAudioOutputEnabled: !settings.isAudioOutputEnabled})}
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
        onDownloadChat={downloadHistoryAsText}
        onClearChat={clearHistory}
      />

      <main className="flex-1 overflow-hidden relative">
        <ChatList history={history} currentInputText={currentInputText} currentOutputText={currentOutputText} />
      </main>

      <ControlBar 
        status={status}
        stream={stream}
        duration={duration}
        activeMode={activeMode}
        isAmbientMode={settings.isAmbientMode}
        isSystemAudioEnabled={settings.isSystemAudioEnabled}
        onSystemAudioChange={(val) => setSettings({...settings, isSystemAudioEnabled: val})}
        onConnect={() => connect(settings.selectedDeviceId, settings.isAmbientMode, settings.isSystemAudioEnabled)}
        onDisconnect={disconnect}
      />
    </div>
  );
};

export default App;
