"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShieldAlert, ShieldCheck, RefreshCw, UploadCloud, CheckCircle, XCircle } from "lucide-react";
import { Card } from "../ui/Card";

interface DiagnosticItem {
  feature: string;
  genuine: string;
  detected: string;
  status: "pass" | "fail";
}

export default function VisionPanel() {
  const [selectedNote, setSelectedNote] = useState<"genuine" | "counterfeit" | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"genuine" | "counterfeit" | null>(null);
  const [progress, setProgress] = useState(0);

  const notes = {
    genuine: {
      serial: "8AB 948194",
      verdict: "VERIFIED GENUINE",
      details: "Spectrographic matching indicates 99.8% structural compliance with Reserve Bank of India paper security standards. Micro-printing registers, watermarks, and raised intaglio borders are correct.",
      diagnostics: [
        { feature: "Security Thread", genuine: "Color-shifting thread (Green to Blue) with micro-text", detected: "Color-shift verified. Micro-text matched.", status: "pass" },
        { feature: "Watermark", genuine: "Mahatma Gandhi portrait with multi-directional gradient shading", detected: "Portrait shading index within bounds.", status: "pass" },
        { feature: "Bleed Lines", genuine: "5 raised tactile bleed lines on right/left margins", detected: "Raised tactile ink density matched.", status: "pass" },
        { feature: "See-through Register", genuine: "Perfect back-to-front alignment of '500' numeral vector", detected: "Alignment error delta within 0.05mm limit.", status: "pass" },
      ] as DiagnosticItem[],
    },
    counterfeit: {
      serial: "3CD 572911",
      verdict: "COUNTERFEIT THREAT DETECTED",
      details: "WARNING: Surface scan detects low-grade commercial paper core. Absent refractive index shift on security thread, flat ink print, and offset watermark registers.",
      diagnostics: [
        { feature: "Security Thread", genuine: "Color-shifting thread (Green to Blue) with micro-text", detected: "Static foil stamp detected. Zero refractive change.", status: "fail" },
        { feature: "Watermark", genuine: "Mahatma Gandhi portrait with multi-directional gradient shading", detected: "Coarse surface-printed grey image silhouette.", status: "fail" },
        { feature: "Bleed Lines", genuine: "5 raised tactile bleed lines on right/left margins", detected: "Flat offset print, zero vertical ink structure.", status: "fail" },
        { feature: "See-through Register", genuine: "Perfect back-to-front alignment of '500' numeral vector", detected: "1.4mm alignment displacement verified.", status: "fail" },
      ] as DiagnosticItem[],
    },
  };

  const handleSelectNote = (type: "genuine" | "counterfeit") => {
    setSelectedNote(type);
    setScanResult(null);
    setProgress(0);
  };

  const startScan = () => {
    if (!selectedNote) return;
    setScanning(true);
    setScanResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanning(false);
            setScanResult(selectedNote);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Selection Control Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card className="flex flex-col gap-5" variant="violet">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-2">
            <div className="flex items-center gap-2.5">
              <Eye className="w-5.5 h-5.5 text-violet-400" />
              <span className="font-bold text-base tracking-tight text-zinc-100">Vision Analysis Module</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Verify banknote authenticity using multi-spectral scans analyzing tactile registers, optical threads, and watermark coordinates.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            <label className="text-xs text-zinc-550 font-bold uppercase tracking-wider">Select Sample Specimen</label>
            <button
              onClick={() => handleSelectNote("genuine")}
              disabled={scanning}
              className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex justify-between items-center ${
                selectedNote === "genuine"
                  ? "border-emerald-500/50 bg-emerald-950/15 text-emerald-400"
                  : "border-zinc-850 hover:border-zinc-700 bg-zinc-900/10 text-zinc-400"
              }`}
            >
              <div>
                <div className="text-base font-bold">Specimen #8AB948</div>
                <div className="text-sm opacity-75 mt-1 font-sans text-zinc-500">₹500 Currency Note</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-450">Unscanned</span>
            </button>
            <button
              onClick={() => handleSelectNote("counterfeit")}
              disabled={scanning}
              className={`p-4 rounded-xl border text-left transition-all duration-300 flex justify-between items-center cursor-pointer ${
                selectedNote === "counterfeit"
                  ? "border-red-500/50 bg-red-950/15 text-red-400"
                  : "border-zinc-855 hover:border-zinc-700 bg-zinc-900/10 text-zinc-400"
              }`}
            >
              <div>
                <div className="text-base font-bold">Specimen #3CD572</div>
                <div className="text-sm opacity-75 mt-1 font-sans text-zinc-500">₹500 Currency Note</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-red-450 animate-pulse">Alert Flag</span>
            </button>
          </div>

          <button
            onClick={startScan}
            disabled={!selectedNote || scanning}
            className={`w-full py-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-350 mt-4 ${
              !selectedNote
                ? "bg-zinc-950 text-zinc-650 border border-zinc-900 cursor-not-allowed"
                : scanning
                ? "bg-violet-950/30 border border-violet-550 text-violet-400"
                : "bg-violet-650 hover:bg-violet-500 text-white shadow-[0_4px_15px_rgba(139,92,246,0.25)]"
            }`}
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                Scanning Specimen ({progress}%)
              </>
            ) : (
              <>
                <UploadCloud className="w-4.5 h-4.5" />
                Verify Specimen
              </>
            )}
          </button>
        </Card>

        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-5 font-sans relative overflow-hidden ${
              scanResult === "genuine"
                ? "border-emerald-500/20 bg-emerald-950/10"
                : "border-red-500/20 bg-red-950/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-3 relative z-10">
              {scanResult === "genuine" ? (
                <ShieldCheck className="w-5.5 h-5.5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5.5 h-5.5 text-red-400 animate-pulse" />
              )}
              <h4 className={`text-xs font-bold uppercase tracking-wider ${scanResult === "genuine" ? "text-emerald-400" : "text-red-400"}`}>
                {notes[scanResult].verdict}
              </h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed relative z-10">{notes[scanResult].details}</p>
          </motion.div>
        )}
      </div>

      {/* Interactive Visual Scanning Board */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex-1 flex flex-col justify-between min-h-[420px] relative overflow-hidden" variant="violet">
          {/* Note Representation */}
          <div className="w-full flex-1 flex flex-col items-center justify-center p-6 relative">
            <AnimatePresence mode="wait">
              {selectedNote ? (
                <motion.div
                  key={selectedNote}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`w-full max-w-[460px] aspect-[2.1] rounded-xl border relative flex flex-col justify-between p-6 overflow-hidden bg-zinc-900/30 ${
                    selectedNote === "genuine"
                      ? "border-emerald-500/20 text-emerald-405"
                      : "border-red-900/30 text-red-405"
                  }`}
                >
                  {/* Watermark area frame */}
                  <div className="absolute right-5 top-5 w-32 h-32 rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 flex items-center justify-center text-xs text-zinc-550 font-sans select-none">
                    {scanning ? (
                      <span className="animate-pulse text-violet-400/80 font-bold">Scanning Watermark</span>
                    ) : (
                      <span>Watermark Area</span>
                    )}
                  </div>

                  {/* Bank Title */}
                  <div className="flex justify-between items-start font-sans">
                    <div>
                      <div className="text-sm tracking-wider font-extrabold">RESERVE BANK OF INDIA</div>
                      <div className="text-[10px] opacity-60 font-sans tracking-wide">GUARANTEED BY THE CENTRAL GOVERNMENT</div>
                    </div>
                    <div className="text-right text-xs font-bold tracking-widest text-zinc-400">
                      {notes[selectedNote].serial}
                    </div>
                  </div>

                  {/* Silhouette Portrait */}
                  <div className="absolute right-9 bottom-7 w-24 h-24 bg-zinc-950/20 rounded-lg border border-zinc-800/80 flex items-center justify-center overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-zinc-850/15 border border-zinc-700/10" />
                  </div>

                  {/* Security Thread (refractive bar) */}
                  <div
                    className={`absolute left-[38%] top-0 bottom-0 w-1.5 transition-all duration-555 ${
                      scanning
                        ? "bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                        : selectedNote === "genuine"
                        ? "bg-emerald-500/20"
                        : "bg-zinc-800"
                    }`}
                  />

                  {/* Denomination Info */}
                  <div className="relative z-10 flex items-end justify-between font-sans">
                    <div className="flex flex-col">
                      <div className="text-3xl font-extrabold font-sans">₹500</div>
                      <div className="text-xs uppercase tracking-wider text-zinc-500 font-sans font-bold">Five Hundred Rupees</div>
                    </div>
                    <span className="text-xs border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 rounded text-violet-400 font-sans font-bold">
                      Scan Specimen
                    </span>
                  </div>

                  {/* Scan bar */}
                  {scanning && (
                    <motion.div
                      className="absolute left-0 right-0 h-3 bg-gradient-to-b from-violet-500/20 to-violet-500/80 shadow-[0_4px_15px_rgba(139,92,246,0.4)] z-20 pointer-events-none"
                      initial={{ top: "0%" }}
                      animate={{ top: "96%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </motion.div>
              ) : (
                <div className="text-center p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10 max-w-[420px]">
                  <UploadCloud className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-base text-zinc-550 font-bold">Awaiting specimen insertion</p>
                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                    Select a target banknote from the control list to initialize spectroscopic validation.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Diagnostic Outputs */}
          {scanResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-zinc-800 p-6 bg-zinc-950/30 text-xs"
            >
              <div className="text-zinc-400 font-bold mb-4 uppercase tracking-wider font-sans text-sm">
                Spectrograph Component Validation
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes[scanResult].diagnostics.map((diag, index) => (
                  <div key={index} className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-855 bg-zinc-950/40 font-sans">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-200 text-sm">{diag.feature}</span>
                      {diag.status === "pass" ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/20 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> PASS
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 px-2.5 py-1 rounded border border-red-900/20 font-bold animate-pulse">
                          <XCircle className="w-3.5 h-3.5" /> FAIL
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-zinc-450 leading-relaxed mt-2.5 flex flex-col gap-1.5">
                      <div>Target Standard: {diag.genuine}</div>
                      <div className="border-t border-zinc-800 pt-1 mt-1 text-zinc-300">
                        Result: {diag.detected}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
