// src/components/landing/LiveWanakanaDemo.tsx
// Live Romaji-to-Kana converter demo powered by Wanakana with ink-in animations,
// full touch-keyboard compatibility, and preset starter chips
import React, { useState, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import * as wanakana from 'wanakana';
import { Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { soundEffects } from '../../services/soundEffects';

interface PresetWord {
  romaji: string;
  kana: string;
  meaningEn: string;
  meaningTe: string;
  emoji: string;
}

const PRESET_WORDS: PresetWord[] = [
  { romaji: 'sakura', kana: 'さくら', meaningEn: 'Cherry Blossom', meaningTe: 'చెర్రీ పువ్వు', emoji: '🌸' },
  { romaji: 'arigatou', kana: 'ありがとう', meaningEn: 'Thank You', meaningTe: 'ధన్యవాదాలు', emoji: '🙏' },
  { romaji: 'tokyo', kana: 'とうきょう', meaningEn: 'Tokyo', meaningTe: 'టోక్యో', emoji: '🗼' },
  { romaji: 'kawaii', kana: 'かわいい', meaningEn: 'Cute / Adorable', meaningTe: 'ముద్దుగా', emoji: '✨' },
  { romaji: 'oishii', kana: 'おいしい', meaningEn: 'Delicious', meaningTe: 'రుచికరమైన', emoji: '🍱' }
];

export const LiveWanakanaDemo: React.FC = () => {
  const inputId = useId();
  const shouldReduceMotion = useReducedMotion();
  const [inputText, setInputText] = useState<string>('sakura');
  const [activePreset, setActivePreset] = useState<PresetWord>(PRESET_WORDS[0]);

  // Convert input in real-time to Hiragana
  const kanaResult = wanakana.toHiragana(inputText.trim() || 'sakura');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputText(raw);

    const match = PRESET_WORDS.find((p) => p.romaji.toLowerCase() === raw.trim().toLowerCase());
    if (match) {
      setActivePreset(match);
    } else {
      setActivePreset({
        romaji: raw || 'custom',
        kana: wanakana.toHiragana(raw || ''),
        meaningEn: 'Live Custom Translation',
        meaningTe: 'ప్రత్యక్ష అనువాదం',
        emoji: '✍️'
      });
    }
  };

  const handleSelectPreset = (preset: PresetWord) => {
    soundEffects.playClick();
    setInputText(preset.romaji);
    setActivePreset(preset);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/95 dark:bg-kai-dark-card/95 border-2 border-kai-border/90 dark:border-kai-dark-border shadow-washi-lg p-5 sm:p-7 space-y-5 text-kai-ink dark:text-white backdrop-blur-md select-none transition-all">
      {/* Header Pill */}
      <div className="flex items-center justify-between border-b border-kai-border/70 dark:border-kai-dark-border/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-kai-vermilion animate-pulse" />
          <span className="text-3xs font-mono font-bold uppercase tracking-wider text-kai-muted dark:text-kai-dark-muted">
            Live Romaji &rarr; Hiragana Engine
          </span>
        </div>
        <span className="text-3xs font-mono text-kai-gold font-semibold flex items-center gap-1">
          <Sparkles size={11} />
          <span>Interactive</span>
        </span>
      </div>

      {/* Main Kana Display Stage with Ink-in Animation */}
      <div className="relative py-4 px-6 rounded-2xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border/60 dark:border-kai-dark-border/60 flex flex-col items-center justify-center min-h-[140px] text-center overflow-hidden">
        {/* Subtle Watermark Mon */}
        <span className="absolute text-7xl font-serif_jp font-bold text-kai-ink/[0.03] dark:text-white/[0.03] pointer-events-none select-none">
          日本語
        </span>

        {/* Ink-in animated Kana characters */}
        <div className="relative z-10 flex items-center justify-center flex-wrap gap-1.5 my-1">
          <AnimatePresence mode="popLayout">
            {Array.from(kanaResult).map((char, idx) => (
              <motion.span
                key={`${char}-${idx}`}
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl font-serif_jp font-bold text-kai-vermilion drop-shadow-sm inline-block"
              >
                {char}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Pronunciation & Translation guide */}
        <div className="relative z-10 mt-2 flex items-center justify-center gap-3 text-xs">
          <span className="font-mono text-kai-muted dark:text-kai-dark-muted font-medium">
            [{inputText.trim() || 'sakura'}]
          </span>
          <span className="text-kai-border dark:text-kai-dark-border">•</span>
          <span className="font-semibold text-kai-ink dark:text-stone-200">
            {activePreset.meaningEn}
          </span>
          <span className="text-kai-border dark:text-kai-dark-border">•</span>
          <AudioButton text={kanaResult} size="sm" />
        </div>

        {/* Telugu Phonetic Annotation */}
        <p className="relative z-10 font-telugu text-3xs text-[#B99A60] mt-1">
          {activePreset.meaningTe}
        </p>
      </div>

      {/* Input Box with Floating Guidance */}
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-2xs font-mono font-bold uppercase text-kai-muted dark:text-kai-dark-muted text-left"
        >
          Type any English / Romaji sound:
        </label>
        <div className="relative">
          <input
            id={inputId}
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type 'sakura', 'arigatou', 'ohayou'..."
            className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-surface border border-kai-border dark:border-kai-dark-border text-xs sm:text-sm text-kai-ink dark:text-white placeholder:text-kai-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-kai-vermilion shadow-inner transition-all font-mono"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-3xs font-mono text-kai-muted hover:text-kai-vermilion px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-700/60"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Tap Starter Chips (Friendly for Touch Screens) */}
      <div className="space-y-1.5 text-left">
        <span className="text-3xs font-mono text-kai-muted dark:text-kai-dark-muted uppercase block">
          Or tap to try instant examples:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_WORDS.map((preset) => (
            <button
              key={preset.romaji}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm ${
                inputText.toLowerCase() === preset.romaji.toLowerCase()
                  ? 'bg-kai-vermilion text-white font-bold shadow-vermilion scale-105'
                  : 'bg-stone-100 dark:bg-kai-dark-surface border border-kai-border dark:border-kai-dark-border text-kai-ink dark:text-stone-300 hover:border-kai-vermilion/50'
              }`}
            >
              <span>{preset.emoji}</span>
              <span>{preset.romaji}</span>
              <span className="opacity-70 text-3xs font-japanese">({preset.kana})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
