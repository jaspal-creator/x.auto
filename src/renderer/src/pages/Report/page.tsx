import * as React from 'react';
import ReportLayout from './context/context';
import LangSelect from '@/components/Utilities/LangSelect';
import SearchVinCode from '@/features/reports/forms/SearchVinCode';
import UserSessionCreateReport from '@/features/reports/components/user-session-create-report';
import InvalidVIN from '@/features/reports/components/invalid-vin';

export default function Report(): React.ReactNode {
  return (
    <ReportLayout>
      <section className="w-full h-full relative flex justify-center items-center">
        <div className="absolute top-0 right-0">
          <LangSelect />
        </div>
        {/* FORM */}
        <SearchVinCode />
        {/* DIALOG REPORT */}
        <UserSessionCreateReport />
        {/* INVALID VIN */}
        <InvalidVIN />
      </section>
    </ReportLayout>
  );
}
