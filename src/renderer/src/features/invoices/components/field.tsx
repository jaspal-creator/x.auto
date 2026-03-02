import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as React from 'react';

interface Props {
  label: string;
  value: string;
}

export default function Field({ label, value }: Props): React.ReactNode {
  return (
    <div className="w-full border-2 border-foreground/25 rounded-lg p-3 m-0">
      <div className="flex justify-between items-center">
        <Label className="text-xl text-foreground/75 font-normal">{label}</Label>
      </div>

      <Input
        defaultValue={value || ''}
        disabled={true}
        type={'text'}
        className="border-none shadow-none rounded-none disabled:text-foreground disabled:opacity-100 p-0 m-0 w-full h-fit disabled:text-xl outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 required:text-xl required:text-foreground placeholder:text-foreground/50 placeholder:text-lg"
      />
    </div>
  );
}
