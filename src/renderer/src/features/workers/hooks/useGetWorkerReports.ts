import { useQuery } from '@tanstack/react-query';
import { Report } from 'entities/Report';
import { User } from 'entities/User';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetWorkerReports = ({
  id,
  query
}: {
  id: string;
  query: IQuery & Readonly<{ type: 'VIN' | 'CUSTOMER' | 'NUMBER' }>;
}) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['worker', 'reports', id, query],
    queryFn: async (): Promise<
      Response<{ count: number; data: { reports: Report[]; user: User } }>
    > => {
      return await window.xauto.resolveQuery('USERS:FIND_REPORTS:QUERY', { id, query });
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, []);

  return {
    reports: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
