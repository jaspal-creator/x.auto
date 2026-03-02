import { SESSION } from '../../interfaces';
import { Session } from '../lib/Session';

export const guardMiddleware = (): boolean => {
  const sess = new Session();
  return sess.get<{ role: number }>(SESSION.AUTH)?.role === 1 ? true : false;
};
