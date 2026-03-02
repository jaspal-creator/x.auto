import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter
} from '@/components/ui/table';
import { IActionState, IAutoPartState } from '@/pages/Invoices/context/context';
import { Report } from 'entities/Report';
import * as React from 'react';
import { usePrintInvoice } from '../hooks/usePrintInvoice';
import { useTranslation } from 'react-i18next';
import { useClientStatus } from '@/hooks/useClientStatus';
import Field from './field';

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
}

export default function PreviewPriceDialog({ report }: Props): React.ReactNode {
  const { t } = useTranslation(['invoices'], { keyPrefix: 'confirm.table' });
  const { t: invoiceT } = useTranslation(['invoices'], { keyPrefix: 'create' });
  const { printInvoice } = usePrintInvoice();
  const { data: currentUser } = useClientStatus();

  const [actions] = React.useState<IActionState[]>(JSON.parse(report.invoice.actions_prices));
  const [autoparts] = React.useState<IAutoPartState[]>(JSON.parse(report.invoice.details_prices));
  const total = React.useMemo(
    () =>
      actions.reduce((prev, curr) => prev + curr.price, 0) +
      autoparts.reduce((prev, curr) => prev + curr.price * curr.quantity, 0),
    [actions, autoparts]
  );

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
    <section className="w-full flex flex-col gap-8">
      {/* REPORT DETAILS */}
      <div className="flex gap-6 w-full">
        <Field label={invoiceT('master')} value={masterName} />
        <Field
          label={invoiceT('customer')}
          value={report.customer.fiscal_code || report.customer.name}
        />
        <Field label={invoiceT('vin')} value={report.car.vin} />
        <Field label={invoiceT('car_number')} value={report.car.car_number} />
        <Field label={invoiceT('mileage')} value={report.mileage.toString()} />
      </div>
      {/* TABLE */}
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl font-medium text-foreground/50 py-4">
                {t('no')}
              </TableHead>
              <TableHead className="text-xl font-medium text-foreground/50 py-4">
                {t('details_actions')}
              </TableHead>
              <TableHead className="text-xl font-medium text-foreground/50 py-4">
                {t('qntty')}
              </TableHead>
              <TableHead className="text-xl font-medium text-foreground/50 py-4">
                {t('price')}
              </TableHead>
              <TableHead className="text-xl font-medium text-foreground/50 py-4">
                {t('total')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action: IActionState, _: number) => (
              <TableRow key={action.id}>
                <TableCell className="text-base font-normal text-black py-4">{_ + 1}</TableCell>
                <TableCell className="text-base font-normal text-black py-4">
                  {action.name}
                </TableCell>
                <TableCell className="text-base font-normal text-black py-4">1</TableCell>
                <TableCell className="text-base font-normal text-black py-4">
                  {action.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-base font-normal text-black py-4">
                  {action.price.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {autoparts.map((part: IAutoPartState, _: number) => (
              <TableRow key={part.id}>
                <TableCell className="text-base font-normal text-black py-4">
                  {actions.length + _ + 1}
                </TableCell>
                <TableCell className="text-base font-normal text-black py-4">{part.name}</TableCell>
                <TableCell className="text-base font-normal text-black py-4">
                  {part.quantity}
                </TableCell>
                <TableCell className="text-base font-normal text-black py-4">
                  {part.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-base font-normal text-black py-4">
                  {Number(part.price * part.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-lg font-medium text-black py-4">
                {t('total_tva')}
              </TableCell>
              <TableCell className="text-lg font-medium text-black py-4">
                {total.toFixed(2).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>

      {/* CANCEL & CONFIRM */}
      <DialogFooter className="flex gap-3 justify-end">
        <DialogClose className="w-24 font-normal text-base h-fit m-0 p-0 rounded-lg py-2 border text-primary border-primary">
          {t('close')}
        </DialogClose>
        <Button
          className="w-24 font-normal text-base h-fit m-0 p-0 rounded-lg py-2"
          onClick={() => printInvoice({ id: report.invoice.id })}
        >
          {t('print')}
        </Button>
      </DialogFooter>
    </section>
  );
}
