import { IUserCreate } from './user.create.dto';

export interface IUserUpdate extends Partial<IUserCreate> {}
