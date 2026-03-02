import { SESSION } from '../../interfaces';
import { Session } from '../lib/Session';

export const authMiddleware = (): boolean => {
  const sess = new Session();
  return sess.get(SESSION.AUTH) === null ? false : true;
};
