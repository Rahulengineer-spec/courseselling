import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

export function ProtectedRoute({ children, requiresSubscription = false }: ProtectedRouteProps) {
  const { user, subscription } = useAuthStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiresSubscription && subscription !== 'premium') {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
}