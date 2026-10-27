import React from 'react';
import { motion } from 'framer-motion';

export const CinematicFooter: React.FC = () => {
  return (
    <footer className="relative border-t border-stone-800/80 bg-[#07070C] text-stone-400 py-16 px-4 sm:px-6 lg:px-8 pointer-events-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Crest */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark flex items-center justify-center text-white font-shippori font-bold text-2xl shadow-[0_0_20px_rgba(230,57,70,0.35)]">
            界
          </div>
          <div>
            <div className="font-shippori text-lg text-[#F5EFE6] font-semibold tracking-wide">
              KAI • 日本語マスター
            </div>
            <div className="font-mono text-xs text-stone-400">
              Personal Japanese Mastery Platform
            </div>
          </div>
        </div>

        {/* Animated Sumi-e Koi Fish SVG swimming */}
        <div className="flex items-center gap-4 py-2 px-6 rounded-full bg-stone-900/60 border border-stone-800">
          <svg
            className="w-8 h-8 text-kai-vermilion animate-[spin_8s_linear_infinite]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            {/* Minimalist Japanese Calligraphic Koi Path */}
            <path
              d="M50 15 C70 30, 85 50, 75 75 C65 85, 45 80, 50 65 C55 50, 35 40, 50 15 Z"
              fill="rgba(230,57,70,0.15)"
            />
            <path d="M50 15 Q60 5 65 15 Q55 20 50 15" fill="currentColor" />
            <circle cx="58" cy="35" r="2.5" fill="#F4C26B" />
          </svg>
          <div className="text-left font-serif_jp text-xs text-stone-300">
            <span className="block text-kai-gold font-bold">流水不腐</span>
            <span className="text-3xs font-mono text-stone-400">Running water never grows stale</span>
          </div>
        </div>

        {/* Links & Copyright */}
        <div className="text-center md:text-right font-mono text-xs text-stone-400 space-y-2">
          <div className="flex items-center justify-center md:justify-end gap-6 text-stone-300 font-serif_jp">
            <a href="#hero" className="hover:text-kai-gold transition-colors">頂上 Top</a>
            <a href="#manifesto" className="hover:text-kai-gold transition-colors">哲学 Manifesto</a>
            <a href="#features" className="hover:text-kai-gold transition-colors">七門 Seven Gates</a>
            <a href="#showcase" className="hover:text-kai-gold transition-colors">構造 Sanctum</a>
          </div>
          <div>
            © {new Date().getFullYear()} KAI Japanese Mastery. Crafted with Three.js & Sumi-e Aesthetics.
          </div>
        </div>
      </div>
    </footer>
  );
};
