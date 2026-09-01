import { useState, useEffect } from "react";
import {
  Truck,
  Package,
  Clock,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Plus,
  Minus,
  Crosshair,
  Info
} from "lucide-react";

interface LogisticsOverviewProps {
  userName?: string;
  userRole?: string;
  selectedDistrict?: string;
  onNavigateTab?: (tab: string) => void;
}

export default function LogisticsOverview({
  userName: _userName = "Rahul Sharma",
  userRole: _userRole = "Logistics Operator",
  selectedDistrict: _selectedDistrict = "Assam",
  onNavigateTab
}: LogisticsOverviewProps) {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      };
      const formatted = now.toLocaleDateString("en-GB", options);
      setCurrentDateTime(formatted.replace(",", ""));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Top 5 Stats
  const topStats = [
    {
      id: "active-vehicles",
      value: "248",
      label: "Active Vehicles",
      delta: "↑ 12% from yesterday",
      deltaType: "positive",
      icon: Truck,
      bgTone: "#f0fdf4",
      iconColor: "#16a34a"
    },
    {
      id: "shipments-in-transit",
      value: "156",
      label: "Shipments in Transit",
      delta: "↑ 8% from yesterday",
      deltaType: "positive",
      icon: Package,
      bgTone: "#eff6ff",
      iconColor: "#2563eb"
    },
    {
      id: "delayed-shipments",
      value: "12",
      label: "Delayed Shipments",
      delta: "↓ 20% from yesterday",
      deltaType: "warning",
      icon: Clock,
      bgTone: "#fffbeb",
      iconColor: "#d97706"
    },
    {
      id: "routes-at-risk",
      value: "7",
      label: "Routes at Risk",
      delta: "↑ 2 from yesterday",
      deltaType: "danger",
      icon: AlertTriangle,
      bgTone: "#fef2f2",
      iconColor: "#dc2626"
    },
    {
      id: "critical-cargo",
      value: "34",
      label: "Critical Cargo",
      delta: "↑ 6% from yesterday",
      deltaType: "positive",
      icon: ShieldCheck,
      bgTone: "#f0fdf4",
      iconColor: "#16a34a"
    }
  ];

  // Recent Shipments
  const recentShipments = [
    { id: "SHP-1023", origin: "Guwahati", destination: "Shillong", cargo: "Medical Supplies", eta: "2h 30m", status: "In Transit" },
    { id: "SHP-1047", origin: "Silchar", destination: "Imphal", cargo: "Food Items", eta: "4h 10m", status: "Delayed" },
    { id: "SHP-1051", origin: "Dibrugarh", destination: "Aizawl", cargo: "Construction Material", eta: "6h 00m", status: "In Transit" },
    { id: "SHP-1063", origin: "Kohima", destination: "Dimapur", cargo: "Essential Goods", eta: "3h 20m", status: "In Transit" }
  ];

  // Alerts & Updates
  const alertsList = [
    {
      id: 1,
      title: "Heavy Rainfall Alert – Assam",
      desc: "High rainfall expected in next 6 hours",
      time: "1 hr ago",
      type: "danger"
    },
    {
      id: 2,
      title: "NH-27 Blockage Risk – Nagaland",
      desc: "Landslide probability high",
      time: "2 hrs ago",
      type: "warning"
    },
    {
      id: 3,
      title: "Weather Update – Meghalaya",
      desc: "Moderate to heavy rain expected",
      time: "3 hrs ago",
      type: "info"
    }
  ];

  return (
    <div className="logistics-overview-root" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header Greeting & Live Clock */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
            Logistics Operator Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Track and manage logistics movement across the North East region.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ffffff", border: "1px solid #e2e8f0", padding: "8px 14px", borderRadius: "10px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
            {currentDateTime || "20 May 2025, 10:32 AM"}
          </span>
          <button
            onClick={handleRefresh}
            title="Refresh Logistics Data"
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#16a34a", padding: "2px" }}
          >
            <RefreshCw size={14} className={isRefreshing ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* 2. Top 5 KPI Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {topStats.map((stat) => {
          const IconComp = stat.icon;
          return (
            <div
              key={stat.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
              }}
            >
              {/* Icon Box */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: stat.bgTone,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <IconComp size={22} color={stat.iconColor} />
              </div>

              {/* Value, Label & Delta */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                  {stat.label}
                </span>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1", margin: "2px 0" }}>
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: stat.deltaType === "danger" ? "#dc2626" : stat.deltaType === "warning" ? "#d97706" : "#16a34a"
                  }}
                >
                  {stat.delta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Row: Live Vehicle Tracking (Map) + Recent Shipments (Table) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
        {/* Left: Live Vehicle Tracking Map Card */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Live Vehicle Tracking
            </h3>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", padding: "3px 8px", borderRadius: "12px", background: "#f0fdf4", color: "#166534", fontSize: "11.5px", fontWeight: "700" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a" }} /> Live
            </span>
          </div>

          {/* Interactive Map Visual */}
          <div style={{ position: "relative", height: "290px", width: "100%", borderRadius: "10px", overflow: "hidden", background: "#f0fdf4", border: "1px solid #dcfce7" }}>
            {/* Map Controls */}
            <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 10 }}>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.3))}
                style={{ width: "28px", height: "28px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#334155" }}
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.9))}
                style={{ width: "28px", height: "28px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#334155" }}
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                style={{ width: "28px", height: "28px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#334155" }}
              >
                <Crosshair size={14} />
              </button>
            </div>

            {/* SVG Regional Map Representation */}
            <svg
              viewBox="0 0 500 290"
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.2s ease"
              }}
            >
              {/* Northeast States Background Outlines */}
              {/* Assam & Bordering Regions */}
              <path
                d="M 60 130 C 100 120 180 100 280 105 C 330 90 410 100 450 150 C 430 210 350 250 250 250 C 180 260 100 220 60 130 Z"
                fill="#e8f7ee"
                stroke="#bbf7d0"
                strokeWidth="1.5"
              />

              {/* State Labels */}
              <text x="210" y="110" fill="#334155" fontSize="11" fontWeight="700">Assam</text>
              <text x="320" y="70" fill="#64748b" fontSize="10.5" fontWeight="600">Arunachal Pradesh</text>
              <text x="360" y="145" fill="#64748b" fontSize="10.5" fontWeight="600">Nagaland</text>
              <text x="170" y="200" fill="#64748b" fontSize="10.5" fontWeight="600">Meghalaya</text>
              <text x="340" y="210" fill="#64748b" fontSize="10.5" fontWeight="600">Manipur</text>

              {/* Highway Routes */}
              {/* Normal Route (Green) */}
              <path d="M 80 130 Q 140 100 230 110 T 360 85 T 440 120" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />

              {/* Moderate Route (Yellow) */}
              <path d="M 120 150 Q 210 130 280 160 T 380 155" fill="none" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />

              {/* High Risk Route (Orange) */}
              <path d="M 150 180 Q 240 160 300 210 T 420 220" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />

              {/* Critical Route (Red) */}
              <path d="M 280 160 Q 330 170 380 200" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="5,3" strokeLinecap="round" />

              {/* Vehicle Icons on Map */}
              <g transform="translate(190, 95)">
                <circle cx="10" cy="10" r="10" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="5" y="14" fill="#ffffff" fontSize="9" fontWeight="bold">🚚</text>
              </g>

              <g transform="translate(340, 75)">
                <circle cx="10" cy="10" r="10" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                <text x="5" y="14" fill="#ffffff" fontSize="9" fontWeight="bold">🚚</text>
              </g>

              <g transform="translate(120, 140)">
                <circle cx="10" cy="10" r="10" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                <text x="6" y="14" fill="#ffffff" fontSize="9" fontWeight="bold">!</text>
              </g>

              <g transform="translate(260, 145)">
                <circle cx="10" cy="10" r="10" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
                <text x="6" y="14" fill="#ffffff" fontSize="9" fontWeight="bold">!</text>
              </g>
            </svg>

            {/* Right Status Overlay Legend Box */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(6px)",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "11px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div>
                <strong style={{ fontSize: "11.5px", color: "#0f172a", display: "block", marginBottom: "4px" }}>Vehicle Status</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", color: "#334155" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} /> Active (248)</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#eab308" }} /> Delayed (12)</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#94a3b8" }} /> Idle (6)</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444" }} /> Stopped (3)</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "6px" }}>
                <strong style={{ fontSize: "11.5px", color: "#0f172a", display: "block", marginBottom: "4px" }}>Road Status</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", color: "#334155" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "3px", background: "#22c55e", borderRadius: "2px" }} /> Normal</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "3px", background: "#eab308", borderRadius: "2px" }} /> Moderate</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "3px", background: "#f97316", borderRadius: "2px" }} /> High Risk</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "3px", background: "#ef4444", borderRadius: "2px" }} /> Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Shipments Card */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Recent Shipments
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Shipments")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View All
            </button>
          </div>

          <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", color: "#64748b", textAlign: "left", fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "8px 4px", fontWeight: "600" }}>Shipment ID</th>
                <th style={{ padding: "8px 4px", fontWeight: "600" }}>Origin</th>
                <th style={{ padding: "8px 4px", fontWeight: "600" }}>Destination</th>
                <th style={{ padding: "8px 4px", fontWeight: "600" }}>Cargo</th>
                <th style={{ padding: "8px 4px", fontWeight: "600" }}>ETA</th>
                <th style={{ padding: "8px 4px", fontWeight: "600" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "11px 4px", fontWeight: "700", color: "#0f172a" }}>{s.id}</td>
                  <td style={{ padding: "11px 4px", color: "#475569" }}>{s.origin}</td>
                  <td style={{ padding: "11px 4px", color: "#475569" }}>{s.destination}</td>
                  <td style={{ padding: "11px 4px", color: "#0f172a", fontWeight: "500" }}>{s.cargo}</td>
                  <td style={{ padding: "11px 4px", color: "#64748b" }}>{s.eta}</td>
                  <td style={{ padding: "11px 4px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background: s.status === "In Transit" ? "#dcfce7" : "#fef3c7",
                        color: s.status === "In Transit" ? "#166534" : "#92400e"
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Middle-Lower 3-Column Grid: Vehicle Status + Alerts & Updates + Route Risk Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.2fr 1fr", gap: "16px" }}>
        {/* Card 1: Vehicle Status (Donut + Breakdown) */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Vehicle Status
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Vehicles")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View All
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            {/* Donut Chart SVG */}
            <div style={{ position: "relative", width: "110px", height: "110px", flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                {/* Background Ring */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                {/* Green Segment (82%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="72.1 88" strokeDashoffset="0" />
                {/* Yellow Segment (5%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="4.4 88" strokeDashoffset="-72.1" />
                {/* Gray Segment (3%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="2.6 88" strokeDashoffset="-76.5" />
                {/* Red Segment (1%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="0.9 88" strokeDashoffset="-79.1" />
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <strong style={{ fontSize: "17px", color: "#0f172a", fontWeight: "800", lineHeight: "1" }}>248</strong>
                <span style={{ fontSize: "10px", color: "#64748b" }}>Vehicles</span>
              </div>
            </div>

            {/* Middle Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "11.5px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} /> Active – 248 (82%)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308" }} /> Delayed – 12 (5%)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#94a3b8" }} /> Idle – 6 (3%)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} /> Stopped – 3 (1%)
              </span>
            </div>

            {/* Right: Vehicle Type breakdown */}
            <div style={{ borderLeft: "1px solid #f1f5f9", paddingLeft: "12px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "11.5px" }}>
              <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Vehicle Type</span>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <span style={{ color: "#475569" }}>🚚 Trucks</span>
                <strong style={{ color: "#0f172a" }}>120 (48%)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <span style={{ color: "#475569" }}>🚐 LCVs</span>
                <strong style={{ color: "#0f172a" }}>76 (31%)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <span style={{ color: "#475569" }}>🚗 Vans</span>
                <strong style={{ color: "#0f172a" }}>40 (16%)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <span style={{ color: "#475569" }}>🚛 Others</span>
                <strong style={{ color: "#0f172a" }}>12 (5%)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Alerts & Updates */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Alerts &amp; Updates
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Alerts")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {alertsList.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "6px 0",
                  borderBottom: "1px solid #f8fafc"
                }}
              >
                <div style={{ marginTop: "2px", flexShrink: 0 }}>
                  {item.type === "danger" && (
                    <span style={{ display: "inline-flex", width: "22px", height: "22px", borderRadius: "5px", background: "#fee2e2", alignItems: "center", justifyContent: "center" }}>
                      <AlertTriangle size={13} color="#dc2626" />
                    </span>
                  )}
                  {item.type === "warning" && (
                    <span style={{ display: "inline-flex", width: "22px", height: "22px", borderRadius: "5px", background: "#fef3c7", alignItems: "center", justifyContent: "center" }}>
                      <AlertTriangle size={13} color="#d97706" />
                    </span>
                  )}
                  {item.type === "info" && (
                    <span style={{ display: "inline-flex", width: "22px", height: "22px", borderRadius: "5px", background: "#e0f2fe", alignItems: "center", justifyContent: "center" }}>
                      <Info size={13} color="#0284c7" />
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    {item.desc}
                  </div>
                </div>

                <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0, marginTop: "2px" }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Route Risk Overview */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Route Risk Overview
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Route Planner")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View All
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "14px", marginTop: "6px" }}>
            {/* Donut Chart SVG */}
            <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                {/* Critical (1/7 = 14.3%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="12.6 88" strokeDashoffset="0" />
                {/* High (2/7 = 28.6%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="25.1 88" strokeDashoffset="-12.6" />
                {/* Moderate (2/7 = 28.6%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="25.1 88" strokeDashoffset="-37.7" />
                {/* Low (2/7 = 28.6%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="25.1 88" strokeDashoffset="-62.8" />
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "800", lineHeight: "1" }}>7</strong>
                <span style={{ fontSize: "9.5px", color: "#64748b", textAlign: "center" }}>Routes<br />At Risk</span>
              </div>
            </div>

            {/* Legend & Numbers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444" }} /> Critical</span>
                <strong style={{ color: "#0f172a" }}>1</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f97316" }} /> High</span>
                <strong style={{ color: "#0f172a" }}>2</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#eab308" }} /> Moderate</span>
                <strong style={{ color: "#0f172a" }}>2</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#334155" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }} /> Low</span>
                <strong style={{ color: "#0f172a" }}>2</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Quick Action Cards (3-Column Layout) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        {/* Quick Action 1: Route Planner */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "18px" }}>🛣️</span>
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Route Planner</h4>
            </div>
            <p style={{ fontSize: "12.5px", color: "#475569", margin: "0 0 16px 0", maxWidth: "80%" }}>
              Plan and compare optimal routes for safe and efficient logistics movement.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab("Route Planner")}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid #16a34a",
              background: "#ffffff",
              color: "#166534",
              fontWeight: "600",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Go to Page <ArrowRight size={13} />
          </button>
        </div>

        {/* Quick Action 2: Vehicles */}
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Truck size={20} color="#2563eb" />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Vehicles</h4>
            </div>
            <p style={{ fontSize: "12.5px", color: "#475569", margin: "0 0 16px 0", maxWidth: "80%" }}>
              Monitor and manage vehicle movement across the region.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab("Vehicles")}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid #2563eb",
              background: "#ffffff",
              color: "#1e40af",
              fontWeight: "600",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Go to Page <ArrowRight size={13} />
          </button>
        </div>

        {/* Quick Action 3: Shipments */}
        <div
          style={{
            background: "#faf5ff",
            border: "1px solid #e9d5ff",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={20} color="#9333ea" />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Shipments</h4>
            </div>
            <p style={{ fontSize: "12.5px", color: "#475569", margin: "0 0 16px 0", maxWidth: "80%" }}>
              Track and manage shipments in real time.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab("Shipments")}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid #9333ea",
              background: "#ffffff",
              color: "#6b21a8",
              fontWeight: "600",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Go to Page <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
