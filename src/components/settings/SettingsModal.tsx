// src/components/settings/SettingsModal.tsx
// System Settings, trilingual display controls, AI key configuration, and data sovereignty controls
import React, { useState } from 'react';
import {
  Settings,
  Languages,
  Cpu,
  Download,
  Upload,
  Trash2,
  X,
  Volume2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { soundEffects } from '../../services/soundEffects';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    displayMode,
    setDisplayMode,
    romajiEnabled,
    setRomajiEnabled,
    furiganaEnabled,
    setFuriganaEnabled,
    soundEnabled,
    setSoundEnabled
  } = useLearning();

  const [aiProvider, setAiProvider] = useState<'builtin' | 'gemini'>(
    aiService.getConfig().provider === 'gemini' ? 'gemini' : 'builtin'
  );
  const [apiKey, setApiKey] = useState<string>(aiService.getConfig().apiKey || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [confirmPurge, setConfirmPurge] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveAISettings = () => {
    aiService.saveConfig({
      provider: aiProvider,
      apiKey: apiKey.trim() || undefined
    });
    setSaveSuccess(true);
    soundEffects.playCorrect();
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportBackup = () => {
    const backupJson = storageService.exportFullBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kai_personal_backup_${Date.now()}.json`;
    a.click();
    soundEffects.playCorrect();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const success = storageService.importBackup(reader.result as string);
        if (success) {
          soundEffects.playLevelUp();
          window.location.reload();
        } else {
          soundEffects.playWrong();
          alert('Invalid backup file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePurge = () => {
    storageService.purgeAllUserData();
    soundEffects.playWrong();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-kai-muted hover:text-kai-ink transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 border-b border-kai-border pb-3">
          <Settings size={20} className="text-kai-vermilion" />
          <h2 className="text-lg font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
            KAI Preferences & Configuration
          </h2>
        </div>

        {/* 1. Language & Display */}
        <div className="space-y-3">
          <span className="text-2xs font-mono font-bold uppercase text-kai-muted tracking-wider">
            Language Display Mode
          </span>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'bilingual', label: 'Bilingual (ద్విభాషా)' },
              { id: 'english', label: 'English Only' },
              { id: 'telugu', label: 'తెలుగు (Telugu)' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setDisplayMode(m.id as any)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  displayMode === m.id
                    ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion'
                    : 'bg-stone-50 dark:bg-kai-dark-bg border-kai-border text-kai-muted hover:text-kai-ink'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-kai-ink dark:text-white">Romaji Pronunciation Guide</span>
            <input
              type="checkbox"
              checked={romajiEnabled}
              onChange={(e) => setRomajiEnabled(e.target.checked)}
              className="accent-kai-vermilion w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-kai-ink dark:text-white">Japanese Ruby Furigana</span>
            <input
              type="checkbox"
              checked={furiganaEnabled}
              onChange={(e) => setFuriganaEnabled(e.target.checked)}
              className="accent-kai-vermilion w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* 2. AI Tutor Engine Provider */}
        <div className="space-y-3 pt-3 border-t border-kai-border">
          <div className="flex items-center gap-1.5 font-bold text-xs text-kai-ink dark:text-white">
            <Cpu size={15} className="text-kai-indigo" />
            <span>AI Tutor Provider Configuration</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="aiProvider"
                  value="builtin"
                  checked={aiProvider === 'builtin'}
                  onChange={() => setAiProvider('builtin')}
                  className="accent-kai-vermilion"
                />
                <span>Built-in Pedagogical Expert (Zero API key needed)</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="aiProvider"
                  value="gemini"
                  checked={aiProvider === 'gemini'}
                  onChange={() => setAiProvider('gemini')}
                  className="accent-kai-vermilion"
                />
                <span>Google Gemini API (Live AI Generation)</span>
              </label>
            </div>
          </div>

          {aiProvider === 'gemini' && (
            <div className="space-y-1.5 pt-1">
              <label className="text-3xs font-mono text-kai-muted">
                Gemini API Key (stored exclusively on client local storage)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs font-mono"
              />
            </div>
          )}

          <button
            onClick={handleSaveAISettings}
            className="px-4 py-2 rounded-xl bg-kai-indigo hover:bg-kai-indigo-dark text-white text-xs font-semibold shadow-sm"
          >
            {saveSuccess ? 'Saved ✓' : 'Save AI Configuration'}
          </button>
        </div>

        {/* 3. Data Sovereignty & Portability */}
        <div className="space-y-3 pt-3 border-t border-kai-border">
          <span className="text-2xs font-mono font-bold uppercase text-kai-muted tracking-wider">
            Data Sovereignty & Backups
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-kai-dark-bg text-kai-ink dark:text-white border border-kai-border text-xs font-semibold flex items-center gap-1.5 hover:border-kai-vermilion transition-colors"
            >
              <Download size={13} />
              <span>Export Full JSON Backup</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-kai-dark-bg text-kai-ink dark:text-white border border-kai-border text-xs font-semibold flex items-center gap-1.5 hover:border-kai-vermilion transition-colors cursor-pointer">
              <Upload size={13} />
              <span>Import Backup</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>

        {/* 4. Danger Zone: Data Purge */}
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-2">
          <div className="flex items-center gap-1.5 text-red-900 dark:text-red-300 font-bold text-xs">
            <ShieldAlert size={14} />
            <span>Permanent Data Purge</span>
          </div>

          <p className="text-3xs text-red-900/80 dark:text-red-300/80">
            Complies with privacy deletion requirements. Wipes all locally stored flashcards, attempts, voice history, and mistakes.
          </p>

          {!confirmPurge ? (
            <button
              onClick={() => setConfirmPurge(true)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-2xs font-bold"
            >
              Purge All Learning History
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePurge}
                className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-2xs font-bold animate-pulse"
              >
                Confirm Delete Everything
              </button>
              <button
                onClick={() => setConfirmPurge(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-800 text-2xs font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
