import { IJobCreate } from './job.create.dto';

export interface IJobUpdate extends Partial<IJobCreate> {}
