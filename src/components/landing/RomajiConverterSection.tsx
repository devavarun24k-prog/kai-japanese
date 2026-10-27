// src/components/landing/RomajiConverterSection.tsx
// Interactive Live Romaji -> Hiragana & Katakana Converter Section
import React, { useState, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import * as wanakana from 'wanakana';
import { Sparkles, ArrowRight, Volume2, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { audioService } from '../../services/audioService';

interface PresetWord {
  romaji: string;
  meaningEn: string;
  meaningTe: string;
  emoji: string;
}

const PRESET_CHIPS: PresetWord[] = [
  { romaji: 'sakura', meaningEn: 'Cherry Blossom', meaningTe: 'చెర్రీ పువ్వు', emoji: '🌸' },
  { romaji: 'arigatou', meaningEn: 'Thank You', meaningTe: 'ధన్యవాదాలు', emoji: '🙏' },
  { romaji: 'konnichiwa', meaningEn: 'Hello / Good Afternoon', meaningTe: 'నమస్కారం', emoji: '✨' }
];

export const RomajiConverterSection: React.FC = () => {
  const inputId = useId();
  const shouldReduceMotion = useReducedMotion();
  const [inputText, setInputText] = useState<string>('sakura');

  const trimmed = inputText.trim() || 'sakura';
  const hiraganaResult = wanakana.toHiragana(trimmed);
  const katakanaResult = wanakana.toKatakana(trimmed);

  const matchedPreset = PRESET_CHIPS.find(
    (p) => p.romaji.toLowerCase() === inputText.trim().toLowerCase()
  );

  const handleSelectChip = (preset: PresetWord) => {
    soundEffects.playClick();
    setInputText(preset.romaji);
  };

  const playVoice = () => {
    soundEffects.playClick();
    audioService.speak(hiraganaResult, { rate: 0.9 });
  };

  return (
    <section
      id="romaji-converter"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 pointer-events-auto"
    >
      <div className="max-w-3xl mx-auto w-full text-center relative z-10">
        {/* Chapter Subheading */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/70 border border-[#F4C26B]/40 backdrop-blur-md shadow-[0_0_15px_rgba(244,194,107,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-pulse" />
            <span className="font-mono text-2xs uppercase tracking-[0.25em] text-[#F4C26B]">
              Interactive Voice &amp; Kana Engine (音と仮名)
            </span>
          </div>

          <h2 className="font-shippori text-3xl sm:text-5xl text-[#F5EFE6] font-normal tracking-tight">
            Type in Romaji. <span className="text-[#F4C26B]">See Instant Japanese.</span>
          </h2>

          <p className="font-serif_jp text-sm sm:text-base text-stone-400 max-w-xl">
            Test how English phonetics seamlessly transform into authentic Hiragana and Katakana stroke characters in real-time.
          </p>
        </div>

        {/* 3D Glass Converter Card */}
        <div className="relative rounded-3xl bg-stone-950/80 border border-[#F4C26B]/30 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(244,194,107,0.12)] p-6 sm:p-10 text-left overflow-hidden">
          {/* Subtle gold line accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F4C26B]/60 to-transparent" />

          {/* Top Stage: Live Kana Visualizer */}
          <div className="relative py-8 px-6 rounded-2xl bg-stone-900/60 border border-white/10 flex flex-col items-center justify-center min-h-[160px] text-center overflow-hidden mb-8">
            {/* Watermark kanji */}
            <span className="absolute text-8xl sm:text-9xl font-shippori font-bold text-white/[0.03] pointer-events-none select-none">
              仮名
            </span>

            {/* Hiragana Main Display */}
            <div className="relative z-10 flex items-center justify-center flex-wrap gap-2 my-2">
              <AnimatePresence mode="popLayout">
                {Array.from(hiraganaResult).map((char, idx) => (
                  <motion.span
                    key={`${char}-${idx}`}
                    initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="font-shippori text-5xl sm:text-6xl md:text-7xl font-bold text-[#E63946] drop-shadow-[0_0_25px_rgba(230,57,70,0.4)] inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            {/* Katakana Sub-Display & Pronunciation */}
            <div className="relative z-10 mt-3 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm font-mono text-stone-300">
              <span className="px-2.5 py-0.5 rounded-md bg-stone-950/80 border border-white/10 text-stone-400">
                Romaji: <strong className="text-white font-normal">[{trimmed}]</strong>
              </span>

              <span className="px-2.5 py-0.5 rounded-md bg-stone-950/80 border border-white/10 text-stone-400">
                Katakana: <strong className="text-[#F4C26B] font-shippori text-base">{katakanaResult}</strong>
              </span>

              {/* Audio Pronunciation Button */}
              <button
                type="button"
                onClick={playVoice}
                title="Play authentic Japanese pronunciation"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E63946]/20 border border-[#E63946]/50 text-white hover:bg-[#E63946] transition-all cursor-pointer shadow-sm"
              >
                <Volume2 size={14} className="text-[#F4C26B]" />
                <span className="text-2xs font-mono uppercase tracking-wider">Listen</span>
              </button>
            </div>

            {/* Meaning & Telugu Pronunciation Guide if matched */}
            {matchedPreset && (
              <div className="relative z-10 mt-3 flex flex-col items-center gap-0.5">
                <span className="text-xs font-serif_jp text-stone-300 font-medium">
                  {matchedPreset.emoji} {matchedPreset.meaningEn}
                </span>
                <span className="text-xs font-serif_jp text-[#F4C26B]/90 font-light">
                  {matchedPreset.meaningTe}
                </span>
              </div>
            )}
          </div>

          {/* Input Control Field */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <label
                htmlFor={inputId}
                className="block text-2xs font-mono uppercase tracking-widest text-[#F4C26B] font-semibold"
              >
                Type any Romaji / English sound:
              </label>
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-3xs font-mono text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={10} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                id={inputId}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type 'sakura', 'arigatou', 'konnichiwa', 'sensei'..."
                className="w-full px-5 py-3.5 rounded-2xl bg-stone-900/90 border border-white/15 text-sm sm:text-base text-white placeholder-stone-600 focus:outline-none focus:border-[#F4C26B] shadow-inner font-mono transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Sparkles size={16} className="text-[#F4C26B]/60" />
              </div>
            </div>
          </div>

          {/* Clickable Preset Chips */}
          <div className="space-y-2">
            <span className="text-3xs font-mono uppercase tracking-wider text-stone-400 block">
              Quick Test Examples:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_CHIPS.map((chip) => {
                const isSelected = inputText.toLowerCase() === chip.romaji.toLowerCase();
                return (
                  <button
                    key={chip.romaji}
                    type="button"
                    onClick={() => handleSelectChip(chip)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E63946] text-white font-bold shadow-[0_0_15px_rgba(230,57,70,0.4)] scale-105 border border-transparent'
                        : 'bg-stone-900/80 border border-white/10 text-stone-300 hover:border-[#F4C26B]/50 hover:text-white'
                    }`}
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.romaji}</span>
                    <span className="opacity-70 text-2xs font-shippori">
                      ({wanakana.toHiragana(chip.romaji)})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
