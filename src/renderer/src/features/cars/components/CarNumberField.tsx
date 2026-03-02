import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatCarNumber } from '@/lib/car-number-formatter';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeHolder?: string;
  required?: boolean;
}

export default function CarNumberField({
  form,
  name,
  label,
  placeHolder,
  required
}: Props): React.ReactNode {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCarNumber(value);
    form.setValue(name, formatted);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg text-black font-normal">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeHolder}
              type="text"
              className="text-lg placeholder:text-lg h-fit w-full m-0 px-4 py-3 border-2 border-foreground/25 focus-visible:ring-0 outline-none focus:outline-none focus-visible:outline-none ring-0"
              required={required}
              onChange={(e) => {
                handleInputChange(e);
                field.onChange(e); // Ensure form state is updated
              }}
              style={{ textTransform: 'uppercase' }}
              maxLength={10}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
