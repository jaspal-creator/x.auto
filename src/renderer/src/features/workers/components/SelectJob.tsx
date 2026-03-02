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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateJob } from '@/features/jobs/hooks/useCreateJob';
import { useGetJobs } from '@/features/jobs/hooks/useGetJobs';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';

interface Props {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeHolder?: string;
  type?: string;
  required?: boolean;
}

export default function SelectJob({ form, label, name, placeHolder }: Props): React.ReactNode {
  const { t } = useTranslation(['workers'], { keyPrefix: 'create.job' });
  const { jobs } = useGetJobs();
  const { mutation } = useCreateJob();
  const [open, setOpen] = React.useState(false);
  // const [searchedJob, setSearchedJob] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

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
                {field.value ? jobs?.find((job) => job.id === field.value)?.name : placeHolder}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput
                  // value={searchedJob}
                  placeholder={t('search')}
                  // onChangeCapture={(e) => setSearchedJob(e.currentTarget.value)}
                />
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-primary text-base font-normal">
                      {t('create')}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                      <Input
                        ref={inputRef}
                        placeholder={'New Job'}
                        type={'text'}
                        className="text-base placeholder:text-base h-fit w-full m-0 px-2 py-2 border-2 border-foreground/25 focus-visible:ring-0 outline-none focus:outline-none focus-visible:outline-none ring-0"
                        required
                      />
                      <Button
                        className="font-normal text-base shadow-2xl w-full"
                        disabled={mutation.isLoading}
                        onClick={async () => {
                          if (inputRef.current?.value) {
                            mutation.mutate({ data: { name: inputRef.current?.value } });
                            // @ts-ignore: reset value
                            inputRef.current.value = null;
                          }
                        }}
                      >
                        Create Job
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <CommandList>
                  <CommandEmpty className="flex flex-col gap-3 pt-3">
                    <p className="text-center">{t('not_found')}</p>
                    {/* {searchedJob && (
                      <Button
                        className="font-normal text-base shadow-2xl"
                        disabled={mutation.isLoading}
                        onClick={() => {
                          mutation.mutate({ data: { name: searchedJob } });
                          setSearchedJob('');
                        }}
                      >
                        {t('create')}
                      </Button>
                    )} */}
                  </CommandEmpty>
                  <CommandGroup>
                    {jobs?.map((j) => {
                      return (
                        <CommandItem
                          key={j.id}
                          value={j.id}
                          onSelect={() => form.setValue(name, j.id)}
                        >
                          {j.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === j.id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
