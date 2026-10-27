// src/components/landing/KanjiScrollTrack.tsx
// Vertical Japanese chapter track with Kanji numerals and glowing active marker
import React from 'react';

interface Chapter {
  numeral: string;
  kanji: string;
  label: string;
  targetId: string;
  threshold: number; // scroll progress threshold
}

const CHAPTERS: Chapter[] = [
  { numeral: '一', kanji: '序章', label: 'The Threshold', targetId: 'hero-scene', threshold: 0.05 },
  { numeral: '二', kanji: '宣言', label: 'Manifesto', targetId: 'manifesto-scene', threshold: 0.22 },
  { numeral: '三', kanji: '奥義', label: 'Seven Arts', targetId: 'features-scene', threshold: 0.42 },
  { numeral: '四', kanji: '実相', label: 'Living App', targetId: 'showcase-scene', threshold: 0.70 },
  { numeral: '五', kanji: '実績', label: 'Proof', targetId: 'stats-scene', threshold: 0.85 },
  { numeral: '六', kanji: '曙光', label: 'Sunrise', targetId: 'cta-scene', threshold: 0.95 }
];

interface KanjiScrollTrackProps {
  scrollProgress: number; // 0 to 1
  onNavigate?: (targetId: string) => void;
}

export const KanjiScrollTrack: React.FC<KanjiScrollTrackProps> = ({ scrollProgress, onNavigate }) => {
  // Determine current active chapter index
  const activeIdx = Math.max(
    0,
    CHAPTERS.reduce((acc, ch, idx) => (scrollProgress >= ch.threshold - 0.08 ? idx : acc), 0)
  );

  const handleClick = (targetId: string) => {
    if (onNavigate) {
      onNavigate(targetId);
    } else {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Chapter Navigation"
      className="fixed right-4 sm:right-7 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 select-none"
    >
      {/* Top Hanko Red Stamp Accent */}
      <div className="w-5 h-5 rounded-md border border-[#E63946] flex items-center justify-center text-[10px] font-serif_jp font-bold text-[#E63946] bg-[#E63946]/10 shadow-[0_0_8px_rgba(230,57,70,0.3)]">
        界
      </div>

      {/* Vertical Track Rail */}
      <div className="relative py-2 flex flex-col items-center gap-4">
        {/* Continuous Guide Line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none" />

        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeIdx;

          return (
            <button
              key={ch.numeral}
              onClick={() => handleClick(ch.targetId)}
              className="group relative flex items-center justify-center p-1.5 focus:outline-none"
              title={`${ch.numeral} ${ch.kanji} — ${ch.label}`}
            >
              {/* Tooltip on Hover */}
              <div className="absolute right-9 px-2.5 py-1 rounded-md bg-[#0F1424]/90 border border-white/10 backdrop-blur-md text-[11px] font-sans font-medium text-white/90 whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none shadow-lg">
                <span className="text-[#E63946] font-serif_jp mr-1.5">{ch.kanji}</span>
                <span className="text-white/60">{ch.label}</span>
              </div>

              {/* Kanji Numeral Disc */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif_jp transition-all duration-300 ${
                  isActive
                    ? 'bg-[#E63946] text-white font-bold shadow-[0_0_14px_rgba(230,57,70,0.7)] scale-110'
                    : 'bg-[#0E1626]/80 text-white/50 hover:text-white border border-white/10 hover:border-white/30'
                }`}
              >
                {ch.numeral}
              </div>
            </button>
          );
        })}
      </div>

      {/* Scroll Progress Fraction */}
      <span className="text-[10px] font-mono text-white/40 tracking-wider">
        {Math.round(scrollProgress * 100)}%
      </span>
    </aside>
  );
};
