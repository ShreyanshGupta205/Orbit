import { useState } from "react";
import {
  Server,
  RefreshCw
} from "lucide-react";

export default function AdminSystemsView() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const systems = [
    { name: "NERA Core API Gateway", status: "Healthy", uptime: "99.98%", latency: "42ms", host: "orbit-backend-yreh.onrender.com" },
    { name: "PostgreSQL GIS Cluster", status: "Healthy", uptime: "99.95%", latency: "18ms", host: "aws-ap-south-1.db" },
    { name: "Real-time SSE Notification Hub", status: "Healthy", uptime: "99.99%", latency: "12ms", host: "sse.nera.gov.in" },
    { name: "Media & Cloud Storage CDN", status: "Warning", uptime: "98.40%", latency: "148ms", host: "cdn.nera.gov.in" },
    { name: "Geospatial Routing Engine (OSRM)", status: "Healthy", uptime: "99.92%", latency: "64ms", host: "routing.nera.gov.in" },
    { name: "IMD Weather Sync Worker", status: "Healthy", uptime: "100.0%", latency: "85ms", host: "worker-imd.internal" }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Server size={24} color="#2563eb" />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
              Systems Health &amp; Infrastructure
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Live telemetry across microservices, database clusters, and geospatial routing engines
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          style={{
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            padding: "9px 16px",
            fontSize: "13px",
            fontWeight: "700",
            color: "#334155",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <RefreshCw size={15} color="#2563eb" className={isRefreshing ? "spin" : ""} /> Refresh Telemetry
        </button>
      </div>

      {/* Systems Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
        {systems.map((s, i) => (
          <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <strong style={{ fontSize: "14.5px", color: "#0f172a" }}>{s.name}</strong>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: "700",
                    background: s.status === "Healthy" ? "#dcfce7" : "#fef3c7",
                    color: s.status === "Healthy" ? "#166534" : "#92400e",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.status === "Healthy" ? "#16a34a" : "#d97706" }} />
                  {s.status}
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{s.host}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", fontSize: "12.5px" }}>
              <div>
                <span style={{ color: "#94a3b8", fontSize: "11px", display: "block" }}>Uptime</span>
                <strong style={{ color: "#0f172a" }}>{s.uptime}</strong>
              </div>
              <div>
                <span style={{ color: "#94a3b8", fontSize: "11px", display: "block" }}>Latency</span>
                <strong style={{ color: "#0f172a" }}>{s.latency}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
