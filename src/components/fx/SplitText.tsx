// src/components/fx/SplitText.tsx
// Staggered letter or word entrance reveal using framer-motion
// Only animates transform and opacity. Respects prefers-reduced-motion.
import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

export interface SplitTextProps {
  text: string;
  by?: 'characters' | 'words';
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  by = 'characters',
  stagger = 0.035,
  delay = 0.1,
  duration = 0.5,
  className = '',
  wordClassName = 'inline-block mr-[0.25em] last:mr-0',
  charClassName = 'inline-block',
  as = 'span'
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 14, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const Component = motion[as];

  if (by === 'words') {
    const words = text.split(' ');
    return (
      <Component
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`inline-block ${className}`}
        aria-label={text}
      >
        {words.map((word, wIdx) => (
          <motion.span
            key={`${word}-${wIdx}`}
            variants={itemVariants}
            className={wordClassName}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        ))}
      </Component>
    );
  }

  // by characters: preserve words so wrapping doesn't break characters mid-word
  const words = text.split(' ');

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {words.map((word, wIdx) => (
        <span key={`${word}-${wIdx}`} className={wordClassName} aria-hidden="true">
          {Array.from(word).map((char, cIdx) => (
            <motion.span
              key={`${char}-${cIdx}`}
              variants={itemVariants}
              className={charClassName}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Component>
  );
};
