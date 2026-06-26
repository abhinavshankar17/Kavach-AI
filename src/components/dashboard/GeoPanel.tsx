"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Globe, Clock, RefreshCw, Server, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";

interface Hotspot {
  id: string;
  name: string;
  state: string;
  activeComplaints: number;
  threatLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  primaryThreat: string;
  policeCoop: string;
  coords: { x: number; y: number };
}

interface Incident {
  id: string;
  time: string;
  location: string;
  type: string;
  volume: string;
  status: "BLOCKED" | "INTERCEPTING" | "ALERTED";
}

export default function GeoPanel() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: "INC-9281", time: "10s ago", location: "Jamtara, JH", type: "KYC Phishing SMS", volume: "₹1.4L", status: "BLOCKED" },
    { id: "INC-9282", time: "1m ago", location: "Nuh, HR", type: "Digital Arrest Call", volume: "₹18.0L", status: "INTERCEPTING" },
    { id: "INC-9283", time: "3m ago", location: "Kolkata, WB", type: "Mule Account Cashout", volume: "₹4.5L", status: "BLOCKED" },
    { id: "INC-9284", time: "5m ago", location: "Bengaluru, KA", type: "Synthetic Voice Spoof", volume: "₹2.2L", status: "ALERTED" },
    { id: "INC-9285", time: "7m ago", location: "Ahmedabad, GJ", type: "Courier Customs Scam", volume: "₹8.0L", status: "BLOCKED" },
  ]);

  const hotspots: Hotspot[] = [
    {
      id: "mewat",
      name: "Mewat Region",
      state: "Haryana / Rajasthan Border",
      activeComplaints: 412,
      threatLevel: "CRITICAL",
      primaryThreat: "VoIP Spoofing & Threat Calls",
      policeCoop: "Nuh Cyber Cell Liaison (Active)",
      coords: { x: 140, y: 110 },
    },
    {
      id: "jamtara",
      name: "Jamtara Hub",
      state: "Jharkhand",
      activeComplaints: 289,
      threatLevel: "HIGH",
      primaryThreat: "KYC Phishing Links",
      policeCoop: "Jharkhand Cyber Taskforce (Integrated)",
      coords: { x: 260, y: 150 },
    },
    {
      id: "kolkata",
      name: "Kolkata Call Ring",
      state: "West Bengal",
      activeComplaints: 341,
      threatLevel: "HIGH",
      primaryThreat: "Courier & Customs Impersonation",
      policeCoop: "Bidhannagar Police Cyber Wing (Active)",
      coords: { x: 275, y: 175 },
    },
    {
      id: "delhi",
      name: "NCR Gateway Network",
      state: "Delhi NCR",
      activeComplaints: 521,
      threatLevel: "CRITICAL",
      primaryThreat: "Mule Bank Aggregators & IB Gateways",
      policeCoop: "Delhi Police IFSO (Direct Link)",
      coords: { x: 150, y: 95 },
    },
  ];

  // Simulate streaming incidents
  useEffect(() => {
    const types = [
      "Digital Arrest Call",
      "KYC Phishing SMS",
      "Mule Account Cashout",
      "Synthetic Voice Spoof",
      "Courier Customs Scam",
    ];
    const locations = [
      "Jamtara, JH",
      "Nuh, HR",
      "Kolkata, WB",
      "Delhi, DL",
      "Mumbai, MH",
      "Bengaluru, KA",
      "Hyderabad, TG",
    ];
    const volumes = ["₹45K", "₹1.2L", "₹6.8L", "₹12.0L", "₹2.5L", "₹9.4L"];
    const statuses: Incident["status"][] = ["BLOCKED", "INTERCEPTING", "ALERTED"];

    const interval = setInterval(() => {
      const newInc: Incident = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        time: "Just now",
        location: locations[Math.floor(Math.random() * locations.length)],
        type: types[Math.floor(Math.random() * types.length)],
        volume: volumes[Math.floor(Math.random() * volumes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };

      setIncidents((prev) => {
        const updated = prev.map((inc) => {
          if (inc.time === "Just now") return { ...inc, time: "1m ago" };
          if (inc.time === "10s ago") return { ...inc, time: "1m ago" };
          if (inc.time.includes("m ago")) {
            const mins = parseInt(inc.time) + 1;
            return { ...inc, time: `${mins}m ago` };
          }
          return inc;
        });
        return [newInc, ...updated.slice(0, 5)];
      });
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Control Panel & Hotspot details */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card variant="zinc" className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-2">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5.5 h-5.5 text-violet-400 animate-pulse" />
              <span className="font-bold text-base text-zinc-100">Geospatial Intelligence</span>
            </div>
            <Link href="/geo" className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 hover:underline cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" /> Launch Radar
            </Link>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Monitor active cybercrime nodes, coordinate threat vectors geographically, and evaluate collaborative alert matrices.
          </p>

          <div className="flex flex-col gap-3.5 mt-2">
            <label className="text-xs text-zinc-550 font-bold uppercase tracking-wider">Active Hotspots</label>
            <div className="flex flex-col gap-3">
              {hotspots.map((hs) => (
                <button
                  key={hs.id}
                  onClick={() => setSelectedHotspot(hs)}
                  className={`p-4 rounded-xl border text-left font-sans transition-all duration-300 flex justify-between items-center cursor-pointer ${
                    selectedHotspot?.id === hs.id
                      ? "border-violet-500/50 bg-violet-955/15 text-violet-400 font-bold"
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 text-zinc-450"
                  }`}
                >
                  <div>
                    <span className="text-base font-bold">{hs.name}</span>
                    <p className="text-xs text-zinc-500 mt-1">{hs.state}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded border ${
                      hs.threatLevel === "CRITICAL"
                        ? "text-red-400 bg-red-950/40 border-red-900/30"
                        : "text-amber-400 bg-amber-950/40 border-amber-900/30"
                    }`}
                  >
                    {hs.threatLevel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Hotspot details panel */}
        <AnimatePresence mode="wait">
          {selectedHotspot ? (
            <motion.div
              key={selectedHotspot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-6 font-sans flex flex-col gap-4"
            >
              <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-3">
                <MapPin className="w-5.5 h-5.5 text-violet-400" />
                <span className="text-base font-extrabold text-zinc-200 uppercase">{selectedHotspot.name} Profile</span>
              </div>
              <div className="flex flex-col gap-3 mt-1">
                <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                  <span className="text-xs text-zinc-500 font-bold uppercase">Primary Vector</span>
                  <span className="text-sm font-bold text-zinc-300">{selectedHotspot.primaryThreat}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                  <span className="text-xs text-zinc-500 font-bold uppercase">Active Cases</span>
                  <span className="text-sm font-bold text-violet-400">{selectedHotspot.activeComplaints} records</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                  <span className="text-xs text-zinc-500 font-bold uppercase">Jurisdiction Outpost</span>
                  <span className="text-sm font-bold text-emerald-400">{selectedHotspot.policeCoop}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/10 p-6 font-sans text-center text-sm text-zinc-550">
              Select a hotspot node to query localized threat telemetry.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Map and Live Incident Feed */}
      <div className="lg:col-span-7 flex flex-col gap-6 font-sans">
        <Card variant="violet" className="flex-1 flex flex-col min-h-[450px] justify-between relative overflow-hidden">
          {/* Map Section */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5.5 h-5.5 text-violet-400" />
              <span className="font-bold text-base text-zinc-150">
                Threat Hotspot Distribution Map
              </span>
            </div>
            <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 px-3 py-1 rounded border border-emerald-900/25 font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> LIVE RADAR FEED
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* The SVG Map of India (stylized outline) */}
            <div className="md:col-span-7 bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 flex items-center justify-center relative overflow-hidden min-h-[260px]">
              
              {/* Scope scale lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[180px] h-[180px] rounded-full border border-zinc-900/40" />
                <div className="w-[280px] h-[280px] rounded-full border border-zinc-900/20 absolute" />
              </div>

              {/* Stylized SVG Map of India */}
              <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] aspect-square relative z-10 opacity-70">
                {/* Outline of India */}
                <path
                  d="M 170 30 L 175 40 L 180 50 L 170 70 L 160 85 L 140 90 L 130 110 L 115 130 L 110 160 L 120 180 L 135 190 L 140 210 L 155 240 L 180 280 L 195 320 L 202 360 L 204 360 L 210 320 L 222 280 L 240 250 L 245 230 L 255 220 L 275 220 L 285 200 L 290 180 L 270 170 L 250 155 L 240 145 L 255 135 L 275 135 L 290 145 L 305 130 L 285 110 L 260 110 L 240 100 L 225 80 L 210 80 L 195 70 L 190 50 L 185 30 Z"
                  fill="none"
                  stroke="rgba(167, 139, 250, 0.15)"
                  strokeWidth="1.2"
                />

                {/* Hotspot Beacons */}
                {hotspots.map((hs) => {
                  const isSelected = selectedHotspot?.id === hs.id;
                  const isCritical = hs.threatLevel === "CRITICAL";

                  return (
                    <g
                      key={hs.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedHotspot(hs)}
                    >
                      {/* Pulse circle */}
                      <circle
                        cx={hs.coords.x}
                        cy={hs.coords.y}
                        r={isSelected ? 12 : 6}
                        fill="none"
                        stroke={isCritical ? "#ef4444" : "#f59e0b"}
                        strokeWidth={0.8}
                        className="animate-ping"
                      />
                      {/* Anchor Dot */}
                      <circle
                        cx={hs.coords.x}
                        cy={hs.coords.y}
                        r={isSelected ? 4 : 3}
                        fill={isCritical ? "#ef4444" : "#f59e0b"}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 1 : 0}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Live streaming Feed */}
            <div className="md:col-span-5 flex flex-col justify-between bg-zinc-950/30 rounded-xl border border-zinc-900 p-4 font-sans text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-zinc-300 font-bold border-b border-zinc-800 pb-3 mb-3">
                <Server className="w-5 h-5 text-violet-400 animate-pulse" />
                <span className="text-sm font-bold">Live Complaint Stream</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[240px] pr-1">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-3.5 border border-zinc-850 bg-zinc-950/50 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-zinc-200">{inc.id}</span>
                      <span className="text-zinc-500 font-medium">{inc.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-500 font-bold">
                      <span>Location: {inc.location}</span>
                      <span>Value: {inc.volume}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 border-t border-zinc-800/60 pt-2">
                      <span className="text-xs text-zinc-350 font-semibold truncate max-w-[125px]">{inc.type}</span>
                      <span
                        className={`font-sans font-bold px-2 py-0.5 rounded text-[10px] ${
                          inc.status === "BLOCKED"
                            ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/20"
                            : inc.status === "INTERCEPTING"
                            ? "bg-violet-955/40 text-violet-400 border border-violet-900/20"
                            : "bg-red-955/40 text-red-400 border border-red-900/20"
                        }`}
                      >
                        {inc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
