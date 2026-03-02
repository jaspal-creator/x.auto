import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import Field from './Field';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/Loading';
import { useTranslation } from 'react-i18next';

/* eslint-disable */
interface Props {
  form: UseFormReturn<any>;
  onSubmit: (val: any) => void;
  pending: boolean;
}
/* eslint-enable */

export default function CompanyDataForm({ form, onSubmit, pending }: Props) {
  const { t } = useTranslation(['setup'], { keyPrefix: 'form_company' });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-12">
        <div className="flex flex-col gap-6 w-2/3">
          <Field form={form} name="iban" label={t('iban')} placeHolder={t('iban')} />
          <Field form={form} name="bank" label={t('bank')} placeHolder={t('bank')} />
          <Field form={form} name="autoservice" label={t('name')} placeHolder={t('name')} />
          <Field form={form} name="fiscal_code" label={t('code')} placeHolder={t('code')} />
          <Field form={form} name="region" label={t('region')} placeHolder={t('region')} />
          <Field
            form={form}
            name="town_village"
            label={t('town_village')}
            placeHolder={t('town_village')}
          />
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <h1 className="text-primary text-[100px] font-bold">2</h1>
          <p className="text-primary text-2xl font-normal text-balance text-center">{t('text')}</p>
          <Button
            disabled={pending}
            type="submit"
            variant={'outline'}
            className="m-0 p-0 text-primary font-normal text-xl border-primary border-2 py-3 px-20 mt-5 w-full h-fit"
          >
            {pending ? <LoadingSpinner /> : t('init')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
