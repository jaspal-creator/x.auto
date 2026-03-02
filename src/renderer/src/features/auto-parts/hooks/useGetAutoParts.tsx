import { useQuery } from '@tanstack/react-query';
import { AutoPart } from 'entities/AutoPart';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetAutoParts = ({ query }: { query: IQuery }) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['auto-parts', query],
    queryFn: async (): Promise<Response<{ count: number; data: AutoPart[] }>> => {
      return await window.xauto.resolveQuery('AUTOPARTS:FIND:QUERY', { query });
    }
  });

  React.useEffect(() => {
    refetch();
  }, []);

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, []);

  return {
    autoparts: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
