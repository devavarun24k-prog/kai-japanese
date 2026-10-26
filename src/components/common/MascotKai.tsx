// src/components/common/MascotKai.tsx
// High-fidelity illustrated Japanese mentor companion (Kai-kun)
// Features 8 expressive states, playful micro-interactions, responsive speech bubbles, and delightful animation
import React, { useState } from 'react';
import { soundEffects } from '../../services/soundEffects';

export type MascotMood =
  | 'welcoming'
  | 'curious'
  | 'thinking'
  | 'encouraging'
  | 'celebrating'
  | 'playfully_confused'
  | 'reacting_to_mistake'
  | 'proud'
  // Backward compatibility aliases:
  | 'cheerful'
  | 'coaching';

export interface MascotKaiProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bubblePlacement?: 'top' | 'bottom' | 'left' | 'right';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

const DEFAULT_PHRASES: Record<string, string[]> = {
  welcoming: [
    'Konnichiwa! Ready to explore Japanese today?',
    'Every step counts! Let’s learn together!',
    'Welcome back! You’re doing amazing!'
  ],
  curious: [
    'Ooh, what does this character remind you of?',
    'Did you notice the stroke order pattern?',
    'Let’s take a closer look at this!'
  ],
  thinking: [
    'Hmm... take your time, no rush!',
    'Remember the mnemonic picture!',
    'Think about the sound it makes...'
  ],
  encouraging: [
    'You’ve got this! Gambatte!',
    'One character at a time, you’re building fluency!',
    'Mistakes are just stepping stones to mastery!'
  ],
  celebrating: [
    'Sugoi! Fantastic job!',
    'Look at you go! That was spot on!',
    'XP earned and memories forged!'
  ],
  playfully_confused: [
    'Wait, is that a Katakana or a Kanji?',
    'Even native speakers double check that one!',
    'Whoops! Let’s crack the mystery together!'
  ],
  reacting_to_mistake: [
    'Don’t worry! We learn fastest from our stumbles.',
    'Almost had it! Let’s review the clue.',
    'No stress! Repetition is the secret sauce.'
  ],
  proud: [
    'Sensei is proud of your dedication!',
    'Your Japanese foundation is getting rock solid.',
    'You are truly becoming a Japanese master!'
  ]
};

