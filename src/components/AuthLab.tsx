import React, { useState, useEffect } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  AlertTriangle, 
  Fingerprint, 
  Cpu, 
  Check, 
  Copy,
  Zap
} from 'lucide-react';

export const AuthLab: React.FC = () => {
  const { addLog, completeTask } = useSecurity();

  // Lab 1: Password Hashing State
  const [inputPassword, setInputPassword] = useState('SecurePasswd#2026!');
  const [salt, setSalt] = useState('7d8f4e2a1b9c3f0e');
  const [costFactor, setCostFactor] = useState(12);
  const [copiedHash, setCopiedHash] = useState(false);

  // Compute a deterministic simulated cryptographic hash representation
  const simulatedHash = `$2b$${costFactor}$${salt}${btoa(inputPassword).substring(0, 28).replace(/=/g, '')}9f2a0b1c7`;

  // Password entropy calculation
  const calculateEntropy = (pwd: string) => {
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;
    if (pool === 0 || pwd.length === 0) return 0;
    return Math.round(pwd.length * Math.log2(pool));
  };
  const entropy = calculateEntropy(inputPassword);

  // Lab 2: Rate Limiting & Credential Stuffing Simulator
  const [isRateLimiterEnabled, setIsRateLimiterEnabled] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);
  const [simulatedAttackRunning, setSimulatedAttackRunning] = useState(false);
  const [stuffingLog, setStuffingLog] = useState<string[]>([]);

  // Lab 3: MFA TOTP Simulator
  const [totpCode, setTotpCode] = useState('849 201');
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [mfaType, setMfaType] = useState<'totp' | 'fido2' | 'sms'>('totp');
  const [fidoOriginVerified, setFidoOriginVerified] = useState<boolean | null>(null);

  // Timer for TOTP countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const seconds = 30 - (now.getSeconds() % 30);
      setSecondsRemaining(seconds);

      if (seconds === 30) {
        // Generate new random 6-digit TOTP
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setTotpCode(`${newCode.slice(0, 3)} ${newCode.slice(3)}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutCountdown > 0) {
      const timer = setTimeout(() => {
        setLockoutCountdown((prev) => {
          if (prev <= 1) {
            setIsAccountLocked(false);
            setFailedAttempts(0);
            addLog({
              eventType: 'AUTH_LOGIN_SUCCESS',
              severity: 'NOTICE',
              sourceIp: '198.51.100.42',
              details: 'Temporary security lockout expired. Account reinstated for normal authentication challenges.',
              actionTaken: 'LOCKOUT_RELEASED'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutCountdown, addLog]);

  // Simulate automated credential stuffing attack
  const triggerCredentialStuffingAttack = () => {
    if (simulatedAttackRunning || isAccountLocked) return;
    setSimulatedAttackRunning(true);
    setStuffingLog([]);

    const commonPasswords = [
      'Password123!',
      'Welcome2026#',
      'CompanyPortal@1',
      'Summer2025!',
      'Admin@2026',
      'CorporateAccess99'
    ];

    let currentAttempt = 0;

    const interval = setInterval(() => {
      if (currentAttempt >= commonPasswords.length) {
        clearInterval(interval);
        setSimulatedAttackRunning(false);
        return;
      }

      const testedPwd = commonPasswords[currentAttempt];
      const attemptNum = currentAttempt + 1;

      if (isRateLimiterEnabled && attemptNum >= 4) {
        // Trigger account lock
        clearInterval(interval);
        setSimulatedAttackRunning(false);
        setIsAccountLocked(true);
        setLockoutCountdown(15);
        setFailedAttempts(4);
        setStuffingLog((prev) => [
          `[CRITICAL ALERT] 4 failed auth attempts from 198.51.100.42. Rate limiter tripped! Account locked for 15s.`,
          ...prev
        ]);
        addLog({
          eventType: 'AUTH_ACCOUNT_LOCKED',
          severity: 'CRITICAL',
          sourceIp: '198.51.100.42',
          details: `Credential stuffing detected against target user. Account auto-locked via exponential backoff policy.`,
          actionTaken: 'TEMPORARY_ACCOUNT_LOCKOUT',
          rawPayload: `User: employee@company.com | Attempt: ${testedPwd}`
        });
        completeTask('task-1');
        return;
      }

      setFailedAttempts((prev) => prev + 1);
      setStuffingLog((prev) => [
        `[AUTH_FAIL] IP 198.51.100.42 tried "${testedPwd}" → HTTP 401 Unauthorized`,
        ...prev
      ]);

      addLog({
        eventType: 'AUTH_LOGIN_FAILURE',
        severity: 'WARNING',
        sourceIp: '198.51.100.42',
        details: `Invalid credential submission (Attempt #${attemptNum}).`,
        actionTaken: 'HTTP_401_REJECT',
        rawPayload: `Testing: ${testedPwd.slice(0, 3)}***`
      });

      currentAttempt++;
    }, 700);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(simulatedHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    completeTask('task-1');
  };

  const handleTestFidoVerification = (targetDomain: string) => {
    completeTask('task-1');
    if (targetDomain === 'login.microsoftonline.com') {
      setFidoOriginVerified(true);
      addLog({
        eventType: 'AUTH_LOGIN_SUCCESS',
        severity: 'INFO',
        sourceIp: '10.0.4.12',
        details: 'FIDO2 / WebAuthn cryptographic assertion verified with matching origin https://login.microsoftonline.com. Authentication approved.',
        actionTaken: 'WEBAUTHN_ORIGIN_APPROVED'
      });
    } else {
      setFidoOriginVerified(false);
      addLog({
        eventType: 'AUTH_LOGIN_FAILURE',
        severity: 'CRITICAL',
        sourceIp: '198.51.100.77',
        details: `FIDO2 assertion blocked! Browser origin was '${targetDomain}', but relying party ID is 'microsoftonline.com'. AitM Phishing Proxy intercepted.`,
        actionTaken: 'ORIGIN_MISMATCH_REJECTED'
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
          <span>Module 01</span>
          <span aria-hidden="true">·</span>
          <span>Authentication Principles</span>
          <span aria-hidden="true">·</span>
          <span>Credential Defense</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Authentication Security & Phishing Resistance
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Phishing attacks primarily target authentication credentials. Explore the cryptographic mechanics of password storage, test defensive rate-limiting against automated credential stuffing, and examine how modern FIDO2/WebAuthn stops adversary reverse-proxy attacks.
        </p>
      </div>

      {/* Section 1: Salted Hashing & Storage */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>01. Cryptographic Password Hashing & Salt Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Why plaintext and unsalted hashes are fatal if a phishing site or database leaks credentials.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            <span>Algorithm:</span> <span className="text-cyan-400 font-semibold">bcrypt / Argon2id</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input side */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Test Plaintext Password
              </label>
              <input
                type="text"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="Enter a password to hash..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Cost Factor (Work Factor)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="14"
                    value={costFactor}
                    onChange={(e) => setCostFactor(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <span className="font-mono text-xs text-cyan-400 font-bold tabular-nums">2^{costFactor}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Higher cost = Exponentially slower to brute-force offline.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Unique Per-User Salt
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 truncate">
                    {salt}
                  </span>
                  <button
                    onClick={() => {
                      const newSalt = Math.random().toString(16).substring(2, 18);
                      setSalt(newSalt);
                    }}
                    title="Regenerate Salt"
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Neutralizes pre-computed Rainbow Tables.
                </p>
              </div>
            </div>

            {/* Entropy gauge */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Calculated Password Entropy:</span>
                <span className={`font-mono font-bold ${entropy >= 60 ? 'text-emerald-400' : entropy >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {entropy} bits {entropy >= 60 ? '(Strong)' : entropy >= 40 ? '(Moderate)' : '(Weak)'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${entropy >= 60 ? 'bg-emerald-500' : entropy >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(100, (entropy / 80) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                NIST SP 800-63B guidelines recommend passphrases with &ge; 64 bits of entropy to prevent dictionary attacks.
              </p>
            </div>
          </div>

          {/* Output side */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                <span>Stored Database Record</span>
                <span className="text-emerald-400 text-[11px]">One-Way Hash</span>
              </div>

              <div>
                <span className="text-slate-500">Algorithm Prefix:</span>
                <span className="text-cyan-400 ml-2">$2b$ (bcrypt)</span>
              </div>

              <div>
                <span className="text-slate-500">Cost Parameter:</span>
                <span className="text-amber-400 ml-2">${costFactor}$</span>
              </div>

              <div>
                <span className="text-slate-500">Embedded Salt:</span>
                <span className="text-purple-400 ml-2">{salt}</span>
              </div>

              <div>
                <span className="text-slate-500">Cryptographic Digest:</span>
                <div className="mt-1 break-all rounded bg-slate-900 p-2.5 text-slate-200 border border-slate-800">
                  {simulatedHash}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Irreversible: Cannot be decrypted back to plaintext.</span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-sans font-medium"
              >
                {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedHash ? 'Copied to Clipboard' : 'Copy Hash String'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Credential Stuffing & Rate Limiting Defense */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>02. Credential Stuffing & Exponential Rate Limiter</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              When users fall for phishing, adversaries test stolen password pairs across corporate portals using automated botnets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Rate Limiter Active:</span>
            <button
              onClick={() => setIsRateLimiterEnabled(!isRateLimiterEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isRateLimiterEnabled ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRateLimiterEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="text-xs font-semibold text-white">Target Account Under Attack</div>
              <div className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                employee@company.com
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Failed Attempts:</span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">{failedAttempts} / 4 limit</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Account Status:</span>
                <span className={`font-semibold ${isAccountLocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isAccountLocked ? `LOCKED (${lockoutCountdown}s remaining)` : 'ACTIVE / UNLOCKED'}
                </span>
              </div>

              <button
                disabled={simulatedAttackRunning || isAccountLocked}
                onClick={triggerCredentialStuffingAttack}
                className="w-full mt-2 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50 transition shadow-sm"
              >
                {simulatedAttackRunning ? 'Attack Bot Running...' : isAccountLocked ? 'Account Temporarily Locked' : 'Simulate Botnet Credential Stuffing'}
              </button>
            </div>

            <div className="text-[12px] text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <strong className="text-slate-200">Defensive Implementation:</strong> In production systems (Express, NGINX), express-rate-limit and Redis tokens track requests per IP & username. Upon 4 invalid hashes, exponential backoff (15s, 60s, 15m) stops automated attacks cold.
            </div>
          </div>

          {/* Live Attack Telemetry Feed */}
          <div className="lg:col-span-2 flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-400">
              <span>Authentication Gate Telemetry</span>
              <span className="text-[11px] text-cyan-400 font-sans">Real-time Stream</span>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto max-h-52 space-y-2 pr-1">
              {stuffingLog.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-slate-600 font-sans text-xs">
                  Click "Simulate Botnet Credential Stuffing" to watch attack traffic and defensive rate limiting.
                </div>
              ) : (
                stuffingLog.map((line, idx) => (
                  <div
                    key={idx}
                    className={`rounded p-2 text-[11px] ${
                      line.includes('CRITICAL')
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: MFA Evolution & Phishing Resistance (TOTP vs FIDO2) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-cyan-400" />
            <span>03. Multi-Factor Authentication: Why SMS & TOTP Fail Against AitM Phishing</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Modern phishing toolkits (e.g. Evilginx, Modlishka) act as reverse proxies, capturing 6-digit TOTP codes and session cookies in real time. Only FIDO2/WebAuthn provides true cryptographic origin binding.
          </p>
        </div>

        {/* Tab switch for MFA mechanism */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setMfaType('totp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              mfaType === 'totp'
                ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            TOTP Simulator (RFC 6238)
          </button>
          <button
            onClick={() => setMfaType('fido2')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              mfaType === 'fido2'
                ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            FIDO2 / WebAuthn Origin Binding Lab
          </button>
          <button
            onClick={() => setMfaType('sms')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              mfaType === 'sms'
                ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            SMS / Telephony Vulnerability
          </button>
        </div>

        {mfaType === 'totp' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400 font-mono">Time-Based One-Time Password</span>
              <div className="my-4 font-mono text-4xl font-bold tracking-widest text-cyan-400 tabular-nums">
                {totpCode}
              </div>

              {/* Progress ring or bar */}
              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Rotating in:</span>
                  <span className="text-cyan-400 font-bold">{secondsRemaining}s</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 text-[11px] text-slate-500">
                Formula: HMAC-SHA1(SecretKey, floor(UnixTime / 30))
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
                <div className="font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>The AitM (Adversary-in-the-Middle) Vulnerability</span>
                </div>
                When a victim types this 6-digit TOTP code into a phishing website, the attacker's server automatically relays it to the real Microsoft/Google login in under 1 second. Once the real server accepts it, the attacker captures the authenticated session cookie!
              </div>

              <p className="text-slate-400">
                Therefore, TOTP and SMS are <strong>NOT phishing-resistant</strong>. Attackers do not need to break the algorithm; they simply proxy the code during its 30-second validity window.
              </p>
            </div>
          </div>
        )}

        {mfaType === 'fido2' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Simulate WebAuthn Hardware Security Key Authentication</span>
                <span className="text-emerald-400 font-mono">FIDO2 / CTAP2 Standard</span>
              </div>
              <p className="text-xs text-slate-400">
                Test how a cryptographic hardware key (e.g. YubiKey) responds when a user authenticates on the legitimate corporate portal vs when duped by an attacker's phishing proxy domain.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-3">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Legitimate Origin Scenario</span>
                  </div>
                  <div className="font-mono text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    Browser URL: https://login.microsoftonline.com
                  </div>
                  <button
                    onClick={() => handleTestFidoVerification('login.microsoftonline.com')}
                    className="w-full rounded bg-emerald-600/80 hover:bg-emerald-600 py-1.5 text-xs font-semibold text-white transition"
                  >
                    Authenticate with FIDO2 Key
                  </button>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-3">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Adversary Phishing Proxy Scenario</span>
                  </div>
                  <div className="font-mono text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    Browser URL: https://login.microsoftonline.com.evil-proxy.xyz
                  </div>
                  <button
                    onClick={() => handleTestFidoVerification('login.microsoftonline.com.evil-proxy.xyz')}
                    className="w-full rounded bg-rose-600/80 hover:bg-rose-600 py-1.5 text-xs font-semibold text-white transition"
                  >
                    Authenticate with FIDO2 Key
                  </button>
                </div>
              </div>

              {fidoOriginVerified !== null && (
                <div
                  className={`mt-4 rounded-lg p-3 text-xs border ${
                    fidoOriginVerified
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {fidoOriginVerified ? (
                    <div>
                      <strong>Success:</strong> The browser cryptographically verified the relying party ID matches the origin domain. The security key signed the challenge using the hardware private key.
                    </div>
                  ) : (
                    <div>
                      <strong>PHISHING THWARTED:</strong> The browser detected an origin mismatch ('evil-proxy.xyz' vs registered 'microsoftonline.com'). The security key refused to produce the credential signature, completely defeating the AitM phishing attack!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {mfaType === 'sms' && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3 text-xs leading-relaxed text-slate-300">
            <h3 className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Critical Security Risks of SMS-Based Authentication</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong>SS7 Signaling Protocol Exploitation:</strong> Attackers can intercept SMS text messages across global telecommunications routing networks without touching the target device.</li>
              <li><strong>SIM Swapping:</strong> Social engineering phone carrier help desks allows attackers to port the victim\'s phone number to a rogue SIM card.</li>
              <li><strong>Zero Origin Binding:</strong> Users routinely copy SMS numbers into fake phishing input fields without recognizing deceptive URLs.</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};
