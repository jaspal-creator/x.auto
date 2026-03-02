import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { exportData } from './exporter.handlers';

export class Exporter extends Channel {
  constructor(name: string) {
    super(name);
  }

  export() {
    this.Query('EXPORT', async () =>
      applyMiddlewares([authMiddleware, guardMiddleware], exportData)
    );
  }
}
