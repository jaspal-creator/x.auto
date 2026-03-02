import Utilities from '@/components/Utilities/Utilities';
import CreateWorker from '@/features/workers/forms/CreateWorker';
import { useGetWorkers } from '@/features/workers/hooks/useGetWorkers';
import * as React from 'react';
import WorkersLayout, { WorkersContext } from './context/context';
import MainTable from '@/components/Table/MainTable';
import { User } from 'entities/User';
import { useFiltration } from '@/hooks/useFiltration';
import PaginationUtility from '@/components/Pagination/Pagination';
import { useDeleteWorker } from '@/features/workers/hooks/useDeleteWorker';
import UpdateWorker from '@/features/workers/forms/UpdateWorker';
import { useTranslation } from 'react-i18next';

export default function Workers(): React.ReactNode {
  const { t } = useTranslation(['workers']);
  const { query, setSearch, setSort, setPage, getTotalPages, page } = useFiltration();
  const { users, loading } = useGetWorkers({ query });
  const { deleteWorker } = useDeleteWorker({ invalidateKeys: ['users', query] });

  return (
    <WorkersLayout>
      {/* TOP UTILITIES */}
      <Utilities
        title={t('title')}
        search={(_) => setSearch(_)}
        sort={setSort}
        create={{
          btn: t('create_btn'),
          form: <CreateWorker invalidateKeys={['users', query]} />,
          context: WorkersContext,
          open: `openSheet`,
          setOpen: 'setOpenSheet'
        }}
      />
      {/* MAIN TABLE */}
      <MainTable<User>
        loadingState={loading}
        // CONTENT DISPLAY
        tableHeader={[
          t('table.workers.name'),
          t('table.workers.surname'),
          t('table.workers.date'),
          t('table.workers.nickname'),
          t('table.workers.profession'),
          t('table.workers.action')
        ]}
        tableContent={users?.data as User[]}
        tableRow={() => ['name', 'surname', 'date_of_birth', 'nickname', 'job.name' as any]}
        // DEFINE ACTIONS
        tableActions={['UPDATE', 'PREVIEW', 'DELETE']}
        // DELETE ACTION
        deleteAction={({ id, nickname }) => deleteWorker({ id, nickname })}
        // UPDATE ACTION
        updateAction={{
          type: 'SHEET',
          form: (user: User) => <UpdateWorker user={user} invalidateKeys={['users', query]} />
        }}
        // PREVIEW ACTION
        previewAction={{
          type: 'REDIRECTION',
          href: ({ id }): string => `/workers/${id}`
        }}
      />
      {/* PAGINATION */}
      <PaginationUtility
        page={page}
        setPage={setPage}
        pages={getTotalPages(users?.count as number)}
      />
    </WorkersLayout>
  );
}
