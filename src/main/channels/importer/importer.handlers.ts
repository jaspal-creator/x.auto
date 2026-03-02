import { IImportData, Response, STATUS } from '../../../interfaces';
import { xautodb } from '../../db';
import { AutoPart, Customer, Service } from '../../entities';

export const importData = async ({
  data
}: {
  data: IImportData;
}): Promise<Response<IImportData>> => {
  try {
    await new Promise((res) => setTimeout(res, 3000));
    return {
      [STATUS.Success]: {
        services:
          data.services &&
          (await Promise.all([...(<[]>data.services?.map(async (_) => {
              return await xautodb.getRepository(Service).save(_);
            }))])),
        customers:
          data.customers &&
          (await Promise.all([...(<[]>data.customers?.map(async (_) => {
              return await xautodb.getRepository(Customer).save(_);
            }))])),
        auto_parts:
          data.auto_parts &&
          (await Promise.all([...(<[]>data.auto_parts?.map(async (_) => {
              return await xautodb.getRepository(AutoPart).save(_);
            }))]))
      }
    };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
