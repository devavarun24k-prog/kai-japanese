// src/components/tutor/AITutorChat.tsx
// Conversational AI Japanese Tutor with adjustable JLPT levels, trilingual support, and honest provider status
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  Sparkles,
  Volume2,
  RefreshCw,
  Lightbulb,
  MessageSquare,
  Compass,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { aiService, AITutorResponse } from '../../services/aiService';
import { AIMessage, JLPTLevel } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { MascotKai } from '../common/MascotKai';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const AITutorChat: React.FC = () => {
  const { displayMode, awardXP } = useLearning();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'kai',
      content:
        "Konnichiwa! I am KAI, your Japanese mentor. Whether you're mastering Hiragana vowels, unravelling particles like は vs が, or practicing sentence building, I'm here to explain concepts clearly in English and Telugu.\n\nWhat would you like to explore today?",
      telugu_translation:
        'నమస్కారం! నేను మీ జపనీస్ గురువు KAI. హిరగాన అక్షరాలు, వ్యాకరణం, లేదా ఉచ్చారణకు సంబంధించి మీకు ఎలాంటి సందేహం ఉన్నా నన్ను అడగవచ్చు.',
      suggested_replies: [
        'Explain the difference between は (wa) and が (ga)',
        'Why do Japanese and Telugu share similar sentence structure?',
        'How does Te-form verb conjugation work?',
        'Start a convenience store roleplay'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'Beginner'>('Beginner');
  const [providerStatus, setProviderStatus] = useState<string>('Built-in Pedagogical Mentor Engine');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    soundEffects.playClick();
    const userMsg: AIMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response: AITutorResponse = await aiService.generateTutorResponse(
        text,
        messages,
        selectedLevel
      );
      setProviderStatus(response.providerUsed);

      const kaiMsg: AIMessage = {
        id: `msg_k_${Date.now()}`,
        sender: 'kai',
        content: response.reply,
        telugu_translation: response.teluguTranslation,
        grammar_breakdown: response.grammarBreakdown,
        suggested_replies: response.suggestedReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, kaiMsg]);
      soundEffects.playCorrect();
      awardXP(5, 'Engaged with KAI Tutor');
    } catch (err) {
      console.error('Tutor chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi overflow-hidden animate-in fade-in duration-300">
      {/* Tutor Top Bar */}
      <div className="p-4 border-b border-kai-border dark:border-kai-dark-border bg-kai-bg/60 dark:bg-kai-dark-bg/60 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <MascotKai mood="cheerful" size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink">
                KAI AI Sensei (カイ先生)
              </h2>
              <span className="text-3xs font-mono px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                Active
              </span>
            </div>
            {/* Honest Provider Status Badge */}
            <div className="flex items-center gap-1 text-3xs font-mono text-kai-muted">
              <Cpu size={11} />
              <span>Engine: {providerStatus}</span>
            </div>
          </div>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono text-kai-muted">Pedagogical Level:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border text-kai-ink dark:text-kai-dark-ink focus:outline-none focus:ring-1 focus:ring-kai-vermilion"
          >
            <option value="Beginner">Beginner (Hiragana)</option>
            <option value="N5">JLPT N5 (Basic)</option>
            <option value="N4">JLPT N4 (Elementary)</option>
            <option value="N3">JLPT N3 (Intermediate)</option>
            <option value="N2">JLPT N2 (Advanced)</option>
            <option value="N1">JLPT N1 (Mastery)</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kai-vermilion to-kai-vermilion-dark text-white flex items-center justify-center text-xs font-serif_jp font-bold flex-shrink-0 shadow-sm mt-1">
                  界
                </div>
              )}

              <div
                className={`space-y-3 max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-kai-indigo text-white rounded-tr-sm shadow-sm'
                    : 'bg-stone-50 dark:bg-kai-dark-bg/70 border border-kai-border/70 dark:border-kai-dark-border text-kai-ink dark:text-kai-dark-ink rounded-tl-sm shadow-washi'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Telugu Translation / Guidance */}
                {!isUser && msg.telugu_translation && (displayMode === 'telugu' || displayMode === 'bilingual') && (
                  <div className="p-3 rounded-2xl bg-kai-vermilion-bg/50 dark:bg-kai-dark-card border border-kai-vermilion/20 space-y-1">
                    <span className="font-telugu font-bold text-2xs text-kai-vermilion block">
                      తెలుగు మార్గదర్శి:
                    </span>
                    <p className="font-telugu text-xs text-kai-ink/80 dark:text-kai-dark-ink/80 leading-relaxed whitespace-pre-wrap">
                      {msg.telugu_translation}
                    </p>
                  </div>
                )}

                {/* Grammar Breakdown Tokens if available */}
                {!isUser && msg.grammar_breakdown && msg.grammar_breakdown.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-kai-border/50">
                    <span className="text-3xs font-mono font-bold uppercase text-kai-muted">
                      Token Breakdown:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.grammar_breakdown.map((t, i) => (
                        <div
                          key={i}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-kai-dark-card border border-kai-border text-3xs font-mono"
                        >
                          <span className="font-japanese font-bold text-kai-vermilion">{t.token}</span>
                          <span className="text-kai-muted ml-1">({t.meaning})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Prompts */}
                {!isUser && msg.suggested_replies && msg.suggested_replies.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggested_replies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(reply)}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border hover:border-kai-vermilion text-2xs text-kai-ink dark:text-kai-dark-ink transition-colors flex items-center gap-1 text-left"
                      >
                        <Sparkles size={11} className="text-kai-gold" />
                        <span>{reply}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-3xs font-mono text-right ${
                    isUser ? 'text-white/60' : 'text-kai-muted'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-kai-vermilion text-white flex items-center justify-center text-xs font-serif_jp font-bold">
              界
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border flex items-center gap-2 text-xs text-kai-muted">
              <span className="w-2 h-2 rounded-full bg-kai-vermilion animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-kai-vermilion animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-kai-vermilion animate-bounce [animation-delay:0.4s]" />
              <span className="font-mono text-2xs">KAI is thinking in Japanese & Telugu...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-kai-border dark:border-kai-dark-border bg-white dark:bg-kai-dark-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about grammar, particles, sentences, or request a roleplay in English or Telugu..."
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg border border-kai-border text-xs text-kai-ink dark:text-kai-dark-ink placeholder:text-kai-faint focus:outline-none focus:ring-2 focus:ring-kai-vermilion/30"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white shadow-vermilion disabled:opacity-40 transition-transform active:scale-95"
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
