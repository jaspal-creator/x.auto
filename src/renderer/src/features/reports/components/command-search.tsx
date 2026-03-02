import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Toggle } from '@/components/ui/toggle';
import * as React from 'react';
import { List } from 'react-virtualized';
import { useDebounce } from '../hooks/useDebounce';
import { LoadingSpinner } from '@/components/Loading';
import { extract } from '@/lib/extract';
import { useTranslation } from 'react-i18next';

/* eslint-disable */
interface Props<T = any> {
  placeholder: string;
  open: boolean;
  content?: T[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSearch: (_: string) => void;
  create: {
    label: string;
    component: React.ReactNode;
  };
  loading?: boolean;
  onSelect?: (_?: T) => void | boolean;
  isPressed: (id?: string) => boolean;
}
/* eslint-enable */

export default function CommandSearch<T = any>({
  placeholder,
  open,
  setOpen,
  create,
  content,
  onSearch,
  loading,
  onSelect,
  isPressed
}: Props<T>): React.ReactNode {
  const { t } = useTranslation(['report'], { keyPrefix: 'item' });
  const { debounce, pending } = useDebounce(1000);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
      <CommandInput
        placeholder={placeholder}
        className="text-base text-foreground"
        onValueChange={(e) => debounce(() => onSearch(e))}
      />
      <Accordion type="single" collapsible className="w-full px-6">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-primary text-base font-normal">
            {create.label}
          </AccordionTrigger>
          <AccordionContent>{create.component}</AccordionContent>
        </AccordionItem>
      </Accordion>
      <CommandList className="overflow-y-hidden">
        {loading || pending ? (
          <div className="flex justify-center items-center p-10">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {content?.length !== 0 ? (
              <List
                width={510}
                height={Number(content?.length) === 0 ? 0 : 300}
                rowCount={Number(content?.length) || 0}
                rowHeight={50}
                className="m-0 p-0"
                rowRenderer={({ key, index, style }) => (
                  <CommandItem
                    style={style}
                    key={key}
                    className="p-0 m-0 w-fit border-none shadow-none hover:bg-transparent"
                  >
                    <Toggle
                      defaultPressed={isPressed(
                        content ? extract(content[index], 'id') : undefined
                      )}
                      onPressedChange={() =>
                        onSelect && onSelect(content ? content[index] : undefined)
                      }
                      className="w-full font-normal rounded-sm data-[state=on]:bg-primary data-[state=on]:text-white p-0 m-0 text-base flex justify-start px-4"
                    >
                      {content ? extract(content[index], 'name') : undefined}
                    </Toggle>
                  </CommandItem>
                )}
              />
            ) : (
              <CommandEmpty>{t('not_found')}</CommandEmpty>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
