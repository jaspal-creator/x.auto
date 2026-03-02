import Layout from '@/components/Layout';
import { InvoicesContextProps } from '@/pages/Invoices/context/context';
import { useInvoiceContextManager } from '@/pages/Invoices/hooks/useInvoiceContextManager';
import * as React from 'react';

export interface WorkersContextProps extends InvoicesContextProps {
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
  // openUpdateSheet: boolean;
  // setOpenUpdateSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WorkersContext = React.createContext<WorkersContextProps>({} as WorkersContextProps);

export default function WorkersLayout({
  children
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  const { actions, autoparts, setActions, setAutoParts, confirm, setConfirm } =
    useInvoiceContextManager();
  // const [openUpdateSheet, setOpenUpdateSheet] = React.useState<boolean>(false);
  return (
    <WorkersContext.Provider
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
    </WorkersContext.Provider>
  );
}
