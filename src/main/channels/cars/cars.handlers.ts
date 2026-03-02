import { DeleteResult, FindOperator, FindOptionsOrderValue, ILike, UpdateResult } from 'typeorm';
import { ESort, ICarCreate, ICarUpdate, IQuery, Response, STATUS } from '../../../interfaces';
import { xautodb } from '../../db';
import { Car, Report } from '../../entities';
import { normalizeCarNumber } from '../../lib/car-number-formatter';

export const findCars = async ({
  query
}: {
  query: IQuery & Readonly<{ type: 'MARK' | 'MODEL' | 'VIN' | 'NUMBER' }>;
}): Promise<Response<{ count: number; data: Car[] }>> => {
  const __sort: Partial<{ model: FindOptionsOrderValue; created_at: FindOptionsOrderValue }> = {};
  const where: Partial<{
    brand: FindOperator<string>;
    model: FindOperator<string>;
    vin: FindOperator<string>;
    car_number: FindOperator<string>;
  }> = {};

  if (query.sort === ESort.RECENT) __sort.created_at = 'desc';
  if (query.sort === ESort.OLDER) __sort.created_at = 'asc';
  if (query.sort === ESort.AZ) __sort.model = 'asc';
  if (query.sort === ESort.ZA) __sort.model = 'desc';

  if (query.type === 'MARK') where.brand = ILike(`%${query.search.trim()}%`);
  if (query.type === 'MODEL') where.model = ILike(`%${query.search.trim()}%`);
  if (query.type === 'VIN') where.vin = ILike(`%${query.search.trim()}%`);
  if (query.type === 'NUMBER') where.car_number = ILike(`%${query.search.trim()}%`);

  const cars = xautodb.getRepository(Car);

  return {
    [STATUS.Success]: {
      count: await cars.count({ where }),
      data: await cars.find({
        relations: { customer: true },
        where,
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        order: __sort
      })
    }
  };
};

export const findCar = async ({ id }: { id: string }): Promise<Response<Car | null>> => {
  const [car] = await xautodb.getRepository(Car).find({ where: { id } });
  if (!car) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  return { [STATUS.Success]: car };
};

export const findCarByVin = async ({ id }: { id: string }): Promise<Response<Car | null>> => {
  const [car] = await xautodb
    .getRepository(Car)
    .find({ where: { vin: id }, relations: { customer: true } });
  if (!car) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  return { [STATUS.Success]: car };
};

export const createCar = async ({ data }: { data: ICarCreate }): Promise<Response<Car>> => {
  try {
    // Normalize car number format before saving
    const normalizedData = {
      ...data,
      car_number: normalizeCarNumber(data.car_number)
    };
    return { [STATUS.Success]: await xautodb.getRepository(Car).save<ICarCreate>(normalizedData) };
  } catch (_: any) {
    if (_ instanceof Error) {
      const err: Error = _;
      if (err.message === `SQLITE_CONSTRAINT: UNIQUE constraint failed: Cars.vin`)
        return { [STATUS.Error]: { msg: STATUS.CarAlreadyInDatabase } };
    }
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateCar = async ({
  id,
  data
}: {
  id: string;
  data: ICarUpdate;
}): Promise<Response<UpdateResult>> => {
  try {
    // Normalize car number format before updating (if car_number is provided)
    const normalizedData = {
      ...data,
      ...(data.car_number && { car_number: normalizeCarNumber(data.car_number) })
    };
    return { [STATUS.Success]: await xautodb.getRepository(Car).update({ id }, normalizedData) };
  } catch (_: any) {
    if (_ instanceof Error) {
      const err: Error = _;
      if (err.message === `SQLITE_CONSTRAINT: UNIQUE constraint failed: Cars.vin`)
        return { [STATUS.Error]: { msg: STATUS.CarAlreadyInDatabase } };
    }
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const deleteCar = async ({ id }: { id: string }): Promise<Response<DeleteResult>> => {
  const car = xautodb.getRepository(Car);

  try {
    return { [STATUS.Success]: await car.delete({ id }) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const findCarReports = async ({
  id,
  query
}: {
  id: string;
  query: IQuery & Readonly<{ type: 'MASTER' | 'CUSTOMER' }>;
}): Promise<Response<{ data: { car: Car; reports: Report[] }; count: number }>> => {
  let __sort: { customer: { name: string } } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { customer: { name: 'asc' } };
  if (query.sort === ESort.ZA) __sort = { customer: { name: 'desc' } };

  const reports = xautodb.getRepository(Report);
  const cars = xautodb.getRepository(Car);

  let where: any = {
    car: { id }
  };

  if (query.type === 'CUSTOMER') {
    where.customer = { name: ILike(`%${query.search.trim()}%`) };
  } else if (query.type === 'MASTER') {
    // For MASTER search, we need multiple where conditions
    const searchTerm = `%${query.search.trim()}%`;
    where = [
      { car: { id }, user_name: ILike(searchTerm) },
      { car: { id }, user_surname: ILike(searchTerm) },
      { car: { id }, user_nickname: ILike(searchTerm) }
    ];
  }

  try {
    return {
      [STATUS.Success]: {
        count: await reports.count({ where }),
        data: {
          // @ts-ignore: ignoring null
          car: await cars.findOneBy({ id }),
          // @ts-ignore: intercepting
          reports: (
            await reports.find({
              where,
              relations: {
                car: true,
                customer: true,
                invoice: true,
                report_autoparts: {
                  autopart: true
                },
                report_services: {
                  service: true
                }
              },
              take: query.limit,
              skip: (query.page - 1) * query.limit,
              order: __sort
            })
          ).map(
            ({
              report_services,
              report_autoparts,
              user_id,
              user_name,
              user_surname,
              user_nickname,
              ...rest
            }) => {
              const user = {
                id: user_id,
                name: user_name,
                surname: user_surname,
                nickname: user_nickname
              };

              const services = report_services.map(({ id, service }) => {
                const { id: _id, name } = service;
                return { id, service: { id: _id, name } };
              });

              const autoparts = report_autoparts.map(({ id, autopart, quantity }) => {
                const { id: _id, name } = autopart;
                return { id, autopart: { id: _id, name, quantity } };
              });

              return { ...rest, user, report_services: services, report_autoparts: autoparts };
            }
          )
        }
      }
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
