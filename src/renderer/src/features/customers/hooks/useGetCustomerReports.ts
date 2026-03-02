import { useQuery } from '@tanstack/react-query';
import { Customer } from 'entities/Customer';
import { Report } from 'entities/Report';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetCustomerReports = ({
  id,
  query
}: {
  id: string;
  query: IQuery & Readonly<{ type: 'VIN' | 'NUMBER' | 'MASTER' }>;
}) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['customer', 'reports', id, query],
    queryFn: async (): Promise<
      Response<{ count: number; data: { reports: Report[]; customer: Customer } }>
    > => {
      return await window.xauto.resolveQuery('CUSTOMERS:FIND_REPORTS:QUERY', { id, query });
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
