import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface SunriseCtaSectionProps {
  onEnterApp: () => void;
  onOpenAuth?: () => void;
  isAuthenticated?: boolean;
}

export const SunriseCtaSection: React.FC<SunriseCtaSectionProps> = ({
  onEnterApp,
  onOpenAuth,
  isAuthenticated = false
}) => {
  return (
    <section
      id="cta"
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-32 pointer-events-auto overflow-hidden"
    >
      {/* Background warm radial bloom simulating morning dawn over Fuji */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-kai-gold/15 blur-[120px] -translate-y-12" />
      </div>

      <div className="max-w-4xl mx-auto w-full text-center relative z-10">
        {/* Chapter seal */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full border border-kai-gold/40 flex items-center justify-center bg-stone-900/60 backdrop-blur-md shadow-[0_0_20px_rgba(244,194,107,0.25)]">
            <span className="font-shippori text-kai-gold text-sm font-bold">陸</span>
          </div>
          <span className="font-mono text-2xs uppercase tracking-[0.3em] text-kai-gold">
            Chapter VI • The Threshold (門出)
          </span>
        </div>

        {/* Big Japanese Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-shippori text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F5EFE6] font-normal tracking-tight mb-4"
        >
          始めましょう。
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif_jp text-lg sm:text-2xl text-stone-300 font-light mb-10 max-w-2xl mx-auto"
        >
          Your Japanese journey starts today. Step through the gate into a living language.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <button
            onClick={() => {
              soundEffects.playLevelUp();
              if (onOpenAuth && !isAuthenticated) {
                onOpenAuth();
              } else {
                onEnterApp();
              }
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-serif_jp text-base font-semibold tracking-wide transition-all shadow-[0_0_35px_rgba(230,57,70,0.5)] hover:shadow-[0_0_50px_rgba(230,57,70,0.7)] flex items-center justify-center gap-3 group"
          >
            <span className="font-shippori text-lg font-bold">改</span>
            <span>{isAuthenticated ? 'Enter KAI Sanctuary' : 'Begin Your Mastery'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onEnterApp();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-kai-gold/40 text-stone-200 font-serif_jp text-base transition-all flex items-center justify-center gap-2 hover:border-kai-gold shadow-lg"
          >
            <Compass size={18} className="text-kai-gold" />
            <span>Explore Guest Preview</span>
          </button>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-stone-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Zero credit card required
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-kai-gold" />
            Local progress auto-saved
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-kai-vermilion" />
            Authentic Japanese audio
          </span>
        </div>
      </div>
    </section>
  );
};
