import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import { Layout } from '@/components/layout/Layout';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Enter your name';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Enter an email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Enter a password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login', {
        state: { message: 'Account created successfully. Please sign in.' }
      });
    } catch (error: any) {
      setErrors({ 
        submit: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Create an account</h1>
          
          <p className="govuk-body">
            Use this service to create an account for the Task Management Service.
          </p>

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
            <div className={`govuk-form-group ${errors.name ? 'govuk-form-group--error' : ''}`}>
              <label className="govuk-label govuk-label--m" htmlFor="name">
                Full Name
              </label>
              <div id="name-hint" className="govuk-hint">
                Enter your full name
              </div>
              {errors.name && (
                <p id="name-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span> {errors.name}
                </p>
              )}
              <input
                className={`govuk-input ${errors.name ? 'govuk-input--error' : ''}`}
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                aria-describedby={`name-hint ${errors.name ? 'name-error' : ''}`}
              />
            </div>

            <div className={`govuk-form-group ${errors.email ? 'govuk-form-group--error' : ''}`}>
              <label className="govuk-label govuk-label--m" htmlFor="email">
                Email
              </label>
              <div id="email-hint" className="govuk-hint">
                This will be used to sign in to your account
              </div>
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
                aria-describedby={`email-hint ${errors.email ? 'email-error' : ''}`}
              />
            </div>

            <div className={`govuk-form-group ${errors.password ? 'govuk-form-group--error' : ''}`}>
              <label className="govuk-label govuk-label--m" htmlFor="password">
                Password
              </label>
              <div id="password-hint" className="govuk-hint">
                Must be at least 6 characters
              </div>
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
                aria-describedby={`password-hint ${errors.password ? 'password-error' : ''}`}
              />
            </div>

            <button 
              type="submit" 
              className="govuk-button" 
              data-module="govuk-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="govuk-body">
            <Link to="/login" className="govuk-link">
              Already have an account? Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};