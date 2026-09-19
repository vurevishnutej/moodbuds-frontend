import { useState, type FormEvent } from 'react';
import { adminAuthService } from '../services/adminAuthService';
import { ApiError } from '../../../services/api/apiClient';

export function AdminLoginGate({ onSignedIn }: { onSignedIn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter your username and password');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await adminAuthService.login(username.trim(), password);
      onSignedIn();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Invalid username or password');
      } else if (err instanceof ApiError) {
        setError(err.message || "Couldn't sign in");
      } else {
        setError("Can't reach the API — is the backend running on localhost:8080?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-stage" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: '100%', maxWidth: 360, background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 28 }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: '#131722', marginBottom: 2 }}>Admin sign in</div>
        <div style={{ fontSize: 12, color: '#9a9a9a', marginBottom: 20 }}>MoodBuds admin console</div>

        <div className="adm-field">
          <label htmlFor="admin-username">Username</label>
          <input id="admin-username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus placeholder="owner" />
        </div>
        <div className="adm-field">
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {error && (
          <div style={{ fontSize: 12, color: '#e5484d', background: '#fdecec', borderRadius: 8, padding: '8px 12px', marginBottom: 14 }}>
            {error}
          </div>
        )}

        <button type="submit" className="adm-btn primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
