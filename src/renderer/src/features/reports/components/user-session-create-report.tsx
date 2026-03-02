import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useContext } from 'react';
import CreateReport from '../forms/CreateReport';
import { ReportContext } from '@/pages/Report/context/context';
import { Car } from 'entities/Car';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLetter';

export default function UserSessionCreateReport(): React.ReactNode {
  const { car, open, setOpen } = useContext(ReportContext);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[1200px]" onInteractOutside={(_) => _.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-normal text-2xl">
            {`${capitalizeFirstLetter(car?.brand as string)} ${capitalizeFirstLetter(car?.model as string)} (${car?.year})`}
          </DialogTitle>
        </DialogHeader>
        <CreateReport car={car as Car} invalidateKeys={[]} />
      </DialogContent>
    </Dialog>
  );
}
