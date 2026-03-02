import { PasswordInput } from '@/components/Password';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeHolder?: string;
  type?: string;
  required?: boolean;
  style?: Partial<{
    label: React.HTMLAttributes<HTMLLabelElement>['className'];
    input: React.HTMLAttributes<HTMLInputElement>['className'];
  }>;
}

export default function Field({
  form,
  name,
  label,
  placeHolder,
  type,
  required,
  style
}: Props): React.ReactNode {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn('text-lg text-black font-normal', style?.label)}>
            {label}
          </FormLabel>
          <FormControl>
            {type === 'password' ? (
              <PasswordInput
                {...field}
                placeholder={placeHolder}
                className={cn(
                  'text-lg placeholder:text-lg h-fit w-full m-0 px-4 py-3 border-2 border-foreground/25 focus-visible:ring-0 outline-none focus:outline-none focus-visible:outline-none ring-0',
                  style?.input
                )}
              />
            ) : (
              <Input
                {...field}
                placeholder={placeHolder}
                type={type ? type : 'text'}
                className={cn(
                  'text-lg placeholder:text-lg h-fit w-full m-0 px-4 py-3 border-2 border-foreground/25 focus-visible:ring-0 outline-none focus:outline-none focus-visible:outline-none ring-0',
                  style?.input
                )}
                required={required}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
