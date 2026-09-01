import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Globe2,
  Home,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  Car,
  FileText,
  UserRound,
  Users,
  Server,
  X,
  Activity,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Camera,
  RefreshCw,
  FileEdit,
  Compass
} from "lucide-react";
import LiveMapView from "./LiveMapView";
import IncidentsView from "./pages/IncidentsView";
import VehiclesView from "./pages/VehiclesView";
import ShipmentsView from "./pages/ShipmentsView";
import ResilienceView from "./pages/ResilienceView";
import ReportsView from "./pages/ReportsView";
import ProfileView from "./pages/ProfileView";
import SettingsView from "./pages/SettingsView";
import EvacuationView from "./pages/EvacuationView";
import AdminView from "./pages/AdminView";
import AuthorityOverview from "./pages/AuthorityOverview";
import LogisticsOverview from "./pages/LogisticsOverview";
import FieldAgentOverview from "./pages/FieldAgentOverview";
import FieldAgentMediaView from "./pages/FieldAgentMediaView";
import FieldAgentSyncView from "./pages/FieldAgentSyncView";
import FieldAgentReportView from "./pages/FieldAgentReportView";
import CitizenOverview from "./pages/CitizenOverview";
import CitizenReportView from "./pages/CitizenReportView";
import CitizenMyReportsView from "./pages/CitizenMyReportsView";
import CitizenEmergencyMapView from "./pages/CitizenEmergencyMapView";
import AdminOverview from "./pages/AdminOverview";
import AdminRolesView from "./pages/AdminRolesView";
import AdminAuditLogsView from "./pages/AdminAuditLogsView";
import AdminUsersView from "./pages/AdminUsersView";
import AdminSystemsView from "./pages/AdminSystemsView";
import WhatIfAnalysisView from "./pages/WhatIfAnalysisView";
import { useAlerts } from "../hooks/useAlerts";
import "./dashboard.css";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "A";
}

interface DashboardPageProps {
  onBackToHome?: () => void;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onUpdateUser?: (user: { name: string; email?: string; role?: string }) => void;
}

const authorityNavItems = [
  { key: "Overview", label: "Overview", icon: Home },
  { key: "Live Map", label: "Live Map", icon: MapPin },
  { key: "Incidents", label: "Incidents", icon: AlertTriangle },
  { key: "Vehicles", label: "Vehicles", icon: Car },
  { key: "Shipments", label: "Shipments", icon: Package },
  { key: "Resilience", label: "Resilience", icon: ShieldCheck },
  { key: "Alerts", label: "Alerts", icon: Bell },
  { key: "Reports", label: "Reports", icon: FileText },
  { key: "Route Planner", label: "Route Planner", icon: Crosshair },
  { key: "What If Analysis", label: "What If Analysis", icon: Activity },
  { key: "Admin Ops", label: "Admin Ops", icon: ShieldAlert },
];

const logisticsNavItems = [
  { key: "Overview", label: "Overview", icon: Home },
  { key: "Route Planner", label: "Route Planner", icon: Crosshair },
  { key: "Vehicles", label: "Vehicles", icon: Car },
  { key: "Shipments", label: "Shipments", icon: Package },
];

const fieldAgentNavItems = [
  { key: "Home", label: "Home", icon: Home },
  { key: "Incident Report", label: "Incident Report", icon: FileText },
  { key: "Media", label: "Media", icon: Camera },
  { key: "Offline / Sync", label: "Offline / Sync", icon: RefreshCw },
];

const citizenNavItems = [
  { key: "Home", label: "Home", icon: Home },
  { key: "Report Issue", label: "Report Issue", icon: FileEdit },
  { key: "My Reports", label: "My Reports", icon: FileText },
  { key: "Emergency Map", label: "Emergency Map", icon: Compass },
];

const adminNavItems = [
  { key: "Dashboard", label: "Dashboard", icon: Home },
  { key: "Users", label: "Users", icon: Users },
  { key: "Roles", label: "Roles", icon: ShieldCheck },
  { key: "Systems", label: "Systems", icon: Server },
  { key: "Audit Logs", label: "Audit Logs", icon: FileText },
];

