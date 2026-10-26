// src/services/fsrsService.ts
// Free Spaced Repetition Scheduler (FSRS) implementation for Japanese memory mastery
import { FSRSCard, FSRSRating, FSRSState } from '../types';

// Default FSRS parameters (W) based on optimized memory decay parameters
const DEFAULT_PARAMETERS = {
  w: [
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
    0.1192, 1.01925, 1.9395, 0.11, 0.29605, 0.22695, 0.2315, 2.9898
  ],
  requestRetention: 0.9, // 90% target retention rate
  maximumInterval: 36500 // Max 100 years
};

export class FSRSService {
  // Create a brand new unreviewed card
  public createCard(
    itemId: string,
    itemType: 'kana' | 'vocab' | 'kanji' | 'grammar' | 'mistake'
  ): FSRSCard {
    return {
      card_id: `card_${itemType}_${itemId}_${Date.now()}`,
      item_id: itemId,
      item_type: itemType,
      state: 0, // New
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0
    };
  }

  // Calculate current retrievability of a card: R = (1 + FACTOR * t / S) ^ DECAY
  public getRetrievability(card: FSRSCard, now: Date = new Date()): number {
    if (card.state === 0 || card.stability === 0) return 0;
    const lastDate = card.last_review ? new Date(card.last_review) : new Date(card.due);
    const elapsedDays = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    const factor = 19 / 81;
    const decay = -0.5;
    return Math.pow(1 + (factor * elapsedDays) / card.stability, decay);
  }

  // Calculate next interval from stability and target retention
  private calculateNextInterval(stability: number, targetRetention: number): number {
    const factor = 19 / 81;
    const decay = -0.5;
    const interval = (stability / factor) * (Math.pow(targetRetention, 1 / decay) - 1);
    return Math.min(
      DEFAULT_PARAMETERS.maximumInterval,
      Math.max(1, Math.round(interval))
    );
  }

  // Schedule review after user provides a rating (1=Again, 2=Hard, 3=Good, 4=Easy)
  public schedule(card: FSRSCard, rating: FSRSRating, now: Date = new Date()): FSRSCard {
    const updated = { ...card };
    const p = DEFAULT_PARAMETERS.w;
    updated.last_review = now.toISOString();

    if (card.state === 0) {
      // First review of a NEW card
      const initStability = [p[0], p[1], p[2], p[3]][rating - 1];
      const initDifficulty = Math.min(10, Math.max(1, p[4] - Math.exp(p[5] * (rating - 1)) + 1));

      updated.stability = initStability;
      updated.difficulty = initDifficulty;
      updated.reps = 1;

      if (rating === 1) {
        // Again
        updated.state = 1; // Learning
        updated.lapses = 1;
        updated.scheduled_days = 0; // Due today
        const dueDate = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes later
        updated.due = dueDate.toISOString();
      } else {
        updated.state = 2; // Review
        const days = rating === 4 ? 4 : rating === 3 ? 1 : 1;
        updated.scheduled_days = days;
        const dueDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        updated.due = dueDate.toISOString();
      }
      return updated;
    }

    // Existing card review
    const lastReviewDate = card.last_review ? new Date(card.last_review) : new Date();
    const elapsedDays = Math.max(0, (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
    updated.elapsed_days = elapsedDays;

    if (rating === 1) {
      // Lapse (Again)
      updated.lapses += 1;
      updated.state = 3; // Relearning
      // Stability decreases on lapse
      updated.stability = Math.max(0.1, card.stability * 0.2);
      // Difficulty increases
      updated.difficulty = Math.min(10, card.difficulty + 0.8);
      updated.scheduled_days = 0;
      // Due again shortly (e.g. 15 minutes)
      const dueDate = new Date(now.getTime() + 15 * 60 * 1000);
      updated.due = dueDate.toISOString();
    } else {
      // Successful recall (Hard, Good, Easy)
      updated.reps += 1;
      updated.state = 2; // Review

      // Update Difficulty: D' = D - w6 * (grade - 3)
      const deltaD = -p[6] * (rating - 3);
      updated.difficulty = Math.min(10, Math.max(1, card.difficulty + deltaD));

      // Stability multiplier
      let sMultiplier = 1.0;
      if (rating === 2) sMultiplier = 1.2; // Hard
      else if (rating === 3) sMultiplier = 2.4; // Good
      else if (rating === 4) sMultiplier = 4.0; // Easy

      updated.stability = Math.max(0.5, card.stability * sMultiplier);
      const nextDays = this.calculateNextInterval(updated.stability, DEFAULT_PARAMETERS.requestRetention);
      updated.scheduled_days = nextDays;

      const dueDate = new Date(now.getTime() + nextDays * 24 * 60 * 60 * 1000);
      updated.due = dueDate.toISOString();
    }

    return updated;
  }

  // Filter cards due for review today
  public getDueCards(cards: FSRSCard[], now: Date = new Date()): FSRSCard[] {
    const nowIso = now.toISOString();
    return cards.filter((card) => card.due <= nowIso);
  }
}

export const fsrsService = new FSRSService();
