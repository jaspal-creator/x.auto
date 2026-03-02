import { Form } from '@/components/ui/form';
import * as React from 'react';
import Field from '../components/Field';
import CarNumberField from '../components/CarNumberField';
import SelectCustomer from '../components/SelectCustomer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/Loading';
import { useCreateCar } from '../hooks/useCreateCar';
import { useTranslation } from 'react-i18next';

interface Props {
  invalidateKeys: any[];
}

export default function CreateCar({ invalidateKeys }: Props): React.ReactNode {
  const { t } = useTranslation(['cars'], { keyPrefix: 'create' });
  const { form, onSubmit, pending } = useCreateCar({ invalidateKeys });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <Field form={form} name="brand" label={t('brand')} placeHolder={t('brand')} />
        <Field form={form} name="model" label={t('model')} placeHolder={t('model')} />
        <CarNumberField
          form={form}
          name="car_number"
          label={t('car_number')}
          placeHolder={t('car_number')}
        />
        <Field form={form} name="vin" label={t('vin')} placeHolder={t('vin')} />
        <SelectCustomer
          form={form}
          name="customer"
          label={t('customer.label')}
          placeHolder={t('customer.label')}
        />
        <Field form={form} name="year" label={t('year')} placeHolder={t('year')} type="number" />
        <Field
          form={form}
          name="engine_capacity"
          label={t('engine')}
          placeHolder={t('engine')}
          type="number"
          step="number"
        />

        <Button
          disabled={pending}
          type="submit"
          variant={'outline'}
          className="border-2 border-primary text-xl font-normal text-primary py-2 h-fit"
        >
          {pending ? <LoadingSpinner /> : t('create')}
        </Button>
      </form>
    </Form>
  );
}
