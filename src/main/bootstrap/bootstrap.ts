import { ipcMain } from 'electron';
import { Register } from './register';
import { writeAPITypes } from './defineTypes';

export const QueryRegister: string[] = [];
export const MutationRegister: string[] = [];

export const Bootstrap_IPC_Channels = (): void => {
  Register.map(({ name, channel }) => {
    const instance = new channel(name);

    Object.getOwnPropertyNames(channel.prototype).forEach((method) => {
      if (method !== 'constructor') instance[method]();
    });

    QueryRegister.push(...instance.queries);
    MutationRegister.push(...instance.mutations);
  });

  ipcMain.handle('QUERIES', () => {
    return QueryRegister;
  });

  ipcMain.handle('MUTATIONS', () => {
    return MutationRegister;
  });

  writeAPITypes(QueryRegister, MutationRegister);
};
