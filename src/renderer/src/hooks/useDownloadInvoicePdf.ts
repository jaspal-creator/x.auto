import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { IDownloadPdf } from 'interfaces/download.pdf.dto';
import { Response, STATUS } from 'interfaces/response.type';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const useDownloadInvoicePdf = () => {
  const { t } = useTranslation(['download']);
  const [loading, setLoading] = React.useState<boolean>(false);
  const mutation = useMutation({
    mutationKey: ['download', 'invoice', 'pdf'],
    mutationFn: async ({ data }: { data: IDownloadPdf }) => {
      setLoading(true);
      return await window.xauto.resolveMutation('PDF:DOWNLOAD:MUTATE', { data });
    },
    onSuccess: (response: Response) => {
      setTimeout(() => {
        if (response?.Success) {
          toast({
            title: t('pdf.success'),
            description: t('pdf.success_desc')
          });
        }
        return setLoading(false);
      }, 3000);
    },
    onError: (error: any) => {
      setTimeout(() => {
        const errorMsg = error?.Error?.msg || error?.msg;
        let title = t('pdf.error');
        let description = t('pdf.error_desc');

        // Handle specific error types
        switch (errorMsg) {
          case STATUS.PdfLoadError:
            title = t('pdf.load_error');
            description = t('pdf.load_error_desc');
            break;
          case STATUS.PdfGenerationError:
            title = t('pdf.generation_error');
            description = t('pdf.generation_error_desc');
            break;
          case STATUS.PdfSaveError:
            title = t('pdf.save_error');
            description = t('pdf.save_error_desc');
            break;
          default:
            // Use generic error messages
            break;
        }

        toast({
          variant: 'destructive',
          title,
          description
        });
        return setLoading(false);
      }, 1000);
    }
  });

  return { downloadInvoice: mutation.mutate, pending: mutation.isLoading || loading };
};
