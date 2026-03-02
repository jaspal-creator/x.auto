import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { IActionState, IAutoPartState } from '@/pages/Invoices/context/context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Invoice } from 'entities/Invoice';
import { Report } from 'entities/Report';
import { IInvoiceCreate } from 'interfaces/invoice.create.dto';
import { IInvoiceUpdate } from 'interfaces/invoice.update.dto';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DeepPartial, UpdateResult } from 'typeorm';

export const useCreateInvoice = ({
  /* eslint-disable */
  id,
  invalidateKeys,
  cb,
  cleanup,
  reinvoice
}: {
  id: string;
  invalidateKeys?: any[];
  cb?: ({ id }: { id: number }) => void;
  cleanup?: () => void;
  reinvoice?: number;
  /* eslint-enable */
}) => {
  /**
   * Clean up secure clean context
   */
  React.useEffect(() => {
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const __auth = useCheckAuth();
  const { t } = useTranslation(['invoices'], { keyPrefix: 'hooks.create' });
  const { t: common } = useTranslation(['common']);
  // const { setActions, setAutoParts } = useContext(stats ? StatsContext : InvoicesContext);
  // const redirect = useNavigate();
  const queryClient = useQueryClient();

  /**
   * Create invoice
   */
  const createInvoiceMuation = useMutation({
    mutationKey: ['create', 'invoice', 'report', id],
    mutationFn: async (data: IInvoiceCreate): Promise<Response<Invoice>> => {
      return await window.xauto.resolveMutation('INVOICE:CREATE:MUTATE', { data });
    },
    onSuccess: async ({ Success, Error }: Response<Invoice>): Promise<unknown> => {
      await __auth(Error as Response);
      if (Error) {
        return toast({
          title: common('err'),
          description: t('err')
        });
      }

      toast({
        title: common('suc'),
        description: t('suc')
      });

      await new Promise((res) => setTimeout(res, 1000));
      // setActions([]);
      // setAutoParts([]);

      invalidateKeys && queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
      cb && cb({ id: Success?.id as number });

      // return redirect(`/invoices/${Success?.id}?${EInvoiceQueryStatus.FULL}=true`);
      return;
    }
  });

  /**
   * Update Invoice
   */
  const updateInvoiceMutation = useMutation({
    mutationKey: ['update', 'invoice', reinvoice],
    mutationFn: async ({
      id,
      data
    }: {
      id: number;
      data: IInvoiceUpdate;
    }): Promise<Response<UpdateResult>> => {
      return await window.xauto.resolveMutation('INVOICE:UPDATE:MUTATE', { id, data });
    },
    /* eslint-disable */
    onSuccess: async ({ Success: _Success, Error }: Response<UpdateResult>): Promise<unknown> => {
      await __auth(Error as Response);
      if (Error) {
        return toast({
          title: common('err'),
          description: t('err')
        });
      }

      toast({
        title: common('suc'),
        description: t('suc')
      });

      await new Promise((res) => setTimeout(res, 1000));

      invalidateKeys && queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
      cb && cb({ id: reinvoice as number });
      return;
    }
  });
  /* eslint-enable */

  /**
   * Invoicer Eunner
   */
  const run_invoicer = ({
    total,
    actions,
    autoparts
  }: {
    total: number;
    actions: IActionState[];
    autoparts: IAutoPartState[];
  }) => {
    reinvoice
      ? updateInvoiceMutation.mutate({
          id: reinvoice,
          data: {
            total,
            tva: total / 6,
            actions_prices: JSON.stringify(actions),
            details_prices: JSON.stringify(autoparts)
          }
        })
      : createInvoiceMuation.mutate({
          total,
          tva: total / 6,
          actions_prices: JSON.stringify(actions),
          details_prices: JSON.stringify(autoparts),
          report: id as DeepPartial<Report>
        });
  };

  return {
    run_invoicer,
    pending: createInvoiceMuation.isLoading || updateInvoiceMutation.isLoading
  };
};
