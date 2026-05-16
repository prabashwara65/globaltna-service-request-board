'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#151517' }}>
      <div className="max-w-md w-full mx-4">
        <div style={{ backgroundColor: '#212023', border: '1px solid #2A2A2E' }}>
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm text-center mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3" style={{ backgroundColor: '#F84738', color: 'white', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                    style={{ backgroundColor: '#1A1A1E' }}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                    style={{ backgroundColor: '#1A1A1E' }}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white px-4 py-2.5 text-sm font-medium transition disabled:opacity-50"
                  style={{ backgroundColor: '#027FDB' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0268B5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#027FDB'}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <Link href="/register" className="hover:underline" style={{ color: '#027FDB' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}