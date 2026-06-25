"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Cpu, Activity, AlertTriangle, Eye, Share2, Users, MapPin, Database, Send, Radio } from "lucide-react";

export default function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const dataStreams = [
    { id: "stream-1", name: "Citizen Reports", icon: Users, color: "text-violet-400" },
    { id: "stream-2", name: "Complaint Feeds", icon: Database, color: "text-indigo-400" },
    { id: "stream-3", name: "Transaction Registry", icon: Activity, color: "text-purple-400" },
  ];

  const agentNodes = [
    { id: "agent-1", name: "Vision Kavach", role: "Currency Scanning", icon: Eye, color: "text-emerald-400" },
    { id: "agent-2", name: "Network Kavach", role: "Graph Forensics", icon: Share2, color: "text-violet-400" },
    { id: "agent-3", name: "Citizen Kavach", role: "Threat Filtering", icon: Shield, color: "text-indigo-400" },
    { id: "agent-4", name: "Geo Kavach", role: "Hotspot Mapping", icon: MapPin, color: "text-amber-400" },
  ];

  const responseNodes = [
    { id: "resp-1", name: "Alert Center", icon: AlertTriangle, color: "text-red-400" },
    { id: "resp-2", name: "Jurisdiction Liaison", icon: Radio, color: "text-indigo-400" },
    { id: "resp-3", name: "Enforcement Sync", icon: Send, color: "text-purple-400" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4 overflow-hidden font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 items-center">
        {/* Column 1: Ingestion */}
        <div className="flex flex-col gap-4">
          <div className="text-center md:text-left mb-2">
            <span className="text-sm uppercase font-bold text-zinc-500 tracking-wider">Step 01</span>
            <h4 className="text-base font-bold text-zinc-300">Data Ingestion</h4>
          </div>
          {dataStreams.map((stream) => {
            const Icon = stream.icon;
            return (
              <motion.div
                key={stream.id}
                className={`bg-zinc-900/20 border rounded-xl p-4 cursor-pointer transition-all duration-300 flex items-center gap-3.5 ${
                  activeNode === stream.id
                    ? "border-violet-500/50 shadow-[0_4px_20px_rgba(139,92,246,0.05)] bg-zinc-900/60"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
                onMouseEnter={() => setActiveNode(stream.id)}
                onMouseLeave={() => setActiveNode(null)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`p-3 rounded-lg bg-zinc-950 border border-zinc-800 ${stream.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">{stream.name}</p>
                  <p className="text-xs text-zinc-500 font-sans font-medium">Raw ingestion pipeline</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Column 2: Orchestration */}
        <div className="flex flex-col items-center py-4">
          <div className="text-center mb-6">
            <span className="text-sm uppercase font-bold text-violet-500 tracking-wider">Step 02</span>
            <h4 className="text-base font-bold text-zinc-300">Orchestrator</h4>
          </div>
          <motion.div
            className={`w-full max-w-[180px] aspect-square rounded-xl border flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
              activeNode === "coordinator"
                ? "border-violet-500 bg-violet-955/15 shadow-[0_4px_30px_rgba(139,92,246,0.15)]"
                : "border-zinc-800 bg-zinc-900/30"
            }`}
            onMouseEnter={() => setActiveNode("coordinator")}
            onMouseLeave={() => setActiveNode(null)}
            whileHover={{ scale: 1.03 }}
          >
            <div className="p-3.5 rounded-full bg-zinc-950 border border-zinc-800 mb-3 relative">
              <Cpu className="w-7 h-7 text-violet-400" />
            </div>
            <h5 className="text-base font-bold text-zinc-100">Multi-Agent Coord</h5>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed font-medium">
              Telemetry sync & analysis director
            </p>
          </motion.div>
        </div>

        {/* Column 3: AI Agents */}
        <div className="flex flex-col gap-3">
          <div className="text-center md:text-left mb-2">
            <span className="text-sm uppercase font-bold text-zinc-500 tracking-wider">Step 03</span>
            <h4 className="text-base font-bold text-zinc-300">Intelligence Core</h4>
          </div>
          {agentNodes.map((agent) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                className={`bg-zinc-900/20 border rounded-xl p-3.5 cursor-pointer transition-all duration-300 flex items-center gap-3.5 ${
                  activeNode === agent.id
                    ? "border-violet-500/50 shadow-[0_4px_20px_rgba(139,92,246,0.05)] bg-zinc-900/60"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
                onMouseEnter={() => setActiveNode(agent.id)}
                onMouseLeave={() => setActiveNode(null)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 ${agent.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">{agent.name}</p>
                  <p className="text-xs text-zinc-500 font-medium">{agent.role}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Column 4: Responses */}
        <div className="flex flex-col gap-4">
          <div className="text-center md:text-left mb-2">
            <span className="text-sm uppercase font-bold text-zinc-500 tracking-wider">Step 04</span>
            <h4 className="text-base font-bold text-zinc-300">Response Routing</h4>
          </div>
          {responseNodes.map((resp) => {
            const Icon = resp.icon;
            return (
              <motion.div
                key={resp.id}
                className={`bg-zinc-900/20 border rounded-xl p-4 cursor-pointer transition-all duration-300 flex items-center gap-3.5 ${
                  activeNode === resp.id
                    ? "border-violet-500/50 shadow-[0_4px_20px_rgba(139,92,246,0.05)] bg-zinc-900/60"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
                onMouseEnter={() => setActiveNode(resp.id)}
                onMouseLeave={() => setActiveNode(null)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 ${resp.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">{resp.name}</p>
                  <p className="text-xs text-zinc-500 font-medium">Mitigation & Action</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SVG Flow Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block opacity-40 z-0">
        <path d="M 220 150 Q 300 150 360 220" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 220 220 Q 300 220 360 250" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 220 290 Q 300 290 360 280" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 520 250 Q 560 200 620 120" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 520 250 Q 580 230 620 190" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 520 255 Q 580 270 620 260" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 520 260 Q 560 300 620 330" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 780 120 Q 820 120 860 150" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 780 190 Q 820 210 860 220" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 780 260 Q 820 250 860 220" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
        <path d="M 780 330 Q 820 330 860 290" fill="none" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
