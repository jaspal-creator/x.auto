import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { backupXAutoDatabase } from './backup.handlers';

export class Backup extends Channel {
  constructor(name: string) {
    super(name);
  }

  backupDatabase() {
    this.Mutate('DATABASE', async () =>
      applyMiddlewares([authMiddleware, guardMiddleware], backupXAutoDatabase)
    );
  }
}
