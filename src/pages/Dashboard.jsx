import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getResources, getAssignments, getUsers, updateUserRole, addResource, addAssignment 
} from '../firebase/database';
import { 
  BookOpen, Calendar, Brain, FileText, ArrowRight, Download, CheckSquare, Users, Award, ShieldAlert, Sparkles, UserPlus 
} from 'lucide-react';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  const [resourceCount, setResourceCount] = useState(0);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin user edit states
  const [editingUid, setEditingUid] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  // Professor grading modal state (on dashboard for easy action!)
  const [gradingTarget, setGradingTarget] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await getResources();
      setResourceCount(res.length);

      const assign = await getAssignments();
      setAssignmentsList(assign);

      const users = await getUsers();
      setUsersList(users);
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRoleChangeSubmit = async (uid) => {
    if (!selectedRole) return;
    await updateUserRole(uid, selectedRole);
    alert(`✅ Role successfully updated to ${selectedRole}!`);
    setEditingUid(null);
    fetchDashboardData();
  };

  // Compute metrics
  const totalResources = resourceCount;
  const pendingAssignments = assignmentsList.filter(a => a.status === 'Pending' || a.status === 'Overdue').length;
  const submittedAssignments = assignmentsList.filter(a => a.status === 'Submitted').length;
  const ungradedSubmissions = assignmentsList.filter(a => a.status === 'Submitted' && (a.score === null || a.score === undefined));

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!score || isNaN(score)) {
      alert("Please enter a valid numeric score");
      return;
    }
    
    // Update local storage / firestore
    const updatedAssignments = assignmentsList.map(a => 
      a.id === gradingTarget.id 
        ? { ...a, score: Number(score), feedback } 
        : a
    );
    setAssignmentsList(updatedAssignments);
    
    // Write back to database helper
    const list = JSON.parse(localStorage.getItem('e_assignments') || '[]');
    const backToDb = list.map(a => 
      a.id === gradingTarget.id 
        ? { ...a, score: Number(score), feedback } 
        : a
    );
    localStorage.setItem('e_assignments', JSON.stringify(backToDb));

    alert(`✅ Graded solved assignment successfully!`);
    setGradingTarget(null);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">Loading E-Resource Database...</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD VIEW
  // ----------------------------------------------------
  if (currentUser?.role === 'Admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-250">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 md:p-8 text-white shadow-md">
          <div className="space-y-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              🛡️ System Authorization: Administrator
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold">Welcome, Admin Console!</h2>
            <p className="text-sm text-emerald-100 max-w-xl">
              You have full read/write database CRUD permissions. Manage user profiles, update academic roles, and clear resources.
            </p>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon={Users} label="Total Users" value={usersList.length} subtext="Registered members" color="emerald" />
          <StatCard icon={FileText} label="Total Resources" value={totalResources} subtext="Uploaded modules" color="blue" />
          <StatCard icon={Calendar} label="Active Assignments" value={assignmentsList.length} subtext="Assigned tasks" color="amber" />
          <StatCard icon={CheckSquare} label="Submissions Received" value={submittedAssignments} subtext="Graded & Awaiting" color="indigo" />
        </div>

        {/* User Role Management Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-150 dark:border-slate-700 card-shadow transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
                User Directory & Role Approver Panel
              </h3>
              <p className="text-[11px] text-slate-400">
                Edit and approve roles (change Student to Professor or Admin in real-time)
              </p>
            </div>
            <Users className="h-5 w-5 text-emerald-500" />
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Branch Info</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-750 text-xs">
                {usersList.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{user.name}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-550 dark:text-slate-400">
                      {user.department} {user.semester ? `• ${user.semester}` : ''}
                    </td>
                    <td className="py-3.5 px-4">
                      {editingUid === user.uid ? (
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="px-2 py-1 border border-slate-200 dark:border-slate-650 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="Student">Student</option>
                          <option value="Professor">Professor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          user.role === 'Admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' :
                          user.role === 'Professor' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900' :
                          'bg-blue-50 text-primary border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {editingUid === user.uid ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleRoleChangeSubmit(user.uid)}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-[10px] font-bold shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUid(null)}
                            className="px-2.5 py-1 border border-slate-200 dark:border-slate-650 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        user.uid !== currentUser.uid ? (
                          <button
                            onClick={() => {
                              setEditingUid(user.uid);
                              setSelectedRole(user.role);
                            }}
                            className="text-xs font-semibold text-primary dark:text-blue-400 hover:underline"
                          >
                            Change Role
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Self Account</span>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global CRUD shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/resources" className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl card-shadow flex items-center justify-between hover:shadow-md transition card-hover">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-blue-400 border border-blue-100 dark:border-slate-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Add or Delete Learning Assets</h4>
                <p className="text-xs text-slate-400">Manage notes, e-books, PPT files directly in the library</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link to="/syllabus" className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl card-shadow flex items-center justify-between hover:shadow-md transition card-hover">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Modify Syllabus Curriculum</h4>
                <p className="text-xs text-slate-400">Append or structure chapter guidelines dynamically</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // PROFESSOR DASHBOARD VIEW
  // ----------------------------------------------------
  if (currentUser?.role === 'Professor') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-250">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-6 md:p-8 text-white shadow-md">
          <div className="space-y-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              👨‍🏫 Academic Authority: Professor
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold">Welcome, {currentUser?.name}!</h2>
            <p className="text-sm text-amber-100 max-w-xl">
              Create assignments, upload curriculum slides, and grade student submissions in real-time.
            </p>
          </div>
        </div>

        {/* Professor Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon={FileText} label="Total Resources" value={totalResources} subtext="Uploaded in database" color="blue" />
          <StatCard icon={Calendar} label="Assignments Active" value={assignmentsList.length} subtext="Class tasks" color="amber" />
          <StatCard icon={CheckSquare} label="Total Submissions" value={submittedAssignments} subtext="Received from students" color="indigo" />
          <StatCard icon={Sparkles} label="Pending Grading" value={ungradedSubmissions.length} subtext="Awaiting review scores" color="rose" />
        </div>

        {/* Submissions Grading Center */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-150 dark:border-slate-700 card-shadow transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-amber-500" />
                Submitted Solutions Grading Vault
              </h3>
              <p className="text-[11px] text-slate-400">
                Grade student answers, allocate points, and write constructive remarks
              </p>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded">
              {ungradedSubmissions.length} pending review
            </span>
          </div>

          {ungradedSubmissions.length > 0 ? (
            <div className="space-y-3">
              {ungradedSubmissions.map((sub) => (
                <div key={sub.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{sub.title}</h4>
                    <p className="text-xs text-primary dark:text-blue-400 font-semibold">{sub.subject}</p>
                    <div className="flex flex-wrap gap-x-4 text-[10px] text-slate-400 pt-1">
                      <span><strong>Student:</strong> {sub.submittedBy || 'Rahul Sharma'}</span>
                      <span>•</span>
                      <span><strong>File:</strong> {sub.submittedFile}</span>
                      <span>•</span>
                      <span><strong>Date:</strong> {sub.submittedDate}</span>
                    </div>
                    {sub.submissionNotes && (
                      <p className="text-[11px] text-slate-500 italic mt-2 bg-white dark:bg-slate-800 p-2 rounded border">
                        Notes: "{sub.submissionNotes}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setGradingTarget(sub);
                      setScore('');
                      setFeedback('');
                    }}
                    className="self-start md:self-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition"
                  >
                    Grade & Score
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 border">
              <CheckSquare className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All submissions fully evaluated!</p>
              <p className="text-[10px] text-slate-400">There are currently no student solution uploads pending grading.</p>
            </div>
          )}
        </div>

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/resources" className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl card-shadow flex items-center justify-between hover:shadow-md transition card-hover">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Upload Core Slides</h4>
              <p className="text-[10px] text-slate-400">Append PPTs and Notes</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
          <Link to="/assignments" className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl card-shadow flex items-center justify-between hover:shadow-md transition card-hover">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Create Class Task</h4>
              <p className="text-[10px] text-slate-400">Formulate new assignments</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
          <Link to="/syllabus" className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl card-shadow flex items-center justify-between hover:shadow-md transition card-hover">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Update Syllabus</h4>
              <p className="text-[10px] text-slate-400">Add active module outline</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>

        {/* Grading score popup Modal */}
        {gradingTarget && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-205 dark:border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 relative">
              <button
                onClick={() => setGradingTarget(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
              >
                Cancel
              </button>

              <div className="space-y-1">
                <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Grade Submission
                </span>
                <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-100 pr-8">
                  {gradingTarget.title}
                </h3>
                <p className="text-xs text-slate-500">Student: {gradingTarget.submittedBy}</p>
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Score (Max: {gradingTarget.points} pts)
                  </label>
                  <input
                    type="number"
                    max={gradingTarget.points}
                    min={0}
                    required
                    placeholder="e.g. 45"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Feedback / Remarks
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Excellent analysis, normalized properly to BCNF with correct relational algebra outlines."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGradingTarget(null)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    Assign Score
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // STANDARD STUDENT DASHBOARD VIEW (FALLBACK/DEFAULT)
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-250">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-blue-500 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            🎓 Academic Status: Active
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold">
            Hello, {currentUser?.name || 'Student'}!
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            Welcome to your <strong className="font-extrabold text-white">E-Resource Hub</strong>. You have <span className="font-bold underline">{pendingAssignments} pending assignments</span> that require submission this week.
          </p>
          <div className="pt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-blue-150">
            <span><strong>Reg No:</strong> {currentUser?.regNo || '2022CSE1042'}</span>
            <span>•</span>
            <span><strong>Department:</strong> {currentUser?.department || 'Computer Science'}</span>
            <span>•</span>
            <span><strong>Semester:</strong> {currentUser?.semester || '4th Semester'}</span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:flex items-center justify-center opacity-10">
          <BookOpen className="h-48 w-48 stroke-[2.5]" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={FileText} label="Total Resources" value={totalResources} subtext="Verified academic guides" color="blue" />
        <StatCard icon={Calendar} label="Pending Tasks" value={pendingAssignments} subtext="Solutions outstanding" color="amber" />
        <StatCard icon={CheckSquare} label="Submitted Tasks" value={submittedAssignments} subtext="Scored and evaluated" color="emerald" />
        <StatCard icon={Brain} label="AI Learning Assistant" value="ACTIVE" subtext="Gemini Streaming Bot" color="indigo" />
      </div>

      {/* Main Grid: Quick Access & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Access cards */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Quick Navigation Shortcut Cards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/resources" className="p-5 rounded-xl border flex flex-col justify-between hover:shadow-md transition card-hover bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30">
              <div>
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">Resources Library</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  Download lecture guides, e-books, PPT slides, and previous papers.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold space-x-1 hover:underline cursor-pointer pt-2">
                <span>Enter Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link to="/syllabus" className="p-5 rounded-xl border flex flex-col justify-between hover:shadow-md transition card-hover bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30">
              <div>
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">Syllabus Plan</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  Check academic modules, credit scoring, and active courses syllabus.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold space-x-1 hover:underline cursor-pointer pt-2">
                <span>Enter Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link to="/assignments" className="p-5 rounded-xl border flex flex-col justify-between hover:shadow-md transition card-hover bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30">
              <div>
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">Assignments Vault</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  Upload solutions, view due dates, and track assigned score points.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold space-x-1 hover:underline cursor-pointer pt-2">
                <span>Enter Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link to="/ai-assistant" className="p-5 rounded-xl border flex flex-col justify-between hover:shadow-md transition card-hover bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30">
              <div>
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
                  <Brain className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">AI Learning Tutor</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  Consult our streaming Gemini bot to generate study summaries and solved quiz questions.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold space-x-1 hover:underline cursor-pointer pt-2">
                <span>Enter Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-150 dark:border-slate-700 card-shadow flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
              Recent Campus Activity Updates
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 leading-relaxed">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-350">DBMS assignment solution submitted</p>
                  <p className="text-[10px] text-slate-400">Just now • Rahul Sharma</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 leading-relaxed">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-350">New solved paper uploaded by Professor</p>
                  <p className="text-[10px] text-slate-400">1 day ago • Algorithms Course</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 leading-relaxed">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-350">Curriculum syllabus outline restructured</p>
                  <p className="text-[10px] text-slate-400">2 days ago • CS Department</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
            <Link to="/ai-assistant" className="w-full text-center block px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-650 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition">
              Consult Gemini AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
export { Dashboard };
