import { useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
  const queryClient = useQueryClient();

  const exit = async () => {
    try {
      await window.xauto.resolveMutation('AUTH:LOGOUT:MUTATE', {});
      queryClient.invalidateQueries({ queryKey: ['client-app-status'] });
    } catch (error) {
      console.error('Error in logout process:', error);
      throw error;
    }
  };

  return { exit };
};
