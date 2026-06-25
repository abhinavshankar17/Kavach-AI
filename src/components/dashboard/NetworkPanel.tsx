"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Activity, ChevronRight, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface SyndicateNode {
  id: string;
  label: string;
  type: "mule_bank" | "phone_sim" | "gateway" | "holder";
  x: number;
  y: number;
  info: string;
  details: Record<string, string>;
}

interface Syndicate {
  id: string;
  name: string;
  volume: string;
  risk: "CRITICAL" | "HIGH" | "MEDIUM";
  activeCases: number;
  nodes: SyndicateNode[];
  edges: [string, string][];
  chartData: { month: string; volume: number }[];
}

export default function NetworkPanel() {
  const [selectedSyndicate, setSelectedSyndicate] = useState<string>("mewat-spoof");
  const [selectedNode, setSelectedNode] = useState<SyndicateNode | null>(null);

  const syndicates: Record<string, Syndicate> = {
    "mewat-spoof": {
      id: "mewat-spoof",
      name: "Mewat Spoofed VoIP Network",
      volume: "₹42.8 Cr",
      risk: "CRITICAL",
      activeCases: 142,
      chartData: [
        { month: "Jan", volume: 12 },
        { month: "Feb", volume: 18 },
        { month: "Mar", volume: 24 },
        { month: "Apr", volume: 30 },
        { month: "May", volume: 38 },
        { month: "Jun", volume: 42.8 },
      ],
      nodes: [
        { id: "root", label: "VoIP Gateway #092", type: "gateway", x: 200, y: 150, info: "Spoofed Router - Mewat Sector", details: { "IP Address": "103.241.12.89", "Carrier": "Virtual SIP India", "Ping Location": "Nuh, Haryana", "Detected Links": "14 SIP trunks" } },
        { id: "mule1", label: "SBI Mule A/C **2919", type: "mule_bank", x: 100, y: 80, info: "Mule Account - State Bank of India", details: { "A/C Holder": "R. Sharma (Synthetic)", "IFSC": "SBIN000428", "Branch": "Gurugram Sec 14", "Daily Volume": "₹12.4 Lakhs" } },
        { id: "mule2", label: "HDFC Mule A/C **8812", type: "mule_bank", x: 100, y: 220, info: "Mule Account - HDFC Bank", details: { "A/C Holder": "M. Khan (Compromised)", "IFSC": "HDFC000109", "Branch": "Alwar Main", "Daily Volume": "₹8.9 Lakhs" } },
        { id: "sim1", label: "SIM Identity +91 987..", type: "phone_sim", x: 300, y: 80, info: "VoIP Mobile Identity", details: { "IMEI": "358918293819283", "Provider": "Jio Pre-active", "Registration": "Guwahati Retailer", "Risk Level": "High Risk Caller" } },
        { id: "sim2", label: "SIM Identity +91 701..", type: "phone_sim", x: 300, y: 220, info: "VoIP Mobile Identity", details: { "IMEI": "862910283018273", "Provider": "Airtel Dummy", "Registration": "Patna Distributor", "Risk Level": "High Risk Caller" } },
      ],
      edges: [
        ["root", "mule1"],
        ["root", "mule2"],
        ["root", "sim1"],
        ["root", "sim2"],
      ],
    },
    "jamtara-mule": {
      id: "jamtara-mule",
      name: "Jamtara KYC Phishing Syndicate",
      volume: "₹18.2 Cr",
      risk: "HIGH",
      activeCases: 89,
      chartData: [
        { month: "Jan", volume: 6 },
        { month: "Feb", volume: 9 },
        { month: "Mar", volume: 11 },
        { month: "Apr", volume: 14 },
        { month: "May", volume: 16.5 },
        { month: "Jun", volume: 18.2 },
      ],
      nodes: [
        { id: "root", label: "Mule Aggregator Node", type: "holder", x: 200, y: 150, info: "Mule Master wallet", details: { "Wallet Type": "USDT Peer-to-Peer", "Linked Cards": "24 Visa Prepaid", "Tx Velocity": "High Flow Rate", "Est. Custody": "₹3.2 Cr" } },
        { id: "mule1", label: "ICICI Mule A/C **4560", type: "mule_bank", x: 90, y: 90, info: "Mule Account - ICICI Bank", details: { "A/C Holder": "V. Patel (Stolen ID)", "IFSC": "ICIC000008", "Branch": "Jamtara Bazar", "Daily Flow": "₹4.1 Lakhs" } },
        { id: "sim1", label: "Phish Line +91 809..", type: "phone_sim", x: 310, y: 90, info: "SMS Phishing Gateway", details: { "IMSI": "404450912384918", "Gateway": "SMS Bulk Send API", "Msg Content": "Electricity bill alert", "Flags": "Fraudulent Link Spammer" } },
        { id: "sim2", label: "Phish Line +91 912..", type: "phone_sim", x: 310, y: 210, info: "SMS Phishing Gateway", details: { "IMSI": "404450912384992", "Gateway": "Twilio Proxy Hook", "Msg Content": "PAN KYC Update Alert", "Flags": "High Threat URL Distributor" } },
      ],
      edges: [
        ["root", "mule1"],
        ["root", "sim1"],
        ["root", "sim2"],
      ],
    },
  };

  const currentSyndicate = syndicates[selectedSyndicate];

  const handleNodeClick = (node: SyndicateNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Syndicate Select & Metadata */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card variant="zinc" className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-2">
            <div className="flex items-center gap-2.5">
              <Share2 className="w-5.5 h-5.5 text-violet-400" />
              <span className="font-bold text-base text-zinc-100">Network Link Analysis</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Map financial transaction pathways, phone-line routers, and synthetic bank mule accounts to evaluate threat networks.
          </p>

          <div className="flex flex-col gap-3.5 mt-2">
            <label className="text-xs text-zinc-550 font-bold uppercase tracking-wider">Syndicate Targets</label>
            {Object.values(syndicates).map((syn) => (
              <button
                key={syn.id}
                onClick={() => {
                  setSelectedSyndicate(syn.id);
                  setSelectedNode(null);
                }}
                className={`p-4 rounded-xl border text-left font-sans transition-all duration-300 flex justify-between items-center cursor-pointer ${
                  selectedSyndicate === syn.id
                    ? "border-violet-500/50 bg-violet-950/15 text-violet-400 font-bold"
                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 text-zinc-450"
                }`}
              >
                <div>
                  <div className="text-base font-bold">{syn.name}</div>
                  <div className="text-sm text-zinc-550 mt-1 font-sans">Est. Volume: {syn.volume}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded border ${
                      syn.risk === "CRITICAL"
                        ? "text-red-400 bg-red-950/40 border-red-900/30"
                        : "text-amber-400 bg-amber-950/40 border-amber-900/30"
                    }`}
                  >
                    {syn.risk}
                  </span>
                  <ChevronRight className="w-4.5 h-4.5 opacity-55 text-zinc-400" />
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Syndicate Analytics */}
        <Card variant="zinc" className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-3 mb-1">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <span className="font-bold text-sm text-zinc-200">Loss Flow Trajectory</span>
          </div>
          <div className="h-[140px] w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentSyndicate.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="fraudColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                  labelStyle={{ color: "#a1a1aa", fontSize: "11px" }}
                  itemStyle={{ color: "#d8b4fe", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#fraudColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Interactive Visual SVG Graph */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card variant="violet" className="flex-1 flex flex-col justify-between min-h-[450px] relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5.5 h-5.5 text-violet-400 animate-pulse" />
              <span className="font-bold text-sm text-zinc-200">
                Network Node Viewer (Click node to inspect)
              </span>
            </div>
            <span className="text-xs text-zinc-500 font-bold">[Nodes Connected: {currentSyndicate.nodes.length}]</span>
          </div>

          {/* Interactive Graph Canvas */}
          <div className="flex-1 w-full min-h-[280px] relative bg-zinc-950/30 rounded-xl border border-zinc-900 my-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 300" className="w-full max-w-[460px] aspect-[4/3] relative z-10">
              {/* Lines */}
              {currentSyndicate.edges.map(([fromId, toId], idx) => {
                const fromNode = currentSyndicate.nodes.find((n) => n.id === fromId);
                const toNode = currentSyndicate.nodes.find((n) => n.id === toId);
                if (!fromNode || !toNode) return null;

                const isHighlighted =
                  selectedNode && (selectedNode.id === fromId || selectedNode.id === toId);

                return (
                  <motion.line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isHighlighted ? "#8b5cf6" : "rgba(255, 255, 255, 0.08)"}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                );
              })}

              {/* Node Circles */}
              {currentSyndicate.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isRoot = node.type === "gateway" || node.type === "holder";

                return (
                  <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={isRoot ? 11 : 8}
                      fill={isRoot ? "#27272a" : "#18181b"}
                      stroke={
                        isSelected
                          ? "#8b5cf6"
                          : node.type === "gateway"
                          ? "#ef4444"
                          : node.type === "mule_bank"
                          ? "#a78bfa"
                          : "#10b981"
                      }
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      whileHover={{ scale: 1.25 }}
                    />
                    <text
                      x={node.x}
                      y={node.y + (isRoot ? 22 : 18)}
                      textAnchor="middle"
                      fill={isSelected ? "#c084fc" : "#a1a1aa"}
                      fontSize={10}
                      fontWeight={600}
                      className="select-none pointer-events-none font-sans"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node Details Inspection Board */}
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border-t border-zinc-800 p-5 bg-zinc-950/40 text-xs"
              >
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-100 text-base">{selectedNode.label} Properties</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{selectedNode.type}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-4 font-medium">{selectedNode.info}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
                  {Object.entries(selectedNode.details).map(([key, val]) => (
                    <div key={key} className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{key}</span>
                      <span className="text-sm font-extrabold text-zinc-300">{val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="border-t border-zinc-800 p-5 bg-zinc-950/10 text-center text-sm text-zinc-550 py-8 font-sans">
                Select any network node in the graphic area to verify transaction logs and database parameters.
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
