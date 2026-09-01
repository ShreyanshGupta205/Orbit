import { useEffect, useMemo, useState, useCallback } from "react";
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Crosshair,
  Gauge,
  Globe2,
  Home,
  Layers3,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  Truck,
  Car,
  FileText,
  UserRound,
  X,
  ZoomIn,
  ZoomOut,
  Activity,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { alerts as defaultAlerts, liveUpdates as defaultLiveUpdates, mapMarkers as defaultMapMarkers, stats, districtDataMap } from "./data";
import type { Road, AlertItem } from "./data";
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
import { useApi } from "../api/client";
import { useAlerts } from "../hooks/useAlerts";
import "./dashboard.css";

function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function timeAgo(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (isNaN(diffSec) || diffSec < 0) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "OF";
}

interface DashboardPageProps {
  onBackToHome?: () => void;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onUpdateUser?: (user: { name: string; email?: string; role?: string }) => void;
}

const navItems = [
  { key: "overview", label: "Overview", icon: Home },
  { key: "liveMap", label: "Live Map", icon: MapPin },
  { key: "incidents", label: "Incidents", icon: AlertTriangle },
  { key: "vehicles", label: "Vehicles", icon: Car },
  { key: "shipments", label: "Shipments", icon: Package },
  { key: "resilience", label: "Resilience", icon: ShieldCheck },
  { key: "evacuation", label: "Evacuation", icon: Crosshair },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "admin", label: "Admin Ops", icon: ShieldAlert },
];

type LanguageType = "English" | "Hindi" | "Assamese";

