import { ipcMain } from 'electron';
import { ElectronAutoUpdater } from '../../lib/electron-auto-updater';
import { updateSettings, UpdateSettings } from '../../lib/update-settings';
import { UpdaterChannels } from './updater.channels';
import log from 'electron-log';

// Register IPC handlers
export const registerUpdaterHandlers = () => {
  // Check for updates manually
  ipcMain.handle(UpdaterChannels.CHECK_FOR_UPDATES, async () => {
    try {
      log.info('Manual update check requested');
      await ElectronAutoUpdater.checkUpdatesAndNotify();
      return { success: true };
    } catch (error) {
      log.error('Error checking for updates:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Get current update settings
  ipcMain.handle(UpdaterChannels.GET_UPDATE_SETTINGS, () => {
    return updateSettings.getAll();
  });

  // Update settings
  ipcMain.handle(UpdaterChannels.UPDATE_SETTINGS, (_, newSettings: Partial<UpdateSettings>) => {
    try {
      updateSettings.update(newSettings);

      // Restart periodic checks if interval changed
      if (newSettings.checkInterval || newSettings.autoCheck !== undefined) {
        ElectronAutoUpdater.stopPeriodicChecks();
        if (updateSettings.autoCheck) {
          ElectronAutoUpdater.startPeriodicChecks();
        }
      }

      return { success: true };
    } catch (error) {
      log.error('Error updating settings:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Download update
  ipcMain.handle(UpdaterChannels.DOWNLOAD_UPDATE, () => {
    try {
      ElectronAutoUpdater.downloadUpdate();
      return { success: true };
    } catch (error) {
      log.error('Error downloading update:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Quit and install
  ipcMain.handle(UpdaterChannels.QUIT_AND_INSTALL, () => {
    try {
      ElectronAutoUpdater.quitAndInstall();
      return { success: true };
    } catch (error) {
      log.error('Error quitting and installing:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Get update status
  ipcMain.handle(UpdaterChannels.GET_UPDATE_STATUS, () => {
    return {
      lastChecked: updateSettings.lastChecked,
      nextCheck: updateSettings.lastChecked + updateSettings.checkInterval * 60 * 60 * 1000,
      autoCheck: updateSettings.autoCheck,
      version: process.env.npm_package_version || 'Unknown'
    };
  });

  log.info('Updater IPC handlers registered');
};
