// src/features/dictation/DictationStudio.tsx
// Main coordinator for Japanese Dictation Studio
import React, { useState, useMemo } from 'react';
import { DictationConfig, DictationAnswerRecord } from './types';
import { DictationSetup } from './DictationSetup';
import { DictationScreenMode } from './DictationScreenMode';
import { DictationPaperMode } from './DictationPaperMode';
import { DictationResults } from './DictationResults';
import { LearnedSetDebugger } from './debug/LearnedSetDebugger';
import { characterMasteryService } from '../learning/characterMastery';
import { N5_KANA_WORDS } from '../../data/vocab/n5KanaWords';
import { buildPool, pickWords } from './eligibility';
import { storageService } from '../../services/storageService';
import { useLearning } from '../../context/LearningContext';

type DictationStep = 'setup' | 'session' | 'results' | 'debug';

export const DictationStudio: React.FC = () => {
  const { setActiveSection } = useLearning();
  const [step, setStep] = useState<DictationStep>('setup');
  const [config, setConfig] = useState<DictationConfig>({
    mode: 'screen',
    questionCount: 10,
    showLengthHint: false,
    strictMode: false
  });
  const [activeWords, setActiveWords] = useState<typeof N5_KANA_WORDS>([]);
  const [sessionRecords, setSessionRecords] = useState<DictationAnswerRecord[]>([]);

  const handleStartSession = (selectedConfig: DictationConfig) => {
    setConfig(selectedConfig);
    const learned = characterMasteryService.getLearnedGlyphs();
    const pool = buildPool(N5_KANA_WORDS, learned);
    const cards = storageService.getCards();
    const selected = pickWords(pool, selectedConfig.questionCount, cards);

    setActiveWords(selected);
    setStep('session');
  };

  const handleFinishSession = (records: DictationAnswerRecord[]) => {
    setSessionRecords(records);
    setStep('results');
  };

  const handleRestart = () => {
    setStep('setup');
  };

  const handleExitToDashboard = () => {
    setActiveSection('dashboard');
  };

  return (
    <div className="w-full py-4">
      {step === 'setup' && (
        <DictationSetup
          onStartSession={handleStartSession}
          onOpenDebugger={() => setStep('debug')}
        />
      )}

      {step === 'session' && config.mode === 'screen' && (
        <DictationScreenMode
          words={activeWords}
          config={config}
          onFinishSession={handleFinishSession}
          onExit={handleRestart}
        />
      )}

      {step === 'session' && config.mode === 'paper' && (
        <DictationPaperMode
          words={activeWords}
          onFinishSession={handleFinishSession}
          onExit={handleRestart}
        />
      )}

      {step === 'results' && (
        <DictationResults
          records={sessionRecords}
          onRestart={handleRestart}
          onExit={handleExitToDashboard}
        />
      )}

      {step === 'debug' && import.meta.env.DEV && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStep('setup')}
            className="text-xs font-mono text-kai-vermilion hover:underline flex items-center gap-1"
          >
            ← Back to Dictation Setup
          </button>
          <LearnedSetDebugger />
        </div>
      )}
    </div>
  );
};
