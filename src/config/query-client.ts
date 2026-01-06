import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidateQueries) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta.invalidateQueries as readonly unknown[],
          });
        }
      },
    },
  },
});
