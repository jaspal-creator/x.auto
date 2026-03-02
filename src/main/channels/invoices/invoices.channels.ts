import { IInvoiceCreate, IInvoiceUpdate } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { createInvoice, findInvoice, updateInvoice } from './invoices.handlers';

export class Invoice extends Channel {
  constructor(name: string) {
    super(name);
  }

  findById() {
    this.Query('FIND_BY_ID', async (_, { id }: { id: number }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => findInvoice({ id }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: IInvoiceCreate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => createInvoice({ data }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: number; data: IInvoiceUpdate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => updateInvoice({ id, data }))
    );
  }
}
