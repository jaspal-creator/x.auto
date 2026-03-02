import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '@/components/Loading';
import { useTranslation } from 'react-i18next';

export default function AuthForm(): React.ReactNode {
  const { t } = useTranslation(['auth']);
  const { form, onSubmit, pending } = useAuth();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t('name')}
                  className="h-fit w-full text-base font-normal p-5 rounded-lg"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder={t('paswd')}
                  className="h-fit w-full text-base font-normal p-5 rounded-lg"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          disabled={pending}
          type="submit"
          variant={'outline'}
          className="w-full h-fit border-primary border-2 py-4 font-normal text-xl text-primary rounded-lg"
        >
          {pending ? <LoadingSpinner height={30} width={30} /> : t('login')}
        </Button>
      </form>
    </Form>
  );
}
