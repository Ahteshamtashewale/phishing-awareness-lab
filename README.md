# PhishDefend: Cybersecurity Awareness & Defense Engineering Lab
> **Virtual Cybersecurity Internship Capstone Project**  
> An interactive educational cybersecurity laboratory demonstrating authentication concepts, input validation & sanitization, protocol/URL security checks, SIEM event logging, and human risk mitigation.

---

## 📌 Project Overview

This repository contains the complete implementation of the **Phishing Awareness & Cyber Defense Platform**, developed as a practical virtual internship capstone project. Modern cyber attacks routinely bypass conventional perimeter firewalls through social engineering, adversary-in-the-middle (AitM) reverse proxies, and weaponized input vectors. 

This platform bridges theoretical cybersecurity concepts with empirical, interactive defenses across five key pillars:

1. **Authentication Security & Phishing-Resistant MFA**
2. **Input Validation & Attack Vector Neutralization**
3. **Security Checks: IDN Homographs, HTTP Headers & SPF/DKIM**
4. **SIEM Incident Logging & Audit Telemetry**
5. **Interactive Phishing Triage Simulation & Awareness Assessment**

---

## 🛠️ Key Architectural Features

### 1. Authentication Concepts Lab
- **Cryptographic Password Hashing**: Interactive demonstration of one-way salted hashing (`bcrypt` / `Argon2id`), cost factor scaling ($2^{10}$–$2^{14}$), and NIST SP 800-63B password entropy calculation.
- **Credential Stuffing Mitigation**: Simulates automated adversary botnets attempting compromised password dumps, triggering exponential rate limiting and account lockouts upon 4 failed attempts.
- **MFA Comparison & AitM Resistance**: Visualizes time-based one-time password (TOTP RFC 6238) countdowns and explains how **FIDO2 / WebAuthn** hardware tokens use cryptographic domain origin binding to neutralize reverse-proxy phishing kits (e.g. Evilginx).

### 2. Input Validation & Attack Vector Sanitizer
- **Reflected XSS Defense**: Analyzes script injection and cookie stealer payloads, applying context-aware HTML entity encoding (`&lt;`, `&gt;`, `&quot;`, `&#039;`).
- **SQL Injection Defense**: Demonstrates authentication bypass payloads (`admin' OR '1'='1' --`) and provides parameterized query binding patterns.
- **Open Redirection Defense**: Detects and neutralizes deceptive URL parameters (`?redirect=...`) using strict origin whitelisting.

### 3. Security Checks & Protocol Scanner
- **IDN Homograph & Punycode Engine**: Flags non-ASCII unicode characters from Cyrillic/Greek alphabets masquerading as Latin characters (e.g. Cyrillic `а` in `pаypal.com` resolving to `xn--pypal-4ve.com`).
- **Typosquatting Detection**: Scans for digit substitutions (`0` for `o`, `1` for `l`) and brand cloaking within subdomains.
- **HTTP Defense Headers**: Verifies `Content-Security-Policy` (CSP), `X-Frame-Options` (Clickjacking prevention), and `Strict-Transport-Security` (HSTS).
- **Email Protocol Verification**: Explains the DNS-based email security triad: **SPF**, **DKIM**, and **DMARC** policy enforcement (`p=reject`).

### 4. SIEM Security Incident Logging
- Real-time event ingestion for authentication failures, blocked payloads, and domain sinkholes.
- Multi-format view: **Structured Data Table**, **Common Event Format (CEF)**, and raw **JSON**.
- Dynamic filtering by severity (`CRITICAL`, `WARNING`, `NOTICE`, `INFO`), full-text search, and JSON export.

### 5. Phishing Awareness & Triage Arena
- Realistic email client interface with 4 authentic scenarios (MFA expiry threat, executive compensation macro document, CFO wire transfer fraud, and legitimate maintenance control).
- Real-destination URL preview simulating browser status bar inspection.
- Red flag discovery covering psychological triggers: *Urgency*, *Authority*, *Greed*, and *Fear*.
- 5-question scored awareness assessment quiz.

### 6. Project Submission & Technical Dossier
- Generates an official printable and downloadable **Technical Capstone Dossier** containing candidate details, methodology narrative, test execution matrix, and verification signatures.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/phishdefend-lab.git
cd phishdefend-lab

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
# Compile and package for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure

```
├── src/
│   ├── components/
│   │   ├── TopBar.tsx               # Header adhering to design contract
│   │   ├── Overview.tsx             # Kill chain diagram & task tracker
│   │   ├── AuthLab.tsx              # Hashing, rate limiting & WebAuthn
│   │   ├── InputValidationLab.tsx   # XSS, SQLi & open redirect sanitizer
│   │   ├── SecurityScannerLab.tsx   # Homographs, headers & SPF/DKIM
│   │   ├── LoggingConsole.tsx       # SIEM audit stream & CEF viewer
│   │   ├── PhishingArena.tsx        # Email triage & awareness quiz
│   │   └── ProjectSubmissionModal.tsx # Exportable internship capstone dossier
│   ├── context/
│   │   └── SecurityContext.tsx      # Global security event telemetry state
│   ├── data/
│   │   └── phishingScenarios.ts     # Realistic threat pretexts & quiz data
│   ├── types/
│   │   └── security.ts              # TypeScript interfaces for security models
│   ├── App.tsx                      # Root application layout
│   ├── index.css                    # Tailwind CSS v4 styling
│   └── main.tsx                     # React 19 entry point
├── index.html                       # HTML5 template with SEO & web fonts
├── package.json                     # Project scripts and dependencies
├── metadata.json                    # Application metadata specification
├── tsconfig.json                    # Strict TypeScript configuration
└── vite.config.ts                   # Vite build tool configuration
```

---

## 🛡️ License & Academic Notice

This project was developed for educational and cybersecurity training purposes under the **Apache-2.0 License**. All email samples, attack vectors, and scenarios are safe simulations intended for defensive awareness instruction.
