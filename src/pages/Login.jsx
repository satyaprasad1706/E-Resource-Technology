import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Google Authentication failed.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-xl transition-all">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-primary dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-slate-600">
              <BookOpen className="h-6 w-6 stroke-[2.5]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Sign In to E-Resource
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Access resources, syllabus modules, assignments & Gemini AI Assistant
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 rounded-xl text-xs border border-red-100 dark:border-red-900/40">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@iare.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary dark:text-blue-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-slate-350 rounded"
              defaultChecked
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-550 dark:text-slate-400 select-none">
              Remember my session
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-550 text-xs font-semibold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-center space-x-2.5 active:scale-[0.99] transform"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
              />
              <path
                fill="#34A853"
                d="M16.04 15.345c-1.077.73-2.436 1.146-4.04 1.146a7.077 7.077 0 0 1-6.734-4.856L1.24 14.75C3.198 18.702 7.27 21.4 12 21.4c2.93 0 5.604-1.042 7.556-2.825l-3.516-3.23z"
              />
              <path
                fill="#4285F4"
                d="M22.545 12c0-.773-.07-1.52-.195-2.236H12v4.282h5.922a5.074 5.074 0 0 1-2.197 3.327l3.516 3.23c2.057-1.895 3.304-4.686 3.304-8.603z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 11.645a7.03 7.03 0 0 1 0-2.38L1.24 6.15a11.968 11.968 0 0 0 0 10.6l4.026-3.105z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <p className="text-xs text-slate-500 dark:text-slate-450">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary dark:text-blue-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
export { Login };
