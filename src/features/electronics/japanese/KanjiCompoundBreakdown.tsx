// src/features/electronics/japanese/KanjiCompoundBreakdown.tsx
// Visual morphological breakdown card for Japanese technical compound kanji (e.g. 半 + 導 + 体)
import React from 'react';
import { KanjiMorpheme } from './types';
import { Sparkles, Layers } from 'lucide-react';

interface KanjiCompoundBreakdownProps {
  compound: string;
  kana: string;
  romaji: string;
  english: string;
  morphemes?: KanjiMorpheme[];
  className?: string;
}

export const KanjiCompoundBreakdown: React.FC<KanjiCompoundBreakdownProps> = ({
  compound,
  kana,
  romaji,
  english,
  morphemes,
  className = ''
}) => {
  if (!morphemes || morphemes.length === 0) {
    return (
      <div className={`p-4 rounded-2xl bg-stone-50 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] text-sm text-[#6B6358] dark:text-[#94A3B8] ${className}`}>
        <p className="font-mono text-xs">No multi-kanji morphological breakdown available for loanword / single glyph ({compound}).</p>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#C59B27]/10 dark:bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
              漢字構成・語源解釈 (Compound Morphology)
            </h4>
            <p className="text-[11px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              Deconstructing {compound} into morphemes
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#84231D]/10 text-[#84231D] dark:text-[#FF8A80] border border-[#84231D]/20">
          {morphemes.length} Morphemes
        </span>
      </div>

      {/* Morpheme Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {morphemes.map((m, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-3 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#E3D8C4] dark:border-[#253659] text-center transition-all hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0A101C] border border-[#C59B27]/30 flex items-center justify-center shadow-sm mb-2">
              <span className="font-serif_jp font-bold text-2xl text-[#14110F] dark:text-[#F3EBDD]">
                {m.kanji}
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#84231D] dark:text-[#FF8A80]">
              {m.reading}
            </span>
            <span className="text-[11px] text-[#6B6358] dark:text-[#94A3B8] mt-1 leading-tight line-clamp-2">
              {m.meaningEn}
            </span>
          </div>
        ))}
      </div>

      {/* Synthesis explanation */}
      <div className="p-3 rounded-xl bg-[#C59B27]/10 dark:bg-[#C59B27]/15 border border-[#C59B27]/30 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
        <div className="text-[#14110F] dark:text-[#E2E8F0] space-y-0.5">
          <span className="font-semibold">Synthesis: </span>
          <span className="font-serif_jp font-bold text-[#84231D] dark:text-[#FF8A80]">{compound}</span> ({kana} / {romaji}) literally combines{' '}
          {morphemes.map((m) => `“${m.meaningEn}” (${m.kanji})`).join(' + ')} to denote{' '}
          <strong className="underline decoration-[#C59B27] decoration-2">{english}</strong>.
        </div>
      </div>
    </div>
  );
};
