import React from 'react';
import { Calendar, Upload, FileCheck, AlertCircle, ExternalLink, Download, Sparkles, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AssignmentCard = ({ assignment, onUpload, onDownload, onView, onGrade }) => {
  const { currentUser } = useAuth();
  
  const isOverdue = assignment.status === 'Overdue';
  const isSubmitted = assignment.status === 'Submitted';
  
  const isStudent = currentUser?.role === 'Student';
  const isProfessor = currentUser?.role === 'Professor';
  const isAdmin = currentUser?.role === 'Admin';

  const getStatusBadge = () => {
    if (isSubmitted) {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50';
    } else if (isOverdue) {
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50';
    } else {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50';
    }
  };

  const getStatusIcon = () => {
    if (isSubmitted) return <FileCheck className="h-3.5 w-3.5 mr-1" />;
    if (isOverdue) return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
    return <Calendar className="h-3.5 w-3.5 mr-1" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 card-shadow card-hover flex flex-col justify-between transition-colors duration-200">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge()}`}>
            {getStatusIcon()}
            {assignment.status}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {assignment.points} Points
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
          {assignment.title}
        </h3>

        {/* Subject */}
        <p className="mt-1 text-xs font-semibold text-primary dark:text-blue-400">
          {assignment.subject}
        </p>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {assignment.description}
        </p>

        {/* Dynamic Dates & Submissions logs */}
        <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-50 dark:border-slate-700/40">
          <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Due Date: {assignment.dueDate}</span>
          </div>

          {/* Student submissions indicator */}
          {isSubmitted && (
            <div className="space-y-1">
              <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <FileCheck className="h-3.5 w-3.5 mr-1.5" />
                <span>Uploaded: {assignment.submittedFile}</span>
              </div>
              {assignment.submittedBy && (
                <p className="text-[10px] text-slate-400 pl-5">Submitted by: {assignment.submittedBy}</p>
              )}
              {assignment.score !== null && assignment.score !== undefined ? (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                  <p className="font-bold flex items-center">
                    <CheckSquare className="h-3 w-3 mr-1" />
                    Graded: {assignment.score} / {assignment.points}
                  </p>
                  {assignment.feedback && (
                    <p className="text-slate-500 dark:text-slate-450 italic mt-0.5">"{assignment.feedback}"</p>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold pl-5">⌛ Awaiting score grading...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-end space-x-2">
        <button
          onClick={() => onView(assignment)}
          className="inline-flex items-center px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Details
        </button>
        
        {/* Student actions */}
        {isStudent && (
          isSubmitted ? (
            <button
              onClick={() => onDownload(assignment)}
              className="inline-flex items-center px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold rounded-lg text-white shadow-sm transition"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Get File
            </button>
          ) : (
            <button
              onClick={() => onUpload(assignment)}
              className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark text-xs font-semibold rounded-lg text-white shadow-sm transition"
            >
              <Upload className="h-3.5 w-3.5 mr-1" />
              Upload Solution
            </button>
          )
        )}

        {/* Professor grading actions */}
        {isProfessor && isSubmitted && (
          <button
            onClick={() => onGrade(assignment)}
            className="inline-flex items-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-xs font-semibold rounded-lg text-white shadow-sm transition"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            {assignment.score !== null ? 'Re-grade' : 'Grade Solution'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
export { AssignmentCard };
