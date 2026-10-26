// src/components/landing/SceneJapaneseStreet.tsx
// Scene 3: Experience Japanese Everyday Life (日常の情景 — Real-World Street & Phrases)
// Illustrated traditional Japanese evening streetscape with glowing lanterns,
// interactive educational phrase discovery hotspots, audio, and cultural context.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, MapPin, Coffee, Utensils, Compass, MessageCircleHeart } from 'lucide-react';
import { JapaneseCloud, KaiMonCrest } from './OrnamentalElements';
import { audioService } from '../../services/audioService';
import { soundEffects } from '../../services/soundEffects';

interface StreetPhrase {
  id: string;
  japanese: string;
  reading: string;
  romaji: string;
  english: string;
  telugu: string;
  situation: string;
  icon: React.ElementType;
  hotspotPosition: { top: string; left: string };
  culturalTip: string;
}

const STREET_PHRASES: StreetPhrase[] = [
  {
    id: 'ordering',
    japanese: 'これをください',
    reading: 'これをください',
    romaji: 'Kore o kudasai',
    english: 'Please give me this.',
    telugu: 'దయచేసి ఇది ఇవ్వండి.',
    situation: 'Ordering Food in Izakaya or Ramen Shop',
    icon: Utensils,
    hotspotPosition: { top: '56%', left: '22%' },
    culturalTip: 'Point gently with your open hand or index finger at the menu item while saying this phrase.'
  },
  {
    id: 'greeting',
    japanese: 'こんばんは',
    reading: 'こんばんは',
    romaji: 'Konbanwa',
    english: 'Good evening.',
    telugu: 'శుభ సాయంత్రం.',
    situation: 'Greeting Neighbors & Shopkeepers at Dusk',
    icon: Coffee,
    hotspotPosition: { top: '38%', left: '46%' },
    culturalTip: 'Notice the particle "は" at the end is pronounced "wa", not "ha", reflecting historical grammar.'
  },
  {
    id: 'directions',
    japanese: 'すみません、駅はどこですか？',
    reading: 'すみません、えきはどこですか？',
    romaji: 'Sumimasen, eki wa doko desu ka?',
    english: 'Excuse me, where is the station?',
    telugu: 'క్షమించండి, రైల్వే స్టేషన్ ఎక్కడ ఉంది?',
    situation: 'Asking for Directions in the City',
    icon: Compass,
    hotspotPosition: { top: '52%', left: '74%' },
    culturalTip: '"Sumimasen" is the Swiss Army knife of Japanese politeness: it means excuse me, pardon me, and thank you.'
  },
  {
    id: 'gratitude',
    japanese: 'ありがとうございます',
    reading: 'ありがとうございます',
    romaji: 'Arigatou gozaimasu',
    english: 'Thank you very much.',
    telugu: 'మీకు చాలా ధన్యవాదాలు.',
    situation: 'Expressing Polite Appreciation Everywhere',
    icon: MessageCircleHeart,
    hotspotPosition: { top: '34%', left: '86%' },
    culturalTip: 'Add "gozaimasu" for polite speech with strangers, teachers, and shop staff to sound natural and respectful.'
  }
];

