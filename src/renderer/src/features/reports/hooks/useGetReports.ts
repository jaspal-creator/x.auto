import { useQuery } from '@tanstack/react-query';
import { Report } from 'entities/Report';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetReports = ({
  query
}: {
  query: IQuery & { type: 'VIN' | 'NUMBER' | 'CUSTOMER' };
}) => {
  const redirect = useNavigate();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['reports', query],
    queryFn: async (): Promise<Response<{ count: number; data: Report[] }>> => {
      return await window.xauto.resolveQuery('REPORT:FIND:QUERY', { query });
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
