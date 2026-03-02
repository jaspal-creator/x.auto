import StatsLayout, { StatsContext } from './context/context';
import Utilities from '@/components/Utilities/Utilities';
import { useMastersFiltration } from '@/features/stats/hooks/useMastersFiltration';
import { useGetAllMasters } from '@/features/stats/hooks/useGetAllMasters';
import MastersStats from '@/features/stats/components/masters-stats';
import { User } from '../../../../main/entities/User';
import StatsTable from '@/features/stats/components/stats-table';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLetter';
import PreviewPriceDialog from '@/features/invoices/components/preview-price-dialog';
import { Report } from '../../../../main/entities/Report';
import Invoice from '@/features/invoices/components/invoice';
import ConfirmPriceDialog from '@/features/invoices/components/confirm-price-dialog';
import { useTranslation } from 'react-i18next';
import { InvoiceSatatus } from 'interfaces/invoice.status.enum';

export default function Stats(): React.ReactNode {
  const { t } = useTranslation(['stats']);
  const { setDate, setSearch, setMaster, query } = useMastersFiltration();
  const { masters, loading } = useGetAllMasters({ query });

  return (
    <StatsLayout>
      <Utilities title={t('title')} search={setSearch} />
      {/* MASTERS STATS */}
      <MastersStats<User>
        loading={loading}
        data={masters as User[]}
        onMasterChange={setMaster}
        defaultMaster={query.master}
        onDateChange={(date) =>
          setDate({
            from: date.from?.toLocaleDateString() as string,
            to: date.to?.toLocaleDateString() as string
          })
        }
        date={{ from: query.from, to: query.to }}
        master_row={({ name, surname }) => (
          <>
            {name} {surname}
          </>
        )}
        table={(stats: User) => (
          <StatsTable
            reports={(stats as any).report}
            previewAction={{
              title: ({ car: { brand, model, year } }) =>
                `${capitalizeFirstLetter(brand)} ${capitalizeFirstLetter(model)} (${year})`,
              content: (report: Report) => (
                <>
                  {report.invoice && report.invoice?.status === InvoiceSatatus.READY ? (
                    <PreviewPriceDialog report={report} />
                  ) : (
                    <Invoice
                      context={StatsContext}
                      report={report}
                      reinvoice={{
                        condition: report.invoice?.status === InvoiceSatatus.REINVOICE,
                        invoice: report.invoice?.id
                      }}
                    />
                  )}
                </>
              ),
              confirm: ({ open, setOpen, report, reinvoice }) => (
                <ConfirmPriceDialog
                  open={open}
                  setOpen={setOpen}
                  report={report}
                  reinvoice={reinvoice}
                  invalidateKeys={['master', 'stats', stats.id]}
                  context={StatsContext}
                />
              )
            }}
          />
        )}
      />
    </StatsLayout>
  );
}

//  invalidateKeys={['master', 'stats', stats.id]}
