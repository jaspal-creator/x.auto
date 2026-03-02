import * as React from 'react';
import DarkLogo from '@/assets/logo/dark_logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthForm from '@/features/auth/forms/AuthForm';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';

export default function Auth(): React.ReactNode {
  const { t } = useTranslation(['auth']);
  return (
    <main className="flex justify-center items-center relative w-dvw h-dvh">
      <div className="absolute top-9 -left-96">
        <img src={DarkLogo} />
      </div>
      <Card className="m-0 p-6 border-2 shadow-xl w-1/3">
        <CardHeader className="m-0 p-0 mb-6">
          <CardTitle className="text-3xl font-normal">{t('login')}</CardTitle>
        </CardHeader>
        <CardContent className="m-0 p-0">
          <AuthForm />
        </CardContent>
      </Card>
      <Toaster />
    </main>
  );
}
