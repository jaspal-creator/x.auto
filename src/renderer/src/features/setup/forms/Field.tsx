import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeHolder?: string;
  type?: string;
  required?: boolean;
}

export default function Field({
  form,
  name,
  label,
  placeHolder,
  type,
  required
}: Props): React.ReactNode {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl text-primary font-normal mb-3">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeHolder}
              type={type ? type : 'text'}
              className="text-lg placeholder:text-lg h-fit w-full m-0
              p-5"
              required={required}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
