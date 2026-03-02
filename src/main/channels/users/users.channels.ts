import { IQuery, IUserCreate, IUserUpdate } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findUser,
  findUserReports,
  findUsers,
  updateUser
} from './users.handlers';

export class User extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query('FIND', async (_, { query }: { query: IQuery }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => findUsers({ query }))
    );
  }

  findById() {
    this.Query('FIND_BY_ID', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => findUser({ id }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: IUserCreate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => createUser({ data }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: string; data: IUserUpdate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => updateUser({ id, data }))
    );
  }

  delete() {
    this.Mutate('DELETE', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => deleteUser({ id }))
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
        }: { id: string; query: IQuery & Readonly<{ type: 'VIN' | 'NUMBER' | 'CUSTOMER' }> }
      ) => applyMiddlewares([authMiddleware, guardMiddleware], () => findUserReports({ id, query }))
    );
  }

  findAll() {
    this.Query(
      'FIND_ALL',
      async (
        _,
        {
          query
        }: {
          query: Omit<IQuery, 'page' | 'limit' | 'sort'>;
        }
      ) => applyMiddlewares([authMiddleware, guardMiddleware], () => findAllUsers({ query }))
    );
  }
}
