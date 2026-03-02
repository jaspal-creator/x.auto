import { useQuery } from '@tanstack/react-query';
import { User } from 'entities/User';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetWorkers = ({ query }: { query: IQuery }) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', query],
    queryFn: async (): Promise<Response<{ count: number; data: User[] }>> => {
      return await window.xauto.resolveQuery<any, IQuery, any>('USERS:FIND:QUERY', { query });
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, [data, redirect]);

  return {
    users: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
