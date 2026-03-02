import { useCheckAuth } from '@/hooks/useCheckAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Job } from 'entities/Job';
import { IJobCreate } from 'interfaces/job.create.dto';
import { Response } from 'interfaces/response.type';

export const useCreateJob = () => {
  const __auth = useCheckAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['create', 'job'],
    mutationFn: async ({ data }: { data: IJobCreate }): Promise<Response<Job>> => {
      return await window.xauto.resolveMutation('JOBS:CREATE:MUTATE', { data });
    },
    onSuccess: ({ Error, Success }: Response<Job>) => {
      __auth(Error as Response);
      if (Success) queryClient.invalidateQueries({ queryKey: ['jobs'], exact: true });
    }
  });

  return { mutation };
};
