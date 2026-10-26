// src/components/common/FuriganaText.tsx
// Accessible Furigana ruby text renderer with Telugu phonetics and Romaji support
import React from 'react';
import { useLearning } from '../../context/LearningContext';

interface FuriganaTextProps {
  japanese: string;
  furigana?: string;
  romaji?: string;
  teluguPhonetic?: string;
  english?: string;
  telugu?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetails?: boolean;
  className?: string;
}

export const FuriganaText: React.FC<FuriganaTextProps> = ({
  japanese,
  furigana,
  romaji,
  teluguPhonetic,
  english,
  telugu,
  size = 'md',
  showDetails = true,
  className = ''
}) => {
  const { furiganaEnabled, romajiEnabled, displayMode } = useLearning();

  const textSizes = {
    sm: 'text-base font-medium',
    md: 'text-xl font-semibold',
    lg: 'text-3xl font-bold',
    xl: 'text-4xl lg:text-5xl font-bold'
  };

  const rubySizes = {
    sm: 'text-2xs text-kai-muted dark:text-kai-dark-muted',
    md: 'text-xs text-kai-muted dark:text-kai-dark-muted',
    lg: 'text-sm text-kai-muted dark:text-kai-dark-muted',
    xl: 'text-base text-kai-vermilion'
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {/* Japanese script with optional ruby furigana */}
      <span className={`font-japanese tracking-wide text-kai-ink dark:text-kai-dark-ink ${textSizes[size]}`}>
        {furigana && furiganaEnabled && furigana !== japanese ? (
          <ruby className="ruby-align">
            {japanese}
            <rt className={`${rubySizes[size]} font-normal select-none`}>{furigana}</rt>
          </ruby>
        ) : (
          japanese
        )}
      </span>

      {/* Romaji & Telugu Pronunciation Line */}
      {showDetails && (
        <div className="flex flex-wrap items-center gap-x-2.5 mt-1 text-xs">
          {romaji && romajiEnabled && (
            <span className="font-mono text-kai-indigo dark:text-indigo-300 font-medium">
              {romaji}
            </span>
          )}

          {teluguPhonetic && (displayMode === 'telugu' || displayMode === 'bilingual') && (
            <span className="font-telugu text-kai-vermilion-dark dark:text-kai-vermilion-light font-normal bg-kai-vermilion-bg/60 dark:bg-kai-dark-card px-1.5 py-0.5 rounded text-2xs">
              ఉచ్చారణ: {teluguPhonetic}
            </span>
          )}
        </div>
      )}

      {/* Translations according to displayMode */}
      {showDetails && (english || telugu) && (
        <div className="mt-1 space-y-0.5 text-xs text-kai-muted dark:text-kai-dark-muted">
          {(displayMode === 'english' || displayMode === 'bilingual') && english && (
            <p className="leading-snug">{english}</p>
          )}
          {(displayMode === 'telugu' || displayMode === 'bilingual') && telugu && (
            <p className="font-telugu text-kai-ink/80 dark:text-kai-dark-ink/80 leading-snug">
              {telugu}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
