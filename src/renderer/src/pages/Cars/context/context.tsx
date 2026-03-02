import Layout from '@/components/Layout';
import { InvoicesContextProps } from '@/pages/Invoices/context/context';
import { useInvoiceContextManager } from '@/pages/Invoices/hooks/useInvoiceContextManager';
import * as React from 'react';

export interface CarsContextProps extends InvoicesContextProps {
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CarsContext = React.createContext<CarsContextProps>({} as CarsContextProps);

export default function CarsLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  const { actions, autoparts, setActions, setAutoParts, confirm, setConfirm } =
    useInvoiceContextManager();
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  return (
    <CarsContext.Provider
      value={{
        openSheet,
        setOpenSheet,
        actions,
        autoparts,
        setActions,
        setAutoParts,
        confirm,
        setConfirm
      }}
    >
      <Layout>{children}</Layout>
    </CarsContext.Provider>
  );
}
