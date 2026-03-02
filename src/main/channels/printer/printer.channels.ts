import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { printInvoice } from './printer.handlers';

export class Printer extends Channel {
  constructor(name: string) {
    super(name);
  }

  print() {
    this.Mutate('PRINT', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => printInvoice({ id }))
    );
  }
}
