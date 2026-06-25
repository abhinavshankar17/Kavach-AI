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
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import VisionPanel from "@/components/dashboard/VisionPanel";
import NetworkPanel from "@/components/dashboard/NetworkPanel";
import CitizenPanel from "@/components/dashboard/CitizenPanel";
import GeoPanel from "@/components/dashboard/GeoPanel";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Tab = "overview" | "vision" | "network" | "citizen" | "geo";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [systemLoad, setSystemLoad] = useState(34);
  const [activeAlerts, setActiveAlerts] = useState(14);
  const [operationalFeeds, setOperationalFeeds] = useState([
    { id: 1, time: "12:44", message: "Vision scan validated ₹500 note signature", type: "SUCCESS" },
    { id: 2, time: "12:35", message: "Network scan blocked mule cashout in Mewat", type: "ALERT" },
    { id: 3, time: "12:28", message: "Citizen filter blocked VoIP call clone voice", type: "ALERT" },
  ]);

  // Chart data for Overview
  const threatVolumeData = [
    { hour: "00:00", threats: 42 },
    { hour: "04:00", threats: 35 },
    { hour: "08:00", threats: 58 },
    { hour: "12:00", threats: 82 },
    { hour: "16:00", threats: 74 },
    { hour: "20:00", threats: 95 },
  ];

  // Simulating load fluctuations and terminal feeds
  useEffect(() => {
    const messages = [
      { message: "Vision scanner processed banknote #3CD572", type: "SUCCESS" },
      { message: "Geo scanner mapped fraud outposts in Jamtara", type: "SUCCESS" },
      { message: "Citizen scanner blocked SMS customs phishing link", type: "ALERT" },
      { message: "Network scanner flagged 14 connected SIM trunks", type: "ALERT" },
      { message: "Synchronized active coordinate logs with taskforce", type: "SUCCESS" },
    ];

    const interval = setInterval(() => {
      setSystemLoad((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(20, Math.min(prev + delta, 90));
      });
      setActiveAlerts((prev) => {
        const delta = Math.random() > 0.75 ? 1 : Math.random() > 0.75 ? -1 : 0;
        return Math.max(8, prev + delta);
      });
      setOperationalFeeds((prev) => {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const now = new Date();
        const timeStr = now.toTimeString().split(" ")[0].substring(0, 5);
        return [
          { id: Date.now(), time: timeStr, ...randomMsg },
          ...prev.slice(0, 2),
        ];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "overview" as Tab, name: "System Overview", icon: LayoutDashboard, desc: "Global threat state" },
    { id: "vision" as Tab, name: "Vision Kavach", icon: Eye, desc: "Counterfeit currency detector" },
    { id: "network" as Tab, name: "Network Kavach", icon: Share2, desc: "Syndicate graph forensics" },
    { id: "citizen" as Tab, name: "Citizen Kavach", icon: Shield, desc: "Spoof and threat advisor" },
    { id: "geo" as Tab, name: "Geo Kavach", icon: MapPin, desc: "Regional geospatial heatmap" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-900 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
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

        {/* System parameters */}
        <div className="flex items-center gap-8 text-sm text-zinc-400 font-sans">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database Connected</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-zinc-500" />
            <span>System Load: {systemLoad}%</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span>Threat Level:</span>
            <span className="text-amber-500 bg-amber-950/20 px-3 py-1.5 rounded border border-amber-900/20 text-xs">
              HIGH
            </span>
          </div>
        </div>
      </header>

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
                        ? "bg-violet-950/30 text-violet-400 border-l-2 border-violet-500 font-bold"
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
            <div className="flex justify-between items-center text-zinc-500">
              <span>Active Alerts</span>
              <span className="text-violet-405 font-bold">{activeAlerts}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500">
              <span>Connection Layer</span>
              <span className="text-emerald-400 font-bold">SECURE</span>
            </div>
            <Link href="/" className="mt-6 flex items-center gap-2.5 text-zinc-450 hover:text-zinc-205 cursor-pointer transition-colors">
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
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">Intercepted Threats</span>
                        <h4 className="text-3xl font-extrabold text-white mt-2">1,482</h4>
                      </div>
                      <span className="text-sm text-emerald-400 flex items-center gap-1 border-t border-zinc-800/80 pt-3 font-bold">
                        +14% in last 24 hours
                      </span>
                    </Card>

                    <Card variant="zinc" className="flex flex-col justify-between h-36">
                      <div>
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">Active Syndicates</span>
                        <h4 className="text-3xl font-extrabold text-violet-400 mt-2">29 rings</h4>
                      </div>
                      <span className="text-sm text-zinc-400 border-t border-zinc-800/80 pt-3 font-medium">
                        Tracking 4 regional epicenters
                      </span>
                    </Card>

                    <Card variant="violet" className="flex flex-col justify-between h-36">
                      <div>
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">Risk Level</span>
                        <h4 className="text-3xl font-extrabold text-amber-500 mt-2">Elevated</h4>
                      </div>
                      <span className="text-sm text-amber-500 animate-pulse border-t border-zinc-800/80 pt-3 font-bold">
                        Active Monitoring Engaged
                      </span>
                    </Card>

                    <Card variant="zinc" className="flex flex-col justify-between h-36">
                      <div>
                        <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">Agent Sync Status</span>
                        <h4 className="text-3xl font-extrabold text-emerald-400 mt-2">4 / 4 Online</h4>
                      </div>
                      <span className="text-sm text-zinc-400 border-t border-zinc-800/80 pt-3 font-medium">
                        All modules synchronized
                      </span>
                    </Card>
                  </div>

                  {/* Main Overview Graphics */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recharts chart */}
                    <Card variant="violet" className="lg:col-span-2 p-6 flex flex-col gap-5">
                      <div className="flex justify-between items-center border-b border-zinc-805 pb-4">
                        <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                          Threat Interceptions (24h Trend)
                        </span>
                        <span className="text-xs text-zinc-500 font-bold">Unit: Events / Hour</span>
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
                            <XAxis dataKey="hour" stroke="#71717a" fontSize={11} tickLine={false} />
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

                    {/* Operational Bulletins */}
                    <Card variant="zinc" className="lg:col-span-1 p-6 flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
                        <div className="flex items-center gap-2.5">
                          <Bell className="w-5 h-5 text-violet-400" />
                          <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                            Operational Logs Feed
                          </span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      
                      {/* Log feed list */}
                      <div className="flex-1 flex flex-col gap-4 leading-relaxed mb-5 text-zinc-400 min-h-[180px]">
                        {operationalFeeds.map((feed) => (
                          <div key={feed.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/30 flex gap-3.5 items-start">
                            {feed.type === "SUCCESS" ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="text-xs text-zinc-500 font-sans font-bold">{feed.time} // {feed.type}</span>
                              <p className="text-sm text-zinc-350 font-semibold mt-1">{feed.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xs text-zinc-500 font-bold uppercase tracking-wide">
                        <span>CPU Status: Normal</span>
                        <span>DEF: Secure</span>
                      </div>
                    </Card>
                  </div>
                </>
              )}

              {/* Sub-panels representing Agents */}
              {activeTab === "vision" && <VisionPanel />}
              {activeTab === "network" && <NetworkPanel />}
              {activeTab === "citizen" && <CitizenPanel />}
              {activeTab === "geo" && <GeoPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
