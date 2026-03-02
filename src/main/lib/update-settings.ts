import { app } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import log from 'electron-log';

export interface UpdateSettings {
  autoCheck: boolean;
  autoDownload: boolean;
  checkInterval: number; // in hours
  notifyOnAvailable: boolean;
  skipVersion?: string;
  lastChecked?: number;
}

const DEFAULT_SETTINGS: UpdateSettings = {
  autoCheck: true,
  autoDownload: false,
  checkInterval: 0.1, // Check every 6 minutes (0.1 hours) for testing
  notifyOnAvailable: true,
  lastChecked: 0
};

class UpdateSettingsManager {
  private settingsPath: string;
  private settings: UpdateSettings;
  

  constructor() {
    // Settings and path are resolved lazily on first use (after app.whenReady).
    this.settingsPath = join(app.getPath('userData'), 'update-settings.json');
    this.settings = this.loadSettings();
  }

  private loadSettings(): UpdateSettings {
    try {
      if (existsSync(this.settingsPath)) {
        const data = readFileSync(this.settingsPath, 'utf8');
        const parsed = JSON.parse(data);

        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      log.error('Error loading update settings:', error);
    }

    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
      log.info('Update settings saved');
    } catch (error) {
      log.error('Error saving update settings:', error);
    }
  }

  // Getters
  get autoCheck(): boolean {
    return this.settings.autoCheck;
  }

  get autoDownload(): boolean {
    return this.settings.autoDownload;
  }

  get checkInterval(): number {
    return this.settings.checkInterval;
  }

  get notifyOnAvailable(): boolean {
    return this.settings.notifyOnAvailable;
  }

  get skipVersion(): string | undefined {
    return this.settings.skipVersion;
  }

  get lastChecked(): number {
    return this.settings.lastChecked || 0;
  }

  get shouldCheck(): boolean {
    if (!this.autoCheck) return false;

    const now = Date.now();
    const intervalMs = this.checkInterval * 60 * 60 * 1000;

    return now - this.lastChecked >= intervalMs;
  }

  // Setters
  setAutoCheck(value: boolean): void {
    this.settings.autoCheck = value;
    this.saveSettings();
  }

  setAutoDownload(value: boolean): void {
    this.settings.autoDownload = value;
    this.saveSettings();
  }

  setCheckInterval(hours: number): void {
    if (hours < 1) hours = 1; // Minimum 1 hour
    if (hours > 168) hours = 168; // Maximum 1 week

    this.settings.checkInterval = hours;
    this.saveSettings();
  }

  setNotifyOnAvailable(value: boolean): void {
    this.settings.notifyOnAvailable = value;
    this.saveSettings();
  }

  setSkipVersion(version?: string): void {
    this.settings.skipVersion = version;
    this.saveSettings();
  }

  updateLastChecked(): void {
    this.settings.lastChecked = Date.now();
    this.saveSettings();
  }

  // Utility methods
  shouldSkipVersion(version: string): boolean {
    return this.skipVersion === version;
  }

  reset(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }

  getAll(): UpdateSettings {
    return { ...this.settings };
  }

  update(newSettings: Partial<UpdateSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }
}

// Export singleton instance
export const updateSettings = new UpdateSettingsManager();
