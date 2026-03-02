import * as React from 'react';

export const useDebounce = (delay: number = 1000) => {
  const [pending, setPending] = React.useState<boolean>(false);
  let id: NodeJS.Timeout;

  const debounce = (callback: () => void) => {
    setPending(true);
    clearTimeout(id);
    id = setTimeout(() => {
      callback();
      setPending(false);
    }, delay);
  };

  return { debounce, pending };
};
