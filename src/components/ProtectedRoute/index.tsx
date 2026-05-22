import { Navigate, useLocation } from 'react-router-dom';
import { getRole, hasLgpdConsent, type UserRole } from '../../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const role = getRole();

  if (!hasLgpdConsent()) {
    return <Navigate to="/privacidade" state={{ from: location.pathname }} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    const loginPath =
      role === 'professor' ? '/login/professor' : role === 'admin' ? '/login/admin' : '/login/aluno';
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
