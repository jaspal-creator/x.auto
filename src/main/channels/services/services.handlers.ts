import { ILike, UpdateResult } from 'typeorm';
import {
  ESort,
  IQuery,
  IServiceCreate,
  IServiceUpdate,
  Response,
  STATUS
} from '../../../interfaces';
import { xautodb } from '../../db';
import { Service } from '../../entities';

export const findServices = async ({
  query
}: {
  query: IQuery;
}): Promise<Response<{ count: number; data: Service[] }>> => {
  let __sort: { name: string } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { name: 'asc' };
  if (query.sort === ESort.ZA) __sort = { name: 'desc' };

  const services = xautodb.getRepository(Service);

  return {
    [STATUS.Success]: {
      count: await services.count({
        where: {
          name: ILike(`%${query.search}%`)
        }
      }),
      data: await services.find({
        where: {
          name: ILike(`%${query.search}%`)
        },
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        order: __sort
      })
    }
  };
};

export const findService = async ({ id }: { id: string }): Promise<Response<Service | null>> => {
  const [service] = await xautodb.getRepository(Service).find({ where: { id } });
  if (!service) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  return { [STATUS.Success]: service };
};

export const createService = async ({
  data
}: {
  data: IServiceCreate;
}): Promise<Response<Service>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Service).save<IServiceCreate>(data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateService = async ({
  id,
  data
}: {
  id: string;
  data: IServiceUpdate;
}): Promise<Response<UpdateResult>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Service).update({ id }, data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const deleteService = async ({ id }: { id: string }) => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Service).delete({ id }) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const getAllServices = async ({
  query
}: {
  query: Omit<IQuery, 'page' | 'limit' | 'sort'>;
}): Promise<Response<Service[]>> => {
  try {
    return {
      [STATUS.Success]: await xautodb.getRepository(Service).find({
        where: {
          name: ILike(`%${query.search}%`)
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
