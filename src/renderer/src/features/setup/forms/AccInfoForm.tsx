import { Form } from '@/components/ui/form';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import Field from './Field';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

/* eslint-disable */
interface Props {
  form: UseFormReturn<any>;
  onSubmit: (val: any) => void;
}
/* eslint-enable */

export default function AccInfoForm({ form, onSubmit }: Props): React.ReactNode {
  const { t } = useTranslation(['setup'], { keyPrefix: 'form_acc' });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-12">
        <div className="flex flex-col gap-6 w-2/3">
          <Field form={form} name="name" label={t('name')} placeHolder={t('name')} />
          <Field form={form} name="surname" label={t('surname')} placeHolder={t('surname')} />
          <Field form={form} name="nickname" label={t('login')} placeHolder={t('login')} />
          <Field
            form={form}
            name="password"
            label={t('password')}
            placeHolder={t('password')}
            type="password"
          />
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <h1 className="text-primary text-[100px] font-bold">1</h1>
          <p className="text-primary text-2xl font-normal text-balance text-center">
            {t('proceed')}
          </p>
          <Button
            type="submit"
            variant={'outline'}
            className="m-0 p-0 text-primary font-normal text-xl border-primary border-2 py-3 px-20 mt-5  h-fit w-full"
          >
            {t('continue')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
