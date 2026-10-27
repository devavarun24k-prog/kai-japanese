// src/components/common/CustomCursor.tsx
// Magnetic glowing Japanese ink cursor with dynamic trailing ring
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  // Spring physics for trailing motion
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(-100, springConfig);
  const smoothY = useSpring(-100, springConfig);

  const dotConfig = { damping: 45, stiffness: 800 };
  const dotX = useSpring(-100, dotConfig);
  const dotY = useSpring(-100, dotConfig);

  useEffect(() => {
    // Only enable custom cursor for precise pointer devices (desktop mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorRef.current = { x: e.clientX, y: e.clientY };

      smoothX.set(e.clientX);
      smoothY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      // Check if hovering over clickable or magnetic element
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('[role="button"]') ||
        target?.closest('[data-magnetic]') ||
        target?.tagName === 'INPUT'
      ) {
        setIsHoveringInteractive(true);
      } else {
        setIsHoveringInteractive(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, smoothX, smoothY, dotX, dotY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Trailing Soft Washi / Red Glow Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#E63946]/60 backdrop-blur-[1px] shadow-[0_0_15px_rgba(230,57,70,0.35)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHoveringInteractive ? 54 : 34,
          height: isHoveringInteractive ? 54 : 34,
          backgroundColor: isHoveringInteractive ? 'rgba(230, 57, 70, 0.12)' : 'transparent',
          transition: 'width 0.22s ease-out, height 0.22s ease-out, background-color 0.22s ease-out'
        }}
      />

      {/* Center Precise Ink/Gold Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-[#F4C26B] shadow-[0_0_8px_#F4C26B]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHoveringInteractive ? 6 : 4,
          height: isHoveringInteractive ? 6 : 4
        }}
      />
    </div>
  );
};
