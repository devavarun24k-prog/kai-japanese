import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use './' only when BUILD_TARGET is 'capacitor' or 'electron', otherwise '/'
const isAppTarget = process.env.BUILD_TARGET === 'capacitor' || process.env.BUILD_TARGET === 'electron';

// https://vitejs.dev/config/
export default defineConfig({
  base: isAppTarget ? './' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/release/**', '**/android/**', '**/dist/**', '**/scratch/**']
    }
  }
});
