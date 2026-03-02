import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { useMutation } from '@tanstack/react-query';
import { Response } from 'interfaces/response.type';
import { useTranslation } from 'react-i18next';

export const useBackupDatabase = () => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['settings'], { keyPrefix: 'hooks.backup' });
  const { t: common } = useTranslation(['common']);
  const mutation = useMutation({
    mutationKey: ['backup', 'xauto', 'db'],
    mutationFn: async (): Promise<Response<{ name: string }>> => {
      return await window.xauto.resolveMutation('BACKUP:DATABASE:MUTATE', {});
    },
    onSuccess: (res: Response): any => {
      __auth(res.Error as Response);
      if (res.Success) {
        return toast({
          title: common('suc'),
          description: `${t('suc')} ${res.Success.name}.`
        });
      }

      if (res.Error) {
        return toast({
          variant: 'destructive',
          title: common('err'),
          description: t('err')
        });
      }
    }
  });

  return { backupDb: mutation.mutate, backupLoader: mutation.isLoading };
};