const translations: Record<LanguageType, Record<string, any>> = {
  English: {
    code: "en",
    neraSubtitle: <>North East<br />Resilience Assistant</>,
    overview: "Overview", profile: "Profile", liveMap: "Live Map", incidents: "Incidents", vehicles: "Vehicles",
    shipments: "Shipments", resilience: "Resilience", alerts: "Alerts", reports: "Reports", settings: "Settings",
    search: "Search roads, incidents, vehicles...",
    searchLocation: "Search location...",
    noLocations: "No locations found",
    selectLocation: "Select location",
    greeting: "Good evening, Manas.",
    happening: "Here's what's happening in your region today.",
    criticalRoads: "Critical Roads", openIncidents: "Open Incidents",
    vehiclesActive: "Vehicles Active", shipmentsToday: "Shipments Today",
    mapLayers: "Map Layers", roadConditions: "Road Conditions", viewAll: "View all",
    showLess: "Show less", liveStatus: "LIVE STATUS", viewUpdates: "View all updates",
    activeAlerts: "Active Alerts", road: "Road", district: "District", status: "Status",
    updated: "Updated", region: "Region", dummyMode: "Dummy data mode", language: "Language",
    highRisk: "High Risk", normal: "Normal", moderate: "Moderate",
    incidentReported: "Incident reported", nearMaibong: "Near Maibong",
    trafficDisruption: "Traffic disruption", heavyVehicleBreakdown: "Heavy vehicle breakdown",
    highRiskEvent: "High risk", landslideProbability: "Landslide probability",
    roadClear: "Road clear", normalMovement: "Normal movement",
    criticalBlockage: "Critical road blockage on NH-15", heavyRainfall: "Heavy rainfall warning",
    movementRestored: "Vehicle movement restored",
    roadConditionsLayer: "Road conditions", incidentsLayer: "Incidents",
    vehiclesLayer: "Vehicles", weatherLayer: "Weather", dummyLive: "Dummy live data",
    minAgo: "min ago",
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
    search: "सड़क, घटनाएँ, वाहन खोजें...",
    searchLocation: "स्थान खोजें...",
    noLocations: "कोई स्थान नहीं मिला",
    selectLocation: "स्थान चुनें",
    greeting: "शुभ संध्या, मानस।",
    happening: "आज आपके क्षेत्र में क्या हो रहा है, यहाँ देखें।",
    criticalRoads: "गंभीर सड़कें", openIncidents: "खुली घटनाएँ",
    vehiclesActive: "सक्रिय वाहन", shipmentsToday: "आज के शिपमेंट",
    mapLayers: "मानचित्र परतें", roadConditions: "सड़क की स्थिति", viewAll: "सभी देखें",
    showLess: "कम दिखाएँ", liveStatus: "लाइव स्थिति", viewUpdates: "सभी अपडेट देखें",
    activeAlerts: "सक्रिय अलर्ट", road: "सड़क", district: "जिला", status: "स्थिति",
    updated: "अपडेट", region: "क्षेत्र", dummyMode: "डमी डेटा मोड", language: "भाषा",
    highRisk: "उच्च जोखिम", normal: "सामान्य", moderate: "मध्यम",
    incidentReported: "घटना की सूचना", nearMaibong: "माईबोंग के पास",
    trafficDisruption: "यातायात बाधित", heavyVehicleBreakdown: "भारी वाहन खराब",
    highRiskEvent: "उच्च जोखिम", landslideProbability: "भूस्खलन की संभावना",
    roadClear: "सड़क साफ", normalMovement: "सामान्य आवागमन",
    criticalBlockage: "NH-15 पर गंभीर सड़क अवरोध", heavyRainfall: "भारी बारिश की चेतावनी",
    movementRestored: "वाहन आवागमन बहाल",
    roadConditionsLayer: "सड़क की स्थिति", incidentsLayer: "घटनाएँ",
    vehiclesLayer: "वाहन", weatherLayer: "मौसम", dummyLive: "डमी लाइव डेटा",
    minAgo: "मिनट पहले",
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
    search: "পথ, ঘটনা, যানবাহন বিচাৰক...",
    searchLocation: "স্থান বিচাৰক...",
    noLocations: "কোনো স্থান পোৱা নগ'ল",
    selectLocation: "স্থান বাছনি কৰক",
    greeting: "শুভ সন্ধিয়া, মানস।",
    happening: "আজি আপোনাৰ অঞ্চলত কি হৈ আছে ইয়াত চাওক।",
    criticalRoads: "গুৰুত্বপূৰ্ণ পথ", openIncidents: "মুকলি ঘটনা",
    vehiclesActive: "সক্ৰিয় যানবাহন", shipmentsToday: "আজিৰ চালান",
    mapLayers: "মানচিত্ৰৰ স্তৰ", roadConditions: "পথৰ অৱস্থা", viewAll: "সকলো চাওক",
    showLess: "কম দেখুৱাওক", liveStatus: "লাইভ অৱস্থা", viewUpdates: "সকলো আপডেট চাওক",
    activeAlerts: "সক্ৰিয় সতৰ্কবাণী", road: "পথ", district: "জিলা", status: "অৱস্থা",
    updated: "আপডেট", region: "অঞ্চল", dummyMode: "ডামি ডাটা মোড", language: "ভাষা",
    highRisk: "উচ্চ বিপদ", normal: "স্বাভাৱিক", moderate: "মধ্যম",
    incidentReported: "ঘটনাৰ খবৰ", nearMaibong: "মাইবঙৰ ওচৰত",
    trafficDisruption: "যাতায়াত ব্যাহত", heavyVehicleBreakdown: "গধুৰ যানবাহন বিকল",
    highRiskEvent: "উচ্চ বিপদ", landslideProbability: "ভূমিস্খলনৰ সম্ভাৱনা",
    roadClear: "পথ মুকলি", normalMovement: "স্বাভাৱিক চলাচল",
    criticalBlockage: "NH-15 ত গুৰুত্বপূৰ্ণ পথ অৱৰোধ", heavyRainfall: "ভাৰী বৰষুণৰ সতৰ্কবাণী",
    movementRestored: "যানবাহনৰ চলাচল পুনৰ স্থাপন",
    roadConditionsLayer: "পথৰ অৱস্থা", incidentsLayer: "ঘটনা",
    vehiclesLayer: "যানবাহন", weatherLayer: "বতৰ", dummyLive: "ডামি লাইভ ডাটা",
    minAgo: "মিনিট আগতে",
    notifications: "জাননী", noNotifications: "নতুন জাননী নাই",
    profileMenu: "প্ৰফাইল", accountSettings: "একাউণ্ট ছেটিংছ", logout: "লগ আউট",
    markRead: "সকলো পঢ়া বুলি চিহ্নিত কৰক", changeStatus: "অৱস্থা সলনি কৰক", saved: "সংৰক্ষিত",
    backToHome: "মূল পৃষ্ঠালৈ ঘূৰি যাওক"
  }
};

