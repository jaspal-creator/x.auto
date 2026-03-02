import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

export const useSetupAccInfo = (nextStep: React.Dispatch<React.SetStateAction<number>>) => {
  const { t } = useTranslation(['common', 'utils']);

  const varchars = (long?: number) =>
    z
      .string()
      .min(long || 3, `${t('string', { ns: 'utils', long: long || 3 })}`)
      .max(25)
      .trim()
      .refine((s) => !s.includes(' '), t('no_spaces', { ns: 'common' }));

  const formModel = z.object({
    name: varchars(),
    surname: varchars(),
    nickname: varchars(),
    password: varchars(5)
    /* password: passwordValidator(
      t('password.validation.rule_1', { ns: 'utils' }),
      t('password.validation.rule_2', { ns: 'utils' }),
      t('password.validation.rule_3', { ns: 'utils' }),
      t('no_spaces', { ns: 'common' })
    ) */
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      name: '',
      surname: '',
      nickname: '',
      password: ''
    }
  });

  const onSubmit = (val: z.infer<typeof formModel>) => {
    window.localStorage.setItem('step_one', JSON.stringify(val));
    form.reset();
    nextStep((_) => _ + 1);
  };

  return { form, onSubmit };
};
