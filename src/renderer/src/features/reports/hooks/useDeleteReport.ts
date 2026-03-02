import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Response } from 'interfaces/response.type';
import { useTranslation } from 'react-i18next';
import { DeleteResult } from 'typeorm';

export const useDeleteReport = ({ invalidateKeys }: { invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['report'], { keyPrefix: 'hooks.deleted' });
  const { t: common } = useTranslation(['common']);
  const queryClient = useQueryClient();

  const del = useMutation({
    mutationKey: ['delete', 'report'],
    mutationFn: async ({ id }: { id: string }): Promise<Response<DeleteResult>> => {
      return await window.xauto.resolveMutation('REPORT:DELETE:MUTATE', { id });
    },
    onSuccess: async ({ Success, Error }: Response<DeleteResult>): Promise<any> => {
      await __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: t('desc')
        });
        return queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
      }
      if (Error)
        return toast({ variant: 'destructive', title: common('err'), description: Error.msg });
    }
  });

  return { deleteReport: del.mutate };
};
