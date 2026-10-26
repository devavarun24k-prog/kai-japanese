// src/services/storageService.ts
// Robust local persistence layer with user-scoped namespacing, legacy migration, and Supabase synchronization
// SECURITY NOTICE:
// localStorage is a client-side store accessible to any script or user with browser DevTools access on this machine.
// User-namespacing isolates cross-user session bleeding within the application context.
// For zero-trust security and multi-device persistence, Supabase Auth and server-side RLS are enforced.

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

// Base keys used for scoped generation
const BASE_STORAGE_KEYS = {
  PROFILE: 'profile',
  STATS: 'stats',
  FSRS_CARDS: 'fsrs_cards',
  ATTEMPTS: 'attempts',
  MISTAKES: 'mistakes',
  QUESTS: 'quests',
  ACHIEVEMENTS: 'achievements',
  CUSTOM_DECKS: 'custom_decks',
  COMPLETED_LESSONS: 'completed_lessons',
  FAVORITES: 'favorite_vocab',
  SYNC_QUEUE: 'offline_sync_queue',
} as const;

// Legacy unscoped storage keys for backwards compatibility and migration
const LEGACY_STORAGE_KEYS = {
  PROFILE: 'kai_user_profile',
  STATS: 'kai_user_stats',
  FSRS_CARDS: 'kai_fsrs_cards',
  ATTEMPTS: 'kai_learning_attempts',
  MISTAKES: 'kai_mistake_records',
  QUESTS: 'kai_daily_quests',
  ACHIEVEMENTS: 'kai_achievements',
};

// Default profile for new learner
const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_user',
  email: 'learner@kai.japanese',
  display_name: 'Sensei Apprentice',
  jlpt_target: 'N5',
  current_level: 'Beginner — Early Hiragana (ప్రారంభ దశ)',
  daily_goal_minutes: 20,
  sound_enabled: true,
  display_mode: 'bilingual',
  romaji_enabled: true,
  furigana_enabled: true,
  theme: 'light',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Default stats for new learner - ZERO fabricated numbers
const DEFAULT_STATS: UserStats = {
  total_xp: 0,
  level: 1,
  level_title: 'Novice Scribe (ప్రారంభ విద్యార్థి)',
  streak_days: 0,
  last_study_date: '',
  total_study_seconds: 0,
  kana_mastery_pct: 0,
  vocab_mastered_count: 0,
  kanji_mastered_count: 0,
  grammar_mastered_count: 0,
  reviews_due_count: 0,
  accuracy_rate: 100,
};

