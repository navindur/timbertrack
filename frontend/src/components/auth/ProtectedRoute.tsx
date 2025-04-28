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

        // Decode token to check expiration
        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (isExpired) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsAuthorized(false);
          return;
        }

        setIsTokenValid(true);
        
        // Check roles if specified
        if (allowedRoles) {
          const userRole = decoded.role;
          setIsAuthorized(allowedRoles.includes(userRole));
        } else {
          // If no roles specified, just require authentication
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
    // Show loading indicator while checking auth
    return <div>Loading authentication...</div>;
  }

  if (!isTokenValid) {
    // Redirect to login if not authenticated or token expired
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // Redirect to unauthorized page if role doesn't match
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Render children or outlet if authorized
  return children ? children : <Outlet />;
};