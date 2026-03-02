import { toast } from '@/components/ui/use-toast';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Car } from 'entities/Car';
import { Report } from 'entities/Report';
import { User } from 'entities/User';
import { IReportCreate } from 'interfaces/report.create.dto';
import { Response } from 'interfaces/response.type';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { validateCarNumber } from '@/lib/car-number-formatter';

export const useCreateReport = ({ car, invalidateKeys }: { car: Car; invalidateKeys: any[] }) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['report'], { keyPrefix: 'hooks.created' });
  const { t: common } = useTranslation(['common']);
  const redirect = useNavigate();
  const queryClient = useQueryClient();

  const formModel = z.object({
    car_number: z
      .string()
      .min(3)
      .max(10)
      .trim()
      .refine((val) => validateCarNumber(val), {
        message: common('car_number.validation.invalid_format')
      }),
    mileage: z.coerce.number(),
    report_services: z
      .array(
        z.object({
          id: z.string().uuid(),
          name: z.string()
        })
      )
      .optional(),
    report_autoparts: z
      .array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          quantity: z.coerce.number().min(1)
        })
      )
      .optional()
  });

  const form = useForm<z.infer<typeof formModel>>({
    resolver: zodResolver(formModel),
    defaultValues: {
      car_number: car.car_number,
      mileage: undefined,
      report_autoparts: [],
      report_services: []
    }
  });

  const mutation = useMutation({
    mutationKey: ['create', 'report', car],
    mutationFn: async ({ data }: { data: IReportCreate }): Promise<Response<Report>> => {
      return await window.xauto.resolveMutation('REPORT:CREATE:MUTATE', { data });
    },
    onSuccess: async (res: Response<Report>): Promise<unknown> => {
      await __auth(res.Error as Response);
      if (res.Error) {
        return toast({
          variant: 'destructive',
          title: common('err'),
          description: res.Error.msg
        });
      }
      toast({
        title: common('suc'),
        description: t('desc')
      });
      queryClient.invalidateQueries({ queryKey: invalidateKeys, exact: true });

      return setTimeout(() => {
        redirect('/invoices');
        window.location.reload();
      }, 500);
    }
  });

  const onSubmit = (
    { report_services, report_autoparts, ...rest }: z.infer<typeof formModel>,
    { user }: { user: User }
  ): unknown => {
    if (report_autoparts?.length === 0 && report_services?.length === 0) {
      return toast({
        variant: 'destructive',
        title: common('err'),
        description: t('at_least_one')
      });
    }
    return mutation.mutate({
      data: {
        // User snapshot fields
        user_id: user.id,
        user_name: user.name,
        user_surname: user.surname,
        user_nickname: user.nickname,
        car,
        customer: car.customer,
        ...rest,
        report_services: report_services?.map(({ id }) => {
          return { id };
        }),
        report_autoparts: report_autoparts?.map(({ id, quantity }) => {
          return { id, quantity };
        })
      }
    });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
