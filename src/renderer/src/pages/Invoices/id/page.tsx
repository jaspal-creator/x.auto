import { useGetInvoice } from '@/features/invoices/hooks/useGetInvoice';
import * as React from 'react';
import { useParams } from 'react-router';
import InvoicePrintTable from '@/features/invoices/components/invoice-print-table';
import { useInvoiceQueryStatus } from '@/features/invoices/hooks/useInvoiceQueryStatus';
import PaymentTable from '@/features/invoices/components/payment-table';

export default function Invoice(): React.ReactNode {
  const { id } = useParams();
  const { client, manager, payment, all } = useInvoiceQueryStatus();
  const { invoice, loading, error } = useGetInvoice({ id: id as string });

  // Don't render anything until the invoice data is loaded
  if (loading) {
    return (
      <main>
        <div>Loading invoice...</div>
      </main>
    );
  }

  // Handle error state
  if (error) {
    return (
      <main>
        <div>Error loading invoice: {error.msg}</div>
      </main>
    );
  }

  // Only render when invoice data is available
  if (!invoice) {
    return (
      <main>
        <div>Invoice not found</div>
      </main>
    );
  }

  return (
    <main>
      {/* WITH CODE (MANAGER) */}
      {client && <InvoicePrintTable invoice={invoice} code={true} />}

      {/* WITHOUT CODE (CLIENT) */}
      {manager && <InvoicePrintTable invoice={invoice} />}

      {/* PAYMENT DATA */}
      {payment && <PaymentTable invoice={invoice} />}

      {/* ALL DATA */}
      {all && (
        <>
          <InvoicePrintTable invoice={invoice} code={true} />
          <InvoicePrintTable invoice={invoice} />
          <PaymentTable invoice={invoice} />
        </>
      )}
    </main>
  );
}
