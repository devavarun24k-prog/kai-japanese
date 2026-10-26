// src/components/landing/SceneHiraganaWashi.tsx
// Scene 2: Discover the Japanese Writing System (文字の発見 — Hiragana)
// Textured washi-paper composition, brush calligraphy animations, authentic characters,
// native audio pronunciation, Telugu phonetics, and direct portal to Kana Academy.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { WashiSeparator, JapaneseCloud, CalligraphyBrushStroke } from './OrnamentalElements';
import { audioService } from '../../services/audioService';
import { soundEffects } from '../../services/soundEffects';

interface HiraganaItem {
  kana: string;
  romaji: string;
  telugu: string;
  soundGuide: string;
  strokeCount: number;
  mnemonic: string;
  exampleWord: {
    word: string;
    reading: string;
    english: string;
    telugu: string;
  };
}

const HIRAGANA_VOWELS: HiraganaItem[] = [
  {
    kana: 'あ',
    romaji: 'a',
    telugu: 'ఆ',
    soundGuide: 'Ah (as in father)',
    strokeCount: 3,
    mnemonic: 'Resembles an apple with a stem and rounded cheek.',
    exampleWord: { word: 'あさ', reading: 'asa', english: 'Morning', telugu: 'ఉదయం' }
  },
  {
    kana: 'い',
    romaji: 'i',
    telugu: 'ఇ',
    soundGuide: 'Ee (as in feet)',
    strokeCount: 2,
    mnemonic: 'Two bamboo reeds swaying gracefully in the wind.',
    exampleWord: { word: 'いぬ', reading: 'inu', english: 'Dog', telugu: 'కుక్క' }
  },
  {
    kana: 'う',
    romaji: 'u',
    telugu: 'ఉ',
    soundGuide: 'Oo (as in flute)',
    strokeCount: 2,
    mnemonic: 'An archer drawing back a curved bow.',
    exampleWord: { word: 'うみ', reading: 'umi', english: 'Ocean / Sea', telugu: 'సముద్రం' }
  },
  {
    kana: 'え',
    romaji: 'e',
    telugu: 'ఎ',
    soundGuide: 'Eh (as in pet)',
    strokeCount: 2,
    mnemonic: 'An energetic bird lifting its wings for flight.',
    exampleWord: { word: 'えき', reading: 'eki', english: 'Train Station', telugu: 'రైల్వే స్టేషన్' }
  },
  {
    kana: 'お',
    romaji: 'o',
    telugu: 'ఒ',
    soundGuide: 'Oh (as in song)',
    strokeCount: 3,
    mnemonic: 'A ball dropped on a golf green.',
    exampleWord: { word: 'お茶', reading: 'ocha', english: 'Green Tea', telugu: 'గ్రీన్ టీ' }
  },
  {
    kana: 'か',
    romaji: 'ka',
    telugu: 'కా',
    soundGuide: 'Kah (as in karma)',
    strokeCount: 3,
    mnemonic: 'A blade cutting through bamboo with vigor.',
    exampleWord: { word: 'かさ', reading: 'kasa', english: 'Umbrella', telugu: 'గొడుగు' }
  },
  {
    kana: 'さ',
    romaji: 'sa',
    telugu: 'సా',
    soundGuide: 'Sah (as in sakura)',
    strokeCount: 3,
    mnemonic: 'A delicate blossoming sakura flower on a branch.',
    exampleWord: { word: 'さくら', reading: 'sakura', english: 'Cherry Blossom', telugu: 'చెర్రీ పువ్వు' }
  },
  {
    kana: 'た',
    romaji: 'ta',
    telugu: 'తా',
    soundGuide: 'Tah (as in target)',
    strokeCount: 4,
    mnemonic: 'The English letters "ta" woven together.',
    exampleWord: { word: 'たべる', reading: 'taberu', english: 'To eat', telugu: 'తినడం' }
  }
];

interface SceneHiraganaWashiProps {
  onGoToKanaAcademy: () => void;
}

