import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: ('customer' | 'shopowner')[];
  children?: ReactNode;
}

interface JwtPayload {
  userId: string;
  role: 'customer' | 'shopowner';
  exp: number;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setIsAuthorized(false);
          return;
        }

        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (isExpired) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsAuthorized(false);
          return;
        }

        setIsTokenValid(true);
        
        if (allowedRoles) {
          const userRole = decoded.role;
          setIsAuthorized(allowedRoles.includes(userRole));
        } else {
          
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthorized(false);
      }
    };

    verifyAuth();
  }, [location, allowedRoles]);

  if (isAuthorized === null) {
    return <div>Loading authentication...</div>;
  }

  if (!isTokenValid) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};