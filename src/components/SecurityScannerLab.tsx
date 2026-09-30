import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { 
  Globe2, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  Layers, 
  MailCheck, 
  Check, 
  RefreshCw,
  ExternalLink,
  Lock
} from 'lucide-react';

interface UrlPreset {
  label: string;
  url: string;
  type: 'homograph' | 'subdomain_spoof' | 'typosquat' | 'legitimate';
  notes: string;
}

const URL_PRESETS: UrlPreset[] = [
  {
    label: 'Cyrillic Homograph Attack (Punycode)',
    url: 'https://pаypal.com/signin/verify', // Contains Cyrillic small letter 'а' (U+0430)
    type: 'homograph',
    notes: 'The letter "а" is Cyrillic (U+0430), not Latin "a". In Punycode, this resolves to xn--pypal-4ve.com.'
  },
  {
    label: 'Subdomain Cloaking / Lookalike Domain',
    url: 'https://login.microsoftonline.com.account-auth-verify.xyz/oauth',
    type: 'subdomain_spoof',
    notes: 'Threat actors prefix their own domain (account-auth-verify.xyz) with trusted brand names as subdomains.'
  },
  {
    label: 'Typosquatting & Digit Substitution',
    url: 'https://paypa1-security.com/update-card',
    type: 'typosquat',
    notes: 'Substitutes letter "l" with number "1" and adds generic word "security".'
  },
  {
    label: 'Legitimate Corporate Domain',
    url: 'https://portal.company.com/sso/login',
    type: 'legitimate',
    notes: 'Valid, registered corporate subdomain on official apex domain.'
  }
];

