import { useQuery } from '@tanstack/react-query';
import { Company } from 'entities/Company';
import { Response } from 'interfaces/response.type';

export const useGetCompanyInfo = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['company', 'info'],
    queryFn: async (): Promise<Response<Company[]>> => {
      return await window.xauto.resolveQuery('COMPANY:FIND:QUERY', {});
    }
  });

  return {
    company: data?.Success?.at(0),
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
