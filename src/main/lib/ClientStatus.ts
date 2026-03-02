import { ipcMain } from 'electron';
import { Session } from './Session';
import { SESSION } from '../../interfaces';
import { xautodb } from '../db';
import { Company } from '../entities';

export const CheckClientStatus = () => {
  ipcMain.on('client-app-status', async (event) => {
    const sess = new Session();
    const authData = sess.get<{ role: number; name: string; surname: string; nickname: string; id: string }>(SESSION.AUTH);

    event.returnValue = {
      auth: Boolean(authData),
      setup: !(await xautodb.getRepository(Company).find({ take: 1 })).length,
      data: authData ? {
        id: authData.id,
        name: authData.name,
        surname: authData.surname,
        nickname: authData.nickname,
        role: authData.role
      } : {}
    };
  });
};
