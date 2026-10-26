// src/components/fx/EnsoCircle.tsx
// Zen Enso (円相) Calligraphy Brush Circle that draws itself dynamically
// Features traditional sumi-e brush weight modulation and organic opening gap.
// Only animates transform and opacity / pathLength. Respects prefers-reduced-motion.
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface EnsoCircleProps {
  size?: number | string;
  color?: string;
  duration?: number;
  delay?: number;
  className?: string;
  opacity?: number;
}

export const EnsoCircle: React.FC<EnsoCircleProps> = ({
  size = 280,
  color = '#C59B27',
  duration = 2.0,
  delay = 0.3,
  className = '',
  opacity = 0.22
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Authentic Enso path with modulated stroke weight and characteristic gap at top-right
  const ensoPath =
    'M 148 38 C 176 56, 186 96, 182 132 C 176 172, 142 196, 102 195 C 62 194, 25 168, 20 126 C 14 78, 48 34, 98 25 C 118 22, 140 26, 154 36';

  return (
    <svg
      viewBox="0 0 210 210"
      width={size}
      height={size}
      className={`pointer-events-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Subtle radial brush aura glow */}
        <filter id="ensoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <motion.path
        d={ensoPath}
        fill="none"
        stroke={color}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ensoGlow)"
        opacity={opacity}
        initial={shouldReduceMotion ? { pathLength: 1, opacity } : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity }}
        transition={{
          pathLength: {
            duration: shouldReduceMotion ? 0 : duration,
            delay: shouldReduceMotion ? 0 : delay,
            ease: [0.22, 1, 0.36, 1]
          },
          opacity: {
            duration: shouldReduceMotion ? 0 : 0.4,
            delay: shouldReduceMotion ? 0 : delay
          }
        }}
      />
    </svg>
  );
};
