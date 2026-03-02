import { ReportContext } from '@/pages/Report/context/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Car } from 'entities/Car';
import { Response } from 'interfaces/response.type';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCheckAuth } from '@/hooks/useCheckAuth';

export const useSearchByVin = () => {
  const __auth = useCheckAuth();
  const { t: common } = useTranslation(['common']);
  const { setOpen, setCar } = useContext(ReportContext);
  const [vin, setVin] = React.useState<string | undefined>(undefined);
  /* eslint-disable */
  const [_query, setQuery] = useSearchParams();
  /* eslint-enable */

  const formModel = z.object({
    vin: z
      .string()
      .trim()
      .min(17)
      .max(17)
      .refine((s) => !s.includes(' '), common('no_spaces'))
  });

  const { data } = useQuery({
    queryKey: ['find-by-vin', vin],
    queryFn: async (): Promise<Response<Car | null>> => {
      return await window.xauto.resolveQuery('CARS:FIND_BY_VIN:QUERY', { id: vin });
    },
    enabled: Boolean(vin)
  });

  React.useEffect(() => {
    __auth(data?.Error as Response);
    if (data?.Success) {
      setOpen(true);
      setCar(data.Success);
    }

    if (data?.Error) {
      setQuery({ not_found_resource: 'true' });
    }
    // CLEANUP
    return () => setVin(undefined);
  }, [data]);

  const form = useForm<z.infer<typeof formModel>>({
    defaultValues: { vin: undefined },
    resolver: zodResolver(formModel)
  });

  const onSubmit = (val: z.infer<typeof formModel>) => {
    setVin(val.vin);
    form.setValue('vin', '');
    // form.control._reset();
  };

  return { form, onSubmit };
};

// 1GNKRGKD8EJ349066
