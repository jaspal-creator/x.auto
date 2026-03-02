import { IQuery, IReportCreate, IReportUpdate } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { createReport, deleteReport, findReports, updateReport } from './reports.handlers';

export class Report extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query(
      'FIND',
      async (_, { query }: { query: IQuery & { type: 'VIN' | 'NUMBER' | 'CUSTOMER' } }) =>
        applyMiddlewares([authMiddleware, guardMiddleware], () => findReports({ query }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: string; data: IReportUpdate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => updateReport({ id, data }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: IReportCreate }) =>
      applyMiddlewares([authMiddleware], () => createReport({ data }))
    );
  }

  delete() {
    this.Mutate('DELETE', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => deleteReport({ id }))
    );
  }
}
