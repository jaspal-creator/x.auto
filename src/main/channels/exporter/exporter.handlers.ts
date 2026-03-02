import { Response, STATUS } from '../../../interfaces';
import { xautodb } from '../../db';
import { AutoPart, Customer, Service } from '../../entities';

export const exportData = async (): Promise<
  Response<{
    customers: Customer[];
    services: Service[];
    auto_parts: AutoPart[];
  }>
> => {
  try {
    // await new Promise((res) => setTimeout(res, 3000));
    return {
      [STATUS.Success]: {
        customers: await xautodb
          .getRepository(Customer)
          .find({ select: { name: true, fiscal_code: true } }),
        services: await xautodb.getRepository(Service).find({ select: { name: true } }),
        auto_parts: await xautodb
          .getRepository(AutoPart)
          .find({ select: { name: true, code: true, manufacturer: true } })
      }
    };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
