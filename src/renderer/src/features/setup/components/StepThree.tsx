import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import * as React from 'react';
import CompanyDataForm from '../forms/CompanyDataForm';
import { useSetupCompanyData } from '../hooks/useSetupCompanyData';
import { useTranslation } from 'react-i18next';

interface Props {
  nextStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function StepThree({ nextStep }: Props): React.ReactNode {
  const { t } = useTranslation(['setup']);
  const { form, onSubmit, pending } = useSetupCompanyData(nextStep);
  return (
    <Card className="m-0 p-6 border-2 shadow-xl w-3/5">
      <CardHeader className="m-0 p-0 mb-10">
        <CardTitle className="text-primary text-5xl font-normal m-0 p-0">
          {t('company_data')}
        </CardTitle>
      </CardHeader>
      <CardContent className="m-0 p-0">
        <CompanyDataForm form={form} onSubmit={onSubmit} pending={pending} />
      </CardContent>
    </Card>
  );
}
