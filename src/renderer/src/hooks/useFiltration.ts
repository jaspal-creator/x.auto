import { ESort } from 'interfaces/query.filtration';
import * as React from 'react';
import { useSearchParams } from 'react-router';

export const useFiltration = () => {
  const [query, setQuery] = useSearchParams();
  const [urlState, setUrlState] = React.useState<{
    limit: string;
    page: string;
    search: string;
    sort: ESort;
  }>({
    limit: query.get('limit') || '10',
    page: query.get('page') || '1',
    search: query.get('search') || '',
    sort: (query.get('sort') as ESort) || (ESort.RECENT as ESort)
  });

  React.useEffect(() => setQuery(urlState), [urlState]);

  const setSearch = (search: string) => setUrlState({ ...urlState, search });
  const setSort = (sort: ESort) => setUrlState({ ...urlState, sort });
  const setPage = (page: number) => setUrlState({ ...urlState, page: page.toString() });
  const setLimit = (limit: number) => setUrlState({ ...urlState, limit: limit.toString() });

  const getTotalPages = (count: number): number => Math.ceil(count / parseInt(urlState.limit));

  return {
    query: {
      limit: parseInt(urlState.limit),
      page: parseInt(urlState.page),
      search: urlState.search,
      sort: urlState.sort
    },
    setSearch,
    setSort,
    setPage,
    setLimit,
    getTotalPages,
    page: parseInt(urlState.page)
  };
};
