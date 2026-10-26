// electron/preload.cjs
// Secure preload script establishing a strictly validated IPC bridge
// Prevents nodeIntegration exposure while giving KAI platform-level desktop window controls

const { contextBridge, ipcRenderer } = require('electron');

// Expose safe, minimal desktop API to renderer
contextBridge.exposeInMainWorld('kaiDesktop', {
  platform: 'windows',
  isDesktop: true,
  version: '1.0.0',

  // Window Controls
  minimize: () => {
    ipcRenderer.send('kai:window:minimize');
  },
  maximize: () => {
    ipcRenderer.send('kai:window:maximize');
  },
  close: () => {
    ipcRenderer.send('kai:window:close');
  },

  // Quick Practice Mini-Window Toggle
  toggleQuickPractice: (enabled) => {
    ipcRenderer.send('kai:window:toggleQuickPractice', Boolean(enabled));
  },

  // Safe External URL Opening
  openExternal: async (url) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return false;
    }
    return ipcRenderer.invoke('kai:openExternal', url);
  },

  // Native Desktop Notifications
  showNotification: (payload) => {
    if (!payload || typeof payload !== 'object') return;
    ipcRenderer.send('kai:showNotification', {
      title: String(payload.title || 'KAI Japanese Mastery'),
      body: String(payload.body || ''),
      icon: payload.icon
    });
  }
});
