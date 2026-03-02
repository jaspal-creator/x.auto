import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { downloadFile } from '@/lib/downloadFile';
import { useQuery } from '@tanstack/react-query';
import { AutoPart } from 'entities/AutoPart';
import { Customer } from 'entities/Customer';
import { Service } from 'entities/Service';
import { Response } from 'interfaces/response.type';
import { useTranslation } from 'react-i18next';

export const useExportData = (): any => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['settings'], { keyPrefix: 'hooks.export' });
  const { t: common } = useTranslation(['common']);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['export', 'data'],
    queryFn: async (): Promise<
      Response<{ customers: Customer[]; services: Service[]; auto_parts: AutoPart[] }>
    > => {
      return await window.xauto.resolveQuery('EXPORTER:EXPORT:QUERY', {});
    }
  });

  const exportData = () => {
    __auth(data?.Error as Response);
    if (data?.Error)
      return toast({
        variant: 'destructive',
        title: common('err'),
        description: t('err')
      });

    if (data?.Success) {
      return downloadFile({
        content: data?.Success,
        file: `XAUTO_DATA_${new Date().toISOString()}`,
        extension: 'json'
      });
    }
  };

  return { exportData, loading: isFetching || isLoading };
};
