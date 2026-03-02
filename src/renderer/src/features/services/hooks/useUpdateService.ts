import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Service } from 'entities/Service';
import { Response } from 'interfaces/response.type';
import { IServiceUpdate } from 'interfaces/service.update.dto';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UpdateResult } from 'typeorm';
import { z } from 'zod';

export const useUpdateService = ({
  service,
  invalidateKeys
}: {
  service: Service;
  invalidateKeys: any[];
}) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['services'], { keyPrefix: 'hooks.updated' });
  const { t: common } = useTranslation(['common']);
  const { t: validation } = useTranslation(['services'], { keyPrefix: 'validation' });
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
    mutationKey: ['update', 'service', service.id],
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: IServiceUpdate;
    }): Promise<Response<UpdateResult>> => {
      return await window.xauto.resolveMutation('SERVICES:UPDATE:MUTATE', { id, data });
    },
    onSuccess: ({ Success, Error }: Response<UpdateResult>): any => {
      __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: `${t('service')} ${form.getValues('name')} ${t('suc')}`
        });
        return queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
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
      name: service.name
    }
  });

  const onSubmit = (val: z.infer<typeof formModel>) =>
    mutation.mutate({ id: service.id, data: val });

  return { form, onSubmit, pending: mutation.isLoading };
};
