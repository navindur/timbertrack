import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, useEffect, useState } from 'react';

//protect routes in a React application
interface ProtectedRouteProps {
  allowedRoles?: ('customer' | 'shopowner')[];
  children?: ReactNode;
}

//define the structure of the JWT payload
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
        const token = localStorage.getItem('authToken'); //retrieve the JWT from local storage
        
        //if no token is found, user is not authorized
        if (!token) {
          setIsAuthorized(false);
          return;
        }

        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now(); //check if the token is expired
        
        //if the token is expired, remove it from local storage and set authorization to false
        if (isExpired) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsAuthorized(false);
          return;
        }

        setIsTokenValid(true);

        //check if the user role is allowed
        //if allowedRoles is not provided, all roles are considered authorized
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

  //if the authorization status is still being determined, show a loading state
  if (isAuthorized === null) {
    return <div>Loading authentication...</div>;
  }

  //if the token is not valid or the user is not authorized, redirect to the sigin page
  if (!isTokenValid) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};