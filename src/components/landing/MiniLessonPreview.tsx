// src/components/landing/MiniLessonPreview.tsx
// Interactive, hands-on Japanese mini-lesson preview for beginners right on the landing page
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw, Volume2, Award, Lightbulb } from 'lucide-react';
import { MascotKai, MascotMood } from '../common/MascotKai';
import { AudioButton } from '../common/AudioButton';
import { soundEffects } from '../../services/soundEffects';

interface MiniLessonPreviewProps {
  onComplete: () => void;
}

export const MiniLessonPreview: React.FC<MiniLessonPreviewProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('curious');
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Try it! Listen to the sound and pick the right answer!'
  );

  const fireCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D9483B', '#B99A60', '#2B3A4A', '#FBBF24']
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleStep1Answer = (choice: string) => {
    if (isAnswered) return;
    setSelectedOption(choice);
    setIsAnswered(true);

    if (choice === 'a') {
      setIsCorrect(true);
      soundEffects.playCorrect();
      fireCelebrationConfetti();
      setMascotMood('celebrating');
      setMascotSpeech('Sugoi! You just learned your very first Japanese character!');
    } else {
      setIsCorrect(false);
      soundEffects.playWrong();
      setMascotMood('reacting_to_mistake');
      setMascotSpeech("Close! Remember: it looks like an Apple with a stem ('ah')!");
    }
  };

  const handleStep2Answer = (choice: string) => {
    if (isAnswered) return;
    setSelectedOption(choice);
    setIsAnswered(true);

    if (choice === 'thank_you') {
      setIsCorrect(true);
      soundEffects.playLevelUp();
      fireCelebrationConfetti();
      setMascotMood('proud');
      setMascotSpeech("Brilliant! You're already reading and understanding real Japanese!");
    } else {
      setIsCorrect(false);
      soundEffects.playWrong();
      setMascotMood('reacting_to_mistake');
      setMascotSpeech("Not quite! 'Arigatou' is what you say to express gratitude!");
    }
  };

  const resetCurrentStep = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setMascotMood(step === 1 ? 'curious' : 'thinking');
    setMascotSpeech(
      step === 1
        ? 'Let’s give it another shot! You can do this!'
        : 'Take your time and listen to the audio clue!'
    );
  };

  const goToStep2 = () => {
    soundEffects.playClick();
    setStep(2);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setMascotMood('encouraging');
    setMascotSpeech("Now let's try your first full word! You can hear how it sounds.");
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white dark:bg-[#1A2433] border-2 border-[#E5DEC9] dark:border-[#2D3A4F] shadow-washi-lg p-6 sm:p-8 space-y-6 text-[#1A1817] dark:text-[#F0E5CE] select-none transition-all">
      {/* Top Progress & Companion Header */}
      <div className="flex items-center justify-between border-b border-[#E5DEC9] dark:border-[#2D3A4F] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D9483B]/10 text-[#D9483B] text-2xs font-mono font-bold">
            <Sparkles size={11} />
            <span>Interactive Mini-Lesson • {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif_jp">
            {step === 1 ? 'Your First Hiragana Character: あ' : 'Your First Japanese Word: ありがとう'}
          </h3>
        </div>

        {/* Companion Avatar */}
        <MascotKai
          mood={mascotMood}
          speechText={mascotSpeech}
          bubblePlacement="left"
          size="sm"
        />
      </div>

      {/* STEP 1: Single Character 'あ' */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Character Spotlight Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#131B26] border border-[#E5DEC9] dark:border-[#222E3F]">
            <div className="relative flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-[#1A2433] border-2 border-[#D9483B]/30 flex items-center justify-center shadow-md">
                <span className="text-6xl sm:text-7xl font-serif_jp font-bold text-[#D9483B]">
                  あ
                </span>
              </div>
              <div className="mt-2">
                <AudioButton text="あ" size="sm" label="Listen" />
              </div>
            </div>

            <div className="space-y-2 text-left max-w-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#B99A60]">
                <Lightbulb size={14} />
                <span>Memory Mnemonic</span>
              </div>
              <p className="text-xs text-[#554E45] dark:text-[#CBD5E1] leading-relaxed">
                Think of an <strong>Apple</strong> with a little stem on top! It sounds like the
                &quot;ah&quot; in <em>father</em>.
              </p>
              <p className="font-telugu text-2xs text-[#D9483B] dark:text-[#F87171]">
                తెలుగులో: &quot;ఆ&quot; లాంటి సహజమైన ధ్వని.
              </p>
            </div>
          </div>

          {/* Interactive Question */}
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold">
              Which English sound matches this character?
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'a', label: 'a (ah)', hint: 'like father' },
                { id: 'i', label: 'i (ee)', hint: 'like feet' },
                { id: 'u', label: 'u (oo)', hint: 'like soup' }
              ].map((opt) => {
                const isSelected = selectedOption === opt.id;
                let btnStyle =
                  'bg-white dark:bg-[#151D28] border-2 border-[#E5DEC9] dark:border-[#2D3A4F] hover:border-[#D9483B] text-[#1A1817] dark:text-[#F0E5CE]';

                if (isAnswered && isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-bold'
                    : 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleStep1Answer(opt.id)}
                    disabled={isAnswered && isCorrect}
                    className={`p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm ${btnStyle}`}
                  >
                    <span className="text-base font-bold font-mono">{opt.label}</span>
                    <span className="text-3xs text-[#7A7165] dark:text-[#94A3B8]">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Progression Action */}
          {isAnswered && (
            <div className="pt-2 flex items-center justify-between animate-in fade-in duration-200">
              {isCorrect ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400">
                    <CheckCircle2 size={16} />
                    <span>Correct! +10 Demo XP</span>
                  </div>
                  <button
                    type="button"
                    onClick={goToStep2}
                    className="px-4 py-2 rounded-xl bg-[#D9483B] hover:bg-[#B83226] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                  >
                    <span>Next: Your First Word</span>
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-red-500">Not quite! Give it another try.</span>
                  <button
                    type="button"
                    onClick={resetCurrentStep}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1E293B] text-xs font-semibold flex items-center gap-1 hover:bg-stone-200 transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>Try Again</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Full Word 'ありがとう' */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Word Spotlight Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#131B26] border border-[#E5DEC9] dark:border-[#222E3F]">
            <div className="text-center space-y-2">
              <div className="px-6 py-3 rounded-2xl bg-white dark:bg-[#1A2433] border-2 border-[#D9483B]/30 shadow-md">
                <span className="text-3xl sm:text-4xl font-serif_jp font-bold text-[#1A1817] dark:text-[#F0E5CE] tracking-wider">
                  ありがとう
                </span>
                <span className="block text-xs font-mono text-[#D9483B] mt-0.5">
                  a-ri-ga-to-u
                </span>
              </div>
              <AudioButton text="ありがとう" size="sm" label="Pronounce Word" />
            </div>

            <div className="space-y-1.5 text-left max-w-xs">
              <div className="text-xs font-bold text-[#B99A60]">Everyday Expression</div>
              <p className="text-xs text-[#554E45] dark:text-[#CBD5E1] leading-relaxed">
                The most essential polite phrase in Japan. Notice the very first character is the
                <strong> あ</strong> you just mastered!
              </p>
              <p className="font-telugu text-2xs text-[#D9483B] dark:text-[#F87171]">
                అర్థం: ధన్యవాదాలు (Thank you).
              </p>
            </div>
          </div>

          {/* Interactive Question */}
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold">What is the meaning of &quot;ありがとう&quot;?</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'thank_you', label: 'Thank you', sub: 'ధన్యవాదాలు' },
                { id: 'good_morning', label: 'Good morning', sub: 'శుభోదయం' },
                { id: 'goodbye', label: 'Goodbye', sub: 'వీడ్కోలు' }
              ].map((opt) => {
                const isSelected = selectedOption === opt.id;
                let btnStyle =
                  'bg-white dark:bg-[#151D28] border-2 border-[#E5DEC9] dark:border-[#2D3A4F] hover:border-[#D9483B] text-[#1A1817] dark:text-[#F0E5CE]';

                if (isAnswered && isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-bold'
                    : 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleStep2Answer(opt.id)}
                    disabled={isAnswered && isCorrect}
                    className={`p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm ${btnStyle}`}
                  >
                    <span className="text-sm font-bold">{opt.label}</span>
                    <span className="text-3xs font-telugu text-[#7A7165] dark:text-[#94A3B8]">
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Final Congratulations & CTA */}
          {isAnswered && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
              {isCorrect ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400">
                    <Award size={18} className="text-[#B99A60]" />
                    <span>Mini-Lesson Complete! Ready to dive in?</span>
                  </div>
                  <button
                    type="button"
                    onClick={onComplete}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D9483B] hover:bg-[#B83226] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
                  >
                    <span>Start Learning Full Curriculum</span>
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-red-500">
                    Not quite! Remember: it&apos;s a word of gratitude.
                  </span>
                  <button
                    type="button"
                    onClick={resetCurrentStep}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1E293B] text-xs font-semibold flex items-center gap-1 hover:bg-stone-200 transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>Try Again</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
