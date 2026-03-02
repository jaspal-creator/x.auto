import * as React from 'react';
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { DollarSign, FolderKanban, User } from 'lucide-react';
import { EInvoiceQueryStatus } from 'interfaces/invoice.query.status';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { LoadingSpinner } from '../Loading';
import { useTranslation } from 'react-i18next';

interface Props {
  loading: boolean;
  /* eslint-disable */
  onDownload: ({
    client,
    manager,
    payment,
    full
  }: Partial<{ client: boolean; manager: boolean; payment: boolean; full: boolean }>) => void;
  /* eslint-enable */
}

export default function DownloadItem({ onDownload, loading }: Props): React.ReactNode {
  const { t } = useTranslation(['download']);
  const [value, setValue] = React.useState<
    (
      | EInvoiceQueryStatus.CLIENT
      | EInvoiceQueryStatus.MANAGER
      | EInvoiceQueryStatus.PAYMENT
      | EInvoiceQueryStatus.FULL
    )[]
  >([]);
  React.useEffect(
    () =>
      setValue([
        EInvoiceQueryStatus.CLIENT,
        EInvoiceQueryStatus.MANAGER,
        EInvoiceQueryStatus.PAYMENT
      ]),
    []
  );

  return (
    <DialogContent className="h-fit" onInteractOutside={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle className="font-normal text-2xl">{t('opts')}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col w-full gap-2">
        <div className="w-full justify-start flex items-center gap-4">
          <Checkbox
            disabled={loading}
            onCheckedChange={(e) =>
              e
                ? setValue((_) => [..._, EInvoiceQueryStatus.CLIENT])
                : setValue((_) => _.filter((__) => __ !== EInvoiceQueryStatus.CLIENT))
            }
            value={EInvoiceQueryStatus.CLIENT}
            defaultChecked={value.includes(EInvoiceQueryStatus.CLIENT)}
          />
          <div className="flex items-center gap-1">
            <User className="aspect-square size-5" />
            <h1 className="font-normal text-lg">{t('client')}</h1>
          </div>
        </div>
        <div className="w-full justify-start flex items-center gap-4">
          <Checkbox
            disabled={loading}
            onCheckedChange={(e) =>
              e
                ? setValue((_) => [..._, EInvoiceQueryStatus.MANAGER])
                : setValue((_) => _.filter((__) => __ !== EInvoiceQueryStatus.MANAGER))
            }
            value={EInvoiceQueryStatus.MANAGER}
            defaultChecked={value.includes(EInvoiceQueryStatus.MANAGER)}
          />
          <div className="flex items-center gap-1">
            <FolderKanban className="aspect-square size-5" />
            <h1 className="font-normal text-lg">{t('manager')}</h1>
          </div>
        </div>
        <div className="w-full justify-start flex items-center gap-4">
          <Checkbox
            disabled={loading}
            onCheckedChange={(e) =>
              e
                ? setValue((_) => [..._, EInvoiceQueryStatus.PAYMENT])
                : setValue((_) => _.filter((__) => __ !== EInvoiceQueryStatus.PAYMENT))
            }
            value={EInvoiceQueryStatus.PAYMENT}
            defaultChecked={value.includes(EInvoiceQueryStatus.PAYMENT)}
          />
          <div className="flex items-center gap-1">
            <DollarSign className="aspect-square size-5" />
            <h1 className="font-normal text-lg">{t('payment')}</h1>
          </div>
        </div>
      </div>
      <DialogFooter className="w-full">
        <DialogClose
          disabled={loading}
          className={`${value.length > 0 ? 'w-1/2' : 'w-full'} border-2 border-primary rounded-lg h-fit text-lg font-normal py-1 hover:bg-primary/10`}
        >
          {t('close')}
        </DialogClose>
        {value.length > 0 && (
          <Button
            disabled={loading}
            className="w-1/2 border-2 border-primary rounded-lg h-fit text-lg font-normal py-1 "
            onClick={() => {
              value.includes(EInvoiceQueryStatus.CLIENT) &&
              value.includes(EInvoiceQueryStatus.MANAGER) &&
              value.includes(EInvoiceQueryStatus.PAYMENT)
                ? onDownload({ full: true })
                : onDownload({
                    client: value.includes(EInvoiceQueryStatus.CLIENT),
                    manager: value.includes(EInvoiceQueryStatus.MANAGER),
                    payment: value.includes(EInvoiceQueryStatus.PAYMENT)
                  });
            }}
          >
            {loading ? <LoadingSpinner /> : t('download')}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}
