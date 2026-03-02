import { IAuthLogin } from '../../../interfaces';
import { Channel } from '../../lib/Channel';
import { authMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { login, logout } from './auth.handlers';

export class Auth extends Channel {
  constructor(name: string) {
    super(name);
  }

  login() {
    this.Mutate('LOGIN', async (_, { data }: { data: IAuthLogin }) => login({ data }));
  }

  logout() {
    this.Mutate('LOGOUT', async () => applyMiddlewares([authMiddleware], logout));
  }
}
