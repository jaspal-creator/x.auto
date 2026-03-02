import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
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

export default function SelectRole({ form, label, name, placeHolder }: Props): React.ReactNode {
  const { t } = useTranslation(['workers'], { keyPrefix: 'create.role' });
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg text-black font-normal">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="m-0 p-0 w-full h-fit flex justify-between border-2 border-foreground/25 text-lg text-foreground py-2 px-4 font-normal outline-none focus:ring-0 ring-0">
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="0">{t('u')}</SelectItem>
              <SelectItem value="1">{t('a')}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
