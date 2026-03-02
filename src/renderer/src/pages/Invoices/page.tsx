import PaginationUtility from '@/components/Pagination/Pagination';
import MainTable from '@/components/Table/MainTable';
import Utilities from '@/components/Utilities/Utilities';
import Invoice from '@/features/invoices/components/invoice';
import UpdateReport from '@/features/reports/forms/UpdateReport';
import { useDeleteReport } from '@/features/reports/hooks/useDeleteReport';
import { useGetReports } from '@/features/reports/hooks/useGetReports';
import { useFiltration } from '@/hooks/useFiltration';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLetter';
import { Report } from 'entities/Report';
import * as React from 'react';
import InvoicesLayout, { InvoicesContext } from './context/context';
import ConfirmPriceDialog from '@/features/invoices/components/confirm-price-dialog';
import PreviewPriceDialog from '@/features/invoices/components/preview-price-dialog';
import { useDownloadInvoicePdf } from '@/hooks/useDownloadInvoicePdf';
import { useTranslation } from 'react-i18next';
import { InvoiceSatatus } from 'interfaces/invoice.status.enum';
import ReportInfo from '@/features/reports/components/report-info';
import { isReportExpired } from '@/lib/isReportExpired';

export default function Invoices(): React.ReactNode {
  const { t } = useTranslation(['invoices']);
  const [type, setType] = React.useState<Readonly<'VIN' | 'CUSTOMER' | 'NUMBER'>>('VIN');
  const { query, setSearch, setSort, setPage, getTotalPages, page } = useFiltration();
  const { reports, loading } = useGetReports({ query: { ...query, type } });
  const { deleteReport } = useDeleteReport({ invalidateKeys: ['reports', { ...query, type }] });
  const { downloadInvoice, pending } = useDownloadInvoicePdf();

  return (
    <InvoicesLayout>
      {/* TOP UTILITIES */}
      <Utilities<typeof type>
        title={t('title')}
        search={setSearch}
        sort={setSort}
        categories={['CUSTOMER', 'NUMBER', 'VIN']}
        onCategoryChange={setType}
        defaultCategory={type}
      />

      {/* MAIN TABLE */}
      <MainTable<Report>
        // PENDING STATE
        loadingState={loading}
        // CONTENT DISPLAY
        tableHeader={[
          t('table.date'),
          t('table.brand'),
          t('table.model'),
          t('table.car_number'),
          t('table.vin'),
          t('table.customer'),
          t('table.master'),
          t('table.total'),
          t('table.action')
        ]}
        // TABLE CONTENT
        tableContent={reports?.data as Report[]}
        // TABLE COLS
        tableRow={(report: Report) => [
          'created_at',
          'car.brand',
          'car.model',
          'car.car_number',
          'car.vin',
          'customer.name',
          'user.name',
          report.invoice?.status === InvoiceSatatus.REINVOICE
            ? ('' as any)
            : ('invoice.total' as any)
        ]}
        // DEFINE ACTIONS
        tableActions={['BILL', 'DOWNLOAD', 'UPDATE', 'DELETE', 'HOVER']}
        // DELETE ACTION
        deleteAction={({ id }) => deleteReport({ id })}
        // UPDATE ACTION
        updateAction={{
          type: 'DIALOG',
          dialog: {
            title: ({ car: { brand, model, year } }) =>
              `${capitalizeFirstLetter(brand)} ${capitalizeFirstLetter(model)} (${year})`,
            form: (report: Report) => (
              <UpdateReport report={report} invalidateKeys={['reports', { ...query, type }]} />
            )
          },
          condition: ({ invoice, expires_at }) => {
            const expired = isReportExpired(expires_at);
            return !expired && (!invoice || invoice.status !== InvoiceSatatus.READY);
          },
          getDisabledInfo: ({ invoice, expires_at }) => {
            const expired = isReportExpired(expires_at);
            const hasReadyInvoice = invoice && invoice.status === InvoiceSatatus.READY;

            if (expired) {
              return {
                title: t('report_expired.title'),
                message: t('report_expired.message'),
                type: 'expired' as const
              };
            }

            if (hasReadyInvoice) {
              return {
                title: t('edit_disabled.title'),
                message: t('edit_disabled.message'),
                type: 'invoiced' as const
              };
            }

            return {
              title: t('edit_disabled.title'),
              message: t('edit_disabled.message'),
              type: 'default' as const
            };
          }
        }}
        // PREVIEW ACTION
        previewAction={{
          type: 'MODAL',
          modal: {
            title: ({ car: { brand, model, year } }) =>
              `${capitalizeFirstLetter(brand)} ${capitalizeFirstLetter(model)} (${year})`,
            content: (report: Report) => (
              <>
                {report.invoice && report.invoice?.status === InvoiceSatatus.READY ? (
                  <PreviewPriceDialog report={report} />
                ) : (
                  <Invoice
                    context={InvoicesContext}
                    report={report}
                    reinvoice={{
                      condition: report.invoice?.status === InvoiceSatatus.REINVOICE,
                      invoice: report.invoice?.id
                    }}
                  />
                )}
              </>
            ),
            confirm: ({ open, setOpen, report, reinvoice }) => (
              <ConfirmPriceDialog
                context={InvoicesContext}
                open={open}
                setOpen={setOpen}
                report={report}
                reinvoice={reinvoice}
                invalidateKeys={['reports', { ...query, type }]}
              />
            )
          }
        }}
        // DOWNLOAD PDF
        downloadAction={{
          condition: ({ invoice }) => Boolean(invoice && invoice.status === InvoiceSatatus.READY),
          action: ({ invoice: { id }, car: { car_number } }: Report, opts) =>
            downloadInvoice({ data: { invoice: Number(id), car_number, ...opts } }),
          loading: pending
        }}
        // BILL ACTION
        billAction={{
          condition: ({ invoice }) =>
            Boolean(!invoice) || invoice.status === InvoiceSatatus.REINVOICE
        }}
        // HOVER ACTION
        hoverAction={{
          condition: ({ updated_flag }: Report) => Boolean(updated_flag),
          content: (report: Report) => <ReportInfo report={report} />
        }}
      />

      {/* PAGINATION */}
      <PaginationUtility
        page={page}
        setPage={setPage}
        pages={getTotalPages(reports?.count as number)}
      />
    </InvoicesLayout>
  );
}
