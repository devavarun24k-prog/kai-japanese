// src/components/vocab/VocabAcademy.tsx
// Vocabulary Academy with categorized decks, search, Telugu meanings, audio, and deck import/export
import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Download,
  Upload,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { VOCAB_DATA } from '../../data/vocabData';
import { VocabItem, VocabCategory } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { FuriganaText } from '../common/FuriganaText';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const VocabAcademy: React.FC = () => {
  const { displayMode, awardXP, rateFSRSCard } = useLearning();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<VocabItem>(VOCAB_DATA[0]);
  const [viewMode, setViewMode] = useState<'cards' | 'flashcard'>('cards');
  const [flashcardFlipped, setFlashcardFlipped] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Topics (すべて)', icon: '✨' },
    { id: 'greetings', label: 'Greetings (挨拶)', icon: '👋' },
    { id: 'daily_life', label: 'Daily Life (日常生活)', icon: '🏠' },
    { id: 'food', label: 'Food & Dining (食事)', icon: '🍱' },
    { id: 'transport', label: 'Transport (交通)', icon: '🚆' },
    { id: 'numbers', label: 'Numbers (数字)', icon: '🔢' },
    { id: 'time_dates', label: 'Time & Dates (時間)', icon: '⏰' }
  ];

  const filteredVocab = VOCAB_DATA.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.word.includes(q) ||
      v.reading.includes(q) ||
      v.romaji.toLowerCase().includes(q) ||
      v.english.toLowerCase().includes(q) ||
      v.telugu.includes(q);
    return matchesCategory && matchesSearch;
  });

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
    setFlashcardIndex((prev) => (prev + 1) % filteredVocab.length);
    setSelectedItem(filteredVocab[(flashcardIndex + 1) % filteredVocab.length]);
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
            High-yield N5/N4 vocabulary with English and natural Telugu translations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'cards' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
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
                viewMode === 'flashcard' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink dark:text-white' : 'text-kai-muted'
              }`}
            >
              FSRS Flashcards
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
          {categories.map((c) => (
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
            </button>
          ))}
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
            <div className="text-2xs font-mono text-kai-muted">
              Found {filteredVocab.length} vocabulary words
            </div>

            <div className="space-y-2">
              {filteredVocab.map((v) => {
                const isSelected = selectedItem.id === v.id;
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
                        <span className="font-japanese font-bold text-lg text-kai-ink dark:text-kai-dark-ink">
                          {v.word}
                        </span>
                        <span className="font-mono text-xs text-kai-indigo dark:text-indigo-300">
                          {v.reading}
                        </span>
                        <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-kai-muted uppercase">
                          {v.part_of_speech}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-kai-muted dark:text-kai-dark-muted">
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
          </div>

          {/* Right Col: Deep Dive Card Inspector */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-kai-border/60 pb-3">
              <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-kai-indigo-bg text-kai-indigo font-bold">
                {selectedItem.jlpt_level} Core
              </span>
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
        </div>
      )}

      {/* View Mode 2: FSRS Spaced Repetition Flashcards */}
      {viewMode === 'flashcard' && (
        <div className="max-w-md mx-auto space-y-6">
          <div
            onClick={() => {
              setFlashcardFlipped(!flashcardFlipped);
              soundEffects.playCardFlip();
            }}
            className="p-8 rounded-3xl bg-white dark:bg-kai-dark-card border-2 border-kai-border dark:border-kai-dark-border shadow-washi-lg cursor-pointer min-h-[300px] flex flex-col items-center justify-center text-center relative select-none transition-transform hover:scale-[1.01]"
          >
            <span className="absolute top-4 right-4 text-2xs font-mono text-kai-muted">
              Card {flashcardIndex + 1} of {filteredVocab.length}
            </span>

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
    </div>
  );
};
