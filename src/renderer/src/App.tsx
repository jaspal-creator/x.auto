import '@/lib/i18n';
import * as React from 'react';
import { XAutoMainRouter } from './config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNetworkStatus } from './lib/network/NetworkStatusProvider';
import { NoInternetConnection } from './lib/network/NoInternetConnection';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * parseInt(import.meta.env.RENDERER_VITE_CACHING || '5'),
      cacheTime: 1000 * 60 * parseInt(import.meta.env.RENDERER_VITE_CACHING || '5'),
      staleTime: 1000 * 60 * parseInt(import.meta.env.RENDERER_VITE_CACHING || '5')
    }
  }
});

export default function App(): React.ReactNode {
  const { isOnline } = useNetworkStatus();

  if (!isOnline) {
    return <NoInternetConnection />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <XAutoMainRouter />
    </QueryClientProvider>
  );
}
