// src/services/platformService.ts
// Centralized cross-platform capability and hardware bridge service
// Decouples learning logic from Web, Electron (Windows), and Capacitor (Android) runtimes

export type PlatformType = 'web' | 'electron-windows' | 'capacitor-android' | 'capacitor-ios';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
}

export interface KaiDesktopBridge {
  platform: 'windows' | 'darwin' | 'linux';
  isDesktop: boolean;
  version: string;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  openExternal: (url: string) => Promise<boolean>;
  showNotification: (payload: NotificationPayload) => void;
  toggleQuickPractice?: (enabled: boolean) => void;
}

declare global {
  interface Window {
    kaiDesktop?: KaiDesktopBridge;
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
    };
  }
}

class PlatformService {
  private networkListeners: Array<(isOnline: boolean) => void> = [];
  private backButtonHandlers: Array<() => boolean> = []; // returns true if handled

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.notifyNetworkChange(true));
      window.addEventListener('offline', () => this.notifyNetworkChange(false));

      // Handle Android back button if running under Capacitor
      this.initCapacitorBackButton();
    }
  }

  // --- Platform Detection ---

  public isElectron(): boolean {
    return typeof window !== 'undefined' && Boolean(window.kaiDesktop?.isDesktop);
  }

  public isCapacitor(): boolean {
    return (
      typeof window !== 'undefined' &&
      Boolean(window.Capacitor?.isNativePlatform && window.Capacitor.isNativePlatform())
    );
  }

  public isAndroid(): boolean {
    if (this.isCapacitor()) {
      return window.Capacitor?.getPlatform ? window.Capacitor.getPlatform() === 'android' : false;
    }
    if (typeof navigator !== 'undefined') {
      return /Android/i.test(navigator.userAgent);
    }
    return false;
  }

  public isWindows(): boolean {
    if (this.isElectron()) {
      return window.kaiDesktop?.platform === 'windows';
    }
    if (typeof navigator !== 'undefined') {
      return /Win/i.test(navigator.userAgent);
    }
    return false;
  }

  public isWeb(): boolean {
    return !this.isElectron() && !this.isCapacitor();
  }

  public getPlatform(): PlatformType {
    if (this.isElectron()) return 'electron-windows';
    if (this.isCapacitor()) {
      return this.isAndroid() ? 'capacitor-android' : 'capacitor-ios';
    }
    return 'web';
  }

  public getPlatformLabel(): string {
    switch (this.getPlatform()) {
      case 'electron-windows':
        return 'KAI for Windows Desktop';
      case 'capacitor-android':
        return 'KAI for Android';
      case 'capacitor-ios':
        return 'KAI for iOS';
      case 'web':
      default:
        return 'KAI Web Application';
    }
  }

  // --- Network Status & Offline Management ---

  public isOnline(): boolean {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  }

  public onNetworkStatusChange(callback: (isOnline: boolean) => void): () => void {
    this.networkListeners.push(callback);
    return () => {
      this.networkListeners = this.networkListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyNetworkChange(isOnline: boolean): void {
    this.networkListeners.forEach((cb) => {
      try {
        cb(isOnline);
      } catch (err) {
        console.error('Error in network listener callback:', err);
      }
    });
  }

  // --- External URL Safe Handling ---

  public async openExternal(url: string): Promise<boolean> {
    if (!url || typeof url !== 'string') return false;

    // Strict protocol check: only allow safe http / https links
    if (!/^https?:\/\//i.test(url)) {
      console.warn('Blocked opening non-HTTP URL:', url);
      return false;
    }

    if (this.isElectron() && window.kaiDesktop?.openExternal) {
      return window.kaiDesktop.openExternal(url);
    }

    if (typeof window !== 'undefined') {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      return win !== null;
    }

    return false;
  }

  // --- Desktop Window Controls (Windows / Electron) ---

  public minimizeWindow(): void {
    if (this.isElectron() && window.kaiDesktop?.minimize) {
      window.kaiDesktop.minimize();
    }
  }

  public maximizeWindow(): void {
    if (this.isElectron() && window.kaiDesktop?.maximize) {
      window.kaiDesktop.maximize();
    }
  }

  public closeWindow(): void {
    if (this.isElectron() && window.kaiDesktop?.close) {
      window.kaiDesktop.close();
    }
  }

  public toggleQuickPracticeMode(enabled: boolean): void {
    if (this.isElectron() && window.kaiDesktop?.toggleQuickPractice) {
      window.kaiDesktop.toggleQuickPractice(enabled);
    }
  }

  // --- Native & Web Notifications ---

  public async showNotification(payload: NotificationPayload): Promise<void> {
    // 1. Electron Desktop Notification
    if (this.isElectron() && window.kaiDesktop?.showNotification) {
      window.kaiDesktop.showNotification(payload);
      return;
    }

    // 2. Standard Web Notifications API (if permission granted or requested)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') {
          new Notification(payload.title, {
            body: payload.body,
            icon: payload.icon || '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            new Notification(payload.title, {
              body: payload.body,
              icon: payload.icon || '/favicon.ico'
            });
          }
        }
      } catch (e) {
        console.warn('Web notification dispatch failed:', e);
      }
    }
  }

  // --- Mobile Hardware Back-Button Handling ---

  public registerBackButtonHandler(handler: () => boolean): () => void {
    this.backButtonHandlers.push(handler);
    return () => {
      this.backButtonHandlers = this.backButtonHandlers.filter((h) => h !== handler);
    };
  }

  private initCapacitorBackButton(): void {
    // Dynamically listen for Capacitor App backButton event without requiring hard runtime dependencies
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor?.Plugins?.App) {
        (window as any).Capacitor.Plugins.App.addListener('backButton', () => {
          this.triggerBackButton();
        });
      }
    } catch (e) {
      // Ignore if Capacitor runtime plugins are not loaded
    }
  }

  public triggerBackButton(): boolean {
    // Execute handlers in LIFO order (last registered modal/screen gets first chance to close)
    for (let i = this.backButtonHandlers.length - 1; i >= 0; i--) {
      const handled = this.backButtonHandlers[i]();
      if (handled) return true;
    }
    return false;
  }
}

export const platformService = new PlatformService();
