import { DeepPartial, DeleteResult, ILike } from 'typeorm';
import {
  ESort,
  InvoiceSatatus,
  IQuery,
  IReportCreate,
  IReportUpdate,
  Response,
  STATUS
} from '../../../interfaces';
import { xautodb } from '../../db';
import { AutoPart, Invoice, Report, ReportAutoPart, ReportService, Service } from '../../entities';
import { findCar, updateCar } from '../cars/cars.handlers';

export const findReports = async ({
  query
}: {
  query: IQuery & { type: 'VIN' | 'NUMBER' | 'CUSTOMER' };
}): Promise<Response<{ data: Report[]; count: number }>> => {
  let __sort: { customer: { name: string } } | { created_at: string } | any;
  if (query.sort === ESort.RECENT) __sort = { created_at: 'desc' };
  if (query.sort === ESort.OLDER) __sort = { created_at: 'asc' };
  if (query.sort === ESort.AZ) __sort = { customer: { name: 'asc' } };
  if (query.sort === ESort.ZA) __sort = { customer: { name: 'desc' } };

  const reports = xautodb.getRepository(Report);

  return {
    [STATUS.Success]: {
      count: await reports.count({
        where: [
          {
            car: [
              { vin: query.type === 'VIN' ? ILike(`%${query.search.trim()}%`) : '' },
              { car_number: query.type === 'NUMBER' ? ILike(`%${query.search.trim()}%`) : '' }
            ]
          },
          {
            customer: { name: query.type === 'CUSTOMER' ? ILike(`%${query.search.trim()}%`) : '' }
          }
        ]
      }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data: await (async () => {
        return (
          await reports.find({
            where: [
              {
                car: [
                  { vin: query.type === 'VIN' ? ILike(`%${query.search.trim()}%`) : '' },
                  { car_number: query.type === 'NUMBER' ? ILike(`%${query.search.trim()}%`) : '' }
                ]
              },
              {
                customer: {
                  name: query.type === 'CUSTOMER' ? ILike(`%${query.search.trim()}%`) : ''
                }
              }
            ],
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
        );
      })()
    }
  };
};

export const createReport = async ({
  data
}: {
  data: IReportCreate;
}): Promise<Response<Report>> => {
  const { report_autoparts, report_services, car_number, ...rest } = data;
  try {
    // Ensure user snapshot fields are included in the report data
    const reportData = {
      ...rest,
      user_id: data.user_id,
      user_name: data.user_name,
      user_surname: data.user_surname,
      user_nickname: data.user_nickname
    };

    const report = await xautodb.getRepository(Report).save(reportData);

    if (
      car_number.trim().toUpperCase().replace(/ /g, '') !==
      (await findCar({ id: rest.car.id as string })).Success?.car_number
        .trim()
        .toUpperCase()
        .replace(/ /g, '')
    )
      updateCar({ id: rest.car.id as string, data: { car_number } });

    report_services?.map(async ({ id }) => {
      await xautodb
        .getRepository(ReportService)
        .save({ report, service: id as DeepPartial<Service> });
    });

    report_autoparts?.map(async ({ id, quantity }) => {
      await xautodb
        .getRepository(ReportAutoPart)
        .save({ report, quantity, autopart: id as DeepPartial<AutoPart> });
    });

    await new Promise((res) => setTimeout(res, 1000));
    return { [STATUS.Success]: report };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const updateReport = async ({
  id,
  data
}: {
  id: string;
  data: IReportUpdate;
}): Promise<Response<boolean>> => {
  try {
    /**
     * Select data from request body
     */
    const { report_autoparts, report_services, ...rest } = data;

    /**
     * Select data from report repository
     */
    const [{ expires_at, invoice, mileage, user_id }] = await xautodb.getRepository(Report).find({
      where: { id },
      select: { expires_at: true, mileage: true, user_id: true },
      relations: { invoice: true }
    });

    /**
     * Verify if report is not expired
     */
    if (new Date().getTime() > new Date(expires_at).getTime())
      return { [STATUS.Error]: { msg: STATUS.ReportExpired } };

    /**
     * Verify if has an invoicde already (if chnages in services or in details)
     */
    const car_number = (await findCar({ id: rest.car as string })).Success?.car_number
      .trim()
      .toUpperCase()
      .replace(/ /g, '');
    if (
      (invoice && invoice.status === InvoiceSatatus.READY) ||
      (mileage !== rest.mileage &&
        user_id !== rest.user_id &&
        rest.car_number?.trim().toUpperCase().replace(/ /g, '') !== car_number)
    )
      await xautodb
        .getRepository(Invoice)
        .update({ report: { id } }, { status: InvoiceSatatus.REINVOICE });

    /**
     * Update user snapshot and mileage
     */
    const updateData: any = { mileage: rest.mileage, updated_flag: true };
    if (rest.user_id) updateData.user_id = rest.user_id;
    if (rest.user_name) updateData.user_name = rest.user_name;
    if (rest.user_surname) updateData.user_surname = rest.user_surname;
    if (rest.user_nickname) updateData.user_nickname = rest.user_nickname;

    await xautodb.getRepository(Report).update({ id }, updateData);

    /**
     * If car number had changed
     */
    if (rest.car_number?.trim().toUpperCase().replace(/ /g, '') !== car_number)
      updateCar({ id: rest.car as string, data: { car_number: rest.car_number } });

    /**
     * Actual services that are in report
     */
    const current_services_map = new Map(
      (
        await xautodb
          .getRepository(ReportService)
          .find({ where: { report: { id } }, relations: { service: true } })
      ).map(({ id, service: { id: _id } }) => {
        /**
         * service_id => report_service_table_id
         */
        return [_id, id];
      })
    );
    /**
     * Actual auto parts that are in report
     */
    const current_autoparts_map = new Map(
      (
        await xautodb
          .getRepository(ReportAutoPart)
          .find({ where: { report: { id } }, relations: { autopart: true } })
      ).map(({ id, autopart: { id: _id }, quantity }) => {
        return [_id, { id, quantity }];
      })
    );

    /**
     * Update and apply chnages with new services into database
     */
    report_services?.forEach(async ({ id: _ }) => {
      if (!current_services_map.has(_))
        return await xautodb
          .getRepository(ReportService)
          .save({ report: id as DeepPartial<Report>, service: _ as DeepPartial<Service> });
      return null;
    });
    /**
     * Update and apply chnages with new services relations with report
     */
    Array.from(current_services_map.entries()).forEach(async ([k, v]) => {
      if (
        !report_services
          ?.map(({ id }) => {
            return id;
          })
          .includes(k)
      )
        return await xautodb.getRepository(ReportService).delete({ id: v });
      return null;
    });

    /**
     * Update and apply chnages with new auto-parts into database
     */
    report_autoparts?.forEach(async ({ id: _, quantity: __ }) => {
      if (!current_autoparts_map.has(_))
        return await xautodb.getRepository(ReportAutoPart).save({
          report: id as DeepPartial<Report>,
          autopart: _ as DeepPartial<AutoPart>,
          quantity: __
        });
      if (current_autoparts_map.get(_)?.quantity !== __)
        return await xautodb
          .getRepository(ReportAutoPart)
          .update(current_autoparts_map.get(_)?.id as string, { quantity: __ });
      return null;
    });

    /**
     * Update and apply chnages with new auto-parts relations with report
     */
    Array.from(current_autoparts_map.entries()).forEach(async ([k, { id }]) => {
      if (
        !report_autoparts
          ?.map(({ id }) => {
            return id;
          })
          .includes(k)
      )
        return await xautodb.getRepository(ReportAutoPart).delete({ id });
      return null;
    });

    /**
     * Final return status
     */
    return {
      [STATUS.Success]: true
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const deleteReport = async ({ id }: { id: string }): Promise<Response<DeleteResult>> => {
  try {
    return { [STATUS.Success]: await xautodb.getRepository(Report).delete({ id }) };
  } catch (_: any) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
