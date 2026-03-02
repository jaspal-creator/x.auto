import * as React from 'react';
import HistoryLayout from './context/context';
import Utilities from '@/components/Utilities/Utilities';
import { useFiltration } from '@/hooks/useFiltration';

export default function History(): React.ReactNode {
  const { setSearch, setSort } = useFiltration();
  return (
    <HistoryLayout>
      {/* TOP UTILITIES */}
      <Utilities title="History" search={(_) => setSearch(_)} sort={setSort} />
    </HistoryLayout>
  );
}
