// src/components/fx/HankoStamp.tsx
// Traditional Japanese vermilion Hanko (判子) seal that stamps onto the surface
// Features heavy stamp impact animation (scale + slight organic rotation).
// Only animates transform and opacity. Respects prefers-reduced-motion.
import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { soundEffects } from '../../services/soundEffects';

export interface HankoStampProps {
  text?: string;
  size?: number;
  className?: string;
  delay?: number;
  playSound?: boolean;
  shape?: 'square' | 'circle';
  onStamp?: () => void;
}

export const HankoStamp: React.FC<HankoStampProps> = ({
  text = '界',
  size = 56,
  className = '',
  delay = 0.1,
  playSound = true,
  shape = 'square',
  onStamp
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (playSound && !shouldReduceMotion) {
      const timer = setTimeout(() => {
        soundEffects.playClick();
      }, delay * 1000 + 120);
      return () => clearTimeout(timer);
    }
  }, [playSound, delay, shouldReduceMotion]);

  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 1, scale: 1, rotate: -3 }
          : { opacity: 0, scale: 2.2, rotate: 12 }
      }
      animate={{ opacity: 1, scale: 1, rotate: -3 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.35,
        delay: shouldReduceMotion ? 0 : delay,
        type: 'spring',
        damping: 14,
        stiffness: 340
      }}
      onAnimationComplete={onStamp}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      className={`relative inline-flex items-center justify-center p-1.5 select-none ${className}`}
      aria-label={`Hanko seal: ${text}`}
    >
      {/* Weathered Outer Seal Border (Vermilion Ink) */}
      <div
        className={`w-full h-full ${radius} border-[2.5px] border-[#D9483B] flex items-center justify-center bg-[#D9483B]/10 shadow-[0_0_1px_1px_rgba(217,72,59,0.3)] relative overflow-hidden`}
      >
        {/* Subtle weathered distress marks on seal border */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D9483B_1px,transparent_1px)] [background-size:4px_4px] pointer-events-none" />

        {/* Kanji Glyphs in Seal Script style */}
        <span
          className="font-serif_jp font-black text-[#D9483B] leading-none tracking-tight select-none"
          style={{ fontSize: `${Math.round(size * 0.58)}px` }}
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
};
