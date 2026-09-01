import { useState } from "react";
import {
  AlertTriangle,
  CloudRain,
  PhoneCall,
  ShieldAlert,
  ChevronRight,
  MapPin,
  Compass,
  FileEdit,
  CloudLightning,
  Trees
} from "lucide-react";

interface CitizenOverviewProps {
  userName?: string;
  onNavigateTab?: (tab: string) => void;
  onOpenReport?: () => void;
}

export default function CitizenOverview({
  userName: _userName = "Rahul",
  onNavigateTab,
  onOpenReport
}: CitizenOverviewProps) {
  const [showHelplineModal, setShowHelplineModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const helplines = [
    { name: "State Emergency Operation Centre (Assam)", number: "1070 / 1079" },
    { name: "National Disaster Response Force (NDRF)", number: "011-24363260" },
    { name: "Police Emergency Helpline", number: "112" },
    { name: "Ambulance / Medical Response", number: "108" },
    { name: "Fire & Rescue Services", number: "101" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* 1. Top Emergency Warning Banner */}
      <div
        style={{
          background: "#fff1f2",
          border: "1px solid #fecdd3",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={20} color="#dc2626" />
          </div>
          <div>
            <strong style={{ fontSize: "14.5px", color: "#991b1b", display: "block" }}>
              Heavy Rainfall Warning – Assam &amp; Meghalaya
            </strong>
            <span style={{ fontSize: "12.5px", color: "#b91c1c" }}>
              IMD has issued heavy rainfall alert for next 24 hours. Avoid travel in low-lying areas.
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab && onNavigateTab("Emergency Map")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            background: "#ffffff",
            border: "1px solid #fca5a5",
            color: "#991b1b",
            fontSize: "12.5px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          View Details <ChevronRight size={14} />
        </button>
      </div>

      {/* 2. Top 4 KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {/* Card 1: Active Incidents */}
        <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={22} color="#dc2626" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Active Incidents</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>12</div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>in your region</span>
          </div>
        </div>

        {/* Card 2: Road Closures */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShieldAlert size={22} color="#2563eb" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Road Closures</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>4</div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>in your region</span>
          </div>
        </div>

        {/* Card 3: Weather Alert */}
        <div style={{ background: "#fffbeb", border: "1px solid #fef08a", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CloudRain size={22} color="#d97706" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Weather Alert</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>2</div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>districts</span>
          </div>
        </div>

        {/* Card 4: Helplines */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <PhoneCall size={22} color="#16a34a" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Helplines</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>5</div>
            <span style={{ fontSize: "11px", color: "#64748b" }}>available</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Quick Actions + Recent Updates */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "16px" }}>
        {/* Left: Quick Actions */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
            Quick Actions
          </h3>

          {/* Action 1: Report an Issue */}
          <div
            onClick={() => {
              if (onOpenReport) onOpenReport();
              else if (onNavigateTab) onNavigateTab("Report Issue");
            }}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "transform 0.15s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileEdit size={18} color="#16a34a" />
              </div>
              <div>
                <strong style={{ fontSize: "13.5px", color: "#166534", display: "block" }}>Report an Issue</strong>
                <span style={{ fontSize: "11.5px", color: "#475569" }}>Road damage, landslide, flood &amp; more</span>
              </div>
            </div>
            <ChevronRight size={18} color="#16a34a" />
          </div>

          {/* Action 2: View Emergency Map */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("Emergency Map")}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Compass size={18} color="#2563eb" />
              </div>
              <div>
                <strong style={{ fontSize: "13.5px", color: "#0f172a", display: "block" }}>View Emergency Map</strong>
                <span style={{ fontSize: "11.5px", color: "#64748b" }}>Live incidents and alerts</span>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>

          {/* Action 3: Check Weather Updates */}
          <div
            onClick={() => setShowWeatherModal(true)}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CloudLightning size={18} color="#2563eb" />
              </div>
              <div>
                <strong style={{ fontSize: "13.5px", color: "#0f172a", display: "block" }}>Check Weather Updates</strong>
                <span style={{ fontSize: "11.5px", color: "#64748b" }}>IMD alerts for North East</span>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>

          {/* Action 4: View Helpline Numbers */}
          <div
            onClick={() => setShowHelplineModal(true)}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PhoneCall size={18} color="#475569" />
              </div>
              <div>
                <strong style={{ fontSize: "13.5px", color: "#0f172a", display: "block" }}>View Helpline Numbers</strong>
                <span style={{ fontSize: "11.5px", color: "#64748b" }}>Emergency contact details</span>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>
        </div>

        {/* Right: Recent Updates */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Recent Updates
              </h3>
              <button
                onClick={() => onNavigateTab && onNavigateTab("Emergency Map")}
                style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}
              >
                View All
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Item 1 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertTriangle size={16} color="#dc2626" />
                  </div>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>Landslide on NH-27 (Karbi Anglong)</strong>
                    <span style={{ fontSize: "11.5px", color: "#64748b" }}>Traffic movement affected</span>
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "600" }}>2 hrs ago</span>
              </div>

              {/* Item 2 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CloudRain size={16} color="#d97706" />
                  </div>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>Heavy Rainfall Warning – Assam</strong>
                    <span style={{ fontSize: "11.5px", color: "#64748b" }}>IMD alert in place</span>
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "600" }}>4 hrs ago</span>
              </div>

              {/* Item 3 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldAlert size={16} color="#2563eb" />
                  </div>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>Bridge Inspection – NH-6</strong>
                    <span style={{ fontSize: "11.5px", color: "#64748b" }}>Under assessment</span>
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "600" }}>6 hrs ago</span>
              </div>

              {/* Item 4 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={16} color="#16a34a" />
                  </div>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>Road Blockage – Cachar</strong>
                    <span style={{ fontSize: "11.5px", color: "#64748b" }}>Partially cleared</span>
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "600" }}>1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Safety Banner */}
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "12px",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#166534"
        }}
      >
        <Trees size={18} color="#16a34a" />
        <span>Stay alert</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Report issues</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Follow official updates</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Help build a safer North East</span>
      </div>

      {/* Helpline Numbers Modal */}
      {showHelplineModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", width: "420px", maxWidth: "90%" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 14px 0" }}>Emergency Helplines (North East)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {helplines.map((h, i) => (
                <div key={i} style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", color: "#334155", fontWeight: "600" }}>{h.name}</span>
                  <a href={`tel:${h.number.split(" ")[0]}`} style={{ fontSize: "13px", fontWeight: "800", color: "#16a34a", textDecoration: "none" }}>{h.number}</a>
                </div>
              ))}
            </div>
            <button onClick={() => setShowHelplineModal(false)} style={{ marginTop: "16px", width: "100%", padding: "10px", borderRadius: "8px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {/* Weather Modal */}
      {showWeatherModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", width: "420px", maxWidth: "90%" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px 0" }}>Regional Weather Advisory (IMD)</h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
              Heavy to very heavy rainfall expected across Dima Hasao, Karbi Anglong, and Cachar over the next 24-48 hours. Landslide risk is elevated along NH-27 and NH-6.
            </p>
            <button onClick={() => setShowWeatherModal(false)} style={{ marginTop: "16px", width: "100%", padding: "10px", borderRadius: "8px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", cursor: "pointer" }}>Understood</button>
          </div>
        </div>
      )}
    </div>
  );
}
