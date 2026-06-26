export interface NetworkEntity {
  id: string;
  label: string;
  type: "Victim" | "Phone Number" | "UPI ID" | "Bank Account" | "Device";
  clusterId: "Cluster J-1: Jamtara Phishing" | "Cluster M-2: Mewat VoIP" | "Cluster D-3: Delhi Mules";
  risk: number;
  connections: number;
  reports: string;
  ipAddress?: string;
  coordinates?: string;
}

export const mockEntities: NetworkEntity[] = [
  // Cluster J-1: Jamtara Phishing Ring (18 entities)
  { id: "node-j-1", label: "USDT Aggregator Master", type: "Bank Account", clusterId: "Cluster J-1: Jamtara Phishing", risk: 96, connections: 8, reports: "Primary escrow vault converting cash flows to P2P stablecoins. Traced under Stolen IDs.", ipAddress: "103.45.192.12" },
  { id: "node-j-2", label: "ICICI Mule A/C **4560", type: "Bank Account", clusterId: "Cluster J-1: Jamtara Phishing", risk: 85, connections: 4, reports: "Mule cashout branch located in Jamtara Bazar. High velocity transfer spikes.", ipAddress: "103.45.192.15" },
  { id: "node-j-3", label: "HDFC Mule A/C **2211", type: "Bank Account", clusterId: "Cluster J-1: Jamtara Phishing", risk: 78, connections: 3, reports: "Aggressive cash withdrawal sequence flagged via ATMs in Dhanbad.", ipAddress: "103.45.192.18" },
  { id: "node-j-4", label: "Phish Line +91 8092...", type: "Phone Number", clusterId: "Cluster J-1: Jamtara Phishing", risk: 92, connections: 6, reports: "Gateway calling line distributing bulk SMS alerts for PAN card updates.", coordinates: "24.12N, 86.65E" },
  { id: "node-j-5", label: "Phish Line +91 9128...", type: "Phone Number", clusterId: "Cluster J-1: Jamtara Phishing", risk: 88, connections: 5, reports: "VoIP routed spam line simulating utility bill emergency cuts.", coordinates: "24.13N, 86.66E" },
  { id: "node-j-6", label: "Xiaomi Redmi 9 Active", type: "Device", clusterId: "Cluster J-1: Jamtara Phishing", risk: 94, connections: 4, reports: "Hardware device hosting 12 dummy SIM cards connected to SMS gateways.", ipAddress: "192.168.43.12" },
  { id: "node-j-7", label: "Samsung Galaxy M12", type: "Device", clusterId: "Cluster J-1: Jamtara Phishing", risk: 82, connections: 3, reports: "Traced under coordinate grids linking active calling spots in Karmatand.", ipAddress: "192.168.43.18" },
  { id: "node-j-8", label: "UPI: payment.rbi@okicici", type: "UPI ID", clusterId: "Cluster J-1: Jamtara Phishing", risk: 95, connections: 5, reports: "Spoofed government support service ID used to divert credit audits.", ipAddress: "10.220.12.89" },
  { id: "node-j-9", label: "UPI: verification.nsa@okaxis", type: "UPI ID", clusterId: "Cluster J-1: Jamtara Phishing", risk: 91, connections: 4, reports: "Fraudulent verification target routing consumer balances to stablecoin escrow.", ipAddress: "10.220.12.92" },
  { id: "node-j-10", label: "S. Gopal (Victim)", type: "Victim", clusterId: "Cluster J-1: Jamtara Phishing", risk: 10, connections: 2, reports: "Retired banker targeted under Aadhaar validation scan scare. Lost ₹8.4L." },
  { id: "node-j-11", label: "M. Das (Victim)", type: "Victim", clusterId: "Cluster J-1: Jamtara Phishing", risk: 8, connections: 2, reports: "Small retailer targeted under mock electricity suspension text. Lost ₹1.8L." },
  { id: "node-j-12", label: "R. Sen (Victim)", type: "Victim", clusterId: "Cluster J-1: Jamtara Phishing", risk: 12, connections: 2, reports: "Student defrauded under false online customs delivery fee. Lost ₹45K." },
  { id: "node-j-13", label: "J-Phone 3 +91 7004...", type: "Phone Number", clusterId: "Cluster J-1: Jamtara Phishing", risk: 74, connections: 2, reports: "Secondary backup call line for victim callbacks.", coordinates: "24.11N, 86.64E" },
  { id: "node-j-14", label: "J-Phone 4 +91 8899...", type: "Phone Number", clusterId: "Cluster J-1: Jamtara Phishing", risk: 65, connections: 2, reports: "Auxiliary coordinate SMS target.", coordinates: "24.14N, 86.67E" },
  { id: "node-j-15", label: "J-UPI: support.pay@paytm", type: "UPI ID", clusterId: "Cluster J-1: Jamtara Phishing", risk: 79, connections: 2, reports: "Generic mock support address.", ipAddress: "10.220.12.98" },
  { id: "node-j-16", label: "J-UPI: rewards.online@ybl", type: "UPI ID", clusterId: "Cluster J-1: Jamtara Phishing", risk: 84, connections: 2, reports: "Lottery spam target wallet.", ipAddress: "10.220.13.02" },
  { id: "node-j-17", label: "J-Mule 3 AXIS **9012", type: "Bank Account", clusterId: "Cluster J-1: Jamtara Phishing", risk: 72, connections: 2, reports: "Secondary tier-2 cash transfer escrow.", ipAddress: "103.45.192.22" },
  { id: "node-j-18", label: "Realme C11 Device", type: "Device", clusterId: "Cluster J-1: Jamtara Phishing", risk: 68, connections: 2, reports: "Coordinates trace to rural border towers.", ipAddress: "192.168.43.25" },

  // Cluster M-2: Mewat VoIP Ring (16 entities)
  { id: "node-m-1", label: "VoIP Gateway Router #092", type: "Device", clusterId: "Cluster M-2: Mewat VoIP", risk: 98, connections: 10, reports: "Primary SIP gateway spoofing government outposts. Located in Nuh, Haryana.", ipAddress: "103.241.12.89" },
  { id: "node-m-2", label: "SIM Trunk Line +91 9871...", type: "Phone Number", clusterId: "Cluster M-2: Mewat VoIP", risk: 92, connections: 5, reports: "Virtual identity SIP trunk originating call campaigns for digital arrests.", coordinates: "28.11N, 77.01E" },
  { id: "node-m-3", label: "SIM Trunk Line +91 7014...", type: "Phone Number", clusterId: "Cluster M-2: Mewat VoIP", risk: 89, connections: 4, reports: "Pre-activated GSM line linked to synthetic caller profiles.", coordinates: "28.12N, 77.02E" },
  { id: "node-m-4", label: "SBI Mule A/C **2919", type: "Bank Account", clusterId: "Cluster M-2: Mewat VoIP", risk: 91, connections: 5, reports: "Primary cashout target for Mewat spoof campaigns. Traced under R. Sharma.", ipAddress: "103.241.13.11" },
  { id: "node-m-5", label: "HDFC Mule A/C **8812", type: "Bank Account", clusterId: "Cluster M-2: Mewat VoIP", risk: 86, connections: 4, reports: "Stolen identity cashout account holding temporary escrow margins.", ipAddress: "103.241.13.15" },
  { id: "node-m-6", label: "K. Sharma (Victim)", type: "Victim", clusterId: "Cluster M-2: Mewat VoIP", risk: 15, connections: 2, reports: "Homemaker threatened with fake CBI drug packet link. Coerced into transfer. Lost ₹12.4L." },
  { id: "node-m-7", label: "Dr. A. Verma (Victim)", type: "Victim", clusterId: "Cluster M-2: Mewat VoIP", risk: 18, connections: 2, reports: "Physician held on video call for 36 hours. Defrauded of ₹18.0L." },
  { id: "node-m-8", label: "UPI: escrowsbi@okaxis", type: "UPI ID", clusterId: "Cluster M-2: Mewat VoIP", risk: 93, connections: 4, reports: "Direct UPI payment handle used to channel coerced transfers.", ipAddress: "10.150.88.12" },
  { id: "node-m-9", label: "UPI: customduty@oksbi", type: "UPI ID", clusterId: "Cluster M-2: Mewat VoIP", risk: 87, connections: 3, reports: "Customs threat redirect payment handle.", ipAddress: "10.150.88.16" },
  { id: "node-m-10", label: "M-Phone 3 +91 9910...", type: "Phone Number", clusterId: "Cluster M-2: Mewat VoIP", risk: 72, connections: 2, reports: "Secondary backup VoIP connection.", coordinates: "28.10N, 77.00E" },
  { id: "node-m-11", label: "M-Phone 4 +91 7827...", type: "Phone Number", clusterId: "Cluster M-2: Mewat VoIP", risk: 65, connections: 2, reports: "Backup GSM target in Nuh sector.", coordinates: "28.13N, 77.03E" },
  { id: "node-m-12", label: "M-Mule 3 ICICI **8122", type: "Bank Account", clusterId: "Cluster M-2: Mewat VoIP", risk: 79, connections: 2, reports: "Secondary tier-2 cashout node.", ipAddress: "103.241.13.20" },
  { id: "node-m-13", label: "M-Mule 4 PNB **4910", type: "Bank Account", clusterId: "Cluster M-2: Mewat VoIP", risk: 68, connections: 2, reports: "Secondary cash aggregator.", ipAddress: "103.241.13.25" },
  { id: "node-m-14", label: "OnePlus Nord CE Device", type: "Device", clusterId: "Cluster M-2: Mewat VoIP", risk: 81, connections: 2, reports: "Coordinate trace maps to VoIP gateway endpoints.", ipAddress: "192.168.1.45" },
  { id: "node-m-15", label: "M-UPI: securefee@ybl", type: "UPI ID", clusterId: "Cluster M-2: Mewat VoIP", risk: 73, connections: 2, reports: "Payment aggregator handle.", ipAddress: "10.150.88.22" },
  { id: "node-m-16", label: "M-UPI: clearance@paytm", type: "UPI ID", clusterId: "Cluster M-2: Mewat VoIP", risk: 70, connections: 2, reports: "Clearance scam wallet.", ipAddress: "10.150.88.26" },

  // Cluster D-3: Delhi Mules (16 entities)
  { id: "node-d-1", label: "P2P Crypto Wallet Master", type: "Device", clusterId: "Cluster D-3: Delhi Mules", risk: 97, connections: 9, reports: "Crypto offramp wallet transferring bulk INR to digital stablecoins. Traced to Delhi NCR.", ipAddress: "185.120.44.89" },
  { id: "node-d-2", label: "P2P Agent Phone +91 9999...", type: "Phone Number", clusterId: "Cluster D-3: Delhi Mules", risk: 90, connections: 5, reports: "WhatsApp registration coordinates for P2P transaction matching.", coordinates: "28.61N, 77.23E" },
  { id: "node-d-3", label: "P2P Agent Phone +91 8888...", type: "Phone Number", clusterId: "Cluster D-3: Delhi Mules", risk: 84, connections: 4, reports: "Secondary chat coordination line linked to dummy IDs.", coordinates: "28.62N, 77.24E" },
  { id: "node-d-4", label: "PNB Account **8912", type: "Bank Account", clusterId: "Cluster D-3: Delhi Mules", risk: 89, connections: 4, reports: "Aggregator bank branch cashout based in Karol Bagh.", ipAddress: "185.120.45.10" },
  { id: "node-d-5", label: "BOB Account **7732", type: "Bank Account", clusterId: "Cluster D-3: Delhi Mules", risk: 83, connections: 4, reports: "Stolen corporate current account routing high-flow tax blocks.", ipAddress: "185.120.45.14" },
  { id: "node-d-6", label: "J. Mehta (Victim)", type: "Victim", clusterId: "Cluster D-3: Delhi Mules", risk: 14, connections: 2, reports: "Business owner defrauded under GST suspension scare. Transferred ₹8.9L." },
  { id: "node-d-7", label: "S. Roy (Victim)", type: "Victim", clusterId: "Cluster D-3: Delhi Mules", risk: 11, connections: 2, reports: "Senior citizen coerced with money laundering warrant. Lost ₹5.0L." },
  { id: "node-d-8", label: "UPI: agent.escrow@okpnb", type: "UPI ID", clusterId: "Cluster D-3: Delhi Mules", risk: 92, connections: 4, reports: "Primary escrow UPI ID associated with Karol Bagh accounts.", ipAddress: "10.100.45.02" },
  { id: "node-d-9", label: "UPI: agent.settle@okhdfc", type: "UPI ID", clusterId: "Cluster D-3: Delhi Mules", risk: 86, connections: 3, reports: "Secondary P2P settlement handle.", ipAddress: "10.100.45.06" },
  { id: "node-d-10", label: "D-Phone 3 +91 9911...", type: "Phone Number", clusterId: "Cluster D-3: Delhi Mules", risk: 75, connections: 2, reports: "Liaison communication line.", coordinates: "28.60N, 77.22E" },
  { id: "node-d-11", label: "D-Phone 4 +91 8812...", type: "Phone Number", clusterId: "Cluster D-3: Delhi Mules", risk: 62, connections: 2, reports: "Backup P2P SMS coordinator.", coordinates: "28.63N, 77.25E" },
  { id: "node-d-12", label: "D-Mule 3 SBI **3211", type: "Bank Account", clusterId: "Cluster D-3: Delhi Mules", risk: 78, connections: 2, reports: "Sub-level aggregator bank node.", ipAddress: "185.120.45.18" },
  { id: "node-d-13", label: "D-Mule 4 BOB **4512", type: "Bank Account", clusterId: "Cluster D-3: Delhi Mules", risk: 65, connections: 2, reports: "Secondary cash collection account.", ipAddress: "185.120.45.22" },
  { id: "node-d-14", label: "iPhone 13 Pro Device", type: "Device", clusterId: "Cluster D-3: Delhi Mules", risk: 88, connections: 2, reports: "Hardware device linked to P2P wallet master.", ipAddress: "192.168.8.12" },
  { id: "node-d-15", label: "D-UPI: agent.wallet@ybl", type: "UPI ID", clusterId: "Cluster D-3: Delhi Mules", risk: 74, connections: 2, reports: "P2P escrow wallet link.", ipAddress: "10.100.45.10" },
  { id: "node-d-16", label: "D-UPI: p2p.escrow@paytm", type: "UPI ID", clusterId: "Cluster D-3: Delhi Mules", risk: 71, connections: 2, reports: "Settlement trigger handle.", ipAddress: "10.100.45.14" },
];

