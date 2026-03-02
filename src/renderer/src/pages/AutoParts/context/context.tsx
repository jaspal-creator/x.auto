import Layout from '@/components/Layout';
import * as React from 'react';

export interface AutoPartsContextProps {
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AutoPartsContext = React.createContext<AutoPartsContextProps>(
  {} as AutoPartsContextProps
);

export default function AutoPartsLayout({
  children
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  return (
    <AutoPartsContext.Provider value={{ openSheet, setOpenSheet }}>
      <Layout>{children}</Layout>
    </AutoPartsContext.Provider>
  );
}
