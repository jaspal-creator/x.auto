import { Report } from 'entities/index';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  report: Report;
}

export default function ReportInfo({ report }: Props): React.ReactNode {
  const { t } = useTranslation(['report'], { keyPrefix: 'info' });
  const times = React.useMemo<{ label: string; value: Date }[]>(() => {
    return [
      { label: t('created'), value: report.created_at },
      { label: t('updated'), value: report.updated_at },
      { label: t('expires'), value: report.expires_at }
    ];
  }, [report]);

  return (
    <section className="flex flex-col gap-2">
      {report.invoice && <h1 className="text-base font-bold">ACT No. {report.invoice.id}</h1>}
      <div className="space-y-1">
        {times.map(({ label, value }, index) => (
          <div key={index} className="flex justify-between items-center text-base">
            <span className="font-semibold text-gray-900">{label}</span>
            <span className="text-gray-600 font-normal">
              {new Date(value).toLocaleString('ro', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
              })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
