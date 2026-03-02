import { IJobCreate, IJobUpdate } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { createJob, deleteJob, findJob, findJobs, updateJob } from './jobs.handlers';

export class Job extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query('FIND', async () => applyMiddlewares([authMiddleware, guardMiddleware], findJobs));
  }

  findById() {
    this.Query('FIND_BY_ID', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => findJob({ id }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: IJobCreate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => createJob({ data }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: string; data: IJobUpdate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => updateJob({ id, data }))
    );
  }

  delete() {
    this.Mutate('DELETE', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => deleteJob({ id }))
    );
  }
}
