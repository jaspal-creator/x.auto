import { ICustomerCreate, ICustomerUpdate, IQuery } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import {
  createCustomer,
  deleteCustomer,
  findCustomer,
  findCustomerReports,
  findCustomers,
  getAllCustomers,
  updateCustomer
} from './customers.handlers';

export class Customer extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query('FIND', async (_, { query }: { query: IQuery }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => findCustomers({ query }))
    );
  }

  findById() {
    this.Query('FIND_BY_ID', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => findCustomer({ id }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: ICustomerCreate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => createCustomer({ data }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: string; data: ICustomerUpdate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => updateCustomer({ id, data }))
    );
  }

  delete() {
    this.Mutate('DELETE', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => deleteCustomer({ id }))
    );
  }

  getAll() {
    this.Query(
      'GET_ALL',
      async (_, { query }: { query: Omit<IQuery, 'page' | 'limit' | 'sort'> }) =>
        applyMiddlewares([authMiddleware, guardMiddleware], () => getAllCustomers({ query }))
    );
  }

  reports() {
    this.Query(
      'FIND_REPORTS',
      async (
        _,
        {
          id,
          query
        }: { id: string; query: IQuery & Readonly<{ type: 'VIN' | 'NUMBER' | 'MASTER' }> }
      ) =>
        applyMiddlewares([authMiddleware, guardMiddleware], () =>
          findCustomerReports({ id, query })
        )
    );
  }
}
