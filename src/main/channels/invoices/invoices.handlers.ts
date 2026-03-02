import { UpdateResult } from 'typeorm';
import {
  IInvoiceActionState,
  IInvoiceAutoPartState,
  IInvoiceCreate,
  IInvoiceUpdate,
  InvoiceSatatus,
  Response,
  STATUS
} from '../../../interfaces';
import { xautodb } from '../../db';
import { Company, Invoice, User } from '../../entities';

export const findInvoice = async ({
  id
}: {
  id: number;
}): Promise<
  Response<
    Partial<Invoice> & {
      actions_prices: IInvoiceActionState[];
      details_prices: IInvoiceAutoPartState[];
      company: Company;
      owner: User;
    }
  >
> => {
  try {
    // INVOICE
    const invoice = (
      await xautodb.getRepository(Invoice).find({
        where: { id },
        relations: { report: { car: true, customer: true } },
        select: {
          id: true,
          status: true,
          actions_prices: true,
          details_prices: true,
          tva: true,
          total: true,
          created_at: true,
          updated_at: true,
          report: {
            id: true,
            mileage: true,
            user_id: true,
            user_name: true,
            user_surname: true,
            user_nickname: true,
            car: {
              id: true,
              brand: true,
              model: true,
              car_number: true,
              year: true,
              engine_capacity: true,
              vin: true
            },
            customer: {
              id: true,
              name: true,
              fiscal_code: true
            }
          }
        }
      })
    ).at(0) as Invoice;

    // COMPANY INFOS
    const company = (await xautodb.getRepository(Company).find({ take: 1 })).at(0) as Company;

    // OWNER INFO - First user who registered in the app (oldest admin)
    const owner = (
      await xautodb.getRepository(User).find({
        where: { role: 1 },
        order: { created_at: 'ASC' },
        select: { name: true, surname: true }
      })
    ).at(0) as User;

    return {
      [STATUS.Success]: {
        ...invoice,
        actions_prices: JSON.parse(invoice?.actions_prices as string),
        details_prices: JSON.parse(invoice?.details_prices as string),
        company,
        owner
      }
    };
  } catch (_: unknown) {
    return {
      [STATUS.Error]: { msg: STATUS.InternalServerError }
    };
  }
};

export const createInvoice = async ({
  data
}: {
  data: IInvoiceCreate;
}): Promise<Response<Invoice>> => {
  try {
    return {
      [STATUS.Success]: await xautodb.getRepository(Invoice).save<IInvoiceCreate>(data)
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateInvoice = async ({
  id,
  data
}: {
  id: number;
  data: IInvoiceUpdate;
}): Promise<Response<UpdateResult>> => {
  try {
    return {
      [STATUS.Success]: await xautodb
        .getRepository(Invoice)
        .update({ id }, { ...data, status: InvoiceSatatus.READY })
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
