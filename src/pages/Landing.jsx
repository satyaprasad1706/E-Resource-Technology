import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Terminal, Cpu, Zap, Download, Brain, Sparkles, ArrowRight, Play, Server, Clock, ShieldCheck, CheckCircle2, UserCheck, GraduationCap
} from 'lucide-react';
import Footer from '../components/Footer';

const Landing = () => {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);

  const logs = [
    { text: "wse-agent --init --project=eresource_technology", color: "text-cyan-600 dark:text-cyan-400" },
    { text: "🛰️  Connecting to IARE University curriculum API...", color: "text-slate-500 dark:text-slate-400" },
    { text: "✓ Curriculum databases synchronized. Branch count: CS, IT, ECE", color: "text-emerald-600 dark:text-emerald-400" },
    { text: "🧠  Loading Gemini AI streaming conversational tutor...", color: "text-slate-500 dark:text-slate-400" },
    { text: "✓ AI Chatbot online and sandbox sandbox active.", color: "text-indigo-600 dark:text-indigo-400" },
    { text: "📂  Indexing verified notes, PPT slides, and solved papers...", color: "text-slate-500 dark:text-slate-400" },
    { text: "✓ Platform assets nominal. Ready for presentation.", color: "text-purple-600 dark:text-purple-400" }
  ];

  useEffect(() => {
    if (currentLine < logs.length) {
      const timer = setTimeout(() => {
        setTerminalLogs(prev => [...prev, logs[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => {
        setTerminalLogs([]);
        setCurrentLine(0);
      }, 6000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentLine]);

  return (
    <div className="bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 min-h-screen relative overflow-hidden font-sans select-none transition-colors duration-300">
      
      {/* Dynamic Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-35" />

      {/* Cyberpunk Radial Glow Fields */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-cyan-500/10 dark:to-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-purple-500/10 to-indigo-500/5 dark:from-purple-500/10 dark:to-blue-500/5 blur-[120px] rounded-full" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Title & Presentation Header */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Presentational Topic Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-slate-900/60 text-primary dark:text-cyan-400 border border-blue-100 dark:border-slate-800 shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
                <span className="tracking-wide">E-RESOURCE TECHNOLOGY PORTAL</span>
              </div>

              {/* Project Topic Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  E-Resource Technology
                </span>
              </h1>

              {/* Concise Target Description */}
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
                A unified scholastic portal built to bridge the gap between academic syllabi and learning resources for engineering colleges, complete with an agentic Gemini AI chatbot.
              </p>

              {/* Call to Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white dark:text-slate-950 bg-primary dark:bg-gradient-to-r dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transform transition-all flex items-center justify-center space-x-2"
                >
                  <span>Start E-Learning</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
                
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-slate-650 dark:text-slate-350 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs backdrop-blur-md transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="h-3.5 w-3.5 fill-current text-current" />
                  <span>Sign In to Portal</span>
                </Link>
              </div>

              {/* Status and core tech metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-slate-200 dark:border-slate-800/80">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Deployment</p>
                  <p className="text-base font-bold text-primary dark:text-cyan-400">Live Production</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Security Access</p>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">@iare.ac.in Only</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Uptime Rate</p>
                  <p className="text-base font-bold text-purple-600 dark:text-purple-400">99.98% SLA</p>
                </div>
              </div>

            </div>

            {/* Right Column: High-Tech Cyber Console Terminal (Fully responsive in theme toggle) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xl dark:shadow-2xl relative backdrop-blur-xl overflow-hidden group hover:border-primary/30 dark:hover:border-cyan-500/30 transition-all duration-300">
                
                {/* Terminal Header */}
                <div className="bg-slate-100/60 dark:bg-slate-900/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-rose-450 dark:bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-450 dark:bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-450 dark:bg-emerald-500/80" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-450 uppercase tracking-widest flex items-center space-x-1.5">
                    <Terminal className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
                    <span>Antigravity Agent Shell</span>
                  </span>
                </div>

                {/* Terminal Logs View */}
                <div className="p-5 font-mono text-xs space-y-2.5 min-h-[240px] bg-slate-50/50 dark:bg-slate-950/90 select-text selection:bg-primary/10 dark:selection:bg-cyan-500/20 text-slate-700 dark:text-slate-350">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className={`leading-relaxed ${log.color} animate-in fade-in slide-in-from-left-2 duration-200`}>
                      <span className="text-slate-450 dark:text-slate-600 mr-2">&gt;</span>
                      {log.text}
                    </div>
                  ))}
                  {currentLine < logs.length && (
                    <div className="flex items-center space-x-1 text-primary dark:text-cyan-400">
                      <span className="text-slate-450 dark:text-slate-600 mr-1">&gt;</span>
                      <span className="h-3 w-1.5 bg-primary dark:bg-cyan-400 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Tech Badges */}
                <div className="bg-slate-100/40 dark:bg-slate-900/40 px-4 py-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Server className="h-3 w-3 text-primary dark:text-indigo-400" />
                    <span>Host: Gemini-AI-Pipeline</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-indigo-500 dark:text-purple-400" />
                    <span>Ping: 14ms</span>
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE FUNCTIONALITY SECTION: WHAT IT WILL DO */}
      <section className="py-20 relative bg-white dark:bg-slate-950/30 border-y border-slate-200 dark:border-slate-900/60 z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              What the Platform Will Do
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              E-Resource Technology is engineered to automate scholastic resources management, course structure reviews, and doubtful-query solving for our college network.
            </p>
          </div>

          {/* Detailed Features Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 dark:hover:border-cyan-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-cyan-950/50 text-primary dark:text-cyan-400 border border-blue-100 dark:border-cyan-500/20 flex items-center justify-center mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Parse Syllabi Module by Module</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Allows students to filter course modules dynamically by semester and branch (CS, IT, etc.), displaying precise credits weightage and syllabus details.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center mb-4">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Provide Verified Learning Assets</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Hosts downloadable PDF textbooks, solved numerical sets, professor lecture PPTs, and previous exams directly in a centralized card catalog.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center mb-4">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Stream Real-time AI Tutoring</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Leverages the Gemini Flash API to stream comprehensive topic summaries, key reference bullet points, and self-evaluation quizzes directly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enforce Domain Protection</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Ensures only authenticated student, professor, or admin profiles ending strictly with `@iare.ac.in` can sign up or trigger Google popups.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED ROLE CAPABILITIES MATRIX: HOW THE ROLES WILL INTERACT */}
      <section className="py-20 relative z-10 bg-slate-100/50 dark:bg-slate-950/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Role-Based Interaction Map
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light">
              Web Syllabus & E-Resource coordinates permissions dynamically depending on three pre-defined access levels:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Student Column */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-500/20 transition duration-150">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-primary dark:text-blue-400 rounded-xl">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">👨‍🎓 Student Role</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Access Scope: Learn & Verify</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Browse modular syllabus credit grids.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Download lecture guides, solved sets, and PDFs.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Upload finished PDF assignment solutions.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Ask unlimited questions to the Gemini AI Tutor.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professor Column */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-amber-500/20 transition duration-150">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 rounded-xl">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">👨‍🏫 Professor Role</h3>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Access Scope: CRUD Curriculums</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-amber-550 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Upload new syllabus-mapped resource documents.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-amber-550 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Append new course/subject outlines to active semesters.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-amber-550 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Post new homework assignments with max point limits.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-amber-550 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Grade submitted student solutions and assign scores/feedback.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Column */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500/20 transition duration-150">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 rounded-xl">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">🛡️ Admin Role</h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Access Scope: Full Security Sync</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Alter user roles instantly in the platform directory list.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Full creation and deletion authorization over syllabus files.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">Full creation and deletion authority over download guides.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-light">View system transaction logs and Firestore counts.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MOCK TERMINAL AI PREVIEW */}
      <section className="py-20 relative z-10 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xl dark:shadow-2xl relative">
            <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-indigo-500/5 blur-[80px] rounded-full" />
            
            <div className="p-8 md:p-12 text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-wide">
                ⚡ Agentic AI Tutor Preview
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                Experience real-time interactive answering. Enter complex engineering topics and let the model return complete notes, checklists, and solved numerical sets.
              </p>
            </div>

            {/* Sandbox Console UI Mock */}
            <div className="bg-white dark:bg-slate-950/95 p-6 border-t border-slate-200 dark:border-slate-850 font-mono text-xs space-y-4 relative">
              <div className="flex justify-end">
                <div className="bg-primary text-white text-[11px] md:text-xs px-4 py-2.5 rounded-2xl rounded-tr-none max-w-xs md:max-w-md shadow-md border border-primary/20">
                  <p className="font-bold text-[9px] text-blue-200 mb-0.5 uppercase tracking-wide">User Session</p>
                  Explain Normalization in DBMS.
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-350 text-[11px] md:text-xs px-5 py-4 rounded-2xl rounded-tl-none max-w-xl md:max-w-2xl shadow-inner border border-slate-200 dark:border-slate-800 backdrop-blur-md leading-relaxed space-y-3">
                  <p className="font-bold text-[9px] text-primary dark:text-indigo-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Zap className="h-3 w-3 text-primary dark:text-cyan-400 animate-pulse" />
                    <span>Antigravity AI core</span>
                  </p>
                  
                  <div>
                    <p className="font-bold text-indigo-650 dark:text-cyan-400">🚀 Concept Definition:</p>
                    <p className="text-slate-700 dark:text-slate-300 font-light mt-1">
                      Normalization is a Database Management System (DBMS) design technique that organizes database fields and tables to minimize data redundancy. It divides bloated, repetitive data schemas into distinct entities linked together through foreign key relations.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-950/80 p-3 rounded-lg border border-slate-200 dark:border-slate-850 mt-2">
                    <p className="font-bold text-purple-650 dark:text-purple-400">🔧 Normal Forms Core Checklist:</p>
                    <ul className="list-disc pl-4 text-slate-655 dark:text-slate-400 text-[10px] mt-1 space-y-1">
                      <li><strong>1NF:</strong> Eliminate repeating groups; ensure all attributes are atomic values.</li>
                      <li><strong>2NF:</strong> Satisfy 1NF and ensure zero partial dependencies on candidate keys.</li>
                      <li><strong>3NF:</strong> Satisfy 2NF and eliminate transitive dependencies.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* METRIC PERFORMANCE ROW */}
      <section className="py-16 bg-slate-100/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-900/60 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/30 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-blue-50 dark:bg-cyan-950/40 border border-blue-100 dark:border-cyan-500/20 text-primary dark:text-cyan-400 rounded-xl">
                <Server className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-850 dark:text-white">100%</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Firestore Cloud Sync</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/30 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-500/20 text-purple-650 dark:text-purple-400 rounded-xl">
                <Zap className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-850 dark:text-white">&lt; 20ms</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Gemini Stream Latency</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/30 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-850 dark:text-white">Strict</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Domain Firewall Gate</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/30 flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Terminal className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-850 dark:text-white">Active</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Local Emulator Sandbox</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default Landing;
