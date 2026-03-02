import { Form } from '@/components/ui/form';
import * as React from 'react';
import Field from '../components/Field';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/Loading';
import { AutoPart } from 'entities/AutoPart';
import { useUpdateAutoPart } from '../hooks/useUpdateAutoPart';
import { useTranslation } from 'react-i18next';

interface Props {
  invalidateKeys: any[];
  autopart: AutoPart;
}

export default function UpdateAutoPart({ invalidateKeys, autopart }: Props): React.ReactNode {
  const { t } = useTranslation(['autoparts'], { keyPrefix: 'create' });
  const { form, onSubmit, pending } = useUpdateAutoPart({ invalidateKeys, autopart });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <Field form={form} label={t('name')} name="name" placeHolder={t('name')} type="text" />
        <Field form={form} label={t('code')} name="code" placeHolder={t('code')} type="text" />
        <Field
          form={form}
          label={t('manufacturer')}
          name="manufacturer"
          placeHolder={t('manufacturer')}
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
