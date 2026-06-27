"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Globe, Clock, RefreshCw, Server, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Hotspot {
  id: string;
  name: string;
  state: string;
  activeComplaints: number;
  threatLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  primaryThreat: string;
  policeCoop: string;
  coords: [number, number];
}

interface Incident {
  id: string;
  time: string;
  location: string;
  type: string;
  volume: string;
  status: "BLOCKED" | "INTERCEPTING" | "ALERTED";
}

const initialHotspots: Hotspot[] = [
  {
    id: "mewat",
    name: "Mewat Region",
    state: "Haryana / Rajasthan Border",
    activeComplaints: 412,
    threatLevel: "CRITICAL",
    primaryThreat: "VoIP Spoofing & Threat Calls",
    policeCoop: "Nuh Cyber Cell Liaison (Active)",
    coords: [27.9152, 77.0181],
  },
  {
    id: "jamtara",
    name: "Jamtara Hub",
    state: "Jharkhand",
    activeComplaints: 289,
    threatLevel: "HIGH",
    primaryThreat: "KYC Phishing Links",
    policeCoop: "Jharkhand Cyber Taskforce (Integrated)",
    coords: [23.9620, 86.8028],
  },
  {
    id: "kolkata",
    name: "Kolkata Call Ring",
    state: "West Bengal",
    activeComplaints: 341,
    threatLevel: "HIGH",
    primaryThreat: "Courier & Customs Impersonation",
    policeCoop: "Bidhannagar Police Cyber Wing (Active)",
    coords: [22.5726, 88.3639],
  },
  {
    id: "delhi",
    name: "NCR Gateway Network",
    state: "Delhi NCR",
    activeComplaints: 521,
    threatLevel: "CRITICAL",
    primaryThreat: "Mule Bank Aggregators & IB Gateways",
    policeCoop: "Delhi Police IFSO (Direct Link)",
    coords: [28.6139, 77.2090],
  },
];

