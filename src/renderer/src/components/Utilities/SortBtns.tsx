import * as React from 'react';
import { Button } from '../ui/button';
import { ESort } from 'interfaces/query.filtration';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

/* eslint-disable */
interface Props {
  sort: (sort: ESort) => void;
}
/* eslint-enable */

export default function SortBtns({ sort }: Props): React.ReactNode {
  const { t } = useTranslation(['utils'], { keyPrefix: 'sort' });
  const [_] = useSearchParams();
  return (
    <div className="flex gap-3">
      <Button
        onClick={() => sort(ESort.RECENT)}
        variant={'outline'}
        className={`border-foreground/25 border-2 text-foreground hover:border-primary hover:bg-primary hover:text-card font-normal text-base ${_.get('sort') === ESort.RECENT && 'bg-primary border-primary text-card'}`}
      >
        {t('r')}
      </Button>
      <Button
        onClick={() => sort(ESort.OLDER)}
        variant={'outline'}
        className={`border-foreground/25 border-2 text-foreground hover:border-primary hover:bg-primary hover:text-card font-normal text-base ${_.get('sort') === ESort.OLDER && 'bg-primary border-primary text-card'}`}
      >
        {t('o')}
      </Button>
      <Button
        onClick={() => sort(ESort.AZ)}
        variant={'outline'}
        className={`border-foreground/25 border-2 text-foreground hover:border-primary hover:bg-primary hover:text-card font-normal text-base ${_.get('sort') === ESort.AZ && 'bg-primary border-primary text-card'}`}
      >
        {t('az')}
      </Button>
      <Button
        onClick={() => sort(ESort.ZA)}
        variant={'outline'}
        className={`border-foreground/25 border-2 text-foreground hover:border-primary hover:bg-primary hover:text-card font-normal text-base ${_.get('sort') === ESort.ZA && 'bg-primary border-primary text-card'}`}
      >
        {t('za')}
      </Button>
    </div>
  );
}
