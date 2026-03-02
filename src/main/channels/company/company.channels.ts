import { ICompanyCreate } from '../../../interfaces/company.create.dto';
import { ICompanyUpdate } from '../../../interfaces/company.update.dto';
import { Channel } from '../../lib/Channel';
import { authMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import { createCompany, findCompany, updateCompany } from './company.handlers';

export class Company extends Channel {
  constructor(name: string) {
    super(name);
  }

  find() {
    this.Query('FIND', findCompany);
  }

  create() {
    this.Mutate('CREATE', async (_, { data }: { data: ICompanyCreate }) => createCompany({ data }));
  }

  update() {
    this.Mutate('UPDATE', async (_, { data }: { data: ICompanyUpdate }) =>
      applyMiddlewares([authMiddleware], () => updateCompany({ data }))
    );
  }
}
