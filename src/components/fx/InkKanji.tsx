// src/components/fx/InkKanji.tsx
// Draws an authentic SVG kanji stroke-by-stroke using stroke-dashoffset & framer-motion
// Only animates transform and opacity / pathLength. Respects prefers-reduced-motion.
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface InkKanjiProps {
  paths?: string[];
  duration?: number;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  delay?: number;
  viewBox?: string;
  onComplete?: () => void;
}

// Default standard stroke paths for the signature KAI kanji: 界 (9 strokes)
export const KAI_KANJI_STROKES = [
  'M 32 18 L 32 46', // 1. 田 left vertical
  'M 32 19 L 68 19 L 68 46', // 2. 田 top horizontal & right vertical
  'M 50 19 L 50 46', // 3. 田 center vertical
  'M 32 32 L 68 32', // 4. 田 middle horizontal
  'M 32 46 L 68 46', // 5. 田 bottom horizontal
  'M 48 52 Q 36 68 22 78', // 6. 介 left diagonal sweep
  'M 52 52 Q 64 68 80 80', // 7. 介 right diagonal sweep
  'M 42 63 L 42 88', // 8. 介 inner left vertical
  'M 58 63 L 58 88' // 9. 介 inner right vertical
];

export const InkKanji: React.FC<InkKanjiProps> = ({
  paths = KAI_KANJI_STROKES,
  duration = 2.4,
  size = 120,
  color = '#1A1817',
  strokeWidth = 5.5,
  className = '',
  delay = 0.2,
  viewBox = '0 0 100 100',
  onComplete
}) => {
  const shouldReduceMotion = useReducedMotion();
  const strokeCount = paths.length;
  const strokeDuration = duration / Math.max(strokeCount, 1);

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      className={`overflow-visible select-none ${className}`}
      aria-label="Japanese Kanji"
      role="img"
    >
      {paths.map((d, index) => {
        const strokeDelay = shouldReduceMotion ? 0 : delay + index * (strokeDuration * 0.85);

        return (
          <motion.path
            key={`${d}-${index}`}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: shouldReduceMotion ? 0 : strokeDuration,
                delay: strokeDelay,
                ease: [0.25, 0.1, 0.25, 1.0]
              },
              opacity: {
                duration: shouldReduceMotion ? 0 : 0.1,
                delay: strokeDelay
              }
            }}
            onAnimationComplete={index === strokeCount - 1 ? onComplete : undefined}
          />
        );
      })}
    </svg>
  );
};
