import { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Minus,
  Navigation
} from "lucide-react";

export default function CitizenEmergencyMapView() {
  const [activeFilter, setActiveFilter] = useState<"incidents" | "weather" | "roads">("incidents");
  const [selectedIncident, setSelectedIncident] = useState<any>({
    title: "Landslide Warning",
    location: "Karbi Anglong, Assam",
    severity: "Critical",
    description: "Rock and mudslide has obstructed single-lane movement on NH-27 near Km 48."
  });

  const alerts = [
    { title: "Landslide on NH-27", location: "Karbi Anglong, Assam", time: "2 hrs ago", type: "critical" },
    { title: "Heavy Rainfall", location: "Meghalaya", time: "3 hrs ago", type: "weather" },
    { title: "Flood Warning", location: "Cachar, Assam", time: "5 hrs ago", type: "flood" },
    { title: "Road Blockage", location: "Dima Hasao, Assam", time: "6 hrs ago", type: "closure" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 1. Header Filter Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setActiveFilter("incidents")}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              border: "none",
              background: activeFilter === "incidents" ? "#16a34a" : "#f1f5f9",
              color: activeFilter === "incidents" ? "#ffffff" : "#475569",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Incidents
          </button>

          <button
            onClick={() => setActiveFilter("weather")}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              border: "none",
              background: activeFilter === "weather" ? "#16a34a" : "#f1f5f9",
              color: activeFilter === "weather" ? "#ffffff" : "#475569",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Weather
          </button>

          <button
            onClick={() => setActiveFilter("roads")}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              border: "none",
              background: activeFilter === "roads" ? "#16a34a" : "#f1f5f9",
              color: activeFilter === "roads" ? "#ffffff" : "#475569",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Road Status
          </button>
        </div>

        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: "700", color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "4px 12px", borderRadius: "16px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a" }} /> Live Updates
        </span>
      </div>

      {/* 2. Main 2-Column Map Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px" }}>
        {/* Left: Interactive SVG Map */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px", position: "relative", minHeight: "440px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Zoom controls */}
          <div style={{ position: "absolute", top: "24px", left: "24px", zIndex: 10, display: "flex", flexDirection: "column", gap: "4px" }}>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#ffffff", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700 }}>
              <Plus size={16} />
            </button>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#ffffff", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700 }}>
              <Minus size={16} />
            </button>
            <button style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#ffffff", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: "4px" }}>
              <Navigation size={15} color="#2563eb" />
            </button>
          </div>

          {/* SVG Map Canvas */}
          <div style={{ width: "100%", height: "100%", minHeight: "400px", background: "#f0fdf4", borderRadius: "10px", position: "relative", border: "1px solid #dcfce7" }}>
            <svg viewBox="0 0 550 400" style={{ width: "100%", height: "100%" }}>
              {/* Region Outline */}
              <path
                d="M 60 140 Q 150 80 320 100 T 480 80 T 520 180 C 500 280 420 370 280 370 C 140 370 60 260 60 140 Z"
                fill="#ecfdf5"
                stroke="#86efac"
                strokeWidth="2"
              />

              {/* State Borders */}
              <path d="M 120 180 Q 220 180 300 210" fill="none" stroke="#bbf7d0" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M 300 210 Q 380 250 440 280" fill="none" stroke="#bbf7d0" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M 240 230 Q 260 340 280 360" fill="none" stroke="#bbf7d0" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* State Labels */}
              <text x="320" y="90" fill="#047857" fontSize="11" fontWeight="700">Arunachal Pradesh</text>
              <text x="210" y="160" fill="#047857" fontSize="13" fontWeight="800">Assam</text>
              <text x="140" y="240" fill="#047857" fontSize="11" fontWeight="700">Meghalaya</text>
              <text x="370" y="200" fill="#047857" fontSize="11" fontWeight="700">Nagaland</text>
              <text x="360" y="260" fill="#047857" fontSize="11" fontWeight="700">Manipur</text>
              <text x="170" y="310" fill="#047857" fontSize="10.5" fontWeight="700">Tripura</text>
              <text x="265" y="325" fill="#047857" fontSize="10.5" fontWeight="700">Mizoram</text>

              {/* Highway Corridors */}
              <path d="M 100 170 Q 220 140 360 190 T 460 210" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 230 150 Q 270 230 330 290" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

              {/* Incident Map Markers */}
              {/* Critical Alert Pin 1 (Karbi Anglong) */}
              <g transform="translate(265, 185)" style={{ cursor: "pointer" }} onClick={() => setSelectedIncident({ title: "Landslide Warning", location: "Karbi Anglong, Assam", severity: "Critical", description: "Rock and mudslide has obstructed single-lane movement on NH-27 near Km 48." })}>
                <circle cx="0" cy="0" r="14" fill="#fee2e2" />
                <polygon points="0,-8 7,5 -7,5" fill="#dc2626" />
              </g>

              {/* Critical Alert Pin 2 (Dima Hasao) */}
              <g transform="translate(295, 230)" style={{ cursor: "pointer" }} onClick={() => setSelectedIncident({ title: "Road Blockage", location: "Dima Hasao, Assam", severity: "Critical", description: "Debris flow across Haflong corridor." })}>
                <circle cx="0" cy="0" r="12" fill="#fee2e2" />
                <polygon points="0,-7 6,4 -6,4" fill="#dc2626" />
              </g>

              {/* High Risk Pin (Nagaland border) */}
              <g transform="translate(380, 175)" style={{ cursor: "pointer" }} onClick={() => setSelectedIncident({ title: "High Risk Corridor", location: "Nagaland Border", severity: "High Risk", description: "Severe heavy rainfall with waterlogging." })}>
                <circle cx="0" cy="0" r="12" fill="#fef3c7" />
                <polygon points="0,-7 6,4 -6,4" fill="#d97706" />
              </g>

              {/* Weather Alert Pin (Meghalaya) */}
              <g transform="translate(180, 235)" style={{ cursor: "pointer" }} onClick={() => setSelectedIncident({ title: "Heavy Rainfall Alert", location: "Shillong, Meghalaya", severity: "Weather Alert", description: "IMD 24h heavy rainfall warning." })}>
                <circle cx="0" cy="0" r="12" fill="#dbeafe" />
                <circle cx="0" cy="0" r="5" fill="#2563eb" />
              </g>
            </svg>

            {/* Interactive Popover Popup (Matching Figma Screenshot 4) */}
            {selectedIncident && (
              <div
                style={{
                  position: "absolute",
                  top: "110px",
                  left: "170px",
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                  border: "1px solid #e2e8f0",
                  width: "200px",
                  zIndex: 20
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertTriangle size={14} color="#dc2626" />
                  </div>
                  <div>
                    <strong style={{ fontSize: "12.5px", color: "#0f172a", display: "block" }}>{selectedIncident.title}</strong>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{selectedIncident.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Full report details for ${selectedIncident.location}: ${selectedIncident.description}`)}
                  style={{ marginTop: "8px", background: "transparent", border: "none", color: "#16a34a", fontSize: "11.5px", fontWeight: "700", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                >
                  View Details →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Alerts + Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Live Alerts Card */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Live Alerts
              </h3>
              <button
                onClick={() => alert("Showing all 18 active regional hazard alerts.")}
                style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
              >
                View All
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: a.type === "critical" ? "#fee2e2" : a.type === "weather" ? "#fef3c7" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <AlertTriangle size={14} color={a.type === "critical" ? "#dc2626" : a.type === "weather" ? "#d97706" : "#2563eb"} />
                    </div>
                    <div>
                      <strong style={{ fontSize: "12.5px", color: "#0f172a", display: "block" }}>{a.title}</strong>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>{a.location}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Legend Card */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 12px 0" }}>
              Legend
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", fontWeight: "600", color: "#334155" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#ef4444", fontSize: "14px" }}>▲</span>
                <span>Critical Incident</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#f59e0b", fontSize: "14px" }}>⚑</span>
                <span>High Risk</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#3b82f6", fontSize: "14px" }}>🌧️</span>
                <span>Weather Alert</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#ef4444", fontSize: "14px" }}>⛔</span>
                <span>Road Closure</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#16a34a", fontSize: "14px" }}>●</span>
                <span>Normal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
