import { useQuery } from '@tanstack/react-query';
import { Customer } from 'entities/Customer';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetCustomers = ({ query }: { query: IQuery }) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['customers', query],
    queryFn: async (): Promise<Response<{ count: number; data: Customer[] }>> => {
      return await window.xauto.resolveQuery('CUSTOMERS:FIND:QUERY', { query });
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, []);

  return {
    customers: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
