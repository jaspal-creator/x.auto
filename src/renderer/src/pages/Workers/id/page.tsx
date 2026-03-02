import * as React from 'react';
import WorkersLayout, { WorkersContext } from '../context/context';
import { useParams } from 'react-router';
import Utilities from '@/components/Utilities/Utilities';
import { useFiltration } from '@/hooks/useFiltration';
import PaginationUtility from '@/components/Pagination/Pagination';
import { useDeleteReport } from '@/features/reports/hooks/useDeleteReport';
import { useGetWorkerReports } from '@/features/workers/hooks/useGetWorkerReports';
import MainTable from '@/components/Table/MainTable';
import { Report } from 'entities/Report';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLetter';
import UpdateReport from '@/features/reports/forms/UpdateReport';
import PreviewPriceDialog from '@/features/invoices/components/preview-price-dialog';
import Invoice from '@/features/invoices/components/invoice';
import ConfirmPriceDialog from '@/features/invoices/components/confirm-price-dialog';
import { useDownloadInvoicePdf } from '@/hooks/useDownloadInvoicePdf';
import { useTranslation } from 'react-i18next';
import { InvoiceSatatus } from 'interfaces/invoice.status.enum';
import ReportInfo from '@/features/reports/components/report-info';
import { isReportExpired } from '@/lib/isReportExpired';

export default function Worker(): React.ReactNode {
  const { t } = useTranslation(['workers'], { keyPrefix: 'table.worker' });
  const { t: tInvoices } = useTranslation(['invoices']);
  const { id } = useParams();
  const { query, setSearch, setSort, setPage, getTotalPages, page } = useFiltration();
  const [type, setType] = React.useState<Readonly<'VIN' | 'NUMBER' | 'CUSTOMER'>>('VIN');
  const { reports, loading } = useGetWorkerReports({ id: id as string, query: { ...query, type } });
  const { deleteReport } = useDeleteReport({
    invalidateKeys: ['worker', 'reports', id, { ...query, type }]
  });
  const { downloadInvoice, pending } = useDownloadInvoicePdf();

  return (
    <WorkersLayout>
      {/* TOP UTILITIES */}
      <Utilities<typeof type>
        title={reports?.data.user.nickname as string}
        search={setSearch}
        sort={setSort}
        categories={['CUSTOMER', 'NUMBER', 'VIN']}
        defaultCategory={type}
        onCategoryChange={setType}
        goBack
      />

      {/* MAIN TABLE */}
      <MainTable<Report>
        // PENDING STATE
        loadingState={loading}
        // CONTENT DISPLAY
        tableHeader={[
          t('date'),
          t('brand'),
          t('model'),
          t('car_number'),
          t('vin'),
          t('customer'),
          t('total'),
          t('action')
        ]}
        // TABLE CONTENT
        tableContent={reports?.data.reports as Report[]}
        // TABLE COLS
        tableRow={(report: Report) => [
          'created_at',
          'car.brand',
          'car.model',
          'car.car_number',
          'car.vin',
          'customer.name',
          report.invoice?.status === InvoiceSatatus.REINVOICE
            ? ('' as any)
            : ('invoice.total' as any)
        ]}
        // DEFINE ACTIONS
        tableActions={['BILL', 'UPDATE', 'DELETE', 'DOWNLOAD', 'HOVER']}
        // DELETE ACTION
        deleteAction={({ id }) => deleteReport({ id })}
        // UPDATE ACTION
        updateAction={{
          type: 'DIALOG',
          dialog: {
            title: ({ car: { brand, model, year } }) =>
              `${capitalizeFirstLetter(brand)} ${capitalizeFirstLetter(model)} (${year})`,
            form: (report: Report) => (
              <UpdateReport
                report={report}
                invalidateKeys={['worker', 'reports', id, { ...query, type }]}
              />
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
                title: tInvoices('report_expired.title'),
                message: tInvoices('report_expired.message'),
                type: 'expired' as const
              };
            }

            if (hasReadyInvoice) {
              return {
                title: tInvoices('edit_disabled.title'),
                message: tInvoices('edit_disabled.message'),
                type: 'invoiced' as const
              };
            }

            return {
              title: tInvoices('edit_disabled.title'),
              message: tInvoices('edit_disabled.message'),
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
                    context={WorkersContext}
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
                context={WorkersContext}
                open={open}
                setOpen={setOpen}
                report={report}
                reinvoice={reinvoice}
                invalidateKeys={['worker', 'reports', id, { ...query, type }]}
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
    </WorkersLayout>
  );
}
