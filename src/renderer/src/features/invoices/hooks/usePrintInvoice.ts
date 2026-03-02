import { useCheckAuth } from '@/hooks/useCheckAuth';
import { useMutation } from '@tanstack/react-query';
import { Response } from 'interfaces/response.type';

export const usePrintInvoice = () => {
  const __auth = useCheckAuth();
  const mutation = useMutation({
    mutationKey: ['print', 'invoice'],
    mutationFn: async ({ id }: { id: number }) => {
      return await window.xauto.resolveMutation('PRINTER:PRINT:MUTATE', { id });
    },
    onSuccess: async ({ Error }: Response) => await __auth(Error as Response)
  });

  return { printInvoice: mutation.mutate };
};
