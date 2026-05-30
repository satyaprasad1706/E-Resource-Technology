import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, Lock, Building2, Calendar, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import { departments, semesters } from '../data/syllabus';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState(departments[0] || 'Computer Science');
  const [semester, setSemester] = useState(semesters[1] || '4th Semester');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [roleOpen, setRoleOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [semOpen, setSemOpen] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith('@iare.ac.in')) {
      return setError('Access Restricted: Registration is strictly limited to @iare.ac.in email addresses.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const res = await register({ name, email, password, role, department, semester });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-xl transition-all">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-primary dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-slate-600">
              <BookOpen className="h-6 w-6 stroke-[2.5]" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Sign up to track assignments, print syllabus details & ask Gemini AI questions
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Email Address
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
                  className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Role select */}
            <div className="relative z-30">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                System Role Type
              </label>
              <button
                type="button"
                onClick={() => {
                  setRoleOpen(!roleOpen);
                  setDeptOpen(false);
                  setSemOpen(false);
                }}
                className="w-full flex items-center justify-between pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 relative text-left"
              >
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Sparkles className="h-4.5 w-4.5" />
                </span>
                <span>{role}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setRoleOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setRole('Student');
                        setRoleOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-105 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 flex flex-col"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Student</span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-400">Curriculum, tasks uploads, consult AI tutor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('Professor');
                        setRoleOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-105 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 flex flex-col"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Professor</span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-400">Upload resources, create tasks, grade solutions</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('Admin');
                        setRoleOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-105 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 flex flex-col"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Admin</span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-400">Manage user roles, complete database outlines</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cascading dropdown selectors */}
            <div className="grid grid-cols-2 gap-3">
              {/* Department Select */}
              <div className="relative z-20">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Department
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDeptOpen(!deptOpen);
                    setRoleOpen(false);
                    setSemOpen(false);
                  }}
                  className="w-full flex items-center justify-between pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 relative text-left"
                >
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Building2 className="h-4.5 w-4.5" />
                  </span>
                  <span className="truncate pr-1">{department}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${deptOpen ? 'rotate-180' : ''}`} />
                </button>

                {deptOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDeptOpen(false)} />
                    <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {departments.map(dept => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => {
                            setDepartment(dept);
                            setDeptOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs text-slate-700 dark:text-slate-200 truncate font-semibold"
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Semester Select */}
              <div className="relative z-20">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Semester
                </label>
                <button
                  type="button"
                  disabled={role === 'Professor' || role === 'Admin'}
                  onClick={() => {
                    setSemOpen(!semOpen);
                    setRoleOpen(false);
                    setDeptOpen(false);
                  }}
                  className="w-full flex items-center justify-between pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 disabled:opacity-50 relative text-left"
                >
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar className="h-4.5 w-4.5" />
                  </span>
                  <span>{role === 'Professor' || role === 'Admin' ? 'N/A' : semester}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${semOpen ? 'rotate-180' : ''}`} />
                </button>

                {semOpen && role !== 'Professor' && role !== 'Admin' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSemOpen(false)} />
                    <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {semesters.map(sem => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => {
                            setSemester(sem);
                            setSemOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs text-slate-700 dark:text-slate-200 truncate font-semibold"
                        >
                          {sem}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating account...' : 'Register'}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <p className="text-xs text-slate-500 dark:text-slate-450">
            Already have a profile?{' '}
            <Link to="/login" className="font-bold text-primary dark:text-blue-400 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
export { Register };
