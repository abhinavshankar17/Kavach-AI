"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Filter, Search, Calendar, User, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import { Card } from "../ui/Card";

interface Report {
  id: string;
  title: string;
  date: string;
  category: "VoIP Scam" | "Phishing" | "Counterfeit" | "Mule Account";
  risk: "CRITICAL" | "HIGH" | "MEDIUM";
  analyst: string;
  summary: string;
  timeline: { time: string; event: string }[];
  telemetry: Record<string, string>;
}

export default function ReportsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<string>("ALL");
  const [selectedReportId, setSelectedReportId] = useState<string>("REP-001");
  const [exporting, setExporting] = useState<"pdf" | "csv" | null>(null);

  const mockReports: Report[] = [
    {
      id: "REP-001",
      title: "Mewat VoIP Ring Monthly Analysis",
      date: "2026-06-24",
      category: "VoIP Scam",
      risk: "CRITICAL",
      analyst: "Officer Vikram IFSO",
      summary: "In-depth investigation of VoIP SIP gateway nodes routing spoofed Delhi Police calls. Telemetry links pre-activated SIM retail centers in Guwahati with virtual routers in Mewat, coordinating synthetic voice arrest schemes.",
      timeline: [
        { time: "Jun 24, 08:12", event: "Citizen scanner flags VoIP caller gateway #092" },
        { time: "Jun 24, 09:30", event: "Network graph relates VoIP metadata to SBI mule account **2919" },
        { time: "Jun 24, 11:00", event: "Liaison alert dispatched to Nuh Cyber Cell" },
        { time: "Jun 24, 12:35", event: "SIP trunk gateway deactivated; ₹12.4L escrow intercepted" }
      ],
      telemetry: {
        "Target Trunks": "14 SIP Trunks",
        "Associated Accounts": "8 Active Mule A/Cs",
        "Total Prevented": "₹42.8 Lakhs",
        "Coop Station": "Nuh Cyber Cell Liaison"
      }
    },
    {
      id: "REP-002",
      title: "Kolkata Call Center Raid Findings",
      date: "2026-06-20",
      category: "VoIP Scam",
      risk: "HIGH",
      analyst: "S. Dutta (Kolkata Cyber Wing)",
      summary: "Operation details regarding a spoofed courier customs facility impersonation ring operating out of Bidhannagar. The network leveraged mock India Post links to extract address logs and UPI security PINs.",
      timeline: [
        { time: "Jun 20, 14:15", event: "Incident reports of customs scam spike by 30% in West Bengal" },
        { time: "Jun 20, 16:00", event: "SMS Phishing API gateway traced to commercial server clone" },
        { time: "Jun 20, 18:30", event: "Tactical deployment coordinate map finalized for Cyber Cell" },
        { time: "Jun 20, 20:00", event: "Raid executed: 12 systems and 28 SIM cards seized" }
      ],
      telemetry: {
        "Seized Hardware": "12 PCs, 28 SIMs",
        "SMS Gateway": "Twilio Proxy API Hook",
        "Total Escaped": "₹18.2 Lakhs",
        "Mitigation Status": "Ring Decommissioned"
      }
    },
    {
      id: "REP-003",
      title: "Counterfeit ₹500 Signature Verification Log",
      date: "2026-06-18",
      category: "Counterfeit",
      risk: "MEDIUM",
      analyst: "P. Nair (Currency Division)",
      summary: "Spectrograph verification data mapping low-grade offset counterfeit banknotes flagged at retail checkout scanners. Identified repeating serial sequence prefix 3CD572, lacking color-shift thread parameters.",
      timeline: [
        { time: "Jun 18, 09:10", event: "Retail checkout registers alert on sequence #3CD572911" },
        { time: "Jun 18, 10:45", event: "Spectroscopic scan confirms flat printing core (non-intaglio)" },
        { time: "Jun 18, 13:00", event: "Serial sequence prefix blacklisted across network validators" }
      ],
      telemetry: {
        "Blacklisted Prefix": "3CD572",
        "Visual Discrepancy": "0.05mm alignment offset",
        "Ink Index": "Non-shifting metallic dust",
        "Action Taken": "Retail Gateway Alert Broadcast"
      }
    },
    {
      id: "REP-004",
      title: "Organized Phishing Campaigns Audit",
      date: "2026-06-14",
      category: "Phishing",
      risk: "CRITICAL",
      analyst: "Officer Vikram IFSO",
      summary: "Comprehensive audit of typo-squatted domains replicating government utility portals. The campaign targeted PAN card details and electricity bill payments using Mr. Sharma help desks spoof registrations.",
      timeline: [
        { time: "Jun 14, 07:00", event: "Domain scraper flags 'india-post-tracking-service.com'" },
        { time: "Jun 14, 09:30", event: "Citizen panel records 42 suspicious SMS link reports" },
        { time: "Jun 14, 11:20", event: "Domain registrar contact initiated for emergency takedown" },
        { time: "Jun 14, 15:45", event: "DNS sinkhole activated for campaign redirection" }
      ],
      telemetry: {
        "Target Domain": "india-post-tracking-service.com",
        "Registrar Origin": "Commercial Proxy Host",
        "Users Affected": "890 telemetries",
        "Current State": "Takedown Complete"
      }
    }
  ];

  const handleExport = (type: "pdf" | "csv") => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      alert(`Export Successful: Kavach_${selectedReportId}_Intel.${type.toUpperCase()} generated.`);
    }, 1500);
  };

  const selectedReport = mockReports.find((r) => r.id === selectedReportId) || mockReports[0];

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === "ALL" || report.risk === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Reports Directory */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card variant="zinc" className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-805 pb-4 mb-2">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5.5 h-5.5 text-violet-400" />
              <span className="font-bold text-base text-zinc-100 font-sans">Intelligence Directory</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-550 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search reports or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-11 pr-4 py-3.5 text-sm text-zinc-300 focus:border-violet-500 focus:outline-none transition-colors duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Risk Level Filter
            </label>
            <div className="flex gap-2">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSelectedRisk(risk)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    selectedRisk === risk
                      ? "border-violet-500/50 bg-violet-955/20 text-violet-400 font-extrabold"
                      : "border-zinc-800 bg-zinc-900/10 text-zinc-500 hover:border-zinc-700 hover:text-zinc-350"
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Reports List */}
          <div className="flex flex-col gap-3.5 mt-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`p-4 rounded-xl border text-left font-sans transition-all duration-300 flex justify-between items-center cursor-pointer ${
                    selectedReportId === report.id
                      ? "border-violet-500/50 bg-violet-955/15 text-violet-400 font-bold shadow-sm"
                      : "border-zinc-800 hover:border-zinc-750 bg-zinc-900/10 text-zinc-400"
                  }`}
                >
                  <div className="truncate max-w-[240px]">
                    <div className="text-sm text-zinc-500 font-mono font-bold leading-none mb-1.5">{report.id} // {report.category}</div>
                    <span className="text-base font-bold text-zinc-150 leading-tight block truncate">{report.title}</span>
                    <p className="text-xs text-zinc-500 mt-1.5 font-sans leading-none">{report.date}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded border shrink-0 ${
                      report.risk === "CRITICAL"
                        ? "text-red-400 bg-red-950/40 border-red-900/30"
                        : report.risk === "HIGH"
                        ? "text-amber-400 bg-amber-955/40 border-amber-900/30"
                        : "text-purple-400 bg-purple-955/40 border-purple-900/30"
                    }`}
                  >
                    {report.risk}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-zinc-650 font-bold border border-zinc-800 border-dashed rounded-xl">
                No matching intelligence reports.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Selected Report Inspector */}
      <div className="lg:col-span-7 flex flex-col gap-6 font-sans">
        <Card variant="violet" className="flex-1 flex flex-col justify-between min-h-[480px]">
          <div>
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-zinc-805 pb-4 mb-5">
              <div>
                <span className="text-xs text-zinc-550 font-mono font-bold uppercase">{selectedReport.id} // REPORT BRIEF</span>
                <h3 className="text-xl font-extrabold text-zinc-100 tracking-tight mt-1.5">
                  {selectedReport.title}
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded border ${
                  selectedReport.risk === "CRITICAL"
                    ? "text-red-400 bg-red-950/40 border-red-900/30"
                    : selectedReport.risk === "HIGH"
                    ? "text-amber-400 bg-amber-955/40 border-amber-900/30"
                    : "text-purple-400 bg-purple-955/40 border-purple-900/30"
                }`}
              >
                {selectedReport.risk}
              </span>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-4 text-sm text-zinc-500 font-bold mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-violet-400" />
                <span>Date: {selectedReport.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-violet-400" />
                <span>Analyst: {selectedReport.analyst}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h5 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2.5 font-sans">Intelligence Summary</h5>
              <p className="text-sm text-zinc-300 bg-zinc-950/45 p-4 rounded-xl border border-zinc-800 leading-relaxed font-sans font-medium">
                {selectedReport.summary}
              </p>
            </div>

            {/* Telemetry data grid */}
            <div className="mb-6">
              <h5 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3.5 font-sans">Audit Telemetry Facts</h5>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedReport.telemetry).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-zinc-950/40 border border-zinc-800 font-sans">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">{key}</span>
                    <span className="text-sm font-bold text-zinc-300">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6 border-t border-zinc-800/80 pt-5">
              <h5 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 font-sans">Incident Timeline Logs</h5>
              <div className="flex flex-col gap-4 font-sans pl-2 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                {selectedReport.timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative z-10">
                    <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-violet-500 mt-1 shrink-0" />
                    <div>
                      <span className="text-xs text-zinc-500 font-mono font-bold block">{step.time}</span>
                      <p className="text-sm text-zinc-300 font-semibold mt-1">{step.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export actions */}
          <div className="border-t border-zinc-800 pt-5 mt-6 flex justify-end gap-3.5">
            <button
              onClick={() => handleExport("csv")}
              disabled={exporting !== null}
              className="px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-350 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting === "csv" ? "Exporting CSV..." : "Export CSV"}
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="px-4 py-2.5 rounded-lg bg-violet-650 hover:bg-violet-550 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_4px_10px_rgba(139,92,246,0.2)] disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {exporting === "pdf" ? "Generating PDF..." : "Export PDF Report"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
