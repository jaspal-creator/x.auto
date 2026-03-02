import { useQuery } from '@tanstack/react-query';
import { Car } from 'entities/Car';
import { IQuery } from 'interfaces/query.filtration';
import { Response, STATUS } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetCars = ({
  query
}: {
  query: IQuery & Readonly<{ type: 'MARK' | 'MODEL' | 'VIN' | 'NUMBER' }>;
}) => {
  const redirect = useNavigate();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['cars', query],
    queryFn: async (): Promise<Response<{ count: number; data: Car[] }>> => {
      return await window.xauto.resolveQuery('CARS:FIND:QUERY', { query });
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === STATUS.Unauthorized) redirect('/auth');
  }, []);

  return {
    cars: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