export const MascotKai: React.FC<MascotKaiProps> = ({
  mood = 'welcoming',
  speechText,
  size = 'md',
  bubblePlacement = 'top',
  interactive = true,
  onClick,
  className = ''
}) => {
  // Normalize mood aliases
  const resolvedMood =
    mood === 'cheerful' ? 'welcoming' : mood === 'coaching' ? 'encouraging' : mood;

  const [activeSpeech, setActiveSpeech] = useState<string | null>(speechText || null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  // Sync if external speechText changes
  React.useEffect(() => {
    if (speechText !== undefined) {
      setActiveSpeech(speechText);
    }
  }, [speechText]);

  const sizeMap = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44'
  };

  const handleCompanionClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (!interactive) return;

    soundEffects.playClick();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);

    const pool = DEFAULT_PHRASES[resolvedMood] || DEFAULT_PHRASES.welcoming;
    const nextText = pool[clickCount % pool.length];
    setClickCount((prev) => prev + 1);
    setActiveSpeech(nextText);
  };

  // Render Speech Bubble
  const renderBubble = () => {
    if (!activeSpeech) return null;

    const placementStyles = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
      left: 'right-full top-1/2 -translate-y-1/2 mr-3',
      right: 'left-full top-1/2 -translate-y-1/2 ml-3'
    }[bubblePlacement];

    const tailStyles = {
      top: 'top-full left-1/2 -translate-x-1/2 border-t-white dark:border-t-[#1F2733] border-l-transparent border-r-transparent border-b-transparent border-t-8 border-x-6',
      bottom:
        'bottom-full left-1/2 -translate-x-1/2 border-b-white dark:border-b-[#1F2733] border-l-transparent border-r-transparent border-t-transparent border-b-8 border-x-6',
      left: 'left-full top-1/2 -translate-y-1/2 border-l-white dark:border-l-[#1F2733] border-t-transparent border-b-transparent border-r-transparent border-l-8 border-y-6',
      right:
        'right-full top-1/2 -translate-y-1/2 border-r-white dark:border-r-[#1F2733] border-t-transparent border-b-transparent border-l-transparent border-r-8 border-y-6'
    }[bubblePlacement];

    return (
      <div
        className={`absolute ${placementStyles} z-30 pointer-events-auto max-w-xs min-w-[140px] px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1F2733] border border-[#E5DEC9] dark:border-[#2D3748] shadow-washi-md text-xs font-medium text-[#1A1817] dark:text-[#F0E5CE] animate-in fade-in zoom-in-95 duration-200 select-none`}
      >
        <p className="leading-snug">{activeSpeech}</p>
        <div className={`absolute w-0 h-0 ${tailStyles}`} />
      </div>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {renderBubble()}

      <div
        onClick={handleCompanionClick}
        title={interactive ? 'Click Kai for a friendly tip!' : undefined}
        className={`${sizeMap[size]} relative flex-shrink-0 select-none transition-transform duration-300 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        } ${isBouncing ? 'animate-bounce' : ''}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Soft Warm Halo */}
            <radialGradient id="kaiHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF4E8" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#F5EBD7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F5EBD7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="kaiCelebrateHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#FDE68A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Aura */}
          <circle
            cx="50"
            cy="52"
            r="44"
            fill={resolvedMood === 'celebrating' || resolvedMood === 'proud' ? 'url(#kaiCelebrateHalo)' : 'url(#kaiHalo)'}
          />

          {/* Floaty Sparks for Celebrating / Proud */}
          {(resolvedMood === 'celebrating' || resolvedMood === 'proud') && (
            <g className="animate-pulse">
              <polygon points="18,18 20,22 24,24 20,26 18,30 16,26 12,24 16,22" fill="#F59E0B" />
              <polygon points="82,20 84,23 87,24 84,25 82,28 80,25 77,24 80,23" fill="#D9483B" />
              <polygon points="50,6 52,10 56,12 52,14 50,18 48,14 44,12 48,10" fill="#EAB308" />
              <circle cx="86" cy="65" r="2.5" fill="#F59E0B" />
              <circle cx="14" cy="68" r="2.5" fill="#D9483B" />
            </g>
          )}

          {/* Playfully Confused Floating Question Marks / Sweatdrop */}
          {resolvedMood === 'playfully_confused' && (
            <g>
              {/* Cute blue sweat drop */}
              <path
                d="M78 30 C78 24, 85 24, 85 30 C85 34, 78 37, 78 30 Z"
                fill="#38BDF8"
                className="animate-bounce"
              />
              <text
                x="14"
                y="34"
                fontSize="14"
                fontWeight="bold"
                fill="#D9483B"
                fontFamily="sans-serif"
              >
                ?
              </text>
            </g>
          )}

          {/* Ears */}
          <g>
            {/* Left Ear */}
            <path
              d={resolvedMood === 'curious' || resolvedMood === 'playfully_confused' ? 'M22 24 L34 42 L16 38 Z' : 'M24 20 L35 40 L18 38 Z'}
              fill="#D9483B"
              stroke="#B83226"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d={resolvedMood === 'curious' || resolvedMood === 'playfully_confused' ? 'M24 27 L32 39 L20 37 Z' : 'M26 24 L33 38 L22 37 Z'}
              fill="#FFF8EE"
            />

            {/* Right Ear */}
            <path
              d="M76 20 L82 38 L65 40 Z"
              fill="#D9483B"
              stroke="#B83226"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M74 24 L78 37 L67 38 Z" fill="#FFF8EE" />
          </g>

          {/* Tail in background */}
          <path
            d="M74 58 C88 56, 94 72, 82 82 C74 76, 70 66, 74 58 Z"
            fill="#D9483B"
            stroke="#B83226"
            strokeWidth="2"
          />
          <path d="M82 74 C86 70, 85 78, 80 81 Z" fill="#FFF8EE" />

          {/* Head & Body Form */}
          <ellipse
            cx="50"
            cy="54"
            rx="33"
            ry="29"
            fill="#FFFDF9"
            stroke="#1E2C4A"
            strokeWidth="2.5"
          />

          {/* Forehead Kitsune Sun Crest */}
          <circle cx="50" cy="34" r="4.5" fill="#D9483B" />
          <circle cx="50" cy="34" r="2.2" fill="#FBBF24" />

          {/* Traditional Cheek Markings */}
          <path
            d="M26 48 Q32 42 39 46"
            stroke="#D9483B"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M74 48 Q68 42 61 46"
            stroke="#D9483B"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Rosy Blushing Cheeks */}
          <ellipse cx="27" cy="58" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.75" />
          <ellipse cx="73" cy="58" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.75" />

          {/* EYES according to 8 moods */}
          {resolvedMood === 'welcoming' && (
            /* Joyful crescent eyes */
            <g>
              <path
                d="M33 50 Q39 44 44 50"
                stroke="#1E2C4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M56 50 Q61 44 67 50"
                stroke="#1E2C4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {resolvedMood === 'celebrating' && (
            /* Ecstatic squinting closed eyes > < */
            <g>
              <path
                d="M32 47 L43 52 L32 57"
                stroke="#1E2C4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M68 47 L57 52 L68 57"
                stroke="#1E2C4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {resolvedMood === 'curious' && (
            /* Wide curious eyes with sparkle */
            <g>
              <ellipse cx="38" cy="49" rx="4.5" ry="5.5" fill="#1E2C4A" />
              <circle cx="36" cy="47" r="1.8" fill="#FFFFFF" />
              <circle cx="40" cy="51" r="0.9" fill="#FFFFFF" />

              <ellipse cx="62" cy="49" rx="4.5" ry="5.5" fill="#1E2C4A" />
              <circle cx="60" cy="47" r="1.8" fill="#FFFFFF" />
              <circle cx="64" cy="51" r="0.9" fill="#FFFFFF" />

              {/* Tilted curious eyebrow */}
              <path
                d="M33 41 Q39 38 43 42"
                stroke="#1E2C4A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M57 43 Q62 38 67 40"
                stroke="#1E2C4A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {resolvedMood === 'thinking' && (
            /* Eyes looking up pensively */
            <g>
              <circle cx="38" cy="46" r="4.2" fill="#1E2C4A" />
              <circle cx="39.5" cy="44.5" r="1.6" fill="#FFFFFF" />
              <circle cx="62" cy="46" r="4.2" fill="#1E2C4A" />
              <circle cx="63.5" cy="44.5" r="1.6" fill="#FFFFFF" />
              {/* Contemplating eyebrow */}
              <path
                d="M56 40 L65 43"
                stroke="#1E2C4A"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </g>
          )}

          {resolvedMood === 'encouraging' && (
            /* Determined sparkling eyes */
            <g>
              <circle cx="38" cy="49" r="4.5" fill="#1E2C4A" />
              <circle cx="37" cy="47" r="1.8" fill="#FFFFFF" />
              <polygon points="40,51 41,52 42,51 41,50" fill="#F59E0B" />

              <circle cx="62" cy="49" r="4.5" fill="#1E2C4A" />
              <circle cx="61" cy="47" r="1.8" fill="#FFFFFF" />
              <polygon points="64,51 65,52 66,51 65,50" fill="#F59E0B" />
            </g>
          )}

          {resolvedMood === 'playfully_confused' && (
            /* Spiral swirl eyes */
            <g>
              <path
                d="M34 50 A 4 4 0 0 1 42 50 A 3 3 0 0 1 36 50 A 2 2 0 0 1 40 50"
                stroke="#1E2C4A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M58 50 A 4 4 0 0 1 66 50 A 3 3 0 0 1 60 50 A 2 2 0 0 1 64 50"
                stroke="#1E2C4A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {resolvedMood === 'reacting_to_mistake' && (
            /* Sympathetic, comforting puppy-like eyes */
            <g>
              <circle cx="38" cy="49" r="4" fill="#1E2C4A" />
              <circle cx="37" cy="47" r="1.7" fill="#FFFFFF" />
              <circle cx="62" cy="49" r="4" fill="#1E2C4A" />
              <circle cx="61" cy="47" r="1.7" fill="#FFFFFF" />
              {/* Soothing droop brows */}
              <path
                d="M33 42 Q39 45 43 43"
                stroke="#1E2C4A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M57 43 Q61 45 67 42"
                stroke="#1E2C4A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {resolvedMood === 'proud' && (
            /* Contented master eyes */
            <g>
              <path
                d="M33 49 Q39 44 44 49"
                stroke="#1E2C4A"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M56 49 Q61 44 67 49"
                stroke="#1E2C4A"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />
              {/* Golden Sensei fan */}
              <path
                d="M74 54 L86 42 Q92 50 86 60 Z"
                fill="#FBBF24"
                stroke="#1E2C4A"
                strokeWidth="1.5"
              />
              <line x1="74" y1="54" x2="89" y2="51" stroke="#D9483B" strokeWidth="1" />
            </g>
          )}

          {/* Cute Button Nose */}
          <path d="M48 57 L52 57 L50 60 Z" fill="#1E2C4A" />

          {/* MOUTH according to mood */}
          {resolvedMood === 'celebrating' ? (
            /* Open laughing happy mouth */
            <path
              d="M44 62 Q50 71 56 62 Z"
              fill="#D9483B"
              stroke="#1E2C4A"
              strokeWidth="2"
            />
          ) : resolvedMood === 'playfully_confused' ? (
            /* Wobbly tiny mouth */
            <path
              d="M45 64 Q48 62 50 64 Q52 66 55 64"
              stroke="#1E2C4A"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          ) : resolvedMood === 'reacting_to_mistake' ? (
            /* Gentle consoling small smile */
            <path
              d="M46 64 Q50 67 54 64"
              stroke="#1E2C4A"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            /* Cheerful natural smile */
            <path
              d="M45 63 Q50 68 55 63"
              stroke="#1E2C4A"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* PAWS & ACCESSORIES */}
          {resolvedMood === 'welcoming' && (
            /* Waving right paw */
            <g className="animate-pulse">
              <ellipse
                cx="74"
                cy="44"
                rx="6"
                ry="5"
                fill="#FFFDF9"
                stroke="#1E2C4A"
                strokeWidth="2"
                transform="rotate(-20 74 44)"
              />
              <circle cx="73" cy="43" r="2" fill="#FCA5A5" opacity="0.6" />
            </g>
          )}

          {resolvedMood === 'encouraging' && (
            /* Fist pump paw */
            <g>
              <ellipse
                cx="73"
                cy="46"
                rx="6"
                ry="5"
                fill="#FFFDF9"
                stroke="#1E2C4A"
                strokeWidth="2"
                transform="rotate(25 73 46)"
              />
              <circle cx="73" cy="46" r="2.2" fill="#FCA5A5" opacity="0.7" />
            </g>
          )}

          {resolvedMood === 'thinking' && (
            /* Paw touching chin */
            <g>
              <ellipse
                cx="58"
                cy="68"
                rx="5"
                ry="4"
                fill="#FFFDF9"
                stroke="#1E2C4A"
                strokeWidth="2"
              />
              {/* Little scroll on chest */}
              <rect
                x="40"
                y="74"
                width="20"
                height="6"
                rx="2"
                fill="#FDF6E2"
                stroke="#1E2C4A"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
