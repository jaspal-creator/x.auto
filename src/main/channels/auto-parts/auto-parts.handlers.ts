import { ILike, UpdateResult } from 'typeorm';
import {
  ESort,
  IAutoPartCreate,
  IAutoPartUpdate,
  IQuery,
  Response,
  STATUS
} from '../../../interfaces';
import { xautodb } from '../../db';
import { AutoPart } from '../../entities';

export const findAutoParts = async ({
  query
}: {
  query: IQuery;
}): Promise<Response<{ count: number; data: AutoPart[] }>> => {
  let __sort: { name: string } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { name: 'asc' };
  if (query.sort === ESort.ZA) __sort = { name: 'desc' };

  const autoparts = xautodb.getRepository(AutoPart);

  return {
    [STATUS.Success]: {
      count: await autoparts.count({
        where: {
          name: ILike(`%${query.search.trim()}%`)
        }
      }),
      data: await autoparts.find({
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

export const findAutoPart = async ({ id }: { id: string }): Promise<Response<AutoPart | null>> => {
  const [autopart] = await xautodb.getRepository(AutoPart).find({ where: { id } });
  if (!autopart) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  return { [STATUS.Success]: autopart };
};

export const createAutoPart = async ({
  data
}: {
  data: IAutoPartCreate;
}): Promise<Response<AutoPart>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(AutoPart).save<IAutoPartCreate>(data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateAutoPart = async ({
  id,
  data
}: {
  id: string;
  data: IAutoPartUpdate;
}): Promise<Response<UpdateResult>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(AutoPart).update({ id }, data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const deleteAutoPart = async ({ id }: { id: string }) => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(AutoPart).delete({ id }) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const getAllAutoParts = async ({
  query
}: {
  query: Omit<IQuery, 'page' | 'limit' | 'sort'>;
}): Promise<Response<AutoPart[]>> => {
  try {
    return {
      [STATUS.Success]: await xautodb.getRepository(AutoPart).find({
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
