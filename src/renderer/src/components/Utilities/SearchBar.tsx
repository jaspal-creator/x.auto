import * as React from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from './hooks/useDebounce';
import { useSearchParams } from 'react-router';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useTranslation } from 'react-i18next';

/* eslint-disable */
interface Props<T> {
  search: (val: string) => void;
  onCategoryChange?: (_: T) => void;
  defaultCategory?: T;
  categories?: T[];
}
/* eslint-enable */

export default function SearchBar<T = any>({
  search,
  onCategoryChange,
  defaultCategory,
  categories
}: Props<T>): React.ReactNode {
  const { t } = useTranslation(['utils']);
  const [_] = useSearchParams();
  const { debounce, pending } = useDebounce(1500);

  return (
    <div className="w-1/2 rounded-lg border-2 border-foreground/25 flex py-3 px-3 items-center gap-3">
      <Search className="text-foreground/50 size-5" />
      <Input
        defaultValue={_.get('search') || ''}
        onChange={(e) => debounce(() => search(e.target.value as string))}
        type="text"
        placeholder={t('search')}
        className="placeholder:text-base placeholder:font-normal placeholder:text-foreground/50 w-full h-fit p-0 m-0 rounded-none text-base font-normal outline-none border-none focus-visible:ring-0 shadow-none"
      />
      {pending && (
        <div className="flex gap-2 items-center h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin size-4 text-foreground/50"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}
      {onCategoryChange && (
        <div className="h-full border-l-2 w-32 flex justify-center pl-4">
          <Select
            onValueChange={(_) => onCategoryChange(_ as T)}
            defaultValue={defaultCategory as string}
          >
            <SelectTrigger className="p-0 m-0 w-fit h-fit border-none shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:outline-none rounded-none text-foreground/50 font-semibold">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('categories.category')}</SelectLabel>
                {categories?.map((_: any, __: number) => (
                  <SelectItem key={__} value={_ as string}>
                    {_ === 'CUSTOMER'
                      ? t('categories.customer')
                      : _ === 'NUMBER'
                        ? t('categories.number')
                        : _ === 'VIN'
                          ? t('categories.vin')
                          : _ === 'MASTER'
                            ? t('categories.master')
                            : _ === 'MARK'
                              ? t('categories.mark')
                              : _ === 'MODEL'
                                ? t('categories.model')
                                : ''}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
