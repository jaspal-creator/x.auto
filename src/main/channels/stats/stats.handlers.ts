import { ILike } from 'typeorm';
import { IQuery, Response, STATUS } from '../../../interfaces';
import { xautodb } from '../../db';
import { User, Report } from '../../entities';
import { BetweenDates } from '../../lib/between-dates';

export const findMasters = async ({
  query
}: {
  query: Pick<IQuery, 'search'>;
}): Promise<Response<User[]>> => {
  try {
    const users = xautodb.getRepository(User);
    return {
      [STATUS.Success]: await users.find({
        where: {
          name: ILike(`%${query.search.trim()}%`)
        },
        select: {
          id: true,
          nickname: true,
          surname: true,
          name: true
        }
      })
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const findMasterStats = async ({
  id,
  query: { from, to }
}: {
  id: string;
  query: { from: string | Date; to: string | Date };
}): Promise<Response<any>> => {
  try {
    const users = xautodb.getRepository(User);
    const reports = xautodb.getRepository(Report);

    // Get the user
    const user = await users.findOneBy({ id });
    if (!user) {
      return { [STATUS.Error]: { msg: STATUS.UserNotFound } };
    }

    // Get reports for this user within the date range
    const userReports = await reports.find({
      where: {
        user_id: id,
        created_at: BetweenDates(new Date(from.toLocaleString()), new Date(to.toLocaleString()))
      },
      relations: {
        customer: true,
        car: true,
        invoice: true,
        report_services: { service: true },
        report_autoparts: { autopart: true }
      }
    });

    return {
      [STATUS.Success]: {
        ...user,
        report: userReports.map(
          ({
            report_services,
            report_autoparts,
            user_id,
            user_name,
            user_surname,
            user_nickname,
            ...rest
          }) => {
            const userSnapshot = {
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

            return {
              ...rest,
              user: userSnapshot,
              report_services: services,
              report_autoparts: autoparts
            };
          }
        )
      }
    };
  } catch (_: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
