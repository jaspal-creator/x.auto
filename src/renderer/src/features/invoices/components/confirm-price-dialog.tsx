import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { IActionState, IAutoPartState } from '@/pages/Invoices/context/context';
import { TriangleAlert } from 'lucide-react';
import React, { useContext } from 'react';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { LoadingSpinner } from '@/components/Loading';
// import { StatsContext } from '@/pages/Stats/context/context';
import { usePrintInvoice } from '../hooks/usePrintInvoice';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  /* eslint-disable no-unused-vars */
  setOpen: (_: boolean) => void;
  /* eslint-enable no-unused-vars */
  report: string;
  // stats?: boolean;
  invalidateKeys?: any[];
  reinvoice?: number;
  context: React.Context<any>;
}

export default function ConfirmPriceDialog({
  open,
  setOpen,
  report,
  // stats,
  invalidateKeys,
  reinvoice,
  context
}: Props): React.ReactNode {
  const { t } = useTranslation(['invoices'], { keyPrefix: 'confirm' });
  const { printInvoice } = usePrintInvoice();

  const contextValue = useContext(context);

  const {
    // actions,
    // autoparts,
    // setActions,
    // setAutoParts,
    confirm: { actions, autoparts },
    setConfirm,
    actions: directActions,
    autoparts: directAutoparts
  } = contextValue;

  // Use direct data if confirm data is empty (fallback mechanism)
  const effectiveActions = actions.length > 0 ? actions : directActions;
  const effectiveAutoparts = autoparts.length > 0 ? autoparts : directAutoparts;

  const total = React.useMemo(() => {
    const actionsTotal =
      effectiveActions?.reduce((prev, curr) => {
        return prev + (Number(curr.price) || 0);
      }, 0) || 0;

    const autopartsTotal =
      effectiveAutoparts?.reduce((prev, curr) => {
        const price = Number(curr.price) || 0;
        const quantity = Number(curr.quantity) || 0;
        return prev + price * quantity;
      }, 0) || 0;

    return actionsTotal + autopartsTotal;
  }, [effectiveActions, effectiveAutoparts]);
  const { run_invoicer, pending } = useCreateInvoice({
    id: report,
    invalidateKeys,
    cb: ({ id }) => printInvoice({ id }),
    cleanup: () => setConfirm({ actions: [], autoparts: [] }),
    reinvoice
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen={open}>
      <DialogContent className="min-w-[1200px]" onInteractOutside={(_) => _.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal">{t('title')}</DialogTitle>
        </DialogHeader>
        <section className="w-full flex flex-col gap-8">
          {/* WARNING */}
          <div className="w-full bg-[#BDCCE0] p-3 flex gap-3 border-2 border-[#DBEAFE] rounded-2xl items-start">
            <TriangleAlert className="size-6" />

            <div className="text-xl font-normal text-black text-balance leading-5 flex flex-col gap-2">
              <p>{t('desc_1')}</p>
              <p>{t('desc_2')}</p>
            </div>
          </div>

          {/* TABLE */}
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xl font-medium text-foreground/50">
                    {t('table.no')}
                  </TableHead>
                  <TableHead className="text-xl font-medium text-foreground/50">
                    {t('table.details_actions')}
                  </TableHead>
                  <TableHead className="text-xl font-medium text-foreground/50">
                    {t('table.qntty')}
                  </TableHead>
                  <TableHead className="text-xl font-medium text-foreground/50">
                    {t('table.price')}
                  </TableHead>
                  <TableHead className="text-xl font-medium text-foreground/50">
                    {t('table.total')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {effectiveActions?.map((action: IActionState, _: number) => (
                  <TableRow key={action.id}>
                    <TableCell className="text-base font-normal text-black py-4">{_ + 1}</TableCell>
                    <TableCell className="text-base font-normal text-black py-4">
                      {action.name}
                    </TableCell>
                    <TableCell className="text-base font-normal text-black py-4">1</TableCell>
                    <TableCell className="text-base font-normal text-black py-4">
                      {Number(action.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-base font-normal text-black py-4">
                      {Number(action.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {effectiveAutoparts?.map((part: IAutoPartState, _: number) => (
                  <TableRow key={part.id}>
                    <TableCell className="text-base font-normal text-black py-4">
                      {effectiveActions.length + _ + 1}
                    </TableCell>
                    <TableCell className="text-base font-normal text-black py-4">
                      {part.name}
                    </TableCell>
                    <TableCell className="text-base font-normal text-black py-4">
                      {Number(part.quantity)}
                    </TableCell>
                    <TableCell className="text-base font-normal text-black py-4">
                      {Number(part.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-base font-normal text-black py-4">
                      {(Number(part.price) * Number(part.quantity)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-lg font-medium text-black py-4">
                    {t('table.total_tva')}
                  </TableCell>
                  <TableCell className="text-lg font-medium text-black py-4">
                    {total.toFixed(2).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>

          {/* CANCEL & CONFIRM */}
          <div className="flex gap-3 justify-end">
            <DialogClose
              onClick={() => {
                // setActions([]);
                // setAutoParts([]);
                setConfirm({ actions: [], autoparts: [] });
              }}
              className="w-24 font-normal text-base h-fit m-0 p-0 rounded-lg py-2 border text-primary border-primary"
            >
              {t('table.cancel')}
            </DialogClose>
            <Button
              disabled={pending}
              className="w-24 font-normal text-base h-fit m-0 p-0 rounded-lg py-2"
              onClick={() => {
                run_invoicer({ actions: effectiveActions, autoparts: effectiveAutoparts, total });
              }}
            >
              {pending ? <LoadingSpinner /> : `Confirm`}
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
