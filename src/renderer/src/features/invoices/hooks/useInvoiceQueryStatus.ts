import { EInvoiceQueryStatus } from 'interfaces/invoice.query.status';
import { useSearchParams } from 'react-router';

export const useInvoiceQueryStatus = (): {
  client: boolean;
  manager: boolean;
  payment: boolean;
  all: boolean;
} => {
  const [q] = useSearchParams();

  return {
    client: q.get(EInvoiceQueryStatus.CLIENT) === 'true' ? true : false,
    manager: q.get(EInvoiceQueryStatus.MANAGER) === 'true' ? true : false,
    payment: q.get(EInvoiceQueryStatus.PAYMENT) === 'true' ? true : false,
    all: q.get(EInvoiceQueryStatus.FULL) === 'true' ? true : false
  };
};
