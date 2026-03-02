import React, { FormEvent } from 'react';
import { useSearchParams } from 'react-router';

export const useConfirmPrices = ({ id, reinvoice }: { id: string; reinvoice?: number }) => {
  const [query, setQuery] = useSearchParams();

  return React.useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      let urlState = {};
      query
        .entries()
        .filter(([k]) => k !== 'preview')
        .forEach(([k, v]) => (urlState = { ...urlState, [k]: v }));
      reinvoice
        ? setQuery({
            ...urlState,
            confirm: id,
            reinvoice: reinvoice.toString()
          })
        : setQuery({
            ...urlState,
            confirm: id
          });
    },
    [query]
  );
};
