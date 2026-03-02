import { toast } from '@/components/ui/use-toast';
import { WorkersContext } from '@/pages/Workers/context/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from 'entities/User';
import { Response } from 'interfaces/response.type';
import { IUserCreate } from 'interfaces/user.create.dto';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCheckAuth } from '@/hooks/useCheckAuth';

export const useCreateWorker = ({ invalidateKeys }: { invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['workers'], { keyPrefix: 'hooks' });
  const { t: common } = useTranslation(['common', 'utils']);
  const { setOpenSheet } = React.useContext(WorkersContext);

  const varchars = (long?: number) => {
    console.log('Varchars length:', long); // Using varchars function
    return z
      .string()
      .min(long || 3, `${t('string', { ns: 'utils', long: long || 3 })}`)
      .max(25)
      .trim()
      .refine((s) => !s.includes(' '), t('no_spaces', { ns: 'common' }));
  };

  const formModel = z.object({
    name: z
      .string({
        required_error: t('name_req_err')
      })
      .and(varchars()),
    surname: z
      .string({
        required_error: t('surname_req_err')
      })
      .and(varchars()),
    nickname: z
      .string({
        required_error: t('nickname_req_err')
      })
      .and(varchars()),
    password: z
      .string({
        required_error: t('password_req_err')
      })
      .min(5, `${t('string', { ns: 'utils', long: 5 })}`)
      .max(25)
      .trim()
      .refine((s) => !s.includes(' '), t('no_spaces', { ns: 'common' })),

    // password: passwordValidator(
    //   common('password.validation.rule_1', { ns: 'utils' }),
    //   common('password.validation.rule_2', { ns: 'utils' }),
    //   common('password.validation.rule_3', { ns: 'utils' }),
    //   common('no_spaces', { ns: 'common' })
    // ),
    job: z.string({
      required_error: t('job_req_err')
    }),
    role: z.coerce.number({ required_error: t('role_req_err') }),
    date_of_birth: z.date({
      required_error: t('date_req_err')
    })
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['create', 'worker'],
    mutationFn: async ({ data }: { data: IUserCreate }): Promise<Response<User>> => {
      return await window.xauto.resolveMutation('USERS:CREATE:MUTATE', { data });
    },
    onSuccess: ({ Success, Error }: Response<User>): any => {
      __auth(Error as Response);
      if (Success) {
        form.reset(); // Only reset form on successful creation
        setOpenSheet((_) => !_);
        toast({
          title: common('suc'),
          description: `${t('created.user')} ${Success.nickname} ${t('created.suc')}`
        });
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true }),
          queryClient.refetchQueries({ queryKey: ['all', 'users', { search: '' }], exact: true })
        ]);
      }
      if (Error) {
        const errorMessage =
          Error.msg === 'A user with this login already exists'
            ? t('user_already_exists')
            : Error.msg;
        return toast({ variant: 'destructive', title: common('err'), description: errorMessage });
      }
    }
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      surname: '',
      nickname: '',
      password: '',
      job: '',
      role: undefined,
      date_of_birth: undefined
    }
  });

  const onSubmit = async (val: z.infer<typeof formModel> | IUserCreate) => {
    mutation.mutate({ data: val as IUserCreate });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
