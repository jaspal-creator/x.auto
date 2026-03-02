import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'entities/User';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { setLastLoginTime } from '@/hooks/useCheckAuth';

export const useAuth = () => {
  const { t } = useTranslation(['auth', 'common', 'utils']);

  const varchars = (long?: number) => {
    return z
      .string()
      .min(long || 3, `${t('string', { ns: 'utils', long: long || 3 })}`)
      .max(25)
      .trim()
      .refine((s) => !s.includes(' '), t('no_spaces', { ns: 'common' }));
  };

  const formModel = z.object({
    nickname: varchars(),
    password: varchars(5)
  });

  const queryClient = useQueryClient();
  const redirect = useNavigate();
  const [pending, setPending] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      nickname: '',
      password: ''
    }
  });

  const onSubmit = async (val: z.infer<typeof formModel>): Promise<any> => {
    setPending(true);
    const res: Response<User> = await window.xauto.resolveMutation('AUTH:LOGIN:MUTATE', {
      data: val
    });

    setTimeout((): any => {
      if (res.Error) {
        // Handle specific login failure message
        const errorMessage = res.Error.msg === 'Login Failed' ? t('login_failed') : res.Error.msg;

        toast({
          variant: 'destructive',
          title: t('auth_err'),
          description: errorMessage
        });
      }

      if (res.Success) {
        setLastLoginTime(); // Set grace period for auth checks
      }

      queryClient.invalidateQueries({ queryKey: ['client-app-status'] });

      if (res.Success?.role === 1) {
        return redirect('/workers');
      }
      if (res.Success?.role === 0) {
        return redirect(`/report`);
      }
      setPending(false);
    }, 1000);
  };

  return { form, onSubmit, pending };
};
