import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { AutoPartsContext } from '@/pages/AutoParts/context/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoPart } from 'entities/AutoPart';
import { IAutoPartCreate } from 'interfaces/auto-part.create.dto';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
  invalidateKeys: any[];
  forCommand?: boolean;
}

export const useCreateAutoPart = ({ invalidateKeys, forCommand }: Props) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['autoparts'], { keyPrefix: 'hooks.created' });
  const { t: common } = useTranslation(['common']);
  const { t: validation } = useTranslation(['autoparts'], { keyPrefix: 'validation' });
  const { setOpenSheet } = React.useContext(AutoPartsContext);
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
      .optional()
      .or(z.literal('')),
    manufacturer: z
      .string()
      .max(100, { message: validation('manufacturer.max_length') })
      .trim()
      .refine((val) => val === '' || /^[a-zA-Z0-9\s\-.]+$/.test(val), {
        message: validation('manufacturer.invalid_characters')
      })
      .optional()
      .or(z.literal(''))
  });

  const mutation = useMutation({
    mutationKey: ['create', 'auto-part'],
    mutationFn: async ({ data }: { data: IAutoPartCreate }): Promise<Response<AutoPart>> => {
      return await window.xauto.resolveMutation('AUTOPARTS:CREATE:MUTATE', { data });
    },
    onSuccess: ({ Success, Error }: Response<AutoPart>): any => {
      __auth(Error as Response);
      if (Success) {
        form.reset();
        !forCommand && setOpenSheet && setOpenSheet((_) => !_);
        toast({
          title: common('suc'),
          description: `${t('part')} ${Success.name} ${t('suc')}`
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
      name: '',
      code: '',
      manufacturer: ''
    }
  });

  const onSubmit = async (val: z.infer<typeof formModel> | IAutoPartCreate) => {
    mutation.mutate({ data: val as IAutoPartCreate });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
