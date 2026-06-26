"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface OperationalFeed {
  id: string | number;
  time: string;
  message: string;
  type: "SUCCESS" | "ALERT";
}

export interface RecentAlert {
  id: string | number;
  time: string;
  type: string;
  score: string;
  status: string;
}

export interface KavachStats {
  activeThreats: number;
  reportsToday: number;
  counterfeitReports: number;
  riskClusters: number;
}

interface KavachContextType {
  operationalFeeds: OperationalFeed[];
  recentAlerts: RecentAlert[];
  stats: KavachStats;
  systemStress: boolean;
  addAlert: (
    feedMessage: string,
    feedType: "SUCCESS" | "ALERT",
    alertDetails?: { type: string; score: string; status: string }
  ) => void;
  toggleSystemStress: () => void;
  resetDatabase: () => void;
  surgeThreatFeed: () => void;
}

const defaultStats: KavachStats = {
  activeThreats: 142,
  reportsToday: 1482,
  counterfeitReports: 384,
  riskClusters: 4,
};

const initialFeeds: OperationalFeed[] = [
  { id: 1, time: "12:44", message: "Vision scan validated ₹500 note signature", type: "SUCCESS" },
  { id: 2, time: "12:35", message: "Network scan blocked mule cashout in Mewat", type: "ALERT" },
  { id: 3, time: "12:28", message: "Citizen filter blocked VoIP call clone voice", type: "ALERT" },
  { id: 4, time: "12:15", message: "Phishing registry block: india-post-tracking-service.com", type: "SUCCESS" },
  { id: 5, time: "12:02", message: "Audit log REP-001 successfully compiled for IFSO", type: "SUCCESS" },
];

const initialAlerts: RecentAlert[] = [
  { id: 1, time: "12:44", type: "Intaglio Counterfeit Scan", score: "99% Risk", status: "VERIFIED" },
  { id: 2, time: "12:35", type: "SBI Mule A/C Transaction", score: "96% Risk", status: "BLOCKED" },
  { id: 3, time: "12:28", type: "Synthetic Voice Spoof VoIP", score: "91% Risk", status: "INTERCEPTING" },
  { id: 4, time: "12:15", type: "Post Phishing Redirect", score: "74% Risk", status: "BLOCKED" },
  { id: 5, time: "11:58", type: "Electricity Bill Spam Link", score: "65% Risk", status: "ALERTED" },
];

const KavachContext = createContext<KavachContextType | undefined>(undefined);

export const KavachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operationalFeeds, setOperationalFeeds] = useState<OperationalFeed[]>(initialFeeds);
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>(initialAlerts);
  const [stats, setStats] = useState<KavachStats>(defaultStats);
  const [systemStress, setSystemStress] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load baseline from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedFeeds = localStorage.getItem("kavach_feeds");
        const storedAlerts = localStorage.getItem("kavach_alerts");
        const storedStats = localStorage.getItem("kavach_stats");
        const storedStress = localStorage.getItem("kavach_stress");

        if (storedFeeds) setOperationalFeeds(JSON.parse(storedFeeds));
        if (storedAlerts) setRecentAlerts(JSON.parse(storedAlerts));
        if (storedStats) setStats(JSON.parse(storedStats));
        if (storedStress) setSystemStress(JSON.parse(storedStress));
      } catch (err) {
        console.error("Error loading localStorage stats:", err);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("kavach_feeds", JSON.stringify(operationalFeeds));
      localStorage.setItem("kavach_alerts", JSON.stringify(recentAlerts));
      localStorage.setItem("kavach_stats", JSON.stringify(stats));
      localStorage.setItem("kavach_stress", JSON.stringify(systemStress));
    }
  }, [operationalFeeds, recentAlerts, stats, systemStress, isLoaded]);

  const addAlert = (
    feedMessage: string,
    feedType: "SUCCESS" | "ALERT",
    alertDetails?: { type: string; score: string; status: string }
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0].substring(0, 5);
    const newId = Date.now();

    // 1. Add to operational feed (scrolling logs)
    const newFeedItem: OperationalFeed = {
      id: newId,
      time: timeStr,
      message: feedMessage,
      type: feedType,
    };
    setOperationalFeeds((prev) => [newFeedItem, ...prev.slice(0, 9)]);

    // 2. Add to recent alerts table rows if it's an ALERT or alert details are explicitly provided
    if (feedType === "ALERT" || alertDetails) {
      const newAlertItem: RecentAlert = {
        id: newId + 1,
        time: timeStr,
        type: alertDetails?.type || "Security Outpost Catch",
        score: alertDetails?.score || "85% Risk",
        status: alertDetails?.status || "ALERTED",
      };
      setRecentAlerts((prev) => [newAlertItem, ...prev.slice(0, 9)]);
    }

    // 3. Update stats counters
    setStats((prev) => {
      const isCounterfeit =
        (alertDetails && alertDetails.type.toLowerCase().includes("counterfeit")) ||
        feedMessage.toLowerCase().includes("counterfeit");

      return {
        ...prev,
        reportsToday: prev.reportsToday + 1,
        activeThreats: feedType === "ALERT" ? prev.activeThreats + 1 : prev.activeThreats,
        counterfeitReports: isCounterfeit ? prev.counterfeitReports + 1 : prev.counterfeitReports,
      };
    });
  };

  const toggleSystemStress = () => {
    setSystemStress((prev) => !prev);
  };

  const resetDatabase = () => {
    setOperationalFeeds(initialFeeds);
    setRecentAlerts(initialAlerts);
    setStats(defaultStats);
    setSystemStress(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("kavach_feeds");
      localStorage.removeItem("kavach_alerts");
      localStorage.removeItem("kavach_stats");
      localStorage.removeItem("kavach_stress");
    }
  };

  const surgeThreatFeed = () => {
    const surgeAlerts = [
      {
        message: "Mule cashout surge detected in Nuh-Mewat cluster",
        type: "ALERT" as const,
        alert: { type: "Bulk Mule Cashout", score: "97% Risk", status: "BLOCKED" },
      },
      {
        message: "VoIP gateway intercepted 40 simultaneous spoof calls",
        type: "ALERT" as const,
        alert: { type: "Voice Spoof Cascade", score: "94% Risk", status: "INTERCEPTING" },
      },
      {
        message: "Vision scan logged Counterfeit ₹500 banknote at Vadodara cybercell",
        type: "ALERT" as const,
        alert: { type: "Intaglio Foil Scan", score: "98% Risk", status: "VERIFIED" },
      },
    ];

    surgeAlerts.forEach((sa, idx) => {
      setTimeout(() => {
        addAlert(sa.message, sa.type, sa.alert);
      }, idx * 600);
    });
  };

  return (
    <KavachContext.Provider
      value={{
        operationalFeeds,
        recentAlerts,
        stats,
        systemStress,
        addAlert,
        toggleSystemStress,
        resetDatabase,
        surgeThreatFeed,
      }}
    >
      {children}
    </KavachContext.Provider>
  );
};

export const useKavach = () => {
  const context = useContext(KavachContext);
  if (context === undefined) {
    throw new Error("useKavach must be used within a KavachProvider");
  }
  return context;
};
