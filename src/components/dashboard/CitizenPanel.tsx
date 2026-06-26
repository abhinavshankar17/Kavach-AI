"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, HelpCircle, PhoneCall, Link2, MessageSquare, AlertTriangle, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";
import { useKavach } from "@/context/KavachContext";

interface ThreatIndicator {
  name: string;
  found: boolean;
  desc: string;
}

interface ThreatAnalysis {
  verdict: "DANGER" | "SUSPICIOUS" | "SAFE";
  score: number;
  indicators: ThreatIndicator[];
  summary: string;
  mitigation: string[];
}

export default function CitizenPanel() {
  const { addAlert, systemStress } = useKavach();
  const [activeTab, setActiveTab] = useState<"link" | "call" | "message">("call");
  const [inputText, setInputText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysis | null>(null);

  const presets = {
    call: [
      {
        label: "Suspicious Call: 'Digital Arrest' Claim",
        value: "This is Inspector Vijay Kumar from Delhi Police Cyber Cell. Your Aadhaar card has been found linked to a money laundering syndicate in Mumbai. You are under digital arrest. Do not disconnect this call or you will be prosecuted under the National Security Act.",
        analysis: {
          verdict: "DANGER",
          score: 96,
          summary: "This message replicates coercion patterns typical of 'Digital Arrest' spoof calls. Standard protocols dictate police do not conduct examinations over video calls.",
          indicators: [
            { name: "Synthetic/Clone Voice Clues", found: true, desc: "Acoustic modeling detects synthetic speech / morphing gateway routing." },
            { name: "Linguistic Coercion (Threats)", found: true, desc: "Uses legal terms (arrest, NSA) to create immediate panic." },
            { name: "Unverified VoIP Origin", found: true, desc: "Calls generated via VoIP SIP services spoofing government numbers." },
          ],
          mitigation: [
            "Disconnect the call immediately. Do not stay connected to Skype or video channels.",
            "Do not verify banking passwords, share OTPs, or transfer security escrow fees.",
            "Log caller numbers immediately on Sanchar Saathi (Chakshu portal) and report on cybercrime.gov.in."
          ],
        } as ThreatAnalysis,
      },
      {
        label: "Normal Call: ICICI Login Warning",
        value: "Hello, this is ICICI Customer support. We detected a suspicious login attempt on your account from IP 192.168.1.1. We have blocked temporary access. Please reset your passcode through our official portal or app. We will never ask for your OTP.",
        analysis: {
          verdict: "SAFE",
          score: 8,
          summary: "Legitimate bank security warning. Explicitly commands not to share OTP codes and refers exclusively to official systems.",
          indicators: [
            { name: "Coercion/Urgent Demands", found: false, desc: "No immediate threats or arrest statements detected." },
            { name: "Credential Requesting", found: false, desc: "Does not solicit OTPs or secure codes." },
            { name: "Verified Outbound Origin", found: true, desc: "Source logs align with registered icici automated system routes." },
          ],
          mitigation: [
            "Use the official mobile app to verify your system alert logs.",
            "Do not click links inside SMS; manually input the bank portal URL."
          ],
        } as ThreatAnalysis,
      },
    ],
    link: [
      {
        label: "Suspected Customs Delivery Link",
        value: "http://india-post-tracking-service.com/delhi/release-package?id=92812",
        analysis: {
          verdict: "DANGER",
          score: 91,
          summary: "Phishing target clone. Mimics branding of India Post. Registered 3 days ago under commercial proxy hosting instead of NIC government servers.",
          indicators: [
            { name: "Typo-squatted Domain", found: true, desc: "Uses Post names in domain to deceive consumers." },
            { name: "Non-Government Registrar", found: true, desc: "Domain is hosted commercially, not under gov.in namespaces." },
            { name: "UPI Payment Redirects", found: true, desc: "Embedded interfaces steal credentials and UPI IDs." },
          ],
          mitigation: [
            "Do not enter address details or payment parameters.",
            "Clear your web cache if you navigated to this page.",
            "Submit the suspect URL to national spam directories."
          ],
        } as ThreatAnalysis,
      },
    ],
    message: [
      {
        label: "Electricity Suspension Warning",
        value: "Dear Consumer, your electricity line will be disconnected tonight at 9:30 PM because your previous month bill was unpaid. Please call electricity officer Mr. Sharma immediately at +91 9999888822 to clear dues.",
        analysis: {
          verdict: "SUSPICIOUS",
          score: 74,
          summary: "Common utilities scam strategy. Uses urgent utility disconnection deadlines to prompt fast victim callbacks to spoofed helpline numbers.",
          indicators: [
            { name: "Urgent Deadlines", found: true, desc: "Uses short time limits (tonight at 9:30) to create panic." },
            { name: "Personal Number Contacts", found: true, desc: "Asks to dial standard mobile lines instead of corporate portal help desks." },
            { name: "Missing Customer IDs", found: false, desc: "Generic greeting lacking specific consumer reference numbers." },
          ],
          mitigation: [
            "Verify billing balances directly on your official power board utility account.",
            "Do not dial the mobile phone lines embedded in utility alerts.",
            "Forward SMS details to Sanchar Saathi spam registry."
          ],
        } as ThreatAnalysis,
      },
    ],
  };

  const handleSelectPreset = (value: string) => {
    setInputText(value);
    setAnalysisResult(null);
  };

  const analyzeThreat = () => {
    if (!inputText.trim()) return;
    setScanning(true);
    setAnalysisResult(null);

    const delay = systemStress ? 3500 : 1500;
    setTimeout(() => {
      let matchedAnalysis: ThreatAnalysis | null = null;
      Object.values(presets).forEach((tabPresets) => {
        const match = tabPresets.find((p) => p.value === inputText);
        if (match) matchedAnalysis = match.analysis;
      });

      if (!matchedAnalysis) {
        matchedAnalysis = {
          verdict: "SUSPICIOUS",
          score: 65,
          summary: "Analyzed custom entry. Detected suspicious patterns relating to urgency alerts or unverified web links.",
          indicators: [
            { name: "Unverified Metadata Origin", found: true, desc: "The source registry cannot be resolved or is not Whitelisted." },
            { name: "NLP Sentiment Flag", found: true, desc: "Sentiment analysis indicates moderate coercion/urgency content." },
          ],
          mitigation: [
            "Cross-verify claims through officially published corporate directories.",
            "Do not disclose confidential parameters or open tracking links."
          ]
        };
      }

      setAnalysisResult(matchedAnalysis);
      setScanning(false);

      if (matchedAnalysis) {
        const severity = matchedAnalysis.verdict === "SAFE" ? "SUCCESS" : "ALERT";
        addAlert(
          `Citizen filter flagged ${activeTab} assessment as ${matchedAnalysis.verdict} (${matchedAnalysis.score}% Risk)`,
          severity,
          {
            type: `Citizen ${activeTab.toUpperCase()} Check`,
            score: `${matchedAnalysis.score}% Risk`,
            status: matchedAnalysis.verdict === "SAFE" ? "VERIFIED" : "BLOCKED"
          }
        );
      }
    }, delay);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Search Input and Presets */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card variant="violet" className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-2">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5.5 h-5.5 text-violet-400" />
              <span className="font-bold text-base text-zinc-100">Citizen Fraud Scanner</span>
            </div>
            <Link href="/citizen" className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-bold flex items-center gap-1 hover:underline cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" /> Launch Portal
            </Link>
          </div>

          {/* Icon Tabs */}
          <div className="grid grid-cols-3 gap-3 border-b border-zinc-800 pb-4">
            {(["call", "link", "message"] as const).map((tab) => {
              const tabIcons = { call: PhoneCall, link: Link2, message: MessageSquare };
              const Icon = tabIcons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setInputText("");
                    setAnalysisResult(null);
                  }}
                  className={`py-3 rounded-lg flex flex-col items-center gap-2 text-sm font-semibold cursor-pointer transition-all duration-300 ${
                    activeTab === tab
                      ? "text-violet-400 bg-zinc-950 border border-zinc-800"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              Verification Input
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === "call"
                  ? "Describe call details or paste transcripts..."
                  : activeTab === "link"
                  ? "Paste suspected phishing link or URL..."
                  : "Paste scam text message details..."
              }
              rows={5}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-300"
            />
          </div>

          {/* Presets */}
          <div className="flex flex-col gap-3.5 mt-2">
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Sample Presets</label>
            {presets[activeTab].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p.value)}
                className="text-left text-sm p-3.5 border border-zinc-800/80 bg-zinc-950/30 rounded-lg hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-300 truncate cursor-pointer font-sans"
              >
                Sample #{idx + 1}: {p.label.split(":")[1]?.trim() || p.label}
              </button>
            ))}
          </div>

          <button
            onClick={analyzeThreat}
            disabled={!inputText.trim() || scanning}
            className={`w-full py-4 rounded-lg font-sans text-sm font-bold transition-all duration-300 mt-4 cursor-pointer ${
              !inputText.trim() || scanning
                ? "bg-zinc-950 text-zinc-650 border border-zinc-900 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_4px_15px_rgba(139,92,246,0.25)]"
            }`}
          >
            {scanning ? "Analyzing Specimen..." : "Evaluate Risk"}
          </button>
        </Card>
      </div>

      {/* Analysis Result Output */}
      <div className="lg:col-span-7 flex flex-col gap-6 font-sans">
        <Card variant="violet" className="flex-1 flex flex-col justify-between min-h-[450px] relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5.5 h-5.5 text-violet-400" />
              <span className="font-bold text-base text-zinc-200">
                Risk Engine Diagnostics
              </span>
            </div>
            <span className="text-xs text-zinc-500 font-bold">Model: NLP-Threat-v2.0</span>
          </div>

          {/* Loader or Content */}
          <div className="flex-1 flex flex-col justify-center my-6">
            <AnimatePresence mode="wait">
              {scanning ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-16"
                >
                  <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-violet-500 animate-spin" />
                  <div className="text-sm text-violet-400 uppercase font-bold tracking-wider animate-pulse">
                    Calculating threat parameters...
                  </div>
                </motion.div>
              ) : analysisResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6"
                >
                  {/* Danger Score */}
                  <div className="flex items-center gap-5 p-5 rounded-xl border border-zinc-800 bg-zinc-950/40">
                    <div className="relative">
                      {/* Radial score circle */}
                      <svg className="w-16 h-16">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#27272a" strokeWidth="4" />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke={
                            analysisResult.verdict === "DANGER"
                              ? "#ef4444"
                              : analysisResult.verdict === "SUSPICIOUS"
                              ? "#f59e0b"
                              : "#10b981"
                          }
                          strokeWidth="4"
                          strokeDasharray="175"
                          strokeDashoffset={175 - (175 * analysisResult.score) / 100}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-zinc-200">
                        {analysisResult.score}%
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-extrabold px-3.5 py-1.5 rounded border ${
                            analysisResult.verdict === "DANGER"
                              ? "text-red-400 bg-red-950/40 border-red-900/30"
                              : analysisResult.verdict === "SUSPICIOUS"
                              ? "text-amber-400 bg-amber-950/40 border-amber-900/30"
                              : "text-emerald-400 bg-emerald-950/40 border-emerald-900/30"
                          }`}
                        >
                          VERDICT: {analysisResult.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-550 font-bold uppercase tracking-wider mt-2.5 font-sans">
                        Threat Probability Index
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h5 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3.5 font-sans">Analysis Summary</h5>
                    <p className="text-base text-zinc-200 bg-zinc-950/45 p-4 rounded-lg border border-zinc-800 leading-relaxed font-sans font-medium">
                      {analysisResult.summary}
                    </p>
                  </div>

                  {/* Indicators Checkbox */}
                  <div>
                    <h5 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3.5 font-sans">Risk Factors Identified</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.indicators.map((ind, idx) => (
                        <div key={idx} className="flex gap-3.5 p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 items-start font-sans">
                          {ind.found ? (
                            <AlertTriangle className="w-5.5 h-5.5 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <ShieldCheck className="w-5.5 h-5.5 text-emerald-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="text-base font-bold text-zinc-200">{ind.name}</span>
                            <p className="text-sm text-zinc-450 leading-relaxed mt-1">{ind.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mitigation Recommendations */}
                  <div className="border-t border-zinc-800 pt-5">
                    <h5 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 font-sans">Mitigation Actions</h5>
                    <ul className="list-disc pl-6 flex flex-col gap-3">
                      {analysisResult.mitigation.map((mit, idx) => (
                        <li key={idx} className="text-base text-zinc-300 leading-relaxed font-sans font-medium">
                          {mit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="text-center py-16 p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10 max-w-[420px] mx-auto font-sans"
                >
                  <HelpCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-base text-zinc-455 font-bold">Diagnostic Standby</p>
                  <p className="text-sm text-zinc-550 mt-3 leading-relaxed">
                    Select a preset scenario or paste customized details, then click risk evaluation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}
