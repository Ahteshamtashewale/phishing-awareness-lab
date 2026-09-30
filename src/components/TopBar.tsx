import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { ShieldCheck, FileCheck } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { activeTab, setActiveTab, tasks, setIsSubmissionModalOpen } = useSecurity();
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span>PhishDefend</span>
        </button>

        {/* Zone 2: 4–6 nav links, 1–2 word labels, single-line */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'auth'
                ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Authentication
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'input'
                ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Input Validation
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Security Checks
          </button>
          <button
            onClick={() => setActiveTab('logging')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'logging'
                ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'simulation'
                ? 'text-cyan-400 font-semibold underline underline-offset-8 decoration-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Triage Arena
          </button>
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Unboxed metadata for tasks */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Tasks Completed</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-semibold tabular-nums">{completedCount}/{tasks.length}</span>
          </div>

          <button
            onClick={() => setIsSubmissionModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 whitespace-nowrap"
          >
            <FileCheck className="h-4 w-4" />
            <span>Project Submission</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 px-4 py-2 gap-4 text-xs font-medium scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`whitespace-nowrap py-1 ${activeTab === 'overview' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('auth')}
          className={`whitespace-nowrap py-1 ${activeTab === 'auth' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'}`}
        >
          Authentication
        </button>
        <button
          onClick={() => setActiveTab('input')}
          className={`whitespace-nowrap py-1 ${activeTab === 'input' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'}`}
        >
          Input Validation
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`whitespace-nowrap py-1 ${activeTab === 'scanner' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'}`}
        >
          Security Checks
        </button>
        <button
          onClick={() => setActiveTab('logging')}
          className={`whitespace-nowrap py-1 ${activeTab === 'logging' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'}`}
        >
          Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`whitespace-nowrap py-1 ${activeTab === 'simulation' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-400'}`}
        >
          Triage Arena
        </button>
      </div>
    </header>
  );
};
