import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { extract } from '@/lib/extract';
import {
  ArrowDownToLine,
  ClipboardPlus,
  DollarSign,
  Flag,
  History,
  Minus,
  PenLine,
  Trash2
} from 'lucide-react';
import { LoadingSpinner } from '../Loading';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import DeleteItem from './DeleteItem';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Link } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from '../ui/use-toast';
import { useOpenPreview } from './hooks/useOpenPreview';
import DownloadItem from './DownloadItem';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ToastType {
  title: string;
  description: string;
}

/* eslint-disable */
interface Props<T = any> {
  // LOADING STATE
  loadingState?: boolean;
  // DISPLAY DATA
  tableHeader: string[];
  tableContent: T[];
  tableRow: (_: T) => (keyof T)[] | (keyof T)[];
  // DEFINE ACTIONS
  tableActions: ('UPDATE' | 'DELETE' | 'PREVIEW' | 'REPORT' | 'DOWNLOAD' | 'BILL' | 'HOVER')[];
  // DELETE ACTION
  deleteAction?: (_: T) => void;
  // UPDATE ACTION
  updateAction?: {
    type: 'SHEET' | 'DIALOG';
    form?: (_: T) => React.ReactNode;
    dialog?: {
      title: (_: T) => string;
      form: (_: T) => React.ReactNode;
    };
    condition?: (_: T) => boolean;
    disabledMessage?: {
      title: string;
      message: string;
    };
    getDisabledInfo?: (_: T) => {
      title: string;
      message: string;
      type: 'expired' | 'invoiced' | 'default';
    };
  };
  // PREVIEW ACTION
  previewAction?: {
    type: 'REDIRECTION' | 'MODAL';
    href?: (_: T) => string;
    modal?: {
      title: (_: T) => string;
      content: (_: T) => React.ReactNode;
      confirm?: ({
        open,
        setOpen,
        report,
        reinvoice
      }: {
        open: boolean;
        report: string;
        setOpen: () => void;
        reinvoice?: number;
      }) => React.ReactNode;
    };
  };
  // REPORT
  reportAction?: {
    condition: (_: T) => boolean;
    conditionToast: (_: T) => Partial<ToastType>;
    title: (_: T) => string;
    content: (_: T) => React.ReactNode;
  };
  // DOWNLOAD PDF
  downloadAction?: {
    condition: (_: T) => boolean;
    action: (
      _: T,
      {
        full,
        client,
        manager,
        payment
      }: Partial<{ full: boolean; client: boolean; manager: boolean; payment: boolean }>
    ) => void;
    loading: boolean;
  };
  // BILL ACTION
  billAction?: {
    condition: (_: T) => boolean;
  };
  // HOVER ACTION
  hoverAction?: {
    condition: (_: T) => boolean;
    content: (_: T) => React.ReactNode;
  };
}
/* eslint-enable */

