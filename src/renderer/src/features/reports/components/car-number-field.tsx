import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatCarNumber } from '@/lib/car-number-formatter';
import { PencilLine } from 'lucide-react';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeHolder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function CarNumberField({
  form,
  name,
  label,
  placeHolder,
  required,
  disabled,
  value,
  onClick
}: Props): React.ReactNode {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCarNumber(inputValue);
    form.setValue(name, formatted);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className="w-full border-2 border-foreground/25 rounded-lg p-3 m-0 group"
          onClick={onClick}
        >
          <div className="flex justify-between items-center">
            <FormLabel className="text-xl text-foreground/75 font-normal">{label}</FormLabel>
            {!disabled && !value && <PencilLine className="size-5 text-foreground/75" />}
          </div>

          <FormControl>
            <Input
              {...field}
              defaultValue={value || ''}
              disabled={disabled}
              placeholder={placeHolder || ''}
              type="text"
              className="border-none shadow-none rounded-none disabled:text-foreground disabled:opacity-100 p-0 m-0 w-full h-fit disabled:text-xl outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 required:text-xl required:text-foreground placeholder:text-foreground/50 placeholder:text-lg"
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