type LanguageType = "English" | "Hindi" | "Assamese";

const translations: Record<LanguageType, Record<string, any>> = {
  English: {
    code: "en",
    neraSubtitle: <>North East<br />Resilience Assistant</>,
    overview: "Overview", profile: "Profile", liveMap: "Live Map", incidents: "Incidents", vehicles: "Vehicles",
    shipments: "Shipments", resilience: "Resilience", alerts: "Alerts", reports: "Reports", settings: "Settings",
    home: "Home", media: "Media", incidentReport: "Incident Report", offlineSync: "Offline / Sync",
    reportIssue: "Report Issue", myReports: "My Reports", emergencyMap: "Emergency Map",
    dashboard: "Dashboard", users: "Users", roles: "Roles", systems: "Systems", auditLogs: "Audit Logs",
    search: "Search roads, incidents, vehicles, districts...",
    searchLogistics: "Search vehicles, shipments, routes, districts...",
    searchCitizen: "Search for roads, incidents, facilities...",
    searchAdmin: "Search users, reports, systems...",
    searchLocation: "Search location...",
    noLocations: "No locations found",
    selectLocation: "Select location",
    greeting: "Good evening, Rakshana.",
    happening: "Here's what's happening in your region today.",
    notifications: "Notifications", noNotifications: "No new notifications",
    profileMenu: "Profile", accountSettings: "Account settings", logout: "Log out",
    markRead: "Mark all as read", changeStatus: "Change status", saved: "Saved",
    backToHome: "Back to Home"
  },
  Hindi: {
    code: "hi",
    neraSubtitle: <>उत्तर-पूर्व<br />लचीलापन सहायक</>,
    overview: "अवलोकन", profile: "प्रोफ़ाइल", liveMap: "लाइव मानचित्र", incidents: "घटनाएँ", vehicles: "वाहन",
    shipments: "शिपमेंट", resilience: "लचीलापन", alerts: "अलर्ट", settings: "सेटिंग्स",
    home: "होम", media: "मीडिया", incidentReport: "घटना रिपोर्ट", offlineSync: "ऑफलाइन / सिंक",
    reportIssue: "समस्या रिपोर्ट करें", myReports: "मेरी रिपोर्ट", emergencyMap: "आपातकालीन मानचित्र",
    dashboard: "डैशबोर्ड", users: "उपयोगकर्ता", roles: "भूमिकाएँ", systems: "सिस्टम", auditLogs: "ऑडिट लॉग",
    search: "सड़क, घटनाएँ, वाहन, जिले खोजें...",
    searchLogistics: "वाहन, शिपमेंट, मार्ग, जिले खोजें...",
    searchCitizen: "सड़क, घटनाएं, सुविधाएं खोजें...",
    searchAdmin: "उपयोगकर्ता, रिपोर्ट, सिस्टम खोजें...",
    searchLocation: "स्थान खोजें...",
    noLocations: "कोई स्थान नहीं मिला",
    selectLocation: "स्थान चुनें",
    greeting: "शुभ संध्या, रक्षणा।",
    happening: "आज आपके क्षेत्र में क्या हो रहा है, यहाँ देखें।",
    notifications: "सूचनाएँ", noNotifications: "कोई नई सूचना नहीं",
    profileMenu: "प्रोफ़ाइल", accountSettings: "खाता सेटिंग्स", logout: "लॉग आउट",
    markRead: "सभी को पढ़ा हुआ करें", changeStatus: "स्थिति बदलें", saved: "सहेजा गया",
    backToHome: "होम पेज पर वापस जाएं",
    reports: "रिपोर्ट्स"
  },
  Assamese: {
    code: "as",
    neraSubtitle: <>উত্তৰ-পূব<br />স্থিতিস্থাপকতা সহায়ক</>,
    overview: "অভাৰভিউ", profile: "প্ৰফাইল", liveMap: "লাইভ মানচিত্ৰ", incidents: "ঘটনা", vehicles: "যানবাহন",
    shipments: "চালান", resilience: "স্থিতিস্থাপকতা", alerts: "সতৰ্কবাণী", reports: "প্ৰতিবেদন", settings: "ছেটিংছ",
    home: "গৃহ", media: "মিডিয়া", incidentReport: "ঘটনা প্ৰতিবেদন", offlineSync: "অফলাইন / ছিংক",
    reportIssue: "সমস্যা প্ৰতিবেদন", myReports: "মোৰ প্ৰতিবেদন", emergencyMap: "জৰুৰীকালীন মানচিত্ৰ",
    dashboard: "ডেশ্বব'ৰ্ড", users: "ব্যৱহাৰকাৰী", roles: "ভূমিকা", systems: "প্ৰণালী", auditLogs: "অডিট লগ",
    search: "পথ, ঘটনা, যানবাহন, জিলা বিচাৰক...",
    searchLogistics: "যানবাহন, চালান, পথ, জিলা বিচাৰক...",
    searchCitizen: "পথ, ঘটনা, সুবিধা বিচাৰক...",
    searchAdmin: "ব্যৱহাৰকাৰী, প্ৰতিবেদন, প্ৰণালী বিচাৰক...",
    searchLocation: "স্থান বিচাৰক...",
    noLocations: "কোনো স্থান পোৱা নগ'ল",
    selectLocation: "স্থান বাছনি কৰক",
    greeting: "শুভ সন্ধিয়া, ৰক্ষনা।",
    happening: "আজি আপোনাৰ অঞ্চলত কি হৈ আছে ইয়াত চাওক।",
    notifications: "জাননী", noNotifications: "নতুন জাননী নাই",
    profileMenu: "প্ৰফাইল", accountSettings: "একাউণ্ট ছেটিংছ", logout: "লগ আউট",
    markRead: "সকলো পঢ়া বুলি চিহ্নিত কৰক", changeStatus: "অৱস্থা সলনি কৰক", saved: "সংৰক্ষিত",
    backToHome: "মূল পৃষ্ঠালৈ ঘূৰি যাওক"
  }
};

