import { DeleteResult, ILike, In, UpdateResult } from 'typeorm';
import {
  ESort,
  ICustomerCreate,
  ICustomerUpdate,
  IQuery,
  Response,
  STATUS
} from '../../../interfaces';
import { xautodb } from '../../db';
import { Car, Customer, Report } from '../../entities';

export const findCustomers = async ({
  query
}: {
  query: IQuery;
}): Promise<Response<{ count: number; data: Customer[] }>> => {
  let __sort: { name: string } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { name: 'asc' };
  if (query.sort === ESort.ZA) __sort = { name: 'desc' };

  const customers = xautodb.getRepository(Customer);

  return {
    [STATUS.Success]: {
      count: await customers.count({
        where: {
          name: ILike(`%${query.search.trim()}%`)
        }
      }),
      data: await customers.find({
        where: {
          name: ILike(`%${query.search.trim()}%`)
        },
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        order: __sort
      })
    }
  };
};

export const findCustomer = async ({ id }: { id: string }): Promise<Response<Customer | null>> => {
  const [customer] = await xautodb.getRepository(Customer).find({ where: { id } });
  if (!customer) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  return { [STATUS.Success]: customer };
};

export const createCustomer = async ({
  data
}: {
  data: ICustomerCreate;
}): Promise<Response<Customer>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Customer).save<ICustomerCreate>(data) };
  } catch (_: any) {
    if (_ instanceof Error) {
      const err: Error = _;
      if (err.message === `SQLITE_CONSTRAINT: UNIQUE constraint failed: Customers.fiscal_code`)
        return { [STATUS.Error]: { msg: STATUS.CustomerAlreadyInDatabase } };
    }
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateCustomer = async ({
  id,
  data
}: {
  id: string;
  data: ICustomerUpdate;
}): Promise<Response<UpdateResult>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Customer).update({ id }, data) };
  } catch (_: any) {
    if (_ instanceof Error) {
      const err: Error = _;
      if (err.message === `SQLITE_CONSTRAINT: UNIQUE constraint failed: Customers.fiscal_code`)
        return { [STATUS.Error]: { msg: STATUS.CustomerAlreadyInDatabase } };
    }
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const deleteCustomer = async ({ id }: { id: string }): Promise<Response<DeleteResult>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Customer).delete({ id }) };
  } catch (_: any) {
    if (_ instanceof Error) {
      const err: Error = _;
      if (err.message === `SQLITE_CONSTRAINT: FOREIGN KEY constraint failed`)
        return { [STATUS.Error]: { msg: STATUS.CustomerHasInvoices } };
    }
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const getAllCustomers = async ({
  query
}: {
  query: Omit<IQuery, 'page' | 'limit' | 'sort'>;
}): Promise<Response<Customer[]>> => {
  // await new Promise((res) => setTimeout(res, 1000));
  try {
    return {
      [STATUS.Success]: await xautodb.getRepository(Customer).find({
        where: {
          name: ILike(`%${query.search.trim()}%`)
        },
        order: {
          created_at: 'DESC'
        }
      })
    };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const findCustomerReports = async ({
  id,
  query
}: {
  id: string;
  query: IQuery & Readonly<{ type: 'VIN' | 'NUMBER' | 'MASTER' }>;
}): Promise<Response<{ data: { customer: Customer; reports: Report[] }; count: number }>> => {
  let __sort: { car: { model: string } } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { car: { model: 'asc' } };
  if (query.sort === ESort.ZA) __sort = { car: { model: 'desc' } };

  const reports = xautodb.getRepository(Report);
  const customers = xautodb.getRepository(Customer);

  // Find all cars currently assigned to this customer
  const cars = await xautodb.getRepository(Car).find({
    where: { customer: { id } },
    select: ['id']
  });

  if (cars.length === 0) {
    return {
      [STATUS.Success]: {
        count: 0,
        data: {
          customer: (await customers.findOneBy({ id })) as Customer,
          reports: []
        }
      }
    };
  }

  const carIds = cars.map((car) => car.id);

  // Build where clause to find all reports for cars currently assigned to this customer
  let where: any = {
    car: { id: In(carIds) }
  };

  if (query.type === 'VIN') {
    where.car = { id: In(carIds), vin: ILike(`%${query.search.trim()}%`) };
  } else if (query.type === 'NUMBER') {
    where.car = { id: In(carIds), car_number: ILike(`%${query.search.trim()}%`) };
  } else if (query.type === 'MASTER') {
    // For MASTER search, we need multiple where conditions
    const searchTerm = `%${query.search.trim()}%`;
    where = [
      { car: { id: In(carIds) }, user_name: ILike(searchTerm) },
      { car: { id: In(carIds) }, user_surname: ILike(searchTerm) },
      { car: { id: In(carIds) }, user_nickname: ILike(searchTerm) }
    ];
  }

  try {
    return {
      [STATUS.Success]: {
        count: await reports.count({ where }),
        data: {
          // @ts-ignore: intercepting
          customer: await customers.findOneBy({ id }),
          // @ts-ignore: intercepting
          reports: await (
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
