import { Form, FormField } from '@/components/ui/form';
import { Car } from 'entities/Car';
import * as React from 'react';
import Field from '../components/field';
import CarNumberField from '../components/car-number-field';
import { useClientStatus } from '@/hooks/useClientStatus';
import { Button } from '@/components/ui/button';
import CommandSearch from '../components/command-search';
import ItemsArea from '../components/items-area';
import CreateService from '@/features/services/forms/CreateService';
import CreateAutoPart from '@/features/auto-parts/forms/CreateAutoPart';
import { useGetAllServices } from '@/features/services/hooks/useGetAllServices';
import { useGetAllAutoParts } from '@/features/auto-parts/hooks/useGetAllAutoParts';
import { useCreateReport } from '../hooks/useCreateReport';
import { LoadingSpinner } from '@/components/Loading';
import { User } from 'entities/User';
import { useTranslation } from 'react-i18next';
import { useFiltration } from '@/hooks/useFiltration';
import SingleToggleMaster from '../components/single-toggle-master';

interface Props {
  car: Car;
  invalidateKeys: any[];
}

export default function CreateReport({ car, invalidateKeys }: Props): React.ReactNode {
  const { query } = useFiltration();
  console.log('Query:', query); // Using query variable
  const { t } = useTranslation(['report'], { keyPrefix: 'create' });
  const { data } = useClientStatus();

  const [user, setUser] = React.useState<User>(data);

  const { form, onSubmit, pending } = useCreateReport({ car, invalidateKeys });
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
            value={car.customer.name || car.customer.fiscal_code}
            disabled
          />
          <Field form={form} label={t('vin')} value={car.vin} disabled />
          <CarNumberField
            form={form}
            name="car_number"
            label={t('car_number')}
            placeHolder={t('car_number')}
            required
          />
          <Field
            form={form}
            name="mileage"
            label={t('mileage')}
            placeHolder={t('mileage')}
            required
          />
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
            {pending ? <LoadingSpinner /> : t('save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
