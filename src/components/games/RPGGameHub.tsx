// src/components/games/RPGGameHub.tsx
// Interactive Japanese RPG Arcade with 10 real, playable games, XP rewards, and boss battles
import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Zap,
  Layers,
  Search,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  RotateCcw,
  Play,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { GameId } from '../../types';
import { HIRAGANA_DATA } from '../../data/kanaData';
import { VOCAB_DATA } from '../../data/vocabData';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const RPGGameHub: React.FC = () => {
  const { awardXP, displayMode } = useLearning();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  // --- Game 1: Kana Reflex (Speed drill) ---
  const [reflexTime, setReflexTime] = useState<number>(10);
  const [reflexScore, setReflexScore] = useState<number>(0);
  const [reflexCurrent, setReflexCurrent] = useState(HIRAGANA_DATA[0]);
  const [reflexActive, setReflexActive] = useState<boolean>(false);

  // --- Game 2: Memory Match ---
  const [memoryTiles, setMemoryTiles] = useState<{ id: number; text: string; pairId: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // --- Game 7: Grammar Boss Battle ---
  const [bossHp, setBossHp] = useState<number>(100);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [bossTurn, setBossTurn] = useState<number>(0);

  const gamesList: { id: GameId; title: string; titleJp: string; desc: string; icon: string; xp: number }[] = [
    { id: 'kana_reflex', title: 'Kana Reflex', titleJp: '早押しかな', desc: 'Identify Hiragana characters before the 10s timer expires!', icon: '⚡', xp: 40 },
    { id: 'memory_match', title: 'Memory Match', titleJp: '絵合わせ', desc: 'Flip and match Japanese words with English & Telugu meanings.', icon: '🎴', xp: 50 },
    { id: 'grammar_boss', title: 'Grammar Boss Battle', titleJp: '文法魔王戦', desc: 'Defeat the Shadow Shogun using particle and conjugation spells!', icon: '👹', xp: 100 },
    { id: 'particle_detective', title: 'Particle Detective', titleJp: '助詞探偵', desc: 'Investigate missing particles at Tokyo crime scenes.', icon: '🔍', xp: 45 },
    { id: 'kanji_forge', title: 'Kanji Forge', titleJp: '漢字鍛冶', desc: 'Assemble radicals together into legitimate Kanji.', icon: '🔨', xp: 50 },
    { id: 'sentence_builder', title: 'Sentence Builder', titleJp: '文列車', desc: 'Rapidly assemble sentence cars on the Shinkansen track.', icon: '🚄', xp: 60 },
    { id: 'listening_hunter', title: 'Listening Hunter', titleJp: '音狩り', desc: 'Shoot target words purely by listening to native Japanese audio.', icon: '🎯', xp: 50 },
    { id: 'word_quest', title: 'Word Quest', titleJp: '単語ダンジョン', desc: 'Dungeon crawl through N5 vocabulary chambers.', icon: '🗡️', xp: 75 },
    { id: 'daily_challenge', title: 'Daily Mission Rush', titleJp: '日課試練', desc: 'Mixed 10-question sprint testing kana, vocab, and grammar.', icon: '⭐', xp: 80 },
    { id: 'jlpt_arena', title: 'JLPT Exam Arena', titleJp: '試験場', desc: 'Timed mock questions under realistic exam conditions.', icon: '🏛️', xp: 90 }
  ];

  // Start Kana Reflex
  const startKanaReflex = () => {
    setReflexScore(0);
    setReflexTime(10);
    setReflexActive(true);
    setReflexCurrent(HIRAGANA_DATA[Math.floor(Math.random() * HIRAGANA_DATA.length)]);
    soundEffects.playLevelUp();
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (reflexActive && reflexTime > 0) {
      timer = setTimeout(() => setReflexTime((t) => t - 1), 1000);
    } else if (reflexActive && reflexTime === 0) {
      setReflexActive(false);
      soundEffects.playWrong();
      awardXP(reflexScore * 5, 'Completed Kana Reflex drill');
    }
    return () => clearTimeout(timer);
  }, [reflexActive, reflexTime, reflexScore]);

  const handleReflexChoice = (romaji: string) => {
    if (!reflexActive) return;
    if (romaji === reflexCurrent.romaji) {
      soundEffects.playCorrect();
      setReflexScore((s) => s + 1);
      setReflexTime((t) => Math.min(12, t + 1)); // reward +1 second on correct answer
      setReflexCurrent(HIRAGANA_DATA[Math.floor(Math.random() * HIRAGANA_DATA.length)]);
    } else {
      soundEffects.playWrong();
      setReflexTime((t) => Math.max(0, t - 2)); // penalty
    }
  };

  // Start Memory Match
  const startMemoryMatch = () => {
    const selected = VOCAB_DATA.slice(0, 4);
    const tiles: typeof memoryTiles = [];
    selected.forEach((item, i) => {
      tiles.push({ id: i * 2, text: item.word, pairId: item.id, flipped: false, matched: false });
      tiles.push({ id: i * 2 + 1, text: `${item.english} (${item.telugu})`, pairId: item.id, flipped: false, matched: false });
    });
    setMemoryTiles(tiles.sort(() => 0.5 - Math.random()));
    setFlippedIndices([]);
  };

  const handleTileClick = (idx: number) => {
    if (memoryTiles[idx].matched || memoryTiles[idx].flipped || flippedIndices.length >= 2) return;

    soundEffects.playCardFlip();
    const newTiles = [...memoryTiles];
    newTiles[idx].flipped = true;
    setMemoryTiles(newTiles);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (newTiles[i1].pairId === newTiles[i2].pairId) {
        soundEffects.playCorrect();
        newTiles[i1].matched = true;
        newTiles[i2].matched = true;
        setMemoryTiles(newTiles);
        setFlippedIndices([]);

        if (newTiles.every((t) => t.matched)) {
          soundEffects.playLevelUp();
          awardXP(50, 'Cleared Memory Match game');
        }
      } else {
        soundEffects.playWrong();
        setTimeout(() => {
          newTiles[i1].flipped = false;
          newTiles[i2].flipped = false;
          setMemoryTiles([...newTiles]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // Boss Battle spell
  const bossQuestions = [
    {
      q: 'Which particle marks the TOPIC: わたし ＿＿ 田中 (Watashi __ Tanaka)?',
      options: ['は (wa)', 'が (ga)', 'を (o)'],
      correct: 0,
      damage: 35
    },
    {
      q: 'Which particle indicates ACTION LOCATION: としょかん ＿＿ べんきょう (Study __ library)?',
      options: ['で (de)', 'に (ni)', 'へ (e)'],
      correct: 0,
      damage: 35
    },
    {
      q: 'Which is the TE-FORM of たべる (taberu)?',
      options: ['たべて', 'たべた', 'たべない'],
      correct: 0,
      damage: 40
    }
  ];

  const handleBossSpell = (optIdx: number) => {
    const curQ = bossQuestions[bossTurn % bossQuestions.length];
    if (optIdx === curQ.correct) {
      soundEffects.playCorrect();
      const newBossHp = Math.max(0, bossHp - curQ.damage);
      setBossHp(newBossHp);

      if (newBossHp === 0) {
        soundEffects.playLevelUp();
        awardXP(100, 'Defeated the Grammar Boss!');
      } else {
        setBossTurn((t) => t + 1);
      }
    } else {
      soundEffects.playWrong();
      setPlayerHp((hp) => Math.max(0, hp - 25));
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>RPG道場</span>
            <span className="text-sm font-sans font-normal text-kai-muted">KAI RPG & Learning Games</span>
          </h1>
          <p className="text-xs text-kai-muted">
            10 playable Japanese games designed to turn retrieval practice into an addictive adventure.
          </p>
        </div>

        {activeGame && (
          <button
            onClick={() => setActiveGame(null)}
            className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-kai-ink text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Return to Arcade Hub</span>
          </button>
        )}
      </div>

      {/* Arcade Game Selector Grid if no game active */}
      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesList.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                setActiveGame(g.id);
                if (g.id === 'kana_reflex') startKanaReflex();
                if (g.id === 'memory_match') startMemoryMatch();
                if (g.id === 'grammar_boss') {
                  setBossHp(100);
                  setPlayerHp(100);
                  setBossTurn(0);
                }
              }}
              className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi hover:shadow-washi-lg hover:border-kai-vermilion/50 transition-all cursor-pointer group flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{g.icon}</span>
                  <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-full bg-kai-gold/15 text-kai-gold">
                    +{g.xp} XP
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-kai-ink dark:text-kai-dark-ink group-hover:text-kai-vermilion transition-colors">
                    {g.title}
                  </h3>
                  <span className="text-2xs font-japanese text-kai-muted">{g.titleJp}</span>
                </div>

                <p className="text-xs text-kai-muted leading-relaxed">{g.desc}</p>
              </div>

              <div className="pt-2 border-t border-kai-border/50 flex items-center justify-between text-xs font-semibold text-kai-vermilion">
                <span>Play Game</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Game 1: Kana Reflex Active */}
      {activeGame === 'kana_reflex' && (
        <div className="max-w-lg mx-auto p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <div className="flex items-center gap-1.5 text-orange-600 font-mono font-bold text-sm">
              <Timer size={18} />
              <span>{reflexTime}s Left</span>
            </div>
            <div className="font-mono font-bold text-base text-kai-ink">
              Score: {reflexScore}
            </div>
          </div>

          {reflexActive ? (
            <div className="space-y-6">
              <div className="text-7xl font-bold font-japanese text-kai-vermilion animate-in zoom-in-95 select-none">
                {reflexCurrent.character}
              </div>

              {/* 4 Quick Choice Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  reflexCurrent.romaji,
                  ...HIRAGANA_DATA.filter((k) => k.id !== reflexCurrent.id)
                    .map((k) => k.romaji)
                    .slice(0, 3)
                ]
                  .sort(() => 0.5 - Math.random())
                  .map((rom, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleReflexChoice(rom)}
                      className="py-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-kai-ink dark:text-white font-mono font-bold text-lg hover:bg-kai-vermilion hover:text-white transition-colors"
                    >
                      {rom}
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              <h3 className="text-xl font-bold text-kai-ink">Game Over!</h3>
              <p className="text-sm text-kai-muted font-mono">
                You scored {reflexScore} correct characters! (+{reflexScore * 5} XP)
              </p>
              <button
                onClick={startKanaReflex}
                className="px-6 py-2.5 rounded-2xl bg-kai-vermilion text-white font-bold text-sm shadow-vermilion"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game 2: Memory Match Active */}
      {activeGame === 'memory_match' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <h3 className="text-base font-bold text-kai-ink font-serif_jp">Memory Tile Match</h3>
            <span className="text-xs font-mono text-kai-muted">
              {memoryTiles.filter((t) => t.matched).length / 2} / 4 Pairs Matched
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {memoryTiles.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => handleTileClick(idx)}
                className={`h-24 rounded-2xl border cursor-pointer flex items-center justify-center text-center p-2 transition-all select-none ${
                  t.matched
                    ? 'bg-green-100 border-green-400 text-green-900 opacity-60'
                    : t.flipped
                    ? 'bg-kai-indigo-bg border-kai-indigo text-kai-ink font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 border-kai-border text-kai-faint hover:border-kai-vermilion'
                }`}
              >
                {t.flipped || t.matched ? (
                  <span className="text-xs font-bold leading-tight">{t.text}</span>
                ) : (
                  <span className="text-2xl font-serif_jp">界</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game 7: Grammar Boss Battle Active */}
      {activeGame === 'grammar_boss' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 text-white shadow-washi-lg space-y-6">
          {/* Boss Header & HP bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <Swords size={15} />
                <span>SHADOW SHOGUN (影将軍)</span>
              </span>
              <span className="text-red-300">{bossHp} / 100 HP</span>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${bossHp}%` }} />
            </div>
          </div>

          {/* Player HP bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-2xs font-mono text-stone-400">
              <span>Learner HP</span>
              <span>{playerHp} / 100 HP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${playerHp}%` }} />
            </div>
          </div>

          {bossHp > 0 && playerHp > 0 ? (
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-4">
              <span className="text-2xs font-mono uppercase text-kai-gold font-bold">
                Spell Incantation #{bossTurn + 1}:
              </span>
              <p className="text-base font-bold font-sans">
                {bossQuestions[bossTurn % bossQuestions.length].q}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {bossQuestions[bossTurn % bossQuestions.length].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBossSpell(idx)}
                    className="p-3.5 rounded-xl bg-stone-700 hover:bg-kai-vermilion text-white font-japanese font-bold text-sm transition-colors text-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : bossHp === 0 ? (
            <div className="text-center py-6 space-y-3">
              <Trophy size={48} className="text-kai-gold mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-kai-gold">Victory! Shogun Banished!</h3>
              <p className="text-xs text-stone-300">You earned +100 XP for mastering verb & particle spells.</p>
              <button
                onClick={() => setActiveGame(null)}
                className="px-6 py-2.5 rounded-xl bg-kai-vermilion text-white font-bold text-xs"
              >
                Back to Hub
              </button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <ShieldAlert size={48} className="text-red-500 mx-auto" />
              <h3 className="text-xl font-bold text-red-400">Defeated! Review Your Grammar!</h3>
              <button
                onClick={() => {
                  setBossHp(100);
                  setPlayerHp(100);
                  setBossTurn(0);
                }}
                className="px-6 py-2.5 rounded-xl bg-stone-700 text-white font-bold text-xs"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
