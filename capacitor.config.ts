// capacitor.config.ts
// Capacitor configuration for KAI Japanese Mastery Android & Mobile Packaging
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kai.japanesemastery',
  appName: 'KAI Japanese Mastery',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#FAF7F2'
  }
};

export default config;