export default function MainTable<T = any>({
  loadingState,
  tableHeader,
  tableContent,
  tableRow,
  tableActions,
  deleteAction,
  updateAction,
  previewAction,
  reportAction,
  downloadAction,
  billAction,
  hoverAction
}: Props<T>): React.ReactNode {
  const { open, close, active, query } = useOpenPreview();

  // Render confirmation dialog within the component tree to preserve context
  const confirmDialog =
    query.get('confirm') && previewAction?.modal?.confirm
      ? previewAction.modal.confirm({
          open: Boolean(query.get('confirm')),
          setOpen: () => close({ confirm: true }),
          report: query.get('confirm') as string,
          reinvoice: parseInt(query.get('reinvoice') as string)
        })
      : null;

  return (
    <TooltipProvider>
      <div className="h-full mt-5">
        {loadingState ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeader.map((text, _: number) => (
                  <TableHead key={_} className="text-xl font-normal text-foreground/50 h-fit py-5">
                    {text}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tableContent as [])?.map((content: T & { id: string }) => (
                <Dialog
                  key={content.id}
                  open={content.id === active && Boolean(query.get('preview'))}
                  onOpenChange={(_) => (_ ? () => {} : close({}))}
                >
                  <DialogTrigger asChild>
                    <TableRow>
                      {(typeof tableRow === 'function'
                        ? (tableRow(content) as [])
                        : (tableRow as [])
                      )?.map((row: string) => (
                        <TableCell
                          onClick={() => open(content.id)}
                          key={row}
                          className="text-xl font-normal text-foreground h-fit py-5"
                        >
                          {row.split('.').length === 1 ? (
                            content[row] ? (
                              content[row] instanceof Date ? (
                                content[row].toLocaleDateString('ro')
                              ) : (
                                content[row]
                              )
                            ) : (
                              <Minus />
                            )
                          ) : extract(content, row) ? (
                            extract(content, row)
                          ) : (
                            <Minus />
                          )}
                        </TableCell>
                      ))}

                      {/* Available Action */}
                      <TableCell className="flex justify-start items-center h-fit py-5 gap-4">
                        {/* Handle Bill Action */}
                        {tableActions.includes('BILL') &&
                          billAction?.condition(content as T) &&
                          previewAction?.type === 'MODAL' &&
                          previewAction.modal?.content && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <DollarSign className="p-1 aspect-square text-primary size-7 hover:bg-foreground/10 rounded-md" />
                              </DialogTrigger>
                              <DialogContent
                                className="min-w-[1200px]"
                                onInteractOutside={(_) => _.preventDefault()}
                              >
                                <DialogTitle className="font-normal text-2xl">
                                  {previewAction.modal.title(content) || ''}
                                </DialogTitle>
                                {previewAction.modal.content(content)}
                              </DialogContent>
                            </Dialog>
                          )}

                        {/* Handle Download Action */}
                        {tableActions.includes('DOWNLOAD') &&
                          downloadAction?.condition(content as T) && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <ArrowDownToLine className="p-1 aspect-square text-primary size-7 hover:bg-foreground/10 rounded-md" />
                              </DialogTrigger>
                              <DownloadItem
                                loading={downloadAction.loading as boolean}
                                onDownload={(opts) => downloadAction.action(content as T, opts)}
                              />
                            </Dialog>
                          )}

                        {/* Handle Update Action */}
                        {tableActions.includes('UPDATE') && updateAction && (
                          <>
                            {updateAction.condition && !updateAction.condition(content as T) ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  {(() => {
                                    const disabledInfo = updateAction.getDisabledInfo?.(
                                      content as T
                                    );
                                    const isExpired = disabledInfo?.type === 'expired';
                                    const isInvoiced = disabledInfo?.type === 'invoiced';

                                    if (isExpired) {
                                      return (
                                        <PenLine className="p-1 aspect-square text-orange-500 size-7 cursor-not-allowed rounded-md bg-orange-50" />
                                      );
                                    } else if (isInvoiced) {
                                      return (
                                        <PenLine className="p-1 aspect-square text-blue-500 size-7 cursor-not-allowed rounded-md bg-blue-50" />
                                      );
                                    } else {
                                      return (
                                        <PenLine className="p-1 aspect-square text-foreground/30 size-7 cursor-not-allowed rounded-md" />
                                      );
                                    }
                                  })()}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-center">
                                    <p className="font-medium">
                                      {updateAction.getDisabledInfo?.(content as T)?.title ||
                                        updateAction.disabledMessage?.title}
                                    </p>
                                    <p className="text-sm">
                                      {updateAction.getDisabledInfo?.(content as T)?.message ||
                                        updateAction.disabledMessage?.message}
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <>
                                {updateAction.type === 'SHEET' && (
                                  <Sheet>
                                    <SheetTrigger asChild>
                                      <PenLine className="p-1 aspect-square text-foreground size-7 hover:bg-foreground/10 rounded-md" />
                                    </SheetTrigger>
                                    <SheetContent className="min-w-[600px]">
                                      {updateAction.form && updateAction.form(content as T)}
                                    </SheetContent>
                                  </Sheet>
                                )}
                                {updateAction.type === 'DIALOG' && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <PenLine className="p-1 aspect-square text-foreground size-7 hover:bg-foreground/10 rounded-md" />
                                    </DialogTrigger>
                                    <DialogContent
                                      className="min-w-[1200px]"
                                      onInteractOutside={(_) => _.preventDefault()}
                                    >
                                      <DialogHeader>
                                        <DialogTitle className="font-normal text-2xl">
                                          {updateAction.dialog?.title(content)}
                                        </DialogTitle>
                                      </DialogHeader>
                                      {updateAction.dialog?.form(content)}
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </>
                            )}
                          </>
                        )}

                        {/* Handle Preview Row Action */}
                        {tableActions.includes('PREVIEW') && (
                          <>
                            {previewAction?.type === 'REDIRECTION' && previewAction.href && (
                              <Link to={previewAction.href(content)}>
                                <History className="p-1 aspect-square text-foreground size-7 hover:bg-foreground/10 rounded-md" />
                              </Link>
                            )}
                          </>
                        )}

                        {/* Handle Delete Action */}
                        {tableActions.includes('DELETE') && deleteAction && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Trash2 className="p-1 aspect-square text-destructive size-7 hover:bg-foreground/10 rounded-md" />
                            </AlertDialogTrigger>
                            <DeleteItem deleteCallback={() => deleteAction(content)} />
                          </AlertDialog>
                        )}

                        {/* Handle Report Action */}
                        {tableActions.includes('REPORT') && reportAction?.condition && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <ClipboardPlus
                                className="p-1 aspect-square text-primary size-7 hover:bg-foreground/10 rounded-md"
                                onClick={() => {
                                  !reportAction?.condition(content) &&
                                    toast({
                                      variant: 'default',
                                      ...reportAction?.conditionToast(content)
                                    });
                                }}
                              />
                            </DialogTrigger>
                            {reportAction?.condition(content) && (
                              <DialogContent
                                className="min-w-[1200px]"
                                onInteractOutside={(_) => _.preventDefault()}
                              >
                                <DialogHeader>
                                  <DialogTitle className="font-normal text-2xl">
                                    {reportAction.title(content)}
                                  </DialogTitle>
                                </DialogHeader>
                                {reportAction.content(content)}
                              </DialogContent>
                            )}
                          </Dialog>
                        )}

                        {/* Handle Hover Action */}
                        {tableActions.includes('HOVER') && hoverAction?.condition(content) && (
                          <HoverCard>
                            <HoverCardTrigger>
                              <Flag className="p-1 aspect-square bg-green-500 text-background size-7 hover:bg-green-400 rounded-md" />
                            </HoverCardTrigger>
                            <HoverCardContent>{hoverAction.content(content)}</HoverCardContent>
                          </HoverCard>
                        )}
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  {previewAction?.type === 'MODAL' && previewAction.modal?.content && (
                    <DialogContent
                      className="min-w-[1200px]"
                      onInteractOutside={(_) => _.preventDefault()}
                    >
                      <DialogTitle className="font-normal text-2xl">
                        {previewAction.modal.title(content) || ''}
                      </DialogTitle>
                      {previewAction.modal.content(content)}
                    </DialogContent>
                  )}
                </Dialog>
              ))}
            </TableBody>
          </Table>
        )}
        {/* Render confirmation dialog within context */}
        {confirmDialog}
      </div>
    </TooltipProvider>
  );
}
