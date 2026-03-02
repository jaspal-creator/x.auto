import { Form } from '@/components/ui/form';
import * as React from 'react';
import Field from '../components/Field';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/Loading';
import { useUpdateService } from '../hooks/useUpdateService';
import { Service } from 'entities/Service';
import { useTranslation } from 'react-i18next';

interface Props {
  invalidateKeys: any[];
  service: Service;
}

export default function UpdateService({ invalidateKeys, service }: Props): React.ReactNode {
  const { t } = useTranslation(['services'], { keyPrefix: 'create' });
  const { form, onSubmit, pending } = useUpdateService({ invalidateKeys, service });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <Field form={form} label={t('name')} name="name" placeHolder={t('name')} type="text" />

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
