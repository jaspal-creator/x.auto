import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { extract } from '@/lib/extract';
import { X } from 'lucide-react';
import * as React from 'react';

/* eslint-disable */
interface Props<T> {
  label: string;
  data: (T & { id: string })[];
  row: (_: T) => React.ReactNode;
  quantity?: boolean;
  onValueChange?: (_: T & { price: number }) => void;
  defaultRowInputValue?: (_: T & { id: string }) => number;
}
/* eslint-enable */

export default function ItemsArea<T>({
  label,
  data,
  row,
  quantity = false,
  defaultRowInputValue,
  onValueChange
}: Props<T>): React.ReactNode {
  return (
    <div className="border-2 border-foreground/25 rounded-lg w-full p-3 h-96">
      <div className="flex justify-between border-b border-foreground/25 pb-1">
        <Label className="text-xl font-normal text-foreground/75">{label}</Label>
      </div>
      <ScrollArea className="h-80">
        {data?.map((item) => (
          <div key={item.id} className="py-1 border-b flex justify-between pr-4 items-center">
            {row(item as T)}
            <div className="flex justify-between gap-2 items-center">
              {quantity && (
                <h1>{extract(item, 'autopart.quantity') || extract(item, 'quantity')}</h1>
              )}
              {quantity && <X className="size-4 aspect-square text-foreground/75" />}
              <div className="flex items-center border-2 border-foreground/25 p-1 rounded-lg px-2 w-28">
                <Input
                  value={(() => {
                    const defaultValue = defaultRowInputValue
                      ? defaultRowInputValue(item)
                      : undefined;
                    return defaultValue || '';
                  })()}
                  onChange={(e) => {
                    const quantity = Number(
                      extract(item, 'autopart.quantity') || extract(item, 'quantity')
                    );
                    const price = Number(e.target.value);
                    onValueChange &&
                      onValueChange({
                        ...item,
                        quantity: Number(quantity),
                        price: Number(price)
                      } as T & {
                        price: number;
                      });
                  }}
                  step={0.1}
                  type="number"
                  required
                  className="border-none p-0 m-0 h-fit rounded-none shadow-none outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
                <h1 className="text-black font-normal text-base">MDL</h1>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
