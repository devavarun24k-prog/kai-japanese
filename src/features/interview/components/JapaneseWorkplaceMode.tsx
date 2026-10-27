// src/features/interview/components/JapaneseWorkplaceMode.tsx
// Japanese workplace interview cards with profile-based template filling & speech recognition practice
import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Save
} from 'lucide-react';
import { JAPANESE_INTERVIEW_CARDS } from '../data/japaneseQuestions';
import { JapaneseInterviewCard, CandidateProfileFields } from '../types';
import { fillTemplate } from '../utils/templateFiller';
import { getInterviewProgress, saveCandidateProfileFields } from '../storage';
import { speechRecognitionService } from '../../../services/speechRecognition';
import { UnverifiedBadge } from '../../../components/common/UnverifiedBadge';
import { useLearning } from '../../../context/LearningContext';

export const JapaneseWorkplaceMode: React.FC = () => {
  const { awardXP } = useLearning();
  const [profile, setProfile] = useState<CandidateProfileFields>(() => getInterviewProgress().profileFields);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  // Spoken practice state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [speechResult, setSpeechResult] = useState<any | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const currentCard: JapaneseInterviewCard = JAPANESE_INTERVIEW_CARDS[currentCardIndex] || JAPANESE_INTERVIEW_CARDS[0];

  // Filled templates (leaving blanks visible if profile field is empty)
  const filledSampleJp = fillTemplate(currentCard.sampleAnswerTemplate, profile);
  const filledSampleRomaji = fillTemplate(currentCard.sampleAnswerRomaji, profile);
  const filledSampleEn = fillTemplate(currentCard.sampleAnswerEn, profile);
  const filledSpeakingScript = fillTemplate(currentCard.scriptForSpeaking, profile);

  const handleSaveProfile = () => {
    saveCandidateProfileFields(profile);
    setIsEditingProfile(false);
  };

  const playSpeech = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  };

  // Start speech recognition practice
  const handleToggleListening = () => {
    if (!speechRecognitionService.getIsSupported()) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setTranscript('');
    setSpeechResult(null);
    setSpeechError(null);
    setIsListening(true);

    const stop = speechRecognitionService.startListening(
      (interim) => setTranscript(interim),
      (finalText) => {
        setIsListening(false);
        setTranscript(finalText);
        const assessment = speechRecognitionService.evaluatePronunciation(
          finalText,
          filledSpeakingScript,
          ''
        );
        setSpeechResult(assessment);
        if (assessment.similarity_score >= 70) {
          awardXP(25, `Spoken Japanese Practice (${assessment.similarity_score}%)`);
        }
      },
      (err) => {
        setIsListening(false);
        setSpeechError(err);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Fields Drawer / Bar */}
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#0E1526]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
            <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
              Candidate Template Profile (No Fake Data)
            </span>
          </div>
          <button
            onClick={() => setIsEditingProfile((prev) => !prev)}
            className="text-xs font-mono text-[#84231D] dark:text-[#FF8A80] hover:underline"
          >
            {isEditingProfile ? 'Collapse Profile' : 'Edit My Real Profile Fields'}
          </button>
        </div>

        {isEditingProfile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-[#E7DECE] dark:border-[#1E2C48] animate-fadeIn">
            <div>
              <label className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8] block">Your Name ({"{name}"}):</label>
              <input
                type="text"
                value={profile.candidateName || ''}
                onChange={(e) => setProfile((p) => ({ ...p, candidateName: e.target.value }))}
                placeholder="e.g. Enosh"
                className="w-full text-xs font-mono p-2 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8] block">University ({"{university}"}):</label>
              <input
                type="text"
                value={profile.university || ''}
                onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))}
                placeholder="e.g. Kyoto Institute of Tech"
                className="w-full text-xs font-mono p-2 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8] block">Major / Dept ({"{major}"}):</label>
              <input
                type="text"
                value={profile.major || ''}
                onChange={(e) => setProfile((p) => ({ ...p, major: e.target.value }))}
                placeholder="e.g. Electronic Engineering"
                className="w-full text-xs font-mono p-2 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8] block">Project Title ({"{project}"}):</label>
              <input
                type="text"
                value={profile.project || ''}
                onChange={(e) => setProfile((p) => ({ ...p, project: e.target.value }))}
                placeholder="e.g. Low-power IoT Node"
                className="w-full text-xs font-mono p-2 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8] block">Target Role ({"{targetRole}"}):</label>
              <input
                type="text"
                value={profile.targetRole || ''}
                onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                placeholder="e.g. Embedded Hardware Engineer"
                className="w-full text-xs font-mono p-2 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659]"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSaveProfile}
                className="w-full py-2 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm hover:bg-[#6e1c17] flex items-center justify-center gap-1.5 font-mono"
              >
                <Save className="w-3.5 h-3.5" /> Save Profile Fields
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Question Topics Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {JAPANESE_INTERVIEW_CARDS.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => {
              setCurrentCardIndex(idx);
              setTranscript('');
              setSpeechResult(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold shrink-0 transition-all ${
              idx === currentCardIndex
                ? 'bg-[#84231D] text-white shadow-sm'
                : 'bg-white dark:bg-[#101726] border border-[#DDD2B8] dark:border-[#253659] text-[#6B6358] dark:text-[#94A3B8]'
            }`}
          >
            {card.titleJp.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Japanese Interview Card */}
      <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-6">
        {/* Card Header & Question */}
        <div className="space-y-3 pb-4 border-b border-[#E7DECE] dark:border-[#1E2C48]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#C59B27]/15 text-[#C59B27] font-semibold">
              {currentCard.titleEn}
            </span>
            <button
              onClick={() => playSpeech(currentCard.questionKana)}
              className="p-2 rounded-full bg-[#84231D]/10 hover:bg-[#84231D]/20 text-[#84231D] dark:text-[#FF8A80] transition-colors"
              title="Hear interviewer question audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
              {currentCard.questionJp}
            </h3>
            <p className="text-xs font-serif_jp text-[#84231D] dark:text-[#FF8A80]">
              {currentCard.questionKana}
            </p>
            <p className="text-[11px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              {currentCard.questionRomaji}
            </p>
            <p className="text-xs text-[#14110F] dark:text-[#E2E8F0] font-medium pt-1">
              {currentCard.questionEn}
            </p>
          </div>

          {currentCard.questionTe && (
            <div className="p-2.5 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] flex items-center justify-between text-xs">
              <span className="text-[#6B6358] dark:text-[#94A3B8]">
                Telugu: <strong>{currentCard.questionTe}</strong>
              </span>
              <UnverifiedBadge isVerified={currentCard.teluguVerified} label="Telugu Unverified" />
            </div>
          )}
        </div>

        {/* Sample Answer Template Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              Sample Japanese Response Template:
            </span>
            <button
              onClick={() => playSpeech(filledSampleJp)}
              className="p-1.5 rounded-lg border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono flex items-center gap-1 text-[#84231D] dark:text-[#FF8A80]"
            >
              <Volume2 className="w-3.5 h-3.5" /> Listen
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] space-y-3">
            <p className="text-sm font-serif_jp text-[#14110F] dark:text-[#F3EBDD] leading-relaxed">
              {filledSampleJp}
            </p>
            <p className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8] leading-relaxed">
              {filledSampleRomaji}
            </p>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-xs text-[#14110F] dark:text-[#E2E8F0]">
              <span className="font-semibold">Translation: </span>
              {filledSampleEn}
            </div>
          </div>
        </div>

        {/* Spoken Practice (Speech Recognition) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
              <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
                Spoken Pronunciation Practice
              </span>
            </div>
            <button
              onClick={handleToggleListening}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#84231D] text-white hover:bg-[#6e1c17]'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" /> Speak Script
                </>
              )}
            </button>
          </div>

          {/* Target script reminder */}
          <div className="text-[11px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
            Practice script: <strong className="text-[#14110F] dark:text-[#F3EBDD] font-serif_jp">{filledSpeakingScript}</strong>
          </div>

          {/* Browser Unsupported Error */}
          {speechError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Live transcript during speech */}
          {transcript && (
            <div className="p-3 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] text-xs font-mono">
              <span className="text-[10px] text-[#6B6358] dark:text-[#94A3B8] block">Heard:</span>
              <p className="text-[#14110F] dark:text-[#F3EBDD]">{transcript}</p>
            </div>
          )}

          {/* Pronunciation Assessment Result */}
          {speechResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  Similarity Score: {speechResult.similarity_score}% ({speechResult.accuracy_rating})
                </span>
                {speechResult.is_match && (
                  <span className="flex items-center gap-1 text-emerald-700 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed Match
                  </span>
                )}
              </div>
              <p className="text-[#14110F] dark:text-[#E2E8F0]">
                {speechResult.feedback_en}
              </p>
            </div>
          )}
        </div>

        {/* Card Navigation */}
        <div className="pt-2 flex items-center justify-between">
          <button
            disabled={currentCardIndex === 0}
            onClick={() => setCurrentCardIndex((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono disabled:opacity-30"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev Card
          </button>
          <span className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
            Card {currentCardIndex + 1} of {JAPANESE_INTERVIEW_CARDS.length}
          </span>
          <button
            disabled={currentCardIndex === JAPANESE_INTERVIEW_CARDS.length - 1}
            onClick={() => setCurrentCardIndex((prev) => Math.min(JAPANESE_INTERVIEW_CARDS.length - 1, prev + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#84231D] text-white text-xs font-semibold font-mono disabled:opacity-30"
          >
            Next Card <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
