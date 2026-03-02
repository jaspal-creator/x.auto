import { Customer } from 'entities/Customer';
import * as React from 'react';
import { useUpdateCustomer } from '../hooks/useUpdateCustomer';
import { Form } from '@/components/ui/form';
import Field from '../components/Field';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/Loading';
import { useTranslation } from 'react-i18next';

interface Props {
  invalidateKeys: any[];
  customer: Customer;
}

export default function UpdateCustomer({ invalidateKeys, customer }: Props): React.ReactNode {
  const { t } = useTranslation(['customers'], { keyPrefix: 'create' });
  const { form, onSubmit, pending } = useUpdateCustomer({ invalidateKeys, customer });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <Field form={form} label={t('name')} name="name" placeHolder={t('name')} type="text" />
        <Field
          form={form}
          label={t('code')}
          name="fiscal_code"
          placeHolder={t('code')}
          type="text"
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
