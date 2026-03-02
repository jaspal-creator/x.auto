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

interface Props {
  invoice?: Omit<Invoice, 'actions_prices' | 'details_prices'> & {
    actions_prices: IActionState[];
    details_prices: IAutoPartState[];
    company: Company;
    owner: User;
  };
}

export default function PaymentTable({ invoice }: Props): React.ReactNode {
  return (
    <section className="h-screen w-full font-sans flex flex-col gap-16">
      <div className="w-full justify-center items-center text-center text-base font-bold">
        <h1>FACTURA № {invoice?.id}</h1>
      </div>

      <div>
        <h1 className="text-base font-semibold text-left">
          {formatDate(invoice?.created_at as Date, 'ro-RO')}
        </h1>
        <h1 className="text-base font-semibold text-left">{invoice?.company.bank}</h1>
        <h1 className="text-base font-semibold text-left">{invoice?.company.autoservice}</h1>
        <h1 className="text-base font-semibold text-left">{invoice?.company.iban}</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="border">Nr</TableHead>
            <TableHead className="border">Denumirea Marfurilor</TableHead>
            <TableHead className="border">U.M</TableHead>
            <TableHead className="border">Cant.</TableHead>
            <TableHead className="border">Pret unitar</TableHead>
            <TableHead className="border">Valoarea</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border">1</TableCell>
            <TableCell className="border">Servicii reparare auto</TableCell>
            <TableCell className="border">buc.</TableCell>
            <TableCell className="border">1</TableCell>
            <TableCell className="border">{invoice?.total?.toFixed(2)}</TableCell>
            <TableCell className="border">{invoice?.total?.toFixed(2)} MDL</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right border">
              Valoare TVA (20%)
            </TableCell>
            <TableCell className="border">{invoice?.tva?.toFixed(2)} MDL</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="text-right border">
              Total (inclusiv TVA)
            </TableCell>
            <TableCell className="border">{invoice?.total?.toFixed(2)} MDL</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div>
        <h1 className='"text-base font-normal italic text-left'>
          Conducatorul: {invoice?.owner.surname} {invoice?.owner.name}
        </h1>
      </div>
    </section>
  );
}
