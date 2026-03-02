import { IInvoiceCreate } from './invoice.create.dto';

export interface IInvoiceUpdate extends Partial<Omit<IInvoiceCreate, 'report'>> {}
