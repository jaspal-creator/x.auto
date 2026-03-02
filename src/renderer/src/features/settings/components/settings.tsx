import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as React from 'react';
import SettingsForm from '../forms/SettingsForm';
import { useGetCompanyInfo } from '../hooks/useGetCompanyInfo';
import { LoadingSpinner } from '@/components/Loading';
import { Company } from 'entities/Company';
import { useTranslation } from 'react-i18next';

export default function Settings(): React.ReactNode {
  const { t } = useTranslation(['settings']);
  const { company, loading } = useGetCompanyInfo();
  return (
    <DialogContent onInteractOutside={(_) => _.preventDefault()}>
      <DialogHeader>
        <DialogTitle className="font-normal text-2xl">{t('title')}</DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="w-full flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <SettingsForm company={company as Company} />
      )}
    </DialogContent>
  );
}