class StorageService {
  private currentUserId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.flushOfflineSyncQueue();
      });
    }
  }

  // Set the active authenticated user ID and trigger migration if needed
  public setUserId(userId: string | null): void {
    if (this.currentUserId === userId) return;
    this.currentUserId = userId;
    if (userId) {
      this.migrateLegacyDataIfNeeded(userId);
    }
  }

  public getUserId(): string | null {
    return this.currentUserId;
  }

  // Clear in-memory session reference (called on logout)
  public clearMemoryState(): void {
    this.currentUserId = null;
  }

  // Scoped key generator ensuring one user cannot read/write another user's records
  private getKey(baseKey: string): string {
    const scope = this.currentUserId || 'guest';
    return `kai_user_${scope}_${baseKey}`;
  }

  // Safely migrate legacy unscoped data to the first active user's scoped namespace
  private migrateLegacyDataIfNeeded(userId: string): void {
    try {
      const legacyCardKey = LEGACY_STORAGE_KEYS.FSRS_CARDS;
      const userCardKey = this.getKey(BASE_STORAGE_KEYS.FSRS_CARDS);

      const legacyCards = localStorage.getItem(legacyCardKey);
      const userCards = localStorage.getItem(userCardKey);

      // If legacy unscoped data exists and target user has no scoped data yet, migrate
      if (legacyCards && !userCards) {
        // 1. Create a safe, timestamped backup of the legacy data
        const backupPayload: Record<string, string | null> = {};
        Object.entries(LEGACY_STORAGE_KEYS).forEach(([name, legacyKey]) => {
          backupPayload[name] = localStorage.getItem(legacyKey);
        });
        localStorage.setItem(`kai_legacy_backup_${Date.now()}`, JSON.stringify(backupPayload));

        // 2. Copy each legacy key to the user's scoped key
        const profile = localStorage.getItem(LEGACY_STORAGE_KEYS.PROFILE);
        if (profile) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.PROFILE), profile);

        const stats = localStorage.getItem(LEGACY_STORAGE_KEYS.STATS);
        if (stats) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.STATS), stats);

        localStorage.setItem(userCardKey, legacyCards);

        const attempts = localStorage.getItem(LEGACY_STORAGE_KEYS.ATTEMPTS);
        if (attempts) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.ATTEMPTS), attempts);

        const mistakes = localStorage.getItem(LEGACY_STORAGE_KEYS.MISTAKES);
        if (mistakes) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.MISTAKES), mistakes);

        const quests = localStorage.getItem(LEGACY_STORAGE_KEYS.QUESTS);
        if (quests) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.QUESTS), quests);

        const achs = localStorage.getItem(LEGACY_STORAGE_KEYS.ACHIEVEMENTS);
        if (achs) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.ACHIEVEMENTS), achs);
      }
    } catch (err) {
      console.warn('Legacy data migration warning:', err);
    }
  }

  // Profiles
  public getProfile(): UserProfile {
    if (!this.currentUserId) {
      return DEFAULT_PROFILE;
    }
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.PROFILE));
      if (data) return JSON.parse(data);
    } catch (e) {}
    const newProfile = { ...DEFAULT_PROFILE, id: this.currentUserId };
    this.saveProfile(newProfile);
    return newProfile;
  }

  public saveProfile(profile: UserProfile): void {
    if (!this.currentUserId) return;
    try {
      profile.updated_at = new Date().toISOString();
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.PROFILE), JSON.stringify(profile));
      this.syncProfileToSupabase(profile);
    } catch (e) {}
  }

  // Stats
  public getStats(): UserStats {
    if (!this.currentUserId) {
      return DEFAULT_STATS;
    }
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.STATS));
      if (data) return JSON.parse(data);
    } catch (e) {}
    this.saveStats(DEFAULT_STATS);
    return DEFAULT_STATS;
  }

  public saveStats(stats: UserStats): void {
    if (!this.currentUserId) return;
    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.STATS), JSON.stringify(stats));
    } catch (e) {}
  }

  // Add XP and recalculate real level
  public addXP(amount: number): { newXP: number; leveledUp: boolean; newLevel: number; title: string } {
    const stats = this.getStats();
    stats.total_xp += amount;

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
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.FSRS_CARDS));
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  public saveCards(cards: FSRSCard[]): void {
    if (!this.currentUserId) return;
    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.FSRS_CARDS), JSON.stringify(cards));
      this.recalculateDerivedMetrics(cards, this.getAttempts());
    } catch (e) {}
  }

  public upsertCard(card: FSRSCard): void {
    const cards = this.getCards();
    const idx = cards.findIndex(
      (c) => c.card_id === card.card_id || (c.item_id === card.item_id && c.item_type === card.item_type)
    );
    if (idx >= 0) {
      cards[idx] = card;
    } else {
      cards.push(card);
    }
    this.saveCards(cards);
    this.syncCardToSupabase(card);
  }

  // Learning Attempts
  public getAttempts(): LearningAttempt[] {
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.ATTEMPTS));
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

    if (!this.currentUserId) return fullAttempt;

    const attempts = this.getAttempts();
    attempts.unshift(fullAttempt);
    if (attempts.length > 1000) attempts.length = 1000;

    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.ATTEMPTS), JSON.stringify(attempts));
    } catch (e) {}

    this.recalculateDerivedMetrics(this.getCards(), attempts);
    this.syncAttemptToSupabase(fullAttempt);

    return fullAttempt;
  }

  // Dynamically recalculate real metrics based on stored cards and attempts
  private recalculateDerivedMetrics(cards: FSRSCard[], attempts: LearningAttempt[]): void {
    const stats = this.getStats();
    const nowIso = new Date().toISOString();

    // 1. Due reviews count
    stats.reviews_due_count = cards.filter((c) => c.due <= nowIso).length;

    // 2. Real Accuracy Rate
    const recent = attempts.slice(0, 100);
    if (recent.length === 0) {
      stats.accuracy_rate = 100;
    } else {
      const correct = recent.filter((a) => a.is_correct).length;
      stats.accuracy_rate = Math.round((correct / recent.length) * 100);
    }

    // 3. Real Kana Mastery Percentage (out of 46 Gojuon characters)
    const masteredKana = cards.filter((c) => c.item_type === 'kana' && c.state === 2 && c.stability >= 1.5).length;
    stats.kana_mastery_pct = Math.min(100, Math.round((masteredKana / 46) * 100));

    // 4. Mastered Vocab, Kanji, Grammar counts
    stats.vocab_mastered_count = cards.filter((c) => c.item_type === 'vocab' && c.state === 2).length;
    stats.kanji_mastered_count = cards.filter((c) => c.item_type === 'kanji' && c.state === 2).length;
    stats.grammar_mastered_count = cards.filter((c) => c.item_type === 'grammar' && c.state === 2).length;

    this.saveStats(stats);
  }

  // Mistake Notebook
  public getMistakes(): MistakeRecord[] {
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.MISTAKES));
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
    if (!this.currentUserId) return;

    const mistakes = this.getMistakes();
    const existing = mistakes.find((m) => m.item_id === itemId && m.mistaken_input === mistakenInput);

    let recordToSync: MistakeRecord;

    if (existing) {
      existing.frequency += 1;
      existing.last_occurred = new Date().toISOString();
      existing.resolved = false;
      recordToSync = existing;
    } else {
      recordToSync = {
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
      };
      mistakes.unshift(recordToSync);
    }

    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.MISTAKES), JSON.stringify(mistakes));
    } catch (e) {}

    this.syncMistakeToSupabase(recordToSync);
  }

  public recordMistake(params: {
    item_id: string;
    item_type: 'kana' | 'vocab' | 'kanji' | 'grammar';
    prompt: string;
    mistaken_input: string;
    correct_answer: string;
    error_category: string;
    notes_en: string;
    notes_te: string;
  }): void {
    this.logMistake(
      params.item_id,
      params.item_type,
      params.prompt,
      params.mistaken_input,
      params.correct_answer,
      params.error_category,
      params.notes_en,
      params.notes_te
    );
  }

  public resolveMistake(id: string): void {
    if (!this.currentUserId) return;
    const mistakes = this.getMistakes();
    const target = mistakes.find((m) => m.id === id);
    if (target) {
      target.resolved = true;
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.MISTAKES), JSON.stringify(mistakes));
      this.syncMistakeToSupabase(target);
    }
  }

  // Daily Quests
  public getQuests(): DailyQuest[] {
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.QUESTS));
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [
      {
        id: 'q_kana_recall',
        title: 'Master 5 Hiragana Characters',
        title_te: '5 హిరగాన అక్షరాలను సాధన చేయండి',
        description: 'Complete kana stroke order or quiz drills',
        reward_xp: 50,
        progress: 0,
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
        progress: 0,
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
    if (!this.currentUserId) return;
    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.QUESTS), JSON.stringify(quests));
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
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.ACHIEVEMENTS));
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
        progress: 0,
        max_progress: 1,
        unlocked: false
      },
      {
        id: 'ach_vowel_circle',
        title: 'The Five Sacred Vowels',
        title_jp: '五重音 (あ・い・う・え・お)',
        description: 'Master the core Japanese vowels (A, I, U, E, O)',
        icon: 'award',
        reward_xp: 100,
        progress: 0,
        max_progress: 5,
        unlocked: false
      },
      {
        id: 'ach_speed_reflex',
        title: 'Kana Reflex Prodigy',
        title_jp: '早押し達人',
        description: 'Score 10+ points in Kana Reflex mini-game',
        icon: 'zap',
        reward_xp: 120,
        progress: 0,
        max_progress: 10,
        unlocked: false
      },
      {
        id: 'ach_streak_3',
        title: 'Dedicated Pilgrim (మూడు రోజుల సాధన)',
        title_jp: '継続の力',
        description: 'Maintain a 3-day Japanese study streak',
        icon: 'flame',
        reward_xp: 150,
        progress: 0,
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
    if (!this.currentUserId) return;
    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.ACHIEVEMENTS), JSON.stringify(achs));
    } catch (e) {}
  }

  // Lesson Progress Tracking
  public getCompletedLessons(): string[] {
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.COMPLETED_LESSONS));
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  public markLessonCompleted(lessonId: string): void {
    if (!this.currentUserId || !lessonId) return;
    const completed = this.getCompletedLessons();
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      try {
        localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.COMPLETED_LESSONS), JSON.stringify(completed));
      } catch (e) {}
    }
  }

  public isLessonCompleted(lessonId: string): boolean {
    if (!this.currentUserId || !lessonId) return false;
    return this.getCompletedLessons().includes(lessonId);
  }

  // Favorite Vocabulary Tracking
  public getFavoriteVocab(): string[] {
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.FAVORITES));
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  public toggleFavoriteVocab(vocabId: string): boolean {
    if (!this.currentUserId || !vocabId) return false;
    const favorites = this.getFavoriteVocab();
    const idx = favorites.indexOf(vocabId);
    let isFav = false;
    if (idx >= 0) {
      favorites.splice(idx, 1);
      isFav = false;
    } else {
      favorites.push(vocabId);
      isFav = true;
    }
    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.FAVORITES), JSON.stringify(favorites));
    } catch (e) {}
    return isFav;
  }

  public isFavoriteVocab(vocabId: string): boolean {
    if (!this.currentUserId || !vocabId) return false;
    return this.getFavoriteVocab().includes(vocabId);
  }

  // Full JSON Export / Import for current user
  public exportFullBackup(): string {
    const backup = {
      version: '1.0',
      user_id: this.currentUserId,
      exported_at: new Date().toISOString(),
      profile: this.getProfile(),
      stats: this.getStats(),
      cards: this.getCards(),
      attempts: this.getAttempts(),
      mistakes: this.getMistakes(),
      quests: this.getQuests(),
      achievements: this.getAchievements(),
      completed_lessons: this.getCompletedLessons(),
      favorites: this.getFavoriteVocab(),
    };
    return JSON.stringify(backup, null, 2);
  }

  public importBackup(jsonString: string): boolean {
    if (!this.currentUserId) return false;
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.PROFILE), JSON.stringify(data.profile));
      if (data.stats) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.STATS), JSON.stringify(data.stats));
      if (data.cards) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.FSRS_CARDS), JSON.stringify(data.cards));
      if (data.attempts) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.ATTEMPTS), JSON.stringify(data.attempts));
      if (data.mistakes) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.MISTAKES), JSON.stringify(data.mistakes));
      if (data.quests) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.QUESTS), JSON.stringify(data.quests));
      if (data.achievements) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.ACHIEVEMENTS), JSON.stringify(data.achievements));
      if (data.completed_lessons) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.COMPLETED_LESSONS), JSON.stringify(data.completed_lessons));
      if (data.favorites) localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.FAVORITES), JSON.stringify(data.favorites));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Data Purge: Only purges the active user's scoped keys
  public purgeAllUserData(): void {
    if (!this.currentUserId) return;
    Object.values(BASE_STORAGE_KEYS).forEach((baseKey) => {
      localStorage.removeItem(this.getKey(baseKey));
    });
  }

  // Offline Sync Queue
  public getPendingSyncQueue(): Array<{ type: 'profile' | 'card' | 'attempt' | 'mistake'; payload: any; timestamp: string }> {
    if (!this.currentUserId) return [];
    try {
      const data = localStorage.getItem(this.getKey(BASE_STORAGE_KEYS.SYNC_QUEUE));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  public getPendingSyncCount(): number {
    return this.getPendingSyncQueue().length;
  }

  public enqueueOfflineSync(type: 'profile' | 'card' | 'attempt' | 'mistake', payload: any): void {
    if (!this.currentUserId) return;
    const queue = this.getPendingSyncQueue();
    // Deduplicate same card or profile updates
    if (type === 'card' && payload?.card_id) {
      const idx = queue.findIndex((q) => q.type === 'card' && q.payload?.card_id === payload.card_id);
      if (idx >= 0) queue.splice(idx, 1);
    } else if (type === 'profile') {
      const idx = queue.findIndex((q) => q.type === 'profile');
      if (idx >= 0) queue.splice(idx, 1);
    }
    queue.push({ type, payload, timestamp: new Date().toISOString() });
    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.SYNC_QUEUE), JSON.stringify(queue));
    } catch (e) {}
  }

  public async flushOfflineSyncQueue(): Promise<{ synced: number; remaining: number }> {
    if (!isSupabaseConfigured || !supabase || !this.currentUserId) {
      return { synced: 0, remaining: 0 };
    }
    const queue = this.getPendingSyncQueue();
    if (queue.length === 0) return { synced: 0, remaining: 0 };

    const remaining: typeof queue = [];
    let synced = 0;

    for (const item of queue) {
      try {
        if (item.type === 'profile') {
          await this.syncProfileToSupabase(item.payload, false);
        } else if (item.type === 'card') {
          await this.syncCardToSupabase(item.payload, false);
        } else if (item.type === 'attempt') {
          await this.syncAttemptToSupabase(item.payload, false);
        } else if (item.type === 'mistake') {
          await this.syncMistakeToSupabase(item.payload, false);
        }
        synced++;
      } catch (e) {
        remaining.push(item);
      }
    }

    try {
      localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.SYNC_QUEUE), JSON.stringify(remaining));
    } catch (e) {}

    return { synced, remaining: remaining.length };
  }

  // Supabase Sync Up with Automatic Offline Fallback Queue
  private async syncProfileToSupabase(profile: UserProfile, shouldQueueOnError: boolean = true): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine && shouldQueueOnError) {
      this.enqueueOfflineSync('profile', profile);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.from('profiles').upsert({
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
      if (error) {
        if (shouldQueueOnError) this.enqueueOfflineSync('profile', profile);
      }
    } catch (e) {
      if (shouldQueueOnError) this.enqueueOfflineSync('profile', profile);
    }
  }

  private async syncCardToSupabase(card: FSRSCard, shouldQueueOnError: boolean = true): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine && shouldQueueOnError) {
      this.enqueueOfflineSync('card', card);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.from('fsrs_cards').upsert({
        card_id: card.card_id,
        user_id: session.user.id,
        item_id: card.item_id,
        item_type: card.item_type,
        state: card.state,
        due: card.due,
        stability: card.stability,
        difficulty: card.difficulty,
        elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        reps: card.reps,
        lapses: card.lapses,
        last_review: card.last_review,
        updated_at: new Date().toISOString()
      });
      if (error) {
        if (shouldQueueOnError) this.enqueueOfflineSync('card', card);
      }
    } catch (e) {
      if (shouldQueueOnError) this.enqueueOfflineSync('card', card);
    }
  }

  private async syncAttemptToSupabase(attempt: LearningAttempt, shouldQueueOnError: boolean = true): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine && shouldQueueOnError) {
      this.enqueueOfflineSync('attempt', attempt);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.from('learning_attempts').insert({
        id: attempt.id,
        user_id: session.user.id,
        item_id: attempt.item_id,
        item_type: attempt.item_type,
        skill: attempt.skill,
        question_type: attempt.question_type,
        user_response: attempt.user_response,
        expected_response: attempt.expected_response,
        is_correct: attempt.is_correct,
        error_category: attempt.error_category,
        response_time_ms: attempt.response_time_ms,
        hint_used: attempt.hint_used,
        timestamp: attempt.timestamp
      });
      if (error) {
        if (shouldQueueOnError) this.enqueueOfflineSync('attempt', attempt);
      }
    } catch (e) {
      if (shouldQueueOnError) this.enqueueOfflineSync('attempt', attempt);
    }
  }

  private async syncMistakeToSupabase(mistake: MistakeRecord, shouldQueueOnError: boolean = true): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine && shouldQueueOnError) {
      this.enqueueOfflineSync('mistake', mistake);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase.from('mistake_records').upsert({
        id: mistake.id,
        user_id: session.user.id,
        item_id: mistake.item_id,
        item_type: mistake.item_type,
        prompt: mistake.prompt,
        mistaken_input: mistake.mistaken_input,
        correct_answer: mistake.correct_answer,
        error_category: mistake.error_category,
        notes_en: mistake.notes_en,
        notes_te: mistake.notes_te,
        frequency: mistake.frequency,
        first_occurred: mistake.first_occurred,
        last_occurred: mistake.last_occurred,
        resolved: mistake.resolved
      });
      if (error) {
        if (shouldQueueOnError) this.enqueueOfflineSync('mistake', mistake);
      }
    } catch (e) {
      if (shouldQueueOnError) this.enqueueOfflineSync('mistake', mistake);
    }
  }

  // Supabase Pull / Restore into user-scoped namespace
  public async syncFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      this.setUserId(session.user.id);

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileData) {
        const localProfile = this.getProfile();
        this.saveProfile({
          ...localProfile,
          email: profileData.email,
          display_name: profileData.display_name,
          jlpt_target: profileData.jlpt_target,
          daily_goal_minutes: profileData.daily_goal_minutes,
          display_mode: profileData.display_mode,
          romaji_enabled: profileData.romaji_enabled,
          furigana_enabled: profileData.furigana_enabled
        });
      } else {
        // Auto-initialize profile in Supabase if missing
        const currentProfile = this.getProfile();
        await this.syncProfileToSupabase({
          ...currentProfile,
          id: session.user.id,
          email: session.user.email || currentProfile.email
        });
      }

      // 2. Fetch Cards
      const { data: cardData } = await supabase
        .from('fsrs_cards')
        .select('*')
        .eq('user_id', session.user.id);

      if (cardData && cardData.length > 0) {
        localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.FSRS_CARDS), JSON.stringify(cardData));
      }

      // 3. Fetch Mistakes
      const { data: mistakeData } = await supabase
        .from('mistake_records')
        .select('*')
        .eq('user_id', session.user.id);

      if (mistakeData && mistakeData.length > 0) {
        localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.MISTAKES), JSON.stringify(mistakeData));
      }

      // 4. Fetch Attempts
      const { data: attemptData } = await supabase
        .from('learning_attempts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('timestamp', { ascending: false })
        .limit(200);

      if (attemptData && attemptData.length > 0) {
        localStorage.setItem(this.getKey(BASE_STORAGE_KEYS.ATTEMPTS), JSON.stringify(attemptData));
      }

      // Recalculate
      this.recalculateDerivedMetrics(this.getCards(), this.getAttempts());
    } catch (err) {
      console.warn('Error syncing data from Supabase:', err);
    }
  }
}

export const storageService = new StorageService();
