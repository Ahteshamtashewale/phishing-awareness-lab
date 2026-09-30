import { PhishingScenario } from '../types/security';

export const PHISHING_SCENARIOS: PhishingScenario[] = [
  {
    id: 'scenario-1',
    title: 'Urgent IT Admin: Multi-Factor Authentication Re-Authentication Required',
    category: 'Credential Harvesting',
    senderName: 'Corporate IT Service Desk',
    senderEmail: 'helpdesk@it-support-portal-internal.online',
    replyTo: 'harvester-relay@vps-992.xyz',
    returnPath: 'bounce@vps-992.xyz',
    subject: 'CRITICAL: Your Microsoft 365 MFA session will expire in 2 hours',
    date: 'Today at 08:42 AM',
    displayUrlText: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    simulatedDestinationUrl: 'http://login.microsoftonline.com.account-auth-verify.xyz/login?session=a891f7',
    hasAttachment: false,
    isLegitimate: false,
    psychologicalTrigger: 'Urgency & Fear of account lockout',
    difficulty: 'Intermediate',
    spfStatus: 'FAIL',
    dkimStatus: 'FAIL',
    dmarcStatus: 'FAIL',
    redFlags: [
      {
        id: 'rf-1',
        label: 'Mismatched Top-Level Domain',
        explanation: 'Sender uses @it-support-portal-internal.online instead of the official internal corporate domain (@company.com).',
        location: 'sender'
      },
      {
        id: 'rf-2',
        label: 'Artificial Urgency Trigger',
        explanation: 'Creates panic by demanding action "within 2 hours" to prevent critical operational lockout.',
        location: 'subject'
      },
      {
        id: 'rf-3',
        label: 'Subdomain Typosquatting / Lookalike URL',
        explanation: 'The link text appears to point to Microsoft, but the actual target domain is account-auth-verify.xyz (a newly registered adversary reverse proxy).',
        location: 'link'
      },
      {
        id: 'rf-4',
        label: 'Failed Email Authentication (SPF/DKIM/DMARC)',
        explanation: 'SPF and DMARC both failed verification, indicating unauthorized mail relays spoofing internal headers.',
        location: 'headers'
      }
    ],
    bodyHtml: `
      <p style="margin-bottom: 12px;">Dear Employee,</p>
      <p style="margin-bottom: 12px;">During our routine quarterly security audit, we detected an anomalous device footprint associated with your single sign-on profile. In accordance with Enterprise Security Standard ISO-27001, your Multi-Factor Authentication (MFA) token will be <strong>revoked within 2 hours</strong>.</p>
      <p style="margin-bottom: 16px;">To avoid interruption to your email, file storage, and ERP access, you must immediately confirm your existing password and approve the secondary authenticator challenge via our portal:</p>
      <p style="margin-bottom: 20px;">
        <span style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: white; border-radius: 4px; font-weight: 600; text-decoration: none;">Verify MFA Security Profile &rarr;</span>
      </p>
      <p style="margin-bottom: 8px; font-size: 13px; color: #64748b;">If you do not complete this verification before 10:45 AM, your corporate access will be permanently locked pending physical IT badge surrender.</p>
      <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 8px; margin-top: 16px;">Internal IT Global Infrastructure &middot; Ticket #SEC-98402</p>
    `,
    remediationAdvice: 'Never follow email links for credential verification. Navigate manually to your corporate identity provider (SSO) portal. Report the email using the SIEM reporting button and block the sender domain.'
  },
  {
    id: 'scenario-2',
    title: 'Shared Confidential Q3 Compensation & Bonus Spreadsheet',
    category: 'Spear Phishing',
    senderName: 'Sarah Jenkins (Chief People Officer)',
    senderEmail: 'sarah.jenkins@company-internal-hr.net',
    replyTo: 'sarah.jenkins@company-internal-hr.net',
    returnPath: 'mail-out-81.company-internal-hr.net',
    subject: 'CONFIDENTIAL: Q3 Executive Compensation Adjustments & Incentive Plan',
    date: 'Yesterday at 04:15 PM',
    displayUrlText: 'https://sharepoint.com/sites/hr/executive-comp/q3_adjustments.xlsx',
    simulatedDestinationUrl: 'https://sharepoint-auth-review.top/docs/view?id=comp992',
    hasAttachment: true,
    attachmentName: 'Q3_Compensation_Summary_Encrypted.xlsm',
    attachmentType: 'Macro-enabled Excel Document (xlsm)',
    isLegitimate: false,
    psychologicalTrigger: 'Curiosity & Financial Greed',
    difficulty: 'Advanced',
    spfStatus: 'PASS',
    dkimStatus: 'FAIL',
    dmarcStatus: 'FAIL',
    redFlags: [
      {
        id: 'rf-2-1',
        label: 'Spear Phishing Impersonation of Executive',
        explanation: 'Impersonating the Chief People Officer to exploit employee curiosity regarding peer compensation.',
        location: 'sender'
      },
      {
        id: 'rf-2-2',
        label: 'Dangerous Macro-Enabled Attachment (.xlsm)',
        explanation: 'File has a .xlsm extension, typically weaponized with Visual Basic for Applications (VBA) macro downloaders.',
        location: 'attachment'
      },
      {
        id: 'rf-2-3',
        label: 'Fake SharePoint Cloud Storage Host',
        explanation: 'The link redirects to sharepoint-auth-review.top, capturing corporate credentials when trying to "view document".',
        location: 'link'
      },
      {
        id: 'rf-2-4',
        label: 'Unsolicited Sensitive Information',
        explanation: 'Executive compensation data is never broadcast to broad distribution lists without prior verified channels.',
        location: 'body'
      }
    ],
    bodyHtml: `
      <p style="margin-bottom: 12px;">Team,</p>
      <p style="margin-bottom: 12px;">Attached is the final confidential compensation matrix approved by the Board for Q3 performance incentives. Please verify your department allocation and individual adjustments.</p>
      <p style="margin-bottom: 16px;">Due to strict data governance, the file is encrypted. You will be prompted to enable macros and log in with your corporate active directory credentials upon opening.</p>
      <div style="background-color: #1e293b; padding: 12px; border-radius: 6px; border: 1px solid #334155; margin-bottom: 16px;">
        <p style="margin: 0; font-weight: 500;">📎 Attachment: <strong>Q3_Compensation_Summary_Encrypted.xlsm</strong> (342 KB)</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Macro security warning: Must click "Enable Content" to decrypt tables.</p>
      </div>
      <p style="font-size: 13px; color: #64748b;">Alternatively, view via secure web preview: <span style="color: #38bdf8; text-decoration: underline;">https://sharepoint.com/sites/hr/executive-comp/q3_adjustments.xlsx</span></p>
      <p style="margin-top: 16px; font-size: 13px;">Warm regards,<br /><strong>Sarah Jenkins</strong><br />Chief People Officer</p>
    `,
    remediationAdvice: 'Never open unsolicited macro-enabled documents (.xlsm, .docm). Macros can execute malicious shellcode to deploy ransomware or keyloggers. Verify high-level compensation communications with HR through standard internal Slack or intranet channels.'
  },
  {
    id: 'scenario-3',
    title: 'Urgent Wire Transfer & Vendor Invoice Routing Update',
    category: 'Whaling / Executive',
    senderName: 'David Zhang (Chief Financial Officer)',
    senderEmail: 'david.zhang.cfo@gmail.com',
    replyTo: 'finance-wire-processing@protonmail.com',
    returnPath: 'finance-wire-processing@protonmail.com',
    subject: 'URGENT: Re-route $48,500 Apex Supplier Invoice wire before 11:00 AM cut-off',
    date: 'Today at 09:12 AM',
    displayUrlText: 'https://treasury-portal.internal-corp.com/wire-confirm',
    simulatedDestinationUrl: 'https://bit.ly/apex-supplier-remittance-update-3849',
    hasAttachment: false,
    isLegitimate: false,
    psychologicalTrigger: 'Authority & Financial Urgency',
    difficulty: 'Intermediate',
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'FAIL',
    redFlags: [
      {
        id: 'rf-3-1',
        label: 'Public Freemail Sender (Gmail) for CFO',
        explanation: 'CFO is emailing from david.zhang.cfo@gmail.com rather than the official corporate domain.',
        location: 'sender'
      },
      {
        id: 'rf-3-2',
        label: 'Mismatched Reply-To Address',
        explanation: 'The Reply-To header points to an anonymous encrypted protonmail address, routing answers straight to the scammer.',
        location: 'headers'
      },
      {
        id: 'rf-3-3',
        label: 'Shortened URL (Bit.ly) Hiding True Destination',
        explanation: 'Uses a URL shortener to conceal the offshore banking credential harvesting page.',
        location: 'link'
      },
      {
        id: 'rf-3-4',
        label: 'Bypassing Standard Dual-Authorization Controls',
        explanation: 'Demands an immediate bypass of invoice approval workflows due to a fake "impending supplier hold".',
        location: 'body'
      }
    ],
    bodyHtml: `
      <p style="margin-bottom: 12px;">Hi Accounts Payable,</p>
      <p style="margin-bottom: 12px;">I am currently in an executive board meeting and unable to take phone calls. Apex Industrial has just notified us that our shipment is on customs hold because their intermediary banking coordinates changed this morning.</p>
      <p style="margin-bottom: 14px;">Please process an expedited SWIFT transfer of <strong>$48,500.00</strong> to their new beneficiary coordinates immediately. I will sign off on the formal PO retrospective paperwork this afternoon.</p>
      <p style="margin-bottom: 16px;">
        <span style="color: #38bdf8; text-decoration: underline; font-weight: 500;">Review Revised Routing Coordinates & Wire Template</span>
      </p>
      <p style="font-size: 13px; color: #94a3b8;">Do not delay as this will halt the entire manufacturing line. Confirm once sent.</p>
      <p style="margin-top: 16px; font-size: 13px;">David Zhang<br />Chief Financial Officer</p>
    `,
    remediationAdvice: 'Business Email Compromise (BEC) fraud accounts for billions in corporate losses. Any request to alter vendor bank accounts or expedite wire transfers MUST be confirmed through out-of-band communication (known phone number on file) and dual-authorization approval.'
  },
  {
    id: 'scenario-4',
    title: 'Routine IT Security Maintenance & Certificate Renewal Notice',
    category: 'Legitimate (Control)',
    senderName: 'SecOps Corporate Infrastructure',
    senderEmail: 'secops@corp-internal.com',
    replyTo: 'secops@corp-internal.com',
    returnPath: 'mail-relay-01.corp-internal.com',
    subject: 'Notice: Scheduled Firewall Firmware Update on Sunday, Oct 5 at 02:00 UTC',
    date: 'Today at 07:30 AM',
    displayUrlText: 'https://status.corp-internal.com/incidents/maint-1005',
    simulatedDestinationUrl: 'https://status.corp-internal.com/incidents/maint-1005',
    hasAttachment: false,
    isLegitimate: true,
    psychologicalTrigger: 'None (Informational Broadcast)',
    difficulty: 'Advanced',
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    redFlags: [],
    bodyHtml: `
      <p style="margin-bottom: 12px;">All Staff,</p>
      <p style="margin-bottom: 12px;">This is a scheduled informational notification regarding standard infrastructure maintenance. The Enterprise Security Operations team will be upgrading edge firewall clusters on Sunday, October 5th, from 02:00 to 03:30 UTC.</p>
      <p style="margin-bottom: 12px;"><strong>Impact:</strong> Internal VPN connections may experience a brief 2-minute failover interruption. No email or cloud storage downtime is anticipated.</p>
      <p style="margin-bottom: 16px; background-color: #1e293b; padding: 10px 14px; border-radius: 4px; font-size: 13px; border-left: 3px solid #10b981;">
        <strong>Safety Note:</strong> IT will <em>NEVER</em> ask for your password, MFA code, or personal device PIN as part of maintenance. Do not share your credentials with anyone.
      </p>
      <p style="font-size: 13px; color: #94a3b8;">You can track real-time network status on our intranet dashboard: <span style="color: #38bdf8;">https://status.corp-internal.com/incidents/maint-1005</span></p>
      <p style="margin-top: 16px; font-size: 13px; color: #64748b;">Enterprise Security Operations Team<br />Ticket REF: CHG-2026-8819</p>
    `,
    remediationAdvice: 'This is a genuine system communication. Notice that all authentication protocols (SPF, DKIM, DMARC) pass, the sender domain matches the internal domain, no credentials are requested, and it explicitly reminds users never to disclose passwords.'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Analyze Authentication & Phishing-Resistant MFA Concepts',
    category: 'Authentication' as const,
    description: 'Explore password hashing vs plain-text storage, test rate-limiting against credential stuffing, and compare TOTP vs FIDO2 WebAuthn authentication.',
    targetTab: 'auth' as const,
    isCompleted: false
  },
  {
    id: 'task-2',
    title: 'Execute Input Validation & Attack Vector Sanitization Tests',
    category: 'Input Validation' as const,
    description: 'Inject XSS, SQLi, and Open Redirect payloads into the live sanitizer engine to observe context-aware HTML escaping and defensive encoding.',
    targetTab: 'input' as const,
    isCompleted: false
  },
  {
    id: 'task-3',
    title: 'Inspect Security Headers, Homographs & Typosquatting URLs',
    category: 'Security Checks' as const,
    description: 'Scan suspicious URLs for Punycode homograph attacks, evaluate CSP and HSTS security headers, and verify SPF/DKIM email authenticity.',
    targetTab: 'scanner' as const,
    isCompleted: false
  },
  {
    id: 'task-4',
    title: 'Audit Incident Logs & SIEM Security Event Stream',
    category: 'Logging' as const,
    description: 'Review structured Common Event Format (CEF) security logs, inspect blocked payload telemetry, and analyze incident severity escalation.',
    targetTab: 'logging' as const,
    isCompleted: false
  },
  {
    id: 'task-5',
    title: 'Conduct Phishing Email Triage & Awareness Simulation',
    category: 'Awareness' as const,
    description: 'Analyze real-world email scenarios, identify social engineering red flags, report malicious campaigns, and generate your Project Submission Dossier.',
    targetTab: 'simulation' as const,
    isCompleted: false
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q-1',
    question: 'Why does an HTTPS padlock icon (SSL/TLS certificate) NOT guarantee that a website is legitimate?',
    options: [
      'HTTPS only encrypts the connection between browser and server; threat actors can easily obtain free, automated SSL certificates for malicious phishing domains.',
      'HTTPS certificates expire every 24 hours, leaving gaps in encryption.',
      'Phishing websites cannot obtain SSL certificates under ICANN guidelines.',
      'HTTPS is only supported by government-certified web platforms.'
    ],
    correctAnswer: 0,
    explanation: 'Over 80% of active phishing websites use legitimate, free SSL/TLS certificates (e.g. Let\'s Encrypt). HTTPS guarantees encryption in transit, NOT the trustworthiness or intent of the domain owner.',
    domain: 'Security Checks & Protocols'
  },
  {
    id: 'q-2',
    question: 'What is an IDN Homograph Attack in the context of phishing URLs?',
    options: [
      'Flooding a web server with identical query parameters until DNS crashes.',
      'Registering domain names using visually identical characters from non-Latin scripts (e.g., Cyrillic "а" instead of Latin "a") to spoof trusted brands.',
      'Using IP addresses directly in email links instead of standard domain names.',
      'Intercepting wireless radio packets between a laptop and router.'
    ],
    correctAnswer: 1,
    explanation: 'Internationalized Domain Name (IDN) homograph attacks exploit visually identical glyphs across different alphabets (such as Cyrillic or Greek) to fool users into believing they are visiting legitimate domains.',
    domain: 'URL & Domain Analysis'
  },
  {
    id: 'q-3',
    question: 'How does FIDO2 / WebAuthn hardware authentication prevent modern reverse-proxy phishing (AitM attacks)?',
    options: [
      'It sends an SMS verification code that changes every 10 seconds.',
      'It cryptographically binds the public key authentication credential to the specific origin (domain URL) in the browser, meaning intercepted signatures fail on attacker proxies.',
      'It requires the user to input a 64-character master password on every visit.',
      'It automatically scans the computer hard drive for Trojan malware.'
    ],
    correctAnswer: 1,
    explanation: 'FIDO2 / WebAuthn implements cryptographic origin binding. When you authenticate, your security key signs a challenge containing the browser\'s actual URL. Even if an attacker proxies the traffic, the signature contains the attacker\'s domain, which the legitimate server immediately rejects.',
    domain: 'Authentication Concepts'
  },
  {
    id: 'q-4',
    question: 'Which HTTP response header directly prevents attackers from framing your website inside an invisible iframe (Clickjacking defense)?',
    options: [
      'Access-Control-Allow-Origin: *',
      'X-Frame-Options: DENY or Content-Security-Policy: frame-ancestors \'none\'',
      'X-Powered-By: Express',
      'Strict-Transport-Security: max-age=31536000'
    ],
    correctAnswer: 1,
    explanation: 'X-Frame-Options (DENY or SAMEORIGIN) and the modern CSP directive frame-ancestors prevent malicious sites from loading your pages inside hidden iframes to steal clicks or credentials.',
    domain: 'Security Headers'
  },
  {
    id: 'q-5',
    question: 'What is the primary role of input sanitization and context-aware escaping against XSS in authentication portals?',
    options: [
      'Increasing password encryption hashing speed.',
      'Neutralizing executable script characters (e.g., <, >, ", \') so browser parsers treat input strictly as passive text data rather than runnable code.',
      'Blocking network ping requests from known foreign IP ranges.',
      'Encrypting the hard drive if a suspicious login occurs.'
    ],
    correctAnswer: 1,
    explanation: 'Context-aware escaping converts active syntax characters into benign HTML entities (e.g. &lt;script&gt;) so the browser DOM never executes untrusted user input as JavaScript.',
    domain: 'Input Validation'
  }
];
