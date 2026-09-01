import { useState, useEffect } from "react";

export interface Incident {
  id: string;
  title: string;
  road: string;
  district: string;
  time: string;
  severity: "Critical" | "High" | "Moderate" | "Low";
  status: "Active" | "Under Assessment" | "Resolved";
  reportedBy: string;
  coordinates?: [number, number];
  description?: string;
  image?: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  location: string;
  category: string;
  status: "In Progress" | "Resolved" | "Needs Attention";
  date: string;
  image: string;
  description?: string;
  reportedBy: string;
  liveLocation?: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  road: string;
  district: string;
  date: string;
  type: "photo" | "voice";
  duration?: string;
  reportedBy: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  action: string;
  actionColor: string;
  module: string;
  details: string;
  ip: string;
  status: "Success" | "Failed";
}

export interface SystemService {
  id: string;
  name: string;
  status: "Healthy" | "Warning" | "Critical";
  uptime: string;
  latency: string;
  host: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Authority / Analyst" | "Logistics Operator" | "Field Agent" | "Citizen" | "Admin";
  district: string;
  status: "Active" | "Inactive";
  joined: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  severity: "critical" | "warning" | "info" | "success";
  targetRole?: string;
  read: boolean;
}

// Initial state data
const initialIncidents: Incident[] = [
  {
    id: "inc-1",
    title: "Landslide – NH-27 (12 km)",
    road: "NH-27",
    district: "Dima Hasao, Assam",
    time: "10:12 AM",
    severity: "High",
    status: "Active",
    reportedBy: "Rahul (Field Agent)",
    description: "Slope mudslide blocking single lane near Km 12+400."
  },
  {
    id: "inc-2",
    title: "Road Blockage – NH-37 (18 km)",
    road: "NH-37",
    district: "Karbi Anglong, Assam",
    time: "09:48 AM",
    severity: "Moderate",
    status: "Active",
    reportedBy: "Priya Das (Field Agent)",
    description: "Debris and fallen branch clearance in progress."
  },
  {
    id: "inc-3",
    title: "Flood – NH-6 (25 km)",
    road: "NH-6",
    district: "Cachar, Assam",
    time: "09:30 AM",
    severity: "High",
    status: "Active",
    reportedBy: "Arup Boro (Field Agent)",
    description: "Culvert overflow waterlogging 40cm."
  }
];

const initialCitizenReports: CitizenReport[] = [
  {
    id: "REP-101",
    title: "Road damage on NH-27",
    location: "Karbi Anglong",
    category: "Road Damage",
    status: "In Progress",
    date: "18 May 2025",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=60",
    reportedBy: "Rahul Sharma"
  },
  {
    id: "REP-102",
    title: "Landslide near NH-6",
    location: "Cachar",
    category: "Landslide",
    status: "Resolved",
    date: "17 May 2025",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=300&auto=format&fit=crop&q=60",
    reportedBy: "Rahul Sharma"
  },
  {
    id: "REP-103",
    title: "Flooding on SH-12",
    location: "Dima Hasao",
    category: "Flood",
    status: "In Progress",
    date: "16 May 2025",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=60",
    reportedBy: "Rahul Sharma"
  },
  {
    id: "REP-104",
    title: "Bridge issue on NH-37",
    location: "Sivasagar",
    category: "Bridge Issue",
    status: "Needs Attention",
    date: "15 May 2025",
    image: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=300&auto=format&fit=crop&q=60",
    reportedBy: "Rahul Sharma"
  }
];

const initialAuditLogs: AuditLogItem[] = [
  {
    id: "log-1",
    timestamp: "20 May 2026, 10:30 AM",
    userName: "Amit Sharma",
    userEmail: "amit@nera.gov.in",
    action: "Login",
    actionColor: "#dcfce7",
    module: "Authentication",
    details: "User logged in successfully",
    ip: "103.56.12.1",
    status: "Success"
  },
  {
    id: "log-2",
    timestamp: "20 May 2026, 10:28 AM",
    userName: "Priya Das",
    userEmail: "priya@nera.gov.in",
    action: "Incident Report",
    actionColor: "#dbeafe",
    module: "Incidents",
    details: "New incident reported: Landslide – NH-27",
    ip: "103.56.12.5",
    status: "Success"
  },
  {
    id: "log-3",
    timestamp: "20 May 2026, 10:24 AM",
    userName: "Sunita Iyer",
    userEmail: "sunita@nera.gov.in",
    action: "Role Update",
    actionColor: "#ede9fe",
    module: "Users",
    details: "Updated role for Rahul Verma",
    ip: "103.56.12.3",
    status: "Success"
  },
  {
    id: "log-4",
    timestamp: "20 May 2026, 10:20 AM",
    userName: "Rahul Verma",
    userEmail: "rahul@nera.gov.in",
    action: "Media Upload",
    actionColor: "#fee2e2",
    module: "Media",
    details: "Uploaded 3 photos for NH-27",
    ip: "103.56.12.4",
    status: "Success"
  },
  {
    id: "log-5",
    timestamp: "20 May 2026, 10:18 AM",
    userName: "Admin",
    userEmail: "admin@nera.gov.in",
    action: "System Config",
    actionColor: "#fef3c7",
    module: "System",
    details: "Updated system configuration",
    ip: "103.56.12.1",
    status: "Success"
  }
];

