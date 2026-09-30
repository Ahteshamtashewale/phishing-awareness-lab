import React from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { TopBar } from './components/TopBar';
import { Overview } from './components/Overview';
import { AuthLab } from './components/AuthLab';
import { InputValidationLab } from './components/InputValidationLab';
import { SecurityScannerLab } from './components/SecurityScannerLab';
import { LoggingConsole } from './components/LoggingConsole';
import { PhishingArena } from './components/PhishingArena';
import { ProjectSubmissionModal } from './components/ProjectSubmissionModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useSecurity();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TopBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'auth' && <AuthLab />}
        {activeTab === 'input' && <InputValidationLab />}
        {activeTab === 'scanner' && <SecurityScannerLab />}
        {activeTab === 'logging' && <LoggingConsole />}
        {activeTab === 'simulation' && <PhishingArena />}
      </main>

      <ProjectSubmissionModal />

      {/* Quiet, authentic academic/enterprise footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PhishDefend Lab</span>
            <span aria-hidden="true">·</span>
            <span>Virtual Cybersecurity Internship Capstone</span>
            <span aria-hidden="true">·</span>
            <span>Defensive Engineering Curriculum</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-white transition"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className="hover:text-white transition"
            >
              Auth
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className="hover:text-white transition"
            >
              Sanitization
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className="hover:text-white transition"
            >
              Scanner
            </button>
            <button
              onClick={() => setActiveTab('logging')}
              className="hover:text-white transition"
            >
              SIEM
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className="hover:text-white transition"
            >
              Simulation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}
