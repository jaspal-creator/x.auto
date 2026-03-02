import { Form } from '@/components/ui/form';
import { User } from 'entities/User';
import * as React from 'react';
import Field from '../components/Field';
import FieldDate from '../components/FieldDate';
import { Button } from '@/components/ui/button';
import SelectJob from '../components/SelectJob';
import SelectRole from '../components/SelectRole';
import { useUpdateWorker } from '../hooks/useUpdateWorker';
import { LoadingSpinner } from '@/components/Loading';
import { useTranslation } from 'react-i18next';

interface Props {
  user: User;
  invalidateKeys: any[];
}

export default function UpdateWorker({ user, invalidateKeys }: Props): React.ReactNode {
  const { t } = useTranslation(['workers'], { keyPrefix: 'create' });
  const { form, onSubmit, pending } = useUpdateWorker({ user, invalidateKeys });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <Field form={form} label={t('name')} name="name" placeHolder={t('name')} type="text" />
        <Field
          form={form}
          label={t('surname')}
          name="surname"
          placeHolder={t('surname')}
          type="text"
        />
        <FieldDate form={form} label={t('date')} name="date_of_birth" placeHolder={t('date')} />
        <Field
          form={form}
          label={t('nickname')}
          name="nickname"
          placeHolder={t('nickname')}
          type="text"
        />
        <SelectJob
          form={form}
          label={t('job.label')}
          name="job"
          placeHolder={t('job.placeholder')}
        />
        <SelectRole
          form={form}
          label={t('role.label')}
          name="role"
          placeHolder={t('role.placeholder')}
        />
        <Field
          form={form}
          label={t('paswd')}
          name="password"
          placeHolder={t('paswd')}
          type="password"
        />

        <Button
          disabled={pending}
          type="submit"
          variant={'outline'}
          className="border-2 border-primary text-xl font-normal text-primary py-2 h-fit"
        >
          {pending ? <LoadingSpinner /> : t('update')}
        </Button>
      </form>
    </Form>
  );
}
