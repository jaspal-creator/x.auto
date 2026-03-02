import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Report } from 'entities/Report';
import { IReportUpdate } from 'interfaces/report.update.dto';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isEqual } from 'lodash';
import { Response } from 'interfaces/response.type';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import { User } from 'entities/User';
import { validateCarNumber } from '@/lib/car-number-formatter';

export const useUpdateReport = ({
  report,
  invalidateKeys
}: {
  report: Report;
  invalidateKeys: any[];
}) => {
  const __auth = useCheckAuth();
  const { t } = useTranslation(['report'], { keyPrefix: 'hooks.updated' });
  const { t: common } = useTranslation(['common']);
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
      car_number: report.car.car_number,
      mileage: report.mileage,
      report_services: report.report_services.map(({ service: { name, id } }) => {
        return { id, name };
      }),
      // @ts-ignore: Intercept objects
      report_autoparts: report.report_autoparts.map(({ autopart: { id, name, quantity } }) => {
        return { id, name, quantity };
      })
    }
  });

  const mutation = useMutation({
    mutationKey: ['update', 'report', report.id],
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: IReportUpdate;
    }): Promise<Response<boolean>> => {
      return await window.xauto.resolveMutation('REPORT:UPDATE:MUTATE', { id, data });
    },
    onSuccess: ({ Success, Error }: Response<boolean>): any => {
      __auth(Error as Response);
      if (Success) {
        toast({
          title: common('suc'),
          description: t('desc')
        });
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

  const onSubmit = (
    { report_autoparts, report_services, ...rest }: z.infer<typeof formModel>,
    { user }: { user: User }
  ): unknown => {
    /**
     * At least one service or details should be selected
     */
    if (report_autoparts?.length === 0 && report_services?.length === 0) {
      return toast({
        variant: 'destructive',
        title: common('err'),
        description: t('at_least_one')
      });
    }

    if (
      isEqual(
        {
          car_number: report.car.car_number,
          mileage: report.mileage,
          report_services: report.report_services.map(({ service: { id } }) => {
            return { id };
          }),
          // @ts-ignore: Intercept objects
          report_autoparts: report.report_autoparts.map(({ autopart: { id, quantity } }) => {
            return { id, quantity };
          })
        },
        {
          ...rest,
          report_services: report_services?.map(({ id }) => {
            return { id };
          }),
          // @ts-ignore: Intercept objects
          report_autoparts: report_autoparts?.map(({ id, quantity }) => {
            return { id, quantity };
          })
        }
      ) &&
      report.user_id === user.id
    )
      return;

    return mutation.mutate({
      id: report.id,
      data: {
        ...rest,
        // User snapshot fields
        user_id: user.id,
        user_name: user.name,
        user_surname: user.surname,
        user_nickname: user.nickname,
        car: report.car.id,
        report_autoparts: report_autoparts?.map(({ id, quantity }) => {
          return { id, quantity };
        }),
        report_services: report_services?.map(({ id }) => {
          return { id };
        })
      }
    });
  };

  return { form, onSubmit, pending: mutation.isLoading };
};