export const SceneJapaneseStreet: React.FC = () => {
  const [activePhrase, setActivePhrase] = useState<StreetPhrase>(STREET_PHRASES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handlePlayPhrase = async (phrase: StreetPhrase) => {
    soundEffects.playClick();
    setActivePhrase(phrase);
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await audioService.speak(phrase.japanese, {
      rate: 0.9,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  return (
    <section className="relative w-full py-20 sm:py-28 bg-[#121926] text-[#F0E5CE] overflow-hidden select-none">
      {/* Background Japanese Cloud accents */}
      <div className="absolute top-8 left-12 opacity-20 pointer-events-none">
        <JapaneseCloud className="w-80" fillColor="#0B0F19" strokeColor="#B99A60" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none">
        <JapaneseCloud className="w-96" fillColor="#0B0F19" strokeColor="#B99A60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2638] border border-[#B99A60]/40 text-xs font-mono text-[#B99A60]">
            <Sparkles size={13} className="text-[#A84A3A]" />
            <span>第三景 • SCENE THREE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-serif_jp text-[#F0E5CE] tracking-tight">
            日常の情景 — Japanese in Everyday Life
          </h2>

          <p className="text-sm sm:text-base text-[#F0E5CE]/80 font-sans leading-relaxed">
            Step onto an illuminated Kyoto street. Tap any glowing lantern to discover essential phrases that bring language to life in real situations.
          </p>
        </div>

        {/* =========================================================================
            ILLUSTRATED JAPANESE STREETSCAPE WITH INTERACTIVE HOTSPOTS
            ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden border border-[#B99A60]/40 shadow-2xl bg-[#0B0F18] aspect-[16/9] sm:aspect-[21/9] min-h-[380px]">
          {/* Illustrated SVG Streetscape */}
          <svg
            viewBox="0 0 1200 500"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Night Sky with warm ambient street gradient */}
            <rect width="1200" height="500" fill="#0C1320" />

            {/* Distant Town Silhouette & Tile Roofs (瓦屋根) */}
            <path
              d="M 0 280 L 120 250 L 260 270 L 400 240 L 580 270 L 740 230 L 920 260 L 1080 235 L 1200 270 L 1200 500 L 0 500 Z"
              fill="#101929"
            />

            {/* Midground Machiya (町家) Traditional Wooden Houses */}
            {/* Building 1 (Left Ramen / Izakaya Shop) */}
            <g transform="translate(140, 160)">
              {/* Roof */}
              <path d="M -30 90 L 180 90 L 150 50 L 0 50 Z" fill="#070A10" stroke="#B99A60" strokeWidth="0.8" />
              {/* Wooden Facade & Lattice (格子) */}
              <rect x="0" y="90" width="150" height="200" fill="#141E2F" />
              <rect x="15" y="110" width="120" height="90" fill="#1A283E" stroke="#B99A60" strokeWidth="0.6" strokeDasharray="4 4" />
              {/* Warm Indoor Light leaking through paper shoji screen */}
              <rect x="25" y="120" width="100" height="70" fill="#F0E5CE" opacity="0.3" filter="drop-shadow(0 0 10px #B99A60)" />
              {/* Red Hanging Noren Curtains (暖簾) */}
              <path d="M 20 200 L 130 200 L 130 250 Q 75 240 20 250 Z" fill="#A84A3A" />
              <text x="75" y="235" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontFamily="serif" fontWeight="bold">
                拉麺
              </text>
            </g>

            {/* Building 2 (Center Machiya with Wooden Veranda) */}
            <g transform="translate(440, 130)">
              <path d="M -40 120 L 240 120 L 200 70 L 0 70 Z" fill="#070A10" stroke="#B99A60" strokeWidth="0.8" />
              <rect x="0" y="120" width="200" height="230" fill="#111824" />
              <rect x="20" y="140" width="160" height="110" fill="#162234" stroke="#B99A60" strokeWidth="0.8" />
              {/* Shoji glow */}
              <rect x="30" y="150" width="140" height="90" fill="#F0E5CE" opacity="0.45" filter="drop-shadow(0 0 15px #B99A60)" />
              {/* Wooden Slats (格子) */}
              {[45, 65, 85, 105, 125, 145].map((x) => (
                <line key={x} x1={x} y1="150" x2={x} y2="240" stroke="#070A10" strokeWidth="2.5" />
              ))}
            </g>

            {/* Building 3 (Right Station Avenue & Tea House) */}
            <g transform="translate(800, 150)">
              <path d="M -30 100 L 260 100 L 220 50 L 10 50 Z" fill="#070A10" stroke="#B99A60" strokeWidth="0.8" />
              <rect x="10" y="100" width="210" height="210" fill="#131B2A" />
              <rect x="30" y="120" width="170" height="100" fill="#F0E5CE" opacity="0.35" filter="drop-shadow(0 0 12px #B99A60)" />
            </g>

            {/* Foreground Stone Paved Street (石畳 - Ishidatami) */}
            <path
              d="M 0 350 Q 300 340 600 355 T 1200 350 L 1200 500 L 0 500 Z"
              fill="#080C14"
            />
            {/* Street Lantern Light Reflections on Wet Stones */}
            <ellipse cx="260" cy="420" rx="90" ry="24" fill="#B99A60" opacity="0.15" />
            <ellipse cx="560" cy="440" rx="120" ry="28" fill="#F0E5CE" opacity="0.18" />
            <ellipse cx="940" cy="430" rx="100" ry="26" fill="#A84A3A" opacity="0.16" />
          </svg>

          {/* Glowing Interactive Hotspot Buttons embedded in the scene */}
          {STREET_PHRASES.map((phrase) => {
            const isSelected = activePhrase.id === phrase.id;
            const Icon = phrase.icon;

            return (
              <div
                key={phrase.id}
                style={{ top: phrase.hotspotPosition.top, left: phrase.hotspotPosition.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <motion.button
                  onClick={() => handlePlayPhrase(phrase)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`group relative p-3 sm:p-4 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#A84A3A] text-white shadow-[0_0_25px_#A84A3A] ring-4 ring-[#F0E5CE]/50'
                      : 'bg-[#101722]/90 text-[#B99A60] hover:text-white hover:bg-[#A84A3A] border border-[#B99A60] shadow-lg'
                  }`}
                  title={phrase.situation}
                >
                  <Icon size={18} className="relative z-10" />

                  {/* Pulsing Beacon Halo */}
                  <span className="absolute -inset-1.5 rounded-full bg-[#B99A60]/30 animate-ping pointer-events-none" />

                  {/* Tooltip label on desktop */}
                  <span className="hidden md:block absolute -bottom-7 whitespace-nowrap text-3xs font-serif_jp font-bold px-2 py-0.5 rounded bg-[#101722]/90 text-[#F0E5CE] border border-[#B99A60]/40 pointer-events-none shadow-md">
                    {phrase.japanese}
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Active Phrase Inspection Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhrase.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#101722] border border-[#B99A60]/50 shadow-xl space-y-4"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono uppercase px-2 py-0.5 rounded bg-[#A84A3A] text-white font-bold">
                    {activePhrase.situation}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-3 pt-1">
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif_jp text-[#F0E5CE]">
                    {activePhrase.japanese}
                  </h3>
                  <span className="text-sm font-mono text-[#B99A60]">
                    /{activePhrase.romaji}/
                  </span>
                </div>
              </div>

              {/* Audio Playback Control */}
              <button
                onClick={() => handlePlayPhrase(activePhrase)}
                disabled={isPlayingAudio}
                className="px-5 py-2.5 rounded-xl bg-[#A84A3A] hover:bg-[#8C3A2D] text-white font-serif_jp text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Volume2 size={16} className={isPlayingAudio ? 'animate-pulse' : ''} />
                <span>発音を聞く • Hear Japanese Audio</span>
              </button>
            </div>

            {/* Multilingual Translation Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#B99A60]/20 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-3xs font-mono uppercase text-[#B99A60] font-bold">English Meaning</span>
                <p className="text-[#F0E5CE] font-sans font-medium">{activePhrase.english}</p>
              </div>

              <div className="space-y-1">
                <span className="text-3xs font-mono uppercase text-[#B99A60] font-bold">Telugu Meaning (తెలుగు)</span>
                <p className="text-[#F0E5CE] font-telugu text-sm">{activePhrase.telugu}</p>
              </div>
            </div>

            {/* Cultural Tip */}
            <div className="p-3.5 rounded-xl bg-[#141E2F] border border-[#B99A60]/30 text-xs text-[#F0E5CE]/90 flex items-start gap-2.5">
              <Sparkles size={14} className="text-[#B99A60] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold text-[#B99A60]">Cultural Insight:</span> {activePhrase.culturalTip}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
