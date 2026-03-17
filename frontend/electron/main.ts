import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron';
import path from 'path';
import { startNextServer, stopNextServer } from './next-server';
import { createTray, destroyTray } from './tray';

let mainWindow: BrowserWindow | null = null;

const isDev = !app.isPackaged;

// High-DPI support for Windows
app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    Menu.setApplicationMenu(null);
    await createWindow();
  });
}

async function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Web Collector',
    icon: isDev
      ? path.join(__dirname, '..', 'resources', 'icon.png')
      : path.join(process.resourcesPath, 'icon.png'),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  });

  // Show when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Hide to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!(app as any).isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // IPC: open multiple URLs in default browser
  ipcMain.handle('open-urls', async (_event, urls: string[]) => {
    for (const url of urls) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        await shell.openExternal(url);
      }
    }
  });

  // Create system tray
  createTray(mainWindow);

  // Load the app
  if (isDev) {
    // Development: connect to Next.js dev server
    const devUrl = process.env.ELECTRON_DEV_URL || 'http://localhost:3000';
    console.log(`Loading dev URL: ${devUrl}`);

    try {
      await mainWindow.loadURL(devUrl);
    } catch (err) {
      console.error('Failed to load dev URL. Is Next.js dev server running?', err);
      // Retry after a short delay
      setTimeout(async () => {
        try {
          await mainWindow?.loadURL(devUrl);
        } catch (retryErr) {
          console.error('Retry failed:', retryErr);
        }
      }, 3000);
    }
  } else {
    // Production: start embedded Next.js server
    try {
      const port = await startNextServer();
      await mainWindow.loadURL(`http://localhost:${port}`);
    } catch (err) {
      console.error('Failed to start Next.js server:', err);
    }
  }
}

app.on('window-all-closed', () => {
  // On Windows, don't quit when all windows are closed (tray keeps running)
});

app.on('before-quit', () => {
  (app as any).isQuitting = true;
  destroyTray();
  stopNextServer();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
