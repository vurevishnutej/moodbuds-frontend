import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService, type AuthResponse, type CustomerInfo } from '../../services/auth/authService';
import { useToast } from './ToastProvider';

interface AuthContextValue {
  customer: CustomerInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Try to restore customer info from localStorage
          const storedCustomer = localStorage.getItem('moodbuds_customer');
          if (storedCustomer) {
            try {
              setCustomer(JSON.parse(storedCustomer));
            } catch (err) {
              console.debug('Could not parse stored customer data');
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.login({ email, password });
      console.log('Login response received:', response);
      console.log('Setting customer:', response.customer);
      setCustomer(response.customer);
      toast.success('Login successful');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const register = useCallback(async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.register({ email, password, firstName, lastName });
      setCustomer(response.customer);
      toast.success('Registration successful');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await authService.logout();
      setCustomer(null);
      toast.success('Logged out');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: !!customer,
      isLoading,
      login,
      register,
      logout,
      clearError,
      error,
    }),
    [customer, isLoading, login, register, logout, clearError, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
