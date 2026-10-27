// src/components/landing/FilmCurtainLoader.tsx
// Cinematic 2.39:1 film opening with ink-brush kanji reveal and curtain partition
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilmCurtainLoaderProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export const FilmCurtainLoader: React.FC<FilmCurtainLoaderProps> = ({
  onComplete,
  minDurationMs = 2400
}) => {
  const [progress, setProgress] = useState(0);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const frac = Math.min(1, elapsed / minDurationMs);
      // Ease in-out
      const eased = frac < 0.5 ? 2 * frac * frac : -1 + (4 - 2 * frac) * frac;
      const currentPct = Math.floor(eased * 100);

      setProgress(currentPct);

      if (frac < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsOpening(true);
          setTimeout(onComplete, 950);
        }, 350);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence>
      {!isOpening && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-between pointer-events-auto bg-[#07070C] select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Top 2.39:1 Film Letterbox Bar */}
          <motion.div
            className="w-full bg-[#030305] z-20 flex items-center justify-between px-8 py-4 border-b border-white/5"
            style={{ height: '11vh' }}
            exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          >
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
              KAI • CINEMATIC EXPERIENCE
            </span>
            <span className="text-[10px] font-serif_jp text-white/30 tracking-widest">
              界 • 日本語の世界
            </span>
          </motion.div>

          {/* Center Stage: Ink Brush Reveal & Serif Counter */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-6">
            {/* Background Radial Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.06)_0%,transparent_65%)] pointer-events-none" />

            {/* Kanji "改" Ink Stroke Silhouette */}
            <div className="relative mb-6">
              <svg width="140" height="140" viewBox="0 0 100 100" className="drop-shadow-[0_0_25px_rgba(230,57,70,0.4)]">
                {/* Hanko Stamp Background */}
                <rect x="14" y="14" width="72" height="72" rx="14" fill="#E63946" fillOpacity="0.08" stroke="#E63946" strokeWidth="1.2" strokeOpacity="0.4" />
                <rect x="18" y="18" width="64" height="64" rx="10" fill="none" stroke="#E63946" strokeWidth="0.8" strokeDasharray="3,3" strokeOpacity="0.5" />

                {/* Animated Kanji Character "改" */}
                <text
                  x="50"
                  y="62"
                  textAnchor="middle"
                  fontFamily="'Shippori Mincho', 'Noto Serif JP', serif"
                  fontSize="48"
                  fontWeight="bold"
                  fill="#F5EFE6"
                  className="transition-all duration-300"
                  style={{
                    filter: `drop-shadow(0 0 ${progress * 0.15}px rgba(244, 194, 107, 0.7))`
                  }}
                >
                  改
                </text>
              </svg>

              {/* Red Seal Inscription */}
              <div className="absolute -bottom-2 right-1 px-1.5 py-0.5 rounded bg-[#E63946] text-white text-[9px] font-serif_jp font-bold shadow-md">
                界
              </div>
            </div>

            {/* Cinematic Title & Tagline */}
            <h2 className="text-xl sm:text-2xl font-serif_jp text-[#F5EFE6] tracking-[0.25em] font-semibold uppercase mb-1">
              KAI
            </h2>
            <p className="text-xs font-serif_jp text-white/50 tracking-[0.18em] mb-8">
              日本語マスター • 始動
            </p>

            {/* Thin Serif Percentage Counter */}
            <div className="flex items-baseline gap-1 font-serif_jp">
              <span className="text-3xl sm:text-4xl font-light text-[#F4C26B] tracking-wider">
                {progress}
              </span>
              <span className="text-xs font-mono text-[#F4C26B]/60">%</span>
            </div>

            {/* Subtle Progress Bar Line */}
            <div className="w-36 h-[2px] bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E63946] to-[#F4C26B] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom 2.39:1 Film Letterbox Bar */}
          <motion.div
            className="w-full bg-[#030305] z-20 flex items-center justify-between px-8 py-4 border-t border-white/5"
            style={{ height: '11vh' }}
            exit={{ y: '100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          >
            <span className="text-[10px] font-mono tracking-widest text-white/30">
              FRAME 2.39:1 • 4K
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/30">
              SCENE 01 / JOURNEY
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
