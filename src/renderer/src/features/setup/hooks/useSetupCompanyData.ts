import { zodResolver } from '@hookform/resolvers/zod';
import { ICompanyCreate } from 'interfaces/company.create.dto';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Company } from 'entities/Company';
import { z } from 'zod';
import { IUserCreate } from 'interfaces/user.create.dto';
import { User } from 'entities/User';
import { toast } from '@/components/ui/use-toast';
import { IJobCreate } from 'interfaces/job.create.dto';
import { Job } from 'entities/Job';
import { Response } from 'interfaces/response.type';
import { useTranslation } from 'react-i18next';
import { ibanValidator } from '@/lib/iban.validator';

export const useSetupCompanyData = (nextStep: React.Dispatch<React.SetStateAction<number>>) => {
  const { t } = useTranslation(['welcome']);
  const { t: common } = useTranslation(['common', 'utils']);
  const [pending, setPending] = React.useState<boolean>(false);

  const minMaxTrim = (min: number, max: number) =>
    z
      .string()
      .min(min, t('string', { ns: 'utils', long: min }))
      .max(max, t('max_string', { ns: 'utils', long: max }))
      .trim();

  const noSpaces = z.string().refine((s) => !s.includes(' '), {
    message: common('no_spaces')
  });

  const formModel = z.object({
    iban: ibanValidator(
      common('iban.validation.rule_1', { ns: 'utils' }),
      // common('iban.validation.rule_2', { ns: 'utils' }),
      // common('iban.validation.rule_3', { ns: 'utils' }),
      // common('iban.validation.rule_4', { ns: 'utils' }),
      // common('iban.validation.rule_5', { ns: 'utils' }),
      common('no_spaces')
    ),
    bank: minMaxTrim(3, 50),
    fiscal_code: minMaxTrim(10, 50).and(noSpaces),
    autoservice: minMaxTrim(3, 50),
    region: minMaxTrim(3, 50),
    town_village: minMaxTrim(3, 50)
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      iban: '',
      bank: '',
      fiscal_code: '',
      autoservice: '',
      region: '',
      town_village: ''
    }
  });

  const onSubmit = async (val: z.infer<typeof formModel>): Promise<any> => {
    setPending(true);

    // setup company
    await window.xauto.resolveMutation<ICompanyCreate, Company>('COMPANY:CREATE:MUTATE', {
      data: val
    });

    // setup admin super job
    const job = await window.xauto.resolveMutation<IJobCreate, Response<Job>>(
      'JOBS:CREATE:MUTATE',
      {
        data: { name: 'ADMIN' }
      }
    );

    if (job.Error)
      return toast({ variant: 'destructive', title: common('err'), description: job.Error.msg });

    // setup admin
    const admin = await window.xauto.resolveMutation<IUserCreate, Response<User>>(
      'USERS:CREATE:MUTATE',
      {
        data: {
          ...JSON.parse(window.localStorage.getItem('step_one') as string),
          role: 1,
          job: job.Success?.id,
          date_of_birth: new Date()
        }
      }
    );

    if (admin.Error)
      return toast({ variant: 'destructive', title: common('err'), description: admin.Error.msg });

    toast({
      title: `${t('title.hi')} ${admin.Success?.surname} ${admin.Success?.name} ${t('title.welc')}`,
      description: t('desc')
    });

    setTimeout(() => {
      window.localStorage.clear();
      form.reset();
      setPending(false);
      nextStep((_) => _ + 1);
    }, 2000);
  };

  return { form, onSubmit, pending };
};
