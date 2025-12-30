import ErrorPanel from '@template/components/error-panel/error-panel';
import { ErrorBoundaryProps, Slot } from 'expo-router';

export default function AppLayout() {
  return <Slot />;
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorPanel {...props} />;
}
