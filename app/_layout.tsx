import { QueryClientProvider } from '@tanstack/react-query';
import ErrorPanel from '@template/components/error-panel/error-panel';
import { queryClient } from '@template/config/query-client';
import '@template/i18n';
import '@template/styles/global.css';
import { ErrorBoundaryProps, Slot } from 'expo-router';

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorPanel {...props} />;
}
