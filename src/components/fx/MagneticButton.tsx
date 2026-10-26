// src/components/fx/MagneticButton.tsx
// Magnetic attraction button that follows cursor proximity smoothly
// Only animates transform. Respects prefers-reduced-motion.
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  magneticRadius?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.35,
  magneticRadius = 100,
  className = '',
  disabled = false,
  ...buttonProps
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for magnetic pull
  const springConfig = { damping: 15, stiffness: 180, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < magneticRadius) {
      mouseX.set(deltaX * strength);
      mouseY.set(deltaY * strength);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={shouldReduceMotion ? undefined : { x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.03 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.96 }}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      {...(buttonProps as any)}
    >
      {children}
    </motion.button>
  );
};
