// src/features/dictation/KanaKeyboard.tsx
// On-screen touch/click Japanese Kana keyboard with Gojuon rows, dakuten toggle, and small kana
import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

interface KanaKeyboardProps {
  onInsertKana: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  disabled?: boolean;
}

const GOJUON_ROWS = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', 'ゆ', 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'を', 'ん']
];

const DAKUTEN_ROWS = [
  ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  ['だ', 'ぢ', 'づ', 'で', 'ど'],
  ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']
];

const SPECIAL_KEYS = ['っ', 'ゃ', 'ゅ', 'ょ', 'ー'];

export const KanaKeyboard: React.FC<KanaKeyboardProps> = ({
  onInsertKana,
  onBackspace,
  onClear,
  disabled = false
}) => {
  const [showDakuten, setShowDakuten] = useState<boolean>(false);

  const activeRows = showDakuten ? DAKUTEN_ROWS : GOJUON_ROWS;

  return (
    <div className="w-full max-w-xl mx-auto p-3 sm:p-4 rounded-3xl bg-white/95 dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi select-none">
      {/* Top Utility Controls */}
      <div className="flex items-center justify-between mb-3 px-1 gap-2">
        <button
          type="button"
          onClick={() => setShowDakuten(!showDakuten)}
          disabled={disabled}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showDakuten
              ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-kai-vermilion'
          }`}
        >
          {showDakuten ? 'あ・か (Gojuon)' : 'が・ぱ (Dakuten)'}
        </button>

        {/* Special modifiers: small tsu, youon, chouon */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {SPECIAL_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              disabled={disabled}
              onClick={() => onInsertKana(k)}
              className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-serif_jp text-sm hover:border-kai-indigo hover:text-kai-indigo dark:hover:text-kai-gold transition-colors active:scale-95 flex items-center justify-center"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Action Keys */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={disabled}
            onClick={onBackspace}
            title="Backspace"
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors active:scale-95"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            title="Clear all"
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kana Keys Grid */}
      <div className="space-y-1.5">
        {activeRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5">
            {row.map((char) => (
              <button
                key={char}
                type="button"
                disabled={disabled}
                onClick={() => onInsertKana(char)}
                className="flex-1 max-w-[48px] h-10 sm:h-11 rounded-xl bg-white dark:bg-[#0E1626] border border-[#E8E3D9] dark:border-[#233457] text-[#14110F] dark:text-[#FAF5ED] font-serif_jp text-base sm:text-lg font-medium hover:border-kai-vermilion hover:text-kai-vermilion dark:hover:border-kai-gold dark:hover:text-kai-gold shadow-sm active:scale-95 transition-all flex items-center justify-center disabled:opacity-40"
              >
                {char}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
