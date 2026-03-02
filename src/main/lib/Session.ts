import { app } from 'electron';
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { Cryptor } from './Crypto';

export class Session {
  private path: string = app.getPath('sessionData');

  set<T = any>(namespace: string, data: T, ms: number, _ = new Cryptor()) {
    return writeFileSync(
      `${this.path}/${namespace}`,
      _.encrypt(JSON.stringify({ ...data, expiresAt: Date.now() + (ms as number) }))
    );
  }

  get<T = any>(namespace: string, _ = new Cryptor()): (T & { expiresAt: number }) | null {
    let content: T & { expiresAt: number };
    try {
      content = JSON.parse(
        _.decrypt(readFileSync(`${this.path}/${namespace}`, { encoding: 'utf-8' }))
      );
    } catch (err: any) {
      return null;
    }

    if (Date.now() > content.expiresAt) {
      unlinkSync(`${this.path}/${namespace}`);
      return null;
    }

    return content;
  }

  isExpired(namespace: string, _ = new Cryptor()): boolean {
    return (
      Date.now() >
      JSON.parse(_.decrypt(readFileSync(`${this.path}/${namespace}`, { encoding: 'utf-8' })))
        .expiresAt
    );
  }

  clear(namespace: string): void | null {
    try {
      return unlinkSync(`${this.path}/${namespace}`);
    } catch (_: any) {
      return null;
    }
  }

  clearAll(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Check if session directory exists
      if (fs.existsSync(this.path)) {
        // Read all files in session directory
        const files = fs.readdirSync(this.path);
        
        // Delete each session file
        files.forEach((file: string) => {
          try {
            unlinkSync(path.join(this.path, file));
          } catch (error) {
            console.error(`Failed to delete session file ${file}:`, error);
          }
        });
        
        console.log('All session data cleared');
      }
    } catch (error) {
      console.error('Failed to clear all session data:', error);
    }
  }
}
