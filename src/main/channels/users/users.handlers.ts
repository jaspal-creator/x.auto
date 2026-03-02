import { DeleteResult, FindOperator, ILike, UpdateResult } from 'typeorm';
import { ESort, IQuery, IUserCreate, IUserUpdate, Response, STATUS } from '../../../interfaces';
import { xautodb } from '../../db';
import { Report, User } from '../../entities';
import { Cryptor } from '../../lib/Crypto';

export const findUsers = async ({
  query
}: {
  query: IQuery;
}): Promise<Response<{ count: number; data: User[] }>> => {
  let __sort: { name: string } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { name: 'asc' };
  if (query.sort === ESort.ZA) __sort = { name: 'desc' };

  const users = xautodb.getRepository(User);

  return {
    [STATUS.Success]: {
      count: await users.count({
        where: {
          name: ILike(`%${query.search.trim()}%`)
        }
      }),
      data: await users.find({
        relations: { job: true },
        select: {
          job: { name: true, id: true }
        },
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

export const findUser = async ({ id }: { id: string }): Promise<Response<User | null>> => {
  const [user] = await xautodb
    .getRepository(User)
    .find({ where: { id }, relations: { job: true }, select: { job: { name: true } } });
  if (!user) return { [STATUS.Error]: { msg: STATUS.UserNotFound } };
  return { [STATUS.Success]: user };
};

export const createUser = async ({ data }: { data: IUserCreate }): Promise<Response<User>> => {
  data.password = new Cryptor().encrypt(data.password);
  try {
    return { [STATUS.Success]: await xautodb.getRepository(User).save<IUserCreate>(data) };
  } catch (error: any) {
    // Check for unique constraint violation (duplicate nickname)
    if (
      error.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
      error.code === 'SQLITE_CONSTRAINT' ||
      error.message?.includes('UNIQUE constraint failed') ||
      error.message?.includes('duplicate key value') ||
      error.message?.includes('nickname')
    ) {
      return { [STATUS.Error]: { msg: STATUS.UserAlreadyExists } };
    }
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateUser = async ({
  id,
  data
}: {
  id: string;
  data: IUserUpdate;
}): Promise<Response<UpdateResult>> => {
  if (!id) return { [STATUS.Error]: { msg: STATUS.UserNotFound } };

  if (data.password) data.password = new Cryptor().encrypt(data.password);

  try {
    return { [STATUS.Success]: await xautodb.getRepository(User).update({ id }, data) };
  } catch (error: any) {
    // Check for unique constraint violation (duplicate nickname)
    if (
      error.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
      error.code === 'SQLITE_CONSTRAINT' ||
      error.message?.includes('UNIQUE constraint failed') ||
      error.message?.includes('duplicate key value') ||
      error.message?.includes('nickname')
    ) {
      return { [STATUS.Error]: { msg: STATUS.UserAlreadyExists } };
    }
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const deleteUser = async ({ id }: { id: string }): Promise<Response<DeleteResult>> => {
  if (!id) return { [STATUS.Error]: { msg: STATUS.UserNotFound } };

  const user = xautodb.getRepository(User);

  try {
    const userToDelete = await user.findOneBy({ id });
    if (!userToDelete) return { [STATUS.Error]: { msg: STATUS.UserNotFound } };

    // Check if user is an administrator (role = 1)
    if (userToDelete.role === 1) {
      return { [STATUS.Error]: { msg: STATUS.AdminUserCannotBeDeleted } };
    }

    return { [STATUS.Success]: await user.delete({ id }) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const findUserReports = async ({
  id,
  query
}: {
  id: string;
  query: IQuery & { type: 'VIN' | 'NUMBER' | 'CUSTOMER' };
}): Promise<Response<{ data: { user: User; reports: Report[] }; count: number }>> => {
  let __sort: { customer: { name: string } } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { customer: { name: 'asc' } };
  if (query.sort === ESort.ZA) __sort = { customer: { name: 'desc' } };

  const reports = xautodb.getRepository(Report);
  const users = xautodb.getRepository(User);

  const where: {
    user_id: string;
    car?: { vin?: FindOperator<string>; car_number?: FindOperator<string> };
    customer?: { name: FindOperator<string> };
  } = {
    user_id: id
  };

  query.type === 'VIN' && (where.car = { vin: ILike(`%${query.search.trim()}%`) });
  query.type === 'NUMBER' && (where.car = { car_number: ILike(`%${query.search.trim()}%`) });
  query.type === 'CUSTOMER' && (where.customer = { name: ILike(`%${query.search.trim()}%`) });

  try {
    return {
      [STATUS.Success]: {
        count: await reports.count({
          where
        }),

        data: {
          // @ts-ignore: intercepting
          user: await users.findOneBy({ id }),
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

              const __ = report_services.map(({ id, service }) => {
                const { id: _id, name } = service;
                return { id, service: { id: _id, name } };
              });

              const ___ = report_autoparts.map(({ id, autopart, quantity }) => {
                const { id: _id, name } = autopart;
                return { id, autopart: { id: _id, name, quantity } };
              });

              return { ...rest, user, report_services: __, report_autoparts: ___ };
            }
          )
        }
      }
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const findAllUsers = async ({
  query
}: {
  query: Omit<IQuery, 'page' | 'limit' | 'sort'>;
}): Promise<Response<User[]>> => {
  try {
    return {
      [STATUS.Success]: await xautodb.getRepository(User).find({
        where: [
          {
            name: ILike(`%${query.search.trim()}%`)
          },
          { surname: ILike(`%${query.search.trim()}%`) }
        ]
      })
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
