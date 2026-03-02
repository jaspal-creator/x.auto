import { useQuery } from '@tanstack/react-query';
import { Service } from 'entities/Service';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { useCheckAuth } from '@/hooks/useCheckAuth';

export const useGetServices = ({ query }: { query: IQuery }) => {
  const redirect = useNavigate();
  console.log('Redirect function available:', !!redirect); // Using redirect variable
  const checkAuth = useCheckAuth();
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['services', query],
    queryFn: async (): Promise<Response<{ count: number; data: Service[] }>> => {
      return await window.xauto.resolveQuery('SERVICES:FIND:QUERY', { query });
    },
    retry: (failureCount, error: any) => {
      // Don't retry if it's an unauthorized error to prevent logout loops
      if (error?.Error?.msg === 'Unauthorized') {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000
  });

  React.useEffect(() => {
    refetch();
  }, []);

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') {
      checkAuth(data);
    }
  }, [data, checkAuth]);

  return {
    services: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