const translationsData: Record<string, string> = {
  "Incident reported": "incidentReported",
  "Near Maibong": "nearMaibong",
  "Traffic disruption": "trafficDisruption",
  "Heavy vehicle breakdown": "heavyVehicleBreakdown",
  "High risk": "highRiskEvent",
  "Landslide probability": "landslideProbability",
  "Road clear": "roadClear",
  "Normal movement": "normalMovement"
};

const locations = [
  { key: "Dima Hasao", en: "Dima Hasao", hi: "दिमा हसाओ", as: "ডিমা হাছাও" },
  { key: "Karbi Anglong", en: "Karbi Anglong", hi: "কাৰ্বি আংলং", as: "কাৰ্বি আংলং" },
  { key: "Kamrup", en: "Kamrup", hi: "कामरूप", as: "কামৰূপ" },
  { key: "West Karbi Anglong", en: "West Karbi Anglong", hi: "पश्चिम कार्बी आंगलोंग", as: "পশ্চিম কাৰ্বি আংলং" },
  { key: "Haflong", en: "Haflong", hi: "हाफलोंग", as: "হাফলং" },
  { key: "Maibong", en: "Maibong", hi: "माईबोंग", as: "মাইবং" },
  { key: "Lumding", en: "Lumding", hi: "लुमडिंग", as: "লুমডিং" },
  { key: "Golaghat", en: "Golaghat", hi: "गोलाघाट", as: "গোলাঘাট" }
];

function locationName(location: string, language: LanguageType) {
  const item = locations.find(l => l.key === location);
  if (!item) return location;
  return language === "Hindi" ? item.hi : language === "Assamese" ? item.as : item.en;
}

const getAge = (age: string, t: any) => {
  const n = age.match(/\d+/)?.[0] || age;
  return `${n} ${t.minAgo}`;
};

