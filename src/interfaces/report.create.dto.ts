import { DeepPartial } from 'typeorm';
import { Car, Customer } from '../main/entities';

export interface IReportCreate {
  mileage: number;
  car_number: string;

  car: DeepPartial<Car>;

  // User snapshot fields (no entity relationship)
  user_id: string;
  user_name: string;
  user_surname: string;
  user_nickname: string;

  customer: DeepPartial<Customer>;

  report_services?: { id: string }[];
  report_autoparts?: { id: string; quantity: number }[];
}
