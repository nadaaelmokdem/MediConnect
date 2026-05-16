import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    clearError();

    if (!email) {
      setLocalError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Invalid email format');
      return;
    }

    try {
      await forgotPassword(email);
      setSuccessMessage('Password reset link has been sent to your email');
      setEmail('');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to send reset email');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
            <h1 className="text-3xl font-bold text-white">🏥 MediConnect</h1>
            <p className="text-blue-100 mt-2">Healthcare Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleReset} className="px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🔐 Reset Password</h2>
            <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>

            {/* Error Message */}
            {displayError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{displayError}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{successMessage}</p>
                <p className="text-green-600 text-xs mt-2">Redirecting to sign in...</p>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={isLoading || !!successMessage}
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={isLoading || !!successMessage}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {/* Links */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-800 text-sm transition"
              >
                Remember your password? <span className="font-semibold text-blue-600">Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
