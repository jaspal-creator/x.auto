import { useOpenPreview } from '@/components/Table/hooks/useOpenPreview';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Report } from 'entities/Report';
import { Minus } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IInvoiceAutoPartState } from 'interfaces/invoice.states';
import { IActionState } from '@/pages/Invoices/context/context';

/* eslint-disable */
interface Props {
  reports: Report[];
  previewAction: {
    title: (_: Report) => string;
    content: (_: Report) => React.ReactNode;
    confirm?: ({
      open,
      setOpen,
      report,
      reinvoice
    }: {
      open: boolean;
      report: string;
      setOpen: () => void;
      reinvoice?: number;
    }) => React.ReactNode;
  };
}
/* eslint-enable */

export default function StatsTable({ reports, previewAction }: Props): React.ReactNode {
  const { t } = useTranslation(['stats'], { keyPrefix: 'stats_table' });
  const { open, close, active, query } = useOpenPreview();

  // Calculate services total for a specific report
  const getServicesTotal = (report: Report): number => {
    if (!report.invoice) return 0;

    try {
      const detailsPrices = JSON.parse(report.invoice.details_prices) as IInvoiceAutoPartState[];
      return (
        detailsPrices?.reduce(
          (sum, detail) => sum + (detail?.price || 0) * (detail?.quantity || 1),
          0
        ) || 0
      );
    } catch {
      return 0;
    }
  };

  // Calculate actions total for a specific report
  const getActionsTotal = (report: Report): number => {
    if (!report.invoice) return 0;

    try {
      const actionsPrices = JSON.parse(report.invoice.actions_prices) as IActionState[];
      return actionsPrices?.reduce((sum, action) => sum + (action?.price || 0), 0) || 0;
    } catch {
      return 0;
    }
  };

  if (query.get('confirm') && previewAction?.confirm)
    return previewAction?.confirm({
      open: Boolean(query.get('confirm')),
      setOpen: () => close({ confirm: true }),
      report: query.get('confirm') as string,
      reinvoice: parseInt(query.get('reinvoice') as string)
    });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-medium text-base text-foreground/50">{t('brand')}</TableHead>
          <TableHead className="font-medium text-base text-foreground/50">{t('model')}</TableHead>
          <TableHead className="font-medium text-base text-foreground/50">
            {t('car_number')}
          </TableHead>
          <TableHead className="font-medium text-base text-foreground/50">{t('vin')}</TableHead>
          <TableHead className="font-medium text-base text-foreground/50">{t('action')}</TableHead>
          <TableHead className="font-medium text-base text-foreground/50">{t('price')}</TableHead>
          <TableHead className="font-medium text-base text-foreground/50">
            {t('services_total')}
          </TableHead>
          <TableHead className="font-medium text-base text-foreground/50">
            {t('actions_total')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report: Report) => (
          <Dialog
            key={report.id}
            open={report.id === active && Boolean(query.get('preview'))}
            onOpenChange={(_) => (_ ? () => {} : close({}))}
          >
            <DialogTrigger asChild onClick={() => open(report.id)}>
              <TableRow>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.car.brand}
                </TableCell>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.car.model}
                </TableCell>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.car.car_number}
                </TableCell>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.car.vin}
                </TableCell>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.report_services[0]?.service?.name}
                </TableCell>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.invoice ? report.invoice.total.toFixed(2) : <Minus />}
                </TableCell>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.invoice ? getServicesTotal(report).toFixed(2) : <Minus />}
                </TableCell>
                <TableCell className="font-normal text-foreground text-base m-0 py-4">
                  {report.invoice ? getActionsTotal(report).toFixed(2) : <Minus />}
                </TableCell>
              </TableRow>
            </DialogTrigger>
            <DialogContent className="min-w-[1200px]" onInteractOutside={(_) => _.preventDefault()}>
              <DialogTitle className="font-normal text-2xl">
                {previewAction.title(report) || ''}
              </DialogTitle>
              {previewAction.content(report)}
            </DialogContent>
          </Dialog>
        ))}
      </TableBody>
    </Table>
  );
}
