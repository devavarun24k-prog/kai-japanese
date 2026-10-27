import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ManifestoSectionProps {
  onEnterApp?: () => void;
}

export const ManifestoSection: React.FC<ManifestoSectionProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const words = [
    { text: 'Language', en: true },
    { text: 'is', en: true },
    { text: 'not', en: true },
    { text: 'flashcards.', en: true },
    { text: '言葉は単語帳ではない。', jp: true },
    { text: 'It', en: true },
    { text: 'is', en: true },
    { text: 'a', en: true },
    { text: 'world', en: true, highlight: true },
    { text: 'to', en: true },
    { text: 'inhabit.', en: true, highlight: true },
    { text: '住まう世界だ。', jp: true, highlightJp: true }
  ];

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="relative min-h-[140vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-32 pointer-events-auto"
    >
      {/* Decorative vertical kanji watermark */}
      <div className="absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-5 dark:opacity-10 font-shippori text-8xl sm:text-9xl text-stone-100 dark:text-stone-700 writing-vertical">
        真髄界律
      </div>

      <div className="max-w-4xl mx-auto w-full text-center relative z-10">
        {/* Mon crest & Chapter header */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full border border-kai-gold/30 flex items-center justify-center bg-stone-900/60 backdrop-blur-md shadow-[0_0_15px_rgba(244,194,107,0.15)]">
            <span className="font-shippori text-kai-gold text-sm font-bold">弐</span>
          </div>
          <span className="font-mono text-2xs uppercase tracking-[0.3em] text-kai-gold/80">
            Chapter II • The Manifesto (哲学)
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-kai-gold/40 to-transparent" />
        </div>

        {/* Word-by-word scrubbed reveal */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-3 font-shippori text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F5EFE6] leading-tight">
          {words.map((item, idx) => {
            const start = idx / words.length;
            const end = start + 1 / words.length;
            return (
              <WordToken
                key={idx}
                item={item}
                progress={scrollYProgress}
                range={[Math.max(0.05, start * 0.8), Math.min(0.95, end * 0.85 + 0.1)]}
              />
            );
          })}
        </div>

        {/* Extended philosophy card */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.35, 0.65], [0, 1]),
            y: useTransform(scrollYProgress, [0.35, 0.65], [40, 0])
          }}
          className="mt-16 sm:mt-24 p-6 sm:p-10 rounded-2xl bg-stone-900/40 backdrop-blur-xl border border-stone-800/80 max-w-2xl mx-auto text-left shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gold line accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-kai-gold/40 to-transparent" />

          <p className="font-serif_jp text-sm sm:text-base text-stone-300 leading-relaxed font-light">
            Forget gamified streaks that leave you mute when stepping off the train in Shinjuku.
            KAI replaces hollow rote memorization with <strong className="text-kai-gold font-normal">neural cognitive grounding</strong>:
            procedural stroke geometry, contextual mnemonic palaces, voice pitch-accent diagnostics, and spaced repetition that actually sticks.
          </p>

          <div className="mt-6 pt-6 border-t border-stone-800/60 flex items-center justify-between text-xs font-mono text-stone-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-kai-vermilion animate-pulse" />
              Cognitive Depth First
            </span>
            <span className="font-shippori text-stone-400">道・修練・悟り</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface WordTokenProps {
  item: { text: string; en?: boolean; jp?: boolean; highlight?: boolean; highlightJp?: boolean };
  progress: any;
  range: [number, number];
}

const WordToken: React.FC<WordTokenProps> = ({ item, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [12, 0]);
  const scale = useTransform(progress, range, [0.94, 1]);

  return (
    <motion.span
      style={{ opacity, y, scale }}
      className={`inline-block transition-colors duration-200 ${
        item.jp
          ? 'font-serif_jp text-lg sm:text-2xl md:text-3xl text-kai-gold/80 block w-full my-2 font-normal'
          : item.highlight
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-kai-gold to-orange-300 font-semibold drop-shadow-[0_0_20px_rgba(244,194,107,0.25)]'
          : 'text-[#F5EFE6]'
      }`}
    >
      {item.text}
    </motion.span>
  );
};
