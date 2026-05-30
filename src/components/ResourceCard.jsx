import React from 'react';
import { Download, Eye, FileText, Book, Presentation, FileCode, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResourceCard = ({ resource, onDownload, onView, onDelete }) => {
  const { currentUser } = useAuth();
  const canDelete = currentUser?.role === 'Admin' || currentUser?.role === 'Professor';

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'notes':
        return <FileText className="h-5 w-5 text-emerald-500" />;
      case 'e-book':
        return <Book className="h-5 w-5 text-blue-500" />;
      case 'ppts':
        return <Presentation className="h-5 w-5 text-amber-500" />;
      case 'previous papers':
        return <FileCode className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'notes':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50';
      case 'e-book':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50';
      case 'ppts':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50';
      case 'previous papers':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-100 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 card-shadow card-hover flex flex-col justify-between transition-colors duration-200 relative group">
      
      {/* Absolute delete button for authorized staff */}
      {canDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Are you sure you want to delete the resource: "${resource.title}"?`)) {
              onDelete(resource.id);
            }
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition focus:outline-none"
          title="Delete Resource"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      )}

      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeColor(resource.type)}`}>
            <span className="mr-1">{getIcon(resource.type)}</span>
            {resource.type}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 pr-6">
            {resource.format} • {resource.size}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-slate-100 hover:text-primary dark:hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors pr-6" onClick={() => onView(resource)}>
          {resource.title}
        </h3>

        {/* Subject and Uploader */}
        <div className="mt-2 space-y-1">
          <p className="text-xs font-medium text-primary dark:text-blue-400">
            {resource.subject}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Uploaded by: {resource.uploadedBy}
          </p>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>
      </div>

      {/* Footer / Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {resource.downloads} downloads
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(resource)}
            className="inline-flex items-center px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            View
          </button>
          <button
            onClick={() => onDownload(resource)}
            className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark text-xs font-semibold rounded-lg text-white shadow-sm transition"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
export { ResourceCard };
