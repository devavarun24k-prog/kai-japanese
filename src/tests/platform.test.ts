// src/tests/platform.test.ts
// Unit tests for KAI Cross-Platform Service & Offline Sync Queue
import { describe, it, expect, beforeEach } from 'vitest';
import { platformService } from '../services/platformService';
import { storageService } from '../services/storageService';

// In-memory localStorage mock for node test environment
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  (globalThis as unknown as { localStorage: unknown }).localStorage = new LocalStorageMock();
}

describe('Platform Service Layer (Web, Windows, Android Bridge)', () => {
  it('should default to web platform in browser/vitest environment without native bridge', () => {
    expect(platformService.isWeb()).toBe(true);
    expect(platformService.isElectron()).toBe(false);
    expect(platformService.isCapacitor()).toBe(false);
    expect(platformService.getPlatform()).toBe('web');
    expect(platformService.getPlatformLabel()).toBe('KAI Web Application');
  });

  it('should enforce strict URL protocol validation and reject unsafe schemes', async () => {
    // Unsafe URLs must be blocked
    const jsUrl = await platformService.openExternal('javascript:alert(1)');
    expect(jsUrl).toBe(false);

    const fileUrl = await platformService.openExternal('file:///C:/secrets.txt');
    expect(fileUrl).toBe(false);

    const dataUrl = await platformService.openExternal('data:text/html,<script></script>');
    expect(dataUrl).toBe(false);
  });

  it('should register and execute back-button handlers in LIFO order', () => {
    const executed: string[] = [];

    const unreg1 = platformService.registerBackButtonHandler(() => {
      executed.push('first');
      return false; // let next handle
    });

    const unreg2 = platformService.registerBackButtonHandler(() => {
      executed.push('second');
      return true; // handled, stop propagation
    });

    const handled = platformService.triggerBackButton();
    expect(handled).toBe(true);
    expect(executed).toEqual(['second']);

    unreg1();
    unreg2();
  });
});

describe('Offline-First Sync Queue Architecture', () => {
  beforeEach(() => {
    storageService.setUserId('test_offline_user');
  });

  it('should queue pending offline items and accurately count them', () => {
    // Clean queue
    localStorage.removeItem('kai_user_test_offline_user_offline_sync_queue');
    expect(storageService.getPendingSyncCount()).toBe(0);

    // Enqueue an attempt
    storageService.enqueueOfflineSync('attempt', {
      id: 'att_off_1',
      skill: 'kana',
      is_correct: true
    });
    expect(storageService.getPendingSyncCount()).toBe(1);

    // Enqueue a card
    storageService.enqueueOfflineSync('card', {
      card_id: 'card_off_1',
      item_id: 'h_a',
      item_type: 'kana'
    });
    expect(storageService.getPendingSyncCount()).toBe(2);

    // Enqueue updated state for the same card should deduplicate
    storageService.enqueueOfflineSync('card', {
      card_id: 'card_off_1',
      item_id: 'h_a',
      item_type: 'kana',
      reps: 2
    });
    expect(storageService.getPendingSyncCount()).toBe(2);

    const queue = storageService.getPendingSyncQueue();
    expect(queue.length).toBe(2);
    expect(queue[1].payload.reps).toBe(2);
  });
});
