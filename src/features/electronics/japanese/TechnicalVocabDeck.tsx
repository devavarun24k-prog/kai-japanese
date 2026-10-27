// src/features/electronics/japanese/TechnicalVocabDeck.tsx
// Spaced Review Deck & Reference Library for 80 Technical Japanese Electronics Terms
import React, { useState, useMemo } from 'react';
import { Volume2, ChevronRight, ChevronLeft, Search, Filter, BookOpen, Repeat, Eye, EyeOff } from 'lucide-react';
import { ELECTRONICS_TERMS } from './terms';
import { TechnicalTermItem } from './types';
import { KanjiCompoundBreakdown } from './KanjiCompoundBreakdown';
import { UnverifiedBadge } from '../../../components/common/UnverifiedBadge';
import { useLearning } from '../../../context/LearningContext';
import { FSRSRating } from '../../../types';

export const TechnicalVocabDeck: React.FC = () => {
  const { rateFSRSCard, awardXP } = useLearning();
  const [activeTab, setActiveTab] = useState<'study' | 'browse'>('study');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(true);
  const [selectedTermForModal, setSelectedTermForModal] = useState<TechnicalTermItem | null>(null);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return ELECTRONICS_TERMS.filter((term) => {
      const matchesCat = categoryFilter === 'all' || term.category === categoryFilter;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        term.kanji.toLowerCase().includes(q) ||
        term.kana.toLowerCase().includes(q) ||
        term.romaji.toLowerCase().includes(q) ||
        term.english.toLowerCase().includes(q) ||
        (term.telugu && term.telugu.toLowerCase().includes(q)) ||
        term.plainDefinition.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchQuery]);

  const currentTerm = filteredTerms[currentIndex] || filteredTerms[0];

  const playSpeech = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio fallback silent
    }
  };

  const handleRate = (rating: FSRSRating) => {
    if (!currentTerm) return;
    rateFSRSCard(currentTerm.id, 'vocab', rating);
    awardXP(rating === 4 ? 15 : rating === 3 ? 10 : 5, `Reviewed ${currentTerm.kanji}`);
    setIsFlipped(false);
    if (currentIndex < filteredTerms.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/90 dark:bg-[#0E1526]/90 border border-[#DDD2B8] dark:border-[#253659] shadow-washi">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'study'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            Spaced Flashcard Review
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'browse'
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Terms Directory ({ELECTRONICS_TERMS.length})
          </button>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#6B6358] dark:text-[#94A3B8]" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="text-xs rounded-lg px-2.5 py-1.5 bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] text-[#14110F] dark:text-[#F3EBDD] font-mono focus:outline-none focus:ring-1 focus:ring-[#84231D]"
          >
            <option value="all">All Categories ({ELECTRONICS_TERMS.length})</option>
            <option value="semiconductor">Semiconductors & Physics</option>
            <option value="circuit_basics">Circuit Fundamentals</option>
            <option value="components">Components & Devices</option>
            <option value="manufacturing_qc">Manufacturing & QC</option>
            <option value="equipment">Cleanroom & Equipment</option>
          </select>
        </div>
      </div>

      {/* FLASHCARD STUDY MODE */}
      {activeTab === 'study' && currentTerm && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
            <span>Card {currentIndex + 1} of {filteredTerms.length}</span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-[#DDD2B8]/40 dark:bg-[#1C2945] text-[11px]">
              {currentTerm.category.replace('_', ' ')}
            </span>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => !isFlipped && setIsFlipped(true)}
            className={`p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border-2 ${
              isFlipped ? 'border-[#C59B27]/50 dark:border-[#C59B27]/40' : 'border-[#DDD2B8] dark:border-[#2E4370]'
            } shadow-washi transition-all min-h-[320px] flex flex-col justify-between cursor-pointer`}
          >
            {/* Front of card */}
            <div className="text-center space-y-3 my-auto">
              <div className="inline-flex items-center gap-3">
                <h3 className="text-4xl md:text-5xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD] tracking-wide">
                  {currentTerm.kanji}
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSpeech(currentTerm.kana);
                  }}
                  className="p-2.5 rounded-full bg-[#84231D]/10 hover:bg-[#84231D]/20 text-[#84231D] dark:text-[#FF8A80] transition-colors"
                  title="Listen to Japanese pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {isFlipped ? (
                <div className="space-y-1 animate-fadeIn">
                  <p className="text-lg font-serif_jp text-[#84231D] dark:text-[#FF8A80] font-medium">
                    {currentTerm.kana}
                  </p>
                  <p className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
                    {currentTerm.romaji}
                  </p>
                </div>
              ) : (
                <p className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8] flex items-center justify-center gap-1.5 pt-4">
                  <Eye className="w-3.5 h-3.5" /> Click or tap card to reveal meaning & technical notes
                </p>
              )}
            </div>

            {/* Revealed Details */}
            {isFlipped && (
              <div className="pt-6 border-t border-[#E7DECE] dark:border-[#1E2C48] space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6358] dark:text-[#94A3B8]">
                    English Definition
                  </span>
                  <p className="text-base font-semibold text-[#14110F] dark:text-[#F3EBDD]">
                    {currentTerm.english}
                  </p>
                  <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] leading-relaxed pt-1">
                    {currentTerm.plainDefinition}
                  </p>
                </div>

                {/* Telugu transliteration with verification badge */}
                {currentTerm.telugu && (
                  <div className="p-2.5 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] flex items-center justify-between text-xs">
                    <span className="text-[#6B6358] dark:text-[#94A3B8] font-mono text-[11px]">
                      Telugu: <strong className="text-[#14110F] dark:text-[#E2E8F0] font-normal">{currentTerm.telugu}</strong>
                    </span>
                    <UnverifiedBadge isVerified={currentTerm.teluguVerified} label="Telugu Unverified" />
                  </div>
                )}

                {/* Workplace example if available */}
                {currentTerm.workplaceExample && (
                  <div className="p-3 rounded-xl bg-[#0A101C]/5 dark:bg-[#1A253D]/40 border border-[#DDD2B8] dark:border-[#253659] text-xs space-y-1">
                    <span className="text-[10px] font-mono text-[#84231D] dark:text-[#FF8A80] font-semibold">
                      Workplace Context:
                    </span>
                    <p className="font-serif_jp text-[#14110F] dark:text-[#F3EBDD]">
                      {currentTerm.workplaceExample.ja}
                    </p>
                    <p className="text-[11px] text-[#6B6358] dark:text-[#94A3B8] italic">
                      "{currentTerm.workplaceExample.en}"
                    </p>
                  </div>
                )}

                {/* Toggle Breakdown */}
                {currentTerm.kanjiBreakdown && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBreakdown((prev) => !prev);
                      }}
                      className="text-xs font-mono text-[#84231D] dark:text-[#FF8A80] hover:underline flex items-center gap-1"
                    >
                      {showBreakdown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showBreakdown ? 'Hide' : 'Show'} Compound Kanji Breakdown
                    </button>
                    {showBreakdown && (
                      <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                        <KanjiCompoundBreakdown
                          compound={currentTerm.kanji}
                          kana={currentTerm.kana}
                          romaji={currentTerm.romaji}
                          english={currentTerm.english}
                          morphemes={currentTerm.kanjiBreakdown}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FSRS Rating Bar (Visible when flipped) */}
          {isFlipped ? (
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-center block text-[#6B6358] dark:text-[#94A3B8]">
                Rate your recall difficulty (Free Spaced Repetition):
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate(1)}
                  className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 text-xs font-bold transition-all text-center"
                >
                  Again (1)
                  <span className="block text-[10px] font-normal opacity-80">&lt; 10m</span>
                </button>
                <button
                  onClick={() => handleRate(2)}
                  className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all text-center"
                >
                  Hard (2)
                  <span className="block text-[10px] font-normal opacity-80">1 day</span>
                </button>
                <button
                  onClick={() => handleRate(3)}
                  className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold transition-all text-center"
                >
                  Good (3)
                  <span className="block text-[10px] font-normal opacity-80">2-3 days</span>
                </button>
                <button
                  onClick={() => handleRate(4)}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all text-center"
                >
                  Easy (4)
                  <span className="block text-[10px] font-normal opacity-80">4+ days</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className="px-5 py-2 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] transition-colors"
              >
                Reveal Answer
              </button>
              <button
                disabled={currentIndex === filteredTerms.length - 1}
                onClick={() => {
                  setCurrentIndex((prev) => Math.min(filteredTerms.length - 1, prev + 1));
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono disabled:opacity-30"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* DIRECTORY BROWSE MODE */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6358] dark:text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 80 terms by Kanji, Kana, Romaji, English, or Telugu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#101726] border border-[#DDD2B8] dark:border-[#253659] text-xs text-[#14110F] dark:text-[#F3EBDD] font-mono focus:outline-none focus:ring-2 focus:ring-[#84231D]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                onClick={() => setSelectedTermForModal(term)}
                className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm hover:border-[#C59B27]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
                        {term.kanji}
                      </h4>
                      <p className="text-xs font-serif_jp text-[#84231D] dark:text-[#FF8A80]">
                        {term.kana} ({term.romaji})
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-[#1A253D] text-[#6B6358] dark:text-[#94A3B8] shrink-0">
                      {term.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#14110F] dark:text-[#E2E8F0] mt-2 line-clamp-1">
                    {term.english}
                  </p>
                  <p className="text-[11px] text-[#6B6358] dark:text-[#94A3B8] mt-1 line-clamp-2">
                    {term.plainDefinition}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E7DECE] dark:border-[#1E2C48] flex items-center justify-between text-[11px]">
                  {term.telugu ? (
                    <span className="text-[#6B6358] dark:text-[#94A3B8] truncate max-w-[160px]">
                      TE: {term.telugu}
                    </span>
                  ) : <span />}
                  <span className="font-mono text-[#84231D] dark:text-[#FF8A80] hover:underline flex items-center gap-0.5">
                    Breakdown <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Term Detail & Breakdown */}
          {selectedTermForModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F3EBDD] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
                      {selectedTermForModal.kanji}
                    </h3>
                    <button
                      onClick={() => playSpeech(selectedTermForModal.kana)}
                      className="p-2 rounded-full bg-[#84231D]/10 hover:bg-[#84231D]/20 text-[#84231D] dark:text-[#FF8A80]"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedTermForModal(null)}
                    className="px-3 py-1 text-xs font-mono rounded-lg border border-[#DDD2B8] dark:border-[#253659] hover:bg-stone-200 dark:hover:bg-[#1A253D]"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-serif_jp text-[#84231D] dark:text-[#FF8A80]">
                    {selectedTermForModal.kana} · {selectedTermForModal.romaji}
                  </p>
                  <p className="text-base font-semibold text-[#14110F] dark:text-[#F3EBDD]">
                    {selectedTermForModal.english}
                  </p>
                  <p className="text-xs text-[#6B6358] dark:text-[#94A3B8]">
                    {selectedTermForModal.plainDefinition}
                  </p>
                </div>

                {selectedTermForModal.telugu && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-[#141D33] text-xs">
                    <span>Telugu: <strong>{selectedTermForModal.telugu}</strong></span>
                    <UnverifiedBadge isVerified={selectedTermForModal.teluguVerified} label="Telugu Unverified" />
                  </div>
                )}

                {selectedTermForModal.kanjiBreakdown && (
                  <KanjiCompoundBreakdown
                    compound={selectedTermForModal.kanji}
                    kana={selectedTermForModal.kana}
                    romaji={selectedTermForModal.romaji}
                    english={selectedTermForModal.english}
                    morphemes={selectedTermForModal.kanjiBreakdown}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
