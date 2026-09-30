export type SeverityLevel = 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';

export interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: 
    | 'AUTH_LOGIN_SUCCESS'
    | 'AUTH_LOGIN_FAILURE'
    | 'AUTH_RATE_LIMIT_TRIGGERED'
    | 'AUTH_ACCOUNT_LOCKED'
    | 'INPUT_VALIDATION_PASSED'
    | 'INPUT_XSS_DETECTED'
    | 'INPUT_SQLI_DETECTED'
    | 'INPUT_OPEN_REDIRECT_BLOCKED'
    | 'URL_HOMOGRAPH_DETECTED'
    | 'URL_TYPOSQUAT_FLAGGED'
    | 'HEADER_SECURITY_CHECK'
    | 'PHISHING_TRIAGE_ACTION'
    | 'SYSTEM_INITIALIZED';
  severity: SeverityLevel;
  sourceIp: string;
  details: string;
  actionTaken: string;
  rawPayload?: string;
}

export interface RedFlag {
  id: string;
  label: string;
  explanation: string;
  location: 'sender' | 'subject' | 'body' | 'link' | 'attachment' | 'headers';
}

export interface PhishingScenario {
  id: string;
  title: string;
  category: 'Spear Phishing' | 'Credential Harvesting' | 'Whaling / Executive' | 'Smishing' | 'Legitimate (Control)';
  senderName: string;
  senderEmail: string;
  replyTo: string;
  returnPath: string;
  subject: string;
  date: string;
  bodyHtml: string;
  simulatedDestinationUrl: string;
  displayUrlText: string;
  hasAttachment: boolean;
  attachmentName?: string;
  attachmentType?: string;
  isLegitimate: boolean;
  psychologicalTrigger: string;
  redFlags: RedFlag[];
  spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
  dkimStatus: 'PASS' | 'FAIL' | 'NONE';
  dmarcStatus: 'PASS' | 'FAIL' | 'NONE';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  remediationAdvice: string;
}

export interface InternshipTask {
  id: string;
  title: string;
  category: 'Authentication' | 'Input Validation' | 'Security Checks' | 'Logging' | 'Awareness';
  description: string;
  targetTab: 'overview' | 'auth' | 'input' | 'scanner' | 'logging' | 'simulation' | 'submission';
  isCompleted: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: string;
}
