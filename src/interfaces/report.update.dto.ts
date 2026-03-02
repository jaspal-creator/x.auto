import { IReportCreate } from './report.create.dto';

export interface IReportUpdate extends Partial<Omit<IReportCreate, 'car' | 'customer'>> {
  car: string;
}
