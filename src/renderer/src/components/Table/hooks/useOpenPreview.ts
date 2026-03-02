import * as React from 'react';
import { useSearchParams } from 'react-router';

export const useOpenPreview = () => {
  const [query, setQuery] = useSearchParams();
  const [active, setActive] = React.useState<string | null>(null);

  const open = (id: string) => {
    let urlState = {};
    query.entries().forEach(([k, v]) => (urlState = { ...urlState, [k]: v }));
    setQuery({ ...urlState, preview: id });
    setActive(id);
  };

  const close = ({ confirm, cb }: { confirm?: boolean; cb?: () => void }) => {
    let urlState = {};
    query
      .entries()
      .filter(([k]) => k !== 'reinvoice')
      .filter(([k]) => {
        return confirm ? k !== 'confirm' : k !== 'preview';
      })
      .forEach(([k, v]) => (urlState = { ...urlState, [k]: v }));
    setQuery({ ...urlState });
    setActive(null);
    cb && cb();
  };

  return { open, close, active, query };
};
