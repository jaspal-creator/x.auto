import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteResult } from 'typeorm';

export const useDeleteService = ({ invalidateKeys }: { invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['services'], { keyPrefix: 'hooks.deleted' });
  const { t: common } = useTranslation(['common']);
  const [service, setService] = React.useState<null | string>(null);
  const queryClient = useQueryClient();

  const del = useMutation({
    mutationKey: ['delete', 'service'],
    mutationFn: async ({
      id,
      name
    }: {
      id: string;
      name: string;
    }): Promise<Response<DeleteResult>> => {
      setService(name);
      return await window.xauto.resolveMutation('SERVICES:DELETE:MUTATE', { id });
    },
    onSuccess: ({ Success, Error }: Response<DeleteResult>): any => {
      __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: `${t('service')} ${service} ${t('suc')}`
        });
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true }),
          queryClient.invalidateQueries({
            queryKey: ['services', 'all'],
            exact: true
          })
        ]);
      }
      if (Error)
        return toast({
          variant: 'destructive',
          title: common('err'),
          description: Error.msg
        });
    }
  });

  return { deleteService: del.mutate };
};
