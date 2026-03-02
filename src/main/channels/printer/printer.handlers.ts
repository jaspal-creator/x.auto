import { BrowserWindow } from 'electron/main';
import { EInvoiceQueryStatus, Response, STATUS } from '../../../interfaces';
import { join } from 'node:path';

export const printInvoice = async ({ id }: { id: string }): Promise<Response<any>> => {
  try {
    const win = new BrowserWindow({
      show: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    });

    const filePath = join(__dirname, '../renderer/index.html');
    const fileUrl = `file://${filePath}#/invoices/${id}?${EInvoiceQueryStatus.FULL}=true`;

    win.loadURL(fileUrl);

    win.webContents.on('did-finish-load', () => {
      setTimeout(() => {
        win.webContents.print({ pageSize: 'A4' }, () => {});
      }, 2000);
    });

    return {};
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
