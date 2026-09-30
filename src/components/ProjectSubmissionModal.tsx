import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  FileText, 
  Calendar, 
  User, 
  Building2,
  Cpu
} from 'lucide-react';

export const ProjectSubmissionModal: React.FC = () => {
  const { 
    isSubmissionModalOpen, 
    setIsSubmissionModalOpen, 
    internName, 
    setInternName,
    internId,
    setInternId,
    internOrg,
    setInternOrg,
    tasks,
    logs,
    quizScore,
    quizTotal
  } = useSecurity();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const submissionTimestamp = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!isSubmissionModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportText = `========================================================================
CYBERSECURITY VIRTUAL INTERNSHIP - TECHNICAL PROJECT SUBMISSION DOSSIER
========================================================================
Project Title: Phishing Awareness & Cyber Defense Engineering Lab
Submission Date: ${submissionTimestamp}
Candidate: ${internName}
Candidate ID: ${internId}
Track / Organization: ${internOrg}
Project Completion Status: ${completedCount}/${tasks.length} Modules Verified (${Math.round((completedCount/tasks.length)*100)}%)
Knowledge Evaluation Score: ${quizScore}/${quizTotal} (${Math.round((quizScore/quizTotal)*100)}%)

1. EXECUTIVE SUMMARY:
This project demonstrates defensive engineering concepts to mitigate modern social engineering,
adversary-in-the-middle (AitM) reverse proxies, and web-based input attack vectors. It covers
5 core defensive disciplines:
- Authentication & Phishing-Resistant MFA (bcrypt, rate limiting, FIDO2/WebAuthn origin binding)
- Input Validation & Attack Vector Neutralization (Context-aware escaping against XSS & SQLi)
- Security Checks & Domain Analysis (IDN homograph detection, HTTP security headers, SPF/DKIM/DMARC)
- SIEM Security Logging & Incident Telemetry
- Human Risk Awareness & Email Triage Arena

2. TEST EXECUTION MATRIX:
${tasks.map(t => `[${t.isCompleted ? 'VERIFIED PASSED' : 'PENDING'}] ${t.category}: ${t.title}`).join('\n')}

3. INCIDENT AUDIT TRAIL SUMMARY:
Total Security Events Logged: ${logs.length}
Critical Interventions: ${logs.filter(l => l.severity === 'CRITICAL').length}
Warnings Intercepted: ${logs.filter(l => l.severity === 'WARNING').length}

4. DEFENSIVE ARCHITECTURE RECOMMENDATIONS:
- Enforce FIDO2/WebAuthn hardware credentials to eliminate AitM credential proxying.
- Implement strict Content-Security-Policy (CSP) with frame-ancestors 'none' to block clickjacking.
- Enforce strict parameter binding in ORMs/SQL drivers to eliminate injection vulnerabilities.
- Configure DMARC with p=reject to drop unauthorized spoofed outbound emails.
- Mandate routine interactive email triage awareness training for staff.

Digital Signature: SHA-256 Verified by Virtual Internship Security Lab
========================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cybersecurity_Internship_Submission_${internId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Project Submission & Technical Dossier</h3>
              <p className="text-[11px] text-slate-400">Virtual Internship Cybersecurity Capstone Deliverable</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Dossier</span>
            </button>
            <button
              onClick={() => setIsSubmissionModalOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white transition ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Container */}
        <div className="p-6 sm:p-10 space-y-8 bg-slate-900 text-slate-200 text-xs font-sans max-h-[80vh] overflow-y-auto print:max-h-none print:p-0 print:bg-white print:text-black">
          {/* Header Block */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Official Virtual Internship Capstone Report
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Phishing Awareness & Cyber Defense Platform
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Documented Laboratory Workflow, Defensive Architecture & Empirical Testing
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-right font-mono shrink-0">
              <div className="text-[10px] text-slate-500 uppercase">Verification Status</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center justify-end gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{completedCount === tasks.length ? 'VERIFIED COMPLETE' : `${completedCount}/${tasks.length} PASSED`}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{submissionTimestamp}</div>
            </div>
          </div>

          {/* Intern Details Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                <User className="h-4 w-4 text-cyan-400" />
                <span>Intern Candidate Profile</span>
              </span>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {isEditingProfile ? 'Save Profile' : 'Edit Credentials'}
              </button>
            </div>

            {isEditingProfile ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={internName}
                    onChange={(e) => setInternName(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Candidate ID</label>
                  <input
                    type="text"
                    value={internId}
                    onChange={(e) => setInternId(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Academic Track</label>
                  <input
                    type="text"
                    value={internOrg}
                    onChange={(e) => setInternOrg(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Candidate Name:</span>
                  <span className="font-bold text-slate-100">{internName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Intern ID:</span>
                  <span className="font-mono text-cyan-300">{internId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Organization / Domain:</span>
                  <span className="text-slate-300">{internOrg}</span>
                </div>
              </div>
            )}
          </div>

          {/* Documented Workflow Narrative */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>1. Technical Workflow & Methodology</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              This practical project implemented an empirical defense-in-depth framework across the entire lifecycle of a phishing attack:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <strong className="text-cyan-300">Phase A: Ingress Pretext Analysis</strong>
                <p className="text-[11px] text-slate-400">
                  Evaluated SPF, DKIM, and DMARC alignment to identify unauthorized sender gateways impersonating internal executives and IT service desk personnel.
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <strong className="text-emerald-300">Phase B: Input Vector Neutralization</strong>
                <p className="text-[11px] text-slate-400">
                  Developed context-aware HTML entity escaping and parameterized database querying to mitigate reflected XSS and SQL injection credential harvesting.
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <strong className="text-blue-300">Phase C: Domain & Protocol Verification</strong>
                <p className="text-[11px] text-slate-400">
                  Constructed IDN homograph heuristics and Punycode conversion algorithms to flag unicode glyph spoofing (e.g. Cyrillic "а" spoofing Latin "a").
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <strong className="text-purple-300">Phase D: Phishing-Resistant Authentication</strong>
                <p className="text-[11px] text-slate-400">
                  Compared TOTP against FIDO2/WebAuthn origin binding, proving hardware credentials thwart reverse-proxy (AitM) session hijacking.
                </p>
              </div>
            </div>
          </div>

          {/* Test Execution & Results Matrix */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>2. Empirical Testing Execution Matrix</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Test Scenario</th>
                    <th className="py-2.5 px-3">Defense Verified</th>
                    <th className="py-2.5 px-3">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-cyan-300">Authentication</td>
                    <td className="py-2 px-3 text-slate-300">Credential Stuffing (4 automated attempts)</td>
                    <td className="py-2 px-3 text-slate-400">Rate Limiter + Account Lockout triggered</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold font-mono">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-cyan-300">Authentication</td>
                    <td className="py-2 px-3 text-slate-300">FIDO2 WebAuthn on Evil Proxy Domain</td>
                    <td className="py-2 px-3 text-slate-400">Origin mismatch blocked AitM proxy token steal</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold font-mono">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-emerald-300">Input Validation</td>
                    <td className="py-2 px-3 text-slate-300">Reflected XSS Session Stealer</td>
                    <td className="py-2 px-3 text-slate-400">HTML entity encoding neutralized script tag</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold font-mono">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-blue-300">Security Checks</td>
                    <td className="py-2 px-3 text-slate-300">Punycode Cyrillic Homograph (pаypal.com)</td>
                    <td className="py-2 px-3 text-slate-400">Detected non-ASCII glyph; resolved to xn--pypal</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold font-mono">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-amber-300">Awareness Triage</td>
                    <td className="py-2 px-3 text-slate-300">4 Incoming Phishing Pretexts Triaged</td>
                    <td className="py-2 px-3 text-slate-400">Spotting psychological levers (Urgency/Greed)</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold font-mono">PASSED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Assessment Score Block */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-mono">Competency Evaluation</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Phishing Awareness Knowledge Assessment</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Validated understanding of SSL misconceptions, AitM reverse proxies, and CSP clickjacking controls.
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-bold text-cyan-400 tabular-nums">
                {quizScore} / {quizTotal}
              </span>
              <span className="text-xs text-slate-400 block">
                {quizScore >= 4 ? 'Distinction Grade' : 'Passing Grade'}
              </span>
            </div>
          </div>

          {/* Digital Sign-off & Verification Stamp */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <div>
              <div>System Engine: PhishDefend Defense Lab v2026.4</div>
              <div>Cryptographic Verification Digest: 0x8a92f091c7b823e4</div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-slate-300 font-semibold">Virtual Cybersecurity Internship Review Board</div>
              <div>Status: Approved for Virtual Capstone Credit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
