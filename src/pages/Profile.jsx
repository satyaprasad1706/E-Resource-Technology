import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Clock, Award, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { departments, semesters } from '../data/syllabus';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  
  // Profile edit states
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science');
  const [semester, setSemester] = useState(currentUser?.semester || '4th Semester');
  
  // Password edit states (UI only)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setLoading(true);

    setTimeout(() => {
      const res = updateProfile({ name, email, department, semester });
      if (res.success) {
        setProfileSuccess('Profile metadata updated successfully! changes reflected instantly in E-Resource headers.');
      }
      setLoading(false);
    }, 800);
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    setPassSuccess('');
    if (!oldPassword || !newPassword) return;

    setLoading(true);
    setTimeout(() => {
      setPassSuccess('Security credentials successfully re-hashed! Note: Password change mock is complete.');
      setOldPassword('');
      setNewPassword('');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 transition-colors duration-250">
      
      {/* Student Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-150 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6 transition-colors">
        {/* Avatar initials */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-black text-3xl shadow-md border-4 border-blue-100 dark:border-slate-750 flex-shrink-0 select-none">
          {currentUser?.name ? currentUser.name.charAt(0) : 'S'}
        </div>
        {/* Profile info details */}
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              {currentUser?.name || 'Rahul Sharma'}
            </h2>
            <p className="text-xs text-primary dark:text-blue-400 font-bold uppercase tracking-wider mt-0.5">
              Registration Role: {currentUser?.role || 'Student'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-2">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 justify-center md:justify-start">
              <Award className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Reg No: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser?.regNo || '2022CSE1042'}</span></span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 justify-center md:justify-start">
              <GraduationCap className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Branch: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser?.department}</span></span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 justify-center md:justify-start">
              <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Semester: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser?.semester}</span></span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 justify-center md:justify-start">
              <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>Email: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser?.email}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Card: Update details form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-150 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Update Student Profile
            </h3>
            <p className="text-[11px] text-slate-400">
              Modify personal details and branch indicators
            </p>
          </div>

          {profileSuccess && (
            <div className="flex items-start space-x-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-xl text-xs border border-emerald-100 dark:border-emerald-900/40">
              <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                >
                  {semesters.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition"
            >
              {loading ? 'Saving...' : 'Update Details'}
            </button>
          </form>
        </div>

        {/* Right Card: Change password mock form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-150 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Change Security Password
            </h3>
            <p className="text-[11px] text-slate-400">
              Update password credentials (simulated demonstration)
            </p>
          </div>

          {passSuccess && (
            <div className="flex items-start space-x-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-xl text-xs border border-emerald-100 dark:border-emerald-900/40">
              <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{passSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePassSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Old Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs shadow-sm transition"
            >
              Update Password
            </button>
          </form>
        </div>

      </div>

      {/* Security alert footer banner */}
      <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs border border-red-100 dark:border-red-900/40">
        <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
        <span>Security Alert: Protect your personal registration details to maintain high evaluation safety marks.</span>
      </div>

    </div>
  );
};

export default Profile;
export { Profile };
