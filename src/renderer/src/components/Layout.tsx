import * as React from 'react';
import Navbar from './Navbar/navbar';
import { Toaster } from './ui/toaster';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props): React.ReactNode {
  return (
    <main className="w-dvw h-dvh font-sans flex">
      <Navbar />
      <section className="py-9 pl-28 px-32 w-full h-full flex flex-col justify-between">
        {children}
      </section>
      <Toaster />
    </main>
  );
}
