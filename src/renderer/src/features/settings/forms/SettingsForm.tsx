import { Form } from '@/components/ui/form';
import SettingsField from '../components/field';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { ChevronDown } from 'lucide-react';
import { useUpdateCompanyInfo } from '../hooks/useUpdateCompanyInfo';
import { LoadingSpinner } from '@/components/Loading';
// import { useExportData } from '../hooks/useExportData';
import { Company } from 'entities/Company';
// import { useBackupDatabase } from '../hooks/useBackupDatabase';
import { useTranslation } from 'react-i18next';

export default function SettingsForm({ company }: { company: Company }): React.ReactNode {
  const { t } = useTranslation(['settings'], { keyPrefix: 'form' });
  const { form, onSubmit, pending /*isImporting*/ } = useUpdateCompanyInfo({ company });
  // const { exportData } = useExportData();
  // const { backupDb, backupLoader } = useBackupDatabase();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <SettingsField form={form} name="iban" placeholder={t('iban')} label={t('iban')} />
        <SettingsField form={form} name="bank" placeholder={t('bank')} label={t('bank')} />
        <SettingsField form={form} name="autoservice" placeholder={t('name')} label={t('name')} />
        <SettingsField form={form} name="fiscal_code" placeholder={t('code')} label={t('code')} />

        {/* <Button
          disabled={backupLoader}
          onClick={() => backupDb()}
          type="button"
          variant={'outline'}
          className="border-2 rounded-lg w-full h-fit text-foreground font-normal text-base border-primary m-0 p-0 py-2"
        >
          {backupLoader ? <LoadingSpinner /> : t('backup')}
        </Button>

        <SettingsField
          loading={isImporting}
          type="file"
          form={form}
          name="file"
          placeholder={t('import')}
          label={t('import')}
          onChange={({ event, field }) =>
            field.onChange(event.target.files && event.target.files[0])
          }
        />

        <Button
          // disabled={loadExporter}
          type="button"
          onClick={exportData}
          variant={'outline'}
          className="border-2 rounded-lg w-full h-fit text-foreground font-normal text-base border-primary m-0 p-0 py-2 flex"
        >
          {t('export')} <ChevronDown />
        </Button> */}

        <div className="flex w-full gap-4">
          <DialogClose className="w-full rounded-lg h-fit m-0 p-0 text-base font-normal py-3 bg-primary text-card hover:bg-primary/90">
            {t('cancel')}
          </DialogClose>
          <Button
            disabled={pending}
            type="submit"
            className="w-full rounded-lg h-fit m-0 p-0 text-base font-normal py-3"
          >
            {pending ? <LoadingSpinner /> : t('update')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
