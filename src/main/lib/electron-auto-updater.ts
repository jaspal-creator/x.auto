import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { dialog, BrowserWindow, Notification } from 'electron';
import ProgressBar from 'electron-progressbar';
import { updateSettings } from './update-settings';

// Configure logger
autoUpdater.logger = log;
(autoUpdater.logger as any).transports.file.level = 'info';

// Auto-updater configuration
autoUpdater.autoDownload = false; // We'll control when to download
autoUpdater.autoInstallOnAppQuit = true; // Install updates when app quits
autoUpdater.allowDowngrade = false; // Don't allow downgrades

// Force auto-updater to work in development (for testing)
if (process.env.NODE_ENV !== 'production') {
  autoUpdater.forceDevUpdateConfig = true;
  log.info('Auto-updater: Forced dev update config for testing');
}

// Update check intervals (in milliseconds)
const STARTUP_CHECK_DELAY = 10 * 1000; // Wait 10 seconds after startup (reduced for testing)

// Global variables
let progressBar: ProgressBar | null = null;
let updateCheckInterval: NodeJS.Timeout | null = null;
let isUpdateInProgress = false;
let mainWindow: BrowserWindow | null = null;

interface UpdateInfo {
  version: string;
  releaseDate: string;
  releaseNotes: string;
}

interface IElectronAutoUpdater {
  // eslint-disable-next-line no-unused-vars
  initialize: (window: BrowserWindow) => void;
  checkUpdatesAndNotify: () => Promise<void>;
  startPeriodicChecks: () => void;
  stopPeriodicChecks: () => void;
  downloadUpdate: () => void;
  quitAndInstall: () => void;
}

// Utility functions
const showNotification = (title: string, body: string) => {
  if (Notification.isSupported()) {
    new Notification({
      title,
      body,
      icon: process.platform === 'win32' ? undefined : 'build/icon.png'
    }).show();
  }
};

const formatReleaseNotes = (releaseNotes: string): string => {
  if (!releaseNotes) return 'No release notes available.';

  // Limit release notes to 300 characters for dialog
  if (releaseNotes.length > 300) {
    return releaseNotes.substring(0, 297) + '...';
  }
  return releaseNotes;
};

const showUpdateDialog = async (
  updateInfo: UpdateInfo
): Promise<{ download: boolean; skip: boolean }> => {
  const result = await dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Update Available',
    message: `A new version of x.auto is available!`,
    detail: `Current version: ${process.env.npm_package_version || 'Unknown'}\nNew version: ${updateInfo.version}\n\nRelease Notes:\n${formatReleaseNotes(updateInfo.releaseNotes)}\n\nWould you like to download and install it now?`,
    buttons: ['Download & Install', 'Download Later', 'Skip This Version'],
    defaultId: 0,
    cancelId: 2
  });

  return {
    download: result.response === 0,
    skip: result.response === 2
  };
};

const showUpdateReadyDialog = async (): Promise<boolean> => {
  const result = await dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update has been downloaded successfully!',
    detail:
      'The update is ready to be installed. The application will restart to complete the installation.',
    buttons: ['Restart Now', 'Restart Later'],
    defaultId: 0,
    cancelId: 1
  });

  return result.response === 0;
};

const createProgressBar = () => {
  if (progressBar) return;

  progressBar = new ProgressBar({
    indeterminate: false,
    text: 'Downloading update...',
    detail: 'Preparing download...',
    maxValue: 100,
    abortOnError: true,
    closeOnComplete: false,
    browserWindow: {
      parent: mainWindow!,
      modal: true,
      resizable: false,
      closable: false,
      alwaysOnTop: true,
      width: 450,
      height: 200
    }
  });

  progressBar.on('completed', () => {
    if (progressBar) {
      progressBar.setCompleted();
      progressBar.detail = 'Download completed! Preparing installation...';
    }
  });

  progressBar.on('aborted', () => {
    if (progressBar) {
      progressBar.close();
      progressBar = null;
      isUpdateInProgress = false;
    }
  });
};

const closeProgressBar = () => {
  if (progressBar) {
    progressBar.close();
    progressBar = null;
  }
};

