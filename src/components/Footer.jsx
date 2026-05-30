import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-primary dark:text-blue-400 font-bold text-lg">
              <BookOpen className="h-5 w-5" />
              <span>E-Resource Technology</span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              A comprehensive educational resource hub created for engineering students to browse syllabi, manage assignments, download learning assets, and consult our AI tutor.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/resources" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition">
                  Browse Resources
                </a>
              </li>
              <li>
                <a href="/syllabus" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition">
                  View Syllabus
                </a>
              </li>
              <li>
                <a href="/ai-assistant" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition">
                  AI Learning Assistant
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">About Platform</h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Designed as a final year college project presentation. Clean frontend built with React, Tailwind CSS, and Chart.js.
            </p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Tech Stack: React 18, Vite, Lucide Icons, Context API
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} E-Resource Technology. Developed by 24951A235, Satya Prasad.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              Status: Evaluator Demo Version 1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
