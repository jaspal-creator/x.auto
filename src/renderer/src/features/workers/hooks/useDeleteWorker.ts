import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteResult } from 'typeorm';

export const useDeleteWorker = ({ invalidateKeys }: { invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['workers'], { keyPrefix: 'hooks.deleted' });
  const { t: common } = useTranslation(['common']);

  const [user, setUser] = React.useState<null | string>(null);
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationKey: ['delete', 'worker'],
    mutationFn: async ({
      id,
      nickname
    }: {
      id: string;
      nickname: string;
    }): Promise<Response<DeleteResult>> => {
      setUser(nickname);
      return await window.xauto.resolveMutation('USERS:DELETE:MUTATE', { id });
    },
    onSuccess: ({ Success, Error }: Response<DeleteResult>): any => {
      __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: `${t('user')} ${user} ${t('suc')}`
        });
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true }),
          queryClient.refetchQueries({ queryKey: ['all', 'users', { search: '' }], exact: true })
        ]);
      }
      if (Error) {
        const errorMessage =
          Error.msg ===
          'Administrator accounts cannot be deleted. Please change the role to USER first, then delete.'
            ? t('admin_cannot_be_deleted')
            : Error.msg;
        return toast({
          variant: 'destructive',
          title: common('err'),
          description: errorMessage
        });
      }
    }
  });

  return { deleteWorker: del.mutate };
};
