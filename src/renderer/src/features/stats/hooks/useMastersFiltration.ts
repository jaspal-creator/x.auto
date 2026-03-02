import { oneMonthBack } from '@/lib/set-date';
import * as React from 'react';
import { useSearchParams } from 'react-router';

export const useMastersFiltration = () => {
  const [query, setQuery] = useSearchParams();
  const [urlState, setUrlState] = React.useState<{
    search: string;
    master: string;
    from: string;
    to: string;
  }>({
    search: query.get('search') || '',
    master: query.get('master') || '',
    from: query.get('from') || oneMonthBack().toLocaleString(),
    to: query.get('to') || new Date().toLocaleString()
  });

  React.useEffect(() => setQuery(urlState), [urlState]);

  const setSearch = (search: string) => setUrlState({ ...urlState, search });
  const setDate = ({ from, to }: { from: string | Date; to: string | Date }) =>
    setUrlState({ ...urlState, to: to as string, from: from as string });
  const setMaster = (master: string) => setUrlState({ ...urlState, master });

  return {
    setSearch,
    setDate,
    setMaster,
    query: {
      search: urlState.search,
      from: urlState.from,
      to: urlState.to,
      master: urlState.master
    }
  };
};