export default function GeoPanel() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(initialHotspots[0]);
  const [hotspotsList, setHotspotsList] = useState<Hotspot[]>(initialHotspots);
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: "INC-9281", time: "10s ago", location: "Jamtara, JH", type: "KYC Phishing SMS", volume: "₹1.4L", status: "BLOCKED" },
    { id: "INC-9282", time: "1m ago", location: "Nuh, HR", type: "Digital Arrest Call", volume: "₹18.0L", status: "INTERCEPTING" },
    { id: "INC-9283", time: "3m ago", location: "Kolkata, WB", type: "Mule Account Cashout", volume: "₹4.5L", status: "BLOCKED" },
    { id: "INC-9284", time: "5m ago", location: "Bengaluru, KA", type: "Synthetic Voice Spoof", volume: "₹2.2L", status: "ALERTED" },
    { id: "INC-9285", time: "7m ago", location: "Ahmedabad, GJ", type: "Courier Customs Scam", volume: "₹8.0L", status: "BLOCKED" },
  ]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // 1. Get browser geolocation and reverse geocode
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
            headers: {
              "User-Agent": "KavachAI-HackathonDemo/1.0"
            }
          })
            .then((res) => {
              if (!res.ok) throw new Error("Reverse geocoding error");
              return res.json();
            })
            .then((data) => {
              const cityName = data.address?.city || data.address?.town || data.address?.village || "Local Outpost";
              const stateName = data.address?.state || "Your Region";
              
              const userHotspot: Hotspot = {
                id: "user-node",
                name: `${cityName} Outpost`,
                state: stateName,
                activeComplaints: 5,
                threatLevel: "MEDIUM",
                primaryThreat: "Scan logs clear (Active Outpost)",
                policeCoop: "Local Cybercell Link Active",
                coords: [latitude, longitude],
              };
              
              setHotspotsList((prev) => {
                if (prev.some(h => h.id === "user-node")) return prev;
                return [userHotspot, ...prev];
              });
              setSelectedHotspot(userHotspot);
            })
            .catch(() => {
              const userHotspot: Hotspot = {
                id: "user-node",
                name: "Local Outpost",
                state: "Your Region",
                activeComplaints: 5,
                threatLevel: "MEDIUM",
                primaryThreat: "Scan logs clear (Active Outpost)",
                policeCoop: "Local Cybercell Link Active",
                coords: [latitude, longitude],
              };
              setHotspotsList((prev) => {
                if (prev.some(h => h.id === "user-node")) return prev;
                return [userHotspot, ...prev];
              });
              setSelectedHotspot(userHotspot);
            });
        },
        (error) => {
          console.warn("Geolocation in GeoPanel failed:", error);
        }
      );
    }
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Dark map centered on India
    const map = L.map(mapContainerRef.current, {
      center: [21.7679, 78.8718],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 3. Render Markers & Keep Synced
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    hotspotsList.forEach((hs) => {
      const isSelected = selectedHotspot?.id === hs.id;
      const isCritical = hs.threatLevel === "CRITICAL";
      const isHigh = hs.threatLevel === "HIGH";
      
      const color = isCritical ? "#ef4444" : isHigh ? "#f59e0b" : "#a78bfa";
      const ringColor = isCritical ? "rgba(239, 68, 68, 0.4)" : isHigh ? "rgba(245, 158, 11, 0.4)" : "rgba(167, 139, 250, 0.4)";
      
      const size = isSelected ? 24 : 16;
      const offset = size / 2;
      const coreSize = isSelected ? 10 : 6;
      const coreOffset = (size - coreSize) / 2;

      const html = `
        <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
          <div class="ping-ring-class" style="position: absolute; width: ${size}px; height: ${size}px; border-radius: 50%; background-color: ${ringColor}; border: 1px solid ${color}; top: 0; left: 0;"></div>
          <div style="position: absolute; width: ${coreSize}px; height: ${coreSize}px; border-radius: 50%; background-color: ${color}; border: 1.5px solid #09090b; top: ${coreOffset}px; left: ${coreOffset}px;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: "custom-dashboard-marker",
        iconSize: [size, size],
        iconAnchor: [offset, offset]
      });

      const marker = L.marker(hs.coords, { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedHotspot(hs);
        const targetZoom = hs.id === "user-node" ? 9 : 5;
        map.setView(hs.coords, targetZoom, { animate: true });
      });

      markersRef.current[hs.id] = marker;
    });
  }, [hotspotsList, selectedHotspot]);

  // 4. Center map when selectedHotspot changes externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedHotspot) return;

    const targetZoom = selectedHotspot.id === "user-node" ? 9 : 5;
    map.setView(selectedHotspot.coords, targetZoom, { animate: true });
  }, [selectedHotspot]);

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
              {hotspotsList.map((hs) => (
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
                        ? "text-red-400 bg-red-955/20 border-red-900/25"
                        : hs.threatLevel === "HIGH"
                        ? "text-amber-400 bg-amber-955/20 border-amber-900/25"
                        : "text-violet-400 bg-violet-955/20 border-violet-900/25"
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
                  <span className="text-xs text-zinc-550 font-bold uppercase">Primary Vector</span>
                  <span className="text-sm font-bold text-zinc-300">{selectedHotspot.primaryThreat}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                  <span className="text-xs text-zinc-550 font-bold uppercase">Active Cases</span>
                  <span className="text-sm font-bold text-violet-400">{selectedHotspot.activeComplaints} records</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                  <span className="text-xs text-zinc-550 font-bold uppercase">Jurisdiction Outpost</span>
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
            {/* Real Interactive Leaflet Map showing nearby area */}
            <div className="md:col-span-7 bg-zinc-950/40 border border-zinc-900 rounded-xl overflow-hidden relative min-h-[280px] z-10">
              <div ref={mapContainerRef} className="w-full h-full min-h-[280px]" />
              
              {/* Dynamic Coordinate details Overlay */}
              <div className="absolute top-3 left-3 z-[400] pointer-events-none flex flex-col gap-1 font-mono text-[9px] text-zinc-550 bg-zinc-950/90 px-2 py-1.5 rounded border border-zinc-900/60 backdrop-blur">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.2 h-1.2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-350 font-bold">GRID: ONLINE</span>
                </div>
                <div>
                  {selectedHotspot
                    ? `${selectedHotspot.coords[0].toFixed(3)}° N, ${selectedHotspot.coords[1].toFixed(3)}° E`
                    : "21.767° N, 78.871° E"}
                </div>
              </div>
            </div>

            {/* Live streaming Feed */}
            <div className="md:col-span-5 flex flex-col justify-between bg-zinc-950/30 rounded-xl border border-zinc-900 p-4 font-sans text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-zinc-300 font-bold border-b border-zinc-800 pb-3 mb-3">
                <Server className="w-5 h-5 text-violet-400 animate-pulse" />
                <span className="text-sm font-bold">Live Complaint Stream</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[240px] pr-1 font-sans">
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
                    <div className="flex justify-between items-center mt-1 border-t border-zinc-800/60 pt-2 font-sans">
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
