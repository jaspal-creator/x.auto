import { UpdateResult } from 'typeorm';
import { ICompanyCreate } from '../../../interfaces/company.create.dto';
import { ICompanyUpdate } from '../../../interfaces/company.update.dto';
import { xautodb } from '../../db';
import { Company } from '../../entities';
import { Session } from '../../lib/Session';
import { Response, SESSION, STATUS } from '../../../interfaces';

export const findCompany = async (): Promise<Response<Company[]>> => {
  try {
    await new Promise((res) => setTimeout(res, 2500));
    return { [STATUS.Success]: await xautodb.getRepository(Company).find({ take: 1 }) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const createCompany = async ({
  data
}: {
  data: ICompanyCreate;
}): Promise<Response<Company>> => {
  const sess = new Session();
  sess.set(SESSION.AUTH, { role: 1 }, 1000 * 60);

  try {
    return { [STATUS.Success]: await xautodb.getRepository(Company).save<ICompanyCreate>(data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateCompany = async ({
  data
}: {
  data: ICompanyUpdate;
}): Promise<Response<UpdateResult>> => {
  try {
    const [{ id }] = await xautodb.getRepository(Company).find({ take: 1 });
    return { [STATUS.Success]: await xautodb.getRepository(Company).update({ id }, data) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
