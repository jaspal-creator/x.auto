import { useQuery } from '@tanstack/react-query';
import { User } from 'entities/User';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetStats = ({
  id,
  query
}: {
  id: string;
  query: { from: string | Date; to: string | Date };
}) => {
  const redirect = useNavigate();
  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: [
      'master',
      'stats',
      id,
      (query.from as Date).toLocaleString(),
      (query.to as Date).toLocaleString()
    ],
    queryFn: async (): Promise<Response<User>> => {
      return await window.xauto.resolveQuery('STATS:FIND_BY_ID:QUERY', { id, query });
    },
    enabled: Boolean(id)
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, [data, redirect]);
  return {
    master: data?.Success,
    error: data?.Error || error || isError,
    loading: isFetching || isLoading
  };
};
