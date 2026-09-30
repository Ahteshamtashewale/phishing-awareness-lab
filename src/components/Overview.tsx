import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Code2, 
  Globe2, 
  Terminal, 
  MailWarning, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Activity
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { setActiveTab, tasks, internName, internId, internOrg, setIsSubmissionModalOpen } = useSecurity();
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-wider uppercase mb-3">
            <span>Virtual Cybersecurity Internship</span>
            <span aria-hidden="true">·</span>
            <span>Practical Defense Lab</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Term 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white sm:leading-tight">
            Phishing Awareness & Cyber Defense Engineering Lab
          </h1>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
            A comprehensive, hands-on security engineering project demonstrating core defensive concepts against modern social engineering, adversary-in-the-middle credential harvesting, and web-based attack vectors.
          </p>

          {/* Intern Profile Card */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-800/80 pt-5 text-xs text-slate-400">
            <div>
              <span className="text-slate-500">Candidate:</span>{' '}
              <span className="font-semibold text-slate-200">{internName}</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div>
              <span className="text-slate-500">ID:</span>{' '}
              <span className="font-mono text-cyan-300">{internId}</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div>
              <span className="text-slate-500">Specialization:</span>{' '}
              <span className="text-slate-200">{internOrg}</span>
            </div>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="relative z-10 mt-8 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Internship Deliverables Progression</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete all 5 hands-on labs and simulations to unlock your verified submission dossier.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-cyan-400 tabular-nums">{progressPercent}%</span>
              <button
                onClick={() => setIsSubmissionModalOpen(true)}
                className="rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition shadow-sm"
              >
                Review & Export Dossier
              </button>
            </div>
          </div>

          <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Core Defense Pillars */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Core Engineering Competencies</h2>
          <p className="text-xs text-slate-400 mt-1">
            Five pillars of modern application security and human risk mitigation implemented in this lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono text-slate-500">Pillar 01</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">Authentication & Phishing Resistance</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Analyze cryptographic salted hashing, credential stuffing mitigations, rate limiting backoffs, and why FIDO2/WebAuthn hardware keys prevent Adversary-in-the-Middle (AitM) proxy attacks.
            </p>
            <button
              onClick={() => setActiveTab('auth')}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              <span>Launch Auth Sandbox</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono text-slate-500">Pillar 02</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">Input Validation & Sanitization</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Defend against reflected XSS cookie stealers, SQL injection auth bypasses, and open redirection tricks commonly embedded in weaponized phishing emails.
            </p>
            <button
              onClick={() => setActiveTab('input')}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              <span>Launch Input Sanitizer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono text-slate-500">Pillar 03</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">Security Checks & URL Scanner</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Inspect Internationalized Domain Name (IDN) homograph attacks, typosquatting variants, HTTPS security misconceptions, CSP/HSTS headers, and email SPF/DKIM/DMARC records.
            </p>
            <button
              onClick={() => setActiveTab('scanner')}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
            >
              <span>Run Domain & Header Checks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Pillar 4 */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono text-slate-500">Pillar 04</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">SIEM & Incident Event Logging</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Maintain an immutable audit trail of authentication failures, rate limit spikes, and blocked malicious payloads in Common Event Format (CEF) for security analyst response.
            </p>
            <button
              onClick={() => setActiveTab('logging')}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400 transition hover:text-purple-300"
            >
              <span>Inspect SIEM Telemetry</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Pillar 5 */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900/80 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <MailWarning className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono text-slate-500">Pillar 05</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">Phishing Awareness & Interactive Triage</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Step into the shoes of a corporate SOC analyst triaging incoming suspect emails. Identify psychological manipulation triggers (urgency, authority, greed), spot hidden homograph URLs, and practice safe quarantine protocols.
            </p>
            <button
              onClick={() => setActiveTab('simulation')}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400 transition hover:text-amber-300"
            >
              <span>Enter Triage Arena & Quiz</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Phishing Kill Chain & Defense Model */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">The Modern Phishing Kill Chain & Defensive Interventions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Understanding the multi-stage attack pathway and where each security control intercepts adversary actions.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-2">Stage 01</div>
              <h4 className="text-sm font-semibold text-white">Recon & Spoofing</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Adversary registers typosquatted domain (e.g. micr0soft.com) and crafts pretext.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
              🛡 Defense: SPF, DKIM, DMARC, Domain Monitoring
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-2">Stage 02</div>
              <h4 className="text-sm font-semibold text-white">Delivery & Social Engineering</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Weaponized email triggers panic, fake urgency, or greed to force click.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
              🛡 Defense: Employee Awareness & Email Triage
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-2">Stage 03</div>
              <h4 className="text-sm font-semibold text-white">Fake Landing Page</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Adversary replicates login portal with free SSL certificate to capture credentials.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
              🛡 Defense: Punycode Detection & URL Scanners
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-2">Stage 04</div>
              <h4 className="text-sm font-semibold text-white">Credential & OTP Capture</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Attacker proxies password & intercepts 6-digit TOTP code in real time (AitM).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
              🛡 Defense: FIDO2/WebAuthn Origin Binding
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-2">Stage 05</div>
              <h4 className="text-sm font-semibold text-white">Post-Breach & Lateral Move</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Attacker leverages stolen session cookie or API tokens inside cloud ecosystem.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
              🛡 Defense: SIEM Logging & Rate Limiting
            </div>
          </div>
        </div>
      </section>

      {/* Practical Tasks Checklist */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Internship Action Checklist</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track your experimental results across all modules to substantiate your final project dossier.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {completedCount} of {tasks.length} Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:bg-slate-900/80"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {task.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-700 bg-slate-950" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-cyan-400 font-medium">{task.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className={task.isCompleted ? 'text-emerald-400' : 'text-slate-500'}>
                      {task.isCompleted ? 'Verified Complete' : 'Pending Verification'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 mt-0.5">{task.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">{task.description}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab(task.targetTab)}
                className="shrink-0 self-end sm:self-center rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
              >
                {task.isCompleted ? 'Re-open Module' : 'Open Lab Module'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
