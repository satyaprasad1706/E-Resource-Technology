import React, { useState, useEffect } from 'react';
import { 
  getSyllabus, addSyllabusSubject, deleteSyllabusSubject, departments, semesters 
} from '../firebase/database';
import { useAuth } from '../context/AuthContext';
import { BookOpen, GraduationCap, Clock, ChevronDown, ChevronUp, Trash2, Plus, X } from 'lucide-react';

const Syllabus = () => {
  const { currentUser } = useAuth();
  
  const [selectedDept, setSelectedDept] = useState(departments[0] || 'Computer Science');
  const [selectedSem, setSelectedSem] = useState(semesters[1] || '4th Semester');
  const [subjectList, setSubjectList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded cards state
  const [expandedSubject, setExpandedSubject] = useState({});

  // Add Subject Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(4);
  const [newProf, setNewProf] = useState('');
  const [newModules, setNewModules] = useState('');

  const canEditSyllabus = currentUser?.role === 'Admin' || currentUser?.role === 'Professor';

  const fetchSyllabusData = async () => {
    try {
      const dbSyllabus = await getSyllabus();
      const deptSyllabus = dbSyllabus[selectedDept] || {};
      const semSubjects = deptSyllabus[selectedSem] || [];
      setSubjectList(semSubjects);

      // Auto-expand the first subject card for beautiful load
      if (semSubjects.length > 0) {
        setExpandedSubject({ [semSubjects[0].code]: true });
      } else {
        setExpandedSubject({});
      }
    } catch (e) {
      console.error("Syllabus fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabusData();
  }, [selectedDept, selectedSem]);

  const toggleExpand = (code) => {
    setExpandedSubject(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const handleDeleteSubject = async (code) => {
    if (window.confirm(`Are you sure you want to delete the syllabus for course code: "${code}"?`)) {
      await deleteSyllabusSubject(selectedDept, selectedSem, code);
      setSubjectList(prev => prev.filter(s => s.code !== code));
      alert("🗑️ Subject outline deleted successfully!");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newCode || !newName || !newProf || !newModules) {
      alert("Please fill in all fields!");
      return;
    }

    // Split modules text area by line break into an array
    const parsedModules = newModules
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const payload = {
      code: newCode.toUpperCase(),
      name: newName,
      credits: Number(newCredits),
      professor: newProf,
      modules: parsedModules.length > 0 ? parsedModules : ["Module 1: General outlines"]
    };

    await addSyllabusSubject(selectedDept, selectedSem, payload);
    setSubjectList(prev => [...prev.filter(s => s.code !== payload.code), payload]);
    
    // Reset Form
    setNewCode('');
    setNewName('');
    setNewCredits(4);
    setNewProf('');
    setNewModules('');
    setShowAddModal(false);
    
    alert(`🎉 Course outline ${payload.code} successfully added!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 transition-colors duration-250">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Syllabus Curriculum Plan
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Browse official university courses, credits weightage, and modular syllabus guidelines.
          </p>
        </div>

        {canEditSyllabus && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course Outline</span>
          </button>
        )}
      </div>

      {/* Cascading selectors card */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-150 dark:border-slate-700/60 shadow-sm transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Select */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Select Department
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="pl-10 block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 font-semibold"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester Select */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Select Semester
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Clock className="h-4.5 w-4.5" />
              </span>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="pl-10 block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 font-semibold"
              >
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Fetching syllabus data...</p>
        </div>
      ) : subjectList.length > 0 ? (
        <div className="space-y-4">
          {subjectList.map(subject => {
            const isExpanded = !!expandedSubject[subject.code];
            return (
              <div
                key={subject.code}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-155 dark:border-slate-700/60 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Subject Summary Header */}
                <div
                  onClick={() => toggleExpand(subject.code)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-750 transition duration-150 select-none relative group"
                >
                  <div className="flex items-center space-x-4 pr-12">
                    <div className="h-10 w-10 bg-blue-50 dark:bg-slate-700 text-primary dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs border border-blue-100 dark:border-slate-600">
                      {subject.code}
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100">
                        {subject.name}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-0.5">
                        <span className="font-semibold text-primary dark:text-blue-400">Credits: {subject.credits}</span>
                        <span>•</span>
                        <span>Instructor: {subject.professor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Delete button for staff role */}
                    {canEditSyllabus && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubject(subject.code);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition focus:outline-none"
                        title="Delete Course outline"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {/* Modules Outline List */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/10 space-y-4 animate-in slide-in-from-top-2 duration-150">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                        Modules & Syllabus Outline:
                      </p>
                      <div className="space-y-2.5">
                        {subject.modules?.map((moduleStr, mIdx) => (
                          <div key={mIdx} className="flex items-start text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-xs">
                            <span className="h-5 w-5 bg-blue-50 dark:bg-slate-900 text-primary dark:text-blue-400 font-bold rounded flex items-center justify-center text-[10px] mr-3 flex-shrink-0 border border-blue-100 dark:border-slate-800">
                              {mIdx + 1}
                            </span>
                            <span>{moduleStr}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-3">
          <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No syllabus data found</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            There is currently no curriculum details uploaded for {selectedDept} in the {selectedSem}.
          </p>
        </div>
      )}

      {/* Add Syllabus Subject Modal */}
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
                Syllabus Creator
              </span>
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">
                Add Course Outline
              </h3>
              <p className="text-xs text-slate-400">Appending to: {selectedDept} • {selectedSem}</p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                {/* Code */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-401"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>

                {/* Credits */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Academic Credits
                  </label>
                  <select
                    value={newCredits}
                    onChange={(e) => setNewCredits(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={1}>1 Credit</option>
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                  </select>
                </div>
              </div>

              {/* Subject Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              {/* Professor */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Assigned Professor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Amit Verma"
                  value={newProf}
                  onChange={(e) => setNewProf(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              {/* Modules lists */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Modules / Chapters Outline *
                </label>
                <span className="block text-[9px] text-slate-400 mb-1">Enter each module on a new line</span>
                <textarea
                  rows={4}
                  required
                  placeholder="Module 1: Introduction, Database Architecture, ER Diagram&#10;Module 2: Relational Model, Relational Algebra, Relational Calculus&#10;Module 3: Structured Query Language (SQL), DDL, DML"
                  value={newModules}
                  onChange={(e) => setNewModules(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              {/* Action Buttons */}
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Syllabus;
export { Syllabus };
