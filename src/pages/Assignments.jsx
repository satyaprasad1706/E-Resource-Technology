import React, { useState, useEffect } from 'react';
import { 
  getAssignments, addAssignment, submitAssignment, gradeAssignment 
} from '../firebase/database';
import { useAuth } from '../context/AuthContext';
import AssignmentCard from '../components/AssignmentCard';
import { Calendar, CheckCircle2, FileText, Upload, X, Check, Info, Plus } from 'lucide-react';

const Assignments = () => {
  const { currentUser } = useAuth();
  
  const [assignmentList, setAssignmentList] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal target states
  const [uploadTarget, setUploadTarget] = useState(null);
  const [instructionTarget, setInstructionTarget] = useState(null);
  const [gradingTarget, setGradingTarget] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Student upload forms states
  const [fileName, setFileName] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Professor create task states
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPoints, setNewPoints] = useState(50);
  const [newDesc, setNewDesc] = useState('');

  // Professor grade states
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const isStudent = currentUser?.role === 'Student';
  const isProfessor = currentUser?.role === 'Professor';
  const canCreate = currentUser?.role === 'Professor';

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignmentList(data);
    } catch (e) {
      console.error("Assignments fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDownload = (assignment) => {
    alert(`📥 Downloading: "${assignment.title}" instructions/materials\nFormat: PDF\n\nDownloaded successfully!`);
  };

  const handleUploadClick = (assignment) => {
    setUploadTarget(assignment);
    setFileName('');
    setSubmissionNotes('');
  };

  // Student solution submit
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileName) {
      alert("Please enter a file name");
      return;
    }

    const payload = {
      file: fileName,
      studentName: currentUser?.name || 'Student',
      notes: submissionNotes
    };

    await submitAssignment(uploadTarget.id, payload);
    
    // Update local list state
    setAssignmentList(prev =>
      prev.map(a =>
        a.id === uploadTarget.id
          ? {
              ...a,
              status: 'Submitted',
              submittedFile: fileName,
              submittedDate: new Date().toISOString().split('T')[0],
              submittedBy: currentUser?.name || 'Student',
              submissionNotes
            }
          : a
      )
    );

    alert(`✅ Solution "${fileName}" submitted successfully!`);
    setUploadTarget(null);
  };

  // Professor grade submit
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!score || isNaN(score)) {
      alert("Please enter a numeric score");
      return;
    }

    const payload = {
      score: Number(score),
      feedback
    };

    await gradeAssignment(gradingTarget.id, payload);

    // Update local state list
    setAssignmentList(prev =>
      prev.map(a =>
        a.id === gradingTarget.id
          ? { ...a, score: Number(score), feedback }
          : a
      )
    );

    alert("✅ Solved assignment graded successfully!");
    setGradingTarget(null);
  };

  // Professor create assignment task
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newSubject || !newDueDate || !newDesc) {
      alert("Please fill in all fields!");
      return;
    }

    const payload = {
      title: newTitle,
      subject: newSubject,
      dueDate: newDueDate,
      points: Number(newPoints),
      description: newDesc
    };

    const added = await addAssignment(payload);
    setAssignmentList(prev => [added, ...prev]);

    // Reset
    setNewTitle('');
    setNewSubject('');
    setNewDueDate('');
    setNewPoints(50);
    setNewDesc('');
    setShowAddModal(false);

    alert(`🎉 New assignment task "${payload.title}" created successfully!`);
  };

  // Filters assignments by active tab
  const filteredAssignments = assignmentList.filter(a => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return a.status === 'Pending';
    if (activeTab === 'Submitted') return a.status === 'Submitted';
    if (activeTab === 'Overdue') return a.status === 'Overdue';
    return true;
  });

  const getTabBadgeColor = (tab) => {
    if (activeTab === tab) {
      return 'bg-primary text-white dark:bg-blue-600';
    }
    return 'bg-slate-50 dark:bg-slate-905 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 transition-colors duration-250">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Assignments Portal
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Track coursework schedules, submit solutions, and review grader scoring remarks.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        {['All', 'Pending', 'Submitted', 'Overdue'].map(tab => {
          const count = tab === 'All'
            ? assignmentList.length
            : assignmentList.filter(a => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border border-slate-205 dark:border-slate-700 transition flex items-center space-x-2 ${getTabBadgeColor(tab)}`}
            >
              <span>{tab}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-650 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Assignments list */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Fetching assignment tasks...</p>
        </div>
      ) : filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onDownload={handleDownload}
              onUpload={handleUploadClick}
              onView={(a) => setInstructionTarget(a)}
              onGrade={(a) => {
                setGradingTarget(a);
                setScore(a.score || '');
                setFeedback(a.feedback || '');
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No assignments found</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            There are currently no assignments matching this filter. Keep up the good work!
          </p>
        </div>
      )}

      {/* Instruction/Details Modal */}
      {instructionTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 relative">
            <button
              onClick={() => setInstructionTarget(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-350 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Assignment Guidelines
              </span>
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 pr-8">
                {instructionTarget.title}
              </h3>
              <p className="text-xs font-semibold text-primary dark:text-blue-400">
                Course: {instructionTarget.subject}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Full Instructions:
              </p>
              <p className="text-xs text-slate-655 dark:text-slate-355 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
                {instructionTarget.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-50/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-805">
              <div>
                <p className="text-slate-400 font-medium">Submission Score</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{instructionTarget.points} Marks Max</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Status</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{instructionTarget.status}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setInstructionTarget(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
              >
                Close details
              </button>
              {isStudent && instructionTarget.status !== 'Submitted' && (
                <button
                  onClick={() => {
                    handleUploadClick(instructionTarget);
                    setInstructionTarget(null);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow flex items-center space-x-1"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Solution</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Solution Upload Modal */}
      {uploadTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-205 dark:border-slate-700 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 relative">
            <button
              onClick={() => setUploadTarget(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Upload Solution
              </span>
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 pr-8">
                {uploadTarget.title}
              </h3>
              <p className="text-xs font-semibold text-primary dark:text-blue-400">
                Course: {uploadTarget.subject}
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-1.5">
                  File Name / Solution Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algorithms_Assignment_Rahul_2022.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1.5">
                  Submission Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Dear Professor, please check my trace sheet for dynamic algorithms modules."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 text-primary dark:text-blue-400 rounded-xl text-xs border border-blue-100 dark:border-blue-900/40">
                <Info className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <span>Uploaded files are converted to university standard format and indexed against your registration number.</span>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadTarget(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow flex items-center space-x-1"
                >
                  <Check className="h-4 w-4" />
                  <span>Submit Solution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professor Assignment Creator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-250 dark:border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Coursework Creator
              </span>
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">
                Create New Assignment
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Programming and knapsack trace problems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Subject */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Course Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design & Analysis of Algorithms"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Max Marks / Points
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Due date */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Submission Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Instructions & Question Outlines *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draw dynamic programming lattices. Complete trace steps for matrix multiplications. Provide code in Java..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professor Solutions Grading Modal */}
      {gradingTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-205 dark:border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 relative">
            <button
              onClick={() => setGradingTarget(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
            >
              <X className="h-5 w-5" />
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
                  placeholder="Outstanding solution structure."
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
};

export default Assignments;
export { Assignments };
