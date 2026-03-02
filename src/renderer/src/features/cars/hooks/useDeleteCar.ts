import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { DeleteResult } from 'typeorm';

export const useDeleteCar = ({ invalidateKeys }: { invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const [car] = React.useState<null | string>(null);
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationKey: ['delete', 'car'],
    mutationFn: async ({
      id
      //   nickname
    }: {
      id: string;
      //   nickname: string;
    }): Promise<Response<DeleteResult>> => {
      //   setCar(nickname);
      return await window.xauto.resolveMutation('CARS:DELETE:MUTATE', { id });
    },
    onSuccess: async ({ Success, Error }: Response<DeleteResult>): Promise<any> => {
      await __auth(Error as Response);
      if (Success) {
        toast({
          title: 'Success',
          description: `Car ${car} deleted successfully.`
        });
        return queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
      }
      if (Error) return toast({ variant: 'destructive', title: 'Error', description: Error.msg });
    }
  });

  return { deleteCar: del.mutate };
};
