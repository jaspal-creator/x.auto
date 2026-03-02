import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { GlobalContextAPIType, Mutation, Query } from './GlobalContextAPI';

const xauto: GlobalContextAPIType = {
  queries: (async (): Promise<any> => {
    return await electronAPI.ipcRenderer.invoke('QUERIES');
  })(),

  mutations: (async (): Promise<any> => {
    return await electronAPI.ipcRenderer.invoke('MUTATIONS');
  })(),

  resolveQuery: <T>(q: Query, data?: T) => {
    return electronAPI.ipcRenderer.invoke(q, data);
  },

  resolveMutation: <T>(q: Mutation, data?: T) => {
    return electronAPI.ipcRenderer.invoke(q, data);
  }
};

async function main() {
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld('electron', electronAPI);
      contextBridge.exposeInMainWorld('xauto', xauto);
      contextBridge.exposeInMainWorld('network', {
        checkOnline: async () => {
          return await ipcRenderer.invoke('check-internet');
        }
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.xauto = xauto;
  }
}

main();
