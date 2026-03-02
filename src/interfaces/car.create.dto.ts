import { DeepPartial } from 'typeorm';
import { Customer } from '../main/entities';

export interface ICarCreate {
  brand: string;
  model: string;
  car_number: string;
  year: number;
  engine_capacity: number;
  vin: string;
  customer: DeepPartial<Customer>;
}
