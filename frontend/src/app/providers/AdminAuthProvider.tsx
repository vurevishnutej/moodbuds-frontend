import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { adminQuizService, type AdminSummary } from '../../features/admin/services/adminQuizService';

interface AdminAuthContextValue {
  admin: AdminSummary | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void adminQuizService.validate().then((value) => {
      if (active) setAdmin(value);
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    const loggedIn = (event: Event) => setAdmin((event as CustomEvent<AdminSummary>).detail);
    const loggedOut = () => setAdmin(null);
    window.addEventListener('moodbuds:admin-login', loggedIn);
    window.addEventListener('moodbuds:admin-logout', loggedOut);
    return () => {
      active = false;
      window.removeEventListener('moodbuds:admin-login', loggedIn);
      window.removeEventListener('moodbuds:admin-logout', loggedOut);
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setAdmin(await adminQuizService.login(username, password));
  }, []);
  const logout = useCallback(() => adminQuizService.logout(), []);
  const value = useMemo(() => ({ admin, isLoading, login, logout }), [admin, isLoading, login, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}
