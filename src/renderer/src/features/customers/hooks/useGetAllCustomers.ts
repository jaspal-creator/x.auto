import { useQuery } from '@tanstack/react-query';
import { Customer } from 'entities/Customer';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetAllCustomers = ({
  query
}: {
  query: Omit<IQuery, 'limit' | 'page' | 'sort'>;
}) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['customers', 'all', query],
    queryFn: async (): Promise<Response<Customer[]>> => {
      return await window.xauto.resolveQuery<any, Omit<IQuery, 'limit' | 'page' | 'sort'>>(
        'CUSTOMERS:GET_ALL:QUERY',
        { query }
      );
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, [data, redirect]);

  return {
    customers: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching,
    refetch
  };
};
