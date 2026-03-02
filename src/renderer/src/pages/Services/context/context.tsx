import Layout from '@/components/Layout';
import * as React from 'react';

export interface ServicesContextProps {
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ServicesContext = React.createContext<ServicesContextProps>(
  {} as ServicesContextProps
);

export default function ServicesLayout({
  children
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [openSheet, setOpenSheet] = React.useState<boolean>(false);
  return (
    <ServicesContext.Provider value={{ openSheet, setOpenSheet }}>
      <Layout>{children}</Layout>
    </ServicesContext.Provider>
  );
}
