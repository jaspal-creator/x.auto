import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from 'entities/User';
import { Response } from 'interfaces/response.type';
import { IUserUpdate } from 'interfaces/user.update.dto';
import { useForm } from 'react-hook-form';
import { UpdateResult } from 'typeorm';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCheckAuth } from '@/hooks/useCheckAuth';

export const useUpdateWorker = ({
  user,
  invalidateKeys
}: {
  user: User;
  invalidateKeys: any[];
}) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['workers'], { keyPrefix: 'hooks' });
  const { t: common } = useTranslation(['common', 'utils']);

  const varchars = (long?: number) =>
    z
      .string()
      .min(long || 3, `${t('string', { ns: 'utils', long: long || 3 })}`)
      .max(25)
      .trim()
      .refine((s) => !s.includes(' '), t('no_spaces', { ns: 'common' }));

  const formModel = z.object({
    name: varchars().optional(),
    surname: varchars().optional(),
    nickname: varchars().optional(),
    password: varchars(5).optional(),
    // password: passwordValidator(
    //   common('password.validation.rule_1', { ns: 'utils' }),
    //   common('password.validation.rule_2', { ns: 'utils' }),
    //   common('password.validation.rule_3', { ns: 'utils' }),
    //   common('no_spaces', { ns: 'common' })
    // ).optional(),
    job: z
      .string({
        required_error: t('job_req_err')
      })
      .optional(),
    //   role: z.coerce.number({ required_error: 'Please select a role.' }),
    role: z.string().optional(),
    date_of_birth: z
      .date({
        required_error: t('date_req_err')
      })
      .optional()
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['update', 'user', user.id],
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: IUserUpdate;
    }): Promise<Response<UpdateResult>> => {
      return await window.xauto.resolveMutation('USERS:UPDATE:MUTATE', { id, data });
    },
    onSuccess: ({ Success, Error }: Response<UpdateResult>): any => {
      __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: `${t('updated.user')} ${form.getValues('nickname')} ${t('updated.suc')}`
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
        return toast({
          variant: 'destructive',
          title: common('err'),
          description: errorMessage
        });
      }
    }
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      nickname: user.nickname,
      date_of_birth: new Date(user.date_of_birth),
      job: user.job.id,
      role: String(user.role),
      password: undefined
    }
  });

  const onSubmit = (val: z.infer<typeof formModel>) => {
    let data: IUserUpdate = {};

    /* eslint-disable */
    Object.entries(val)
      .filter(([_, v]) => v !== undefined)
      .forEach(([k, v]) => {
        data = { ...data, [k]: v };
      });
    /* eslint-enable */

    mutation.mutate({ id: user.id, data });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
