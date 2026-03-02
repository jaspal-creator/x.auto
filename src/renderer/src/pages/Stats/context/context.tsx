import Layout from '@/components/Layout';
import { InvoicesContextProps } from '@/pages/Invoices/context/context';
import { useInvoiceContextManager } from '@/pages/Invoices/hooks/useInvoiceContextManager';
import * as React from 'react';

// export interface StatsContextProps {}

export const StatsContext = React.createContext<InvoicesContextProps>({} as InvoicesContextProps);

export default function StatsLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  // const [actions, setActions] = React.useState<[] | IActionState[]>([]);
  // const [autoparts, setAutoParts] = React.useState<[] | IAutoPartState[]>([]);
  const { confirm, setConfirm, actions, setActions, autoparts, setAutoParts } =
    useInvoiceContextManager();
  return (
    <StatsContext.Provider
      value={{ actions, autoparts, setActions, setAutoParts, confirm, setConfirm }}
    >
      <Layout>{children}</Layout>
    </StatsContext.Provider>
  );
}
