import React, { useContext } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

interface Props {
  children: React.ReactNode;
  title: string;
  context: React.Context<any>;
  open: string;
  setOpen: string;
}

export default function CreateTriggerBtn({
  children,
  title,
  context,
  open,
  setOpen
}: Props): React.ReactNode {
  const funcs = useContext(context);
  return (
    <Sheet open={funcs[open]} onOpenChange={funcs[setOpen]}>
      <SheetTrigger asChild>
        <Button
          variant={'outline'}
          className="border-primary border-2 text-primary font-normal text-base px-10"
        >
          {title}
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[600px]">{children}</SheetContent>
    </Sheet>
  );
}
