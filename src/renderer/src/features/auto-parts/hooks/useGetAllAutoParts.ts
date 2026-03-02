import { useQuery } from '@tanstack/react-query';
import { AutoPart } from 'entities/AutoPart';
import { IQuery } from 'interfaces/query.filtration';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetAllAutoParts = ({
  query
}: {
  query: Omit<IQuery, 'limit' | 'page' | 'sort'>;
}) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['autoparts', 'all', query],
    queryFn: async (): Promise<Response<AutoPart[]>> => {
      return await window.xauto.resolveQuery<any, Omit<IQuery, 'limit' | 'page' | 'sort'>>(
        'AUTOPARTS:GET_ALL:QUERY',
        { query }
      );
    }
  });

  React.useEffect(() => {
    refetch();
  }, []);

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, [data, redirect]);

  return {
    autoparts: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
