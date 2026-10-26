// src/components/fx/NorenCurtain.tsx
// Authentic Japanese Noren (暖簾) entrance curtain.
// Two indigo cloth panels with center slit that part on page load.
// Skippable by click or keypress; shown once per session via sessionStorage ('kai_noren_seen').
// Strictly animates only transform & opacity. Respects prefers-reduced-motion.
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface NorenCurtainProps {
  onDismiss?: () => void;
  forceShow?: boolean;
}

export const NorenCurtain: React.FC<NorenCurtainProps> = ({
  onDismiss,
  forceShow = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check session storage
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('kai_noren_seen');
      if (hasSeen && !forceShow) {
        setIsVisible(false);
        return;
      }
      if (shouldReduceMotion) {
        sessionStorage.setItem('kai_noren_seen', 'true');
        setIsVisible(false);
        return;
      }
      setIsVisible(true);
    }
  }, [forceShow, shouldReduceMotion]);

  const handleDismiss = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('kai_noren_seen', 'true');
      }
      onDismiss?.();
    }
  }, [isOpen, onDismiss]);

  useEffect(() => {
    if (!isVisible) return;

    // Listen for any key or click to dismiss immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto-open after a brief atmospheric beat (0.4s), taking 1.1s to part (total < 1.5s)
    const autoTimer = setTimeout(() => {
      handleDismiss();
    }, 450);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(autoTimer);
    };
  }, [isVisible, handleDismiss]);

  if (!isVisible) return null;

  return (
    <AnimatePresence onExitComplete={() => setIsVisible(false)}>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none pointer-events-auto"
          onClick={handleDismiss}
          role="button"
          tabIndex={0}
          aria-label="暖簾を開ける (Click or press Space to open curtain)"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.8 }}
        >
          {/* Top Hanging Rod (Bamboo / Dark Wood) */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#1C1613] to-[#0A0706] shadow-md z-20 flex justify-around items-center px-8">
            {/* Hanging loops (Chichi / 乳) */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-6 -mt-2 bg-[#2E4370] border border-[#1C2945] rounded-sm shadow-sm"
              />
            ))}
          </div>

          <div className="relative w-full h-full flex">
            {/* Left Indigo Panel */}
            <motion.div
              className="relative w-1/2 h-full bg-[#0A101C] border-r border-[#1C2945]/40 flex flex-col justify-center items-end pr-6 shadow-2xl overflow-hidden"
              initial={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{
                duration: 1.1,
                ease: [0.33, 1, 0.68, 1]
              }}
            >
              {/* Subtle indigo wave texture */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2E4370_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Bottom hem weight bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#0E1626] border-t border-[#1C2945]/30" />

              {/* Left crest emblem */}
              <div className="relative z-10 text-right opacity-90">
                <span className="font-serif_jp text-4xl sm:text-6xl text-[#F3EBDD] tracking-widest font-light block">
                  界
                </span>
                <span className="text-[10px] sm:text-xs text-[#C59B27] tracking-widest uppercase block mt-1">
                  KAI JAPANESE
                </span>
              </div>
            </motion.div>

            {/* Right Indigo Panel */}
            <motion.div
              className="relative w-1/2 h-full bg-[#0A101C] border-l border-[#1C2945]/40 flex flex-col justify-center items-start pl-6 shadow-2xl overflow-hidden"
              initial={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{
                duration: 1.1,
                ease: [0.33, 1, 0.68, 1]
              }}
            >
              {/* Subtle indigo wave texture */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2E4370_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Bottom hem weight bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#0E1626] border-t border-[#1C2945]/30" />

              {/* Right crest emblem */}
              <div className="relative z-10 text-left opacity-90">
                <span className="font-serif_jp text-4xl sm:text-6xl text-[#F3EBDD] tracking-widest font-light block">
                  門
                </span>
                <span className="text-[10px] sm:text-xs text-[#C59B27] tracking-widest block mt-1">
                  夜光の扉
                </span>
              </div>
            </motion.div>
          </div>

          {/* Quick skip hint at bottom */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center">
            <span className="text-xs tracking-widest text-[#F3EBDD]/60 uppercase bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              クリックまたは [Space] で入る
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
