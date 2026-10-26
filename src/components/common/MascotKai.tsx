// src/components/common/MascotKai.tsx
// High-fidelity illustrated Japanese mentor companion (Kai-kun)
// Features:
// - Eyes follow pointer (clamped to max 4px offset)
// - Random organic blinking every 3-6s
// - Hop animation on click with sound
// - Context-aware speech bubbles based on streak (0, 1-6, 7+) and quest completion
// - Mood variants: sleepy (streak 0), happy (1-6), fired-up (7+), celebrating, thinking, curious
// - Responsive speech bubble with tail pointing at mascot, bounded within parent
// - Strictly respects prefers-reduced-motion
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { soundEffects } from '../../services/soundEffects';

export type MascotMood =
  | 'welcoming'
  | 'happy'
  | 'sleepy'
  | 'fired_up'
  | 'curious'
  | 'thinking'
  | 'encouraging'
  | 'celebrating'
  | 'playfully_confused'
  | 'reacting_to_mistake'
  | 'proud'
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
  streakDays?: number;
  questsCompleted?: boolean;
}

const CONTEXT_PHRASES = {
  streak0: [
    'A fresh start today! Even 3 minutes makes a difference, let’s go!',
    'Every grand journey begins with zero. Let’s learn our first Kana today!',
    'I was getting a bit sleepy, but now that you’re here, let’s practice!',
    'No pressure at all! Just one stroke at a time (千里の道も一歩から).'
  ],
  streak1to6: [
    'Nice streak going! Consistency is your superpower (継続は力なり)!',
    'Day by day, your Japanese ear is tuning in. Keep the flame alive!',
    'Steady as a river! Let’s crush today’s lesson and reviews!',
    'Great to see you again! Practice makes second nature (習うより慣れよ).'
  ],
  streak7plus: [
    '7+ days on fire! The Matsuri festival spirit is roaring inside you!',
    'Incredible dedication! Japanese is becoming part of your daily rhythm!',
    'Unstoppable momentum! A week-long streak puts you in the top 10% of learners!',
    'Seven days and beyond! Your future bilingual self is smiling!'
  ],
  questsDone: [
    'Subarashii! All quests conquered for today! Feel proud of your progress!',
    'Today’s quests: DONE! You’ve earned your rest and your XP!',
    'Perfection! Every challenge met with flying colors today!',
    'All clear! You are truly mastering the way of Japanese!'
  ],
  welcoming: [
    'Konnichiwa! Ready to explore Japanese today?',
    'Every step counts! Let’s learn together!',
    'Welcome back! You’re doing amazing!'
  ],
  thinking: [
    'Hmm... take your time, no rush!',
    'Remember the mnemonic picture!',
    'Think about the sound it makes...'
  ],
  curious: [
    'Ooh, what does this character remind you of?',
    'Did you notice the stroke order pattern?',
    'Let’s take a closer look at this!'
  ]
};

