import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { app } from 'electron';
import { Response, STATUS } from '../../../interfaces';

export const backupXAutoDatabase = async (): Promise<Response<{ name: string }>> => {
  const _ = app.getPath('sessionData');

  try {
    await new Promise((res) => setTimeout(res, 5000));

    if (!existsSync(resolve(_, 'BACKUPS'))) mkdirSync(resolve(_, 'BACKUPS'));

    const backup_TIMESTAMPTZ = new Date()
      .toLocaleString()
      .replace(/\//g, '-')
      .replace(/ /g, '_')
      .replace(/:/g, '-')
      .replace(/,/g, '');

    const backup = resolve(_, 'BACKUPS', `XAUTO_BACKUP_${backup_TIMESTAMPTZ}`);

    mkdirSync(backup);
    copyFileSync(
      resolve(
        app.getPath('userData'),
        process.env.MAIN_VITE_DB_NAME || import.meta.env.MAIN_VITE_DB_NAME || 'x.auto.db'
      ),
      resolve(
        backup,
        process.env.MAIN_VITE_DB_NAME || import.meta.env.MAIN_VITE_DB_NAME || 'x.auto.db'
      )
    );
    return {
      [STATUS.Success]: {
        name: `XAUTO_BACKUP_${backup_TIMESTAMPTZ}`
      }
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
