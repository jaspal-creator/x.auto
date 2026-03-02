import { PasswordInput } from '@/components/Password';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CirclePlus, PencilLine } from 'lucide-react';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form?: UseFormReturn<any>;
  name?: string;
  label: string;
  placeHolder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  /* eslint-disable no-unused-vars */
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  forMaster?: {
    onOpenCommand: ({
      open,
      setOpen
    }: {
      open: boolean;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }) => React.ReactNode;
  };
  /* eslint-enable no-unused-vars */
}

export default function Field({
  form,
  name,
  label,
  placeHolder,
  type,
  required,
  disabled,
  value,
  onClick,
  forMaster
}: Props): React.ReactNode {
  const [openCommand, setOpenCommand] = React.useState<boolean>(false);

  return (
    <FormField
      control={form?.control}
      name={name || ''}
      render={({ field }) => (
        <>
          {forMaster?.onOpenCommand({ open: openCommand, setOpen: setOpenCommand })}
          <FormItem
            className="w-full border-2 border-foreground/25 rounded-lg p-3 m-0 group"
            onClick={(e) => {
              if (forMaster) setOpenCommand(true);
              onClick && onClick(e);
            }}
          >
            <div className="flex justify-between items-center">
              <FormLabel className="text-xl text-foreground/75 font-normal">{label}</FormLabel>
              {!disabled && !value && <PencilLine className="size-5  text-foreground/75" />}
              {forMaster && (
                <div className="relative">
                  <CirclePlus className="bg-primary rounded-full text-white" />
                  <CirclePlus className="bg-primary rounded-full text-white hover:animate-ping absolute top-0 right-0 bottom-0 left-0" />
                </div>
              )}
            </div>

            <FormControl>
              <>
                {type === 'password' ? (
                  <PasswordInput
                    {...field}
                    defaultValue={value || ''}
                    disabled={disabled}
                    placeholder={placeHolder || ''}
                    className="text-lg placeholder:text-lg h-fit w-full m-0 px-4 py-3 border-2 border-foreground/25 focus-visible:ring-0 outline-none focus:outline-none focus-visible:outline-none ring-0"
                  />
                ) : (
                  <Input
                    {...field}
                    {...(forMaster ? { value: value || '' } : { defaultValue: value || '' })}
                    disabled={disabled}
                    placeholder={placeHolder || ''}
                    type={type ? type : 'text'}
                    className="border-none shadow-none rounded-none disabled:text-foreground disabled:opacity-100 p-0 m-0 w-full h-fit disabled:text-xl outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 required:text-xl required:text-foreground placeholder:text-foreground/50 placeholder:text-lg"
                    required={required}
                  />
                )}
              </>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        </>
      )}
    />
  );
}
