import * as React from 'react';
import CarsLayout, { CarsContext } from './context/context';
import Utilities from '@/components/Utilities/Utilities';
import { useFiltration } from '@/hooks/useFiltration';
import PaginationUtility from '@/components/Pagination/Pagination';
import { useGetCars } from '@/features/cars/hooks/useGetCars';
import CreateCar from '@/features/cars/forms/CreateCar';
import MainTable from '@/components/Table/MainTable';
import { Car } from 'entities/Car';
import UpdateCar from '@/features/cars/forms/UpdateCar';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLetter';
import CreateReport from '@/features/reports/forms/CreateReport';
import { useTranslation } from 'react-i18next';

export default function Cars(): React.ReactNode {
  const { t } = useTranslation(['cars']);
  const [type, setType] = React.useState<Readonly<'MARK' | 'MODEL' | 'VIN' | 'NUMBER'>>('MARK');
  const { query, setSearch, setSort, setPage, getTotalPages, page } = useFiltration();
  const { cars, loading } = useGetCars({ query: { ...query, type } });

  return (
    <CarsLayout>
      {/* TOP UTILITIES */}
      <Utilities<typeof type>
        title={t('title')}
        search={(_) => setSearch(_)}
        sort={setSort}
        categories={['MARK', 'MODEL', 'NUMBER', 'VIN']}
        onCategoryChange={setType}
        defaultCategory={type}
        create={{
          btn: t('create_btn'),
          form: <CreateCar invalidateKeys={['cars', { ...query, type }]} />,
          context: CarsContext,
          open: `openSheet`,
          setOpen: 'setOpenSheet'
        }}
      />

      {/* MAIN TABLE */}
      <MainTable<Car>
        loadingState={loading}
        // CONTENT DISPLAY
        tableHeader={[
          t('table.cars.brand'),
          t('table.cars.model'),
          t('table.cars.car_number'),
          t('table.cars.vin'),
          t('table.cars.customer'),
          t('table.cars.action')
        ]}
        tableContent={cars?.data as Car[]}
        tableRow={() => ['brand', 'model', 'car_number', 'vin', 'customer.name' as any]}
        // DEFINE ACTIONS
        tableActions={['UPDATE', 'PREVIEW', 'REPORT']}
        // REPORT ACTION
        reportAction={{
          condition: ({ customer }) => {
            return customer ? true : false;
          },
          conditionToast: ({ vin }) => {
            return {
              title: t('no_customer.title'),
              description: `${t('no_customer.car')} ${vin} ${t('no_customer.no')}`
            };
          },
          title: ({ brand, model, year }) =>
            `${capitalizeFirstLetter(brand)} ${capitalizeFirstLetter(model)} (${year})`,
          content: (car: Car) => (
            <CreateReport car={car} invalidateKeys={['cars', { ...query, type }]} />
          )
        }}
        // UPDATE ACTION
        updateAction={{
          type: 'SHEET',
          form: (car: Car) => <UpdateCar car={car} invalidateKeys={['cars', { ...query, type }]} />
        }}
        // PREVIEW ACTION
        previewAction={{
          type: 'REDIRECTION',
          href: ({ id }): string => `/cars/${id}`
        }}
      />

      {/* PAGINATION */}
      <PaginationUtility
        page={page}
        setPage={setPage}
        pages={getTotalPages(cars?.count as number)}
      />
    </CarsLayout>
  );
}
