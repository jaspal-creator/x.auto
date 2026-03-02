import { Response, STATUS } from 'interfaces/response.type';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useLogout } from '@/features/auth/hooks/useLogout';

// Global variable to track recent login
let lastLoginTime = 0;
export const setLastLoginTime = () => {
  lastLoginTime = Date.now();
};

const isRecentLogin = () => {
  const timeSinceLogin = Date.now() - lastLoginTime;
  return timeSinceLogin < 3000; // 3 seconds grace period
};

export const useCheckAuth = () => {
  const redirect = useNavigate();
  const queryClient = useQueryClient();
  const { exit } = useLogout();

  return async (err?: Omit<Response, 'Success'>) => {
    // Check for various unauthorized error formats
    const isUnauthorized =
      err?.Error?.msg === STATUS.Unauthorized ||
      err?.Error?.msg === 'Unauthorized' ||
      err?.Error?.msg === 'unauthorized' ||
      err?.Error?.msg === '401' ||
      (err as any)?.msg === 'Unauthorized' || // Direct msg property
      (err as any)?.msg === 'unauthorized' ||
      (err as any)?.msg === STATUS.Unauthorized ||
      (err as any)?.status === 401 ||
      (err as any)?.statusCode === 401;

    if (isUnauthorized) {
      if (isRecentLogin()) {
        return; // Skip logout during grace period
      }

      try {
        await exit(); // Call logout first
      } catch (error) {
        console.error('Logout error:', error);
        // Still invalidate queries as fallback
        queryClient.invalidateQueries({ queryKey: ['client-app-status'] });
      }
      redirect('/auth');
    }
  };
};

// Global auth checker that can be used anywhere
export const useGlobalAuthChecker = () => {
  const redirect = useNavigate();
  const queryClient = useQueryClient();
  const { exit } = useLogout();

  return async (response?: any) => {
    // Check for various unauthorized error formats
    const isUnauthorized =
      response?.Error?.msg === STATUS.Unauthorized ||
      response?.Error?.msg === 'Unauthorized' ||
      response?.Error?.msg === 'unauthorized' ||
      response?.Error?.msg === '401' ||
      (response as any)?.msg === 'Unauthorized' || // Direct msg property
      (response as any)?.msg === 'unauthorized' ||
      (response as any)?.msg === STATUS.Unauthorized ||
      (response as any)?.status === 401 ||
      (response as any)?.statusCode === 401;

    if (isUnauthorized) {
      if (isRecentLogin()) {
        return false; // Skip logout during grace period
      }

      try {
        await exit(); // Call logout first
      } catch (error) {
        console.error('Logout error:', error);
        // Still invalidate queries as fallback
        queryClient.invalidateQueries({ queryKey: ['client-app-status'] });
      }
      redirect('/auth');
      return true; // Return true if logout was triggered
    }
    return false;
  };
};
