export enum ESort {
  /* eslint-disable */
  RECENT = 'RECENT',
  OLDER = 'OLDER',
  AZ = 'AZ',
  ZA = 'ZA'
  /* eslint-enable */
}

export interface IQuery {
  page: number;
  limit: number;
  search: string;
  sort: 'RECENT' | 'OLDER' | 'AZ' | 'ZA';
}
