import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import '../styles/auth.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 10) {
      newErrors.password = 'Password must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      const requested = (location.state as { from?: string } | null)?.from;
      navigate(requested?.startsWith('/') ? requested : '/', { replace: true });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed. Please try again.';

      // Handle specific error cases
      if (errorMsg.includes('401') || errorMsg.includes('Invalid')) {
        setErrors({ form: 'Invalid email or password' });
      } else if (errorMsg.includes('network') || errorMsg.includes('connect')) {
        setErrors({ form: 'Network error. Please check your connection.' });
      } else {
        setErrors({ form: errorMsg });
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Header */}
        <div className="auth-header">
          <h1>Sign In</h1>
          <p>Welcome back to MoodBuds</p>
        </div>

        {/* Form Error */}
        {errors.form && (
          <div className="auth-error-message">
            {errors.form}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              disabled={isLoading}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="auth-button primary"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Don't have an account?</span>
        </div>

        {/* Sign Up Link */}
        <Link to="/register" className="auth-button secondary">
          Create Account
        </Link>

        {/* Footer */}
        <p className="auth-footer">
          By signing in, you agree to our{' '}
          <a href="/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
