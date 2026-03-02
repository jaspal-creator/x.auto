import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoPart } from 'entities/AutoPart';
import { IAutoPartUpdate } from 'interfaces/auto-part.update.dto';
import { Response } from 'interfaces/response.type';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UpdateResult } from 'typeorm';
import { z } from 'zod';

export const useUpdateAutoPart = ({
  autopart,
  invalidateKeys
}: {
  autopart: AutoPart;
  invalidateKeys: any[];
}) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['autoparts'], { keyPrefix: 'hooks.updated' });
  const { t: common } = useTranslation(['common']);
  const { t: validation } = useTranslation(['autoparts'], { keyPrefix: 'validation' });
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
      }),
    code: z
      .string()
      .max(50, { message: validation('code.max_length') })
      .trim()
      .refine((val) => val === '' || /^[a-zA-Z0-9-]+$/.test(val), {
        message: validation('code.invalid_characters')
      })
      .optional(),
    manufacturer: z
      .string()
      .max(100, { message: validation('manufacturer.max_length') })
      .trim()
      .refine((val) => val === '' || /^[a-zA-Z0-9\s\-.]+$/.test(val), {
        message: validation('manufacturer.invalid_characters')
      })
      .optional()
  });

  const mutation = useMutation({
    mutationKey: ['update', 'auto-part', autopart.id],
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: IAutoPartUpdate;
    }): Promise<Response<UpdateResult>> => {
      return await window.xauto.resolveMutation('AUTOPARTS:UPDATE:MUTATE', { id, data });
    },
    onSuccess: ({ Success, Error }: Response<UpdateResult>): any => {
      __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: `${t('part')} ${form.getValues('name')} ${t('suc')}`
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
      name: autopart.name,
      code: autopart.code ? autopart.code : undefined,
      manufacturer: autopart.manufacturer ? autopart.manufacturer : undefined
    }
  });

  const onSubmit = (val: z.infer<typeof formModel>) =>
    mutation.mutate({ id: autopart.id, data: val });

  return { form, onSubmit, pending: mutation.isLoading };
};
