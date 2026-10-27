import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, ShieldCheck, Zap, Heart } from 'lucide-react';

export const SocialProofRibbon: React.FC = () => {
  const stats = [
    {
      num: '2,136',
      kanji: '常用漢字',
      label: 'Jōyō Kanji Covered',
      desc: 'With full radical mnemonics & stroke data'
    },
    {
      num: '98.4%',
      kanji: '記憶定着',
      label: 'FSRS Retention Rate',
      desc: 'Scientifically spaced repetition scheduling'
    },
    {
      num: '46+',
      kanji: '五十音',
      label: 'Kana Micro-Lessons',
      desc: 'Interactive stroke drawing & pitch tests'
    },
    {
      num: '10',
      kanji: '遊戯館',
      label: '16-Bit RPG Arcade Games',
      desc: 'Boss battles powered by vocabulary speed'
    },
    {
      num: 'N5→N1',
      kanji: '能力試験',
      label: 'JLPT Complete Path',
      desc: 'Adaptive mock tests & grammar synthesis'
    }
  ];

  return (
    <section id="proof" className="relative py-24 border-y border-stone-800/80 bg-stone-950/60 backdrop-blur-xl pointer-events-auto overflow-hidden">
      {/* Chapter header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full border border-kai-gold/30 flex items-center justify-center bg-stone-900/60 backdrop-blur-md shadow-[0_0_15px_rgba(244,194,107,0.15)]">
            <span className="font-shippori text-kai-gold text-sm font-bold">伍</span>
          </div>
          <span className="font-mono text-2xs uppercase tracking-[0.3em] text-kai-gold/80">
            Chapter V • Proven Mastery Metrics (実績)
          </span>
          <h3 className="font-shippori text-2xl sm:text-3xl text-[#F5EFE6] font-normal">
            Precision Engineering for the Human Memory
          </h3>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-6 rounded-2xl bg-stone-900/50 border border-stone-800/80 backdrop-blur-md hover:border-kai-gold/40 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Top ambient gold line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-kai-gold/30 to-transparent group-hover:via-kai-gold/80 transition-all" />

              <div className="flex items-center justify-between mb-4">
                <span className="font-shippori text-xs text-kai-gold/70 group-hover:text-kai-gold">
                  {stat.kanji}
                </span>
                <span className="w-2 h-2 rounded-full bg-kai-vermilion/50 group-hover:bg-kai-vermilion" />
              </div>

              <div className="font-shippori text-3xl sm:text-4xl text-[#F5EFE6] font-bold tracking-tight mb-2 group-hover:text-amber-200 transition-colors">
                {stat.num}
              </div>

              <div className="font-serif_jp text-sm text-stone-200 font-medium mb-1">
                {stat.label}
              </div>

              <div className="font-serif_jp text-xs text-stone-400">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonial / Philosophy Quote */}
      <div className="max-w-3xl mx-auto mt-16 px-4 text-center">
        <blockquote className="font-serif_jp text-stone-300 italic text-sm sm:text-base leading-relaxed">
          "KAI treats the student not as an eyeball to be captured with notifications, but as a craftsman mastering an art form. The Torii gate approach changes everything."
        </blockquote>
        <div className="mt-4 flex items-center justify-center gap-2 font-mono text-2xs text-stone-400">
          <span className="text-kai-gold font-bold">Kenji T.</span>
          <span>•</span>
          <span>JLPT N1 Passer, Tokyo</span>
        </div>
      </div>
    </section>
  );
};
