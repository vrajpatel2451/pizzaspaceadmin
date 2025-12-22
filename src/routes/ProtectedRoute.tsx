import ForbiddenPage from "@/components/shared/ForbiddenPage";
import { usePermissions } from "@/hooks/usePermissions";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

/**
 * Wrapper component that checks route-level permissions
 * Shows 403 page if user doesn't have access to the current route
 */
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { pathname } = useLocation();
  const { checkRouteAccess, role } = usePermissions();

  const hasAccess = useMemo(() => {
    if (!role) return false;
    return checkRouteAccess(pathname);
  }, [checkRouteAccess, pathname, role]);

  if (!hasAccess) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
