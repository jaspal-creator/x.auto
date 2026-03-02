import { LoadingSpinner } from '@/components/Loading';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChevronDown, PencilLine, Trash2 } from 'lucide-react';
import * as React from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

/* eslint-disable */
interface Props {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  onChange?: ({
    event,
    field
  }: {
    event: React.ChangeEvent<HTMLInputElement>;
    field: ControllerRenderProps<any, string>;
  }) => void;
  loading?: boolean;
}
/* eslint-enable */

export default function SettingsField({
  form,
  name,
  label,
  placeholder,
  required,
  type,
  onChange,
  loading
}: Props): React.ReactNode {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) =>
        type === 'file' ? (
          <FormItem className="relative w-full flex justify-center items-center border-2 border-primary m-0 p-0 py-2 rounded-lg hover:bg-accent">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-base font-normal">
                    {form.getValues('file')
                      ? String(form.getValues('file').name).slice(0, 25).concat('...')
                      : label}
                  </FormLabel>
                  {form.getValues('file') ? (
                    <Trash2
                      className="size-4 z-50 hover:text-destructive"
                      onClick={() => field.onChange(undefined)}
                    />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </div>

                <FormControl className="absolute top-0 bottom-0 right-0 left-0 opacity-0">
                  <Input
                    {...field}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    onChange={(event) => onChange && onChange({ field, event })}
                    accept="application/json"
                    value={''}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </>
            )}
          </FormItem>
        ) : (
          <FormItem className="border-2 border-foreground/20 rounded-lg p-[10px]">
            <div className="flex justify-between text-foreground">
              <FormLabel className="font-normal text-xl">{label}</FormLabel>
              <PencilLine className="size-5" />
            </div>

            <FormControl>
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                required={required}
                className="m-0 p-0 w-full h-fit rounded-none border-none shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:outline-none text-lg placeholder:text-lg font-normal"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )
      }
    />
  );
}
