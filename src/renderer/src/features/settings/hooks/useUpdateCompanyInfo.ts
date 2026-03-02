import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ICompanyUpdate } from 'interfaces/company.update.dto';
import { Response } from 'interfaces/response.type';
import { useForm } from 'react-hook-form';
import { UpdateResult } from 'typeorm';
import { z } from 'zod';
import { IImportData } from 'interfaces/import.data.dto';
import { ReadFile } from '@/lib/read-file';
import { Company } from 'entities/Company';
import { useTranslation } from 'react-i18next';
import { useCheckAuth } from '@/hooks/useCheckAuth';
// import { ibanValidator } from '@/lib/iban.validator';

export const useUpdateCompanyInfo = ({ company }: { company: Company }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['settings'], { keyPrefix: 'hooks' });
  const { t: common } = useTranslation(['common', 'utils']);
  const { t: validation } = useTranslation(['settings'], { keyPrefix: 'validation' });
  const queryClient = useQueryClient();

  const formModel = z.object({
    iban: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true; // Optional field
          return val.length >= 15 && val.length <= 24;
        },
        {
          message: validation('iban.length')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return !val.includes(' ');
        },
        {
          message: validation('iban.no_spaces')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/.test(val.toUpperCase());
        },
        {
          message: validation('iban.format')
        }
      ),
    bank: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return val.trim().length >= 2;
        },
        {
          message: validation('bank.min_length')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return val.trim().length <= 100;
        },
        {
          message: validation('bank.max_length')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return /^[a-zA-Z0-9\s\-.]+$/.test(val);
        },
        {
          message: validation('bank.invalid_characters')
        }
      ),
    autoservice: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return val.trim().length >= 2;
        },
        {
          message: validation('autoservice.min_length')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return val.trim().length <= 100;
        },
        {
          message: validation('autoservice.max_length')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return /^[a-zA-Z0-9\s\-.]+$/.test(val);
        },
        {
          message: validation('autoservice.invalid_characters')
        }
      ),
    fiscal_code: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return val.trim().length >= 6;
        },
        {
          message: validation('fiscal_code.min_length')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return val.trim().length <= 20;
        },
        {
          message: validation('fiscal_code.max_length')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return !val.includes(' ');
        },
        {
          message: validation('fiscal_code.no_spaces')
        }
      )
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          return /^[A-Z0-9]+$/.test(val.toUpperCase());
        },
        {
          message: validation('fiscal_code.invalid_characters')
        }
      ),
    file: z
      .custom<File>((_) => _ instanceof File, validation('file.invalid_type'))
      .refine((_) => _.type === 'application/json', {
        message: validation('file.invalid_extension')
      })
      .refine(
        (_) => _.size <= 10 * 1024 * 1024, // 10MB limit
        {
          message: validation('file.too_large')
        }
      )
      .optional()
  });

  const mutation = useMutation({
    mutationKey: ['company', 'update'],
    mutationFn: async ({ data }: { data: ICompanyUpdate }): Promise<Response<UpdateResult>> => {
      return await window.xauto.resolveMutation('COMPANY:UPDATE:MUTATE', { data });
    },
    onSuccess: (res: Response<UpdateResult>): any => {
      __auth(res.Error as Response);
      if (res.Success) {
        toast({ title: common('suc'), description: t('update.suc') });
        return queryClient.invalidateQueries(['company', 'info']);
      }

      if (res.Error) {
        return toast({
          variant: 'destructive',
          title: common('err'),
          description: t('update.err')
        });
      }
    }
  });

  const importMutation = useMutation({
    mutationKey: ['import', 'data'],
    mutationFn: async ({ data }: { data: IImportData }): Promise<Response<IImportData>> => {
      return await window.xauto.resolveMutation('IMPORTER:IMPORT:MUTATE', { data });
    },
    onSuccess: (res: Response<IImportData>): any => {
      form.reset({ file: undefined });

      if (res.Success) {
        queryClient.refetchQueries();
        return toast({ title: common('suc'), description: t('export.suc') });
      }

      if (res.Error) {
        return toast({ title: common('err'), description: t('export.err') });
      }
    }
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      iban: company?.iban,
      bank: company?.bank,
      autoservice: company?.autoservice,
      fiscal_code: company?.fiscal_code,
      file: undefined
    }
  });

  const onSubmit = async (val: z.infer<typeof formModel>) => {
    const { file, ...rest } = val;
    const { iban, bank, fiscal_code, autoservice } = company as Company;

    if (
      JSON.stringify(rest) !== JSON.stringify({ iban, bank, autoservice, fiscal_code }) &&
      Object.values(rest).filter((_) => _).length > 0
    )
      mutation.mutate({ data: { ...rest } });

    if (file) importMutation.mutate({ data: JSON.parse((await ReadFile(file)) as any) });
  };

  return {
    form,
    onSubmit,
    pending: mutation.isLoading,
    isImporting: importMutation.isLoading
  };
};
