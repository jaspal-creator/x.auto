import { useQuery } from '@tanstack/react-query';
import { User } from 'entities/User';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetAllWorkers = ({ query }: { query: Omit<IQuery, 'page' | 'limit' | 'sort'> }) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['all', 'users', query],
    queryFn: async (): Promise<Response<User[]>> => {
      return await window.xauto.resolveQuery('USERS:FIND_ALL:QUERY', { query });
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, []);

  return {
    users: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
