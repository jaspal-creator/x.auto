import { ElectronAPI } from '@electron-toolkit/preload';
import { GlobalContextAPIType } from './GlobalContextAPI';

/* eslint-disable */
declare global {
  interface Window {
    electron: ElectronAPI;
    xauto: GlobalContextAPIType;
    network: {
      checkOnline: () => Promise<boolean>;
    };
    appInfo: {
      getVersion: () => Promise<string>;
    };
  }
}
/* eslint-enable */