export const SceneHiraganaWashi: React.FC<SceneHiraganaWashiProps> = ({ onGoToKanaAcademy }) => {
  const [selectedKana, setSelectedKana] = useState<HiraganaItem>(HIRAGANA_VOWELS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const playKanaAudio = async (text: string) => {
    soundEffects.playClick();
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await audioService.speak(text, {
      rate: 0.85,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleSelectKana = (item: HiraganaItem) => {
    setSelectedKana(item);
    playKanaAudio(item.kana);
  };

  return (
    <section className="relative w-full py-20 sm:py-28 bg-[#FAF6EC] text-[#171918] overflow-hidden">
      {/* Torn Washi Paper Top Separator entering from Scene 1 */}
      <WashiSeparator position="top" fillColor="#FAF6EC" className="absolute top-0 inset-x-0" />

      {/* Background Washi Paper Texture & Sumi-e Ink Washes */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Fine washi fiber grid effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#C59B27_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-25" />
        {/* Soft Sumi ink wash pools in corners */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(26,24,23,0.06),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,74,58,0.05),transparent_70%)] blur-2xl" />
      </div>

      {/* Subtle traditional Japanese clouds in background */}
      <div className="absolute top-12 left-6 pointer-events-none opacity-15">
        <JapaneseCloud className="w-64" fillColor="#FAF6EC" strokeColor="#171918" />
      </div>
      <div className="absolute bottom-16 right-8 pointer-events-none opacity-15">
        <JapaneseCloud className="w-72" fillColor="#FAF6EC" strokeColor="#171918" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-12">
        {/* Section Title & Story Introduction */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101722]/5 border border-[#B99A60]/40 text-xs font-mono text-[#A84A3A]">
            <Sparkles size={13} />
            <span>第二景 • SCENE TWO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-serif_jp text-[#171918] tracking-tight">
            ひらがなの世界 — The Foundation
          </h2>

          <p className="text-sm sm:text-base text-[#635F59] font-sans leading-relaxed">
            Japanese begins with 46 elegant syllables. Watch the ink flow, hear the authentic resonance, and build your confidence stroke by stroke.
          </p>

          <CalligraphyBrushStroke className="w-48 mx-auto" color="#A84A3A" />
        </div>

        {/* Interactive Hiragana Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Character Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#635F59] font-bold">
                基礎五十音 • Foundation Syllabary
              </span>
              <span className="text-2xs text-[#B99A60] font-mono">Click to hear pronunciation</span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {HIRAGANA_VOWELS.map((item) => {
                const isSelected = selectedKana.kana === item.kana;
                return (
                  <motion.button
                    key={item.kana}
                    onClick={() => handleSelectKana(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-4 sm:p-5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 shadow-sm overflow-hidden ${
                      isSelected
                        ? 'bg-[#101722] text-[#F0E5CE] border-[#B99A60] shadow-md ring-2 ring-[#B99A60]/40'
                        : 'bg-white hover:bg-[#FAF0DC] text-[#171918] border-[#E8E3D9]'
                    }`}
                  >
                    {/* Character */}
                    <span className="text-3xl sm:text-4xl font-serif_jp font-bold">
                      {item.kana}
                    </span>

                    {/* Romaji & Telugu Guide */}
                    <div className="flex items-center gap-1.5 text-2xs font-mono">
                      <span className={isSelected ? 'text-[#B99A60] font-bold' : 'text-[#A84A3A] font-bold'}>
                        {item.romaji}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className={`font-telugu ${isSelected ? 'text-[#F0E5CE]/80' : 'text-[#635F59]'}`}>
                        {item.telugu}
                      </span>
                    </div>

                    {/* Active Golden Corner Accent */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B99A60] animate-ping" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <p className="text-2xs text-[#635F59] font-sans italic">
              ※ English, Romaji, and Telugu phonetic guides are integrated into every syllable to ensure clear natural pronunciation.
            </p>
          </div>

          {/* Right Column: Detailed Animated Calligraphy Card */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedKana.kana}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E3D9] shadow-xl space-y-6 relative overflow-hidden"
              >
                {/* Traditional washi watermark */}
                <div className="absolute -top-10 -right-10 text-9xl font-serif_jp text-[#FAF0DC] pointer-events-none select-none font-bold opacity-60">
                  {selectedKana.kana}
                </div>

                {/* Character Header & Audio */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#101722] to-[#1A2638] text-[#F0E5CE] flex items-center justify-center font-serif_jp font-bold text-5xl shadow-md border border-[#B99A60]/40">
                      {selectedKana.kana}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono text-[#A84A3A]">
                          /{selectedKana.romaji}/
                        </span>
                        <span className="text-sm font-telugu font-bold text-[#171918] px-2 py-0.5 rounded bg-[#FAF0DC] border border-[#E8E3D9]">
                          {selectedKana.telugu}
                        </span>
                      </div>
                      <p className="text-xs text-[#635F59] font-mono mt-0.5">
                        {selectedKana.soundGuide}
                      </p>
                    </div>
                  </div>

                  {/* Play Audio Button */}
                  <button
                    onClick={() => playKanaAudio(selectedKana.kana)}
                    disabled={isPlayingAudio}
                    className="p-3 rounded-2xl bg-[#A84A3A] hover:bg-[#8C3A2D] text-white shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    title="Hear native pronunciation"
                  >
                    <Volume2 size={18} className={isPlayingAudio ? 'animate-pulse' : ''} />
                    <span className="text-xs font-mono hidden sm:inline">音声</span>
                  </button>
                </div>

                {/* Visual Mnemonic & Stroke Insight */}
                <div className="space-y-3 relative z-10 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF6EC] border border-[#E8E3D9] space-y-1">
                    <span className="font-bold text-[#A84A3A] font-mono uppercase text-3xs flex items-center gap-1">
                      <Sparkles size={11} /> Memory Mnemonic
                    </span>
                    <p className="text-[#171918] font-sans leading-relaxed">
                      {selectedKana.mnemonic}
                    </p>
                  </div>

                  {/* Example Word */}
                  <div className="p-3.5 rounded-xl bg-[#101722] text-[#F0E5CE] space-y-1.5">
                    <span className="font-bold text-[#B99A60] font-mono uppercase text-3xs flex items-center gap-1">
                      <BookOpen size={11} /> Example Vocabulary • 語彙
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-serif_jp">{selectedKana.exampleWord.word}</span>
                        <span className="text-xs font-mono text-[#B99A60]">[{selectedKana.exampleWord.reading}]</span>
                      </div>
                      <button
                        onClick={() => playKanaAudio(selectedKana.exampleWord.word)}
                        className="text-2xs text-[#F0E5CE] hover:text-[#B99A60] flex items-center gap-1 font-mono"
                      >
                        <Volume2 size={12} /> Play
                      </button>
                    </div>
                    <div className="text-2xs text-[#F0E5CE]/80 font-sans flex items-center gap-2">
                      <span>{selectedKana.exampleWord.english}</span>
                      <span>•</span>
                      <span className="font-telugu text-[#B99A60]">{selectedKana.exampleWord.telugu}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action: Jump to Kana Academy */}
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onGoToKanaAcademy();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#101722] hover:bg-[#1A2638] text-[#F0E5CE] border border-[#B99A60]/60 font-serif_jp font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
                >
                  <Layers size={15} className="text-[#B99A60]" />
                  <span>かな道場を開く • Open Full Kana Academy</span>
                  <ArrowRight size={14} className="text-[#A84A3A]" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
