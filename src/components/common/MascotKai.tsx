// src/components/common/MascotKai.tsx
// Expressive, context-aware KAI mascot (Kai-kun) with smooth SVG animations
import React from 'react';

export type MascotMood = 'cheerful' | 'thinking' | 'celebrating' | 'coaching' | 'curious';

interface MascotKaiProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MascotKai: React.FC<MascotKaiProps> = ({
  mood = 'cheerful',
  speechText,
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center gap-3 ${className}`}>
      {/* Speech bubble if provided */}
      {speechText && (
        <div className="relative bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border px-3.5 py-2 rounded-2xl shadow-washi text-xs font-medium text-kai-ink dark:text-kai-dark-ink max-w-xs animate-in fade-in duration-300">
          <p>{speechText}</p>
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-kai-dark-card border-b border-r border-kai-border dark:border-kai-dark-border transform rotate-45" />
        </div>
      )}

      {/* SVG Mascot (Kitsune / Tanuki mentor spirit with traditional torii headband) */}
      <div className={`${sizeMap[size]} relative flex-shrink-0 transition-transform duration-300 hover:scale-105 select-none`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Spirit Glow Aura */}
          <circle cx="50" cy="50" r="44" fill={mood === 'celebrating' ? '#FEE7D6' : '#F5F0E6'} className="dark:fill-kai-dark-surface opacity-60" />

          {/* Ears */}
          <path d="M26 22 L36 40 L20 38 Z" fill="#D9483B" stroke="#B83226" strokeWidth="2" strokeLinejoin="round" />
          <path d="M28 26 L34 38 L24 37 Z" fill="#FAF4E3" />
          <path d="M74 22 L80 38 L64 40 Z" fill="#D9483B" stroke="#B83226" strokeWidth="2" strokeLinejoin="round" />
          <path d="M72 26 L76 37 L66 38 Z" fill="#FAF4E3" />

          {/* Head & Cheeks */}
          <ellipse cx="50" cy="52" rx="32" ry="28" fill="#FBF9F5" stroke="#1E2C4A" strokeWidth="2.5" />

          {/* Eye markings / Traditional Japanese Kitsune Face Paint */}
          <path d="M28 46 Q32 38 40 44" stroke="#D9483B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M72 46 Q68 38 60 44" stroke="#D9483B" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Eyes depending on mood */}
          {mood === 'cheerful' || mood === 'celebrating' ? (
            <>
              {/* Happy crescent eyes */}
              <path d="M33 50 Q40 44 43 50" stroke="#1E2C4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M57 50 Q60 44 67 50" stroke="#1E2C4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Curious thinking eyes */}
              <circle cx="38" cy="48" r="3.5" fill="#1E2C4A" />
              <circle cx="62" cy="46" r="3.5" fill="#1E2C4A" />
              <path d="M58 40 L66 42" stroke="#1E2C4A" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Determined / Coaching bright eyes */}
              <circle cx="38" cy="49" r="4" fill="#1E2C4A" />
              <circle cx="39.5" cy="47.5" r="1.5" fill="#FFFFFF" />
              <circle cx="62" cy="49" r="4" fill="#1E2C4A" />
              <circle cx="63.5" cy="47.5" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Nose */}
          <path d="M48 56 L52 56 L50 59 Z" fill="#1E2C4A" />

          {/* Mouth */}
          {mood === 'celebrating' ? (
            <path d="M45 61 Q50 68 55 61 Z" fill="#D9483B" stroke="#1E2C4A" strokeWidth="1.5" />
          ) : (
            <path d="M46 62 Q50 65 54 62" stroke="#1E2C4A" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Cheeks blush */}
          <ellipse cx="28" cy="56" rx="4" ry="2.5" fill="#F8A79E" opacity="0.7" />
          <ellipse cx="72" cy="56" rx="4" ry="2.5" fill="#F8A79E" opacity="0.7" />

          {/* Headband / Master Crest */}
          <path d="M22 36 Q50 32 78 36" stroke="#1E2C4A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="33" r="4.5" fill="#C59B27" stroke="#1E2C4A" strokeWidth="1.5" />
          <circle cx="50" cy="33" r="2" fill="#D9483B" />

          {/* Small Paws holding a scroll if coaching/thinking */}
          {mood === 'thinking' || mood === 'coaching' ? (
            <rect x="42" y="70" width="16" height="8" rx="3" fill="#EADBC8" stroke="#1E2C4A" strokeWidth="1.5" />
          ) : null}
        </svg>
      </div>
    </div>
  );
};
