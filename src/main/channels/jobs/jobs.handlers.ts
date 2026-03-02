import { DeleteResult, UpdateResult } from 'typeorm';
import { Job } from '../../entities';
import { xautodb } from '../../db';
import { IJobCreate, IJobUpdate, Response, STATUS } from '../../../interfaces';

export const findJobs = async (): Promise<Response<Job[]>> => {
  return { [STATUS.Success]: await xautodb.getRepository(Job).find() };
};

export const findJob = async ({ id }: { id: string }): Promise<Response<Job | null>> => {
  const job = await xautodb.getRepository(Job).findOneBy({ id });
  if (!job) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  return { [STATUS.Success]: job };
};

export const createJob = async ({ data }: { data: IJobCreate }): Promise<Response<Job>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Job).save<IJobCreate>(data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateJob = async ({
  id,
  data
}: {
  id: string;
  data: IJobUpdate;
}): Promise<Response<UpdateResult | null>> => {
  if (!id) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Job).update({ id }, data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const deleteJob = async ({ id }: { id: string }): Promise<Response<DeleteResult | null>> => {
  if (!id) return { [STATUS.Error]: { msg: STATUS.ResourceNotFound } };
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Job).delete({ id }) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