class SaaSStore {
  private incidents: Incident[] = initialIncidents;
  private citizenReports: CitizenReport[] = initialCitizenReports;
  private auditLogs: AuditLogItem[] = initialAuditLogs;
  private subscribers: Array<() => void> = [];

  constructor() {
    try {
      const savedInc = localStorage.getItem("nera_incidents");
      if (savedInc) this.incidents = JSON.parse(savedInc);

      const savedRep = localStorage.getItem("nera_citizen_reports");
      if (savedRep) this.citizenReports = JSON.parse(savedRep);

      const savedLogs = localStorage.getItem("nera_audit_logs");
      if (savedLogs) this.auditLogs = JSON.parse(savedLogs);
    } catch {
      // ignore
    }
  }

  private notify() {
    try {
      localStorage.setItem("nera_incidents", JSON.stringify(this.incidents));
      localStorage.setItem("nera_citizen_reports", JSON.stringify(this.citizenReports));
      localStorage.setItem("nera_audit_logs", JSON.stringify(this.auditLogs));
    } catch {
      // ignore
    }
    this.subscribers.forEach(cb => cb());
  }

  public subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== cb);
    };
  }

  public getIncidents() {
    return this.incidents;
  }

  public getCitizenReports() {
    return this.citizenReports;
  }

  public getAuditLogs() {
    return this.auditLogs;
  }

  public addIncident(incident: Omit<Incident, "id" | "time">) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const newInc: Incident = {
      ...incident,
      id: "inc-" + Date.now(),
      time: timeStr
    };
    this.incidents = [newInc, ...this.incidents];

    // Log in Audit Trail
    this.addAuditLog({
      userName: incident.reportedBy || "Field Agent",
      userEmail: "agent@nera.gov.in",
      action: "Incident Report",
      actionColor: "#dbeafe",
      module: "Incidents",
      details: `New incident reported: ${incident.title} on ${incident.road}`,
      ip: "103.56.12.8",
      status: "Success"
    });

    this.notify();
    return newInc;
  }

  public addCitizenReport(report: Omit<CitizenReport, "id" | "date">) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const newRep: CitizenReport = {
      ...report,
      id: "REP-" + Math.floor(100 + Math.random() * 900),
      date: dateStr
    };
    this.citizenReports = [newRep, ...this.citizenReports];

    // Add corresponding incident into shared hazard grid
    this.addIncident({
      title: `${report.category}: ${report.title}`,
      road: report.location.split(",")[0] || "Regional Highway",
      district: report.location,
      severity: report.category === "Landslide" || report.category === "Flood" ? "High" : "Moderate",
      status: "Active",
      reportedBy: `${report.reportedBy} (Citizen)`
    });

    // Log in Audit Trail
    this.addAuditLog({
      userName: report.reportedBy || "Citizen User",
      userEmail: "citizen@nera.gov.in",
      action: "Citizen Report",
      actionColor: "#ede9fe",
      module: "Citizen Grid",
      details: `Citizen report filed for ${report.location}: ${report.category}`,
      ip: "103.56.12.9",
      status: "Success"
    });

    this.notify();
    return newRep;
  }

  public addAuditLog(log: Omit<AuditLogItem, "id" | "timestamp">) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
    const newLog: AuditLogItem = {
      ...log,
      id: "log-" + Date.now(),
      timestamp: dateStr
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    this.notify();
  }
}

export const saasStore = new SaaSStore();

export function useSaaSStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return saasStore.subscribe(() => setTick(t => t + 1));
  }, []);

  return {
    incidents: saasStore.getIncidents(),
    citizenReports: saasStore.getCitizenReports(),
    auditLogs: saasStore.getAuditLogs(),
    addIncident: (inc: Omit<Incident, "id" | "time">) => saasStore.addIncident(inc),
    addCitizenReport: (rep: Omit<CitizenReport, "id" | "date">) => saasStore.addCitizenReport(rep),
    addAuditLog: (log: Omit<AuditLogItem, "id" | "timestamp">) => saasStore.addAuditLog(log)
  };
}
