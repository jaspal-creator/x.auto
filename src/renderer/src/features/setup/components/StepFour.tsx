import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function StepFour(): React.ReactNode {
  const { t } = useTranslation(['setup']);
  const redirect = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center gap-14 w-2/5">
      <h1 className="text-primary font-normal text-6xl text-balance text-center">{t('success')}</h1>
      <Button
        onClick={() => redirect('/auth')}
        variant={'outline'}
        className="text-xl font-normal border-primary h-fit w-fit text-primary m-0 p-0 py-4 px-28 rounded-xl border-2"
      >
        {t('continue_app')}
      </Button>
    </div>
  );
}
