"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  ArrowRight,
  Eye,
  Share2,
  Users,
  MapPin,
  CheckCircle,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import ArchitectureDiagram from "../components/landing/ArchitectureDiagram";

export default function Home() {
  const [activeFeeds, setActiveFeeds] = useState([
    { time: "12:44", type: "Banknote Scan", details: "₹500 note #8AB948 verified genuine", status: "VERIFIED" },
    { time: "12:35", type: "Mule Account Intercept", details: "Flagged transfer SBI **2919: ₹12.4L", status: "BLOCKED" },
    { time: "12:28", type: "Spoof VoIP Intercept", details: "Digital Arrest call filtered at Delhi gateway", status: "BLOCKED" },
  ]);

  // Simulate dashboard feed updates
  useEffect(() => {
    const feedsPool = [
      { type: "Mule Account Intercept", details: "Flagged transfer HDFC **8812: ₹8.9L", status: "BLOCKED" },
      { type: "SMS Phishing Blocked", details: "india-post-tracking-service.com flagged", status: "BLOCKED" },
      { type: "Banknote Scan", details: "₹500 note #3CD572 flagged counterfeit", status: "ALERT" },
      { type: "Spoof VoIP Intercept", details: "Spam phone spoof intercepted at Mewat gateway", status: "BLOCKED" },
    ];

    const interval = setInterval(() => {
      const randomFeed = feedsPool[Math.floor(Math.random() * feedsPool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0].substring(0, 5);
      setActiveFeeds((prev) => [
        { time: timeStr, ...randomFeed },
        ...prev.slice(0, 2),
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statistics = [
    { value: "₹1,776 Cr+", label: "Preventable Losses", desc: "Estimated fraud volume intercepted annually via early analysis." },
    { value: "1.14M+", label: "Logged Complaints", desc: "Telemetry incidents parsed and updated from public databases." },
    { value: "4 AI Agents", label: "Specialized Models", desc: "Vision, Network, Citizen, and Geo coordinate engines." },
    { value: "< 2.4s", label: "Incident Latency", desc: "Average response latency from fraud inception to network blocking." },
  ];

  const agents = [
    {
      title: "Vision Kavach",
      tag: "Spectroscopic Currency Scan",
      desc: "Deep learning models verifying banknotes, identity cards, and legal credentials. Scans micro-texture alignment and variable threads to pinpoint counterfeit markers.",
      icon: Eye,
      color: "text-emerald-400",
      variant: "violet" as const,
      path: "/vision",
    },
    {
      title: "Network Kavach",
      tag: "Transaction Link Forensics",
      desc: "Relates transactions, VoIP channels, and pre-activated SIM identities into graphical webs, automatically highlighting suspicious bank-mule account networks.",
      icon: Share2,
      color: "text-violet-400",
      variant: "zinc" as const,
      path: "/network",
    },
    {
      title: "Citizen Kavach",
      tag: "Spoof & Coercion Guardian",
      desc: "An intelligent advisor parsing calls, SMS, and website URLs. Flags voice-cloning indicators, linguistic coercion patterns, and links redirecting to spoof gateways.",
      icon: Shield,
      color: "text-fuchsia-400",
      variant: "violet" as const,
      path: "/citizen",
    },
    {
      title: "Geo Kavach",
      tag: "GIS Cybercrime Mapping",
      desc: "Maps cyber incident geolocations to visual heatmaps, tracking active calling centers and coordinating direct alerts to local law enforcement cell units.",
      icon: MapPin,
      color: "text-indigo-400",
      variant: "zinc" as const,
      path: "/geo",
    },
  ];

  const features = [
    {
      title: "Counterfeit Recognition",
      desc: "Simulated spectrometer scanner that cross-references security threads, watermark alignment, and raised intaglio borders.",
    },
    {
      title: "Graph Syndicate Analysis",
      desc: "Interconnected node mapping connecting fraudulent bank branches, synthetic account profiles, and virtual SIP gateways.",
    },
    {
      title: "Citizen Fraud Shield",
      desc: "Immediate NLP analysis of suspicious messages and audio clips, displaying threat indexes and Sanchar Saathi guidelines.",
    },
    {
      title: "Geospatial Heatmaps",
      desc: "Tactical heat mapping showing coordinates of cybercrime hubs integrated with local cybercell liaison reporting structures.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full filter blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full filter blur-[150px] pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-zinc-955/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <Shield className="w-5.5 h-5.5 text-violet-400" />
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-100 font-sans">
              Kavach <span className="text-violet-550">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 font-sans text-sm text-zinc-400">
            <a href="#stats" className="hover:text-violet-400 transition-colors duration-250 font-medium">Overview</a>
            <a href="#agents" className="hover:text-violet-400 transition-colors duration-250 font-medium">AI Agents</a>
            <a href="#features" className="hover:text-violet-400 transition-colors duration-250 font-medium">Features</a>
            <a href="#architecture" className="hover:text-violet-400 transition-colors duration-250 font-medium">Architecture</a>
          </nav>

          <Link href="/dashboard" className="cursor-pointer">
            <button className="font-sans text-sm font-semibold px-5 py-2.5 rounded bg-violet-600 hover:bg-violet-500 text-white transition-all duration-300 shadow-[0_4px_20px_rgba(139,92,246,0.2)] cursor-pointer">
              Launch Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column: Headings */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded bg-zinc-900 text-violet-400 font-sans text-xs font-semibold uppercase tracking-wider mb-8 border border-zinc-800">
            <Activity className="w-4 h-4" />
            <span>Public Safety Intelligence Portal</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Kavach <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500">AI</span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-350 tracking-tight mb-8">
            Digital Armor Against Organized Fraud
          </h2>

          <p className="text-sm md:text-base text-zinc-450 max-w-2xl leading-relaxed mb-12">
            A secure multi-agent intelligence platform coordinating real-time threat telemetry. Protects public finance, telecommunication networks, and citizen identity parameters using unified analytical models.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link href="/dashboard" className="cursor-pointer w-full sm:w-auto">
              <button className="w-full sm:w-auto font-sans text-sm font-bold px-8 py-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all duration-300 shadow-[0_4px_20px_rgba(139,92,246,0.3)] cursor-pointer flex items-center justify-center gap-2">
                Launch Security Command <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#architecture" className="cursor-pointer w-full sm:w-auto">
              <button className="w-full sm:w-auto font-sans text-sm font-bold px-8 py-4 rounded-lg border border-zinc-800 bg-zinc-900/20 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all duration-300 cursor-pointer">
                View Architecture
              </button>
            </a>
          </div>
        </div>

        {/* Right Column: Sleek Dashboard Mockup */}
        <div className="lg:col-span-5 w-full hidden lg:block">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl relative">
            <div className="absolute -top-3 -right-3 w-40 h-40 bg-violet-500/5 rounded-full filter blur-xl pointer-events-none" />

            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="font-sans text-sm font-bold text-zinc-300">Operations Monitor</span>
              </div>
              <span className="text-xs text-zinc-500 font-sans tracking-wide">Live Feed</span>
            </div>

            {/* List of active feeds */}
            <div className="flex flex-col gap-4">
              {activeFeeds.map((feed, idx) => (
                <div key={idx} className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/60 flex justify-between items-center transition-all duration-300">
                  <div>
                    <span className="text-xs text-zinc-550 font-sans">{feed.time} // {feed.type}</span>
                    <p className="text-sm text-zinc-300 font-semibold mt-1">{feed.details}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded border ${
                      feed.status === "VERIFIED"
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/20"
                        : "bg-violet-950/40 text-violet-400 border border-violet-900/20"
                    }`}
                  >
                    {feed.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Micro details bar */}
            <div className="border-t border-zinc-800/80 pt-5 mt-5 flex justify-between items-center text-xs text-zinc-500 font-sans">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-violet-505" /> Secure Database Link
              </span>
              <span className="flex items-center gap-1 text-violet-400 font-semibold cursor-pointer">
                Live Console <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section id="stats" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, idx) => (
            <Card key={idx} className="flex flex-col gap-3 h-full justify-between" variant="zinc">
              <div>
                <h3 className="text-4xl font-extrabold tracking-tight text-violet-400">{stat.value}</h3>
                <h4 className="text-sm font-bold text-zinc-200 mt-2.5 uppercase tracking-wider">
                  {stat.label}
                </h4>
              </div>
              <p className="text-sm text-zinc-450 mt-4 leading-relaxed border-t border-zinc-800/80 pt-4 font-sans">
                {stat.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* AI AGENTS SECTION */}
      <section id="agents" className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center mb-20">
          <span className="text-sm text-violet-500 uppercase tracking-widest font-bold">Specialized Modules</span>
          <h2 className="text-4xl font-extrabold mt-3 text-white tracking-tight">AI Intelligence Agents</h2>
          <p className="text-sm text-zinc-450 max-w-xl mx-auto mt-4">
            Four targeted analytical engines operating in synchronous public defense environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agents.map((agent, idx) => {
            const Icon = agent.icon;
            return (
              <Card key={idx} className="flex flex-col gap-5 h-full" variant={agent.variant}>
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-lg bg-zinc-950 border border-zinc-800 ${agent.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-200 tracking-tight">
                      {agent.title}
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-500 font-sans font-bold">{agent.tag}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans mt-3 flex-1">
                  {agent.desc}
                </p>
                {agent.path && (
                  <Link href={agent.path} className="text-xs font-bold text-violet-450 hover:text-violet-300 flex items-center gap-1.5 hover:underline mt-auto pt-2 cursor-pointer">
                    Launch Dedicated Agent Portal <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center mb-20">
          <span className="text-sm text-violet-500 uppercase tracking-widest font-bold font-sans">Features Matrix</span>
          <h2 className="text-4xl font-extrabold mt-3 text-white tracking-tight">Core System Capabilities</h2>
          <p className="text-sm text-zinc-450 max-w-xl mx-auto mt-4">
            Polished digital frameworks optimized to identify and manage cybercrime vectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="flex flex-col gap-4 h-full justify-between" variant="violet">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <CheckCircle className="w-5.5 h-5.5 text-violet-400 shrink-0" />
                  <h3 className="text-sm font-bold text-zinc-250 uppercase tracking-wide">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  {feature.desc}
                </p>
              </div>
              <div className="text-xs font-sans text-zinc-550 uppercase tracking-widest border-t border-zinc-800/80 pt-4 mt-5">
                Liaison Connected
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE PREVIEW */}
      <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center mb-20">
          <span className="text-sm text-violet-500 uppercase tracking-widest font-bold">Pipeline Forensics</span>
          <h2 className="text-4xl font-extrabold mt-3 text-white tracking-tight">Visual Architecture Flow</h2>
          <p className="text-sm text-zinc-450 max-w-xl mx-auto mt-4">
            Understand how information streams ingest, process through AI nodes, and generate responses.
          </p>
        </div>

        <ArchitectureDiagram />
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-zinc-500">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-violet-500" />
            <span className="font-bold text-zinc-350 tracking-tight">Kavach AI Platform</span>
            <span className="text-xs text-zinc-650 font-bold">v1.2.0-STABLE</span>
          </div>

          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-500" /> SSL Encrypted
            </span>
            <span>© 2026 MINISTRY OF CYBER DEFENSE INCIDENT SIMULATION</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
