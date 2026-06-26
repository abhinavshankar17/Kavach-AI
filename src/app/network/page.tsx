"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Search,
  Share2,
  Users,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Filter,
  CheckCircle,
  Network,
  Compass,
  Radio,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { mockEntities, NetworkEntity } from "@/components/dashboard/networkData";
import { useKavach } from "@/context/KavachContext";

// Dynamically import React Flow canvas to bypass SSR hydration warnings
const NetworkCanvas = dynamic(
  () => import("@/components/dashboard/NetworkCanvas"),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950/40 rounded-xl border border-zinc-900 min-h-[450px]">
      <div className="w-10 h-10 border-t-2 border-r-2 border-violet-500 rounded-full animate-spin mb-3" />
      <span className="text-sm text-zinc-550 font-bold uppercase animate-pulse">Initializing Graph Engine...</span>
    </div>
  )}
);

export default function NetworkPortal() {
  const { addAlert, systemStress } = useKavach();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string>("ALL");
  const [selectedEntity, setSelectedEntity] = useState<NetworkEntity | null>(null);
  const [tracingState, setTracingState] = useState<"idle" | "tracing" | "done">("idle");

  // Dispatch Cybercell alert mock
  const dispatchAlert = () => {
    if (!selectedEntity) return;
    alert(`DISPATCHED cyber liaison alert for ${selectedEntity.label} to local taskforces.`);
    addAlert(
      `Dispatched tactical cybercell command intercept for node ${selectedEntity.label} (${selectedEntity.id})`,
      "SUCCESS"
    );
  };

  const traceConnections = () => {
    setTracingState("tracing");
    const delay = systemStress ? 3505 : 1505;
    setTimeout(() => {
      setTracingState("done");
      addAlert(
        `Completed connection web forensic trace for syndicate ring node: ${selectedEntity?.label || "Cluster Target"}`,
        "SUCCESS"
      );
      setTimeout(() => setTracingState("idle"), 2500);
    }, delay);
  };

  // Filtered directories for list selector
  const filteredList = useMemo(() => {
    return mockEntities.filter((e) => {
      const matchesSearch = searchQuery
        ? e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.type.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCluster = selectedCluster === "ALL" || e.clusterId === selectedCluster;
      return matchesSearch && matchesCluster;
    });
  }, [searchQuery, selectedCluster]);

  const selectFromList = (entity: NetworkEntity) => {
    setSelectedEntity(entity);
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-violet-500/5 rounded-full filter blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-fuchsia-500/5 rounded-full filter blur-[130px] pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-zinc-955/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <Shield className="w-5.5 h-5.5 text-violet-405" />
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-100">
              Kavach <span className="text-violet-550">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="cursor-pointer">
              <button className="font-sans text-sm font-semibold px-5 py-2.5 rounded bg-violet-650 hover:bg-violet-550 text-white transition-all duration-300 shadow-[0_4px_15px_rgba(139,92,246,0.2)]">
                Launch Security Console
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Directory & Cluster Filters */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <Card variant="violet" className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-zinc-805 pb-4">
              <div className="flex items-center gap-2.5">
                <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 mr-1 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="font-bold text-base text-zinc-100 font-sans">Syndicate Graph Directory</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="w-5 h-5 text-zinc-550 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search phone, banks, victims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-11 pr-4 py-3.5 text-sm text-zinc-300 focus:border-violet-500 focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Cluster filters */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs text-zinc-550 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-zinc-500" /> Cluster Targets
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "ALL", name: "All Rings" },
                  { id: "Cluster J-1: Jamtara Phishing", name: "Jamtara Phishing Ring" },
                  { id: "Cluster M-2: Mewat VoIP", name: "Mewat VoIP Syndicate" },
                  { id: "Cluster D-3: Delhi Mules", name: "Delhi Mule Networks" }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCluster(c.id);
                      setSelectedEntity(null);
                    }}
                    className={`p-3 rounded-lg border text-left text-sm font-semibold transition-all cursor-pointer ${
                      selectedCluster === c.id
                        ? "border-violet-500/50 bg-violet-955/15 text-violet-400 font-extrabold"
                        : "border-zinc-850 hover:border-zinc-800 bg-zinc-900/10 text-zinc-450 hover:text-zinc-300"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Entities Index list */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-550 font-bold uppercase tracking-wider">
                Index (Count: {filteredList.length})
              </label>
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredList.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => selectFromList(e)}
                    className={`p-3 border rounded-lg text-left text-sm font-sans transition-all flex justify-between items-center cursor-pointer ${
                      selectedEntity?.id === e.id
                        ? "border-violet-500 bg-violet-950/20 text-violet-400 font-bold"
                        : "border-zinc-900 hover:border-zinc-800 bg-zinc-950/40 text-zinc-450 hover:text-zinc-250"
                    }`}
                  >
                    <div className="truncate max-w-[170px]">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold block">{e.id}</span>
                      <span className="font-bold truncate block">{e.label}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        e.risk > 75
                          ? "text-red-400 bg-red-955/20 border-red-900/20"
                          : e.risk > 40
                          ? "text-amber-400 bg-amber-955/20 border-amber-900/20"
                          : "text-emerald-400 bg-emerald-955/20 border-emerald-900/20"
                      }`}
                    >
                      {e.risk}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Center: Graph View Canvas & Right Panel Details */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch w-full">
          {/* Interactive Graph Area */}
          <div className="md:col-span-8 flex flex-col h-full min-h-[460px]">
            <NetworkCanvas
              searchQuery={searchQuery}
              selectedCluster={selectedCluster}
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
            />
          </div>

          {/* Right Panel: Selected Entity Inspector */}
          <div className="md:col-span-4 flex flex-col h-full">
            <Card variant="violet" className="h-full flex flex-col justify-between min-h-[460px]">
              <AnimatePresence mode="wait">
                {selectedEntity ? (
                  <motion.div
                    key={selectedEntity.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5 h-full justify-between"
                  >
                    <div>
                      {/* Title Info */}
                      <div className="border-b border-zinc-800 pb-3.5 mb-4">
                        <span className="text-[10px] text-zinc-550 font-mono font-bold uppercase">{selectedEntity.id} // INSPECTOR</span>
                        <h4 className="text-base font-extrabold text-zinc-200 mt-1">{selectedEntity.label}</h4>
                      </div>

                      {/* Type Badge */}
                      <div className="flex justify-between items-center bg-zinc-950/40 border border-zinc-800 rounded-lg p-3 text-xs mb-5 font-sans">
                        <span className="text-zinc-500 uppercase tracking-wider font-bold">Node Type</span>
                        <span className="font-extrabold text-zinc-350">{selectedEntity.type}</span>
                      </div>

                      {/* Risk Score Meter */}
                      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 text-center mb-5 flex items-center justify-between font-sans">
                        <div className="text-left">
                          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">Threat Risk Score</span>
                          <span className="text-2xl font-extrabold text-zinc-150 block mt-1.5">{selectedEntity.risk}%</span>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded border ${
                            selectedEntity.risk > 75
                              ? "text-red-400 bg-red-955/20 border-red-900/25"
                              : selectedEntity.risk > 40
                              ? "text-amber-400 bg-amber-955/20 border-amber-900/25"
                              : "text-emerald-400 bg-emerald-955/20 border-emerald-900/25"
                          }`}
                        >
                          {selectedEntity.risk > 75 ? "CRITICAL RISK" : selectedEntity.risk > 40 ? "SUSPICIOUS" : "LOW RISK"}
                        </span>
                      </div>

                      {/* Details Audit text */}
                      <div className="mb-5 font-sans">
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-2">Audit Intelligence Summary</span>
                        <p className="text-xs text-zinc-350 bg-zinc-950/20 p-3 border border-zinc-805 rounded-lg leading-relaxed font-semibold">
                          {selectedEntity.reports}
                        </p>
                      </div>

                      {/* Localized telemetry details */}
                      <div className="flex flex-col gap-2 text-xs font-sans text-zinc-400 font-semibold border-t border-zinc-800 pt-4">
                        <div className="flex justify-between border-b border-zinc-900/60 pb-1.5">
                          <span className="text-zinc-550 uppercase">Cluster Network</span>
                          <span className="text-zinc-300 font-bold truncate max-w-[130px]">{selectedEntity.clusterId.split(":")[1]?.trim() || selectedEntity.clusterId}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-900/60 pb-1.5">
                          <span className="text-zinc-550 uppercase">Linked nodes</span>
                          <span className="text-zinc-300 font-bold">{selectedEntity.connections} active connections</span>
                        </div>
                        {selectedEntity.ipAddress && (
                          <div className="flex justify-between border-b border-zinc-900/60 pb-1.5">
                            <span className="text-zinc-550 uppercase">Resolve IP</span>
                            <span className="text-zinc-300 font-mono font-bold">{selectedEntity.ipAddress}</span>
                          </div>
                        )}
                        {selectedEntity.coordinates && (
                          <div className="flex justify-between border-b border-zinc-900/60 pb-1.5">
                            <span className="text-zinc-550 uppercase">Coordinates</span>
                            <span className="text-zinc-300 font-mono font-bold">{selectedEntity.coordinates}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="border-t border-zinc-800 pt-4 mt-6 flex flex-col gap-2.5">
                      <button
                        onClick={traceConnections}
                        disabled={tracingState === "tracing"}
                        className={`w-full py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-350 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          tracingState === "tracing" ? "opacity-60 cursor-wait" : ""
                        }`}
                      >
                        <Compass className={`w-4 h-4 ${tracingState === "tracing" ? "animate-spin" : ""}`} />
                        {tracingState === "tracing" ? "Tracing..." : tracingState === "done" ? "Trace Completed!" : "Trace Connections"}
                      </button>
                      <button
                        onClick={dispatchAlert}
                        className="w-full py-2.5 rounded-lg bg-violet-650 hover:bg-violet-550 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_10px_rgba(139,92,246,0.2)]"
                      >
                        <Radio className="w-4 h-4" />
                        Dispatch Cybercell Alert
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-20 p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10 h-full flex flex-col justify-center items-center font-sans">
                    <Network className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-base text-zinc-450 font-bold">Node Inspector Standby</p>
                    <p className="text-xs text-zinc-550 mt-3 leading-relaxed">
                      Click any network node inside the visual graph or filter items in the directory list to query intelligence.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
