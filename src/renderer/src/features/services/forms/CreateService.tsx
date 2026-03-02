import * as React from 'react';
import Field from '../components/Field';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/Loading';
import { useCreateService } from '../hooks/useCreateService';
import { useTranslation } from 'react-i18next';

interface Props {
  invalidateKeys: any[];
  forCommand?: boolean;
}

export default function CreateService({
  invalidateKeys,
  forCommand = false
}: Props): React.ReactNode {
  const { t } = useTranslation(['services'], { keyPrefix: 'create' });
  const { form, onSubmit, pending } = useCreateService({ invalidateKeys, forCommand });

  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col w-full ${forCommand ? 'gap-3 items-center' : 'gap-6'}`}
      >
        <Field form={form} label={t('name')} name="name" placeHolder={t('name')} type="text" />

        <Button
          disabled={pending}
          type="submit"
          variant={'outline'}
          className={`border-2 border-primary text-xl font-normal text-primary py-2 h-fit ${forCommand && 'text-base w-fit px-16'}`}
        >
          {pending ? <LoadingSpinner /> : t('create')}
        </Button>
      </form>
    </Form>
  );
}
