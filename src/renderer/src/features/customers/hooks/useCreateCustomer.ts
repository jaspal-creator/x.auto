import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { CustomersContext } from '@/pages/Customers/context/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer } from 'entities/Customer';
import { ICustomerCreate } from 'interfaces/customer.create.dto';
import { Response, STATUS } from 'interfaces/response.type';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const useCreateCustomer = ({
  invalidateKeys,
  cb
}: {
  invalidateKeys: any[];
  cb?: () => void;
}) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['customers'], { keyPrefix: 'hooks.created' });
  const { t: common } = useTranslation(['common']);
  const { setOpenSheet } = React.useContext(CustomersContext);
  const queryClient = useQueryClient();

  const varchars = () => z.string().min(2).max(50).trim();
  const formModel = z.object({
    name: varchars(),
    fiscal_code: z.string().min(0).max(50).trim().optional()
  });

  const mutation = useMutation({
    mutationKey: ['create', 'customer'],
    mutationFn: async ({ data }: { data: ICustomerCreate }): Promise<Response<Customer>> => {
      return await window.xauto.resolveMutation('CUSTOMERS:CREATE:MUTATE', { data });
    },
    onSuccess: async ({ Success, Error }: Response<Customer>): Promise<any> => {
      await __auth(Error as Response);
      if (Success) {
        setOpenSheet && setOpenSheet((_) => !_);
        toast({
          title: common('suc'),
          description: `${t('customer')} ${Success.name} ${t('suc')}`
        });
        form.reset({ name: '', fiscal_code: '' });

        cb && cb();
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
          description:
            Error.msg === STATUS.CustomerAlreadyInDatabase ? common('customers.exists') : Error.msg
        });
    }
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      name: undefined,
      fiscal_code: undefined
    }
  });

  const onSubmit = async (val: z.infer<typeof formModel> | ICustomerCreate) => {
    // Convert empty fiscal_code to null to avoid unique constraint issues
    const data = {
      ...val,
      fiscal_code: val.fiscal_code && val.fiscal_code.trim() !== '' ? val.fiscal_code : undefined
    };
    mutation.mutate({ data: data as ICustomerCreate });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
