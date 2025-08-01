import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface RoleProtectedComponentProps {
  children: React.ReactNode;
  requiredRole: 'user' | 'admin' | 'super_admin';
  fallback?: React.ReactNode;
}

const RoleProtectedComponent: React.FC<RoleProtectedComponentProps> = ({ 
  children, 
  requiredRole, 
  fallback 
}) => {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasAccess = () => {
    if (!role) return false;
    
    switch (requiredRole) {
      case 'super_admin':
        return role === 'super_admin';
      case 'admin':
        return role === 'admin' || role === 'super_admin';
      case 'user':
        return true; // All authenticated users have user access
      default:
        return false;
    }
  };

  if (!hasAccess()) {
    return fallback || (
      <Alert className="m-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. This requires {requiredRole} role.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default RoleProtectedComponent;