import Utilities from '@/components/Utilities/Utilities';
import * as React from 'react';
import AutoPartsLayout, { AutoPartsContext } from './context/context';
import { useFiltration } from '@/hooks/useFiltration';
import PaginationUtility from '@/components/Pagination/Pagination';
import CreateAutoPart from '@/features/auto-parts/forms/CreateAutoPart';
import { useGetAutoParts } from '@/features/auto-parts/hooks/useGetAutoParts';
import { useDeleteAutoPart } from '@/features/auto-parts/hooks/useDeleteAutoPart';
import MainTable from '@/components/Table/MainTable';
import { AutoPart } from 'entities/AutoPart';
import UpdateAutoPart from '@/features/auto-parts/forms/UpdateAutoPart';
import { useTranslation } from 'react-i18next';

export default function AutoParts(): React.ReactNode {
  const { t } = useTranslation(['autoparts']);
  const { query, setSearch, setSort, setPage, getTotalPages, page } = useFiltration();
  const { autoparts, loading } = useGetAutoParts({ query });
  const { deleteAutoPart } = useDeleteAutoPart({ invalidateKeys: ['auto-parts', query] });

  return (
    <AutoPartsLayout>
      {/* TOP UTILITIES */}
      <Utilities
        title={t('title')}
        search={(_) => setSearch(_)}
        sort={setSort}
        create={{
          btn: t('create_btn'),
          form: <CreateAutoPart invalidateKeys={['auto-parts', query]} forCommand={false} />,
          context: AutoPartsContext,
          open: `openSheet`,
          setOpen: 'setOpenSheet'
        }}
      />

      {/* MAIN TABLE */}
      <MainTable<AutoPart>
        loadingState={loading}
        tableHeader={[t('table.name'), t('table.code'), t('table.manufacturer'), t('table.action')]}
        tableContent={autoparts?.data as AutoPart[]}
        tableRow={() => ['name', 'code', 'manufacturer']}
        // DEFINE ACTIONS
        tableActions={['UPDATE', 'DELETE']}
        // DELETE ACTION
        deleteAction={({ id, name }) => deleteAutoPart({ id, name })}
        // UPDATE ACTION
        updateAction={{
          type: 'SHEET',
          form: (autopart: AutoPart) => (
            <UpdateAutoPart autopart={autopart} invalidateKeys={['auto-parts', query]} />
          )
        }}
      />

      {/* PAGINATION */}
      <PaginationUtility
        page={page}
        setPage={setPage}
        pages={getTotalPages(autoparts?.count as number)}
      />
    </AutoPartsLayout>
  );
}
