import * as React from 'react';
import DarkLogo from '@/assets/logo/dark_logo.png';
import Steps from '@/features/setup/components/Steps';
import { Toaster } from '@/components/ui/toaster';

export default function Setup(): React.ReactNode {
  return (
    <main className="select-none flex justify-center items-center relative w-dvw h-dvh">
      <div className="absolute top-9 left-24">
        <img src={DarkLogo} />
      </div>
      <Steps />
      <Toaster />
    </main>
  );
}
