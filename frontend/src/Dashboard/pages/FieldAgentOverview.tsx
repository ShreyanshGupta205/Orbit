import { useState } from "react";
import {
  ClipboardList,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Camera,
  RefreshCw,
  ArrowRight,
  FileText
} from "lucide-react";

interface FieldAgentOverviewProps {
  userName?: string;
  userRole?: string;
  currentRoute?: string;
  onNavigateTab?: (tab: string) => void;
  onOpenReportModal?: () => void;
}

export default function FieldAgentOverview({
  userName = "Rahul",
  userRole: _userRole = "Field Agent",
  currentRoute = "NH-27",
  onNavigateTab,
  onOpenReportModal
}: FieldAgentOverviewProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "critical" | "moderate">("all");

  const nearbyIncidents = [
    {
      id: 1,
      title: "Landslide – NH-27 (12 km)",
      time: "10:12 AM",
      location: "Dima Hasao, Assam",
      severity: "High",
      type: "critical"
    },
    {
      id: 2,
      title: "Road Blockage – NH-37 (18 km)",
      time: "09:48 AM",
      location: "Karbi Anglong, Assam",
      severity: "Moderate",
      type: "moderate"
    },
    {
      id: 3,
      title: "Flood – NH-6 (25 km)",
      time: "09:30 AM",
      location: "Cachar, Assam",
      severity: "High",
      type: "critical"
    }
  ];

  const filteredIncidents = activeFilter === "all"
    ? nearbyIncidents
    : activeFilter === "critical"
    ? nearbyIncidents.filter(i => i.type === "critical")
    : nearbyIncidents.filter(i => i.type === "moderate");

  return (
    <div className="field-agent-home-root" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Greeting Banner */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            background: "#f0fdf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            flexShrink: 0
          }}
        >
          👷
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.4px" }}>
            Good Morning, {userName}!
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Track and report incidents. Keep the North East safer.
          </p>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {/* Card 1: Assigned Tasks */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ClipboardList size={20} color="#16a34a" />
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Assigned Tasks</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
            5
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab("Incident Report")}
            style={{ marginTop: "14px", background: "transparent", border: "none", color: "#16a34a", fontSize: "12.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", padding: 0, cursor: "pointer" }}
          >
            View Details <ArrowRight size={13} />
          </button>
        </div>

        {/* Card 2: Nearby Incidents */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={20} color="#d97706" />
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Nearby Incidents</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
            3
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab("Incident Report")}
            style={{ marginTop: "14px", background: "transparent", border: "none", color: "#d97706", fontSize: "12.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", padding: 0, cursor: "pointer" }}
          >
            View Details <ArrowRight size={13} />
          </button>
        </div>

        {/* Card 3: Current Route */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={20} color="#2563eb" />
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Current Route</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
            {currentRoute}
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab("Incident Report")}
            style={{ marginTop: "14px", background: "transparent", border: "none", color: "#2563eb", fontSize: "12.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", padding: 0, cursor: "pointer" }}
          >
            View Details <ArrowRight size={13} />
          </button>
        </div>

        {/* Card 4: Pending Reports */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={20} color="#9333ea" />
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Pending Reports</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
            2
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab("Offline / Sync")}
            style={{ marginTop: "14px", background: "transparent", border: "none", color: "#9333ea", fontSize: "12.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px", padding: 0, cursor: "pointer" }}
          >
            View Details <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 3. Middle Row: Nearby Incidents (List) + Map View */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "16px" }}>
        {/* Left: Nearby Incidents List */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Nearby Incidents
            </h3>
            <button
              onClick={() => setActiveFilter(f => f === "all" ? "critical" : "all")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                style={{
                  background: inc.type === "critical" ? "#fff5f5" : "#fffdf0",
                  border: `1px solid ${inc.type === "critical" ? "#fecaca" : "#fef08a"}`,
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: inc.type === "critical" ? "#fee2e2" : "#fef3c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <AlertTriangle size={18} color={inc.type === "critical" ? "#dc2626" : "#d97706"} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>
                      {inc.title}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                      <span>{inc.time}</span> • <span>📍 {inc.location}</span>
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "700",
                    background: inc.severity === "High" ? "#fee2e2" : "#fef3c7",
                    color: inc.severity === "High" ? "#991b1b" : "#92400e"
                  }}
                >
                  {inc.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Map View Card */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Map View
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Incident Report")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View Full Map
            </button>
          </div>

          {/* Styled Geographic View */}
          <div style={{ position: "relative", height: "230px", width: "100%", borderRadius: "10px", overflow: "hidden", background: "#f0fdf4", border: "1px solid #dcfce7" }}>
            <svg viewBox="0 0 450 230" style={{ width: "100%", height: "100%" }}>
              {/* Region Contour */}
              <path
                d="M 40 100 Q 120 70 220 90 T 360 80 T 420 130 C 400 190 320 220 200 220 C 100 220 40 170 40 100 Z"
                fill="#ecfdf5"
                stroke="#bbf7d0"
                strokeWidth="1.5"
              />

              {/* Road Lines */}
              <path d="M 60 110 Q 150 90 250 120 T 380 140" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              <path d="M 180 100 Q 240 130 280 190" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

              {/* Towns */}
              <text x="260" y="80" fill="#0f172a" fontSize="11" fontWeight="700">Guwahati</text>
              <circle cx="250" cy="77" r="4" fill="#16a34a" />

              <text x="230" y="200" fill="#334155" fontSize="10.5" fontWeight="600">Shillong</text>
              <circle cx="220" cy="197" r="3.5" fill="#16a34a" />

              {/* Critical Alert Triangles */}
              <polygon points="170,120 176,132 164,132" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <polygon points="340,140 346,152 334,152" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

              {/* Moderate Alert Triangle */}
              <polygon points="250,115 256,127 244,127" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" />

              {/* Field Agent Current Location Beacon */}
              <g transform="translate(250, 130)">
                <circle cx="0" cy="0" r="10" fill="#3b82f6" fillOpacity="0.25" />
                <circle cx="0" cy="0" r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </g>
            </svg>

            {/* Bottom Legend */}
            <div style={{ position: "absolute", bottom: "8px", left: "10px", background: "rgba(255,255,255,0.92)", padding: "4px 10px", borderRadius: "16px", border: "1px solid #cbd5e1", display: "flex", gap: "10px", fontSize: "11px", fontWeight: "600", color: "#334155" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ color: "#ef4444" }}>▲</span> Critical</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ color: "#eab308" }}>▲</span> Moderate</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ color: "#16a34a" }}>●</span> Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom 3 Primary Action Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px" }}>
        {/* Button 1: Report Incident */}
        <button
          onClick={() => {
            if (onOpenReportModal) onOpenReportModal();
            else if (onNavigateTab) onNavigateTab("Incident Report");
          }}
          style={{
            background: "#16a34a",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(22,163,74,0.35)",
            transition: "transform 0.15s ease"
          }}
        >
          <FileText size={18} />
          Report Incident
        </button>

        {/* Button 2: Upload Media */}
        <button
          onClick={() => onNavigateTab && onNavigateTab("Media")}
          style={{
            background: "#ffffff",
            color: "#1e293b",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <Camera size={18} color="#16a34a" />
          Upload Media
        </button>

        {/* Button 3: Go Offline / Check Sync */}
        <button
          onClick={() => onNavigateTab && onNavigateTab("Offline / Sync")}
          style={{
            background: "#ffffff",
            color: "#1e293b",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <RefreshCw size={18} color="#16a34a" />
          Go Offline / Check Sync
        </button>
      </div>
    </div>
  );
}
