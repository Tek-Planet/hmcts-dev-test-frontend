import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const successMessage = location.state?.message;

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Enter your password';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password
      });
      
      // Use the user data returned from API
      await login(response.token, response.user);

    } catch (error: any) {
      setErrors({ 
        submit: error.message || 'Sign in failed. Check your email address and password.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Welcome Back</h1>
          
          <p className="govuk-body">
            Sign in to your account.
          </p>

          {successMessage && (
            <div className="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
              <div className="govuk-notification-banner__header">
                <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
                  Success
                </h2>
              </div>
              <div className="govuk-notification-banner__content">
                <p className="govuk-notification-banner__heading">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary">
              <h2 className="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  <li>{errors.submit}</li>
                </ul>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`govuk-form-group ${errors.email ? 'govuk-form-group--error' : ''}`}>
              <label className="govuk-label govuk-label--m" htmlFor="email">
                Email
              </label>
              {errors.email && (
                <p id="email-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span> {errors.email}
                </p>
              )}
              <input
                className={`govuk-input ${errors.email ? 'govuk-input--error' : ''}`}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                aria-describedby={errors.email ? 'email-error' : ''}
                autoComplete="email"
              />
            </div>

            <div className={`govuk-form-group ${errors.password ? 'govuk-form-group--error' : ''}`}>
              <label className="govuk-label govuk-label--m" htmlFor="password">
                Password
              </label>
              {errors.password && (
                <p id="password-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span> {errors.password}
                </p>
              )}
              <input
                className={`govuk-input ${errors.password ? 'govuk-input--error' : ''}`}
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                aria-describedby={errors.password ? 'password-error' : ''}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="govuk-button" 
              data-module="govuk-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="govuk-body">
            <p className='mb-3'>
              <Link to="/forgot-password" className="govuk-link">
                Forgotten your password?
              </Link>
            </p>
            <p>
              <Link to="/register" className="govuk-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};