function makeIcon(type: "danger" | "warning" | "success" | "vehicle") {
  const styles = {
    danger: { bg: "#ef5b5b", symbol: "!" },
    warning: { bg: "#f5b832", symbol: "!" },
    success: { bg: "#27885f", symbol: "✓" },
    vehicle: { bg: "#2b8a68", symbol: "●" }
  };
  const s = styles[type] || styles.success;
  return L.divIcon({
    className: "custom-map-marker",
    html: `<span style="background:${s.bg}">${s.symbol}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -12]
  });
}

function MapControls() {
  const map = useMap();
  return (
    <div className="map-controls">
      <button aria-label="Zoom in" onClick={() => map.zoomIn()}><ZoomIn size={19} /></button>
      <button aria-label="Zoom out" onClick={() => map.zoomOut()}><ZoomOut size={19} /></button>
      <button aria-label="Locate" onClick={() => map.setView([25.62, 93.2], 9)}><Crosshair size={19} /></button>
    </div>
  );
}

function StatIcon({ kind }: { kind: "road" | "incident" | "vehicle" | "shipment" }) {
  if (kind === "incident") return <AlertTriangle size={22} />;
  if (kind === "vehicle") return <Truck size={22} />;
  if (kind === "shipment") return <Package size={22} />;
  return <Activity size={22} />;
}

export default function DashboardPage({
  onBackToHome,
  userName = "Manas",
  userEmail = "manas.officer@assam.gov.in",
  userRole = "District Disaster Management Officer",
  onUpdateUser
}: DashboardPageProps) {
  const [active, setActive] = useState("Live Map");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Dima Hasao");
  const [language, setLanguage] = useState<LanguageType>("English");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [layers, setLayers] = useState(false);
  const [showAllRoads, setShowAllRoads] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [layerState, setLayerState] = useState({
    roads: true,
    incidents: true,
    vehicles: true,
    weather: false
  });
  const currentDistrictData = useMemo(() => {
    return districtDataMap[location] || districtDataMap["Dima Hasao"];
  }, [location]);

  const { apiFetch } = useApi();
  const { alerts: realAlerts, unreadCount, connectionState, toastAlert, dismissToast, markAsRead, acknowledgeAlert } = useAlerts();

  const [roadData, setRoadData] = useState<Road[]>(currentDistrictData.roads);

  // ——— Real API data state ———
  const [apiSummary, setApiSummary] = useState<{
    criticalRoads: number; highRiskRoads: number; activeIncidents: number;
    activeVehicles: number; shipmentsToday: number;
  } | null>(null);
  const [apiRoads, setApiRoads] = useState<Road[] | null>(null);
  const [apiAlerts, setApiAlerts] = useState<AlertItem[] | null>(null);

  // Fetch risk summary from API
  const fetchSummary = useCallback(async () => {
    try {
      const res = await apiFetch("/api/risk/summary");
      if (res.ok) {
        const json = await res.json();
        setApiSummary(json.data);
      }
    } catch { /* keep static fallback */ }
  }, [apiFetch]);

  // Fetch prioritized roads from API
  const fetchRoads = useCallback(async () => {
    try {
      const res = await apiFetch("/api/risk/priority?limit=20&sort=risk");
      if (res.ok) {
        const json = await res.json();
        const mapped: Road[] = (json.data || []).map((r: any) => ({
          road: r.name,
          district: r.districtName || "Unknown",
          status: r.priority === "critical" ? "High Risk" as const
               : r.priority === "high" ? "High Risk" as const
               : r.priority === "moderate" ? "Moderate" as const
               : "Normal" as const,
          updated: r.riskUpdatedAt ? timeAgo(r.riskUpdatedAt) : "—",
          lat: r.geometry?.coordinates?.[0]?.[1] || 0,
          lng: r.geometry?.coordinates?.[0]?.[0] || 0,
        }));
        setApiRoads(mapped);
      }
    } catch { /* keep static fallback */ }
  }, [apiFetch]);

  // Fetch alerts from API
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await apiFetch("/api/alerts?limit=5");
      if (res.ok) {
        const json = await res.json();
        const mapped: AlertItem[] = (json.data || []).map((a: any) => ({
          title: a.message || a.type,
          location: a.road_name || a.facility_name || "Region",
          age: a.created_at ? timeAgo(a.created_at) : "—",
          type: a.severity === "critical" || a.severity === "high" ? "danger" as const
             : a.severity === "medium" ? "warning" as const
             : "success" as const,
        }));
        setApiAlerts(mapped);
      }
    } catch { /* keep static fallback */ }
  }, [apiFetch]);

  // Fetch on mount
  useEffect(() => {
    fetchSummary();
    fetchRoads();
    fetchAlerts();
  }, [fetchSummary, fetchRoads, fetchAlerts]);

  // Sync roads: prefer API data, fall back to static district data
  useEffect(() => {
    if (apiRoads && apiRoads.length > 0) {
      setRoadData(apiRoads);
    } else {
      const data = districtDataMap[location] || districtDataMap["Dima Hasao"];
      setRoadData(data.roads);
    }
  }, [location, apiRoads]);

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
    Profile: t.profile,
    "Live Map": t.liveMap,
    Incidents: t.incidents,
    Vehicles: t.vehicles,
    Shipments: t.shipments,
    Resilience: t.resilience,
    Alerts: t.alerts,
    Reports: t.reports,
    Settings: t.settings
  };

  const translatedRoads = useMemo(() => roadData.map(r => ({
    ...r,
    statusText: r.status === "High Risk" ? t.highRisk : r.status === "Moderate" ? t.moderate : t.normal
  })), [roadData, t]);

  const visibleMarkers = useMemo(() => {
    const sourceMarkers = currentDistrictData.markers || defaultMapMarkers;
    return sourceMarkers.filter(marker => layerState[marker.layer]);
  }, [currentDistrictData, layerState]);

  // Dashboard stats: prefer live API data, fall back to static
  const dynamicStats = useMemo(() => {
    if (apiSummary) {
      return {
        criticalRoads: apiSummary.criticalRoads,
        openIncidents: apiSummary.activeIncidents,
        vehiclesActive: apiSummary.activeVehicles,
        shipmentsToday: apiSummary.shipmentsToday
      };
    }
    // Fallback to static data
    const districtStats = currentDistrictData.stats || stats;
    const critical = roadData.filter(r => r.status === "High Risk").length;
    const incidents = visibleMarkers.filter(m => m.layer === "incidents").length + (districtStats[1]?.value ? parseInt(districtStats[1].value, 10) : 10);
    const vehicles = layerState.vehicles ? parseInt(districtStats.find(s => s.icon === "vehicle")?.value || "24", 10) : 0;
    const shipments = parseInt(districtStats.find(s => s.icon === "shipment")?.value || "42", 10);
    return {
      criticalRoads: critical,
      openIncidents: incidents,
      vehiclesActive: vehicles,
      shipmentsToday: shipments
    };
  }, [apiSummary, currentDistrictData, roadData, visibleMarkers, layerState]);

  const filteredRoads = useMemo(() => {
    const q = search.trim().toLowerCase();
    const source = showAllRoads ? translatedRoads : translatedRoads.slice(0, 3);
    if (!q) return source;
    return source.filter(r => `${r.road} ${r.district} ${r.status} ${r.statusText}`.toLowerCase().includes(q));
  }, [search, showAllRoads, translatedRoads]);

  const filteredUpdates = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sourceUpdates = currentDistrictData.liveUpdates || defaultLiveUpdates;
    const translated = sourceUpdates.map(u => ({
      ...u,
      titleText: t[translationsData[u.title]] || u.title,
      detailText: t[translationsData[u.detail]] || u.detail
    }));
    if (!q) return translated;
    return translated.filter(u => `${u.road} ${u.titleText} ${u.detailText}`.toLowerCase().includes(q));
  }, [currentDistrictData, search, t]);

  const displayedAlerts: AlertItem[] = useMemo(() => {
    const sourceAlerts = (apiAlerts && apiAlerts.length > 0) ? apiAlerts : (currentDistrictData.alerts || defaultAlerts);
    return showAllAlerts ? sourceAlerts : sourceAlerts.slice(0, 2);
  }, [apiAlerts, currentDistrictData, showAllAlerts]);

  const markerLabel = (label: string) => {
    if (label === "NH-15 — Landslide risk") return `NH-15 — ${t.landslideProbability}`;
    if (label === "SH-22 — Incident reported") return `SH-22 — ${t.incidentReported}`;
    if (label === "NH-27 — Traffic disruption") return `NH-27 — ${t.trafficDisruption}`;
    if (label === "Heavy rainfall warning") return t.heavyRainfall;
    if (label === "NH-37 — Road clear") return `NH-37 — ${t.roadClear}`;
    return `${t.vehiclesActive}`;
  };

  const changeRoadStatus = (roadName: string, nextStatus: "High Risk" | "Moderate" | "Normal") => {
    setRoadData(current => current.map(road =>
      road.road === roadName
        ? { ...road, status: nextStatus, updated: "just now" }
        : road
    ));
  };

  const toggleLayer = (layer: "roads" | "incidents" | "vehicles" | "weather") => {
    setLayerState(current => ({ ...current, [layer]: !current[layer] }));
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
          <div className="brand-sub">{t.neraSubtitle}</div>
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
              className={`dashboard-nav-item ${active === label ? "active" : ""}`}
              onClick={() => { setActive(label); setMobileOpen(false); }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{navLabel[label]}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`dashboard-nav-item ${active === "Settings" ? "active" : ""}`}
            onClick={() => setActive("Settings")}
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>{t.settings}</span>
          </button>

          <button
            className={`dashboard-nav-item ${active === "Profile" ? "active" : ""}`}
            onClick={() => setActive("Profile")}
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <UserRound size={19} strokeWidth={1.8} />
              <span>{t.profile}</span>
            </div>
            <ChevronRight size={15} style={{ color: "#7a8893" }} />
          </button>
        </div>
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

          <div className="search-box">
            <Search size={19} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} />
            {search && <button onClick={() => setSearch("")}><X size={16} /></button>}
          </div>

          <div className="top-actions">
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
                <span>{locationName(location, language)}</span>
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

            <label className="select-box language">
              <Globe2 size={17} />
              <select value={language} onChange={e => setLanguage(e.target.value as LanguageType)}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Assamese">Assamese</option>
              </select>
              <ChevronDown size={15} />
            </label>

            <div className={`notification-wrap ${notificationOpen ? "open" : ""}`} onClick={e => e.stopPropagation()}>
              <button
                className="notification"
                onClick={() => {
                  setNotificationOpen(v => !v);
                  setProfileOpen(false);
                }}
                aria-expanded={notificationOpen}
              >
                <Bell size={21} />{unreadCount > 0 && <span>{unreadCount}</span>}
              </button>
              {notificationOpen && (
                <div className="notification-menu">
                  <div className="popover-head">
                    <strong>{t.notifications}</strong>
                    <span className={`sse-status ${connectionState}`} style={{ fontSize: "11px", opacity: 0.8 }}>
                      {connectionState === "connected" ? "● Live" : "○ Syncing"}
                    </span>
                  </div>
                  {realAlerts.length > 0 ? (
                    <div className="notification-list" style={{ maxHeight: "320px", overflowY: "auto" }}>
                      {realAlerts.map(alert => (
                        <div
                          className={`notification-item ${alert.is_read ? "read" : "unread"}`}
                          key={alert.id}
                          onClick={() => {
                            if (!alert.is_read) markAsRead(alert.id);
                            if (alert.road_segment_id || alert.type === "incident") {
                              setActive("Incidents");
                              setNotificationOpen(false);
                            }
                          }}
                          style={{ cursor: "pointer", padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div className={`notif-dot ${alert.severity === "critical" || alert.severity === "high" ? "danger" : alert.severity === "medium" ? "warning" : "success"}`}></div>
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: "13px", display: "block" }}>{alert.message}</strong>
                            <span style={{ fontSize: "11px", opacity: 0.7 }}>
                              {alert.road_name || alert.facility_name || alert.district_name || "Region"} • {timeAgo(alert.created_at)}
                            </span>
                          </div>
                          {!alert.is_acknowledged && (
                            <button
                              style={{ fontSize: "10px", padding: "2px 6px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                acknowledgeAlert(alert.id);
                              }}
                            >
                              Ack
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-popover">{t.noNotifications}</div>
                  )}
                </div>
              )}
            </div>

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
                <div className="profile-text"><strong>{userName}</strong><small>{userRole}</small></div>
                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-head">
                    <div className="avatar large">{getInitials(userName)}</div>
                    <div><strong>{userName}</strong><span>{userRole}</span></div>
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
          {active === "Live Map" ? (
            <LiveMapView selectedDistrict={location} onDistrictChange={setLocation} />
          ) : active === "Incidents" ? (
            <IncidentsView selectedDistrict={location} />
          ) : active === "Vehicles" ? (
            <VehiclesView selectedDistrict={location} />
          ) : active === "Shipments" ? (
            <ShipmentsView selectedDistrict={location} />
          ) : active === "Resilience" ? (
            <ResilienceView selectedDistrict={location} onNavigateToReports={() => setActive("Reports")} />
          ) : active === "Evacuation" ? (
            <EvacuationView selectedDistrict={location} />
          ) : active === "Reports" ? (
            <ReportsView selectedDistrict={location} />
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
          ) : (
            <>
              <div className="greeting">
                <h1>{t.greeting}, {userName}</h1>
                <p>{t.happening}</p>
              </div>

              <div className="stats-grid">
                {stats.map((stat) => {
                  const labels: Record<string, string> = {
                    "Critical Roads": t.criticalRoads,
                    "Open Incidents": t.openIncidents,
                    "Vehicles Active": t.vehiclesActive,
                    "Shipments Today": t.shipmentsToday
                  };
                  return (
                    <div className="stat-card" key={stat.label}>
                      <div className={`stat-icon ${stat.tone}`}><StatIcon kind={stat.icon} /></div>
                      <div>
                        <strong>
                          {stat.label === "Critical Roads" ? String(dynamicStats.criticalRoads).padStart(2, "0") :
                            stat.label === "Open Incidents" ? String(dynamicStats.openIncidents).padStart(2, "0") :
                            stat.label === "Vehicles Active" ? String(dynamicStats.vehiclesActive).padStart(2, "0") :
                            String(dynamicStats.shipmentsToday).padStart(2, "0")}
                        </strong>
                        <span>{labels[stat.label]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dashboard-grid">
                <section className="map-card">
                  <div className="map-wrapper">
                    <MapContainer
                      center={currentDistrictData.center}
                      zoom={currentDistrictData.zoom}
                      minZoom={7}
                      maxZoom={13}
                      scrollWheelZoom={true}
                      zoomControl={false}
                      attributionControl={true}
                    >
                      <MapFlyTo center={currentDistrictData.center} zoom={currentDistrictData.zoom} />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {visibleMarkers.map(m => (
                        <Marker key={m.id} position={[m.lat, m.lng]} icon={makeIcon(m.type)}>
                          <Popup><strong>{markerLabel(m.label)}</strong><br />{t.dummyLive}</Popup>
                        </Marker>
                      ))}
                      <MapControls />
                    </MapContainer>

                    <button className="layers-button" onClick={() => setLayers(v => !v)}>
                      <Layers3 size={18} />{t.mapLayers}<ChevronDown size={15} />
                    </button>

                    {layers && (
                      <div className="layers-menu">
                        <label>
                          <input type="checkbox" checked={layerState.roads} onChange={() => toggleLayer("roads")} /> {t.roadConditionsLayer}
                        </label>
                        <label>
                          <input type="checkbox" checked={layerState.incidents} onChange={() => toggleLayer("incidents")} /> {t.incidentsLayer}
                        </label>
                        <label>
                          <input type="checkbox" checked={layerState.vehicles} onChange={() => toggleLayer("vehicles")} /> {t.vehiclesLayer}
                        </label>
                        <label>
                          <input type="checkbox" checked={layerState.weather} onChange={() => toggleLayer("weather")} /> {t.weatherLayer}
                        </label>
                      </div>
                    )}

                    <div className="map-legend">
                      <span><i className="dot green" /> Normal</span>
                      <span><i className="dot yellow" /> Alert</span>
                      <span><i className="dot red" /> High Risk</span>
                      <Truck size={15} />
                      <Gauge size={15} />
                      <Package size={15} />
                    </div>
                  </div>
                </section>

                <section className="live-card dashboard-card">
                  <div className="dashboard-card-title">
                    <h2><span className="live-dot" />{t.liveStatus}</h2>
                  </div>
                  <div className="timeline">
                    {filteredUpdates.map(item => (
                      <div className="timeline-item" key={item.time + item.road}>
                        <div className="timeline-time">{item.time}</div>
                        <div className={`timeline-marker ${item.type}`}></div>
                        <div className="timeline-body">
                          <div className="timeline-road">{item.road}<ChevronRight size={15} /></div>
                          <strong>{item.titleText}</strong>
                          <span>{item.detailText}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="view-updates" onClick={() => setSearch("")}>
                    {t.viewUpdates}<ChevronRight size={16} />
                  </button>
                </section>
              </div>

              <div className="bottom-grid">
                <section className="table-card dashboard-card">
                  <div className="section-head">
                    <h2>{t.roadConditions}</h2>
                    <button onClick={() => setShowAllRoads(v => !v)}>
                      {showAllRoads ? t.showLess : t.viewAll}
                    </button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>{t.road}</th>
                          <th>{t.district}</th>
                          <th>{t.status}</th>
                          <th>{t.updated}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRoads.map(row => (
                          <tr key={row.road}>
                            <td><strong>{row.road}</strong></td>
                            <td>{row.district}</td>
                            <td>
                              <select
                                className={`status status-select ${row.status.toLowerCase().replace(" ", "-")}`}
                                value={row.status}
                                onChange={e => changeRoadStatus(row.road, e.target.value as any)}
                                aria-label={`${t.changeStatus}: ${row.road}`}
                              >
                                <option value="High Risk">{t.highRisk}</option>
                                <option value="Moderate">{t.moderate}</option>
                                <option value="Normal">{t.normal}</option>
                              </select>
                            </td>
                            <td>{row.updated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="alerts-card dashboard-card">
                  <div className="section-head">
                    <h2>{t.activeAlerts}</h2>
                    <button onClick={() => setShowAllAlerts(v => !v)}>
                      {showAllAlerts ? t.showLess : t.viewAll}
                    </button>
                  </div>
                  <div className="alerts-list">
                    {displayedAlerts.map(alert => {
                      const title = alert.title.includes("Critical") ? t.criticalBlockage :
                        alert.title.includes("Heavy") ? t.heavyRainfall : t.movementRestored;
                      return (
                        <div className="alert-row" key={alert.title}>
                          <div className={`alert-icon ${alert.type}`}>
                            {alert.type === "danger" ? <AlertTriangle size={18} /> : alert.type === "warning" ? <AlertTriangle size={18} /> : <CircleDot size={18} />}
                          </div>
                          <div className="alert-content">
                            <strong>{title}</strong>
                            <span>{alert.location}</span>
                          </div>
                          <time>{getAge(alert.age, t)}</time>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <footer className="dashboard-footer">
                <span>NERA Dashboard • {t.dummyMode}</span>
                <span>{t.region}: {locationName(location, language)} • {t.language}: {language}</span>
              </footer>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