const locations = [
  { key: "Dima Hasao", en: "Dima Hasao, Assam", hi: "दिमा हसाओ, असम", as: "ডিমা হাছাও, অসম" },
  { key: "Assam", en: "Assam", hi: "असम", as: "অসম" },
  { key: "Karbi Anglong", en: "Karbi Anglong, Assam", hi: "কাৰ্বি আংলং, অসম", as: "কাৰ্বি আংলং, অসম" },
  { key: "Kamrup", en: "Kamrup, Assam", hi: "कामरूप, असम", as: "কামৰূপ, অসম" },
  { key: "West Karbi Anglong", en: "West Karbi Anglong, Assam", hi: "पश्चिम कार्बी आंगलोंग, असम", as: "পশ্চিম কাৰ্বি আংলং, অসম" },
  { key: "Haflong", en: "Haflong, Assam", hi: "हाफलोंग, असम", as: "হাফলং, অসম" },
  { key: "Maibong", en: "Maibong, Assam", hi: "माईबोंग, असम", as: "মাইবং, অসম" },
  { key: "Lumding", en: "Lumding, Assam", hi: "लुमडिंग, असम", as: "লুমডিং, অসম" },
  { key: "Golaghat", en: "Golaghat, Assam", hi: "गोलाघाट, असम", as: "গোলাঘাট, অসম" }
];

function locationName(location: string, language: LanguageType) {
  const item = locations.find(l => l.key === location);
  if (!item) return `${location}, Assam`;
  return language === "Hindi" ? item.hi : language === "Assamese" ? item.as : item.en;
}

