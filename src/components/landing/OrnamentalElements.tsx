// src/components/landing/OrnamentalElements.tsx
// Reusable Dark Ornamental Japanese Graphic Elements & Transitions
// Antique gold, midnight indigo, traditional clouds (雲文), and sacred geometry
import React from 'react';
import { motion } from 'framer-motion';

// Antique gold rotating ornamental medallion
export const OrnamentalCircle: React.FC<{
  size?: number;
  className?: string;
  rotating?: boolean;
}> = ({ size = 260, className = '', rotating = true }) => {
  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer slow counter-rotating delicate ring */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full opacity-60"
        animate={rotating ? { rotate: -360 } : undefined}
        transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="100" cy="100" r="96" fill="none" stroke="#B99A60" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.6" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="#B99A60" strokeWidth="0.5" opacity="0.4" />
        {/* Cardinal tick accents */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="4"
            x2="100"
            y2="10"
            stroke="#B99A60"
            strokeWidth="1.2"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </motion.svg>

      {/* Middle rotating sacred geometry ring */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full opacity-80"
        animate={rotating ? { rotate: 360 } : undefined}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="100" cy="100" r="82" fill="none" stroke="#B99A60" strokeWidth="1" />
        <circle cx="100" cy="100" r="76" fill="none" stroke="#B99A60" strokeWidth="0.6" strokeDasharray="1 3" />

        {/* 12-petaled lotus / chrysanth medallion spokes */}
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 100 100)`}>
            <path
              d="M 100 22 C 104 36 104 54 100 68 C 96 54 96 36 100 22 Z"
              fill="none"
              stroke="#B99A60"
              strokeWidth="0.8"
              opacity="0.75"
            />
            <circle cx="100" cy="22" r="1.5" fill="#B99A60" />
          </g>
        ))}
      </motion.svg>

      {/* Inner stable ornamental core */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <circle cx="100" cy="100" r="54" fill="#101722" stroke="#B99A60" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="48" fill="none" stroke="#A84A3A" strokeWidth="0.8" opacity="0.8" />
        <circle cx="100" cy="100" r="44" fill="none" stroke="#B99A60" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
    </div>
  );
};

// Traditional Japanese Clouds (雲文 - Kumomon)
export const JapaneseCloud: React.FC<{
  className?: string;
  fillColor?: string;
  strokeColor?: string;
  opacity?: number;
}> = ({
  className = '',
  fillColor = '#101722',
  strokeColor = '#B99A60',
  opacity = 0.85
}) => {
  return (
    <svg
      viewBox="0 0 320 120"
      className={`overflow-visible ${className}`}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d="M 20 80 
           C 20 55, 45 40, 70 45 
           C 80 25, 115 15, 140 30 
           C 160 10, 205 10, 225 30 
           C 255 20, 290 35, 295 65 
           C 310 75, 315 95, 295 105 
           C 275 115, 240 100, 210 105 
           C 180 115, 140 110, 110 105 
           C 80 110, 45 110, 25 95 
           C 15 90, 15 85, 20 80 Z"
        fill="url(#cloudGrad)"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Traditional internal swirl linework */}
      <path
        d="M 65 55 C 55 60 50 72 58 82 C 66 90 78 86 80 76 C 82 66 74 60 68 64"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.8"
        opacity="0.6"
      />
      <path
        d="M 145 40 C 135 48 132 62 142 72 C 150 80 165 76 168 64 C 170 54 160 48 152 52"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.8"
        opacity="0.6"
      />
      <path
        d="M 235 42 C 225 50 224 64 234 74 C 242 82 258 78 260 66"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.8"
        opacity="0.6"
      />
    </svg>
  );
};

// Layered Washi Torn Paper Separator
export const WashiSeparator: React.FC<{
  position?: 'top' | 'bottom';
  className?: string;
  fillColor?: string;
}> = ({ position = 'bottom', className = '', fillColor = '#FAF6EC' }) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none z-20 ${className} ${
        position === 'top' ? 'rotate-180 -mb-1' : '-mt-1'
      }`}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="w-full h-10 sm:h-14 block"
      >
        {/* Shadow fiber layer */}
        <path
          d="M 0 18 Q 180 32 360 16 T 720 28 T 1080 14 T 1440 26 L 1440 60 L 0 60 Z"
          fill="rgba(26, 24, 23, 0.12)"
        />
        {/* Main organic torn washi curve */}
        <path
          d="M 0 24 
             C 120 18, 210 34, 340 22 
             C 480 10, 580 38, 720 20 
             C 860 8, 970 32, 1110 16 
             C 1240 6, 1340 28, 1440 18 
             L 1440 60 L 0 60 Z"
          fill={fillColor}
        />
        {/* Antique Gold Fiber Edge */}
        <path
          d="M 0 24 
             C 120 18, 210 34, 340 22 
             C 480 10, 580 38, 720 20 
             C 860 8, 970 32, 1110 16 
             C 1240 6, 1340 28, 1440 18"
          fill="none"
          stroke="#B99A60"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

// Animated Calligraphy Vector Stroke
export const CalligraphyBrushStroke: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#A84A3A' }) => {
  return (
    <motion.svg
      viewBox="0 0 300 24"
      className={`overflow-visible ${className}`}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 0.9 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.path
        d="M 5 14 Q 75 6 150 12 T 295 10"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
};

// Traditional Japanese Mon Crest for KAI
export const KaiMonCrest: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 64, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full border border-antique-gold/60 dark:border-[#B99A60]/60 p-1">
        <div className="w-full h-full rounded-full border border-dashed border-[#B99A60]/40 flex items-center justify-center">
          <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-[#A84A3A] to-[#8C3A2D] flex items-center justify-center shadow-lg">
            <span className="font-serif_jp font-bold text-white text-xl tracking-wider select-none">
              界
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
