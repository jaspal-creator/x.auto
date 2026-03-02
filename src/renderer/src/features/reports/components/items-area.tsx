import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CirclePlus, Minus, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface Props {
  placeholder: string;
  onOpenCommand: ({
    /* eslint-disable no-unused-vars */
    open,
    setOpen
    /* eslint-enable no-unused-vars */
  }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
  field: ControllerRenderProps<any>;
  type: 'ACTIONS' | 'DETAILS';
}

export default function ItemsArea({
  placeholder,
  onOpenCommand,
  field,
  type
}: Props): React.ReactNode {
  const [openCommand, setOpenCommand] = React.useState(false);
  return (
    <FormItem className="w-full">
      <FormControl className="m-0 p-0">
        <>
          {onOpenCommand({ open: openCommand, setOpen: setOpenCommand })}
          <div className="border-2 border-foreground/25 rounded-lg w-full p-3 h-96">
            <div
              className="flex justify-between border-b border-foreground/25 pb-1"
              onClick={() => setOpenCommand(true)}
            >
              <FormLabel className="text-xl font-normal text-foreground/75">
                {placeholder}
              </FormLabel>
              <div className="relative">
                <CirclePlus className="bg-primary rounded-full text-white" />
                <CirclePlus className="bg-primary rounded-full text-white hover:animate-ping absolute top-0 right-0 bottom-0 left-0" />
              </div>
            </div>
            <ScrollArea className="h-80">
              {field.value.map((item) => (
                <div
                  key={item.id}
                  className="py-1 border-b flex justify-between pr-4 items-center select-none"
                >
                  <h1 className="text-lg font-normal text-foreground">{item.name}</h1>
                  <div className="flex justify-between gap-4 items-center">
                    {type === 'DETAILS' && (
                      <div className="flex items-center gap-2">
                        <Minus
                          className="size-5 hover:bg-foreground/10 rounded-full select-none"
                          onClick={() =>
                            field.onChange(
                              field.value.map(({ id, name, quantity }) => {
                                if (id === item.id) return { id, quantity: quantity - 0.5, name };
                                return { id, name, quantity };
                              })
                            )
                          }
                        />
                        <Input
                          type="number"
                          onChange={({ target: { value: _ } }) =>
                            field.onChange(
                              field.value.map(({ id, ...rest }) => {
                                if (id === item.id) return { id, ...rest, quantity: Number(_) };
                                return { id, ...rest };
                              })
                            )
                          }
                          value={item.quantity}
                          defaultValue={item.quantity}
                          className="p-0 m-0 h-fit border-foreground/50 w-16 px-2 rounded-sm focus-visible:outline-none focus-visible:ring-0"
                        />
                        <Plus
                          className="size-5 hover:bg-foreground/10 rounded-full"
                          onClick={() =>
                            field.onChange(
                              field.value.map(({ id, name, quantity }) => {
                                if (id === item.id) return { id, quantity: quantity + 0.5, name };
                                return { id, name, quantity };
                              })
                            )
                          }
                        />
                      </div>
                    )}
                    <Trash2
                      className="size-5 hover:text-destructive"
                      onClick={() => field.onChange(field.value.filter(({ id }) => item.id !== id))}
                    />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