export const ElectronAutoUpdater: IElectronAutoUpdater = {
  initialize: (window: BrowserWindow) => {
    mainWindow = window;
    log.info('Auto-updater initialized');

    // Start checking for updates after a delay
    setTimeout(() => {
      ElectronAutoUpdater.checkUpdatesAndNotify();
    }, STARTUP_CHECK_DELAY);

    // Start periodic checks
    ElectronAutoUpdater.startPeriodicChecks();
  },

  checkUpdatesAndNotify: async (): Promise<void> => {
    if (isUpdateInProgress) {
      log.info('Update already in progress, skipping check');
      return;
    }

    if (!updateSettings.autoCheck) {
      log.info('Auto-check disabled, skipping update check');
      return;
    }

    try {
      log.info('Checking for updates...');
      updateSettings.updateLastChecked();
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      log.error('Error checking for updates:', error);
      // Don't show error to user for automatic checks
    }
  },

  startPeriodicChecks: () => {
    if (updateCheckInterval) {
      clearInterval(updateCheckInterval);
    }

    const intervalMs = updateSettings.checkInterval * 60 * 60 * 1000;
    updateCheckInterval = setInterval(() => {
      if (updateSettings.shouldCheck) {
        ElectronAutoUpdater.checkUpdatesAndNotify();
      }
    }, intervalMs);

    log.info(`Started periodic update checks every ${updateSettings.checkInterval} hours`);
  },

  stopPeriodicChecks: () => {
    if (updateCheckInterval) {
      clearInterval(updateCheckInterval);
      updateCheckInterval = null;
      log.info('Stopped periodic update checks');
    }
  },

  downloadUpdate: () => {
    if (isUpdateInProgress) return;

    isUpdateInProgress = true;
    createProgressBar();
    autoUpdater.downloadUpdate();
  },

  quitAndInstall: () => {
    ElectronAutoUpdater.stopPeriodicChecks();
    autoUpdater.quitAndInstall(false, true);
  }
};

// Event handlers
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-available', async (info) => {
  log.info('Update available:', info);

  // Check if this version should be skipped
  if (updateSettings.shouldSkipVersion(info.version)) {
    log.info(`Skipping version ${info.version} as requested by user`);
    return;
  }

  const updateInfo: UpdateInfo = {
    version: info.version,
    releaseDate: info.releaseDate,
    releaseNotes:
      typeof info.releaseNotes === 'string' ? info.releaseNotes : 'No release notes available.'
  };

  // Show notification if enabled
  if (updateSettings.notifyOnAvailable) {
    showNotification('Update Available', `x.auto v${updateInfo.version} is now available!`);
  }

  // Show dialog and ask user if they want to download
  try {
    const result = await showUpdateDialog(updateInfo);
    if (result.download) {
      ElectronAutoUpdater.downloadUpdate();
    } else if (result.skip) {
      updateSettings.setSkipVersion(updateInfo.version);
      log.info(`User chose to skip version ${updateInfo.version}`);
    } else {
      log.info('User chose not to download update now');
    }
  } catch (error) {
    log.error('Error showing update dialog:', error);
  }
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
});

autoUpdater.on('download-progress', (progressObj) => {
  const percent = Math.round(progressObj.percent);
  log.info(`Download progress: ${percent}%`);

  if (progressBar) {
    progressBar.value = percent;
    progressBar.detail = `Downloaded ${Math.round(progressObj.transferred / 1024 / 1024)}MB of ${Math.round(progressObj.total / 1024 / 1024)}MB (${percent}%)`;
  }
});

autoUpdater.on('update-downloaded', async (info) => {
  log.info('Update downloaded:', info);
  isUpdateInProgress = false;
  closeProgressBar();

  // Show notification
  showNotification('Update Ready', 'Update has been downloaded and is ready to install!');

  // Ask user if they want to restart now
  try {
    const shouldRestart = await showUpdateReadyDialog();
    if (shouldRestart) {
      ElectronAutoUpdater.quitAndInstall();
    } else {
      log.info('User chose to restart later');
      // Update will be installed when app is next closed
    }
  } catch (error) {
    log.error('Error showing update ready dialog:', error);
  }
});

autoUpdater.on('error', (error) => {
  log.error('Auto-updater error:', error);
  isUpdateInProgress = false;
  closeProgressBar();

  // Only show error dialog if user initiated the update
  if (progressBar || isUpdateInProgress) {
    dialog.showErrorBox(
      'Update Error',
      `An error occurred during the update process:\n\n${error.message}\n\nPlease try again later or download the update manually from the website.`
    );
  }
});

// Cleanup on app quit
process.on('exit', () => {
  ElectronAutoUpdater.stopPeriodicChecks();
  closeProgressBar();
});
