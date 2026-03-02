import { app, session } from 'electron';
import { Session } from './Session';
import { updateSettings } from './update-settings';
import { rmSync, existsSync } from 'fs';

export class CacheManager {
  private session: Session;

  constructor() {
    this.session = new Session();
  }

  /**
   * Clear authentication session only
   */
  clearAuthSession(): void {
    try {
      this.session.clear('AUTH');
      console.log('Authentication session cleared');
    } catch (error) {
      console.error('Failed to clear auth session:', error);
    }
  }

  /**
   * Clear all session data
   */
  clearAllSessions(): void {
    try {
      this.session.clearAll();
      console.log('All session data cleared');
    } catch (error) {
      console.error('Failed to clear all sessions:', error);
    }
  }

  /**
   * Clear Electron's web cache
   */
  async clearWebCache(): Promise<void> {
    try {
      const defaultSession = session.defaultSession;
      await defaultSession.clearCache();
      console.log('Web cache cleared');
    } catch (error) {
      console.error('Failed to clear web cache:', error);
    }
  }

  /**
   * Clear stored data (localStorage, sessionStorage, etc.)
   */
  async clearStoredData(): Promise<void> {
    try {
      const defaultSession = session.defaultSession;
      await defaultSession.clearStorageData({
        storages: ['localstorage', 'indexdb', 'websql']
      });
      console.log('Stored data cleared');
    } catch (error) {
      console.error('Failed to clear stored data:', error);
    }
  }

  /**
   * Clear update settings
   */
  clearUpdateSettings(): void {
    try {
      updateSettings.reset();
      console.log('Update settings reset to defaults');
    } catch (error) {
      console.error('Failed to clear update settings:', error);
    }
  }

  /**
   * Clear application data directory (be careful with this!)
   */
  clearAppData(): void {
    try {
      const userDataPath = app.getPath('userData');
      const sessionDataPath = app.getPath('sessionData');
      
      console.log('App data paths:');
      console.log('  userData:', userDataPath);
      console.log('  sessionData:', sessionDataPath);
      
      // Clear session data directory
      if (existsSync(sessionDataPath)) {
        rmSync(sessionDataPath, { recursive: true, force: true });
        console.log('Session data directory cleared');
      }
      
      // Note: Be very careful about clearing userData as it contains the database
      console.log('WARNING: userData directory NOT cleared (contains database)');
      
    } catch (error) {
      console.error('Failed to clear app data:', error);
    }
  }

  /**
   * Clear everything except database
   */
  async clearEverythingExceptDatabase(): Promise<void> {
    console.log('Starting comprehensive cache and session clearing...');
    
    try {
      // Clear authentication and sessions
      this.clearAllSessions();
      
      // Clear web cache
      await this.clearWebCache();
      
      // Clear stored data
      await this.clearStoredData();
      
      // Reset update settings
      this.clearUpdateSettings();
      
      console.log('All cache and session data cleared successfully');
    } catch (error) {
      console.error('Failed to clear all cache and session data:', error);
    }
  }

  /**
   * Get cache and session information
   */
  async getCacheInfo(): Promise<{
    sessionFiles: string[];
    cacheSize: number;
    userDataPath: string;
    sessionDataPath: string;
  }> {
    const fs = require('fs');
    
    const sessionDataPath = app.getPath('sessionData');
    const userDataPath = app.getPath('userData');
    
    let sessionFiles: string[] = [];
    let cacheSize = 0;
    
    try {
      if (existsSync(sessionDataPath)) {
        sessionFiles = fs.readdirSync(sessionDataPath);
      }
      
      // Note: There's no direct way to get cache size, this is just a placeholder
      cacheSize = 0;
      
    } catch (error) {
      console.error('Failed to get cache info:', error);
    }
    
    return {
      sessionFiles,
      cacheSize,
      userDataPath,
      sessionDataPath
    };
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
