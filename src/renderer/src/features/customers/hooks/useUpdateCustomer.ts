import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer } from 'entities/Customer';
import { ICustomerUpdate } from 'interfaces/customer.update.dto';
import { Response } from 'interfaces/response.type';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UpdateResult } from 'typeorm';
import { z } from 'zod';

export const useUpdateCustomer = ({
  customer,
  invalidateKeys
}: {
  customer: Customer;
  invalidateKeys: any[];
}) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['customers'], { keyPrefix: 'hooks.updated' });
  const { t: common } = useTranslation(['common']);
  const queryClient = useQueryClient();

  const varchars = () => z.string().min(0).max(50).trim();
  const formModel = z.object({
    name: z.string().min(2).max(50).trim(),
    fiscal_code: varchars().optional()
  });

  const mutation = useMutation({
    mutationKey: ['update', 'customer', customer.id],
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: ICustomerUpdate;
    }): Promise<Response<UpdateResult>> => {
      return await window.xauto.resolveMutation('CUSTOMERS:UPDATE:MUTATE', { id, data });
    },
    onSuccess: async ({ Success, Error }: Response<UpdateResult>): Promise<any> => {
      await __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: `${t('customer')} ${form.getValues('name')} ${t('suc')}`
        });
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true }),
          queryClient.invalidateQueries({
            queryKey: ['customers', 'all', { search: '' }],
            exact: true
          }),
          // Also invalidate the main customers page cache
          queryClient.invalidateQueries({
            queryKey: ['customers'],
            exact: false
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

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      name: customer.name,
      fiscal_code: customer.fiscal_code ? customer.fiscal_code : undefined
    }
  });

  const onSubmit = (val: z.infer<typeof formModel>) => {
    // Convert empty fiscal_code to null to avoid unique constraint issues
    const data = {
      ...val,
      fiscal_code: val.fiscal_code && val.fiscal_code.trim() !== '' ? val.fiscal_code : undefined
    };
    mutation.mutate({ id: customer.id, data });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
