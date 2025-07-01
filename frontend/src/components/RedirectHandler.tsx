import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

//handles redirectiomn based on user role at the start
const RedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role === 'shopowner') {
          navigate('/dashboard');
        }
      }
    }
  }, [location.pathname, navigate]);

  return null; 
};

export default RedirectHandler;
