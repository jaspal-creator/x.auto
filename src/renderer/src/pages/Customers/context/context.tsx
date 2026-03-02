import Layout from '@/components/Layout';
import { InvoicesContextProps } from '@/pages/Invoices/context/context';
import { useInvoiceContextManager } from '@/pages/Invoices/hooks/useInvoiceContextManager';
import * as React from 'react';

export interface CustomersContextProps extends InvoicesContextProps {
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomersContext = React.createContext<CustomersContextProps>(
  {} as CustomersContextProps
);

export default function CustomersLayout({
  children
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  const { actions, autoparts, setActions, setAutoParts, confirm, setConfirm } =
    useInvoiceContextManager();
  return (
    <CustomersContext.Provider
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
    </CustomersContext.Provider>
  );
}
