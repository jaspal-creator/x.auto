import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchByVin } from '../hooks/useSearchByVin';
import { useTranslation } from 'react-i18next';

export default function SearchVinCode(): React.ReactNode {
  const { t } = useTranslation(['report'], { keyPrefix: 'search_vin' });
  const { form, onSubmit } = useSearchByVin();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 border-2 border-[#E1E1E1] p-6 rounded-[20px] shadow-md"
      >
        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl font-normal">{t('label')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t('vin')}
                  className="text-xl w-[650px] border-2 border-[#E1E1E1] rounded-lg required:text-xl h-fit py-2 outline-none ring-0 focus-visible:ring-0 focus-visible:outline-none"
                  required
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={'outline'}
          className="w-full h-fit border-primary m-0 p-0 text-xl font-normal text-primary py-2"
        >
          {t('go')}
        </Button>
      </form>
    </Form>
  );
}
