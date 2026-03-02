import { IAutoPartCreate, IAutoPartUpdate, IQuery } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import {
  createAutoPart,
  deleteAutoPart,
  findAutoPart,
  findAutoParts,
  getAllAutoParts,
  updateAutoPart
} from './auto-parts.handlers';

export class AutoPart extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query('FIND', async (_, { query }: { query: IQuery }) =>
      applyMiddlewares([authMiddleware], () => findAutoParts({ query }))
    );
  }

  findById() {
    this.Query('FIND_BY_ID', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware], () => findAutoPart({ id }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: IAutoPartCreate }) =>
      applyMiddlewares([authMiddleware], () => createAutoPart({ data }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: string; data: IAutoPartUpdate }) =>
      applyMiddlewares([authMiddleware], () => updateAutoPart({ id, data }))
    );
  }

  delete() {
    this.Mutate('DELETE', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => deleteAutoPart({ id }))
    );
  }

  getAll() {
    this.Query(
      'GET_ALL',
      async (_, { query }: { query: Omit<IQuery, 'page' | 'limit' | 'sort'> }) =>
        applyMiddlewares([authMiddleware], () => getAllAutoParts({ query }))
    );
  }
}
