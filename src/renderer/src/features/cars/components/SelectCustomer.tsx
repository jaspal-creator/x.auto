import { LoadingSpinner } from '@/components/Loading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContentNoPortal, PopoverTrigger } from '@/components/ui/popover';
import CreateCustomer from '@/features/customers/forms/CreateCustomer';
import { useDebounce } from '@/features/customers/hooks/useDebounce';
import { useGetAllCustomers } from '@/features/customers/hooks/useGetAllCustomers';
import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeHolder?: string;
  type?: string;
  required?: boolean;
}

export default function SelectCustomer({ form, label, name, placeHolder }: Props): React.ReactNode {
  const { t } = useTranslation(['cars'], { keyPrefix: 'create.customer' });
  const [searchedCustomer, setSearchedCustomer] = React.useState<string>('');
  const { customers, loading } = useGetAllCustomers({
    query: { search: searchedCustomer }
  });
  const { debounce, pending } = useDebounce();
  const [open, setOpen] = React.useState(false);
  const [accordionOpen, setAccordionOpen] = React.useState<string | null>(null);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-lg text-black font-normal">{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="m-0 p-0 w-full h-fit flex justify-between border-2 border-foreground/25 text-lg text-foreground py-2 px-4 font-normal"
              >
                {field.value
                  ? customers?.find((customer) => customer.id === field.value)?.name
                  : placeHolder}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContentNoPortal className="max-h-96 overflow-hidden">
              <Command shouldFilter={false} className="max-h-96">
                <CommandInput
                  onValueChange={(e) => debounce(() => setSearchedCustomer(e))}
                  placeholder={t('search')}
                />
                <Accordion
                  type="single"
                  className="w-full flex-shrink-0"
                  collapsible
                  value={accordionOpen as string}
                  onValueChange={setAccordionOpen}
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-primary text-base font-normal">
                      {t('create')}
                    </AccordionTrigger>
                    <AccordionContent className="max-h-60 overflow-y-auto">
                      <CreateCustomer
                        innerForm={true}
                        invalidateKeys={['customers', 'all', { search: '' }]}
                        style={{
                          form: 'gap-3',
                          button: 'text-base p-1',
                          field: {
                            label: 'text-sm placeholder:text-sm',
                            input: 'text-sm placeholder:text-sm p-2'
                          }
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {!accordionOpen && (
                  <CommandList className="max-h-64 overflow-y-auto">
                    {loading || pending ? (
                      <div className="flex justify-center items-center p-10">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <>
                        {customers?.length ? (
                          <CommandGroup>
                            {customers.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={customer.id}
                                onSelect={() => {
                                  form.setValue(name, customer.id);
                                  setOpen(false);
                                }}
                              >
                                {customer.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : (
                          <CommandEmpty className="flex flex-col gap-3 pt-3">
                            <p className="text-center">
                              {t('not_found')} {searchedCustomer}
                            </p>
                          </CommandEmpty>
                        )}
                      </>
                    )}
                  </CommandList>
                )}
              </Command>
            </PopoverContentNoPortal>
          </Popover>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
