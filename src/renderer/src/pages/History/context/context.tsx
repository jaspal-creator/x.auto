import Layout from '@/components/Layout';
import * as React from 'react';

export interface HistoryContextProps {
  //   openSheet: boolean;
  //   setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HistoryContext = React.createContext<HistoryContextProps>({} as HistoryContextProps);

export default function HistoryLayout({
  children
}: {
  children: React.ReactNode;
}): React.ReactNode {
  //   const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  return (
    <HistoryContext.Provider value={{}}>
      <Layout>{children}</Layout>
    </HistoryContext.Provider>
  );
}
