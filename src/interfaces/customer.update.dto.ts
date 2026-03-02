import { ICustomerCreate } from './customer.create.dto';

export interface ICustomerUpdate extends Partial<ICustomerCreate> {}
