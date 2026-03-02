import { IImportData } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { importData } from './importer.handlers';

export class Importer extends Channel {
  constructor(name: string) {
    super(name);
  }

  import() {
    this.Mutate('IMPORT', async (_, { data }: { data: IImportData }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => importData({ data }))
    );
  }
}
