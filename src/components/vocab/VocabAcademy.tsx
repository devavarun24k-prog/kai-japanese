// src/components/vocab/VocabAcademy.tsx
// Vocabulary Academy with categorized decks, favorites, mistake-tracking, FSRS, multiple-choice quiz, and typing recall practice
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Download,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Star,
  RotateCcw,
  HelpCircle,
  Edit3,
  Award,
  AlertTriangle
} from 'lucide-react';
import * as wanakana from 'wanakana';
import { VOCAB_DATA } from '../../data/vocabData';
import { VocabItem } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { FuriganaText } from '../common/FuriganaText';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';
import { storageService } from '../../services/storageService';

export const VocabAcademy: React.FC = () => {
  const { displayMode, awardXP, rateFSRSCard, recordAttempt } = useLearning();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<VocabItem>(VOCAB_DATA[0]);
  const [viewMode, setViewMode] = useState<'cards' | 'flashcard' | 'quiz' | 'typing'>('cards');

  // Favorites & Mistakes state
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavoriteVocab());
  const [mistakeItemIds, setMistakeItemIds] = useState<string[]>(() =>
    storageService.getMistakes().filter((m) => m.item_type === 'vocab' && !m.resolved).map((m) => m.item_id)
  );

  // Flashcard state
  const [flashcardFlipped, setFlashcardFlipped] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);

  // Quiz Mode state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Typing Mode state
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [typingInput, setTypingInput] = useState<string>('');
  const [typingSubmitted, setTypingSubmitted] = useState<boolean>(false);
  const [typingIsCorrect, setTypingIsCorrect] = useState<boolean>(false);
  const [typingScore, setTypingScore] = useState<number>(0);

  // Refresh favorites & mistakes from storage when active
  useEffect(() => {
    setFavorites(storageService.getFavoriteVocab());
    setMistakeItemIds(
      storageService.getMistakes().filter((m) => m.item_type === 'vocab' && !m.resolved).map((m) => m.item_id)
    );
  }, [viewMode, selectedCategory]);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Topics (すべて)', icon: '✨' },
    { id: 'favorites', label: 'Starred (お気に入り)', icon: '⭐' },
    { id: 'difficult', label: 'Difficult / Mistakes (苦手な単語)', icon: '⚠️' },
    { id: 'greetings', label: 'Greetings (挨拶)', icon: '👋' },
    { id: 'daily_life', label: 'Daily Life (日常生活)', icon: '🏠' },
    { id: 'food', label: 'Food & Dining (食事)', icon: '🍱' },
    { id: 'transport', label: 'Transport (交通)', icon: '🚆' },
    { id: 'numbers', label: 'Numbers (数字)', icon: '🔢' },
    { id: 'time_dates', label: 'Time & Dates (時間)', icon: '⏰' }
  ];

  const filteredVocab = useMemo(() => {
    return VOCAB_DATA.filter((v) => {
      let matchesCategory = true;
      if (selectedCategory === 'favorites') {
        matchesCategory = favorites.includes(v.id);
      } else if (selectedCategory === 'difficult') {
        matchesCategory = mistakeItemIds.includes(v.id);
      } else if (selectedCategory !== 'all') {
        matchesCategory = v.category === selectedCategory;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.word.includes(q) ||
        v.reading.includes(q) ||
        v.romaji.toLowerCase().includes(q) ||
        v.english.toLowerCase().includes(q) ||
        v.telugu.includes(q) ||
        v.telugu_phonetic.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, favorites, mistakeItemIds]);

  // Keep selected item within bounds
  useEffect(() => {
    if (filteredVocab.length > 0 && !filteredVocab.some((v) => v.id === selectedItem?.id)) {
      setSelectedItem(filteredVocab[0]);
    }
  }, [filteredVocab, selectedItem]);

  const handleToggleFavorite = (vocabId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    storageService.toggleFavoriteVocab(vocabId);
    setFavorites(storageService.getFavoriteVocab());
    soundEffects.playClick();
  };

  const handleExportDeck = () => {
    const deckData = JSON.stringify(VOCAB_DATA, null, 2);
    const blob = new Blob([deckData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kai_n5_vocabulary_deck_${Date.now()}.json`;
    a.click();
    soundEffects.playCorrect();
  };

  const handleFlashcardRating = (rating: 1 | 2 | 3 | 4) => {
    rateFSRSCard(selectedItem.id, 'vocab', rating);
    awardXP(10, 'Vocabulary flashcard reviewed');
    setFlashcardFlipped(false);
    const nextIdx = (flashcardIndex + 1) % (filteredVocab.length || 1);
    setFlashcardIndex(nextIdx);
    if (filteredVocab[nextIdx]) {
      setSelectedItem(filteredVocab[nextIdx]);
    }
  };

  // --- Quiz Generator & Handler ---
  const activeQuizPool = filteredVocab.length >= 4 ? filteredVocab : VOCAB_DATA;
  const currentQuizItem = activeQuizPool[quizIndex % activeQuizPool.length];

  const quizOptions = useMemo(() => {
    if (!currentQuizItem) return [];
    // Generate 4 options: 1 correct + 3 distractors
    const otherWords = activeQuizPool.filter((w) => w.id !== currentQuizItem.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [
      {
        text: currentQuizItem.english,
        telugu: currentQuizItem.telugu,
        word: currentQuizItem.word,
        reading: currentQuizItem.reading,
        isCorrect: true
      },
      ...shuffledOthers.map((o) => ({
        text: o.english,
        telugu: o.telugu,
        word: o.word,
        reading: o.reading,
        isCorrect: false
      }))
    ];
    return options.sort(() => 0.5 - Math.random());
  }, [currentQuizItem, activeQuizPool]);

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionIdx);
    setQuizAnswered(true);

    const chosen = quizOptions[optionIdx];
    const isCorrect = chosen.isCorrect;

    if (isCorrect) {
      soundEffects.playCorrect();
      setQuizScore((prev) => prev + 1);
      awardXP(15, `Mastered vocab: ${currentQuizItem.word}`);
      recordAttempt({
        item_id: currentQuizItem.id,
        item_type: 'vocab',
        skill: 'vocabulary',
        question_type: 'multiple_choice',
        user_response: chosen.text,
        expected_response: currentQuizItem.english,
        is_correct: true,
        response_time_ms: 2200,
        hint_used: false,
        retry_count: 0
      });
      rateFSRSCard(currentQuizItem.id, 'vocab', 3);
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: currentQuizItem.id,
        item_type: 'vocab',
        skill: 'vocabulary',
        question_type: 'multiple_choice',
        user_response: chosen.text,
        expected_response: currentQuizItem.english,
        is_correct: false,
        error_category: 'vocab_meaning_confusion',
        response_time_ms: 2500,
        hint_used: false,
        retry_count: 1
      });
      storageService.recordMistake({
        item_id: currentQuizItem.id,
        item_type: 'vocab',
        prompt: currentQuizItem.word,
        mistaken_input: chosen.text,
        correct_answer: `${currentQuizItem.english} (${currentQuizItem.telugu})`,
        error_category: 'vocab_confusion',
        notes_en: `"${currentQuizItem.word}" (${currentQuizItem.reading}) means "${currentQuizItem.english}".`,
        notes_te: `"${currentQuizItem.word}" అంటే "${currentQuizItem.telugu}".`
      });
      rateFSRSCard(currentQuizItem.id, 'vocab', 1);
    }
  };

  const handleNextQuiz = () => {
    setQuizIndex((prev) => (prev + 1) % activeQuizPool.length);
    setQuizAnswered(false);
    setSelectedQuizOption(null);
  };

  // --- Typing Mode Handler ---
  const activeTypingPool = filteredVocab.length > 0 ? filteredVocab : VOCAB_DATA;
  const currentTypingItem = activeTypingPool[typingIndex % activeTypingPool.length];

  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typingSubmitted || !typingInput.trim()) return;

    const cleanInput = typingInput.trim().toLowerCase();
    const expectedRomaji = currentTypingItem.romaji.toLowerCase();
    const expectedKana = currentTypingItem.reading;
    const inputHiragana = wanakana.toHiragana(cleanInput);

    // Matches Romaji or Hiragana or Japanese word
    const isCorrect =
      cleanInput === expectedRomaji ||
      inputHiragana === expectedKana ||
      cleanInput === currentTypingItem.word;

    setTypingSubmitted(true);
    setTypingIsCorrect(isCorrect);

    if (isCorrect) {
      soundEffects.playCorrect();
      setTypingScore((prev) => prev + 1);
      awardXP(20, `Typed recall for ${currentTypingItem.word}`);
      recordAttempt({
        item_id: currentTypingItem.id,
        item_type: 'vocab',
        skill: 'vocabulary',
        question_type: 'typing_recall',
        user_response: cleanInput,
        expected_response: expectedRomaji,
        is_correct: true,
        response_time_ms: 2800,
        hint_used: false,
        retry_count: 0
      });
      rateFSRSCard(currentTypingItem.id, 'vocab', 4);
    } else {
      soundEffects.playWrong();
      recordAttempt({
        item_id: currentTypingItem.id,
        item_type: 'vocab',
        skill: 'vocabulary',
        question_type: 'typing_recall',
        user_response: cleanInput,
        expected_response: expectedRomaji,
        is_correct: false,
        error_category: 'typing_spelling_error',
        response_time_ms: 3100,
        hint_used: false,
        retry_count: 1
      });
      storageService.recordMistake({
        item_id: currentTypingItem.id,
        item_type: 'vocab',
        prompt: `${currentTypingItem.english} / ${currentTypingItem.telugu}`,
        mistaken_input: cleanInput,
        correct_answer: `${currentTypingItem.word} (${currentTypingItem.reading} / ${currentTypingItem.romaji})`,
        error_category: 'spelling_recall',
        notes_en: `Expected "${currentTypingItem.romaji}" (${currentTypingItem.reading}).`,
        notes_te: `సరియైన ఉచ్చారణ: ${currentTypingItem.telugu_phonetic}.`
      });
      rateFSRSCard(currentTypingItem.id, 'vocab', 1);
    }
  };

  const handleNextTyping = () => {
    setTypingIndex((prev) => (prev + 1) % activeTypingPool.length);
    setTypingInput('');
    setTypingSubmitted(false);
    setTypingIsCorrect(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header with Search and Export/Import Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-kai-border dark:border-kai-dark-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>単語帳</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Vocabulary Academy</span>
          </h1>
          <p className="text-xs text-kai-muted dark:text-kai-dark-muted">
            High-yield N5 vocabulary with English, natural Telugu translations, quiz drills, and active recall typing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode switch */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white'
                  : 'text-kai-muted'
              }`}
            >
              Lexicon List
            </button>
            <button
              onClick={() => {
                setViewMode('flashcard');
                setFlashcardFlipped(false);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'flashcard'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white'
                  : 'text-kai-muted'
              }`}
            >
              FSRS Flashcards
            </button>
            <button
              onClick={() => {
                setViewMode('quiz');
                setQuizAnswered(false);
                setSelectedQuizOption(null);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'quiz'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white'
                  : 'text-kai-muted'
              }`}
            >
              Quiz Drills
            </button>
            <button
              onClick={() => {
                setViewMode('typing');
                setTypingSubmitted(false);
                setTypingInput('');
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'typing'
                  ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white'
                  : 'text-kai-muted'
              }`}
            >
              Typing Recall
            </button>
          </div>

          <button
            onClick={handleExportDeck}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border text-xs font-semibold text-kai-ink dark:text-kai-dark-ink hover:border-kai-vermilion flex items-center gap-1.5 transition-colors shadow-sm"
            title="Export Vocabulary Deck (JSON)"
          >
            <Download size={14} />
            <span>Export Deck</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => {
            const isFavCategory = c.id === 'favorites';
            const isDiffCategory = c.id === 'difficult';
            const count = isFavCategory
              ? favorites.length
              : isDiffCategory
              ? mistakeItemIds.length
              : undefined;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                  selectedCategory === c.id
                    ? 'bg-kai-indigo text-white border-kai-indigo shadow-sm'
                    : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border text-kai-muted hover:text-kai-ink'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
                {count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-3xs ${
                      selectedCategory === c.id
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-kai-muted'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kai-faint" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Japanese word, reading, Romaji, English or Telugu meaning..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border text-xs text-kai-ink dark:text-kai-dark-ink placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
          />
        </div>
      </div>

      {/* View Mode 1: Split Lexicon & Detail Inspector */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Vocab List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-2xs font-mono text-kai-muted">
              <span>Found {filteredVocab.length} vocabulary words</span>
              {selectedCategory === 'favorites' && favorites.length === 0 && (
                <span className="text-kai-vermilion">Tap the star icon on any word to bookmark it here!</span>
              )}
            </div>

            {filteredVocab.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-kai-border text-kai-muted text-xs">
                No words match your current filters. Select "All Topics" or try another search.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredVocab.map((v) => {
                  const isSelected = selectedItem?.id === v.id;
                  const isFav = favorites.includes(v.id);
                  const isMistake = mistakeItemIds.includes(v.id);

                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedItem(v);
                        soundEffects.playClick();
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-kai-vermilion-bg/60 dark:bg-kai-dark-card border-kai-vermilion shadow-sm'
                          : 'bg-white dark:bg-kai-dark-card border-kai-border dark:border-kai-dark-border hover:border-kai-border/80 hover:shadow-washi'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleToggleFavorite(v.id, e)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Star size={16} fill={isFav ? '#fbbf24' : 'none'} />
                          </button>
                          <span className="font-japanese font-bold text-lg text-kai-ink dark:text-kai-dark-ink">
                            {v.word}
                          </span>
                          <span className="font-mono text-xs text-kai-indigo dark:text-indigo-300">
                            {v.reading}
                          </span>
                          <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-kai-muted uppercase">
                            {v.part_of_speech}
                          </span>
                          {isMistake && (
                            <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                              Review Needed
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 text-xs text-kai-muted dark:text-kai-dark-muted pl-7">
                          <span>{v.english}</span>
                          {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                            <span className="font-telugu text-kai-vermilion font-medium">
                              {v.telugu}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <AudioButton text={v.word} size="sm" />
                        <ChevronRight size={16} className={isSelected ? 'text-kai-vermilion' : 'text-kai-faint'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: Deep Dive Card Inspector */}
          {selectedItem && (
            <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-5 sticky top-20">
              <div className="flex items-center justify-between border-b border-kai-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-kai-indigo-bg text-kai-indigo font-bold">
                    {selectedItem.jlpt_level} Core
                  </span>
                  <button
                    onClick={() => handleToggleFavorite(selectedItem.id)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    title="Toggle Favorite"
                  >
                    <Star size={18} fill={favorites.includes(selectedItem.id) ? '#fbbf24' : 'none'} />
                  </button>
                </div>
                <AudioButton text={selectedItem.word} size="md" showSpeedControl={true} />
              </div>

              {/* Word Display with Ruby Furigana */}
              <div className="space-y-2">
                <FuriganaText
                  japanese={selectedItem.word}
                  furigana={selectedItem.reading}
                  romaji={selectedItem.romaji}
                  teluguPhonetic={selectedItem.telugu_phonetic}
                  english={selectedItem.english}
                  telugu={selectedItem.telugu}
                  size="lg"
                />
              </div>

              {/* Mnemonic Association */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 font-serif_jp block">
                  💡 Memory Mnemonic:
                </span>
                <p className="text-amber-900/90 dark:text-amber-200/90 text-2xs leading-relaxed">
                  {selectedItem.mnemonic_en}
                </p>
                {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <p className="font-telugu text-amber-900/80 dark:text-amber-200/80 text-2xs mt-1">
                    {selectedItem.mnemonic_te}
                  </p>
                )}
              </div>

              {/* Example Sentences */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Example Sentence in Context:
                </span>
                {selectedItem.example_sentences.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-kai-bg/70 dark:bg-kai-dark-bg/60 border border-kai-border/60 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-japanese font-semibold text-sm text-kai-ink dark:text-kai-dark-ink">
                        {ex.japanese}
                      </p>
                      <AudioButton text={ex.japanese} size="sm" />
                    </div>
                    <p className="font-mono text-2xs text-kai-indigo dark:text-indigo-300">{ex.romaji}</p>
                    <p className="text-xs text-kai-muted">{ex.english}</p>
                    {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                      <p className="font-telugu text-xs text-kai-vermilion-dark dark:text-kai-vermilion-light">
                        {ex.telugu}
                      </p>
                    )}
                    <p className="text-3xs text-kai-faint font-mono border-t border-kai-border/40 pt-1.5">
                      Note: {ex.grammar_notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: FSRS Spaced Repetition Flashcards */}
      {viewMode === 'flashcard' && selectedItem && (
        <div className="max-w-md mx-auto space-y-6">
          <div
            onClick={() => {
              setFlashcardFlipped(!flashcardFlipped);
              soundEffects.playCardFlip();
            }}
            className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border-2 border-kai-border dark:border-kai-dark-border shadow-washi-lg cursor-pointer min-h-[300px] flex flex-col items-center justify-center text-center relative select-none transition-transform hover:scale-[1.01]"
          >
            <span className="absolute top-4 right-4 text-2xs font-mono text-kai-muted">
              Card {flashcardIndex + 1} of {filteredVocab.length || 1}
            </span>

            <button
              onClick={(e) => handleToggleFavorite(selectedItem.id, e)}
              className="absolute top-4 left-4 text-amber-400 p-1"
            >
              <Star size={18} fill={favorites.includes(selectedItem.id) ? '#fbbf24' : 'none'} />
            </button>

            {!flashcardFlipped ? (
              <div className="space-y-4">
                <span className="text-xs font-mono text-kai-muted">Tap to flip & reveal meaning</span>
                <div className="text-5xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink">
                  {selectedItem.word}
                </div>
                <div className="text-sm font-mono text-kai-indigo">
                  {selectedItem.reading}
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-2xl font-bold text-kai-ink dark:text-kai-dark-ink">
                  {selectedItem.english}
                </div>
                <div className="font-telugu text-lg font-semibold text-kai-vermilion">
                  {selectedItem.telugu}
                </div>
                <div className="text-xs font-mono text-kai-muted">
                  Telugu: {selectedItem.telugu_phonetic}
                </div>
                <div className="text-xs text-kai-muted max-w-xs">
                  {selectedItem.mnemonic_en}
                </div>
                <AudioButton text={selectedItem.word} size="md" />
              </div>
            )}
          </div>

          {/* FSRS Rating Buttons */}
          {flashcardFlipped && (
            <div className="grid grid-cols-4 gap-2 animate-in fade-in">
              <button
                onClick={() => handleFlashcardRating(1)}
                className="py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs"
              >
                Again
              </button>
              <button
                onClick={() => handleFlashcardRating(2)}
                className="py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs"
              >
                Hard
              </button>
              <button
                onClick={() => handleFlashcardRating(3)}
                className="py-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs"
              >
                Good
              </button>
              <button
                onClick={() => handleFlashcardRating(4)}
                className="py-2.5 rounded-xl bg-green-100 hover:bg-green-200 text-green-900 font-bold text-xs"
              >
                Easy
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Mode 3: Multiple Choice Quiz Drills */}
      {viewMode === 'quiz' && currentQuizItem && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-kai-muted font-mono">
            <span>Score: {quizScore}</span>
            <span>Question {quizIndex + 1} of {activeQuizPool.length}</span>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6 text-center">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-kai-muted">
              Select the Correct Meaning
            </span>

            <div className="space-y-2">
              <div className="text-5xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink">
                {currentQuizItem.word}
              </div>
              <div className="text-sm font-mono text-kai-indigo">
                {currentQuizItem.reading} ({currentQuizItem.romaji})
              </div>
              <div className="flex justify-center pt-2">
                <AudioButton text={currentQuizItem.word} size="md" />
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {quizOptions.map((opt, idx) => {
                let btnStyle = 'border-kai-border hover:border-kai-indigo hover:bg-kai-indigo/5';
                if (quizAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'border-green-500 bg-green-50 text-green-900 font-bold';
                  } else if (selectedQuizOption === idx) {
                    btnStyle = 'border-red-500 bg-red-50 text-red-900';
                  } else {
                    btnStyle = 'opacity-40 border-kai-border';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizAnswered}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`p-4 rounded-2xl border text-xs transition-all flex flex-col justify-center ${btnStyle}`}
                  >
                    <span className="font-semibold text-kai-ink dark:text-kai-dark-ink text-sm">
                      {opt.text}
                    </span>
                    {(displayMode === 'telugu' || displayMode === 'bilingual') && (
                      <span className="font-telugu text-kai-vermilion text-2xs mt-0.5">
                        {opt.telugu}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-answer feedback */}
            {quizAnswered && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-kai-border/60 text-xs space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {quizOptions[selectedQuizOption ?? 0]?.isCorrect ? (
                      <span className="flex items-center gap-1 font-bold text-green-600">
                        <CheckCircle2 size={16} /> Correct! (+15 XP)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-red-600">
                        <XCircle size={16} /> Incorrect
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleNextQuiz}
                    className="px-4 py-2 rounded-xl bg-kai-vermilion text-white font-bold hover:bg-kai-vermilion-dark flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <span>Next Word</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
                <p className="text-kai-muted text-2xs text-left">
                  <strong>Memory hint:</strong> {currentQuizItem.mnemonic_en}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode 4: Direct Typing & Recall Practice */}
      {viewMode === 'typing' && currentTypingItem && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-kai-muted font-mono">
            <span>Score: {typingScore}</span>
            <span>Word {typingIndex + 1} of {activeTypingPool.length}</span>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-6 text-center">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-kai-muted">
              Active Recall: Type the Japanese Reading or Romaji
            </span>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-kai-ink dark:text-kai-dark-ink">
                {currentTypingItem.english}
              </div>
              <div className="font-telugu text-lg font-semibold text-kai-vermilion">
                {currentTypingItem.telugu}
              </div>
              <p className="text-2xs text-kai-muted italic">
                Category: {currentTypingItem.category} • Part of speech: {currentTypingItem.part_of_speech}
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleTypingSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  disabled={typingSubmitted}
                  value={typingInput}
                  onChange={(e) => setTypingInput(e.target.value)}
                  placeholder="Type in Romaji or Kana (e.g. arigatou)..."
                  className={`w-full px-5 py-3.5 text-center text-lg rounded-2xl border font-mono transition-all outline-none ${
                    typingSubmitted
                      ? typingIsCorrect
                        ? 'border-green-500 bg-green-50 text-green-900 font-bold'
                        : 'border-red-500 bg-red-50 text-red-900'
                      : 'border-kai-border bg-stone-50 dark:bg-stone-900 focus:border-kai-indigo focus:ring-2 focus:ring-kai-indigo/20'
                  }`}
                />
              </div>

              {!typingSubmitted ? (
                <button
                  type="submit"
                  disabled={!typingInput.trim()}
                  className="w-full py-3 rounded-2xl bg-kai-indigo hover:bg-kai-indigo-dark disabled:opacity-40 text-white font-bold text-sm shadow-sm transition-colors"
                >
                  Check Recall
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div
                    className={`p-4 rounded-2xl border text-xs text-left space-y-2 ${
                      typingIsCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5">
                        {typingIsCorrect ? (
                          <span className="text-green-800 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Excellent Recall! (+20 XP)
                          </span>
                        ) : (
                          <span className="text-red-800 flex items-center gap-1">
                            <XCircle size={16} /> Not quite right
                          </span>
                        )}
                      </span>
                      <AudioButton text={currentTypingItem.word} size="sm" />
                    </div>

                    <div className="text-kai-ink dark:text-kai-dark-ink text-xs space-y-1">
                      <div>
                        Word: <strong>{currentTypingItem.word}</strong> (
                        <span className="font-mono text-kai-indigo">{currentTypingItem.reading}</span> /{' '}
                        <span className="font-mono">{currentTypingItem.romaji}</span>)
                      </div>
                      <div className="font-telugu text-kai-vermilion">
                        తెలుగు ఉచ్చారణ: {currentTypingItem.telugu_phonetic}
                      </div>
                    </div>

                    <p className="text-2xs text-kai-muted pt-1 border-t border-kai-border/30">
                      💡 <strong>Mnemonic:</strong> {currentTypingItem.mnemonic_en}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextTyping}
                    className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Next Word</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