export default function DashboardPage({
  onBackToHome,
  userName = "Rakshana",
  userEmail = "rakshana.authority@nera.gov.in",
  userRole = "Authority / Analyst",
  onUpdateUser
}: DashboardPageProps) {
  const isAdmin = userRole.toLowerCase().includes("admin");
  const isCitizen = userRole.toLowerCase().includes("citizen");
  const isFieldAgent = userRole.toLowerCase().includes("field");
  const isLogistics = userRole.toLowerCase().includes("logistics");

  const [active, setActive] = useState(isAdmin ? "Dashboard" : isCitizen || isFieldAgent ? "Home" : "Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(isLogistics ? "Assam" : "Dima Hasao");
  const [language, setLanguage] = useState<LanguageType>("English");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = isAdmin
    ? adminNavItems
    : isCitizen
    ? citizenNavItems
    : isFieldAgent
    ? fieldAgentNavItems
    : isLogistics
    ? logisticsNavItems
    : authorityNavItems;

  const { unreadCount, toastAlert, dismissToast } = useAlerts();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
        setProfileOpen(false);
        setLocationOpen(false);
      }
    };
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notification-wrap")) setNotificationOpen(false);
      if (!target.closest(".profile-wrap")) setProfileOpen(false);
      if (!target.closest(".location-picker")) setLocationOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const t = translations[language];

  const filteredLocations = useMemo(() => {
    const q = locationSearch.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter(l =>
      `${l.en} ${l.hi} ${l.as}`.toLowerCase().includes(q)
    );
  }, [locationSearch]);

  const navLabel: Record<string, string> = {
    Overview: t.overview,
    Dashboard: t.dashboard || "Dashboard",
    Home: t.home || "Home",
    Profile: t.profile,
    "Live Map": t.liveMap,
    Incidents: t.incidents,
    Vehicles: t.vehicles,
    Shipments: t.shipments,
    Resilience: t.resilience,
    Alerts: t.alerts,
    Reports: t.reports,
    Users: t.users || "Users",
    Roles: t.roles || "Roles",
    Systems: t.systems || "Systems",
    "Audit Logs": t.auditLogs || "Audit Logs",
    "Incident Report": t.incidentReport || "Incident Report",
    Media: t.media || "Media",
    "Offline / Sync": t.offlineSync || "Offline / Sync",
    "Report Issue": t.reportIssue || "Report Issue",
    "My Reports": t.myReports || "My Reports",
    "Emergency Map": t.emergencyMap || "Emergency Map",
    "Route Planner": "Route Planner",
    "What If Analysis": "What If Analysis",
    "Admin Ops": "Admin Ops",
    Settings: t.settings
  };

  const handleRoleSwitch = (roleName: string, name: string) => {
    if (onUpdateUser) {
      onUpdateUser({
        name,
        role: roleName,
        email: `${name.toLowerCase().replace(" ", ".")}@nera.gov.in`
      });
    }
    if (roleName.toLowerCase().includes("admin")) setActive("Dashboard");
    else if (roleName.toLowerCase().includes("field") || roleName.toLowerCase().includes("citizen")) setActive("Home");
    else setActive("Overview");
    setProfileOpen(false);
  };

  return (
    <div className={`dashboard-shell lang-${t.code} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`} lang={t.code}>
      <aside className={`dashboard-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div
          className="dashboard-brand"
          onClick={onBackToHome}
          title="Return to Landing Page"
        >
          <div className="brand-name">
            NERA
            <span className="brand-back-hint">Home ↗</span>
          </div>
          <div className="brand-line"><span /><i /><span /><b /><span /></div>
          <div className="brand-sub">
            {isAdmin ? <>North East Resilience Assistant<br />Administrator</> : t.neraSubtitle}
          </div>
        </div>

        <nav className="main-nav">
          {onBackToHome && (
            <button
              className="dashboard-nav-item back-home"
              onClick={onBackToHome}
              title="Return to NERA Landing Page"
            >
              <ArrowLeft size={18} strokeWidth={2} />
              <span>{t.backToHome}</span>
            </button>
          )}

          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`dashboard-nav-item ${(active === label || (active === "Overview" && label === "Home") || (active === "Home" && label === "Overview") || (active === "Dashboard" && label === "Dashboard")) ? "active" : ""}`}
              onClick={() => { setActive(label); setMobileOpen(false); }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{navLabel[label] || label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Bottom (Role-aware) */}
        {isAdmin ? (
          <div className="sidebar-bottom" style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "10px" }}>
            <button
              className={`dashboard-nav-item ${active === "Settings" ? "active" : ""}`}
              onClick={() => setActive("Settings")}
            >
              <Settings size={19} strokeWidth={1.8} />
              <span>{t.settings}</span>
            </button>
          </div>
        ) : isCitizen ? (
          <div
            onClick={() => setActive("Profile")}
            style={{
              marginTop: "auto",
              borderTop: "1px solid #f1f5f9",
              padding: "12px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: active === "Profile" ? "#edf7f1" : "transparent"
            }}
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f1f5f9", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserRound size={17} color="#475569" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <strong style={{ fontSize: "12.5px", color: "#0f172a", lineHeight: "1.2" }}>{userName}</strong>
              <span style={{ fontSize: "10.5px", color: "#64748b" }}>Citizen</span>
              <span style={{ fontSize: "10px", color: "#94a3b8" }}>Guwahati, Assam</span>
            </div>
          </div>
        ) : isFieldAgent ? (
          <div
            onClick={() => setActive("Profile")}
            style={{
              marginTop: "auto",
              borderTop: "1px solid #f1f5f9",
              padding: "12px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: active === "Profile" ? "#edf7f1" : "transparent"
            }}
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f1f5f9", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserRound size={17} color="#475569" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <strong style={{ fontSize: "12.5px", color: "#0f172a", lineHeight: "1.2" }}>{userName}</strong>
              <span style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "600" }}>Home</span>
              <span style={{ fontSize: "10px", color: "#64748b" }}>Field Agent • NH-27 | Guwahati</span>
            </div>
          </div>
        ) : isLogistics ? (
          <div className="sidebar-bottom" style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
            <button
              className="dashboard-nav-item"
              onClick={onBackToHome}
              style={{ color: "#64748b" }}
            >
              <LogOut size={19} strokeWidth={1.8} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="sidebar-bottom" style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              className={`dashboard-nav-item ${active === "Settings" ? "active" : ""}`}
              onClick={() => setActive("Settings")}
            >
              <Settings size={19} strokeWidth={1.8} />
              <span>{t.settings}</span>
            </button>

            <div
              onClick={() => setActive("Profile")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "8px",
                cursor: "pointer",
                background: active === "Profile" ? "#edf7f1" : "transparent",
                transition: "background 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserRound size={16} color="#475569" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "12.5px", color: "#0f172a", lineHeight: "1.2" }}>{userName}</strong>
                  <span style={{ fontSize: "10.5px", color: "#64748b" }}>{userRole}</span>
                </div>
              </div>
              <ChevronRight size={14} color="#94a3b8" />
            </div>
          </div>
        )}
      </aside>

      {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="hamburger"
            onClick={() => {
              if (window.innerWidth <= 800) setMobileOpen(v => !v);
              else setSidebarCollapsed(v => !v);
            }}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          {isAdmin ? (
            /* Admin Header Search */
            <div className="search-box">
              <Search size={19} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchAdmin}
              />
              {search && <button onClick={() => setSearch("")}><X size={16} /></button>}
            </div>
          ) : isCitizen ? (
            /* Citizen Header Title Left */
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Welcome, {userName.split(" ")[0]}!
              </h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Stay informed. Report issues. Keep your region safe.
              </span>
            </div>
          ) : isFieldAgent ? (
            /* Field Agent Header Style */
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "4px 12px", borderRadius: "16px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a" }} /> Synced
              </span>
            </div>
          ) : (
            <div className="search-box">
              <Search size={19} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isLogistics ? t.searchLogistics : t.search}
              />
              {search && <button onClick={() => setSearch("")}><X size={16} /></button>}
            </div>
          )}

          <div className="top-actions" style={{ marginLeft: "auto" }}>
            {isAdmin ? (
              /* Admin Notification Bell */
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <button
                  className="notification"
                  onClick={() => {
                    setNotificationOpen(v => !v);
                    setProfileOpen(false);
                  }}
                  aria-expanded={notificationOpen}
                >
                  <Bell size={21} /><span>3</span>
                </button>
              </div>
            ) : isCitizen ? (
              /* Citizen Right Top: Search + Bell (1) */
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "7px 12px", width: "240px" }}>
                  <Search size={16} color="#64748b" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search for roads, incidents, facilities..."
                    style={{ border: "none", background: "transparent", outline: "none", fontSize: "12px", width: "100%" }}
                  />
                </div>
                <button
                  className="notification"
                  onClick={() => {
                    setNotificationOpen(v => !v);
                    setProfileOpen(false);
                  }}
                  aria-expanded={notificationOpen}
                >
                  <Bell size={21} /><span>1</span>
                </button>
              </div>
            ) : isFieldAgent ? (
              /* Field Agent right timestamp & bell */
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
                  20 May 2025, 10:32 AM
                </span>
                <button
                  className="notification"
                  onClick={() => {
                    setNotificationOpen(v => !v);
                    setProfileOpen(false);
                  }}
                  aria-expanded={notificationOpen}
                >
                  <Bell size={21} /><span>5</span>
                </button>
              </div>
            ) : (
              <>
                <div className={`location-picker ${locationOpen ? "open" : ""}`} onClick={e => e.stopPropagation()}>
                  <button
                    className="select-box location-trigger"
                    onClick={() => {
                      setLocationOpen(v => !v);
                      setLocationSearch("");
                    }}
                    aria-expanded={locationOpen}
                  >
                    <MapPin size={18} />
                    <span>{isLogistics ? `Select District • ${locationName(location, language)}` : locationName(location, language)}</span>
                    <ChevronDown size={15} />
                  </button>

                  {locationOpen && (
                    <div className="location-menu">
                      <div className="location-search">
                        <Search size={16} />
                        <input
                          autoFocus
                          value={locationSearch}
                          onChange={e => setLocationSearch(e.target.value)}
                          placeholder={t.searchLocation}
                        />
                        {locationSearch && (
                          <button onClick={() => setLocationSearch("")}><X size={14} /></button>
                        )}
                      </div>

                      <div className="location-results">
                        {filteredLocations.length ? filteredLocations.map(item => (
                          <button
                            key={item.key}
                            className={`location-option ${location === item.key ? "selected" : ""}`}
                            onClick={() => {
                              setLocation(item.key);
                              setLocationOpen(false);
                              setLocationSearch("");
                            }}
                          >
                            <MapPin size={16} />
                            <span>{locationName(item.key, language)}</span>
                            {location === item.key && <span className="location-check">✓</span>}
                          </button>
                        )) : (
                          <div className="no-locations">{t.noLocations}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {!isLogistics && (
                  <label className="select-box language">
                    <Globe2 size={17} />
                    <select value={language} onChange={e => setLanguage(e.target.value as LanguageType)}>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Assamese">Assamese</option>
                    </select>
                    <ChevronDown size={15} />
                  </label>
                )}

                <div className={`notification-wrap ${notificationOpen ? "open" : ""}`} onClick={e => e.stopPropagation()}>
                  <button
                    className="notification"
                    onClick={() => {
                      setNotificationOpen(v => !v);
                      setProfileOpen(false);
                    }}
                    aria-expanded={notificationOpen}
                  >
                    <Bell size={21} />{unreadCount > 0 ? <span>{unreadCount}</span> : <span>3</span>}
                  </button>
                </div>
              </>
            )}

            <div className={`profile-wrap ${profileOpen ? "open" : ""}`} onClick={e => e.stopPropagation()}>
              <button
                className="profile profile-trigger"
                onClick={() => {
                  setProfileOpen(v => !v);
                  setNotificationOpen(false);
                }}
                aria-expanded={profileOpen}
              >
                <div className="avatar">{getInitials(userName)}</div>
                <div className="profile-text"><strong>{userName}</strong><small>{isAdmin ? "System Administrator" : userRole}</small></div>
                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-head">
                    <div className="avatar large">{getInitials(userName)}</div>
                    <div><strong>{userName}</strong><span>{isAdmin ? "System Administrator" : userRole}</span></div>
                  </div>

                  {/* Switch Role Fast Preview */}
                  <div style={{ padding: "8px 12px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: "11px" }}>
                    <span style={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Switch Dashboard View</span>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "6px" }}>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("Admin", "Admin")}
                        style={{ padding: "4px 6px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1", background: isAdmin ? "#dcfce7" : "#fff", color: isAdmin ? "#166534" : "#334155", fontWeight: 600 }}
                      >
                        🛡️ Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("Citizen", "Rahul Sharma")}
                        style={{ padding: "4px 6px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1", background: isCitizen ? "#dcfce7" : "#fff", color: isCitizen ? "#166534" : "#334155", fontWeight: 600 }}
                      >
                        👥 Citizen
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("Field Agent", "Rahul")}
                        style={{ padding: "4px 6px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1", background: isFieldAgent ? "#dcfce7" : "#fff", color: isFieldAgent ? "#166534" : "#334155", fontWeight: 600 }}
                      >
                        👷 Field Agent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("Logistics Operator", "Rahul Sharma")}
                        style={{ padding: "4px 6px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1", background: isLogistics ? "#dcfce7" : "#fff", color: isLogistics ? "#166534" : "#334155", fontWeight: 600 }}
                      >
                        🚚 Logistics
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch("Authority / Analyst", "Rakshana")}
                        style={{ padding: "4px 6px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1", background: (!isAdmin && !isLogistics && !isFieldAgent && !isCitizen) ? "#dcfce7" : "#fff", color: (!isAdmin && !isLogistics && !isFieldAgent && !isCitizen) ? "#166534" : "#334155", fontWeight: 600 }}
                      >
                        🚨 Authority
                      </button>
                    </div>
                  </div>

                  <button onClick={() => { setActive("Profile"); setProfileOpen(false); }}>
                    <UserRound size={17} /><span>{t.profileMenu}</span><ChevronRight size={15} />
                  </button>
                  <button onClick={() => { setActive("Settings"); setProfileOpen(false); }}>
                    <Settings size={17} /><span>{t.accountSettings}</span><ChevronRight size={15} />
                  </button>
                  <div className="profile-divider"></div>
                  <button className="logout-item" onClick={() => { setProfileOpen(false); if (onBackToHome) onBackToHome(); }}>
                    <X size={17} /><span>{t.logout}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          {toastAlert && (
            <div
              className={`toast-alert-banner ${toastAlert.severity}`}
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: toastAlert.severity === "critical" ? "#7f1d1d" : "#7c2d12",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                borderLeft: "4px solid #ef4444"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => { setActive("Incidents"); dismissToast(); }}>
                <AlertTriangle size={20} color="#f87171" />
                <div>
                  <strong style={{ fontSize: "14px" }}>Real-time Alert: {toastAlert.message}</strong>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    Target: {toastAlert.target_role || "System"} • Scoped to {toastAlert.road_name || toastAlert.district_name || "Region"}
                  </div>
                </div>
              </div>
              <button
                onClick={dismissToast}
                style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Role & Tab Routing */}
          {active === "Dashboard" || active === "Overview" || active === "Home" ? (
            isAdmin ? (
              <AdminOverview onNavigateTab={(tab) => setActive(tab)} />
            ) : isCitizen ? (
              <CitizenOverview
                userName={userName}
                onNavigateTab={(tab) => setActive(tab)}
                onOpenReport={() => setActive("Report Issue")}
              />
            ) : isFieldAgent ? (
              <FieldAgentOverview
                userName={userName}
                currentRoute="NH-27"
                onNavigateTab={(tab) => setActive(tab)}
                onOpenReportModal={() => setActive("Incident Report")}
              />
            ) : isLogistics ? (
              <LogisticsOverview
                userName={userName}
                userRole={userRole}
                selectedDistrict={location}
                onNavigateTab={(tab) => setActive(tab)}
              />
            ) : (
              <AuthorityOverview
                userName={userName}
                userRole={userRole}
                selectedDistrict={location}
                onNavigateTab={(tab) => setActive(tab)}
              />
            )
          ) : active === "Users" ? (
            <AdminUsersView />
          ) : active === "Roles" ? (
            <AdminRolesView />
          ) : active === "Systems" ? (
            <AdminSystemsView />
          ) : active === "Audit Logs" ? (
            <AdminAuditLogsView />
          ) : active === "Report Issue" ? (
            <CitizenReportView onSuccess={() => setActive("My Reports")} />
          ) : active === "My Reports" ? (
            <CitizenMyReportsView />
          ) : active === "Emergency Map" ? (
            <CitizenEmergencyMapView />
          ) : active === "Incident Report" ? (
            <FieldAgentReportView onSuccess={() => setActive("Home")} />
          ) : active === "Media" ? (
            <FieldAgentMediaView />
          ) : active === "Offline / Sync" ? (
            <FieldAgentSyncView />
          ) : active === "Live Map" ? (
            <LiveMapView selectedDistrict={location} onDistrictChange={setLocation} />
          ) : active === "Incidents" ? (
            <IncidentsView selectedDistrict={location} />
          ) : active === "Vehicles" ? (
            <VehiclesView selectedDistrict={location} />
          ) : active === "Shipments" ? (
            <ShipmentsView selectedDistrict={location} />
          ) : active === "Resilience" ? (
            <ResilienceView selectedDistrict={location} onNavigateToReports={() => setActive("Reports")} />
          ) : active === "Alerts" ? (
            <ReportsView selectedDistrict={location} />
          ) : active === "Reports" ? (
            <ReportsView selectedDistrict={location} />
          ) : active === "Route Planner" || active === "Evacuation" ? (
            <EvacuationView selectedDistrict={location} />
          ) : active === "What If Analysis" ? (
            <WhatIfAnalysisView selectedDistrict={location} />
          ) : active === "Admin Ops" ? (
            <AdminView />
          ) : active === "Settings" ? (
            <SettingsView
              location={location}
              language={language}
              userName={userName}
              onUpdateLocation={setLocation}
              onUpdateLanguage={setLanguage}
            />
          ) : active === "Profile" ? (
            <ProfileView
              location={locationName(location, language)}
              language={language}
              userName={userName}
              userEmail={userEmail}
              userRole={userRole}
              onUpdateLocation={setLocation}
              onUpdateUser={onUpdateUser}
            />
          ) : isAdmin ? (
            <AdminOverview onNavigateTab={(tab) => setActive(tab)} />
          ) : isCitizen ? (
            <CitizenOverview
              userName={userName}
              onNavigateTab={(tab) => setActive(tab)}
              onOpenReport={() => setActive("Report Issue")}
            />
          ) : isFieldAgent ? (
            <FieldAgentOverview
              userName={userName}
              currentRoute="NH-27"
              onNavigateTab={(tab) => setActive(tab)}
            />
          ) : isLogistics ? (
            <LogisticsOverview
              userName={userName}
              userRole={userRole}
              selectedDistrict={location}
              onNavigateTab={(tab) => setActive(tab)}
            />
          ) : (
            <AuthorityOverview
              userName={userName}
              userRole={userRole}
              selectedDistrict={location}
              onNavigateTab={(tab) => setActive(tab)}
            />
          )}
        </section>
      </main>
    </div>
  );
}
