// src/services/storageService.ts
// Robust local persistence layer with Supabase sync and full data portability
import {
  UserProfile,
  UserStats,
  FSRSCard,
  LearningAttempt,
  MistakeRecord,
  DailyQuest,
  Achievement
} from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  PROFILE: 'kai_user_profile',
  STATS: 'kai_user_stats',
  FSRS_CARDS: 'kai_fsrs_cards',
  ATTEMPTS: 'kai_learning_attempts',
  MISTAKES: 'kai_mistake_records',
  QUESTS: 'kai_daily_quests',
  ACHIEVEMENTS: 'kai_achievements',
  CUSTOM_DECKS: 'kai_custom_decks',
};

// Default profile for new learner
const DEFAULT_PROFILE: UserProfile = {
  id: 'kai_master_user',
  email: 'learner@kai.japanese',
  display_name: 'Sensei Apprentice',
  jlpt_target: 'N5',
  current_level: 'Beginner — Early Hiragana (ప్రారంభ దశ)',
  daily_goal_minutes: 20,
  sound_enabled: true,
  display_mode: 'bilingual', // Shows English + Telugu alongside Japanese
  romaji_enabled: true,
  furigana_enabled: true,
  theme: 'light',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Default stats for new learner
const DEFAULT_STATS: UserStats = {
  total_xp: 120,
  level: 1,
  level_title: 'Novice Scribe (ప్రారంభ విద్యార్థి)',
  streak_days: 1,
  last_study_date: new Date().toISOString().split('T')[0],
  total_study_seconds: 420,
  kana_mastery_pct: 12,
  vocab_mastered_count: 5,
  kanji_mastered_count: 0,
  grammar_mastered_count: 2,
  reviews_due_count: 3,
  accuracy_rate: 88,
};

class StorageService {
  // Profiles
  public getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {}
    this.saveProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }

  public saveProfile(profile: UserProfile): void {
    try {
      profile.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      this.syncProfileToSupabase(profile);
    } catch (e) {}
  }

  // Stats
  public getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    this.saveStats(DEFAULT_STATS);
    return DEFAULT_STATS;
  }

  public saveStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {}
  }

  // Add XP and check level ups
  public addXP(amount: number): { newXP: number; leveledUp: boolean; newLevel: number; title: string } {
    const stats = this.getStats();
    stats.total_xp += amount;

    // Calculate level: Level = floor(sqrt(XP / 100)) + 1
    const newLevel = Math.max(1, Math.floor(Math.sqrt(stats.total_xp / 80)) + 1);
    const leveledUp = newLevel > stats.level;
    stats.level = newLevel;

    const titles = [
      'Novice Scribe (ప్రారంభ విద్యార్థి)',
      'Kana Apprentice (కానా అభ్యాసకుడు)',
      'Word Seeker (పదాల అన్వేషకుడు)',
      'Grammar Initiate (వ్యాకరణ సాధకుడు)',
      'Sentence Weaver (వాక్య నిర్మాత)',
      'Kanji Traveler (కాంజీ యాత్రికుడు)',
      'N5 Challenger (N5 యోధుడు)',
      'Shadowing Master (స్పీకింగ్ మాస్టర్)',
      'KAI Ronin (కై రోనిన్)',
      'Japanese Master (జపనీస్ మాస్టర్)'
    ];
    stats.level_title = titles[Math.min(titles.length - 1, newLevel - 1)];

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    if (stats.last_study_date !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (stats.last_study_date === yesterday) {
        stats.streak_days += 1;
      } else {
        stats.streak_days = 1;
      }
      stats.last_study_date = today;
    }

    this.saveStats(stats);
    return { newXP: stats.total_xp, leveledUp, newLevel, title: stats.level_title };
  }

  // FSRS Cards
  public getCards(): FSRSCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FSRS_CARDS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  public saveCards(cards: FSRSCard[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FSRS_CARDS, JSON.stringify(cards));
      const stats = this.getStats();
      const now = new Date().toISOString();
      stats.reviews_due_count = cards.filter((c) => c.due <= now).length;
      this.saveStats(stats);
    } catch (e) {}
  }

  public upsertCard(card: FSRSCard): void {
    const cards = this.getCards();
    const idx = cards.findIndex((c) => c.card_id === card.card_id || (c.item_id === card.item_id && c.item_type === card.item_type));
    if (idx >= 0) {
      cards[idx] = card;
    } else {
      cards.push(card);
    }
    this.saveCards(cards);
  }

  // Learning Attempts (Real persisted attempts for weakness detection)
  public getAttempts(): LearningAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  public logAttempt(attempt: Omit<LearningAttempt, 'id' | 'timestamp'>): LearningAttempt {
    const fullAttempt: LearningAttempt = {
      ...attempt,
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    const attempts = this.getAttempts();
    attempts.unshift(fullAttempt);
    // Keep last 1000 attempts for performant memory
    if (attempts.length > 1000) attempts.length = 1000;

    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    } catch (e) {}

    // Update global accuracy
    const stats = this.getStats();
    const recent = attempts.slice(0, 50);
    const correctCount = recent.filter((a) => a.is_correct).length;
    stats.accuracy_rate = Math.round((correctCount / Math.max(1, recent.length)) * 100);
    this.saveStats(stats);

    return fullAttempt;
  }

  // Mistake Notebook
  public getMistakes(): MistakeRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  public logMistake(
    itemId: string,
    itemType: 'kana' | 'vocab' | 'kanji' | 'grammar',
    prompt: string,
    mistakenInput: string,
    correctAnswer: string,
    errorCategory: string,
    notesEn: string,
    notesTe: string
  ): void {
    const mistakes = this.getMistakes();
    const existing = mistakes.find((m) => m.item_id === itemId && m.mistaken_input === mistakenInput);

    if (existing) {
      existing.frequency += 1;
      existing.last_occurred = new Date().toISOString();
      existing.resolved = false;
    } else {
      mistakes.unshift({
        id: `mis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        item_id: itemId,
        item_type: itemType,
        prompt,
        mistaken_input: mistakenInput,
        correct_answer: correctAnswer,
        error_category: errorCategory,
        notes_en: notesEn,
        notes_te: notesTe,
        frequency: 1,
        first_occurred: new Date().toISOString(),
        last_occurred: new Date().toISOString(),
        resolved: false,
      });
    }

    try {
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    } catch (e) {}
  }

  public resolveMistake(id: string): void {
    const mistakes = this.getMistakes();
    const target = mistakes.find((m) => m.id === id);
    if (target) {
      target.resolved = true;
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    }
  }

  // Daily Quests
  public getQuests(): DailyQuest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [
      {
        id: 'q_kana_recall',
        title: 'Master 5 Hiragana Characters',
        title_te: '5 హిరగాన అక్షరాలను సాధన చేయండి',
        description: 'Complete kana stroke order or quiz drills',
        reward_xp: 50,
        progress: 2,
        target: 5,
        completed: false,
        icon: 'pencil'
      },
      {
        id: 'q_vocab_flash',
        title: 'Learn 5 Everyday Words',
        title_te: '5 దైనందిన పదాలను నేర్చుకోండి',
        description: 'Study vocabulary with Telugu & English meanings',
        reward_xp: 40,
        progress: 1,
        target: 5,
        completed: false,
        icon: 'book'
      },
      {
        id: 'q_speaking_shadow',
        title: 'Shadow 2 Spoken Sentences',
        title_te: '2 వాక్యాలను మాట్లాడి సాధన చేయండి',
        description: 'Use the Speaking Studio microphone',
        reward_xp: 60,
        progress: 0,
        target: 2,
        completed: false,
        icon: 'mic'
      },
      {
        id: 'q_fsrs_review',
        title: 'Clear Spaced Repetition Queue',
        title_te: 'నేటి రివిజన్ డెక్‌ను పూర్తి చేయండి',
        description: 'Review cards due today using FSRS',
        reward_xp: 50,
        progress: 0,
        target: 3,
        completed: false,
        icon: 'repeat'
      }
    ];
  }

  public saveQuests(quests: DailyQuest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    } catch (e) {}
  }

  public incrementQuestProgress(questId: string, amount: number = 1): void {
    const quests = this.getQuests();
    const q = quests.find((item) => item.id === questId);
    if (q && !q.completed) {
      q.progress = Math.min(q.target, q.progress + amount);
      if (q.progress >= q.target) {
        q.completed = true;
        this.addXP(q.reward_xp);
      }
      this.saveQuests(quests);
    }
  }

  // Achievements
  public getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [
      {
        id: 'ach_first_step',
        title: 'First Stroke (మొదటి అడుగు)',
        title_jp: '初めの一歩',
        description: 'Complete your first Hiragana trace exercise',
        icon: 'brush',
        reward_xp: 50,
        progress: 1,
        max_progress: 1,
        unlocked: true,
        unlocked_at: new Date().toISOString()
      },
      {
        id: 'ach_vowel_circle',
        title: 'The Five Sacred Vowels',
        title_jp: '五重音 (あ・い・う・え・お)',
        description: 'Master the core Japanese vowels (A, I, U, E, O)',
        icon: 'award',
        reward_xp: 100,
        progress: 3,
        max_progress: 5,
        unlocked: false
      },
      {
        id: 'ach_speed_reflex',
        title: 'Kana Reflex Prodigy',
        title_jp: '早押し達人',
        description: 'Score 1,000+ points in Kana Reflex mini-game',
        icon: 'zap',
        reward_xp: 120,
        progress: 0,
        max_progress: 1000,
        unlocked: false
      },
      {
        id: 'ach_streak_3',
        title: 'Dedicated Pilgrim (మూడు రోజుల సాధన)',
        title_jp: '継続の力',
        description: 'Maintain a 3-day Japanese study streak',
        icon: 'flame',
        reward_xp: 150,
        progress: 1,
        max_progress: 3,
        unlocked: false
      },
      {
        id: 'ach_shadowing_novice',
        title: 'Voice of Nihon (జపనీస్ వాణి)',
        title_jp: '声の達人',
        description: 'Score 85%+ accuracy on 5 speaking exercises',
        icon: 'mic',
        reward_xp: 200,
        progress: 0,
        max_progress: 5,
        unlocked: false
      }
    ];
  }

  public saveAchievements(achs: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achs));
    } catch (e) {}
  }

  // Data Sovereignty & Portability
  public exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      profile: this.getProfile(),
      stats: this.getStats(),
      cards: this.getCards(),
      attempts: this.getAttempts(),
      mistakes: this.getMistakes(),
      quests: this.getQuests(),
      achievements: this.getAchievements(),
    };
    return JSON.stringify(backup, null, 2);
  }

  public importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.stats) localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
      if (data.cards) localStorage.setItem(STORAGE_KEYS.FSRS_CARDS, JSON.stringify(data.cards));
      if (data.attempts) localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(data.attempts));
      if (data.mistakes) localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(data.mistakes));
      if (data.quests) localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(data.quests));
      if (data.achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Clean wipe/purge for single-user privacy compliance
  public purgeAllUserData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }

  // Supabase background sync
  private async syncProfileToSupabase(profile: UserProfile): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.from('profiles').upsert({
        id: session.user.id,
        email: profile.email,
        display_name: profile.display_name,
        jlpt_target: profile.jlpt_target,
        daily_goal_minutes: profile.daily_goal_minutes,
        display_mode: profile.display_mode,
        romaji_enabled: profile.romaji_enabled,
        furigana_enabled: profile.furigana_enabled,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
  }
}

export const storageService = new StorageService();
