// src/components/kana/KanaStrokeAnimator.tsx
// Animated KanjiVG SVG stroke order animator with numbered stroke badges and reduced-motion support
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, RotateCcw, Pause } from 'lucide-react';

interface KanaStrokeAnimatorProps {
  character: string;
  strokePaths: string[];
  strokeDirections?: string[];
  size?: number;
}

export const KanaStrokeAnimator: React.FC<KanaStrokeAnimatorProps> = ({
  character,
  strokePaths,
  strokeDirections = [],
  size = 200
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeStrokeIdx, setActiveStrokeIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Parse start coordinate from SVG path string 'M x y ...'
  const strokeStartPoints = strokePaths.map((p) => {
    const match = p.match(/M\s*([\d.]+)\s+([\d.]+)/i);
    if (match) {
      return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
    }
    return { x: 50, y: 50 };
  });

  // Cycle through strokes sequentially
  useEffect(() => {
    if (shouldReduceMotion || !isPlaying) return;

    const timer = setInterval(() => {
      setActiveStrokeIdx((prev) => {
        if (prev + 1 >= strokePaths.length) {
          return 0;
        }
        return prev + 1;
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [isPlaying, strokePaths.length, shouldReduceMotion]);

  const handleReplay = () => {
    setActiveStrokeIdx(0);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG Container with 4-Quadrant Japanese practice grid */}
      <div
        className="relative rounded-2xl bg-[#FAF7F2] border-2 border-[#D5CBC0] shadow-inner overflow-hidden select-none"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          aria-label={`Stroke order animation for ${character}`}
        >
          {/* 4-Quadrant Dashed Guidelines */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="#E2DAD0"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="#E2DAD0"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#EFE8DE" strokeWidth="0.6" strokeDasharray="3,3" />

          {/* Background ghost outline of full character */}
          <g opacity="0.12">
            {strokePaths.map((path, idx) => (
              <path
                key={`ghost-${idx}`}
                d={path}
                fill="none"
                stroke="#1A1817"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Sequential Animated Strokes */}
          {strokePaths.map((path, idx) => {
            const isCompleted = shouldReduceMotion || idx < activeStrokeIdx;
            const isCurrent = !shouldReduceMotion && idx === activeStrokeIdx;

            if (!shouldReduceMotion && idx > activeStrokeIdx) return null;

            return (
              <motion.path
                key={`stroke-${idx}-${activeStrokeIdx}`}
                d={path}
                fill="none"
                stroke={isCurrent ? '#D9483B' : '#1A1817'}
                strokeWidth={isCurrent ? '7.5' : '6.8'}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isCurrent ? { pathLength: 0 } : { pathLength: 1 }}
                animate={{ pathLength: 1 }}
                transition={
                  isCurrent
                    ? { duration: 0.9, ease: 'easeInOut' }
                    : { duration: 0 }
                }
              />
            );
          })}

          {/* Numbered Stroke Starting Badges */}
          {strokeStartPoints.map((pt, idx) => {
            const isCurrent = !shouldReduceMotion && idx === activeStrokeIdx;
            const isCompleted = shouldReduceMotion || idx <= activeStrokeIdx;

            // Offset badge slightly away from path start so it doesn't obstruct
            const badgeX = Math.max(5, Math.min(95, pt.x <= 50 ? pt.x - 4 : pt.x + 4));
            const badgeY = Math.max(5, Math.min(95, pt.y <= 50 ? pt.y - 4 : pt.y + 4));

            return (
              <g key={`badge-${idx}`}>
                <circle
                  cx={badgeX}
                  cy={badgeY}
                  r={isCurrent ? '4.8' : '3.8'}
                  fill={isCurrent ? '#D9483B' : isCompleted ? '#2E4370' : '#8A847C'}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                />
                <text
                  x={badgeX}
                  y={badgeY + 1.2}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={isCurrent ? '4' : '3.2'}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Current stroke indicator pill */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 border border-stone-200 text-3xs font-mono font-bold text-kai-ink shadow-xs">
          Stroke {activeStrokeIdx + 1} of {strokePaths.length}
        </div>
      </div>

      {/* Control bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-kai-ink dark:text-white transition-colors"
          title={isPlaying ? 'Pause animation' : 'Play animation'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>

        <button
          type="button"
          onClick={handleReplay}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-kai-ink dark:text-white transition-colors"
          title="Replay stroke sequence"
        >
          <RotateCcw size={13} />
        </button>

        {strokeDirections[activeStrokeIdx] && (
          <span className="text-3xs text-kai-muted font-medium truncate max-w-[200px]">
            {strokeDirections[activeStrokeIdx]}
          </span>
        )}
      </div>

      {/* KanjiVG CC BY-SA 3.0 Credits Notice */}
      <p className="text-3xs text-kai-muted text-center max-w-xs leading-tight">
        Stroke paths derived from <strong>KanjiVG</strong> (Ulrich Apel), licensed under{' '}
        <span className="underline">CC BY-SA 3.0</span>.
      </p>
    </div>
  );
};
