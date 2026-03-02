import { useQuery } from '@tanstack/react-query';
import { User } from 'entities/User';

interface Result {
  auth: boolean;
  setup: boolean;
  data: User;
}

export const useClientStatus = () => {
  const { data: init } = useQuery({
    queryKey: ['client-app-status'],
    queryFn: (): Result => {
      return window.electron.ipcRenderer.sendSync('client-app-status');
    },
    initialData: (): Result => {
      return window.electron.ipcRenderer.sendSync('client-app-status');
    },
    refetchInterval: 5000, // Check auth status every 5 seconds
    refetchIntervalInBackground: true // Continue checking even when window is not focused
  });

  return {
    auth: init.auth,
    setup: init.setup,
    data: init.data
  };
};
