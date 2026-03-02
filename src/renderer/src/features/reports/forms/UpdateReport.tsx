import { LoadingSpinner } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useClientStatus } from '@/hooks/useClientStatus';
import { Report } from 'entities/Report';
import * as React from 'react';
import Field from '../components/field';
import CarNumberField from '../components/car-number-field';
import { useGetAllServices } from '@/features/services/hooks/useGetAllServices';
import { useGetAllAutoParts } from '@/features/auto-parts/hooks/useGetAllAutoParts';
import ItemsArea from '../components/items-area';
import CommandSearch from '../components/command-search';
import CreateService from '@/features/services/forms/CreateService';
import { useUpdateReport } from '../hooks/useUpdateReport';
import CreateAutoPart from '@/features/auto-parts/forms/CreateAutoPart';
import { useTranslation } from 'react-i18next';
import SingleToggleMaster from '../components/single-toggle-master';
import { User } from 'entities/User';

interface Props {
  report: Report;
  invalidateKeys: any[];
}

export default function UpdateReport({ report, invalidateKeys }: Props): React.ReactNode {
  const { t } = useTranslation(['report'], { keyPrefix: 'create' });
  const { data } = useClientStatus();

  // Use report's user data if available, otherwise fallback to current authenticated user
  const [user, setUser] = React.useState<User>(() => {
    if (report.user_name && report.user_surname && report.user_nickname) {
      return {
        id: report.user_id,
        name: report.user_name,
        surname: report.user_surname,
        nickname: report.user_nickname
      } as User;
    }
    // Fallback to current authenticated user if report's user data is missing
    return data;
  });
  const { form, onSubmit, pending } = useUpdateReport({ report, invalidateKeys });
  const [searchServices, setSearchServices] = React.useState<string>('');
  const [searchAutoParts, setSearchAutoParts] = React.useState<string>('');
  const { services, loading: servicesLoading } = useGetAllServices({
    query: { search: searchServices }
  });
  const { autoparts, loading: autopartsLoading } = useGetAllAutoParts({
    query: { search: searchAutoParts }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => onSubmit(e, { user }))}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex gap-6 w-full">
          <Field
            disabled
            form={form}
            label={t('master')}
            value={`${user?.surname} ${user?.name}`}
            forMaster={{
              onOpenCommand: ({ open, setOpen }) => (
                <SingleToggleMaster
                  open={open}
                  setOpen={setOpen}
                  currentMasterId={user.id}
                  setMaster={setUser}
                />
              )
            }}
          />
          <Field
            form={form}
            label={t('customer')}
            value={report.customer.fiscal_code || report.customer.name}
            disabled
          />
          <Field form={form} label={t('vin')} value={report.car.vin} disabled />
          <CarNumberField
            form={form}
            name="car_number"
            label={t('car_number')}
            placeHolder={t('car_number')}
          />
          <Field form={form} name="mileage" label={t('mileage')} placeHolder={t('mileage')} />
        </div>

        <div className="flex justify-between gap-6">
          <FormField
            control={form.control}
            name="report_services"
            render={({ field }) => (
              <ItemsArea
                type="ACTIONS"
                field={field}
                placeholder={t('actions')}
                onOpenCommand={({ open, setOpen }) => (
                  <CommandSearch<{ id: string; name: string }>
                    placeholder={t('search_actions')}
                    open={open}
                    setOpen={setOpen}
                    onSearch={(_) => setSearchServices(_)}
                    isPressed={(service) =>
                      field.value?.some(({ id }) => service === id) as boolean
                    }
                    content={services}
                    loading={servicesLoading}
                    onSelect={(service) => {
                      field.value?.some(({ id }) => service?.id === id)
                        ? field.onChange(field.value.filter(({ id }) => service?.id !== id))
                        : field.onChange([
                            ...(field.value as []),
                            { id: service?.id, name: service?.name }
                          ]);
                    }}
                    create={{
                      label: t('create_actions'),
                      component: (
                        <CreateService
                          invalidateKeys={['services', 'all', { search: searchServices }]}
                          forCommand={true}
                        />
                      )
                    }}
                  />
                )}
              />
            )}
          />

          <FormField
            control={form.control}
            name="report_autoparts"
            render={({ field }) => (
              <ItemsArea
                type="DETAILS"
                field={field}
                placeholder={t('details')}
                onOpenCommand={({ open, setOpen }) => (
                  <CommandSearch<{ id: string; name: string; quantity: number }>
                    placeholder={t('search_details')}
                    open={open}
                    setOpen={setOpen}
                    onSearch={(_) => setSearchAutoParts(_)}
                    isPressed={(part) => field.value?.some(({ id }) => part === id) as boolean}
                    content={autoparts as any}
                    loading={autopartsLoading}
                    onSelect={(part) => {
                      field.value?.some(({ id }) => part?.id === id)
                        ? field.onChange(field.value.filter(({ id }) => part?.id !== id))
                        : field.onChange([
                            ...(field.value as []),
                            { id: part?.id, name: part?.name, quantity: 1 }
                          ]);
                    }}
                    create={{
                      label: t('create_details'),
                      component: (
                        <CreateAutoPart
                          invalidateKeys={['autoparts', 'all', { search: searchAutoParts }]}
                          forCommand={true}
                        />
                      )
                    }}
                  />
                )}
              />
            )}
          />
        </div>

        <div className="w-full flex justify-center items-center">
          <Button
            type="submit"
            disabled={pending}
            variant={'outline'}
            className="border-2 border-primary m-0 p-0 text-base font-normal h-fit text-primary px-20 py-2"
          >
            {pending ? <LoadingSpinner /> : t('update')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
