import { DeepPartial } from 'typeorm';
import { Job } from '../main/entities';

export interface IUserCreate {
  name: string;
  surname: string;
  nickname: string;
  date_of_birth: Date;
  password: string;
  role: 0 | 1;
  job: DeepPartial<Job>;
}
