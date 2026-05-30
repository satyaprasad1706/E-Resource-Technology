import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@iare.ac.in')) {
      alert("Access Restricted: recovery is limited to @iare.ac.in accounts.");
      return;
    }
    // Simulate API link dispatch
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-xl transition-all">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-primary dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-slate-600">
              <BookOpen className="h-6 w-6 stroke-[2.5]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
            We will email you a password recovery verification link
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Recovery Link Dispatched
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                An email has been sent to <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span> with instructions to reset your password.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center text-xs font-semibold text-primary dark:text-blue-400 hover:underline"
            >
              Didn't receive email? Try again
            </button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Student Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="rahul.sharma@iare.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Send Recovery Link</span>
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <Link to="/login" className="inline-flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
