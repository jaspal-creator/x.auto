import { Form } from '@/components/ui/form';
import * as React from 'react';
import Field from '../components/Field';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/Loading';
import { useCreateCustomer } from '../hooks/useCreateCustomer';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface Props {
  invalidateKeys: any[];
  innerForm?: boolean;
  cb?: () => void;
  style?: Partial<{
    form: React.HTMLAttributes<HTMLFormElement>['className'];
    button: React.HTMLAttributes<HTMLButtonElement>['className'];
    field: Partial<{
      label: React.HTMLAttributes<HTMLLabelElement>['className'];
      input: React.HTMLAttributes<HTMLInputElement>['className'];
      error: React.HTMLAttributes<HTMLParagraphElement>['className'];
    }>;
  }>;
}

// Unused function - keeping for potential future use
// function DecisionalContainer({
//   children,
//   innerForm,
//   style,
//   onSubmit
// }: {
//   children: React.ReactNode;
//   innerForm?: boolean;
//   style?: string;
//   onSubmit: React.FormEventHandler<HTMLFormElement>;
// }): React.ReactNode {
//   return (
//     <>
//       {innerForm ? (
//         <form className={cn('flex flex-col gap-6 w-full', style)} onSubmit={onSubmit}>
//           {children}
//         </form>
//       ) : (
//         <div className={cn('flex flex-col gap-6 w-full', style)}>{children}</div>
//       )}
//     </>
//   );
// }

export default function CreateCustomer({
  invalidateKeys,
  style,
  cb,
  innerForm
}: Props): React.ReactNode {
  const { t } = useTranslation(['customers'], { keyPrefix: 'create' });
  const { form, onSubmit, pending } = useCreateCustomer({ invalidateKeys, cb });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
        <Field
          form={form}
          label={t('name')}
          name="name"
          placeHolder={t('name')}
          type="text"
          style={{ label: style?.field?.label, input: style?.field?.input }}
        />
        <Field
          form={form}
          label={t('code')}
          name="fiscal_code"
          placeHolder={t('code')}
          type="text"
          style={{ label: style?.field?.label, input: style?.field?.input }}
        />
        <Button
          onClick={innerForm ? form.handleSubmit(onSubmit) : () => {}}
          disabled={pending}
          type="submit"
          variant={'outline'}
          className={cn(
            'border-2 border-primary text-xl font-normal text-primary py-2 h-fit',
            style?.button
          )}
        >
          {pending ? <LoadingSpinner /> : t('create')}
        </Button>
      </form>
      {/* </DecisionalContainer> */}
    </Form>
  );
}
