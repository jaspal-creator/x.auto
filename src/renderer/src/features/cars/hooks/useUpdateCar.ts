import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Car } from 'entities/Car';
import { ICarUpdate } from 'interfaces/car.update.dto';
import { Response } from 'interfaces/response.type';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UpdateResult } from 'typeorm';
import { z } from 'zod';
import { validateCarNumber } from '@/lib/car-number-formatter';

export const useUpdateCar = ({ car, invalidateKeys }: { car: Car; invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['cars'], { keyPrefix: 'hooks.updated' });
  const { t: common } = useTranslation(['common']);
  const { t: validation } = useTranslation(['cars'], { keyPrefix: 'validation' });
  const queryClient = useQueryClient();

  const formModel = z.object({
    brand: z
      .string()
      .min(2, { message: validation('brand.min_length') })
      .max(50, { message: validation('brand.max_length') })
      .trim()
      .refine((val) => /^[a-zA-Z0-9\s\-.]+$/.test(val), {
        message: validation('brand.invalid_characters')
      })
      .optional(),
    model: z
      .string()
      .min(2, { message: validation('model.min_length') })
      .max(50, { message: validation('model.max_length') })
      .trim()
      .refine((val) => /^[a-zA-Z0-9\s\-.]+$/.test(val), {
        message: validation('model.invalid_characters')
      })
      .optional(),
    car_number: z
      .string()
      .min(3, { message: validation('car_number.min_length') })
      .max(10, { message: validation('car_number.max_length') })
      .trim()
      .refine((val) => validateCarNumber(val), {
        message: validation('car_number.invalid_format')
      })
      .optional(),
    vin: z
      .string()
      .length(17, { message: validation('vin.length') })
      .trim()
      .refine((s) => !s.includes(' '), { message: validation('vin.no_spaces') })
      .refine((val) => /^[A-HJ-NPR-Z0-9]{17}$/.test(val.toUpperCase()), {
        message: validation('vin.invalid_characters')
      })
      .optional(),
    year: z.coerce
      .number({ invalid_type_error: validation('year.invalid_type') })
      .min(1900, { message: validation('year.min_value') })
      .max(new Date().getFullYear() + 1, { message: validation('year.max_value') })
      .optional(),
    engine_capacity: z.coerce
      .number({ invalid_type_error: validation('engine_capacity.invalid_type') })
      .min(0.1, { message: validation('engine_capacity.min_value') })
      .max(10.0, { message: validation('engine_capacity.max_value') })
      .optional(),
    customer: z.string().optional()
  });

  const mutation = useMutation({
    mutationKey: ['update', 'car', car.id],
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: ICarUpdate;
    }): Promise<Response<UpdateResult>> => {
      return await window.xauto.resolveMutation('CARS:UPDATE:MUTATE', { id, data });
    },
    onSuccess: async ({ Success, Error }: Response<UpdateResult>): Promise<any> => {
      await __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: `${t('car')} ${form.getValues('vin')} ${t('suc')}`
        });

        // Check if customer was changed and invalidate customer reports cache
        const originalCustomerId = car.customer?.id;
        const newCustomerId = form.getValues('customer');

        const invalidationPromises = [
          queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true })
        ];

        // If customer was changed, invalidate customer reports cache for both old and new customers
        if (originalCustomerId !== newCustomerId) {
          // Invalidate old customer's reports cache
          if (originalCustomerId) {
            invalidationPromises.push(
              queryClient.invalidateQueries({
                queryKey: ['customer', 'reports', originalCustomerId],
                exact: false
              })
            );
          }

          // Invalidate new customer's reports cache
          if (newCustomerId) {
            invalidationPromises.push(
              queryClient.invalidateQueries({
                queryKey: ['customer', 'reports', newCustomerId],
                exact: false
              })
            );
          }
        }

        return Promise.all(invalidationPromises);
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
      brand: car.brand,
      model: car.model,
      car_number: car.car_number,
      vin: car.vin,
      year: car.year,
      engine_capacity: car.engine_capacity,
      customer: car.customer ? car.customer.id : undefined
    }
  });

  const onSubmit = (val: z.infer<typeof formModel>) => {
    mutation.mutate({ id: car.id, data: val as ICarUpdate });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
