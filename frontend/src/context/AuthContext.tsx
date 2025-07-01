import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

//AuthContext for managing user authentication state in a React application
interface User {
  id: number;
  email: string;
  role: 'customer' | 'shopowner'; // can be either customer or shopowner
}

// Customer type definition
interface Customer {
  customer_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
}

// AuthContext type definition
interface AuthContextType {
  user: User | null;
  customer: Customer | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Create the context

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//state for user customer and loading status
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setUser(response.data.user);
          if (response.data.customer) {
            setCustomer(response.data.customer);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user, customer } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      if (customer) {
        setCustomer(customer);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCustomer(null);
  };

  const value = {
    user,
    customer,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

//custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};