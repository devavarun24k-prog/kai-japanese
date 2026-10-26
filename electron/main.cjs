// electron/main.cjs
// Electron main process for KAI Japanese Mastery Windows Desktop Application
// Implements secure window isolation, safe external links, and Quick Practice mini-window mode

const { app, BrowserWindow, ipcMain, shell, Notification } = require('electron');
const path = require('path');

let mainWindow = null;
let isQuickPracticeMode = false;
let standardBounds = { width: 1280, height: 840 };

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: standardBounds.width,
    height: standardBounds.height,
    minWidth: 420,
    minHeight: 580,
    title: 'KAI Japanese Mastery (界)',
    backgroundColor: '#FAF7F2',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  // Smooth appearance once initial DOM is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Intercept all external hyperlinks (e.g., JLPT official website) and open in default OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Prevent renderer in-place navigation away from app
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isDev = process.env.ELECTRON_DEV === 'true';
    const isDevUrl = url.startsWith('http://localhost:5173') || url.startsWith('http://127.0.0.1:5173');
    const isFileUrl = url.startsWith('file://');

    if (!isFileUrl && !(isDev && isDevUrl)) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) {
        shell.openExternal(url);
      }
    }
  });

  // Load Dev Server or Production Dist
  const isDev = process.env.ELECTRON_DEV === 'true' || process.argv.includes('--dev');
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App Lifecycle
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handlers for Safe Window Controls & Native Features ---

ipcMain.on('kai:window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('kai:window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('kai:window:close', () => {
  if (mainWindow) mainWindow.close();
});

// Quick Practice Mini-Window Toggle (compact desktop companion mode)
ipcMain.on('kai:window:toggleQuickPractice', (event, enable) => {
  if (!mainWindow) return;

  if (enable && !isQuickPracticeMode) {
    standardBounds = mainWindow.getBounds();
    isQuickPracticeMode = true;
    mainWindow.setBounds({ width: 440, height: 680 });
    mainWindow.setAlwaysOnTop(true, 'floating');
  } else if (!enable && isQuickPracticeMode) {
    isQuickPracticeMode = false;
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setBounds(standardBounds);
  }
});

// Safe External URL Opener
ipcMain.handle('kai:openExternal', async (event, url) => {
  if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

// Desktop Notifications
ipcMain.on('kai:showNotification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'KAI Japanese Mastery',
      body: body || '',
      icon: path.join(__dirname, '..', 'public', 'favicon.ico')
    }).show();
  }
});
