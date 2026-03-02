import 'reflect-metadata';
import { app, shell, BrowserWindow } from 'electron';
import { join } from 'path';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { nativeImage } from 'electron';
import { Bootstrap_IPC_Channels } from './bootstrap/bootstrap';
import { registerUpdaterHandlers } from './channels/updater/updater.handlers';
import { CheckClientStatus } from './lib/ClientStatus';
import { ElectronAutoUpdater } from './lib/electron-auto-updater';
import { createApplicationMenu } from './lib/menu';
import { ipcMain } from 'electron';
import https from 'https';
import { xautodb } from './db/connection';

function createWindow() {
  // Create the browser window.
  const iconPath = is.dev
    ? join(__dirname, '../../resources/logo-square.png')
    : join(process.resourcesPath, 'resources/logo-square.png');
  console.log('Icon path:', iconPath);
  const logoIcon = nativeImage.createFromPath(iconPath);
  console.log('Icon size:', logoIcon.getSize());
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: logoIcon,
    ...(process.platform === 'linux' ? { icon: logoIcon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  ipcMain.handle('check-internet', async () => {
    return new Promise((resolve) => {
      try {
        https
          .get('https://1.1.1.1', () => resolve(true)) // Cloudflare
          .on('error', () => resolve(false))
          .setTimeout(15000, () => resolve(false));
      } catch {
        resolve(false);
      }
    });
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
    // if (process.env.NODE_ENV !== 'production' && is.dev) mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}`);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  try {
    console.log('Starting app initialization...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('isDev:', is.dev);
    console.log('Platform:', process.platform);
    console.log('Resources path:', process.resourcesPath);

    // Log environment variables for debugging
    console.log('Environment Variables:');
    console.log(
      '  MAIN_VITE_DB_NAME:',
      process.env.MAIN_VITE_DB_NAME || import.meta.env.MAIN_VITE_DB_NAME || 'NOT SET'
    );
    console.log('  MAIN_VITE_ENC_KEY:', process.env.MAIN_VITE_ENC_KEY ? '***SET***' : 'NOT SET');
    console.log(
      '  MAIN_VITE_ENC_ALG:',
      process.env.MAIN_VITE_ENC_ALG || import.meta.env.MAIN_VITE_ENC_ALG || 'NOT SET'
    );
    console.log(
      '  MAIN_VITE_SESS_EXPIRE:',
      process.env.MAIN_VITE_SESS_EXPIRE || import.meta.env.MAIN_VITE_SESS_EXPIRE || 'NOT SET'
    );

    // Initialize database first
    console.log('Initializing database...');
    await xautodb.initialize();
    console.log('Database initialized successfully');

    // Run data migrations
    console.log('Running data migrations...');
    const { migrateUserSnapshots } = await import('./db/migrations');
    await migrateUserSnapshots();
    console.log('Data migrations completed successfully');

    // Set app icon for dock/taskbar
    const logoIcon = nativeImage.createFromPath(
      is.dev
        ? join(__dirname, '../../resources/logo-square.png')
        : join(process.resourcesPath, 'resources/logo-square.png')
    );
    if (process.platform === 'darwin') {
      app.dock.setIcon(logoIcon);
    }

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    console.log('Creating main window...');
    const mainWindow = createWindow();

    // Expose application version to renderer
    ipcMain.handle('get-app-version', () => {
      return app.getVersion();
    });

    console.log('Starting client status check...');
    CheckClientStatus();

    console.log('Bootstrapping IPC channels...');
    Bootstrap_IPC_Channels();

    console.log('Registering updater handlers...');
    registerUpdaterHandlers();

    // Create application menu
    console.log('Creating application menu...');
    createApplicationMenu();

    // Initialize auto-updater with the main window
    console.log('Initializing auto-updater...');
    ElectronAutoUpdater.initialize(mainWindow);

    console.log('App initialization completed successfully');

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    console.error('Error stack:', (error as Error).stack);

    // Try to show a dialog with the error before quitting
    const { dialog } = require('electron');
    try {
      await dialog.showErrorBox(
        'Initialization Error',
        `Failed to start application: ${(error as Error).message}`
      );
    } catch (dialogError) {
      console.error('Failed to show error dialog:', dialogError);
    }

    app.quit();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
