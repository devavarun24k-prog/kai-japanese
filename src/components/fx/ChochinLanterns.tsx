// src/components/fx/ChochinLanterns.tsx
// Authentic Japanese hanging Chochin (提灯) festival lanterns.
// Features:
// - 3 lanterns on desktop (swaying with subtle spring physics), 2 on mobile.
// - Pointer proximity glow when within ~150px (desktop only).
// - Center lantern houses glowing Wanakana display text.
// - Animate only transform and opacity. Respects prefers-reduced-motion.
import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface ChochinLanternsProps {
  centerKanaText?: string;
  className?: string;
}

interface SingleLanternProps {
  xPercent: number;
  cordLength: number;
  width: number;
  height: number;
  label: string;
  isCenter?: boolean;
  swayDuration: number;
  swayDelay: number;
  cursorPos: { x: number; y: number } | null;
  isMobile: boolean;
  shouldReduceMotion: boolean | null;
}

const SingleLantern: React.FC<SingleLanternProps> = ({
  xPercent,
  cordLength,
  width,
  height,
  label,
  isCenter = false,
  swayDuration,
  swayDelay,
  cursorPos,
  isMobile,
  shouldReduceMotion
}) => {
  const lanternRef = useRef<HTMLDivElement>(null);
  const [proximityGlow, setProximityGlow] = useState(0);

  useEffect(() => {
    if (isMobile || !cursorPos || !lanternRef.current) {
      setProximityGlow(0);
      return;
    }

    const rect = lanternRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dist = Math.hypot(cursorPos.x - centerX, cursorPos.y - centerY);
    const maxDist = 160;

    if (dist < maxDist) {
      const glow = Math.max(0, 1 - dist / maxDist);
      setProximityGlow(glow);
    } else {
      setProximityGlow(0);
    }
  }, [cursorPos, isMobile]);

  // Base warm glow + proximity boost
  const baseGlow = isCenter ? 0.35 : 0.2;
  const totalGlow = Math.min(1, baseGlow + proximityGlow * 0.65);
  const glowDropShadow = `0 10px 25px rgba(217, 72, 59, ${0.25 + totalGlow * 0.45}), 0 0 ${15 + totalGlow * 25}px rgba(226, 186, 78, ${0.2 + totalGlow * 0.5})`;

  return (
    <div
      ref={lanternRef}
      className="absolute top-0 flex flex-col items-center pointer-events-none select-none"
      style={{
        left: `${xPercent}%`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Black Cord hanging from ceiling/eaves */}
      <div
        className="w-[1.5px] bg-gradient-to-b from-[#0A101C] via-[#31313D] to-[#14110F]"
        style={{ height: `${cordLength}px` }}
      />

      {/* Swaying Lantern Body */}
      <motion.div
        className="relative origin-top"
        animate={
          shouldReduceMotion
            ? { rotate: 0 }
            : {
                rotate: [-2, 2, -2]
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: swayDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: swayDelay
              }
        }
        style={{
          width: `${width}px`,
          height: `${height}px`,
          filter: `drop-shadow(${glowDropShadow})`
        }}
      >
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Paper Lantern Gradient */}
            <radialGradient id={`lanternGrad-${label}`} cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#F5A25D" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#D9483B" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#9E2B1E" stopOpacity="1" />
            </radialGradient>

            {/* Inner Core Light Glow */}
            <radialGradient id={`coreGlow-${label}`} cx="50%" cy="50%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.8 + totalGlow * 0.2} />
              <stop offset="70%" stopColor="#FFE082" stopOpacity={0.5 + totalGlow * 0.4} />
              <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Top Hanging Ring */}
          <circle cx="50" cy="6" r="4.5" fill="none" stroke="#C59B27" strokeWidth="2" />

          {/* Top Wooden Lacquer Collar */}
          <rect x="36" y="8" width="28" height="6" rx="2" fill="#14110F" stroke="#3D3833" strokeWidth="0.8" />
          <line x1="38" y1="11" x2="62" y2="11" stroke="#C59B27" strokeWidth="0.8" opacity="0.6" />

          {/* Main Paper Barrel Body */}
          <path
            d="M 37 14 C 20 22, 12 55, 14 78 C 16 100, 24 116, 37 120 L 63 120 C 76 116, 84 100, 86 78 C 88 55, 80 22, 63 14 Z"
            fill={`url(#lanternGrad-${label})`}
            stroke="#631F17"
            strokeWidth="1.2"
          />

          {/* Horizontal Bamboo Ribs (Higo / 籤) */}
          <path d="M 27 30 Q 50 34 73 30" fill="none" stroke="#631F17" strokeWidth="0.8" opacity="0.4" />
          <path d="M 18 50 Q 50 56 82 50" fill="none" stroke="#631F17" strokeWidth="0.8" opacity="0.4" />
          <path d="M 14 72 Q 50 80 86 72" fill="none" stroke="#631F17" strokeWidth="0.8" opacity="0.4" />
          <path d="M 18 94 Q 50 100 82 94" fill="none" stroke="#631F17" strokeWidth="0.8" opacity="0.4" />
          <path d="M 28 110 Q 50 114 72 110" fill="none" stroke="#631F17" strokeWidth="0.8" opacity="0.4" />

          {/* Core Ambient Light Center */}
          <ellipse cx="50" cy="68" rx="28" ry="34" fill={`url(#coreGlow-${label})`} />

          {/* Bottom Wooden Lacquer Collar */}
          <rect x="36" y="119" width="28" height="6" rx="2" fill="#14110F" stroke="#3D3833" strokeWidth="0.8" />
          <line x1="38" y1="122" x2="62" y2="122" stroke="#C59B27" strokeWidth="0.8" opacity="0.6" />

          {/* Bottom Hanging Tassel (Fusa / 房) */}
          <line x1="50" y1="125" x2="50" y2="135" stroke="#C59B27" strokeWidth="1.5" />
          <polygon points="46,135 54,135 52,148 48,148" fill="#B83226" opacity="0.9" />
        </svg>

        {/* Written Character on Paper */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ top: '6px' }}
        >
          <span
            className={`font-serif_jp font-bold select-none text-center transition-all duration-200 ${
              isCenter
                ? 'text-lg sm:text-2xl text-[#14110F] drop-shadow-[0_1px_3px_rgba(255,245,200,0.8)]'
                : 'text-xl sm:text-2xl text-[#14110F]/85 drop-shadow-[0_1px_2px_rgba(255,240,180,0.6)]'
            }`}
            style={{
              writingMode: isCenter && label.length > 2 ? 'horizontal-tb' : 'vertical-rl',
              textOrientation: 'upright',
              letterSpacing: '0.15em'
            }}
          >
            {label}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export const ChochinLanterns: React.FC<ChochinLanternsProps> = ({
  centerKanaText,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Center lantern text priority: interactive typed kana if provided, else '祭'
  const centerDisplay = centerKanaText?.trim() ? centerKanaText : '界';

  return (
    <div
      className={`absolute inset-x-0 top-0 h-44 sm:h-56 pointer-events-none overflow-visible z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Mobile: 2 lanterns. Desktop: 3 lanterns */}
      {isMobile ? (
        <>
          {/* Mobile Left */}
          <SingleLantern
            xPercent={24}
            cordLength={18}
            width={64}
            height={88}
            label="祭"
            swayDuration={4.8}
            swayDelay={0}
            cursorPos={null}
            isMobile={true}
            shouldReduceMotion={shouldReduceMotion}
          />
          {/* Mobile Right (With live text) */}
          <SingleLantern
            xPercent={76}
            cordLength={26}
            width={72}
            height={98}
            label={centerDisplay}
            isCenter={true}
            swayDuration={5.4}
            swayDelay={0.8}
            cursorPos={null}
            isMobile={true}
            shouldReduceMotion={shouldReduceMotion}
          />
        </>
      ) : (
        <>
          {/* Desktop Left Lantern */}
          <SingleLantern
            xPercent={20}
            cordLength={28}
            width={78}
            height={104}
            label="祭"
            swayDuration={5.2}
            swayDelay={0}
            cursorPos={cursorPos}
            isMobile={false}
            shouldReduceMotion={shouldReduceMotion}
          />
          {/* Desktop Center Lantern (Interactive Glowing Kana) */}
          <SingleLantern
            xPercent={50}
            cordLength={14}
            width={94}
            height={124}
            label={centerDisplay}
            isCenter={true}
            swayDuration={6.0}
            swayDelay={0.5}
            cursorPos={cursorPos}
            isMobile={false}
            shouldReduceMotion={shouldReduceMotion}
          />
          {/* Desktop Right Lantern */}
          <SingleLantern
            xPercent={80}
            cordLength={34}
            width={78}
            height={104}
            label="道"
            swayDuration={5.6}
            swayDelay={1.1}
            cursorPos={cursorPos}
            isMobile={false}
            shouldReduceMotion={shouldReduceMotion}
          />
        </>
      )}
    </div>
  );
};
