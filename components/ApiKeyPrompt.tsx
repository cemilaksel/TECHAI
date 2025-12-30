
import React, { useState } from 'react';
import { KeyIcon, ArrowTopRightOnSquareIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ApiKeyPromptProps {
  onSave: (key: string) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSave }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSave(input.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary-600/20 rounded-2xl border border-primary-500/30 mb-2">
            <KeyIcon className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Enter Gemini API Key</h2>
          <p className="text-slate-400 text-sm">
            Please provide your Gemini API key to start using the real-time interpreter.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
              API Key
            </label>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-900/20 active:scale-95"
          >
            Start Interpreting
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
            <span>Your key is stored locally in your browser.</span>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Get your key from Google AI Studio
            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
