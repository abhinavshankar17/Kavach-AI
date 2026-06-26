"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  Globe,
  MapPin,
  RefreshCw,
  Server,
  Lock,
  Activity,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CityData } from "@/components/geo/GeoRadarMap";

// Import Leaflet Map dynamically with SSR disabled to prevent Node hydration errors
const GeoRadarMap = dynamic(() => import("@/components/geo/GeoRadarMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 rounded-xl">
      <RefreshCw className="w-8 h-8 text-violet-500 animate-spin mb-4" />
      <span className="text-sm text-zinc-550 uppercase tracking-widest font-mono">Calibrating Map Satellite Grid...</span>
    </div>
  ),
});

export default function GeoPortal() {
  const cities: CityData[] = [
    {
      id: "delhi",
      name: "Delhi NCR Gateway",
      state: "National Capital Region",
      activeComplaints: 521,
      threatLevel: "CRITICAL",
      primaryThreat: "Mule Bank Aggregators & VoIP Spoofing",
      policeCoop: "Delhi Police IFSO (Direct Link)",
      coords: [28.6139, 77.2090],
    },
    {
      id: "mumbai",
      name: "Mumbai Financial Node",
      state: "Maharashtra",
      activeComplaints: 482,
      threatLevel: "CRITICAL",
      primaryThreat: "Stock Market Spoofs & KYC Phishing",
      policeCoop: "Maharashtra Cyber Wing (Integrated)",
      coords: [19.0760, 72.8777],
    },
    {
      id: "ahmedabad",
      name: "Ahmedabad Trade District",
      state: "Gujarat",
      activeComplaints: 310,
      threatLevel: "HIGH",
      primaryThreat: "P2P Escrow Fraud & Customs Scams",
      policeCoop: "Gujarat Cyber Cell Liaison (Active)",
      coords: [23.0225, 72.5714],
    },
    {
      id: "surat",
      name: "Surat Commercial Ring",
      state: "Gujarat",
      activeComplaints: 220,
      threatLevel: "MEDIUM",
      primaryThreat: "GST Invoice Ring & Part-Time Job Scams",
      policeCoop: "Surat City Cyber Liaison (Active)",
      coords: [21.1702, 72.8311],
    },
    {
      id: "vadodara",
      name: "Vadodara Transit Node",
      state: "Gujarat",
      activeComplaints: 142,
      threatLevel: "LOW",
      primaryThreat: "Fake Courier Tracking Links",
      policeCoop: "Vadodara Rural Taskforce (Active)",
      coords: [22.3072, 73.1812],
    },
    {
      id: "bengaluru",
      name: "Bengaluru Tech Corridor",
      state: "Karnataka",
      activeComplaints: 384,
      threatLevel: "HIGH",
      primaryThreat: "Tech Support Impersonation & AI Voice Clones",
      policeCoop: "Karnataka CID Cyber Crime (Direct Link)",
      coords: [12.9716, 77.5946],
    },
    {
      id: "chennai",
      name: "Chennai Telecom Exchange",
      state: "Tamil Nadu",
      activeComplaints: 260,
      threatLevel: "MEDIUM",
      primaryThreat: "Synthetic Identity Registry Scams",
      policeCoop: "Tamil Nadu Cyber Taskforce (Integrated)",
      coords: [13.0827, 80.2707],
    },
  ];

  const [selectedCity, setSelectedCity] = useState<CityData | null>(cities[0]);

  // Chart data (Geo Trend Analysis - monthly complaints)
  const monthlyTrendData = [
    { month: "Jan", cases: 140 },
    { month: "Feb", cases: 210 },
    { month: "Mar", cases: 180 },
    { month: "Apr", cases: 290 },
    { month: "May", cases: 340 },
    { month: "Jun", cases: 410 },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-violet-500/5 rounded-full filter blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full filter blur-[130px] pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-zinc-955/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <Shield className="w-5.5 h-5.5 text-violet-400" />
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
        {/* Left Columns: Map & City selector */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          <Card variant="violet" className="flex flex-col gap-5 p-6 bg-zinc-900/10">
            <div className="flex justify-between items-center border-b border-zinc-805 pb-4">
              <div className="flex items-center gap-2.5">
                <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-350 mr-1 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="font-bold text-base text-zinc-100 font-sans">
                  Geospatial Incident Tracking
                </span>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 px-3 py-1 rounded border border-emerald-900/25 font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> LIVE TELEMETRY
              </span>
            </div>

            {/* Quick selector bar of cities */}
            <div className="flex flex-wrap gap-2 py-1 overflow-x-auto pr-1">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`text-xs px-3.5 py-2 rounded-lg border font-bold transition-all duration-250 cursor-pointer ${
                    selectedCity?.id === city.id
                      ? "border-violet-500/50 bg-violet-955/20 text-violet-400 font-extrabold"
                      : "border-zinc-855 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {city.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Dynamic Map Component container */}
            <div className="w-full aspect-[1.6] min-h-[460px] overflow-hidden rounded-xl">
              <GeoRadarMap
                cities={cities}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Threat Telemetry & Trends */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          {/* Active Profile Info */}
          <AnimatePresence mode="wait">
            {selectedCity ? (
              <motion.div
                key={selectedCity.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Card variant="violet" className="flex flex-col gap-4 bg-zinc-900/10">
                  <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-1">
                    <MapPin className="w-5 h-5 text-violet-400" />
                    <span className="text-sm font-bold text-zinc-205 uppercase tracking-wide">
                      {selectedCity.name} Profile
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 font-sans text-xs">
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 font-bold uppercase">Jurisdiction State</span>
                      <span className="font-semibold text-zinc-300">{selectedCity.state}</span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 font-bold uppercase">Active Complaints</span>
                      <span className="font-bold text-violet-400">{selectedCity.activeComplaints} records</span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 font-bold uppercase">Primary Threat Vector</span>
                      <span className="font-bold text-zinc-305 text-right">{selectedCity.primaryThreat}</span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 font-bold uppercase">Outpost Coordination</span>
                      <span className="font-bold text-emerald-400 text-right">{selectedCity.policeCoop}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-zinc-500 font-bold uppercase">Threat Rating</span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded border uppercase ${
                          selectedCity.threatLevel === "CRITICAL"
                            ? "text-red-400 bg-red-955/20 border-red-900/25"
                            : selectedCity.threatLevel === "HIGH"
                            ? "text-amber-400 bg-amber-955/20 border-amber-900/25"
                            : selectedCity.threatLevel === "MEDIUM"
                            ? "text-orange-400 bg-orange-955/20 border-orange-900/25"
                            : "text-violet-400 bg-violet-955/20 border-violet-900/25"
                        }`}
                      >
                        {selectedCity.threatLevel}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card variant="zinc" className="p-6 text-center text-xs text-zinc-500">
                Click a marker on the radar screen to request security cell coordinates.
              </Card>
            )}
          </AnimatePresence>

          {/* Emerging Threat Zones */}
          <Card variant="zinc" className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <AlertTriangle className="w-5 h-5 text-violet-405" />
              <span className="text-sm font-bold text-zinc-200">Emerging Threat Clusters</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 border border-zinc-900 bg-zinc-950/20 rounded-xl flex justify-between items-center font-sans text-xs">
                <div>
                  <span className="font-bold text-zinc-200">Jamtara Outskirts</span>
                  <p className="text-[10px] text-zinc-500 mt-1">SMS Kyc spoofing surge</p>
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded border text-red-400 bg-red-955/25 border-red-900/20">CRITICAL</span>
              </div>

              <div className="p-3 border border-zinc-900 bg-zinc-950/20 rounded-xl flex justify-between items-center font-sans text-xs">
                <div>
                  <span className="font-bold text-zinc-200">Mewat Border Zone</span>
                  <p className="text-[10px] text-zinc-500 mt-1">SIP voice clone spoof logs</p>
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded border text-amber-400 bg-amber-955/25 border-amber-900/20">HIGH</span>
              </div>
            </div>
          </Card>

          {/* Trend Analysis Graph */}
          <Card variant="violet" className="flex flex-col gap-4 p-5 bg-zinc-900/10">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Threat Trend</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">1H INTERVAL</span>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="geoTrendColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#52525b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px" }}
                    labelStyle={{ color: "#a1a1aa", fontSize: "10px", fontFamily: "sans-serif" }}
                    itemStyle={{ color: "#d8b4fe", fontSize: "10px", fontFamily: "sans-serif" }}
                  />
                  <Area type="monotone" dataKey="cases" stroke="#a78bfa" strokeWidth={1.5} fillOpacity={1} fill="url(#geoTrendColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="border-t border-zinc-850 pt-3 flex justify-between items-center text-[10px] text-zinc-550 font-sans font-bold">
              <span>National Incident Rate</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-violet-500" /> Secure Data
              </span>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
