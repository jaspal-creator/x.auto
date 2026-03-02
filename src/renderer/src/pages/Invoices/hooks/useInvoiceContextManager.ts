import * as React from 'react';
import { IActionState, IAutoPartState } from '../context/context';

export const useInvoiceContextManager = () => {
  const [actions, setActions] = React.useState<[] | IActionState[]>([]);
  const [autoparts, setAutoParts] = React.useState<[] | IAutoPartState[]>([]);
  const [confirm, setConfirm] = React.useState<{
    actions: [] | IActionState[];
    autoparts: [] | IAutoPartState[];
  }>({ actions: [], autoparts: [] });

  return { actions, setActions, autoparts, setAutoParts, confirm, setConfirm };
};
