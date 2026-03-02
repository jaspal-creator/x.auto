import Utilities from '@/components/Utilities/Utilities';
import * as React from 'react';
import ServicesLayout, { ServicesContext } from './context/context';
import { useFiltration } from '@/hooks/useFiltration';
import PaginationUtility from '@/components/Pagination/Pagination';
import CreateService from '@/features/services/forms/CreateService';
import { useGetServices } from '@/features/services/hooks/useGetServices';
import MainTable from '@/components/Table/MainTable';
import { Service } from 'entities/Service';
import { useDeleteService } from '@/features/services/hooks/useDeleteService';
import UpdateService from '@/features/services/forms/UpdateService';
import { useTranslation } from 'react-i18next';

export default function Services(): React.ReactNode {
  const { t } = useTranslation(['services']);
  const { query, setSearch, setSort, setPage, getTotalPages, page } = useFiltration();
  const { services, loading } = useGetServices({ query });
  const { deleteService } = useDeleteService({ invalidateKeys: ['services', query] });

  return (
    <ServicesLayout>
      {/* TOP UTILITIES */}
      <Utilities
        title={t('title')}
        search={(_) => setSearch(_)}
        sort={setSort}
        create={{
          btn: t('create_btn'),
          form: <CreateService invalidateKeys={['services', query]} />,
          context: ServicesContext,
          open: `openSheet`,
          setOpen: 'setOpenSheet'
        }}
      />

      {/* MAIN TABLE */}
      <MainTable<Service>
        loadingState={loading}
        tableHeader={[t('table.name'), t('table.action')]}
        tableContent={services?.data as Service[]}
        tableRow={() => ['name']}
        // DEFINE ACTIONS
        tableActions={['UPDATE', 'DELETE']}
        // DELETE ACTION
        deleteAction={({ id, name }) => deleteService({ id, name })}
        // UPDATE ACTION
        updateAction={{
          type: 'SHEET',
          form: (service: Service) => (
            <UpdateService service={service} invalidateKeys={['services', query]} />
          )
        }}
      />

      {/* PAGINATION */}
      <PaginationUtility
        page={page}
        setPage={setPage}
        pages={getTotalPages(services?.count as number)}
      />
    </ServicesLayout>
  );
}
