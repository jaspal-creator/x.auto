import { IDownloadPdf } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { downloadPdf } from './pdf.handlers';

export class Pdf extends Channel {
  constructor(name: string) {
    super(name);
  }

  download() {
    this.Mutate('DOWNLOAD', async (_, { data }: { data: IDownloadPdf }) => {
      return applyMiddlewares([authMiddleware, guardMiddleware], () => downloadPdf({ data }));
    });
  }
}
