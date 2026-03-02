import { useFiltration } from '@/hooks/useFiltration';
import * as React from 'react';
import CustomersLayout, { CustomersContext } from './context/context';
import Utilities from '@/components/Utilities/Utilities';
import { useGetCustomers } from '@/features/customers/hooks/useGetCustomers';
import { useDeleteCustomer } from '@/features/customers/hooks/useDeleteCustomer';
import PaginationUtility from '@/components/Pagination/Pagination';
import CreateCustomer from '@/features/customers/forms/CreateCustomer';
import MainTable from '@/components/Table/MainTable';
import { Customer } from 'entities/Customer';
import UpdateCustomer from '@/features/customers/forms/UpdateCustomer';
import { useTranslation } from 'react-i18next';

export default function Customers(): React.ReactNode {
  const { t } = useTranslation(['customers']);
  const { query, setSearch, setSort, setPage, getTotalPages, page } = useFiltration();
  const { customers, loading } = useGetCustomers({ query });
  const { deleteCustomer } = useDeleteCustomer({ invalidateKeys: ['customers', query] });

  return (
    <CustomersLayout>
      {/* TOP UTILITIES */}
      <Utilities
        title={t('title')}
        search={(_) => setSearch(_)}
        sort={setSort}
        create={{
          btn: t('create_btn'),
          form: <CreateCustomer invalidateKeys={['customers', query]} />,
          context: CustomersContext,
          open: `openSheet`,
          setOpen: 'setOpenSheet'
        }}
      />

      {/* MAIN TABLE */}
      <MainTable<Customer>
        loadingState={loading}
        // CONTENT DISPLAY
        tableHeader={[
          t('table.customers.company'),
          t('table.customers.code'),
          t('table.customers.action')
        ]}
        tableContent={customers?.data as Customer[]}
        tableRow={() => ['name', 'fiscal_code']}
        // DEFINE ACTIONS
        tableActions={['UPDATE', 'PREVIEW', 'DELETE']}
        // DELETE ACTION
        deleteAction={({ id, name }) => deleteCustomer({ id, name })}
        // UPDATE ACTION
        updateAction={{
          type: 'SHEET',
          form: (customer: Customer) => (
            <UpdateCustomer customer={customer} invalidateKeys={['customers', query]} />
          )
        }}
        // PREVIEW ACTION
        previewAction={{
          type: 'REDIRECTION',
          href: ({ id }): string => `/customers/${id}`
        }}
      />

      {/* PAGINATION */}
      <PaginationUtility
        page={page}
        setPage={setPage}
        pages={getTotalPages(customers?.count as number)}
      />
    </CustomersLayout>
  );
}
