import { ICarCreate } from './car.create.dto';

export interface ICarUpdate extends Partial<ICarCreate> {}
