import { IAuthLogin, SESSION } from '../../../interfaces';
import { xautodb } from '../../db';
import { User } from '../../entities';
import { Cryptor } from '../../lib/Crypto';
import { Response, STATUS } from '../../../interfaces/response.type';
import { Session } from '../../lib/Session';

export const login = async ({ data }: { data: IAuthLogin }): Promise<Response> => {
  const user = await xautodb.getRepository(User).findOneBy({ nickname: data.nickname });
  if (!user) return { [STATUS.Error]: { msg: STATUS.LoginFailed } };

  const { password, ...details } = user;

  const paswd = new Cryptor().decrypt(password);
  if (paswd !== data.password) return { [STATUS.Error]: { msg: STATUS.LoginFailed } };

  const sess = new Session();
  sess.set<typeof details>(
    SESSION.AUTH,
    details,
    parseInt(process.env.MAIN_VITE_SESS_EXPIRE || import.meta.env.MAIN_VITE_SESS_EXPIRE || '15') *
      1000 *
      60 // 15 minutes
  );

  return { [STATUS.Success]: details };
};

export const logout = async () => {
  const sess = new Session();
  sess.clear(SESSION.AUTH);
};
