// src/components/landing/ScrollAssemblySection.tsx
// Scroll-driven progression using framer-motion useScroll:
// Kana grid assembling into a word -> sentence -> path to JLPT N1
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Sparkles, Layers, BookOpen, Award, ArrowDown, CheckCircle2 } from 'lucide-react';
import { TiltCard } from '../fx/TiltCard';

export const ScrollAssemblySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Transform coordinates for kana assembling into a word
  // Stage 1 -> Stage 2: Kana converge
  const saX = useTransform(scrollYProgress, [0.1, 0.35], [-60, 0]);
  const raX = useTransform(scrollYProgress, [0.1, 0.35], [60, 0]);
  const wordOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0.3, 1]);

  // Stage 2 -> Stage 3: Sentence particles appear
  const sentenceOpacity = useTransform(scrollYProgress, [0.32, 0.52], [0, 1]);
  const sentenceY = useTransform(scrollYProgress, [0.32, 0.52], [24, 0]);

  // Stage 4: JLPT N1 path progress
  const pathHeight = useTransform(scrollYProgress, [0.5, 0.9], ['0%', '100%']);

  const jlptStages = [
    {
      level: 'JLPT N5',
      title: 'Foundations & Scripts',
      desc: 'Master 46 Hiragana, 46 Katakana, 100 core Kanji, and 800 basic vocabulary words.',
      status: 'Active Starting Stage',
      accent: 'border-kai-vermilion text-kai-vermilion',
      badgeBg: 'bg-kai-vermilion text-white'
    },
    {
      level: 'JLPT N4',
      title: 'Everyday Situations',
      desc: 'Understand daily conversations, shopping, travel phrases, and essential verb conjugations.',
      status: 'Target Horizon',
      accent: 'border-kai-gold text-kai-gold',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
    },
    {
      level: 'JLPT N3',
      title: 'Intermediate Conversational Flow',
      desc: 'Bridge into real Japanese: read simple news, anime subtitles, and social media with ease.',
      status: 'Bridge Milestone',
      accent: 'border-kai-indigo text-kai-indigo',
      badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200'
    },
    {
      level: 'JLPT N2',
      title: 'Business & Media Fluency',
      desc: 'Comprehend newspapers, podcasts, and business meetings without translation friction.',
      status: 'Fluency Milestone',
      accent: 'border-purple-500 text-purple-600',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
    },
    {
      level: 'JLPT N1',
      title: 'Complete Native Mastery',
      desc: 'Nuanced literature, complex abstracts, and total cultural fluency.',
      status: 'Master Summit',
      accent: 'border-emerald-600 text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
    }
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-24 select-none"
    >
      {/* SECTION 1: KANA ASSEMBLING INTO A WORD */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border text-xs font-mono font-medium text-kai-muted dark:text-kai-dark-muted shadow-sm">
          <Layers size={13} className="text-kai-vermilion" />
          <span>Scroll-Driven Visual Pedagogy</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif_jp font-bold text-kai-ink dark:text-white">
          From Isolated Sounds to Real Sentences
        </h2>
        <p className="text-xs sm:text-sm text-kai-muted dark:text-kai-dark-muted max-w-xl mx-auto">
          Watch individual syllables converge into words, connect with particles, and form complete native sentences.
        </p>

        {/* Dynamic Assembling Stage */}
        <div className="py-10 flex flex-col items-center justify-center gap-6">
          {/* 3 Converging Kana */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Sa */}
            <motion.div
              style={shouldReduceMotion ? undefined : { x: saX, opacity: wordOpacity }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-kai-dark-card border-2 border-kai-border dark:border-kai-dark-border shadow-washi-md flex flex-col items-center justify-center"
            >
              <span className="text-2xl sm:text-3xl font-serif_jp font-bold text-kai-vermilion">
                さ
              </span>
              <span className="text-3xs font-mono text-kai-muted">sa</span>
            </motion.div>

            {/* Ku */}
            <motion.div
              style={shouldReduceMotion ? undefined : { opacity: wordOpacity }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-kai-dark-card border-2 border-kai-border dark:border-kai-dark-border shadow-washi-md flex flex-col items-center justify-center"
            >
              <span className="text-2xl sm:text-3xl font-serif_jp font-bold text-kai-vermilion">
                く
              </span>
              <span className="text-3xs font-mono text-kai-muted">ku</span>
            </motion.div>

            {/* Ra */}
            <motion.div
              style={shouldReduceMotion ? undefined : { x: raX, opacity: wordOpacity }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-kai-dark-card border-2 border-kai-border dark:border-kai-dark-border shadow-washi-md flex flex-col items-center justify-center"
            >
              <span className="text-2xl sm:text-3xl font-serif_jp font-bold text-kai-vermilion">
                ら
              </span>
              <span className="text-3xs font-mono text-kai-muted">ra</span>
            </motion.div>
          </div>

          {/* Formed Word: さくら (Sakura) */}
          <motion.div
            style={shouldReduceMotion ? undefined : { opacity: wordOpacity }}
            className="text-center space-y-1"
          >
            <span className="text-xs font-mono font-bold text-kai-gold uppercase tracking-wider">
              &darr; Word Synthesized
            </span>
            <div className="text-xl sm:text-2xl font-serif_jp font-bold text-kai-ink dark:text-white">
              さくら <span className="font-sans font-normal text-sm text-kai-muted">(Cherry Blossom)</span>
            </div>
          </motion.div>

          {/* Stage 3: Sentence Formation */}
          <motion.div
            style={shouldReduceMotion ? undefined : { opacity: sentenceOpacity, y: sentenceY }}
            className="w-full max-w-lg p-5 rounded-3xl bg-white/90 dark:bg-kai-dark-card/90 border border-kai-border dark:border-kai-dark-border shadow-washi-md space-y-2 text-center"
          >
            <div className="text-3xs font-mono font-bold text-kai-vermilion uppercase tracking-wider">
              Stage 3 &bull; Grammatical Particle Connection
            </div>
            <div className="text-2xl sm:text-3xl font-serif_jp font-bold text-kai-ink dark:text-white flex items-center justify-center gap-2 flex-wrap">
              <span>さくら</span>
              <span className="px-2 py-0.5 rounded-lg bg-kai-vermilion/15 text-kai-vermilion text-xl font-mono" title="Subject Particle (が)">
                が
              </span>
              <span>さきます</span>
            </div>
            <p className="text-xs text-kai-muted dark:text-kai-dark-muted">
              &quot;Cherry blossoms bloom.&quot; &bull; <span className="font-telugu text-kai-gold">చెర్రీ పువ్వులు వికసిస్తాయి.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: THE ROAD TO JLPT N1 */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-kai-dark-surface text-3xs font-mono text-kai-muted">
            <Award size={13} className="text-kai-gold" />
            <span>Structured Fluency Pathway</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif_jp font-bold text-kai-ink dark:text-white">
            The Roadmap to JLPT N1 Mastery
          </h3>
          <p className="text-xs sm:text-sm text-kai-muted dark:text-kai-dark-muted max-w-md mx-auto">
            Clear, achievable milestones calibrated with spaced repetition and real Japanese media.
          </p>
        </div>

        {/* Timeline Path with Animated Progress Bar */}
        <div className="relative pl-6 sm:pl-8 space-y-6 max-w-2xl mx-auto">
          {/* Animated vertical connecting line */}
          <div className="absolute left-2.5 top-3 bottom-3 w-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <motion.div
              style={shouldReduceMotion ? { height: '100%' } : { height: pathHeight }}
              className="w-full bg-gradient-to-b from-kai-vermilion via-kai-gold to-emerald-500 rounded-full"
            />
          </div>

          {jlptStages.map((stage, idx) => (
            <TiltCard
              key={stage.level}
              maxTilt={8}
              scaleHover={1.01}
              className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi hover:shadow-washi-md transition-all text-left space-y-2"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${stage.badgeBg}`}>
                    {stage.level}
                  </span>
                  <span className="font-bold text-sm text-kai-ink dark:text-white font-serif_jp">
                    {stage.title}
                  </span>
                </div>
                <span className="text-3xs font-mono text-kai-muted">{stage.status}</span>
              </div>
              <p className="text-xs text-kai-muted dark:text-kai-dark-muted leading-relaxed">
                {stage.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};
