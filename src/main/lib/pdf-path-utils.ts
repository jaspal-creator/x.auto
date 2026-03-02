import { existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

interface PathUtils {
  /* eslint-disable */
  get_path: (year: number, month: string) => string | null;
  /* eslint-enable */
}

export const PdfPathUtils: PathUtils = {
  get_path: (year: number, month: string): string | null => {
    if (!existsSync(resolve(homedir(), 'Desktop', `${year.toString()}_xauto_reports`)))
      mkdirSync(resolve(homedir(), 'Desktop', `${year.toString()}_xauto_reports`));

    if (!existsSync(resolve(homedir(), 'Desktop', `${year.toString()}_xauto_reports`, month)))
      mkdirSync(resolve(homedir(), 'Desktop', `${year.toString()}_xauto_reports`, month));

    return resolve(homedir(), 'Desktop', `${year.toString()}_xauto_reports`, month);
  }
};
