import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './providers/AuthProvider';
import { useAdminAuth } from './providers/AdminAuthProvider';

function LoadingScreen({ label }: { label: string }) {
  return <div className="auth-container"><div className="mb-state"><div className="mb-spinner"/><div>{label}</div></div></div>;
}

export function CustomerRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingScreen label="Restoring your MoodBuds session…" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return children;
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen label="Checking your MoodBuds session…" />;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { admin, isLoading } = useAdminAuth();
  const location = useLocation();
  if (isLoading) return <LoadingScreen label="Validating administrator access…" />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function AdminGuestRoute({ children }: { children: ReactNode }) {
  const { admin, isLoading } = useAdminAuth();
  if (isLoading) return <LoadingScreen label="Checking administrator access…" />;
  return admin ? <Navigate to="/admin" replace /> : children;
}
