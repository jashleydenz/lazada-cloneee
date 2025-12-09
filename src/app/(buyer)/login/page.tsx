'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state: any) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user, token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* Logo/Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-2">
            <span className="text-gray-600">📦</span>
          </div>
          <span className="text-sm text-gray-600">Sign In / Sign Up</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button className="pb-3 font-semibold text-gray-900 border-b-2 border-orange-500">Password</button>
          <button className="pb-3 text-gray-600 hover:text-gray-900">Phone Number</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please enter your Phone or Email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? '👁️' : '✓'}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600 disabled:opacity-50 mb-4 text-sm"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm mb-6 text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-900 font-semibold">
            Sign up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-500">Or, login with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 text-sm">
            <span>🔵</span>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 text-sm">
            <span>📘</span>
            Facebook
          </button>
        </div>
      </div>
    </main>
  );
}
