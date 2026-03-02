import { ArrowLeft, RotateCcw } from 'lucide-react';
import LangSelect from './LangSelect';
import SearchBar from './SearchBar';
import SortBtns from './SortBtns';
import * as React from 'react';
import CreateTriggerBtn from './CreateTriggerBtn';
import { ESort } from 'interfaces/query.filtration';
import { useNavigate } from 'react-router';

/* eslint-disable */
interface Props<T> {
  title: string;
  create?: {
    btn: string;
    form: React.ReactNode;
    context: React.Context<any>;
    open: string;
    setOpen: string;
  };
  search: (val: string) => void;
  sort?: (sort: ESort) => void;
  goBack?: boolean;
  onCategoryChange?: (_: T) => void;
  defaultCategory?: T;
  categories?: T[];
}
/* eslint-enable */

export default function Utilities<T = any>({
  title,
  create,
  search,
  sort,
  goBack,
  onCategoryChange,
  defaultCategory,
  categories
}: Props<T>): React.ReactNode {
  const redirect = useNavigate();
  return (
    <section className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 w-1/4">
          {goBack && (
            <div
              className="p-1 rounded-md aspect-square hover:bg-foreground/10"
              // @ts-ignore: replace url
              onClick={() => {
                new Array(3).fill(null).forEach(() => redirect(-1));
              }}
            >
              <ArrowLeft className="size-6" />
            </div>
          )}
          <div
            className="p-1 rounded-md aspect-square hover:bg-foreground/10"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="size-6" />
          </div>

          <h1 className="text-3xl font-normal">{title}</h1>
        </div>
        <SearchBar<T>
          search={search}
          categories={categories as T[]}
          onCategoryChange={onCategoryChange}
          defaultCategory={defaultCategory}
        />
        <LangSelect />
      </div>
      <div className="flex justify-between">
        {create?.btn && create.form && (
          <CreateTriggerBtn
            title={create.btn}
            context={create.context}
            open={create.open}
            setOpen={create.setOpen}
          >
            {create.form}
          </CreateTriggerBtn>
        )}
        {sort && (
          <div className="w-full flex justify-end">
            <SortBtns sort={sort} />
          </div>
        )}
      </div>
    </section>
  );
}
