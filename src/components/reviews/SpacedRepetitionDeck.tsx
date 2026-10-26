// src/components/reviews/SpacedRepetitionDeck.tsx
// FSRS-4 Spaced Repetition Review Deck with category filtering, lapse re-enqueueing, Stability & Retrievability metrics, and session summaries
import React, { useState, useEffect, useMemo } from 'react';
import {
  Repeat,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Filter,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { fsrsService } from '../../services/fsrsService';
import { storageService } from '../../services/storageService';
import { FSRSCard, FSRSRating } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { resolveCardDetails } from '../../services/cardResolver';

type CategoryFilter = 'all' | 'kana' | 'vocab' | 'kanji' | 'grammar' | 'sentence' | 'mistake';

export const SpacedRepetitionDeck: React.FC = () => {
  const { awardXP, rateFSRSCard, displayMode } = useLearning();

  // Storage cards
  const [allCards, setAllCards] = useState<FSRSCard[]>(() => {
    let saved = storageService.getCards();
    if (saved.length === 0) {
      // Seed default cards across multiple skills
      const seedCards = [
        fsrsService.createCard('h_a', 'kana'),
        fsrsService.createCard('h_i', 'kana'),
        fsrsService.createCard('h_u', 'kana'),
        fsrsService.createCard('v_kore', 'vocab'),
        fsrsService.createCard('v_mizu', 'vocab'),
        fsrsService.createCard('k_hon', 'kanji'),
        fsrsService.createCard('g_wa_desu', 'grammar'),
        fsrsService.createCard('s_1', 'sentence')
      ];
      storageService.saveCards(seedCards);
      saved = seedCards;
    }
    return saved;
  });

  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Active review session queue
  const [sessionQueue, setSessionQueue] = useState<FSRSCard[]>([]);
  const [sessionInitialized, setSessionInitialized] = useState<boolean>(false);

  // Session Statistics
  const [sessionStats, setSessionStats] = useState({
    reviewedCount: 0,
    againCount: 0,
    goodEasyCount: 0,
    xpAwarded: 0
  });

  // Due cards calculation
  const dueCards = useMemo(() => {
    const due = fsrsService.getDueCards(allCards);
    if (activeFilter === 'all') return due;
    return due.filter((c) => c.item_type === activeFilter);
  }, [allCards, activeFilter]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const due = fsrsService.getDueCards(allCards);
    return {
      all: due.length,
      kana: due.filter((c) => c.item_type === 'kana').length,
      vocab: due.filter((c) => c.item_type === 'vocab').length,
      kanji: due.filter((c) => c.item_type === 'kanji').length,
      grammar: due.filter((c) => c.item_type === 'grammar').length,
      sentence: due.filter((c) => c.item_type === 'sentence').length,
      mistake: due.filter((c) => c.item_type === 'mistake').length
    };
  }, [allCards]);

  // Initialize or reset session queue when filter changes or on first mount
  useEffect(() => {
    setSessionQueue([...dueCards]);
    setIsFlipped(false);
    setSessionInitialized(true);
  }, [activeFilter, allCards.length]);

  const currentCard = sessionQueue[0] || null;

  const cardDetails = useMemo(() => {
    if (!currentCard) return null;
    return resolveCardDetails(currentCard.item_id, currentCard.item_type);
  }, [currentCard]);

  // Estimated retrievability
  const retrievabilityPercent = useMemo(() => {
    if (!currentCard) return 100;
    const r = fsrsService.getRetrievability(currentCard);
    return Math.round(r * 100);
  }, [currentCard]);

  const handleRate = (rating: FSRSRating) => {
    if (!currentCard) return;

    soundEffects.playCardFlip();
    const xp = rating === 1 ? 5 : 15;
    rateFSRSCard(currentCard.item_id, currentCard.item_type, rating);
    awardXP(xp, 'FSRS Card Review');

    // Update session stats
    setSessionStats((prev) => ({
      reviewedCount: prev.reviewedCount + 1,
      againCount: rating === 1 ? prev.againCount + 1 : prev.againCount,
      goodEasyCount: rating >= 3 ? prev.goodEasyCount + 1 : prev.goodEasyCount,
      xpAwarded: prev.xpAwarded + xp
    }));

    // Update storage state in allCards
    const updatedCards = storageService.getCards();
    setAllCards(updatedCards);
    setIsFlipped(false);

    // Re-enqueue if 'Again' (rating === 1) so learner re-tests this session
    if (rating === 1) {
      setSessionQueue((prev) => {
        const remaining = prev.slice(1);
        return [...remaining, currentCard];
      });
    } else {
      setSessionQueue((prev) => prev.slice(1));
    }

    if (sessionQueue.length <= 1 && rating !== 1) {
      soundEffects.playLevelUp();
    }
  };

  const handlePracticeMore = () => {
    // Add additional items from known database into review queue
    const moreCards: FSRSCard[] = [
      fsrsService.createCard('h_ka', 'kana'),
      fsrsService.createCard('h_ki', 'kana'),
      fsrsService.createCard('v_neko', 'vocab'),
      fsrsService.createCard('k_mizu', 'kanji'),
      fsrsService.createCard('g_ka_question', 'grammar'),
      fsrsService.createCard('s_2', 'sentence')
    ];
    storageService.saveCards([...allCards, ...moreCards]);
    const updated = storageService.getCards();
    setAllCards(updated);
    setSessionQueue(fsrsService.getDueCards(updated));
    setSessionStats({ reviewedCount: 0, againCount: 0, goodEasyCount: 0, xpAwarded: 0 });
    setIsFlipped(false);
  };

  const isSessionComplete = sessionInitialized && sessionQueue.length === 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>復習 (FSRS)</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Spaced Repetition Deck</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Optimized memory retention scheduling using the Free Spaced Repetition Scheduler algorithm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono px-3 py-1 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold border border-amber-200">
            {dueCards.length} Total Due
          </span>
          {sessionQueue.length > 0 && (
            <span className="text-2xs font-mono px-3 py-1 rounded-xl bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-blue-200">
              {sessionQueue.length} Left in Session
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-2xs font-mono">
        <Filter size={12} className="text-kai-muted mr-1 shrink-0" />
        {(
          [
            { id: 'all', label: 'All' },
            { id: 'kana', label: 'Kana' },
            { id: 'vocab', label: 'Vocab' },
            { id: 'kanji', label: 'Kanji' },
            { id: 'grammar', label: 'Grammar' },
            { id: 'sentence', label: 'Sentence' },
            { id: 'mistake', label: 'Mistakes' }
          ] as const
        ).map((tab) => {
          const count = categoryCounts[tab.id];
          const active = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1 rounded-xl transition-all shrink-0 font-medium ${
                active
                  ? 'bg-kai-ink text-white dark:bg-kai-dark-ink dark:text-kai-ink font-bold shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Active Card Card Surface */}
      {!isSessionComplete && currentCard && cardDetails ? (
        <div className="space-y-6">
          <div
            onClick={() => {
              setIsFlipped(!isFlipped);
              soundEffects.playCardFlip();
            }}
            className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border-2 border-kai-border dark:border-kai-dark-border shadow-washi-lg cursor-pointer min-h-[340px] flex flex-col items-center justify-center text-center relative select-none transition-transform hover:scale-[1.01]"
          >
            {/* Card Metadata Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-2xs font-mono text-kai-muted">
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 uppercase font-bold text-kai-vermilion">
                {currentCard.item_type}
              </span>
              <span>Reps: {currentCard.reps}</span>
              {currentCard.lapses > 0 && (
                <span className="text-red-500 font-semibold">Lapses: {currentCard.lapses}</span>
              )}
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 text-2xs font-mono text-kai-muted">
              <span title="Calculated memory retention probability">
                Retrievability: {retrievabilityPercent}%
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold">
                {sessionQueue.length} remaining
              </span>
            </div>

            {/* Prompt Content */}
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-xs font-mono text-kai-muted">Click anywhere to flip</span>
                <div className="text-5xl md:text-6xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink py-2">
                  {cardDetails.prompt}
                </div>
                <div className="text-xs font-mono text-kai-indigo dark:text-indigo-300">
                  {currentCard.item_type === 'kana'
                    ? 'Recall reading & Telugu phonetic'
                    : currentCard.item_type === 'kanji'
                    ? 'Recall ON/KUN readings and meaning'
                    : currentCard.item_type === 'grammar'
                    ? 'Recall grammatical structure & nuance'
                    : currentCard.item_type === 'sentence'
                    ? 'Recall full Japanese sentence construction'
                    : 'Recall meaning and context'}
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in max-w-md">
                <div className="text-2xl md:text-3xl font-bold text-kai-ink dark:text-white">
                  {cardDetails.meaningEn}
                </div>

                <div className="font-mono text-sm font-semibold text-kai-indigo dark:text-indigo-300">
                  {cardDetails.reading}
                </div>

                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <div className="font-telugu text-base text-kai-vermilion font-medium">
                    {cardDetails.meaningTe}
                  </div>
                )}

                {cardDetails.mnemonic && (
                  <p className="text-2xs text-kai-muted leading-relaxed pt-2 border-t border-kai-border/50">
                    💡 {cardDetails.mnemonic}
                  </p>
                )}

                <div className="pt-2 flex justify-center">
                  <AudioButton text={cardDetails.audioText} size="md" />
                </div>
              </div>
            )}
          </div>

          {/* FSRS Rating 4-Button Grid */}
          {isFlipped ? (
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 animate-in fade-in">
                <button
                  onClick={() => handleRate(1)}
                  className="py-3 px-2 rounded-2xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-900 dark:text-red-200 font-bold text-xs flex flex-col items-center gap-0.5 transition-colors border border-red-300 dark:border-red-800"
                >
                  <span>Again (もう一度)</span>
                  <span className="text-3xs font-mono opacity-70">Re-queue today</span>
                </button>

                <button
                  onClick={() => handleRate(2)}
                  className="py-3 px-2 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-xs flex flex-col items-center gap-0.5 transition-colors border border-amber-300 dark:border-amber-800"
                >
                  <span>Hard (難しい)</span>
                  <span className="text-3xs font-mono opacity-70">1 day</span>
                </button>

                <button
                  onClick={() => handleRate(3)}
                  className="py-3 px-2 rounded-2xl bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold text-xs flex flex-col items-center gap-0.5 transition-colors border border-blue-300 dark:border-blue-800"
                >
                  <span>Good (良い)</span>
                  <span className="text-3xs font-mono opacity-70">1-3 days</span>
                </button>

                <button
                  onClick={() => handleRate(4)}
                  className="py-3 px-2 rounded-2xl bg-green-100 hover:bg-green-200 dark:bg-green-950/60 dark:hover:bg-green-900 text-green-900 dark:text-green-200 font-bold text-xs flex flex-col items-center gap-0.5 transition-colors border border-green-300 dark:border-green-800"
                >
                  <span>Easy (簡単)</span>
                  <span className="text-3xs font-mono opacity-70">4 days</span>
                </button>
              </div>
              <p className="text-center text-3xs font-mono text-kai-muted">
                Rating "Again" schedules re-learning in FSRS and re-inserts the card at the end of this active session.
              </p>
            </div>
          ) : (
            <div className="text-center text-xs text-kai-muted font-mono">
              Tap the card above to inspect answer and unlock memory ratings
            </div>
          )}
        </div>
      ) : (
        /* End of Session Summary Screen */
        <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-white">
              Session Complete! (復習完了)
            </h2>
            <p className="text-xs text-kai-muted max-w-sm mx-auto">
              All scheduled review cards for this session have been completed and their retrievability curves recalculated.
            </p>
          </div>

          {/* Session Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-kai-border text-center">
              <span className="text-2xs font-mono text-kai-muted uppercase block">Reviewed</span>
              <span className="text-2xl font-bold text-kai-ink dark:text-white font-mono">
                {sessionStats.reviewedCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-kai-border text-center">
              <span className="text-2xs font-mono text-kai-muted uppercase block">Lapses (Again)</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400 font-mono">
                {sessionStats.againCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-kai-border text-center">
              <span className="text-2xs font-mono text-kai-muted uppercase block">Recall Accuracy</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {sessionStats.reviewedCount > 0
                  ? Math.round(
                      ((sessionStats.reviewedCount - sessionStats.againCount) / sessionStats.reviewedCount) * 100
                    )
                  : 100}
                %
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-kai-border text-center">
              <span className="text-2xs font-mono text-kai-muted uppercase block">XP Awarded</span>
              <span className="text-2xl font-bold text-kai-vermilion font-mono">
                +{sessionStats.xpAwarded}
              </span>
            </div>
          </div>

          {/* Pedagogical Note */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-kai-border/70 flex items-start gap-3 text-xs text-kai-muted">
            <TrendingUp size={18} className="text-kai-indigo shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-kai-ink dark:text-white">
                FSRS Free Spaced Repetition Retrievability Updated
              </p>
              <p className="text-2xs mt-0.5 leading-relaxed">
                Cards you marked Easy or Good have had their stability intervals expanded up to several days. Cards marked Again have entered the relearning state for tighter repetition.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handlePracticeMore}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-xs shadow-vermilion inline-flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw size={14} />
              <span>Practice 6 More Cards</span>
            </button>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View All Categories</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
