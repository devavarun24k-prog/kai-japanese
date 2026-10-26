// src/components/landing/SceneHeroJapan.tsx
// Scene 1: Enter Japan (日本への入口)
// High-quality illustrated Japanese landscape with layered depth:
// Mt. Fuji, Pagoda, Pine trees, glowing moon, drifting mist, Torii gate, and Sakura
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Compass } from 'lucide-react';
import { SakuraCanvas } from './SakuraCanvas';
import { OrnamentalCircle, KaiMonCrest } from './OrnamentalElements';
import { soundEffects } from '../../services/soundEffects';

interface SceneHeroJapanProps {
  onBeginJourney: () => void;
  onEnterPlatform: () => void;
  isAuthenticated?: boolean;
}

export const SceneHeroJapan: React.FC<SceneHeroJapanProps> = ({
  onBeginJourney,
  onEnterPlatform,
  isAuthenticated = false
}) => {
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  const handleBeginClick = () => {
    soundEffects.playClick();
    onBeginJourney();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0D131D] text-[#F0E5CE] select-none">
      {/* Dynamic Sakura Particle Canvas */}
      <SakuraCanvas petalCount={42} interactive={true} />

      {/* =========================================================================
          LAYER 0: SKY, MOON, AND CELESTIAL GLOW (Deep Midnight Indigo)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Midnight indigo sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C14] via-[#0E1624] to-[#141F32]" />

        {/* Ambient atmospheric radial glow behind Mount Fuji */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(185,154,96,0.15),transparent_70%)] blur-3xl pointer-events-none" />

        {/* The Antique Ivory Full Moon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute top-16 right-8 sm:right-24 md:right-36 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-[#FFF9EE] via-[#F4E8D1] to-[#E3D1B1] shadow-[0_0_80px_rgba(240,229,206,0.35)] flex items-center justify-center pointer-events-none"
        >
          {/* Subtle lunar texture marks */}
          <div className="w-full h-full rounded-full opacity-20 bg-[radial-gradient(ellipse_at_top_left,rgba(168,74,58,0.3),transparent_60%)]" />
          {/* Thin ornamental gold corona ring */}
          <div className="absolute -inset-3 rounded-full border border-[#B99A60]/30 animate-pulse pointer-events-none" />
        </motion.div>

        {/* Floating background clouds (Kumomon) */}
        <motion.div
          animate={{ x: [0, 40, 0], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 left-6 sm:left-20 w-80 opacity-40 pointer-events-none"
        >
          <svg viewBox="0 0 200 60" fill="#182338">
            <path d="M 10 40 Q 30 15 60 30 Q 90 5 130 25 Q 160 10 190 40 Q 150 55 100 50 Q 50 55 10 40 Z" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [0, -30, 0], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-44 right-1/4 w-96 opacity-30 pointer-events-none"
        >
          <svg viewBox="0 0 240 70" fill="#182338">
            <path d="M 15 50 Q 40 20 80 35 Q 120 10 170 30 Q 205 15 235 50 Q 180 65 120 60 Q 60 65 15 50 Z" />
          </svg>
        </motion.div>
      </div>

      {/* =========================================================================
          LAYER 1: BACKGROUND MOUNTAINS & SACRED MOUNT FUJI (富士山)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-1 flex items-end justify-center">
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-auto min-h-[360px] max-h-[65vh] object-cover object-bottom"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Distant mountain ridge */}
          <path
            d="M 0 420 Q 220 360 480 390 T 960 370 T 1440 430 L 1440 600 L 0 600 Z"
            fill="#101929"
            opacity="0.85"
          />

          {/* Mount Fuji (富士山) Silhouette */}
          <g transform="translate(720, 260) scale(1.15)">
            {/* Fuji mountain base */}
            <path
              d="M -260 260 C -190 200 -110 90 -55 20 C -45 5 -35 0 0 0 C 35 0 45 5 55 20 C 110 90 190 200 260 260 Z"
              fill="#141E30"
              stroke="#B99A60"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
            {/* Fuji Snowcap (雪冠) in Antique Ivory */}
            <path
              d="M -55 20 C -45 5 -35 0 0 0 C 35 0 45 5 55 20 C 48 35 32 45 38 65 C 22 55 10 65 0 52 C -10 65 -22 55 -38 65 C -32 45 -48 35 -55 20 Z"
              fill="#F0E5CE"
              opacity="0.9"
            />
            {/* Delicate ink shadow lines on snowcap */}
            <path
              d="M -15 28 L -10 46 M 0 22 L 0 42 M 15 28 L 10 46"
              stroke="#A84A3A"
              strokeWidth="1.2"
              opacity="0.4"
            />
          </g>

          {/* Drifting middle-ground mist ribbon */}
          <path
            d="M 0 470 C 240 440 520 490 760 460 C 1020 430 1280 480 1440 450 L 1440 520 L 0 520 Z"
            fill="#162236"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* =========================================================================
          LAYER 2: MIDDLE-GROUND PAGODA & TEMPLE GROVE (五重塔と松林)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-2 flex items-end">
        <svg
          viewBox="0 0 1440 500"
          className="w-full h-auto min-h-[300px] max-h-[50vh] object-cover object-bottom"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Layered Misty Forest Hills */}
          <path
            d="M 0 380 Q 260 320 540 360 T 1100 340 T 1440 370 L 1440 500 L 0 500 Z"
            fill="#0E1624"
          />

          {/* Traditional 5-Tier Pagoda on Left Ridge */}
          <g transform="translate(180, 180) scale(0.85)">
            {/* Finial spire (相輪) */}
            <line x1="0" y1="-50" x2="0" y2="0" stroke="#B99A60" strokeWidth="2.5" />
            <circle cx="0" cy="-45" r="3.5" fill="#B99A60" />
            <circle cx="0" cy="-35" r="4.5" fill="#B99A60" />
            <circle cx="0" cy="-25" r="5.5" fill="#B99A60" />
            <circle cx="0" cy="-15" r="6.5" fill="#B99A60" />

            {/* Tier 5 (Top Roof) */}
            <path d="M -26 0 C -12 2 12 2 26 0 C 18 8 -18 8 -26 0 Z" fill="#0A0F1A" stroke="#B99A60" strokeWidth="0.8" />
            <rect x="-10" y="0" width="20" height="12" fill="#0A0F1A" />

            {/* Tier 4 */}
            <path d="M -34 12 C -16 15 16 15 34 12 C 24 22 -24 22 -34 12 Z" fill="#0A0F1A" stroke="#B99A60" strokeWidth="0.8" />
            <rect x="-13" y="12" width="26" height="14" fill="#0A0F1A" />

            {/* Tier 3 */}
            <path d="M -44 26 C -20 30 20 30 44 26 C 30 38 -30 38 -44 26 Z" fill="#0A0F1A" stroke="#B99A60" strokeWidth="0.8" />
            <rect x="-17" y="26" width="34" height="16" fill="#0A0F1A" />

            {/* Tier 2 */}
            <path d="M -54 42 C -24 47 24 47 54 42 C 38 56 -38 56 -54 42 Z" fill="#0A0F1A" stroke="#B99A60" strokeWidth="0.8" />
            <rect x="-21" y="42" width="42" height="18" fill="#0A0F1A" />

            {/* Tier 1 (Base Roof) */}
            <path d="M -66 60 C -30 66 30 66 66 60 C 46 76 -46 76 -66 60 Z" fill="#0A0F1A" stroke="#B99A60" strokeWidth="1" />
            <rect x="-26" y="60" width="52" height="40" fill="#0A0F1A" />

            {/* Warm Lantern Glow in Pagoda Windows */}
            <circle cx="-8" cy="72" r="3" fill="#F0E5CE" opacity="0.9" filter="drop-shadow(0 0 6px #B99A60)" />
            <circle cx="8" cy="72" r="3" fill="#F0E5CE" opacity="0.9" filter="drop-shadow(0 0 6px #B99A60)" />
          </g>

          {/* Traditional Pine Tree Silhouettes (松) */}
          <g transform="translate(100, 310) scale(0.9)" fill="#090E17">
            {/* Trunk */}
            <path d="M 30 110 C 25 70 45 40 35 0 C 40 40 50 70 45 110 Z" />
            {/* Pine needle clusters */}
            <ellipse cx="15" cy="20" rx="35" ry="12" />
            <ellipse cx="60" cy="15" rx="40" ry="14" />
            <ellipse cx="25" cy="45" rx="42" ry="14" />
            <ellipse cx="65" cy="50" rx="38" ry="13" />
            <ellipse cx="40" cy="75" rx="50" ry="16" />
          </g>

          {/* Right Ridge Pines */}
          <g transform="translate(1260, 290) scale(1)" fill="#090E17">
            <path d="M 40 130 C 35 80 55 40 45 0 C 50 40 65 80 55 130 Z" />
            <ellipse cx="25" cy="20" rx="42" ry="14" />
            <ellipse cx="75" cy="15" rx="46" ry="15" />
            <ellipse cx="35" cy="50" rx="48" ry="15" />
            <ellipse cx="75" cy="55" rx="45" ry="14" />
            <ellipse cx="50" cy="85" rx="56" ry="18" />
          </g>
        </svg>
      </div>

      {/* =========================================================================
          LAYER 3: FOREGROUND TORII GATE, STONE LANTERNS & SAKURA BOUGHS
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-3 flex items-end justify-between">
        {/* Left Torii Pillar & Sakura Bough */}
        <div className="relative w-48 sm:w-72 h-full flex items-end">
          <svg viewBox="0 0 240 600" className="w-full h-full object-bottom" preserveAspectRatio="xMinYMax meet">
            {/* Grand Torii Column Left */}
            <rect x="30" y="120" width="22" height="480" fill="#070A10" rx="2" />
            {/* Torii base support wedge */}
            <polygon points="18,590 64,590 52,530 30,530" fill="#070A10" />

            {/* Hanging Vermilion Paper Lantern on Torii */}
            <g transform="translate(56, 210)">
              {/* String */}
              <line x1="0" y1="0" x2="0" y2="18" stroke="#B99A60" strokeWidth="1.5" />
              {/* Lantern Body */}
              <rect x="-14" y="18" width="28" height="42" rx="10" fill="#A84A3A" stroke="#B99A60" strokeWidth="1" />
              {/* Gold bands */}
              <line x1="-13" y1="28" x2="13" y2="28" stroke="#B99A60" strokeWidth="0.8" />
              <line x1="-14" y1="39" x2="14" y2="39" stroke="#B99A60" strokeWidth="0.8" />
              <line x1="-13" y1="50" x2="13" y2="50" stroke="#B99A60" strokeWidth="0.8" />
              {/* Warm interior lantern glow */}
              <circle cx="0" cy="39" r="6" fill="#F0E5CE" className="animate-pulse" filter="drop-shadow(0 0 12px #B99A60)" />
              {/* Bottom Tassel */}
              <line x1="0" y1="60" x2="0" y2="76" stroke="#A84A3A" strokeWidth="2" />
            </g>

            {/* Overhanging Sakura Branch from Top Left */}
            <g fill="#070A10">
              <path d="M 0 0 C 60 20 120 15 180 55 C 130 50 70 35 0 20 Z" />
              <path d="M 90 25 C 130 50 170 70 210 110 C 170 85 130 60 90 35 Z" />
            </g>
          </svg>
        </div>

        {/* Right Torii Pillar & Stone Lantern */}
        <div className="relative w-48 sm:w-72 h-full flex items-end justify-end">
          <svg viewBox="0 0 240 600" className="w-full h-full object-bottom" preserveAspectRatio="xMaxYMax meet">
            {/* Grand Torii Column Right */}
            <rect x="188" y="120" width="22" height="480" fill="#070A10" rx="2" />
            <polygon points="176,590 222,590 210,530 188,530" fill="#070A10" />

            {/* Top Torii Crossbeam (笠木 / Kasagi) stretching across */}
            <path
              d="M -300 130 C -100 115 100 115 240 110 L 240 132 C 100 136 -100 136 -300 150 Z"
              fill="#070A10"
              stroke="#B99A60"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />

            {/* Traditional Stone Lantern (春日灯籠 - Kasuga Tōrō) */}
            <g transform="translate(130, 430)">
              {/* Roof cap */}
              <polygon points="0,0 -30,22 30,22" fill="#070A10" />
              {/* Light chamber */}
              <rect x="-18" y="22" width="36" height="26" fill="#0A0F1A" stroke="#B99A60" strokeWidth="0.8" />
              {/* Golden Candle Light */}
              <circle cx="0" cy="35" r="5" fill="#F0E5CE" className="animate-pulse" filter="drop-shadow(0 0 8px #B99A60)" />
              {/* Pedestal & Base */}
              <rect x="-10" y="48" width="20" height="60" fill="#070A10" />
              <rect x="-24" y="108" width="48" height="18" rx="2" fill="#070A10" />
            </g>
          </svg>
        </div>
      </div>

      {/* =========================================================================
          LAYER 4: FOREGROUND TYPOGRAPHY, WORDMARK, & CINEMATIC HERO CONTROLS
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-10 sm:pt-14 pb-12 flex-1 flex flex-col justify-between items-center text-center">
        {/* Top Floating Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="w-full flex items-center justify-between py-2"
        >
          {/* Brand Emblem */}
          <div className="flex items-center gap-3">
            <KaiMonCrest size={44} />
            <div className="text-left">
              <span className="font-serif_jp font-bold text-lg tracking-widest text-[#F0E5CE]">
                KAI
              </span>
              <span className="block text-3xs font-mono text-[#B99A60] tracking-wider uppercase">
                日本語マスター • Japanese Mastery
              </span>
            </div>
          </div>

          {/* Quick Direct Link to Learning App */}
          <button
            onClick={onEnterPlatform}
            className="group px-4 py-1.5 rounded-full bg-[#101722]/80 hover:bg-[#101722] border border-[#B99A60]/50 hover:border-[#B99A60] text-xs font-serif_jp text-[#F0E5CE] flex items-center gap-2 backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <Compass size={13} className="text-[#B99A60] group-hover:rotate-45 transition-transform" />
            <span>{isAuthenticated ? 'ダッシュボードへ • Dashboard' : 'ログイン • Sign In'}</span>
          </button>
        </motion.div>

        {/* Center Hero Title & Storytelling Typography */}
        <div className="my-auto py-8 space-y-6 max-w-3xl">
          {/* Traditional Rotating Ornamental Medallion framing the title */}
          <div className="relative flex items-center justify-center">
            <OrnamentalCircle size={240} className="absolute opacity-40 scale-75 sm:scale-100" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="relative z-10 space-y-3"
            >
              {/* Crest Mon */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101722]/90 border border-[#B99A60]/40 text-xs font-mono text-[#B99A60] backdrop-blur-md shadow-lg">
                <Sparkles size={12} className="text-[#A84A3A]" />
                <span>本格的な日本語学習世界 • Traditional Illustrated World</span>
              </div>

              {/* Japanese Kanji Main Calligraphy */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif_jp tracking-wider text-[#F0E5CE] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                界 — KAI
              </h1>

              <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-[#B99A60] to-transparent" />

              {/* English & Japanese Taglines */}
              <p className="text-lg sm:text-2xl font-serif_jp text-[#F0E5CE] font-medium tracking-wide">
                Discover Japanese, one character at a time.
              </p>

              {/* Multilingual Subtitle (Japanese + Telugu) */}
              <div className="space-y-1 text-xs sm:text-sm text-[#F0E5CE]/80 font-sans max-w-xl mx-auto leading-relaxed">
                <p className="font-serif_jp">「一文字から始まる、本格的な日本語の世界へ。」</p>
                <p className="font-telugu text-3xs sm:text-xs text-[#B99A60]">
                  ఒక్కో అక్షరం నేర్చుకుంటూ, ఆలోచిస్తూ, సహజంగా జపనీస్‌లో నైపుణ్యం సాధించండి.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Call-to-Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary Cinematic CTA: Begin Your Journey */}
            <button
              onClick={handleBeginClick}
              onMouseEnter={() => setIsHoveringCTA(true)}
              onMouseLeave={() => setIsHoveringCTA(false)}
              className="relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#A84A3A] to-[#8C3A2D] hover:from-[#B84E3E] hover:to-[#9E4132] text-white font-serif_jp font-semibold text-sm sm:text-base tracking-wider shadow-[0_6px_24px_rgba(168,74,58,0.45)] border border-[#F0E5CE]/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">旅を始める • Begin Your Journey</span>
              <ArrowDown size={17} className={`relative z-10 transition-transform ${isHoveringCTA ? 'translate-y-1' : ''}`} />
              {/* Subtle Gold Shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </button>

            {/* Direct Platform Entrance */}
            <button
              onClick={onEnterPlatform}
              className="px-6 py-3.5 rounded-2xl bg-[#101722]/85 hover:bg-[#101722] text-[#F0E5CE] border border-[#B99A60]/60 hover:border-[#B99A60] font-serif_jp text-sm tracking-wide backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              <span>学舎へ入る • Enter Platform</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom Animated Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="cursor-pointer flex flex-col items-center gap-1.5 pt-4 text-3xs font-mono tracking-widest text-[#B99A60]"
          onClick={handleBeginClick}
        >
          <span>スクロールして探索 • SCROLL TO EXPLORE</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-[#B99A60] to-transparent rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};
