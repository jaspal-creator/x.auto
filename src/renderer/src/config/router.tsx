import { useClientStatus } from '@/hooks/useClientStatus';
import { useGlobalAuthChecker } from '@/hooks/useCheckAuth';
import Auth from '@/pages/Auth/page';
import AutoParts from '@/pages/AutoParts/page';
import Car from '@/pages/Cars/id/page';
import Cars from '@/pages/Cars/page';
import Customer from '@/pages/Customers/id/page';
import Customers from '@/pages/Customers/page';
import Invoice from '@/pages/Invoices/id/page';
import Invoices from '@/pages/Invoices/page';
import Report from '@/pages/Report/page';
import Services from '@/pages/Services/page';
import Setup from '@/pages/Setup/page';
import Stats from '@/pages/Stats/page';
import Worker from '@/pages/Workers/id/page';
import Workers from '@/pages/Workers/page';
import * as React from 'react';
import { createHashRouter, RouterProvider } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

// Layout component that includes GlobalAuthMonitor
function LayoutWithAuthMonitor({ children }: { children: React.ReactNode }): React.ReactNode {
  const checkAuth = useGlobalAuthChecker();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(async (event) => {
      if (event?.query?.state?.data) {
        const data = event.query.state.data;

        // Only check auth for actual error responses, not successful ones
        const hasError =
          data?.Error?.msg ||
          data?.msg === 'Unauthorized' ||
          data?.msg === 'unauthorized' ||
          (data?.Error && typeof data.Error === 'object');

        if (hasError) {
          await checkAuth(data);
        }
      }
    });

    return unsubscribe;
  }, [checkAuth, queryClient]);

  return <>{children}</>;
}

export function XAutoMainRouter(): React.ReactNode {
  const { setup, auth, data } = useClientStatus();

  const AppRouter = createHashRouter([
    {
      path: '/auth',
      element: (
        <LayoutWithAuthMonitor>
          <Auth />
        </LayoutWithAuthMonitor>
      )
    },

    // WORKERS
    {
      path: '/workers',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Workers />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },
    {
      path: '/workers/:id',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Worker />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // INVOICES
    {
      path: '/invoices',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Invoices />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },
    {
      path: '/invoices/:id',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Invoice />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // AUTOPARTS
    {
      path: '/autoparts',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <AutoParts />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // SERVICES
    {
      path: '/services',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Services />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // CARS
    {
      path: '/cars',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Cars />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },
    {
      path: '/cars/:id',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Car />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // CUSTOMERS
    {
      path: '/customers',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Customers />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },
    {
      path: '/customers/:id',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Customer />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // STATS
    {
      path: '/stats',
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Stats />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // REPORT
    {
      path: `/report`,
      element: (
        <LayoutWithAuthMonitor>
          {auth ? (data.role && <Workers />) || (!data.role && <Report />) : <Auth />}
        </LayoutWithAuthMonitor>
      )
    },

    // *
    {
      path: '/',
      element: (
        <LayoutWithAuthMonitor>
          {setup ? (
            <Setup />
          ) : auth ? (
            (data.role && <Workers />) || (!data.role && <Report />)
          ) : (
            <Auth />
          )}
        </LayoutWithAuthMonitor>
      )
    }
  ]);

  return <RouterProvider router={AppRouter} />;
}
