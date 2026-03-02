import { IQuery, IServiceCreate, IServiceUpdate } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import {
  createService,
  deleteService,
  findService,
  findServices,
  getAllServices,
  updateService
} from './services.handlers';

export class Service extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query('FIND', async (_, { query }: { query: IQuery }) =>
      applyMiddlewares([authMiddleware], () => findServices({ query }))
    );
  }

  findById() {
    this.Query('FIND_BY_ID', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware], () => findService({ id }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: IServiceCreate }) =>
      applyMiddlewares([authMiddleware], () => createService({ data }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: string; data: IServiceUpdate }) =>
      applyMiddlewares([authMiddleware], () => updateService({ id, data }))
    );
  }

  delete() {
    this.Mutate('DELETE', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => deleteService({ id }))
    );
  }

  getAll() {
    this.Query(
      'GET_ALL',
      async (_, { query }: { query: Omit<IQuery, 'page' | 'limit' | 'sort'> }) =>
        applyMiddlewares([authMiddleware], () => getAllServices({ query }))
    );
  }
}
