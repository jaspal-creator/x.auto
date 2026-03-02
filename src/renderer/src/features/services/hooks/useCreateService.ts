import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { ServicesContext } from '@/pages/Services/context/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Service } from 'entities/Service';
import { Response } from 'interfaces/response.type';
import { IServiceCreate } from 'interfaces/service.create.dto';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
  invalidateKeys: any[];
  forCommand?: boolean;
}

export const useCreateService = ({ invalidateKeys, forCommand }: Props) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['services'], { keyPrefix: 'hooks.created' });
  const { t: common } = useTranslation(['common']);
  const { t: validation } = useTranslation(['services'], { keyPrefix: 'validation' });
  const { setOpenSheet } = React.useContext(ServicesContext);
  const queryClient = useQueryClient();

  const formModel = z.object({
    name: z
      .string()
      .min(1, { message: validation('name.required') })
      .min(2, { message: validation('name.min_length') })
      .max(100, { message: validation('name.max_length') })
      .trim()
      .refine((val) => val.length > 0, { message: validation('name.required') })
      .refine((val) => /^[a-zA-Z0-9\s\-.]+$/.test(val), {
        message: validation('name.invalid_characters')
      })
  });

  const mutation = useMutation({
    mutationKey: ['create', 'service'],
    mutationFn: async ({ data }: { data: IServiceCreate }): Promise<Response<Service>> => {
      return await window.xauto.resolveMutation('SERVICES:CREATE:MUTATE', { data });
    },
    onSuccess: ({ Success, Error }: Response<Service>): any => {
      __auth(Error as Response);
      if (Success) {
        form.reset();
        !forCommand && setOpenSheet && setOpenSheet((_) => !_);
        toast({
          title: common('suc'),
          description: `${t('service')} ${Success.name} ${t('suc')}`
        });
        if (forCommand) {
          // In command mode, delay query invalidation to prevent accordion glitching
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
          }, 100);
        } else {
          return queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
        }
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
      name: ''
    }
  });

  const onSubmit = async (val: z.infer<typeof formModel> | IServiceCreate) => {
    mutation.mutate({ data: val as IServiceCreate });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
