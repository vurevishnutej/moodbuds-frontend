import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import '../styles/auth.css';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    mobile: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email is too long (max 255 characters)';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 100) {
      newErrors.firstName = 'First name is too long (max 100 characters)';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = 'Last name is too long (max 100 characters)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 10) {
      newErrors.password = 'Password must be at least 10 characters';
    } else if (formData.password.length > 72) {
      newErrors.password = 'Password is too long (max 72 characters)';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Mobile validation (optional but validate if provided)
    if (formData.mobile.trim()) {
      const mobileDigits = formData.mobile.replace(/\D/g, '');
      if (mobileDigits.length < 10 || mobileDigits.length > 15) {
        newErrors.mobile = 'Mobile number must be 10-15 digits';
      }
    }

    // Terms agreement
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Registration failed. Please try again.';

      // Handle specific error cases
      if (errorMsg.includes('409') || errorMsg.includes('already')) {
        setErrors({ form: 'Email is already registered. Please use a different email or log in.' });
      } else if (errorMsg.includes('400')) {
        setErrors({ form: 'Invalid data. Please check your inputs.' });
      } else if (errorMsg.includes('network')) {
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
      <div className="auth-box auth-box-register">
        {/* Header */}
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join MoodBuds today</p>
        </div>

        {/* Form Error */}
        {errors.form && (
          <div className="auth-error-message">
            {errors.form}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="auth-form">
          {/* Name Fields Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Mobile Field (Optional) */}
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number (Optional)</label>
            <input
              id="mobile"
              type="tel"
              placeholder="+91-9999999999"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.mobile ? 'input-error' : ''}
            />
            {errors.mobile && <span className="field-error">{errors.mobile}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
            <span className="password-hint">At least 10 characters</span>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {/* Terms Agreement */}
          <div className="form-checkbox">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (errors.terms) setErrors({ ...errors, terms: '' });
              }}
              disabled={isLoading}
            />
            <label htmlFor="terms">
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && <span className="field-error">{errors.terms}</span>}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="auth-button primary"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        {/* Sign In Link */}
        <Link to="/login" className="auth-button secondary">
          Sign In
        </Link>

        {/* Footer */}
        <p className="auth-footer">
          Creating an account means you've read and agree to our{' '}
          <a href="/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
