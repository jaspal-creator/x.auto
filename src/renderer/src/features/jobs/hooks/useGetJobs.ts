import { useQuery } from '@tanstack/react-query';
import { Job } from 'entities/Job';
import { Response } from 'interfaces/response.type';

export const useGetJobs = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['jobs'],
    queryFn: async (): Promise<Response<Job[]>> => {
      return await window.xauto.resolveQuery('JOBS:FIND:QUERY', {});
    }
  });

  return { jobs: data?.Success, error: data?.Error, loading: isLoading || isFetching };
};
