// src/components/reviews/SpacedRepetitionDeck.tsx
// FSRS-4 Spaced Repetition Review Deck with Stability, Difficulty, and Retrievability tracking
import React, { useState } from 'react';
import {
  Repeat,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { fsrsService } from '../../services/fsrsService';
import { storageService } from '../../services/storageService';
import { FSRSCard, FSRSRating } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const SpacedRepetitionDeck: React.FC = () => {
  const { awardXP, rateFSRSCard, displayMode } = useLearning();
  const [cards, setCards] = useState<FSRSCard[]>(() => {
    let saved = storageService.getCards();
    if (saved.length === 0) {
      // Initialize seed review cards from Kana & Vocab
      const seedCards = [
        fsrsService.createCard('h_a', 'kana'),
        fsrsService.createCard('h_i', 'kana'),
        fsrsService.createCard('v_kore', 'vocab'),
        fsrsService.createCard('g_wa_desu', 'grammar')
      ];
      storageService.saveCards(seedCards);
      saved = seedCards;
    }
    return saved;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Filter due cards
  const dueCards = fsrsService.getDueCards(cards);
  const currentCard = dueCards[currentIndex];

  const handleRate = (rating: FSRSRating) => {
    if (!currentCard) return;

    soundEffects.playCardFlip();
    rateFSRSCard(currentCard.item_id, currentCard.item_type, rating);
    awardXP(rating === 1 ? 5 : 15, 'FSRS Card Review');

    // Update state
    setCards(storageService.getCards());
    setIsFlipped(false);

    if (currentIndex + 1 >= dueCards.length) {
      setSessionCompleted(true);
      soundEffects.playLevelUp();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const resetQueue = () => {
    // Re-seed cards for endless practice
    const newCards = [
      fsrsService.createCard('h_ka', 'kana'),
      fsrsService.createCard('v_mizu', 'vocab'),
      fsrsService.createCard('k_hon', 'kanji'),
      fsrsService.createCard('g_ka_question', 'grammar')
    ];
    storageService.saveCards([...cards, ...newCards]);
    setCards(storageService.getCards());
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

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

        <span className="text-2xs font-mono px-3 py-1 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold border border-amber-200">
          {dueCards.length} Cards Due Today
        </span>
      </div>

      {!sessionCompleted && currentCard ? (
        <div className="space-y-6">
          {/* Card Surface */}
          <div
            onClick={() => {
              setIsFlipped(!isFlipped);
              soundEffects.playCardFlip();
            }}
            className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border-2 border-kai-border dark:border-kai-dark-border shadow-washi-lg cursor-pointer min-h-[320px] flex flex-col items-center justify-center text-center relative select-none transition-transform hover:scale-[1.01]"
          >
            {/* Card Metadata Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-2xs font-mono text-kai-muted">
              <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 uppercase font-bold">
                {currentCard.item_type}
              </span>
              <span>Reps: {currentCard.reps}</span>
            </div>

            <span className="absolute top-4 right-4 text-2xs font-mono text-kai-muted">
              Card {currentIndex + 1} of {dueCards.length}
            </span>

            {/* Prompt Content */}
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-xs font-mono text-kai-muted">Click anywhere to flip</span>
                <div className="text-6xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink">
                  {currentCard.item_id === 'h_a'
                    ? 'あ'
                    : currentCard.item_id === 'h_i'
                    ? 'い'
                    : currentCard.item_id === 'v_kore'
                    ? 'これ'
                    : 'A は B です'}
                </div>
                <div className="text-xs font-mono text-kai-indigo">
                  {currentCard.item_type === 'kana' ? 'Recall reading & stroke order' : 'Recall meaning'}
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-3xl font-bold text-kai-ink dark:text-white">
                  {currentCard.item_id === 'h_a'
                    ? 'a (అ)'
                    : currentCard.item_id === 'h_i'
                    ? 'i (ఇ)'
                    : currentCard.item_id === 'v_kore'
                    ? 'This / ఇది'
                    : 'A is B / A అనేది B'}
                </div>

                <div className="font-telugu text-sm text-kai-vermilion">
                  {currentCard.item_id === 'h_a'
                    ? 'స్పష్టమైన "అ" శబ్దం'
                    : currentCard.item_id === 'h_i'
                    ? 'స్పష్టమైన "ఇ" శబ్దం'
                    : currentCard.item_id === 'v_kore'
                    ? 'మాట్లాడే వ్యక్తి దగ్గర ఉన్న వస్తువు'
                    : 'ప్రాథమిక జపనీస్ వాక్య నిర్మాణం'}
                </div>

                <div className="pt-2 flex justify-center">
                  <AudioButton
                    text={
                      currentCard.item_id === 'h_a'
                        ? 'あ'
                        : currentCard.item_id === 'h_i'
                        ? 'い'
                        : currentCard.item_id === 'v_kore'
                        ? 'これ'
                        : 'これは本です'
                    }
                    size="md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* FSRS Rating 4-Button Grid */}
          {isFlipped ? (
            <div className="grid grid-cols-4 gap-2 animate-in fade-in">
              <button
                onClick={() => handleRate(1)}
                className="py-3 rounded-2xl bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm"
              >
                <span>Again</span>
                <span className="text-3xs font-mono font-normal opacity-70">&lt; 10m</span>
              </button>
              <button
                onClick={() => handleRate(2)}
                className="py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm"
              >
                <span>Hard</span>
                <span className="text-3xs font-mono font-normal opacity-70">1d</span>
              </button>
              <button
                onClick={() => handleRate(3)}
                className="py-3 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm"
              >
                <span>Good</span>
                <span className="text-3xs font-mono font-normal opacity-70">3d</span>
              </button>
              <button
                onClick={() => handleRate(4)}
                className="py-3 rounded-2xl bg-green-100 hover:bg-green-200 text-green-900 font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm"
              >
                <span>Easy</span>
                <span className="text-3xs font-mono font-normal opacity-70">7d</span>
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-kai-muted font-mono">
              Click the card to check your answer and schedule its next review.
            </p>
          )}
        </div>
      ) : (
        /* Completed Deck State */
        <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi text-center space-y-4">
          <CheckCircle2 size={48} className="text-kai-green mx-auto animate-bounce" />
          <h2 className="text-xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
            Queue Cleared! (本日の復習完了)
          </h2>
          <p className="text-xs text-kai-muted max-w-sm mx-auto leading-relaxed">
            All pending FSRS review items have been scheduled. Memory retrievability is optimal.
          </p>
          <button
            onClick={resetQueue}
            className="px-5 py-2.5 rounded-2xl bg-kai-indigo hover:bg-kai-indigo-dark text-white font-semibold text-xs shadow-sm transition-transform active:scale-95"
          >
            Review More Cards
          </button>
        </div>
      )}
    </div>
  );
};
