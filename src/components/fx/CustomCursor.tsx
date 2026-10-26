// src/components/fx/CustomCursor.tsx
// Subtle editorial Japanese ink cursor active on desktop only (pointer: fine)
// Only animates transform and opacity. Respects prefers-reduced-motion.
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    if (shouldReduceMotion) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024;
    setIsEnabled(isFinePointer);

    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('[role="button"]') ||
        target?.closest('input')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldReduceMotion]);

  if (!isEnabled || shouldReduceMotion) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%'
      }}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.8 : 1,
          opacity: isHovered ? 0.35 : 0.6
        }}
        transition={{ duration: 0.15 }}
        className="w-4 h-4 rounded-full bg-kai-vermilion border border-white shadow-sm"
      />
    </motion.div>
  );
};
