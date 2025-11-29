import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect ke Login, TAPI bawa info "state" (asalnya dari mana)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}