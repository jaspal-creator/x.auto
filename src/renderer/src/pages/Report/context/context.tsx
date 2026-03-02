import Layout from '@/components/Layout';
import { Car } from 'entities/Car';
import * as React from 'react';

export interface ReportContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  car: Car | null;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
}

export const ReportContext = React.createContext<ReportContextProps>({} as ReportContextProps);

export default function ReportLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  const [open, setOpen] = React.useState<boolean>(false);
  const [car, setCar] = React.useState<Car | null>(null);
  return (
    <ReportContext.Provider value={{ open, setOpen, car, setCar }}>
      <Layout>{children}</Layout>
    </ReportContext.Provider>
  );
}
