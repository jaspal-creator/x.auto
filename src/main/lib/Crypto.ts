import { createCipheriv, createDecipheriv } from 'node:crypto';
import 'dotenv/config';

export class Cryptor {
  private readonly alg: string =
    process.env.MAIN_VITE_ENC_ALG || import.meta.env.MAIN_VITE_ENC_ALG || 'aes-256-cbc';
  private readonly key: Buffer = Buffer.alloc(32).fill(
    process.env.MAIN_VITE_ENC_KEY || import.meta.env.MAIN_VITE_ENC_KEY || 'default-key'
  );
  private readonly iv: Buffer = Buffer.alloc(16).fill(
    process.env.MAIN_VITE_ENC_IV || import.meta.env.MAIN_VITE_ENC_IV || 'default-iv'
  );

  // ENCRYPTION
  encrypt(plainText: string): string {
    const cipher = createCipheriv(this.alg, this.key, this.iv);
    let enc = cipher.update(plainText, 'utf8', 'hex');
    return (enc += cipher.final('hex'));
  }

  // DECRYPTION
  decrypt(encPass: string): string {
    const decipher = createDecipheriv(this.alg, this.key, this.iv);
    let dec = decipher.update(encPass, 'hex', 'utf-8');
    return (dec += decipher.final('utf8'));
  }
}
