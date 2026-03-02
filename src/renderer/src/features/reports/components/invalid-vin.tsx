import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

export default function InvalidVIN(): React.ReactNode {
  const { t } = useTranslation(['report'], { keyPrefix: 'car_not_found' });
  const [query, setQuery] = useSearchParams();

  return (
    <AlertDialog open={Boolean(query.get('not_found_resource'))} onOpenChange={() => setQuery({})}>
      <AlertDialogContent>
        <AlertDialogTitle className="text-xl font-normal text-foreground">
          {t('desc')}
        </AlertDialogTitle>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-2 border-foreground/25 w-1/2 text-base font-normal h-fit m-0 p-0 py-3 rounded-lg">
            {t('back')}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
