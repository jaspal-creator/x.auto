import { IActionState, IAutoPartState } from '@/pages/Invoices/context/context';
import { useQuery } from '@tanstack/react-query';
import { Company } from 'entities/Company';
import { Invoice } from 'entities/Invoice';
import { User } from 'entities/User';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useNavigate } from 'react-router';

export const useGetInvoice = ({ id }: { id: string }) => {
  const redirect = useNavigate();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async (): Promise<
      Response<
        Omit<Invoice, 'actions_prices' | 'details_prices'> & {
          actions_prices: IActionState[];
          details_prices: IAutoPartState[];
          company: Company;
          owner: User;
          report: {
            id: string;
            mileage: number;
            user_id: string;
            user_name: string;
            user_surname: string;
            user_nickname: string;
            car: {
              id: string;
              brand: string;
              model: string;
              car_number: string;
              year: number;
              engine_capacity: number;
              vin: string;
            };
            customer: {
              id: string;
              name: string;
              fiscal_code: string;
            };
          };
        }
      >
    > => {
      const result = await window.xauto.resolveQuery('INVOICE:FIND_BY_ID:QUERY', { id });
      console.log('useGetInvoice result:', result);
      return result;
    }
  });

  React.useEffect(() => {
    if (data?.Error?.msg === 'Unauthorized') redirect('/auth');
  }, []);

  return {
    invoice: data?.Success,
    error: data?.Error,
    loading: isLoading || isFetching
  };
};
