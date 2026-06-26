"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Activity,
  LayoutDashboard,
  Eye,
  Share2,
  Users,
  MapPin,
  ChevronRight,
  TrendingUp,
  Bell,
  Cpu,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Search,
  FileText,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import VisionPanel from "@/components/dashboard/VisionPanel";
import NetworkPanel from "@/components/dashboard/NetworkPanel";
import CitizenPanel from "@/components/dashboard/CitizenPanel";
import GeoPanel from "@/components/dashboard/GeoPanel";
import ReportsPanel from "@/components/dashboard/ReportsPanel";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useKavach } from "@/context/KavachContext";

type Tab = "overview" | "vision" | "network" | "citizen" | "geo" | "reports";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [systemLoad, setSystemLoad] = useState(34);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    operationalFeeds,
    recentAlerts,
    stats,
    systemStress,
    toggleSystemStress,
    resetDatabase,
    surgeThreatFeed,
  } = useKavach();

  // Chart data for Overview (30 Days trend)
  const threatVolumeData = [
    { date: "May 27", threats: 45 },
    { date: "May 29", threats: 38 },
    { date: "May 31", threats: 52 },
    { date: "Jun 02", threats: 64 },
    { date: "Jun 04", threats: 58 },
    { date: "Jun 06", threats: 71 },
    { date: "Jun 08", threats: 83 },
    { date: "Jun 10", threats: 79 },
    { date: "Jun 12", threats: 88 },
    { date: "Jun 14", threats: 94 },
    { date: "Jun 16", threats: 82 },
    { date: "Jun 18", threats: 91 },
    { date: "Jun 20", threats: 104 },
    { date: "Jun 22", threats: 97 },
    { date: "Jun 24", threats: 112 },
    { date: "Jun 25", threats: 118 }
  ];

  // Simulating load fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(20, Math.min(prev + delta, 90));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "overview" as Tab, name: "System Overview", icon: LayoutDashboard, desc: "Global threat state" },
    { id: "vision" as Tab, name: "Vision Kavach", icon: Eye, desc: "Counterfeit currency detector" },
    { id: "network" as Tab, name: "Network Kavach", icon: Share2, desc: "Syndicate graph forensics" },
    { id: "citizen" as Tab, name: "Citizen Kavach", icon: Shield, desc: "Spoof and threat advisor" },
    { id: "geo" as Tab, name: "Geo Kavach", icon: MapPin, desc: "Regional geospatial heatmap" },
    { id: "reports" as Tab, name: "Intelligence Reports", icon: FileText, desc: "Audit logs & exports" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-900 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3.5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
              <Shield className="w-5.5 h-5.5 text-violet-400 animate-pulse" />
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-100 font-sans">
              Kavach <span className="text-violet-550">AI</span>
            </span>
          </Link>
          <div className="h-5 w-px bg-zinc-800" />
          <span className="text-xs text-zinc-500 font-sans uppercase tracking-wider hidden sm:inline font-bold">
            Operations Command Console
          </span>
        </div>

        {/* Search bar inside header */}
        <div className="relative max-w-xs w-full hidden md:block">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search commands, reports, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                alert(`Search query: "${searchQuery}" submitted to security registry.`);
              }
            }}
            className="w-full bg-zinc-950/70 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-300 focus:border-violet-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Header tools (bell notifications, profile dropdown) */}
        <div className="flex items-center gap-6 relative shrink-0">
          {/* Notification Bell */}
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-12 top-14 w-80 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl z-50 font-sans"
              >
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5 mb-3">
                  <span className="font-extrabold text-sm text-zinc-200">Recent Security Alerts</span>
                  <button
                    className="text-xs text-violet-405 font-bold hover:underline"
                    onClick={() => {
                      setShowNotifications(false);
                      alert("Alert cache cleared.");
                    }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-xs border-b border-zinc-950 pb-2">
                    <span className="font-bold text-zinc-300 block">VoIP Impersonation Intercepted</span>
                    <span className="text-zinc-500 mt-1 block">1m ago // Risk Index: 96% // Nuh Border</span>
                  </div>
                  <div className="text-xs border-b border-zinc-950 pb-2">
                    <span className="font-bold text-zinc-300 block">Phishing URL blacklist updated</span>
                    <span className="text-zinc-500 mt-1 block">5m ago // india-post-tracking-service.com</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300 block">REP-001 audit brief generated</span>
                    <span className="text-zinc-500 mt-1 block">12m ago // Officer Vikram</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Admin Profile */}
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-violet-955/40 border border-violet-900 flex items-center justify-center text-xs font-bold text-violet-400">
              VI
            </div>
            <span className="text-xs font-bold text-zinc-300 hidden md:inline">Officer Vikram</span>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-14 w-56 bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-xl z-50 font-sans"
              >
                <div className="border-b border-zinc-800 pb-2.5 mb-2.5 px-2">
                  <span className="font-extrabold text-sm text-zinc-200 block leading-tight">Vikram Kumar</span>
                  <span className="text-xs text-zinc-500 block mt-1 font-semibold">Deputy Director (IFSO)</span>
                </div>
                <div className="flex flex-col text-xs text-zinc-400 gap-1 font-semibold">
                  <Link
                    href="/"
                    onClick={() => setShowProfile(false)}
                    className="p-2 rounded-md hover:bg-zinc-950 hover:text-white transition-colors block"
                  >
                    Console Homepage
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      alert("Console profile configurations loaded.");
                    }}
                    className="p-2 text-left rounded-md hover:bg-zinc-950 hover:text-white transition-colors block w-full cursor-pointer"
                  >
                    Control Settings
                  </button>
                  <div className="h-px bg-zinc-800 my-1" />
                  <Link
                    href="/"
                    onClick={() => setShowProfile(false)}
                    className="p-2 rounded-md hover:bg-zinc-950 text-red-400 hover:text-red-300 transition-colors block"
                  >
                    Secure Exit Session
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Warning banner for system stress simulation */}
      <AnimatePresence>
        {systemStress && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-955/80 border-b border-red-900/40 text-red-400 py-3 px-6 text-xs font-mono text-center font-bold flex items-center justify-center gap-3.5"
          >
            <AlertTriangle className="w-4.5 h-4.5 animate-pulse text-red-500 shrink-0" />
            <span>WARNING: NETWORK DEGRADATION SIMULATION ACTIVE. FORCING 1.5S LATENCY & PACKET RETRIES ON ALL PORTS (STRESS INDEX: 92%).</span>
            <button 
              onClick={toggleSystemStress}
              className="underline hover:text-white font-extrabold cursor-pointer ml-3 bg-transparent border-none"
            >
              Disable Simulation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD BODY */}
      <div className="flex-1 flex flex-col md:flex-row h-full">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-72 border-r border-zinc-900 bg-zinc-950/40 p-5 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-sans text-zinc-500 font-bold uppercase tracking-wider pl-2 mb-2">Security Console</label>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-violet-955/30 text-violet-400 border-l-2 border-violet-500 font-bold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border-l-2 border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <div className="truncate">
                      <div className="text-sm leading-tight font-semibold">{item.name}</div>
                      <div className="text-xs text-zinc-550 truncate mt-1 leading-normal font-normal">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-zinc-900 pt-6 pl-2 flex flex-col gap-4 font-sans text-sm">
            <div className="flex justify-between items-center text-zinc-500 font-bold">
              <span>Active Threats</span>
              <span className="text-violet-405 font-extrabold">{stats.activeThreats}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 font-bold">
              <span>Connection Layer</span>
              <span className={`font-extrabold ${systemStress ? "text-red-500 animate-pulse" : "text-emerald-400"}`}>
                {systemStress ? "DEGRADED" : "SECURE"}
              </span>
            </div>
            <Link href="/" className="mt-6 flex items-center gap-2.5 text-zinc-450 hover:text-zinc-205 cursor-pointer transition-colors font-semibold">
              <LogOut className="w-4.5 h-4.5" />
              <span>Exit Platform</span>
            </Link>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 p-8 overflow-y-auto bg-zinc-950/10 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-8"
            >
              {/* SYSTEM OVERVIEW PANEL */}
              {activeTab === "overview" && (
                <>
                  {/* Top Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card variant="violet" className="flex flex-col justify-between h-36">
                      <div>
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">Active Threats</span>
                        <h4 className="text-3xl font-extrabold text-white mt-2">{stats.activeThreats} cases</h4>
                      </div>
                      <span className="text-sm text-red-400 flex items-center gap-1.5 border-t border-zinc-800/80 pt-3 font-bold">
                        9 Critical clusters prioritized
                      </span>
                    </Card>

                    <Card variant="zinc" className="flex flex-col justify-between h-36">
                      <div>
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">Fraud Reports Today</span>
                        <h4 className="text-3xl font-extrabold text-violet-400 mt-2">{stats.reportsToday.toLocaleString()} Logs</h4>
                      </div>
                      <span className="text-sm text-emerald-400 border-t border-zinc-800/80 pt-3 font-bold">
                        +14% in last 24 hours
                      </span>
                    </Card>

                    <Card variant="violet" className="flex flex-col justify-between h-36">
                      <div>
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">Counterfeit Reports</span>
                        <h4 className="text-3xl font-extrabold text-amber-505 mt-2">{stats.counterfeitReports} Notes</h4>
                      </div>
                      <span className="text-sm text-zinc-400 border-t border-zinc-800/80 pt-3 font-medium">
                        blacklisted sequence #3CD572
                      </span>
                    </Card>

                    <Card variant="zinc" className="flex flex-col justify-between h-36">
                      <div>
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">High-Risk Clusters</span>
                        <h4 className="text-3xl font-extrabold text-emerald-400 mt-2">{stats.riskClusters} Regions</h4>
                      </div>
                      <span className="text-sm text-zinc-400 border-t border-zinc-800/80 pt-3 font-medium">
                        Mewat, Jamtara, Delhi, Kolkata
                      </span>
                    </Card>
                  </div>

                  {/* Hackathon Demo Control Center */}
                  <Card variant="zinc" className="p-6 border border-zinc-800/80 bg-zinc-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3.5 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                        systemStress ? "bg-red-955/30 border-red-500/20 text-red-400" : "bg-violet-955/30 border-violet-800/30 text-violet-405"
                      }`}>
                        <Cpu className={`w-6 h-6 ${systemStress ? "animate-pulse" : ""}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-zinc-200 uppercase tracking-wider font-sans">
                          Hackathon Demo Control Hub
                        </h4>
                        <p className="text-xs text-zinc-500 mt-1 leading-normal font-sans">
                          Trigger real-time telemetry simulation, system stress faults, or reset environment telemetry.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={surgeThreatFeed}
                        className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(139,92,246,0.2)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)] cursor-pointer"
                      >
                        Surge Threat Feed
                      </button>
                      <button
                        onClick={toggleSystemStress}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          systemStress
                            ? "bg-red-955/40 border-red-500/40 text-red-400 hover:bg-red-955/60"
                            : "bg-zinc-950 border-zinc-800 text-zinc-350 hover:border-zinc-700 hover:bg-zinc-900"
                        }`}
                      >
                        {systemStress ? "Disable System Stress" : "Enable System Stress"}
                      </button>
                      <button
                        onClick={resetDatabase}
                        className="px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-250 text-xs font-bold transition-all cursor-pointer"
                      >
                        Reset Database
                      </button>
                    </div>
                  </Card>

                  {/* Main Overview Graphics */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recharts chart (30 Days trend) */}
                    <Card variant="violet" className="lg:col-span-2 p-6 flex flex-col gap-5">
                      <div className="flex justify-between items-center border-b border-zinc-805 pb-4">
                        <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                          Threat trend analysis (Last 30 Days)
                        </span>
                        <span className="text-xs text-zinc-550 font-bold">Unit: Blocked attempts / Day</span>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={threatVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                            <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                              labelStyle={{ color: "#a1a1aa", fontSize: "12px", fontFamily: "sans-serif" }}
                              itemStyle={{ color: "#d8b4fe", fontSize: "12px", fontFamily: "sans-serif" }}
                            />
                            <Area type="monotone" dataKey="threats" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#glowColor)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Scrolling Threat Feed Panel */}
                    <Card variant="zinc" className="lg:col-span-1 p-6 flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
                        <div className="flex items-center gap-2.5">
                          <Bell className="w-5 h-5 text-violet-400" />
                          <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                            Live Telemetry Feed
                          </span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      
                      {/* Log feed list */}
                      <div className="flex-1 flex flex-col gap-4 leading-relaxed mb-5 text-zinc-400 min-h-[220px] max-h-[260px] overflow-y-auto pr-1">
                        <AnimatePresence>
                          {operationalFeeds.map((feed) => (
                            <motion.div
                              key={feed.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40 flex gap-3.5 items-start"
                            >
                              {feed.type === "SUCCESS" ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className="text-xs text-zinc-550 font-sans font-bold">{feed.time} // {feed.type}</span>
                                <p className="text-sm text-zinc-300 font-semibold mt-1">{feed.message}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xs text-zinc-500 font-bold uppercase tracking-wide">
                        <span>CPU Status: Normal</span>
                        <span>DEF: Secure</span>
                      </div>
                    </Card>
                  </div>

                  {/* Recent Alerts Table */}
                  <Card variant="zinc" className="p-6 flex flex-col gap-5">
                    <div className="border-b border-zinc-800 pb-4">
                      <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                        Recent Intercepted Alerts Log
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm text-zinc-300">
                        <thead>
                          <tr className="border-b border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider">
                            <th className="py-3 px-4">Time</th>
                            <th className="py-3 px-4">Threat Type</th>
                            <th className="py-3 px-4">Risk Score</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentAlerts.map((alert, idx) => (
                            <tr key={idx} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors">
                              <td className="py-3.5 px-4 font-semibold font-mono text-zinc-500">{alert.time}</td>
                              <td className="py-3.5 px-4 font-bold text-zinc-200">{alert.type}</td>
                              <td className="py-3.5 px-4 font-semibold">
                                <span className={alert.score.includes("9") ? "text-red-405 font-bold" : "text-amber-405 font-bold"}>
                                  {alert.score}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`text-xs font-bold px-2.5 py-1 rounded border ${
                                    alert.status === "VERIFIED" || alert.status === "BLOCKED"
                                      ? "bg-emerald-955/20 text-emerald-450 border-emerald-900/25"
                                      : "bg-violet-955/20 text-violet-450 border-violet-900/25"
                                  }`}
                                >
                                  {alert.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}

              {/* Sub-panels representing Agents */}
              {activeTab === "vision" && <VisionPanel />}
              {activeTab === "network" && <NetworkPanel />}
              {activeTab === "citizen" && <CitizenPanel />}
              {activeTab === "geo" && <GeoPanel />}
              {activeTab === "reports" && <ReportsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
