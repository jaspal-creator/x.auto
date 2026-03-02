import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { CarsContext } from '@/pages/Cars/context/context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Car } from 'entities/Car';
import { ICarCreate } from 'interfaces/car.create.dto';
import { Response } from 'interfaces/response.type';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { validateCarNumber } from '@/lib/car-number-formatter';

export const useCreateCar = ({ invalidateKeys }: { invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['cars'], { keyPrefix: 'hooks.created' });
  const { t: common } = useTranslation(['common']);
  const { t: validation } = useTranslation(['cars'], { keyPrefix: 'validation' });
  const { setOpenSheet } = React.useContext(CarsContext);
  const queryClient = useQueryClient();

  const formModel = z.object({
    brand: z
      .string()
      .min(1, { message: validation('brand.required') })
      .min(2, { message: validation('brand.min_length') })
      .max(50, { message: validation('brand.max_length') })
      .trim()
      .refine((val) => val.length > 0, { message: validation('brand.required') })
      .refine((val) => /^[a-zA-Z0-9\s\-.]+$/.test(val), {
        message: validation('brand.invalid_characters')
      }),
    model: z
      .string()
      .min(1, { message: validation('model.required') })
      .min(2, { message: validation('model.min_length') })
      .max(50, { message: validation('model.max_length') })
      .trim()
      .refine((val) => val.length > 0, { message: validation('model.required') })
      .refine((val) => /^[a-zA-Z0-9\s\-.]+$/.test(val), {
        message: validation('model.invalid_characters')
      }),
    car_number: z
      .string()
      .min(1, { message: validation('car_number.required') })
      .min(3, { message: validation('car_number.min_length') })
      .max(10, { message: validation('car_number.max_length') })
      .trim()
      .refine((val) => val.length > 0, { message: validation('car_number.required') })
      .refine((val) => validateCarNumber(val), {
        message: validation('car_number.invalid_format')
      }),
    vin: z
      .string()
      .min(1, { message: validation('vin.required') })
      .length(17, { message: validation('vin.length') })
      .trim()
      .refine((val) => val.length > 0, { message: validation('vin.required') })
      .refine((s) => !s.includes(' '), { message: validation('vin.no_spaces') })
      .refine((val) => /^[A-HJ-NPR-Z0-9]{17}$/.test(val.toUpperCase()), {
        message: validation('vin.invalid_characters')
      }),
    year: z.coerce
      .number({ invalid_type_error: validation('year.invalid_type') })
      .min(1900, { message: validation('year.min_value') })
      .max(new Date().getFullYear() + 1, { message: validation('year.max_value') }),
    engine_capacity: z.coerce
      .number({ invalid_type_error: validation('engine_capacity.invalid_type') })
      .min(0.1, { message: validation('engine_capacity.min_value') })
      .max(10.0, { message: validation('engine_capacity.max_value') }),
    customer: z.string().optional()
  });

  const mutation = useMutation({
    mutationKey: ['create', 'car'],
    mutationFn: async ({ data }: { data: ICarCreate }): Promise<Response<Car>> => {
      return await window.xauto.resolveMutation('CARS:CREATE:MUTATE', { data });
    },
    onSuccess: async ({ Success, Error }: Response<Car>): Promise<any> => {
      await __auth(Error as Response);
      if (Success) {
        setOpenSheet((_) => !_);
        toast({
          title: common('suc'),
          description: `${t('car')} ${Success.brand} ${Success.model}  ${t('suc')}`
        });
        form.reset();
        return queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });
      }
      if (Error)
        return toast({
          variant: 'destructive',
          title: common('err'),
          description: Error.msg
        });
    }
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      brand: undefined,
      model: undefined,
      car_number: undefined,
      vin: undefined,
      year: undefined,
      engine_capacity: undefined,
      customer: undefined
    }
  });

  const onSubmit = (val: z.infer<typeof formModel>) => mutation.mutate({ data: val as ICarCreate });
  return { form, onSubmit, pending: mutation.isLoading };
};
