// src/components/fx/patterns.tsx
// Authentic Japanese traditional patterns & washi textures built directly in SVG code
// Includes: Seigaiha (waves), Asanoha (hemp leaf), Shippo (interlocking circles),
// WashiTexture (static feTurbulence grain), and GoldFlecks (sparse kinpaku gold leaf).
import React, { useId } from 'react';

// ============================================================================
// 1. SEIGAIHA (青海波) — Overlapping Ocean Waves
// Represents surges of good fortune and tranquil waters.
// ============================================================================
export interface PatternProps {
  color?: string;
  opacity?: number;
  size?: number;
  className?: string;
}

export const Seigaiha: React.FC<PatternProps> = ({
  color = '#2E4370',
  opacity = 0.06,
  size = 54,
  className = ''
}) => {
  const patternId = useId();

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width={size}
          height={size / 2}
          patternUnits="userSpaceOnUse"
        >
          {/* Top-center arch */}
          <g fill="none" stroke={color} strokeWidth="1.2">
            <circle cx={size / 2} cy="0" r={size * 0.45} />
            <circle cx={size / 2} cy="0" r={size * 0.3} />
            <circle cx={size / 2} cy="0" r={size * 0.15} />

            {/* Bottom-left arch */}
            <circle cx="0" cy={size / 2} r={size * 0.45} />
            <circle cx="0" cy={size / 2} r={size * 0.3} />
            <circle cx="0" cy={size / 2} r={size * 0.15} />

            {/* Bottom-right arch */}
            <circle cx={size} cy={size / 2} r={size * 0.45} />
            <circle cx={size} cy={size / 2} r={size * 0.3} />
            <circle cx={size} cy={size / 2} r={size * 0.15} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
};

// ============================================================================
// 2. ASANOHA (麻の葉) — Sacred Hemp Leaf Lattice
// Represents resilient growth and protection against misfortune.
// ============================================================================
export const Asanoha: React.FC<PatternProps> = ({
  color = '#C59B27',
  opacity = 0.05,
  size = 48,
  className = ''
}) => {
  const patternId = useId();
  const w = size;
  const h = size * 1.732; // sqrt(3) ratio for equilateral triangles

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width={w}
          height={h}
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke={color} strokeWidth="1">
            {/* Outer Diamond / Hexagonal Lattice */}
            <path d={`M 0 0 L ${w} ${h / 2} L 0 ${h} Z`} />
            <path d={`M ${w} 0 L 0 ${h / 2} L ${w} ${h} Z`} />

            {/* Internal radial spokes from center */}
            <line x1="0" y1={h / 2} x2={w} y2={h / 2} />
            <line x1={w / 2} y1="0" x2={w / 2} y2={h} />
            <line x1={w / 2} y1={h / 4} x2="0" y2={h / 2} />
            <line x1={w / 2} y1={h / 4} x2={w} y2={h / 2} />
            <line x1={w / 2} y1={(3 * h) / 4} x2="0" y2={h / 2} />
            <line x1={w / 2} y1={(3 * h) / 4} x2={w} y2={h / 2} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
};

// ============================================================================
// 3. SHIPPO (七宝) — Seven Treasures Interlocking Circles
// Represents boundless harmony, good relations, and flourishing fortune.
// ============================================================================
export const Shippo: React.FC<PatternProps> = ({
  color = '#2E4370',
  opacity = 0.05,
  size = 40,
  className = ''
}) => {
  const patternId = useId();
  const r = size / 2;

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke={color} strokeWidth="1">
            {/* Center circle */}
            <circle cx={r} cy={r} r={r} />
            {/* 4 Corner overlapping quadrants */}
            <circle cx="0" cy="0" r={r} />
            <circle cx={size} cy="0" r={r} />
            <circle cx="0" cy={size} r={r} />
            <circle cx={size} cy={size} r={r} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
};

// ============================================================================
// 4. WASHI TEXTURE — Authentic Japanese Mulberry Paper Grain
// Pure static SVG feTurbulence filter (Zero CPU animation, static noise).
// ============================================================================
export interface WashiTextureProps {
  opacity?: number;
  className?: string;
  tone?: 'light' | 'dark';
}

export const WashiTexture: React.FC<WashiTextureProps> = ({
  opacity = 0.065,
  className = '',
  tone = 'light'
}) => {
  const filterId = useId();

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values={
              tone === 'light'
                ? '0 0 0 0 0.85  0 0 0 0 0.82  0 0 0 0 0.76  0 0 0 0.9 0'
                : '0 0 0 0 0.1   0 0 0 0 0.1   0 0 0 0 0.12  0 0 0 0.9 0'
            }
          />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} opacity={opacity} />
    </svg>
  );
};

// ============================================================================
// 5. GOLDFLECKS (金箔 - Kinpaku) — Sparse Gold Leaf Flakes
// Static scattered gold foil fragments used in traditional folding screens.
// ============================================================================
export interface GoldFlecksProps {
  density?: 'sparse' | 'normal' | 'dense';
  className?: string;
}

export const GoldFlecks: React.FC<GoldFlecksProps> = ({
  density = 'sparse',
  className = ''
}) => {
  // Deterministic positions to avoid hydration mismatch
  const flecks = [
    { x: '8%', y: '14%', s: 3.5, r: 24, o: 0.65 },
    { x: '19%', y: '72%', s: 2.2, r: 68, o: 0.45 },
    { x: '34%', y: '28%', s: 4.8, r: 12, o: 0.7 },
    { x: '45%', y: '86%', s: 3.0, r: 45, o: 0.5 },
    { x: '62%', y: '18%', s: 4.0, r: 82, o: 0.6 },
    { x: '78%', y: '64%', s: 2.8, r: 30, o: 0.55 },
    { x: '88%', y: '32%', s: 5.2, r: 54, o: 0.75 },
    { x: '92%', y: '82%', s: 3.2, r: 96, o: 0.48 },
    { x: '14%', y: '42%', s: 2.5, r: 18, o: 0.52 },
    { x: '53%', y: '48%', s: 4.2, r: 75, o: 0.68 },
    { x: '71%', y: '92%', s: 3.6, r: 40, o: 0.42 },
    { x: '26%', y: '90%', s: 2.0, r: 60, o: 0.38 }
  ];

  const count = density === 'sparse' ? 8 : density === 'dense' ? 12 : 10;
  const activeFlecks = flecks.slice(0, count);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {activeFlecks.map((f, i) => (
        <span
          key={i}
          className="absolute block rounded-[1px] bg-gradient-to-br from-[#E2BA4E] to-[#C59B27] shadow-[0_0_4px_rgba(197,155,39,0.3)]"
          style={{
            left: f.x,
            top: f.y,
            width: `${f.s}px`,
            height: `${f.s * 1.3}px`,
            transform: `rotate(${f.r}deg)`,
            opacity: f.o
          }}
        />
      ))}
    </div>
  );
};
