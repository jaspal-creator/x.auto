import { STATUS } from '../../interfaces';

export default async function applyMiddlewares(
  middlewares: (() => boolean)[],
  cb: () => Promise<any> | any
): Promise<any> {
  if (!middlewares.some((midds) => midds() === false)) return await cb();
  return { [STATUS.Error]: { msg: STATUS.Unauthorized } };
}
