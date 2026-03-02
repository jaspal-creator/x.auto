import { ipcMain } from 'electron';

export class Channel {
  public queries: string[];
  public mutations: string[];
  constructor(private name: string) {
    this.name = name;
    this.queries = [];
    this.mutations = [];
  }

  private generateActionName(actionName: string, type: 'QUERY' | 'MUTATE'): string {
    return `${this.name.toUpperCase().trim()}:${actionName.toUpperCase().trim()}:${type}`;
  }

  /* eslint-disable */
  async Query<T = any, R = any>(actionName: string, cb: (e: any, d: T) => Promise<R>) {
    if (this.queries.includes(this.generateActionName(actionName, 'QUERY'))) {
      throw new Error(`Query Action ${actionName} is already defined.`);
    }

    this.queries = [...this.queries, this.generateActionName(actionName, 'QUERY')];

    ipcMain.handle(this.generateActionName(actionName, 'QUERY'), async (_event, data: T) => {
      return cb(_event, data);
    });
  }

  async Mutate<T = any, R = any>(actionName: string, cb: (e: any, d: T) => Promise<R>) {
    if (this.mutations.includes(this.generateActionName(actionName, 'MUTATE'))) {
      throw new Error(`Mutation Action ${actionName} is already defined.`);
    }

    this.mutations = [...this.mutations, this.generateActionName(actionName, 'MUTATE')];

    ipcMain.handle(this.generateActionName(actionName, 'MUTATE'), async (_event, data: T) => {
      return cb(_event, data);
    });
  }
  /* eslint-enable */
}
