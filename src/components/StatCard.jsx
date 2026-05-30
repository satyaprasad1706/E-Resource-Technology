import React from 'react';

const StatCard = ({ icon: Icon, value, label, subtext, color = "blue" }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20';
      case 'amber':
        return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20';
      case 'rose':
        return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20';
      case 'indigo':
        return 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/20';
      default:
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 card-shadow transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {label}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${getColorClasses()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {subtext && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};

export default StatCard;