export const MascotKai: React.FC<MascotKaiProps> = ({
  mood,
  speechText,
  size = 'md',
  bubblePlacement = 'top',
  interactive = true,
  onClick,
  className = '',
  streakDays,
  questsCompleted = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const mascotRef = useRef<HTMLDivElement>(null);

  // Determine effective mood: explicit mood overrides streak auto-mood
  const resolvedMood: MascotMood = React.useMemo(() => {
    if (mood) {
      if (mood === 'cheerful') return 'happy';
      if (mood === 'coaching') return 'encouraging';
      return mood;
    }
    if (questsCompleted) return 'celebrating';
    if (streakDays !== undefined) {
      if (streakDays === 0) return 'sleepy';
      if (streakDays >= 7) return 'fired_up';
      return 'happy';
    }
    return 'welcoming';
  }, [mood, streakDays, questsCompleted]);

  const [activeSpeech, setActiveSpeech] = useState<string | null>(speechText || null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [isHopping, setIsHopping] = useState<boolean>(false);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync if external speechText changes
  useEffect(() => {
    if (speechText !== undefined) {
      setActiveSpeech(speechText);
    }
  }, [speechText]);

  // Random blink every 3 to 6 seconds
  useEffect(() => {
    if (shouldReduceMotion) return;

    let timeoutId: NodeJS.Timeout;
    const scheduleNextBlink = () => {
      const delay = Math.random() * 3000 + 3000; // 3000ms - 6000ms
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 160);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, [shouldReduceMotion]);

  // Pointer tracking for eye pupils (clamped to max 4px offset)
  useEffect(() => {
    if (shouldReduceMotion || !interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawDx = (e.clientX - centerX) * 0.04;
      const rawDy = (e.clientY - centerY) * 0.04;

      const clampedX = Math.max(-4, Math.min(4, rawDx));
      const clampedY = Math.max(-4, Math.min(4, rawDy));

      setEyeOffset({ x: clampedX, y: clampedY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion, interactive]);

  // Context-aware speech list selection
  const getRandomLine = useCallback(() => {
    if (questsCompleted) {
      return CONTEXT_PHRASES.questsDone[clickCount % CONTEXT_PHRASES.questsDone.length];
    }
    if (streakDays !== undefined) {
      if (streakDays === 0) {
        return CONTEXT_PHRASES.streak0[clickCount % CONTEXT_PHRASES.streak0.length];
      }
      if (streakDays >= 7) {
        return CONTEXT_PHRASES.streak7plus[clickCount % CONTEXT_PHRASES.streak7plus.length];
      }
      return CONTEXT_PHRASES.streak1to6[clickCount % CONTEXT_PHRASES.streak1to6.length];
    }
    return CONTEXT_PHRASES.welcoming[clickCount % CONTEXT_PHRASES.welcoming.length];
  }, [questsCompleted, streakDays, clickCount]);

  const handleCompanionClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (!interactive) return;

    soundEffects.playClick();

    if (!shouldReduceMotion) {
      setIsHopping(true);
      setTimeout(() => setIsHopping(false), 450);
    }

    const nextText = getRandomLine();
    setClickCount((prev) => prev + 1);
    setActiveSpeech(nextText);
  };

  const sizeMap = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44'
  };

  // Render Speech Bubble with pointer tail
  const renderBubble = () => {
    if (!activeSpeech) return null;

    const placementStyles = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
      left: 'right-full top-1/2 -translate-y-1/2 mr-3',
      right: 'left-full top-1/2 -translate-y-1/2 ml-3'
    }[bubblePlacement];

    const tailStyles = {
      top: 'top-full left-1/2 -translate-x-1/2 border-t-white dark:border-t-[#141D33] border-l-transparent border-r-transparent border-b-transparent border-t-8 border-x-6',
      bottom:
        'bottom-full left-1/2 -translate-x-1/2 border-b-white dark:border-b-[#141D33] border-l-transparent border-r-transparent border-t-transparent border-b-8 border-x-6',
      left: 'left-full top-1/2 -translate-y-1/2 border-l-white dark:border-l-[#141D33] border-t-transparent border-b-transparent border-r-transparent border-l-8 border-y-6',
      right:
        'right-full top-1/2 -translate-y-1/2 border-r-white dark:border-r-[#141D33] border-t-transparent border-b-transparent border-l-transparent border-r-8 border-y-6'
    }[bubblePlacement];

    return (
      <div
        className={`absolute ${placementStyles} z-30 pointer-events-auto max-w-xs min-w-[140px] px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#2E4370] shadow-washi-md text-xs font-medium text-[#14110F] dark:text-[#FAF5ED] select-none`}
      >
        <p className="leading-snug">{activeSpeech}</p>
        <div className={`absolute w-0 h-0 ${tailStyles}`} />
      </div>
    );
  };

  return (
    <div
      ref={mascotRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {renderBubble()}

      <motion.div
        onClick={handleCompanionClick}
        title={interactive ? 'Click Kai for a friendly tip!' : undefined}
        className={`${sizeMap[size]} relative flex-shrink-0 select-none ${
          interactive ? 'cursor-pointer' : ''
        }`}
        animate={
          isHopping
            ? { y: [-12, 0], scale: [1.05, 1] }
            : { y: 0, scale: 1 }
        }
        transition={{
          duration: 0.45,
          type: 'spring',
          stiffness: 400,
          damping: 15
        }}
        whileHover={interactive && !shouldReduceMotion ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
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
            {/* Fired up Flame Aura */}
            <radialGradient id="kaiFlameHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFEDD5" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FED7AA" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Aura */}
          <circle
            cx="50"
            cy="52"
            r="44"
            fill={
              resolvedMood === 'celebrating' || resolvedMood === 'proud'
                ? 'url(#kaiCelebrateHalo)'
                : resolvedMood === 'fired_up'
                ? 'url(#kaiFlameHalo)'
                : 'url(#kaiHalo)'
            }
          />

          {/* Fired Up Aura Flames (Streak 7+) */}
          {resolvedMood === 'fired_up' && (
            <g className="animate-pulse">
              <path d="M48 4 Q50 0 52 4 Q54 8 50 14 Q46 8 48 4 Z" fill="#F97316" />
              <path d="M22 14 Q25 10 27 15 Q26 20 22 23 Q20 18 22 14 Z" fill="#EAB308" />
              <path d="M78 14 Q75 10 73 15 Q74 20 78 23 Q80 18 78 14 Z" fill="#EAB308" />
            </g>
          )}

          {/* Sleepy Floating Zzz (Streak 0) */}
          {resolvedMood === 'sleepy' && (
            <g className="animate-pulse select-none opacity-80">
              <text x="76" y="24" fontSize="10" fontWeight="bold" fill="#2E4370" fontFamily="sans-serif">
                z
              </text>
              <text x="83" y="16" fontSize="13" fontWeight="bold" fill="#C59B27" fontFamily="sans-serif">
                Z
              </text>
            </g>
          )}

          {/* Ears */}
          <g>
            {/* Left Ear */}
            <path
              d={resolvedMood === 'sleepy' ? 'M22 28 L35 44 L16 42 Z' : 'M24 20 L35 40 L18 38 Z'}
              fill="#D9483B"
              stroke="#B83226"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d={resolvedMood === 'sleepy' ? 'M24 30 L33 42 L20 41 Z' : 'M26 24 L33 38 L22 37 Z'}
              fill="#FFF8EE"
            />

            {/* Right Ear */}
            <path
              d={resolvedMood === 'sleepy' ? 'M78 28 L84 44 L65 42 Z' : 'M76 20 L82 38 L65 40 Z'}
              fill="#D9483B"
              stroke="#B83226"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d={resolvedMood === 'sleepy' ? 'M76 30 L80 42 L67 41 Z' : 'M74 24 L78 37 L67 38 Z'}
              fill="#FFF8EE"
            />
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
            stroke="#14110F"
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

          {/* EYES with dynamic pupil offset & blinking */}
          {isBlinking ? (
            /* Closed blinking slit eyes */
            <g>
              <path
                d="M33 50 Q39 53 44 50"
                stroke="#14110F"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M56 50 Q61 53 67 50"
                stroke="#14110F"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ) : resolvedMood === 'sleepy' ? (
            /* Gentle sleepy closed eyes */
            <g>
              <path
                d="M33 51 Q39 55 44 51"
                stroke="#14110F"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M56 51 Q61 55 67 51"
                stroke="#14110F"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ) : resolvedMood === 'celebrating' ? (
            /* Ecstatic squinting closed eyes > < */
            <g>
              <path
                d="M32 47 L43 52 L32 57"
                stroke="#14110F"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M68 47 L57 52 L68 57"
                stroke="#14110F"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : resolvedMood === 'fired_up' ? (
            /* Determined sparkling eyes with pointer tracking pupils */
            <g>
              <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                <circle cx="38" cy="49" r="4.6" fill="#14110F" />
                <circle cx="36.5" cy="47" r="1.8" fill="#FFFFFF" />
                <polygon points="40,51 41,52 42,51 41,50" fill="#F59E0B" />

                <circle cx="62" cy="49" r="4.6" fill="#14110F" />
                <circle cx="60.5" cy="47" r="1.8" fill="#FFFFFF" />
                <polygon points="64,51 65,52 66,51 65,50" fill="#F59E0B" />
              </g>
              {/* Fierce angled brows */}
              <path d="M32 42 L43 45" stroke="#14110F" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M68 42 L57 45" stroke="#14110F" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          ) : resolvedMood === 'curious' ? (
            /* Curious wide eyes with pointer tracking */
            <g>
              <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                <ellipse cx="38" cy="49" rx="4.5" ry="5.5" fill="#14110F" />
                <circle cx="36" cy="47" r="1.8" fill="#FFFFFF" />
                <circle cx="40" cy="51" r="0.9" fill="#FFFFFF" />

                <ellipse cx="62" cy="49" rx="4.5" ry="5.5" fill="#14110F" />
                <circle cx="60" cy="47" r="1.8" fill="#FFFFFF" />
                <circle cx="64" cy="51" r="0.9" fill="#FFFFFF" />
              </g>
              <path d="M33 41 Q39 38 43 42" stroke="#14110F" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M57 43 Q62 38 67 40" stroke="#14110F" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          ) : resolvedMood === 'thinking' ? (
            /* Eyes looking up pensively with pointer tracking */
            <g>
              <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                <circle cx="38" cy="46" r="4.2" fill="#14110F" />
                <circle cx="39.5" cy="44.5" r="1.6" fill="#FFFFFF" />
                <circle cx="62" cy="46" r="4.2" fill="#14110F" />
                <circle cx="63.5" cy="44.5" r="1.6" fill="#FFFFFF" />
              </g>
              <path d="M56 40 L65 43" stroke="#14110F" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          ) : (
            /* Welcoming / Happy joyful eyes */
            <g>
              <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                <path
                  d="M33 50 Q39 44 44 50"
                  stroke="#14110F"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M56 50 Q61 44 67 50"
                  stroke="#14110F"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </g>
          )}

          {/* Cute Nose */}
          <polygon points="48,58 52,58 50,61" fill="#14110F" />

          {/* Gentle Mouth */}
          <path
            d={
              resolvedMood === 'fired_up' || resolvedMood === 'celebrating'
                ? 'M44 63 Q50 71 56 63'
                : 'M45 63 Q50 67 55 63'
            }
            stroke="#14110F"
            strokeWidth="2"
            fill={resolvedMood === 'fired_up' || resolvedMood === 'celebrating' ? '#D9483B' : 'none'}
            strokeLinecap="round"
          />

          {/* Front Paws */}
          <g>
            <ellipse cx="40" cy="74" rx="5.5" ry="4" fill="#FFFDF9" stroke="#14110F" strokeWidth="1.8" />
            <ellipse cx="60" cy="74" rx="5.5" ry="4" fill="#FFFDF9" stroke="#14110F" strokeWidth="1.8" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
