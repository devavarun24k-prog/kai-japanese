// src/components/fx/TiltCard.tsx
// 3D perspective card with reactive tilt physics and dynamic moving glare highlight
// Only animates transform and opacity. Respects prefers-reduced-motion.
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  scaleHover?: number;
  glareOpacity?: number;
  className?: string;
  perspective?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 12,
  scaleHover = 1.02,
  glareOpacity = 0.18,
  className = '',
  perspective = 1000,
  ...divProps
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Normalized mouse coordinates from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Pixel coordinates for glare gradient
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.1 };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);
  const scale = useSpring(isHovered ? scaleHover : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);

    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const glareStyle = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, ${
        isHovered ? glareOpacity : 0
      }) 0%, rgba(255, 255, 255, 0) 65%)`
  );

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="relative inline-block w-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                scale,
                transformStyle: 'preserve-3d'
              }
        }
        className={`relative overflow-hidden ${className}`}
        {...(divProps as any)}
      >
        {children}

        {/* Dynamic Specular Glare Highlight */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
            style={{
              background: glareStyle,
              opacity: isHovered ? 1 : 0
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  );
};
