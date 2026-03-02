import { useQuery } from '@tanstack/react-query';
import { User } from 'entities/User';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetAllMasters = ({ query }: { query: Pick<IQuery, 'search'> }) => {
  const redirect = useNavigate();
  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ['masters', query],
    queryFn: async (): Promise<Response<User[]>> => {
      return await window.xauto.resolveQuery('STATS:FIND_MASTERS:QUERY', { query });
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, []);

  return {
    masters: data?.Success,
    error: data?.Error || error || isError,
    loading: isLoading || isFetching
  };
};
