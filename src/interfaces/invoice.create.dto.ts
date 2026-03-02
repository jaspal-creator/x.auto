import { DeepPartial } from 'typeorm';
import { Report } from '../main/entities';

export interface IInvoiceCreate {
  tva: number;
  // price: number;
  total: number;
  actions_prices: string;
  details_prices: string;
  report: DeepPartial<Report>;
}
