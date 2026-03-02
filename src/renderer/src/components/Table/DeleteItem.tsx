import * as React from 'react';
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '../ui/alert-dialog';
import { useTranslation } from 'react-i18next';

interface Props {
  deleteCallback: () => void;
}

export default function DeleteItem({ deleteCallback }: Props): React.ReactNode {
  const { t } = useTranslation(['delete_item']);
  return (
    <AlertDialogContent className="w-fit">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-xl font-normal text-foreground">
          {t('title')}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter className="w-full flex gap-3">
        <AlertDialogCancel className="bg-transparent border-2 border-foreground/25 w-1/2 text-base font-normal h-fit m-0 p-0 py-3 rounded-lg">
          {t('back')}
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={deleteCallback}
          className="bg-destructive border-2 border-destructive w-1/2 text-base font-normal h-fit m-0 p-0 py-3 rounded-lg hover:bg-destructive/75 text-card"
        >
          {t('delete')}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
