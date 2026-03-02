import { Report } from 'entities/Report';
import Field from './field';
import ItemsArea from './items-area';
import { Button } from '@/components/ui/button';
import { useFillContext } from '../hooks/useFillContext';
import { useConfirmPrices } from '../hooks/useConfirmPrices';
import { useTranslation } from 'react-i18next';
import { useClientStatus } from '@/hooks/useClientStatus';

// Extended Report interface to handle both structures
interface ReportWithUser extends Report {
  user?: {
    id: string;
    name: string;
    surname: string;
    nickname: string;
  };
}

interface Props {
  report: ReportWithUser;
  // stats?: boolean;
  context: React.Context<any>;
  reinvoice?: {
    invoice: number;
    condition: boolean;
  };
}

export default function Invoice({ report, context, reinvoice }: Props): React.ReactNode {
  const { t } = useTranslation(['invoices'], { keyPrefix: 'create' });
  const { data: currentUser } = useClientStatus();

  const { setActionPrice, setAutoPartPrice, contextActions, contextAutoParts } = useFillContext({
    context,
    reinvoice: reinvoice?.condition ? { report } : false
  });

  const confirm = useConfirmPrices({
    id: report.id,
    reinvoice: reinvoice?.condition ? reinvoice.invoice : undefined
  });

  // Use report's user data if available, otherwise fallback to current authenticated user
  const masterName =
    // Check if user object exists (from reports list)
    report.user?.surname && report.user?.name
      ? `${report.user.surname} ${report.user.name}`
      : // Check if individual user fields exist (from single report)
        report.user_surname && report.user_name
        ? `${report.user_surname} ${report.user_name}`
        : // Fallback to current authenticated user
          `${currentUser?.surname} ${currentUser?.name}`;

  return (
    <form
      className="flex flex-col gap-6 w-full"
      onSubmit={(e) => {
        confirm(e);
      }}
    >
      <div className="flex gap-6 w-full">
        <Field label={t('master')} value={masterName} />
        <Field label={t('customer')} value={report.customer.fiscal_code || report.customer.name} />
        <Field label={t('vin')} value={report.car.vin} />
        <Field label={t('car_number')} value={report.car.car_number} />
        <Field label={t('mileage')} value={report.mileage.toString()} />
      </div>
      <div className="flex justify-between gap-6">
        <ItemsArea<(typeof report.report_services)[0]>
          label={t('actions')}
          data={report.report_services}
          row={({ service: { name } }) => (
            <h1 className="text-lg font-normal text-foreground">{name}</h1>
          )}
          defaultRowInputValue={(field) => {
            const foundAction = contextActions.filter(({ id }) => field.service.id === id).at(0);
            return foundAction?.price as number;
          }}
          onValueChange={({ price, service: { id, name } }) => {
            setActionPrice({ id, price, name });
          }}
        />
        <ItemsArea<(typeof report.report_autoparts)[0]>
          label={t('details')}
          data={report.report_autoparts}
          row={({ autopart: { name } }) => (
            <h1 className="text-lg font-normal text-foreground">{name}</h1>
          )}
          defaultRowInputValue={(field) => {
            const foundPart = contextAutoParts.filter(({ id }) => field.autopart.id === id).at(0);
            return foundPart?.price as number;
          }}
          quantity={true}
          onValueChange={({ price, autopart: { id, name, code }, quantity }) => {
            setAutoPartPrice({
              id,
              name,
              quantity,
              price,
              code
            });
          }}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        <Button
          type="submit"
          variant={'outline'}
          className="border-2 border-primary m-0 p-0 text-base font-normal h-fit text-primary px-20 py-2"
        >
          {t('save')}
        </Button>
      </div>
    </form>
  );
}