export const SecurityScannerLab: React.FC = () => {
  const { addLog, completeTask } = useSecurity();
  const [testUrl, setTestUrl] = useState(URL_PRESETS[0].url);
  const [activeTab, setActiveTab] = useState<'url' | 'headers' | 'email_auth'>('url');

  // Check URL analysis
  const analyzeUrl = (urlStr: string) => {
    let clean = urlStr.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }

    try {
      const parsed = new URL(clean);
      const hostname = parsed.hostname;
      
      // Check for non-ASCII characters (Homograph check)
      const hasNonAscii = /[^\u0000-\u007F]/.test(hostname);
      
      // Punycode representation simulation
      let punycode = hostname;
      if (hasNonAscii) {
        punycode = `xn--${hostname.replace(/[^\u0000-\u007F]/g, 'a')}-4ve.com`;
      }

      // Check for number substitutions like 0 for o, 1 for l
      const hasDigitSwap = /[01]/.test(hostname) && (hostname.includes('micr0') || hostname.includes('paypa1') || hostname.includes('g00gle'));

      // Check for suspicious TLDs
      const suspiciousTlds = ['.xyz', '.top', '.click', '.online', '.ru', '.cf', '.tk', '.gq', '.ml', '.cc'];
      const hasSuspiciousTld = suspiciousTlds.some((tld) => hostname.endsWith(tld));

      // Subdomain nesting check: e.g. login.microsoftonline.com.something.xyz
      const parts = hostname.split('.');
      const isSubdomainSpoof = parts.length >= 4 && (hostname.includes('microsoft') || hostname.includes('google') || hostname.includes('paypal') || hostname.includes('apple'));

      const isPhishing = hasNonAscii || hasDigitSwap || (hasSuspiciousTld && isSubdomainSpoof) || isSubdomainSpoof;

      return {
        hostname,
        protocol: parsed.protocol,
        pathname: parsed.pathname,
        hasNonAscii,
        punycode,
        hasDigitSwap,
        hasSuspiciousTld,
        isSubdomainSpoof,
        isPhishing,
        riskScore: isPhishing ? 94 : 12
      };
    } catch {
      return {
        hostname: 'Invalid URL Format',
        protocol: 'none',
        pathname: '/',
        hasNonAscii: false,
        punycode: 'invalid',
        hasDigitSwap: false,
        hasSuspiciousTld: false,
        isSubdomainSpoof: false,
        isPhishing: false,
        riskScore: 0
      };
    }
  };

  const scanResult = analyzeUrl(testUrl);

  const handleExecuteScan = () => {
    completeTask('task-3');

    if (scanResult.hasNonAscii) {
      addLog({
        eventType: 'URL_HOMOGRAPH_DETECTED',
        severity: 'CRITICAL',
        sourceIp: '192.168.1.50',
        details: `IDN Homograph unicode spoofing flagged on host "${scanResult.hostname}". Punycode: ${scanResult.punycode}.`,
        actionTaken: 'DOMAIN_BLOCKED_AT_RESOLVER',
        rawPayload: testUrl
      });
    } else if (scanResult.isPhishing) {
      addLog({
        eventType: 'URL_TYPOSQUAT_FLAGGED',
        severity: 'CRITICAL',
        sourceIp: '192.168.1.50',
        details: `Typosquatted lookalike domain identified. Suspicious apex domain and brand masquerade.`,
        actionTaken: 'DNS_SINKHOLE_FORWARDED',
        rawPayload: testUrl
      });
    } else {
      addLog({
        eventType: 'HEADER_SECURITY_CHECK',
        severity: 'INFO',
        sourceIp: '192.168.1.50',
        details: `Legitimate domain structure verified. Apex domain matches authenticated corporate perimeter.`,
        actionTaken: 'CONNECTION_PERMITTED'
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">
          <span>Module 03</span>
          <span aria-hidden="true">·</span>
          <span>Security Checks</span>
          <span aria-hidden="true">·</span>
          <span>Protocols & Headers</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Security Checks: URL Homographs, Security Headers & SPF/DKIM
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Phishing websites rely on deceptive URLs, SSL misdirection, and unconfigured email security policies. Analyze internationalized homograph attacks, inspect HTTP security headers (CSP, HSTS), and review SPF/DKIM/DMARC alignment.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('url')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'url'
              ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          URL & Homograph Scanner
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'headers'
              ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          HTTP Security Headers (CSP, HSTS)
        </button>
        <button
          onClick={() => setActiveTab('email_auth')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeTab === 'email_auth'
              ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Email Protocols: SPF, DKIM & DMARC
        </button>
      </div>

      {/* Tab 1: URL & Homograph Scanner */}
      {activeTab === 'url' && (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">Quick Test Cases:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {URL_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestUrl(p.url)}
                  className={`text-left rounded-lg border p-2.5 transition text-xs ${
                    testUrl === p.url
                      ? 'border-blue-500/60 bg-blue-950/20 text-blue-200'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold truncate">{p.label}</div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate font-mono">{p.url}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive URL Scanner Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/login"
                />
              </div>
              <button
                onClick={handleExecuteScan}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-sm whitespace-nowrap"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Run Deep Protocol Scan</span>
              </button>
            </div>

            {/* Analysis Result Matrix */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Target Hostname Analysis</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5 break-all">
                    {scanResult.hostname}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Threat Verdict:</span>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                      scanResult.isPhishing
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {scanResult.isPhishing ? 'MALICIOUS / PHISHING INDICATOR' : 'LOW RISK / LEGITIMATE'}
                  </span>
                </div>
              </div>

              {/* Grid of indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="rounded-lg border border-slate-800/90 bg-slate-900/60 p-3 space-y-1">
                  <span className="text-slate-500 block">IDN Homograph Glyphs:</span>
                  <span className={`font-mono font-bold ${scanResult.hasNonAscii ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {scanResult.hasNonAscii ? 'DETECTED (Non-ASCII)' : 'CLEAN (ASCII Only)'}
                  </span>
                  {scanResult.hasNonAscii && (
                    <div className="text-[10px] text-rose-300 font-mono mt-1 break-all">
                      Punycode: {scanResult.punycode}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-slate-800/90 bg-slate-900/60 p-3 space-y-1">
                  <span className="text-slate-500 block">Subdomain Masquerading:</span>
                  <span className={`font-mono font-bold ${scanResult.isSubdomainSpoof ? 'text-rose-400' : 'text-slate-300'}`}>
                    {scanResult.isSubdomainSpoof ? 'HIGH RISK (Brand Cloak)' : 'Normal Structure'}
                  </span>
                </div>

                <div className="rounded-lg border border-slate-800/90 bg-slate-900/60 p-3 space-y-1">
                  <span className="text-slate-500 block">Typosquat Digit Swap:</span>
                  <span className={`font-mono font-bold ${scanResult.hasDigitSwap ? 'text-rose-400' : 'text-slate-300'}`}>
                    {scanResult.hasDigitSwap ? 'SUSPICIOUS (0/1 Swap)' : 'None Detected'}
                  </span>
                </div>

                <div className="rounded-lg border border-slate-800/90 bg-slate-900/60 p-3 space-y-1">
                  <span className="text-slate-500 block">Apex Registrar TLD Risk:</span>
                  <span className={`font-mono font-bold ${scanResult.hasSuspiciousTld ? 'text-amber-400' : 'text-slate-300'}`}>
                    {scanResult.hasSuspiciousTld ? 'ELEVATED (High Abuse TLD)' : 'Standard Registry'}
                  </span>
                </div>
              </div>

              {/* Explanatory callout */}
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs text-slate-300 leading-relaxed">
                <strong className="text-blue-300">Why Modern Phishing Exploits IDN Homographs:</strong> Unicode contains thousands of characters from Greek, Cyrillic, and Cherokee scripts that appear visually identical to standard Latin characters. A user seeing <code className="text-white">pаypal.com</code> cannot optically distinguish the Cyrillic "а" from the Latin "a", but the operating system routes the request to an entirely different foreign server!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: HTTP Security Headers Inspector */}
      {activeTab === 'headers' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>HTTP Defense-in-Depth Security Headers</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How properly configured edge response headers neutralize clickjacking, SSL stripping, and malicious script execution.
            </p>
          </div>

          <div className="space-y-4">
            {/* Header 1 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">Content-Security-Policy (CSP)</span>
                <span className="text-[11px] font-mono text-emerald-400">MANDATORY</span>
              </div>
              <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                default-src 'self'; script-src 'self' https://trusted-cdn.com; frame-ancestors 'none';
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Anti-Phishing Role:</strong> Restricts where the browser can load scripts, styles, and image beacons from. Even if an attacker injects an XSS payload via an open redirect, CSP halts outbound credential exfiltration.
              </p>
            </div>

            {/* Header 2 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">X-Frame-Options & CSP frame-ancestors</span>
                <span className="text-[11px] font-mono text-emerald-400">CLICKJACKING DEFENSE</span>
              </div>
              <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                X-Frame-Options: DENY
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Anti-Phishing Role:</strong> Prohibits attackers from loading the real login portal inside an invisible &lt;iframe&gt; overlaid with transparent deceptive buttons (Clickjacking).
              </p>
            </div>

            {/* Header 3 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">Strict-Transport-Security (HSTS)</span>
                <span className="text-[11px] font-mono text-emerald-400">SSL ENFORCEMENT</span>
              </div>
              <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Anti-Phishing Role:</strong> Forces browsers to connect exclusively over TLS/HTTPS, neutralizing SSL-strip attacks on public Wi-Fi networks where attackers downgrade connections to unencrypted HTTP.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Email Protocols: SPF, DKIM, DMARC */}
      {activeTab === 'email_auth' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MailCheck className="h-4 w-4 text-emerald-400" />
              <span>Email Protocol Security Triad: SPF, DKIM & DMARC</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The trio of DNS-based authentication mechanisms that protect corporate domains against sender address spoofing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="text-xs font-bold text-cyan-400 font-mono">1. SPF (Sender Policy Framework)</div>
              <div className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                v=spf1 ip4:198.51.100.0/24 -all
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A DNS TXT record listing authorized IP addresses permitted to send emails on behalf of the domain. If an unauthorized IP relays mail, SPF returns <code className="text-rose-400">FAIL</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="text-xs font-bold text-cyan-400 font-mono">2. DKIM (DomainKeys)</div>
              <div className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                DKIM-Signature: v=1; a=rsa-sha256; ...
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographically signs the email headers and body using a private key. Receiving mail servers verify the digital signature against the public key published in DNS, preventing in-transit tampering.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="text-xs font-bold text-cyan-400 font-mono">3. DMARC Policy Enforcement</div>
              <div className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                v=DMARC1; p=reject; rua=mailto:...
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tells receiving gateways what to do if SPF or DKIM fails. When configured with <code className="text-emerald-400 font-bold">p=reject</code>, forged emails from unauthorized servers are dropped before ever touching the victim's inbox!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
