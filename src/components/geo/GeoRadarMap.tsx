"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface CityData {
  id: string;
  name: string;
  state: string;
  activeComplaints: number;
  threatLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  primaryThreat: string;
  policeCoop: string;
  coords: [number, number]; // [lat, lng]
}

interface GeoRadarMapProps {
  cities: CityData[];
  selectedCity: CityData | null;
  onSelectCity: (city: CityData) => void;
}

export default function GeoRadarMap({ cities, selectedCity, onSelectCity }: GeoRadarMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // 1. Inject custom ping animation styles
  useEffect(() => {
    const styleId = "leaflet-custom-ping-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes leaflet-ping {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.0); opacity: 0; }
        }
        .ping-ring-class {
          animation: leaflet-ping 1.6s ease-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize leaflet map targeting India
    const map = L.map(mapContainerRef.current, {
      center: [21.7679, 78.8718],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark Matter tile layer from CartoDB
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Clean up on unmount
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

    cities.forEach((city) => {
      // Set color indicators based on threat level
      const color = 
        city.threatLevel === "CRITICAL" 
          ? "#ef4444" // Red
          : city.threatLevel === "HIGH" 
          ? "#f59e0b" // Amber
          : city.threatLevel === "MEDIUM" 
          ? "#fb923c" // Orange
          : "#a78bfa"; // Violet

      const ringColor = 
        city.threatLevel === "CRITICAL" 
          ? "rgba(239, 68, 68, 0.4)" 
          : city.threatLevel === "HIGH" 
          ? "rgba(245, 158, 11, 0.4)" 
          : city.threatLevel === "MEDIUM" 
          ? "rgba(251, 146, 60, 0.4)" 
          : "rgba(167, 139, 250, 0.4)";

      const isSelected = selectedCity?.id === city.id;
      const pulseSize = isSelected ? 30 : 20;
      const coreSize = isSelected ? 12 : 8;
      const offsetTop = (pulseSize - coreSize) / 2;

      // HTML template for pulsing radar marker
      const html = `
        <div style="position: relative; width: ${pulseSize}px; height: ${pulseSize}px; display: flex; align-items: center; justify-content: center;">
          <div class="ping-ring-class" style="position: absolute; width: ${pulseSize}px; height: ${pulseSize}px; border-radius: 50%; background-color: ${ringColor}; border: 1.5px solid ${color}; top: 0; left: 0;"></div>
          <div style="position: absolute; width: ${coreSize}px; height: ${coreSize}px; border-radius: 50%; background-color: ${color}; border: 2px solid #09090b; top: ${offsetTop}px; left: ${offsetTop}px; box-shadow: 0 0 12px ${color};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: "custom-leaflet-pulse-marker",
        iconSize: [pulseSize, pulseSize],
        iconAnchor: [pulseSize / 2, pulseSize / 2],
      });

      const marker = L.marker(city.coords, { icon: customIcon }).addTo(map);

      // Create high-tech popups
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 6px; border-radius: 8px; font-size: 11px; color: #d4d4d8;">
          <span style="font-weight: 800; font-size: 13px; color: #f4f4f5; display: block; margin-bottom: 4px;">${city.name}</span>
          <span style="color: #71717a; font-weight: 700; text-transform: uppercase;">Threat Level:</span> 
          <span style="color: ${color}; font-weight: 800;">${city.threatLevel}</span><br/>
          <span style="color: #71717a; font-weight: 700; text-transform: uppercase;">Active cases:</span> 
          <span style="color: #a78bfa; font-weight: 800;">${city.activeComplaints} logs</span>
        </div>
      `;
      marker.bindPopup(popupHtml, {
        closeButton: false,
        className: "leaflet-command-center-popup",
      });

      marker.on("click", () => {
        onSelectCity(city);
        map.setView(city.coords, 6, { animate: true });
      });

      markersRef.current[city.id] = marker;
    });
  }, [cities, selectedCity, onSelectCity]);

  // 4. Center map when selectedCity changes externally
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCity) return;

    const marker = markersRef.current[selectedCity.id];
    if (marker) {
      marker.openPopup();
      map.setView(selectedCity.coords, 6, { animate: true });
    }
  }, [selectedCity]);

  return (
    <div className="w-full h-full relative border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
      {/* Map Target Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-10" />

      {/* Stylized UI map overlays */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-2 font-mono text-[10px] text-zinc-550 bg-zinc-950/80 p-3 rounded-lg border border-zinc-900/60 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-350 font-bold">GRID SYNC: ONLINE</span>
        </div>
        <div>COORDS: 21.7679° N, 78.8718° E</div>
        <div>RADAR RANGE: NATIONAL</div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex gap-4 bg-zinc-950/80 p-3 rounded-lg border border-zinc-900/60 backdrop-blur font-sans text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_6px_#fb923c]" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa]" />
          <span>Low</span>
        </div>
      </div>
    </div>
  );
}
