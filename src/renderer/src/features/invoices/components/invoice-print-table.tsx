import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatDate } from '@/lib/format-date';
import { IActionState, IAutoPartState } from '@/pages/Invoices/context/context';
import { Company } from 'entities/Company';
import { Invoice } from 'entities/Invoice';
import { User } from 'entities/User';
import { Minus } from 'lucide-react';
import * as React from 'react';
import { useClientStatus } from '@/hooks/useClientStatus';

interface Props {
  invoice?: Omit<Invoice, 'actions_prices' | 'details_prices'> & {
    actions_prices: IActionState[];
    details_prices: IAutoPartState[];
    company: Company;
    owner: User;
    report: {
      id: string;
      mileage: number;
      user_id: string;
      user_name: string;
      user_surname: string;
      user_nickname: string;
      car: {
        id: string;
        brand: string;
        model: string;
        car_number: string;
        year: number;
        engine_capacity: number;
        vin: string;
      };
      customer: {
        id: string;
        name: string;
        fiscal_code: string;
      };
    };
  };
  code?: boolean;
}

export default function InvoicePrintTable({ invoice, code }: Props): React.ReactNode {
  const { data: currentUser } = useClientStatus();

  // Use report's user data if available, otherwise fallback to current authenticated user
  const masterName =
    invoice?.report?.user_surname && invoice?.report?.user_name
      ? `${invoice?.report?.user_surname} ${invoice?.report?.user_name}`
      : `${currentUser?.surname} ${currentUser?.name}`;


  return (
    <section className="h-screen w-full font-sans flex flex-col gap-16">
      <div className="w-full justify-center items-center text-center text-base font-bold">
        <h1>ACT № {invoice?.id}</h1>
        <h1>de indeplinire a lucrarilor</h1>
        <h1>{formatDate(invoice?.created_at as Date, 'ro-RO')}</h1>
      </div>

      <div>
        <h1 className="text-base font-semibold text-left">
          Prestator: <span>&#8222;</span>
          {invoice?.company?.autoservice}
          <span>&#8222; {invoice?.company?.fiscal_code}</span>
        </h1>
        <div className="flex">
          <h1 className="text-base font-semibold text-left">
            Beneficiar: <span>&#8222;</span>
            {invoice?.report?.customer?.name}
            <span>&#8222;</span> {invoice?.report?.customer?.fiscal_code}{' '}
          </h1>
          <h1 className="text-base font-semibold ml-2">
            {' | '}
            Nr.: {invoice?.report?.car?.car_number.replace(/([A-Za-z]+)(\d+)/, '$1 $2')}
          </h1>
        </div>
        <h1 className="text-base font-semibold text-left">
          Kilometraj: {invoice?.report.mileage}Km
        </h1>
        <h1 className="text-base font-semibold text-left">Mester: {masterName} </h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="border">No</TableHead>
            <TableHead className="border">Denumirea pieselor auto/lucrarilor</TableHead>
            <TableHead className="border">Cantitatea</TableHead>
            <TableHead className="border">Pret</TableHead>
            <TableHead className="border">Suma</TableHead>
            {code && <TableHead className="border">Cod piesa</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoice?.actions_prices?.map((action, _: number) => (
            <TableRow key={action.id}>
              <TableCell className="border">{_ + 1}</TableCell>
              <TableCell className="border">{action.name}</TableCell>
              <TableCell className="border">1</TableCell>
              <TableCell className="border">{action.price}</TableCell>
              <TableCell className="border">{action.price}</TableCell>
              {code && (
                <TableCell className="border">
                  <Minus />
                </TableCell>
              )}
            </TableRow>
          ))}
          {invoice?.details_prices?.map((detail, _: number) => (
            <TableRow key={detail.id}>
              <TableCell className="border">{invoice.actions_prices.length + _ + 1}</TableCell>
              <TableCell className="border">{detail.name}</TableCell>
              <TableCell className="border">{detail.quantity}</TableCell>
              <TableCell className="border">{detail.price}</TableCell>
              <TableCell className="border">{detail.price * detail.quantity}</TableCell>
              {code && (
                <TableCell className="border">{detail.code ? detail.code : <Minus />}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="border text-right">
              Total (inclusiv TVA)
            </TableCell>
            <TableCell colSpan={2} className="border">
              {invoice?.total?.toFixed(2)} MDL
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} className="border text-right">
              TVA
            </TableCell>
            <TableCell colSpan={2} className="border">
              {invoice?.tva?.toFixed(2)} MDL
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex flex-col gap-16">
        <p className="text-center italic">
          Lucrările (serviciile) sus menționate sunt efectuate integral și la timp. Beneficiarul nu
          are pretenții referitor la calitatea lucrărilor(serviciilor) efectuate.
        </p>
        <div className="flex justify-evenly">
          <p>Prestator___________________________</p>
          <p>Beneficiar___________________________</p>
        </div>
      </div>
    </section>
  );
}
