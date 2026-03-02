import { LoadingSpinner } from '@/components/Loading';
import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetStats } from '../hooks/useGetStats';
import { Badge } from '@/components/ui/badge';
import { User } from 'entities/User';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { oneMonthBack, InitDate } from '@/lib/set-date';
import { IActionState } from '@/pages/Invoices/context/context';
import { IInvoiceAutoPartState } from 'interfaces/invoice.states';
import { useTranslation } from 'react-i18next';
import { Report } from 'entities/Report';

// Extended User type that includes reports from backend
type UserWithReports = User & { report: Report[] };

interface Props<T> {
  data: (T & { id: string })[];
  loading?: boolean;
  /* eslint-disable no-unused-vars*/
  master_row: (_: T) => React.ReactNode;
  table: (_: User) => React.ReactNode;
  onMasterChange: (master: string) => void;
  defaultMaster: string;
  onDateChange: (date: DateRange) => void;
  /* eslint-enable no-unused-vars */
  date: {
    from: Date | string;
    to: Date | string;
  };
}

export default function MastersStats<T>({
  data,
  loading,
  master_row,
  table,
  onMasterChange,
  defaultMaster,
  onDateChange,
  date
}: Props<T>): React.ReactNode {
  const { t } = useTranslation(['stats'], { keyPrefix: 'master_stat' });
  const { master: stats, loading: loading_stats } = useGetStats({
    id: defaultMaster || (data && (data.at(0)?.id as string)),
    query: {
      from: date.from ? new Date(date.from) : oneMonthBack(),
      to: date.to ? InitDate(new Date(date.to)) : new Date()
    }
  });

  const totals = React.useMemo(() => {
    if (!(stats as UserWithReports)?.report) return { actions: 0, invoices: 0, services: 0 };

    return (stats as UserWithReports).report.reduce(
      (acc, report) => {
        if (report?.invoice) {
          // Total from invoice (complete invoice total)
          acc.invoices += Number(report.invoice.total) || 0;

          // Total from actions only
          const actionsPrices = JSON.parse(report.invoice.actions_prices) as IActionState[];
          acc.actions += actionsPrices?.reduce((sum, action) => sum + (action?.price || 0), 0) || 0;

          // Total from services/details only
          const detailsPrices = JSON.parse(
            report.invoice.details_prices
          ) as IInvoiceAutoPartState[];
          acc.services +=
            detailsPrices?.reduce(
              (sum, detail) => sum + (detail?.price || 0) * (detail?.quantity || 1),
              0
            ) || 0;
        }
        return acc;
      },
      { actions: 0, invoices: 0, services: 0 }
    );
  }, [stats]);

  return (
    <section className="h-full w-full flex justify-center items-center">
      {data?.length !== 0 ? (
        <div className="w-full h-full">
          {loading ? (
            <div className="flex justify-center items-center w-full h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="w-full flex h-full">
              <div className="w-1/4 border-r-2 border-[#E1E1E1] h-full pr-6 flex flex-col gap-4">
                <DateRangePicker
                  align="start"
                  onUpdate={(date) => onDateChange && onDateChange(date.range)}
                  initialDateFrom={date.from ? new Date(date.from) : oneMonthBack()}
                  initialDateTo={date.to ? InitDate(new Date(date.to)) : new Date()}
                  showCompare={false}
                  locale="ro"
                />
                <ScrollArea className="">
                  <ToggleGroup
                    type="single"
                    className="flex flex-col w-full gap-3"
                    defaultValue={defaultMaster || data[0]?.id}
                    onValueChange={onMasterChange}
                  >
                    {data.map((master) => (
                      <ToggleGroupItem
                        key={master.id}
                        value={master.id}
                        className="text-xl font-normal m-0 h-fit p-3 rounded-2xl w-full text-left border-2 border-[#E1E1E1] flex justify-start data-[state=on]:bg-primary data-[state=on]:text-white"
                      >
                        {master_row(master)}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </ScrollArea>
              </div>
              <div className="w-3/4 flex flex-col h-full pl-6 gap-3">
                {loading_stats ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {stats ? (
                      <>
                        <div className="flex justify-between items-center">
                          <h1 className="font-normal text-3xl">
                            {stats?.surname} {stats?.name}
                          </h1>

                          <div className="flex items-center gap-6">
                            <Badge className="text-xl h-fit w-fit p-0 m-0 px-8 py-1 flex gap-6 font-normal shadow-lg">
                              {t('completed')} {(stats as UserWithReports)?.report.length}
                            </Badge>
                            <Badge className="text-xl h-fit w-fit p-0 m-0 px-8 py-1 flex gap-6 font-normal shadow-lg">
                              {t('total')} {totals.actions?.toFixed(2)}MDL
                            </Badge>
                            <Badge className="text-xl h-fit w-fit p-0 m-0 px-8 py-1 flex gap-6 font-normal shadow-lg">
                              {t('invoice_totals')} {totals.invoices?.toFixed(2)}MDL
                            </Badge>
                            <Badge className="text-xl h-fit w-fit p-0 m-0 px-8 py-1 flex gap-6 font-normal shadow-lg">
                              {t('services_totals')} {totals.services?.toFixed(2)}MDL
                            </Badge>
                          </div>
                        </div>

                        <ScrollArea className="w-full h-[825px] border-2 border-[#E1E1E1] rounded-2xl p-3">
                          {table(stats as User)}
                        </ScrollArea>
                      </>
                    ) : (
                      <div className="w-full h-full flex justify-center items-center text-xl">
                        <h1>{t('no_works')}</h1>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-xl">
          <h1>{t('not_found')}</h1>
        </div>
      )}
    </section>
  );
}
