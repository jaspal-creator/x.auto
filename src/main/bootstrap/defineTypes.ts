import { writeFile } from 'node:fs';
import { join } from 'node:path';

export const writeAPITypes = (QueryRegister: string[], MutationRegister: string[]): void => {
  writeFile(
    join(`${process.cwd()}`, 'src', 'preload', 'GlobalContextAPI.ts'),
    `export type Query = ${JSON.stringify(QueryRegister).replace(/\[/g, '').replace(/\]/g, '').split(',').join('|')};export type Mutation = ${JSON.stringify(MutationRegister).replace(/\[/g, '').replace(/\]/g, '').split(',').join('|')};
    
    export type GlobalContextAPIType = {
    queries: Promise<string[]>;
    mutations: Promise<string[]>;
    /* eslint-disable no-unused-vars */
    resolveQuery: <T = any, Q = any, R = any>(query: Query,{ id, data }: { id?: string | number; data?: T, query?: Q }) => Promise<R>;
    resolveMutation: <T = any, R = any>(mutation: Mutation,{ id, data }: { id?: string | number; data?: T }) => Promise<R>;};
    /* eslint-enable no-unused-vars */
    `,
    (err: any) => {
      if (err) console.error(err);
      else console.log('Types Generated');
    }
  );
};
