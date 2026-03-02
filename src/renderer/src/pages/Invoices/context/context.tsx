import Layout from '@/components/Layout';
import * as React from 'react';
import { useInvoiceContextManager } from '../hooks/useInvoiceContextManager';

export interface IActionState {
  id: string;
  name: string;
  price: number;
}

export interface IAutoPartState {
  id: string;
  name: string;
  price: number;
  quantity: number;
  code: string;
}

export interface InvoicesContextProps {
  actions: [] | IActionState[];
  setActions: React.Dispatch<React.SetStateAction<[] | IActionState[]>>;

  autoparts: [] | IAutoPartState[];
  setAutoParts: React.Dispatch<React.SetStateAction<[] | IAutoPartState[]>>;

  confirm: { actions: [] | IActionState[]; autoparts: [] | IAutoPartState[] };
  setConfirm: React.Dispatch<
    React.SetStateAction<{ actions: [] | IActionState[]; autoparts: [] | IAutoPartState[] }>
  >;
}

export const InvoicesContext = React.createContext<InvoicesContextProps>(
  {} as InvoicesContextProps
);

export default function InvoicesLayout({
  children
}: {
  children: React.ReactNode;
}): React.ReactNode {
  // const [actions, setActions] = React.useState<[] | IActionState[]>([]);
  // const [autoparts, setAutoParts] = React.useState<[] | IAutoPartState[]>([]);
  // const [confirm, setConfirm] = React.useState<{
  //   actions: [] | IActionState[];
  //   autoparts: [] | IAutoPartState[];
  // }>({ actions: [], autoparts: [] });
  const { actions, autoparts, setActions, setAutoParts, confirm, setConfirm } =
    useInvoiceContextManager();

  return (
    <InvoicesContext.Provider
      value={{ actions, autoparts, setActions, setAutoParts, confirm, setConfirm }}
    >
      <Layout>{children}</Layout>
    </InvoicesContext.Provider>
  );
}
