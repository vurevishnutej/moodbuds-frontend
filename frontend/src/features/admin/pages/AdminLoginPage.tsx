import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../app/providers/AdminAuthProvider';

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      const requested = (location.state as { from?: string } | null)?.from;
      navigate(requested?.startsWith('/admin') && requested !== '/admin/login' ? requested : '/admin', { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Administrator login failed');
    } finally {
      setLoading(false);
    }
  };

  return <div className="auth-container"><div className="auth-box">
    <div className="auth-header"><h1>Admin Sign In</h1><p>Authorized MoodBuds staff only</p></div>
    {error && <div className="auth-error-message">{error}</div>}
    <form className="auth-form" onSubmit={submit}>
      <div className="form-group"><label htmlFor="admin-username">Username</label><input id="admin-username" value={username} onChange={(e)=>setUsername(e.target.value)} required autoComplete="username" /></div>
      <div className="form-group"><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required autoComplete="current-password" /></div>
      <button className="auth-button primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign In to Admin'}</button>
    </form>
    <div className="auth-divider"><span>Customer storefront</span></div>
    <Link className="auth-button secondary" to="/">Return to MoodBuds</Link>
  </div></div>;
}