export const mockEdges: [string, string][] = [
  // Cluster J-1 Edges
  ["node-j-1", "node-j-2"],
  ["node-j-1", "node-j-3"],
  ["node-j-1", "node-j-4"],
  ["node-j-1", "node-j-5"],
  ["node-j-1", "node-j-8"],
  ["node-j-1", "node-j-9"],
  ["node-j-4", "node-j-6"],
  ["node-j-4", "node-j-10"],
  ["node-j-5", "node-j-7"],
  ["node-j-5", "node-j-11"],
  ["node-j-8", "node-j-10"],
  ["node-j-8", "node-j-12"],
  ["node-j-9", "node-j-11"],
  ["node-j-9", "node-j-12"],
  ["node-j-2", "node-j-13"],
  ["node-j-3", "node-j-14"],
  ["node-j-13", "node-j-15"],
  ["node-j-14", "node-j-16"],
  ["node-j-15", "node-j-17"],
  ["node-j-16", "node-j-18"],

  // Cluster M-2 Edges
  ["node-m-1", "node-m-2"],
  ["node-m-1", "node-m-3"],
  ["node-m-1", "node-m-4"],
  ["node-m-1", "node-m-5"],
  ["node-m-1", "node-m-8"],
  ["node-m-1", "node-m-9"],
  ["node-m-2", "node-m-6"],
  ["node-m-2", "node-m-7"],
  ["node-m-3", "node-m-6"],
  ["node-m-3", "node-m-7"],
  ["node-m-8", "node-m-6"],
  ["node-m-9", "node-m-7"],
  ["node-m-4", "node-m-10"],
  ["node-m-5", "node-m-11"],
  ["node-m-10", "node-m-12"],
  ["node-m-11", "node-m-13"],
  ["node-m-12", "node-m-14"],
  ["node-m-13", "node-m-14"],
  ["node-m-12", "node-m-15"],
  ["node-m-13", "node-m-16"],

  // Cluster D-3 Edges
  ["node-d-1", "node-d-2"],
  ["node-d-1", "node-d-3"],
  ["node-d-1", "node-d-4"],
  ["node-d-1", "node-d-5"],
  ["node-d-1", "node-d-8"],
  ["node-d-1", "node-d-9"],
  ["node-d-2", "node-d-6"],
  ["node-d-2", "node-d-7"],
  ["node-d-3", "node-d-6"],
  ["node-d-3", "node-d-7"],
  ["node-d-8", "node-d-6"],
  ["node-d-9", "node-d-7"],
  ["node-d-4", "node-d-10"],
  ["node-d-5", "node-d-11"],
  ["node-d-10", "node-d-12"],
  ["node-d-11", "node-d-13"],
  ["node-d-12", "node-d-14"],
  ["node-d-13", "node-d-14"],
  ["node-d-12", "node-d-15"],
  ["node-d-13", "node-d-16"],
];
