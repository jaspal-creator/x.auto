import { IQuery } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { findMasters, findMasterStats } from './stats.handlers';

export class Stats extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query('FIND_MASTERS', async (_, { query }: { query: Pick<IQuery, 'search'> }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => findMasters({ query }))
    );

    this.Query(
      'FIND_BY_ID',
      async (_, { id, query }: { id: string; query: { from: string | Date; to: string | Date } }) =>
        applyMiddlewares([authMiddleware, guardMiddleware], () => findMasterStats({ id, query }))
    );
  }
}
