import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Props {
  nextStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function StepOne({ nextStep }: Props): React.ReactNode {
  const { t } = useTranslation(['setup']);

  const handlNextStep = () => {
    nextStep((_) => _ + 1);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-14 w-2/5">
      <h1 className="text-primary font-normal text-6xl text-balance text-center select-none">
        {t('streamline')}
      </h1>
      <Button
        onClick={handlNextStep}
        variant={'outline'}
        className="select-none text-xl font-normal border-primary h-fit w-fit text-primary m-0 p-0 py-4 px-28 rounded-xl border-2"
      >
        {t('continue')}
      </Button>
    </div>
  );
}
