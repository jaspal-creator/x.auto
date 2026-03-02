import { ICarCreate, ICarUpdate, IQuery } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware, guardMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import {
  createCar,
  deleteCar,
  findCar,
  findCarByVin,
  findCarReports,
  findCars,
  updateCar
} from './cars.handlers';

export class Car extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query(
      'FIND',
      async (
        _,
        { query }: { query: IQuery & Readonly<{ type: 'MARK' | 'MODEL' | 'VIN' | 'NUMBER' }> }
      ) => applyMiddlewares([authMiddleware], () => findCars({ query }))
    );
  }

  findById() {
    this.Query('FIND_BY_ID', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware], () => findCar({ id }))
    );
  }

  findByVin() {
    this.Query('FIND_BY_VIN', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware], () => findCarByVin({ id }))
    );
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: ICarCreate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => createCar({ data }))
    );
  }

  update() {
    this.Mutate('UPDATE', async (_, { id, data }: { id: string; data: ICarUpdate }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => updateCar({ id, data }))
    );
  }

  delete() {
    this.Mutate('DELETE', async (_, { id }: { id: string }) =>
      applyMiddlewares([authMiddleware, guardMiddleware], () => deleteCar({ id }))
    );
  }

  findReport() {
    this.Query(
      'FIND_REPORTS',
      async (
        _,
        { id, query }: { id: string; query: IQuery & Readonly<{ type: 'MASTER' | 'CUSTOMER' }> }
      ) => applyMiddlewares([authMiddleware], () => findCarReports({ id, query }))
    );
  }
}
