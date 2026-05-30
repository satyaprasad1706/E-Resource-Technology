import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, BookOpen, User, ShieldAlert, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/resources', label: 'Resources' },
        { path: '/syllabus', label: 'Syllabus' },
        { path: '/assignments', label: 'Assignments' },
        { path: '/ai-assistant', label: 'AI Assistant' },
      ]
    : [
        { path: '/', label: 'Home' },
      ];

  const getActiveStyles = ({ isActive }) =>
    isActive
      ? 'border-primary text-primary dark:text-blue-400 border-b-2 font-semibold px-1 h-full inline-flex items-center text-sm transition duration-150 ease-in-out'
      : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:border-slate-300 border-b-2 px-1 h-full inline-flex items-center text-sm font-medium transition duration-150 ease-in-out';

  const getMobileActiveStyles = ({ isActive }) =>
    isActive
      ? 'bg-blue-50 dark:bg-slate-800 border-l-4 border-primary text-primary dark:text-blue-400 block pl-3 pr-4 py-2 text-base font-semibold'
      : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 block pl-3 pr-4 py-2 text-base font-medium';

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
      case 'Professor':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      default:
        return 'bg-blue-50 text-primary dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50';
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2 text-primary dark:text-blue-400 font-bold text-xl tracking-tight">
                <BookOpen className="h-6 w-6 stroke-[2.5]" />
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">E-Resource</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6 h-full items-stretch">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={getActiveStyles}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l pl-4 border-slate-200 dark:border-slate-700">
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-blue-400 font-bold border border-blue-200 dark:border-slate-600">
                    {currentUser?.name ? currentUser.name.charAt(0) : <User className="h-4 w-4" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-blue-400">
                      {currentUser?.name || 'User'}
                    </p>
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold border ${getRoleBadgeColor(currentUser?.role)}`}>
                      {currentUser?.role || 'Student'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu Icon */}
          <div className="-mr-2 flex items-center sm:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={getMobileActiveStyles}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="pt-4 pb-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center px-4 space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-blue-400 font-bold border border-blue-200 dark:border-slate-600">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                    <span>{currentUser?.name}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold border ${getRoleBadgeColor(currentUser?.role)}`}>
                      {currentUser?.role}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{currentUser?.email}</div>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-4 border-t border-slate-200 dark:border-slate-700 px-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center block px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center block px-4 py-2 bg-primary text-white rounded-md text-base font-medium hover:bg-primary-dark shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
export { Navbar };
