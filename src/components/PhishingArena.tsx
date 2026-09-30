import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { PHISHING_SCENARIOS, QUIZ_QUESTIONS } from '../data/phishingScenarios';
import { PhishingScenario } from '../types/security';
import { 
  MailWarning, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Eye, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Inbox,
  Paperclip,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const PhishingArena: React.FC = () => {
  const { addLog, completeTask, quizScore, setQuizScore, quizTotal } = useSecurity();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(PHISHING_SCENARIOS[0].id);
  const [revealedFlags, setRevealedFlags] = useState<Record<string, boolean>>({});
  const [triageResults, setTriageResults] = useState<Record<string, { action: string; isCorrect: boolean }>>({});
  const [activeSubTab, setActiveSubTab] = useState<'triage' | 'quiz'>('triage');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentScenario = PHISHING_SCENARIOS.find((s) => s.id === selectedScenarioId) || PHISHING_SCENARIOS[0];

  const handleRevealFlag = (flagId: string) => {
    setRevealedFlags((prev) => ({ ...prev, [flagId]: true }));
  };

  const handleTriageAction = (action: 'report_phish' | 'quarantine' | 'mark_legit') => {
    completeTask('task-5');

    let isCorrect = false;
    let details = '';

    if (action === 'report_phish') {
      isCorrect = !currentScenario.isLegitimate;
      details = isCorrect
        ? `Correctly identified and reported phishing campaign: "${currentScenario.title}".`
        : `False positive: Legitimate operational email marked as phishing.`;
    } else if (action === 'quarantine') {
      isCorrect = !currentScenario.isLegitimate;
      details = `Email quarantined for dynamic sandbox analysis: "${currentScenario.title}".`;
    } else {
      isCorrect = currentScenario.isLegitimate;
      details = isCorrect
        ? `Correctly validated legitimate corporate announcement.`
        : `Critical security failure: Phishing email marked legitimate and delivered to user.`;
    }

    setTriageResults((prev) => ({
      ...prev,
      [currentScenario.id]: { action, isCorrect }
    }));

    addLog({
      eventType: 'PHISHING_TRIAGE_ACTION',
      severity: isCorrect ? 'NOTICE' : 'CRITICAL',
      sourceIp: '10.0.8.99',
      details,
      actionTaken: action.toUpperCase()
    });
  };

  const handleAnswerQuiz = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    completeTask('task-5');

    addLog({
      eventType: 'AUTH_LOGIN_SUCCESS',
      severity: 'INFO',
      sourceIp: '127.0.0.1',
      details: `Internship Phishing Awareness Quiz completed. Score: ${score}/${quizTotal}.`,
      actionTaken: 'QUIZ_EVALUATION_LOGGED'
    });
  };

  const currentTriage = triageResults[currentScenario.id];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Module 05</span>
          <span aria-hidden="true">·</span>
          <span>Phishing Awareness</span>
          <span aria-hidden="true">·</span>
          <span>Simulation & Assessment</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Phishing Awareness Simulation & SOC Triage Arena
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Apply cybersecurity concepts to triage real-world email threats. Spot social engineering pretexts, inspect cryptographic SPF/DKIM headers, dissect deceptive URLs, and complete the final awareness competency exam.
        </p>
      </div>

      {/* Arena Navigation */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('triage')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'triage'
              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Interactive Email Triage Sandbox
        </button>
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'quiz'
              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Cybersecurity Awareness Assessment ({quizSubmitted ? `${quizScore}/${quizTotal}` : '5 Questions'})
        </button>
      </div>

      {activeSubTab === 'triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Email Mailbox List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
              <span className="flex items-center gap-1.5">
                <Inbox className="h-4 w-4 text-cyan-400" />
                <span>Inbox Triage Queue</span>
              </span>
              <span className="font-mono text-[11px]">{PHISHING_SCENARIOS.length} Scenarios</span>
            </div>

            <div className="space-y-2">
              {PHISHING_SCENARIOS.map((sc) => {
                const triage = triageResults[sc.id];
                const isSelected = selectedScenarioId === sc.id;

                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`w-full text-left rounded-xl border p-3.5 transition ${
                      isSelected
                        ? 'border-amber-500/60 bg-amber-950/20 ring-1 ring-amber-500/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-400">{sc.category}</span>
                      {triage && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            triage.isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {triage.isCorrect ? 'RESOLVED' : 'MISSED'}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-white mt-1 line-clamp-1">{sc.subject}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                      <span className="truncate">{sc.senderName}</span>
                      <span className="text-slate-500 font-mono shrink-0 ml-2">{sc.date.split(' at ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Psychological Triggers educational guide */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs text-slate-400">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Info className="h-4 w-4 text-cyan-400" />
                <span>The 4 Social Engineering Levers:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                <li><strong className="text-slate-300">Urgency:</strong> Artificial deadlines ("act in 2h") to stop logical deliberation.</li>
                <li><strong className="text-slate-300">Authority:</strong> Impersonating CFOs, HR leaders, or IT service desk.</li>
                <li><strong className="text-slate-300">Greed / Curiosity:</strong> Unsolicited bonus matrices, executive payroll leaks.</li>
                <li><strong className="text-slate-300">Fear:</strong> Threatening account termination or legal ramifications.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Active Email Inspector */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
              {/* Email Envelope Header */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-xs text-slate-500 font-mono">Subject:</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{currentScenario.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">Date:</span>
                    <span className="text-xs text-slate-300 font-mono">{currentScenario.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">From (Display & Address):</span>
                    <div className="text-slate-200 font-medium">
                      {currentScenario.senderName}{' '}
                      <span className="font-mono text-cyan-400 text-[11px]">&lt;{currentScenario.senderEmail}&gt;</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Reply-To Address:</span>
                    <div className="font-mono text-slate-300 text-[11px]">
                      {currentScenario.replyTo}
                    </div>
                  </div>
                </div>

                {/* Email Authentication Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">SPF:</span>
                    <span className={currentScenario.spfStatus === 'PASS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {currentScenario.spfStatus}
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">DKIM:</span>
                    <span className={currentScenario.dkimStatus === 'PASS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {currentScenario.dkimStatus}
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">DMARC:</span>
                    <span className={currentScenario.dmarcStatus === 'PASS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {currentScenario.dmarcStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-200 leading-relaxed font-sans">
                <div dangerouslySetInnerHTML={{ __html: currentScenario.bodyHtml }} />

                {/* Interactive Simulated Destination Preview */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 rounded-lg bg-slate-900/60 p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-slate-300">Link Destination Inspector:</span>
                    <span className="text-[11px] font-mono text-cyan-400">Status Bar Simulation</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    Visible Text: <span className="text-slate-200">{currentScenario.displayUrlText}</span>
                  </div>
                  <div className="font-mono text-[11px] text-rose-300 break-all">
                    Actual Browser Destination: <span className="font-bold underline">{currentScenario.simulatedDestinationUrl}</span>
                  </div>
                </div>
              </div>

              {/* Red Flags Investigator */}
              {currentScenario.redFlags.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span>Security Analyst Red Flags ({currentScenario.redFlags.length} Identified):</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentScenario.redFlags.map((flag) => {
                      const isRevealed = revealedFlags[flag.id];
                      return (
                        <div
                          key={flag.id}
                          className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-400">{flag.label}</span>
                            {!isRevealed ? (
                              <button
                                onClick={() => handleRevealFlag(flag.id)}
                                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Uncover</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-mono font-semibold">REVEALED</span>
                            )}
                          </div>
                          {isRevealed ? (
                            <p className="text-[11px] text-slate-300 leading-relaxed">{flag.explanation}</p>
                          ) : (
                            <p className="text-[11px] text-slate-600 italic">Click "Uncover" to examine the forensic breakdown.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Triage Decision Buttons */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="text-xs font-semibold text-white">Security Analyst Action Verdict:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleTriageAction('report_phish')}
                    className="flex items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-500 py-2.5 px-3 text-xs font-semibold text-white transition shadow-sm"
                  >
                    <MailWarning className="h-4 w-4" />
                    <span>Report as Phishing</span>
                  </button>

                  <button
                    onClick={() => handleTriageAction('quarantine')}
                    className="flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 py-2.5 px-3 text-xs font-semibold text-white transition shadow-sm"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Quarantine for Sandbox</span>
                  </button>

                  <button
                    onClick={() => handleTriageAction('mark_legit')}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 px-3 text-xs font-semibold text-white transition shadow-sm"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Mark as Legitimate</span>
                  </button>
                </div>
              </div>

              {/* Triage Outcome Feedback Box */}
              {currentTriage && (
                <div
                  className={`rounded-xl border p-4 space-y-2 text-xs leading-relaxed ${
                    currentTriage.isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                      : 'border-rose-500/40 bg-rose-950/20 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {currentTriage.isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-rose-400" />}
                    <span>{currentTriage.isCorrect ? 'Accurate Triage Decision!' : 'Incorrect Triage Action'}</span>
                  </div>
                  <p>{currentScenario.remediationAdvice}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Section */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6 max-w-4xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-400" />
                  <span>Cybersecurity Awareness Final Assessment</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify your comprehension of phishing vectors, defensive protocols, and input validation techniques.
                </p>
              </div>
              {quizSubmitted && (
                <div className="font-mono text-xs font-bold text-cyan-400">
                  Score: {quizScore} / {quizTotal} ({Math.round((quizScore / quizTotal) * 100)}%)
                </div>
              )}
            </div>

            <div className="space-y-6">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const isSelected = selectedAnswers[q.id];
                const isCorrect = isSelected === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-400 font-semibold">Question 0{qIndex + 1}</span>
                      <span className="text-slate-500 font-mono">{q.domain}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-relaxed">{q.question}</h4>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900';
                        if (quizSubmitted) {
                          if (optIndex === q.correctAnswer) {
                            btnStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300 font-semibold';
                          } else if (isSelected === optIndex) {
                            btnStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-300 line-through';
                          }
                        } else if (isSelected === optIndex) {
                          btnStyle = 'border-cyan-500/60 bg-cyan-950/30 text-cyan-200 font-semibold';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={quizSubmitted}
                            onClick={() => handleAnswerQuiz(q.id, optIndex)}
                            className={`w-full text-left rounded-lg border p-3 text-xs leading-relaxed transition ${btnStyle}`}
                          >
                            <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/80 leading-relaxed">
                        <strong className="text-slate-200">Analysis:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                onClick={handleSubmitQuiz}
                className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-cyan-600 py-3 text-xs font-bold text-white hover:from-amber-500 hover:to-cyan-500 disabled:opacity-50 transition shadow-sm"
              >
                Submit Assessment & Record Grade
              </button>
            ) : (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-xs text-emerald-200 flex items-center justify-between">
                <div>
                  <strong>Assessment Recorded:</strong> You achieved {quizScore} out of {quizTotal} correct answers. This score is automatically integrated into your Virtual Internship Project Submission.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
