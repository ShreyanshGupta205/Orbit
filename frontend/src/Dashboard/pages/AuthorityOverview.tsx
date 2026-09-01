import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CloudRain,
  Sun,
  CloudSun,
  RefreshCw,
  ShieldAlert,
  Car,
  Truck,
  Info
} from "lucide-react";

interface AuthorityOverviewProps {
  userName?: string;
  userRole?: string;
  selectedDistrict?: string;
  onNavigateTab?: (tab: string) => void;
}

export default function AuthorityOverview({
  userName = "Rakshana",
  userRole: _userRole = "Authority / Analyst",
  selectedDistrict: _selectedDistrict = "Dima Hasao",
  onNavigateTab
}: AuthorityOverviewProps) {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      };
      // Example: 20 May 2025, Tue 06:42 PM
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

  // Greeting based on time of day
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  // Top 5 Stats
  const topStats = [
    {
      id: "critical-roads",
      value: "08",
      label: "Critical Roads",
      delta: "↑ 2 from yesterday",
      iconType: "badge-A",
      bgTone: "#ecfdf5",
      badgeColor: "#16a34a"
    },
    {
      id: "open-incidents",
      value: "14",
      label: "Open Incidents",
      delta: "↑ 3 from yesterday",
      iconType: "alert",
      bgTone: "#fefce8",
      badgeColor: "#ca8a04"
    },
    {
      id: "vehicles-active",
      value: "27",
      label: "Vehicles Active",
      delta: "↑ 5 from yesterday",
      iconType: "vehicle",
      bgTone: "#f0fdf4",
      badgeColor: "#16a34a"
    },
    {
      id: "shipments-today",
      value: "42",
      label: "Shipments Today",
      delta: "↑ 8% from yesterday",
      iconType: "shipment",
      bgTone: "#f0fdf4",
      badgeColor: "#16a34a"
    },
    {
      id: "high-risk-roads",
      value: "07",
      label: "High Risk Roads",
      delta: "↑ 1 from yesterday",
      iconType: "shield",
      bgTone: "#faf5ff",
      badgeColor: "#9333ea"
    }
  ];

  // Road Conditions rows
  const roadConditions = [
    { road: "NH-15", district: "Dima Hasao", status: "High Risk", statusType: "high", updated: "2 min ago" },
    { road: "NH-27", district: "Kamrup", status: "Normal", statusType: "normal", updated: "5 min ago" },
    { road: "SH-22", district: "West Karbi Anglong", status: "Moderate", statusType: "moderate", updated: "8 min ago" },
    { road: "NH-37", district: "Golaghat", status: "Normal", statusType: "normal", updated: "12 min ago" },
    { road: "NH-06", district: "Cachar", status: "Moderate", statusType: "moderate", updated: "15 min ago" }
  ];

  // Active Alerts
  const activeAlertsList = [
    {
      id: 1,
      title: "Critical road blockage on NH-15",
      location: "Dima Hasao",
      time: "10 min ago",
      type: "critical"
    },
    {
      id: 2,
      title: "Heavy rainfall warning in Karbi Anglong",
      location: "Karbi Anglong",
      time: "28 min ago",
      type: "warning"
    },
    {
      id: 3,
      title: "Landslide susceptibility high in NH-06",
      location: "Dima Hasao",
      time: "1 hr ago",
      type: "warning"
    },
    {
      id: 4,
      title: "Flood watch in Barak Valley",
      location: "Cachar, Hailakandi",
      time: "2 hr ago",
      type: "info"
    }
  ];

  // Critical Corridors
  const criticalCorridors = [
    { corridor: "NH-06 (Guwahati - Shillong)", score: 82, trend: "up", status: "Partially Accessible", updated: "2 min ago" },
    { corridor: "NH-15 (Dima Hasao - Silchar)", score: 68, trend: "up", status: "Accessible", updated: "5 min ago" },
    { corridor: "NH-27 (Guwahati - Silchar)", score: 52, trend: "up", status: "Accessible", updated: "8 min ago" },
    { corridor: "NH-37 (Jorhat - Haflong)", score: 34, trend: "down", status: "Accessible", updated: "12 min ago" }
  ];

  // At-Risk Shipments
  const atRiskShipments = [
    { id: "SH-0520-1145", origin: "Guwahati", destination: "Shillong", cargo: "Essential Goods", vehicle: "AS-01-AC-1123", eta: "21 May, 08:30 PM", risk: "High", status: "In Transit" },
    { id: "SH-0520-1144", origin: "Silchar", destination: "Imphal", cargo: "Medical Supplies", vehicle: "AS-02-BC-7789", eta: "21 May, 09:15 PM", risk: "High", status: "In Transit" },
    { id: "SH-0520-1143", origin: "Dibrugarh", destination: "Aizawl", cargo: "Food Items", vehicle: "AS-01-AB-3344", eta: "22 May, 07:45 AM", risk: "Medium", status: "In Transit" },
    { id: "SH-0520-1142", origin: "Jorhat", destination: "Guwahati", cargo: "Construction Material", vehicle: "AS-03-CD-5566", eta: "21 May, 11:30 PM", risk: "Medium", status: "Delayed" }
  ];

  return (
    <div className="authority-overview-root" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header Greeting & Live Clock */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
            {getGreeting()}, {userName} 👋
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Here&apos;s what&apos;s happening in your region today.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ffffff", border: "1px solid #e2e8f0", padding: "8px 14px", borderRadius: "10px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
            {currentDateTime || "20 May 2025, Tue 06:42 PM"}
          </span>
          <button
            onClick={handleRefresh}
            title="Refresh Real-time Data"
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#16a34a", padding: "2px" }}
          >
            <RefreshCw size={14} className={isRefreshing ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* 2. Top 5 KPI Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {topStats.map((stat) => (
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
                borderRadius: stat.iconType === "badge-A" || stat.iconType === "vehicle" ? "50%" : "10px",
                background: stat.bgTone,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {stat.iconType === "badge-A" && <strong style={{ color: "#16a34a", fontSize: "17px", fontWeight: "800" }}>A</strong>}
              {stat.iconType === "alert" && <AlertTriangle size={20} color="#ca8a04" />}
              {stat.iconType === "vehicle" && <Car size={20} color="#16a34a" />}
              {stat.iconType === "shipment" && <Truck size={20} color="#16a34a" />}
              {stat.iconType === "shield" && <ShieldAlert size={20} color="#9333ea" />}
            </div>

            {/* Value, Label & Delta */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "12.5px", color: "#475569", fontWeight: "600", marginTop: "2px" }}>
                {stat.label}
              </span>
              <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600", marginTop: "2px" }}>
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle Row: Live Road Status Map + Live Status Timeline Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: "16px" }}>
        {/* Left: Live Road Status Map Card */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Live Road Status
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Live Map")}
              style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#0f766e", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View Full Map <ArrowUpRight size={13} />
            </button>
          </div>

          {/* Interactive Styled Map View */}
          <div style={{ position: "relative", height: "260px", width: "100%", borderRadius: "10px", overflow: "hidden", background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
            {/* SVG Highway Network Visualization */}
            <svg viewBox="0 0 600 260" style={{ width: "100%", height: "100%" }}>
              {/* Region Label */}
              <text x="210" y="38" fill="#94a3b8" fontSize="13" fontWeight="800" letterSpacing="3">ASSAM</text>

              {/* Road Lines */}
              {/* NH-15 (Green/Orange/Red) */}
              <path d="M 50 85 Q 120 70 170 95 T 320 80 T 450 110 T 560 70" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
              <path d="M 50 85 Q 120 70 170 95" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
              <path d="M 320 80 Q 380 95 450 110" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />

              {/* NH-27 */}
              <path d="M 90 95 Q 180 120 250 155 T 380 180 T 490 220" fill="none" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 380 180 T 490 220" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />

              {/* SH-22 */}
              <path d="M 170 95 Q 160 170 210 210 T 330 230" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="5,3" strokeLinecap="round" />

              {/* NH-37 */}
              <path d="M 280 85 Q 360 120 440 90 T 570 95" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />

              {/* Town Labels */}
              <text x="220" y="90" fill="#334155" fontSize="10.5" fontWeight="700">Dima Hasao</text>
              <circle cx="215" cy="87" r="3" fill="#e11d48" />

              <text x="210" y="160" fill="#475569" fontSize="10" fontWeight="600">Lumding</text>
              <text x="350" y="175" fill="#475569" fontSize="10" fontWeight="600">Haflong</text>
              <text x="280" y="65" fill="#475569" fontSize="10" fontWeight="600">Golaghat</text>
              <text x="510" y="90" fill="#475569" fontSize="10" fontWeight="600">Jorhat</text>
              <text x="440" y="240" fill="#475569" fontSize="10" fontWeight="600">Karimganj</text>
              <text x="80" y="150" fill="#64748b" fontSize="9.5" fontWeight="600">West Karbi Anglong</text>

              {/* Highway Badges */}
              <g transform="translate(85, 70)">
                <rect width="28" height="13" rx="3" fill="#15803d" />
                <text x="4" y="10" fill="#ffffff" fontSize="7.5" fontWeight="700">NH-15</text>
              </g>

              <g transform="translate(130, 75)">
                <rect width="28" height="13" rx="3" fill="#15803d" />
                <text x="4" y="10" fill="#ffffff" fontSize="7.5" fontWeight="700">NH-27</text>
              </g>

              <g transform="translate(265, 115)">
                <rect width="28" height="13" rx="3" fill="#15803d" />
                <text x="4" y="10" fill="#ffffff" fontSize="7.5" fontWeight="700">NH-27</text>
              </g>

              <g transform="translate(325, 180)">
                <rect width="28" height="13" rx="3" fill="#15803d" />
                <text x="4" y="10" fill="#ffffff" fontSize="7.5" fontWeight="700">NH-37</text>
              </g>

              <g transform="translate(480, 70)">
                <rect width="28" height="13" rx="3" fill="#15803d" />
                <text x="4" y="10" fill="#ffffff" fontSize="7.5" fontWeight="700">NH-37</text>
              </g>

              {/* Status Markers */}
              {/* Critical Red Triangles */}
              <polygon points="190,95 196,107 184,107" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <polygon points="340,78 346,90 334,90" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <polygon points="430,95 436,107 424,107" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <polygon points="410,145 416,157 404,157" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <polygon points="460,195 466,207 454,207" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

              {/* High Risk Orange Triangle */}
              <polygon points="270,140 276,152 264,152" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
              <polygon points="215,195 221,207 209,207" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />

              {/* Good Green Circles */}
              <circle cx="395" cy="98" r="5" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="230" cy="165" r="5" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5" />

              {/* Blue Vehicle Icons */}
              <circle cx="170" cy="160" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              <text x="166" y="163" fill="#ffffff" fontSize="7" fontWeight="bold">🚗</text>

              <circle cx="300" cy="150" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              <text x="296" y="153" fill="#ffffff" fontSize="7" fontWeight="bold">🚚</text>
            </svg>

            {/* Bottom Left Legend */}
            <div style={{ position: "absolute", bottom: "10px", left: "12px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", padding: "5px 12px", borderRadius: "20px", border: "1px solid #cbd5e1", display: "flex", gap: "12px", fontSize: "11px", fontWeight: "600", color: "#334155" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} /> Good</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308" }} /> Moderate</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f97316" }} /> High</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} /> Critical</span>
            </div>
          </div>
        </div>

        {/* Right: Live Status Timeline Feed Card */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Live Status
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Alerts")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View all
            </button>
          </div>

          {/* Connected Timeline List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative", paddingLeft: "8px" }}>
            {/* Timeline Item 1 */}
            <div style={{ display: "flex", gap: "14px", position: "relative", paddingBottom: "18px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", width: "52px", flexShrink: 0, paddingTop: "1px" }}>06:34 PM</span>
              {/* Vertical line & dot */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ef4444", border: "2px solid #ffffff", boxShadow: "0 0 0 2px #ef4444", flexShrink: 0 }} />
                <span style={{ width: "2px", flex: 1, background: "#e2e8f0", marginTop: "4px" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>NH-15</div>
                <div style={{ fontSize: "12px", color: "#ef4444", fontWeight: "600" }}>High risk</div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>Landslide probability high</div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div style={{ display: "flex", gap: "14px", position: "relative", paddingBottom: "18px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", width: "52px", flexShrink: 0, paddingTop: "1px" }}>06:15 PM</span>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#f97316", border: "2px solid #ffffff", boxShadow: "0 0 0 2px #f97316", flexShrink: 0 }} />
                <span style={{ width: "2px", flex: 1, background: "#e2e8f0", marginTop: "4px" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>NH-27</div>
                <div style={{ fontSize: "12px", color: "#b45309", fontWeight: "600" }}>Traffic disruption</div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>Heavy vehicle breakdown</div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div style={{ display: "flex", gap: "14px", position: "relative", paddingBottom: "18px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", width: "52px", flexShrink: 0, paddingTop: "1px" }}>05:50 PM</span>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#eab308", border: "2px solid #ffffff", boxShadow: "0 0 0 2px #eab308", flexShrink: 0 }} />
                <span style={{ width: "2px", flex: 1, background: "#e2e8f0", marginTop: "4px" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>SH-22</div>
                <div style={{ fontSize: "12px", color: "#713f12", fontWeight: "600" }}>Incident reported</div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>Near Maibong</div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div style={{ display: "flex", gap: "14px", position: "relative" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", width: "52px", flexShrink: 0, paddingTop: "1px" }}>05:15 PM</span>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#22c55e", border: "2px solid #ffffff", boxShadow: "0 0 0 2px #22c55e", flexShrink: 0 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>NH-37</div>
                <div style={{ fontSize: "12px", color: "#166534", fontWeight: "600" }}>Road clear</div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>Normal movement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Middle-Lower Row: Road Conditions + Active Alerts + Weather Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.1fr", gap: "16px" }}>
        {/* Card 1: Road Conditions */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Road Conditions
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Live Map")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View all
            </button>
          </div>

          <table style={{ width: "100%", fontSize: "12.5px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", color: "#64748b", textAlign: "left", fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Road</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>District</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {roadConditions.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "8px 4px", fontWeight: "700", color: "#0f172a" }}>{r.road}</td>
                  <td style={{ padding: "8px 4px", color: "#475569" }}>{r.district}</td>
                  <td style={{ padding: "8px 4px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background: r.statusType === "high" ? "#fee2e2" : r.statusType === "moderate" ? "#fef3c7" : "#dcfce7",
                        color: r.statusType === "high" ? "#991b1b" : r.statusType === "moderate" ? "#92400e" : "#166534"
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: "8px 4px", color: "#94a3b8", fontSize: "11.5px" }}>{r.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 2: Active Alerts */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Active Alerts
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Alerts")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View all
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeAlertsList.map((alert) => (
              <div
                key={alert.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "8px 0",
                  borderBottom: "1px solid #f8fafc"
                }}
              >
                <div style={{ marginTop: "2px", flexShrink: 0 }}>
                  {alert.type === "critical" && (
                    <span style={{ display: "inline-flex", width: "20px", height: "20px", borderRadius: "4px", background: "#fee2e2", alignItems: "center", justifyContent: "center" }}>
                      <AlertTriangle size={13} color="#dc2626" />
                    </span>
                  )}
                  {alert.type === "warning" && (
                    <span style={{ display: "inline-flex", width: "20px", height: "20px", borderRadius: "4px", background: "#fef3c7", alignItems: "center", justifyContent: "center" }}>
                      <AlertTriangle size={13} color="#d97706" />
                    </span>
                  )}
                  {alert.type === "info" && (
                    <span style={{ display: "inline-flex", width: "20px", height: "20px", borderRadius: "4px", background: "#e0f2fe", alignItems: "center", justifyContent: "center" }}>
                      <Info size={13} color="#0284c7" />
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    {alert.location}
                  </div>
                </div>

                <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0, marginTop: "2px" }}>
                  {alert.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Weather Overview */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Weather Overview
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Resilience")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View forecast
            </button>
          </div>

          {/* Current Temp */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "6px 0 10px 0" }}>
            <CloudRain size={36} color="#3b82f6" />
            <div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>22°c</div>
              <div style={{ fontSize: "11.5px", color: "#475569", fontWeight: "600" }}>Light Rain</div>
              <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>Guwahati, Assam</div>
            </div>
          </div>

          {/* Stats 2x2 grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: "11.5px", padding: "8px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Humidity</span>
              <strong style={{ color: "#0f172a" }}>85%</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Wind</span>
              <strong style={{ color: "#0f172a" }}>12 km/h</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Rainfall (24h)</span>
              <strong style={{ color: "#0f172a" }}>118 mm</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Visibility</span>
              <strong style={{ color: "#0f172a" }}>8 km</strong>
            </div>
          </div>

          {/* 5-Day Mini Forecast */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>Wed</div>
              <CloudRain size={15} color="#3b82f6" style={{ margin: "2px auto" }} />
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a" }}>23°</div>
              <div style={{ fontSize: "9.5px", color: "#94a3b8" }}>15°</div>
            </div>
            <div>
              <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>Thu</div>
              <CloudSun size={15} color="#eab308" style={{ margin: "2px auto" }} />
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a" }}>24°</div>
              <div style={{ fontSize: "9.5px", color: "#94a3b8" }}>16°</div>
            </div>
            <div>
              <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>Fri</div>
              <CloudRain size={15} color="#3b82f6" style={{ margin: "2px auto" }} />
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a" }}>25°</div>
              <div style={{ fontSize: "9.5px", color: "#94a3b8" }}>17°</div>
            </div>
            <div>
              <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>Sat</div>
              <Sun size={15} color="#f59e0b" style={{ margin: "2px auto" }} />
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a" }}>23°</div>
              <div style={{ fontSize: "9.5px", color: "#94a3b8" }}>15°</div>
            </div>
            <div>
              <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>Sun</div>
              <Sun size={15} color="#f59e0b" style={{ margin: "2px auto" }} />
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a" }}>24°</div>
              <div style={{ fontSize: "9.5px", color: "#94a3b8" }}>16°</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Row: Critical Corridors + At-Risk Shipments */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.7fr", gap: "16px" }}>
        {/* Card 1: Critical Corridors */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Critical Corridors
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Resilience")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View all
            </button>
          </div>

          <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", color: "#64748b", textAlign: "left", fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Corridor</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Risk Score</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Trend</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Accessibility</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {criticalCorridors.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "9px 4px", fontWeight: "700", color: "#0f172a" }}>{c.corridor}</td>
                  <td style={{ padding: "9px 4px" }}>
                    <strong style={{ color: c.score >= 70 ? "#ef4444" : c.score >= 50 ? "#f59e0b" : "#16a34a", fontSize: "12.5px" }}>
                      {c.score}/100
                    </strong>
                  </td>
                  <td style={{ padding: "9px 4px" }}>
                    {/* Sparkline mini representation */}
                    <span style={{ color: c.trend === "up" ? "#ef4444" : "#16a34a", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                      {c.trend === "up" ? "📈" : "📉"}
                    </span>
                  </td>
                  <td style={{ padding: "9px 4px", color: c.status.includes("Partially") ? "#b45309" : "#166534", fontWeight: "600" }}>
                    {c.status}
                  </td>
                  <td style={{ padding: "9px 4px", color: "#94a3b8" }}>{c.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 2: At-Risk Shipments */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              At-Risk Shipments
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Shipments")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              View all
            </button>
          </div>

          <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", color: "#64748b", textAlign: "left", fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Shipment ID</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Origin</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Destination</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Cargo</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Vehicle</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>ETA</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Risk</th>
                <th style={{ padding: "6px 4px", fontWeight: "600" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {atRiskShipments.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "9px 4px", fontWeight: "700", color: "#0f172a" }}>{s.id}</td>
                  <td style={{ padding: "9px 4px", color: "#475569" }}>{s.origin}</td>
                  <td style={{ padding: "9px 4px", color: "#475569" }}>{s.destination}</td>
                  <td style={{ padding: "9px 4px", color: "#0f172a", fontWeight: "500" }}>{s.cargo}</td>
                  <td style={{ padding: "9px 4px", color: "#64748b" }}>{s.vehicle}</td>
                  <td style={{ padding: "9px 4px", color: "#334155" }}>{s.eta}</td>
                  <td style={{ padding: "9px 4px" }}>
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: "10px",
                        fontSize: "10.5px",
                        fontWeight: "700",
                        background: s.risk === "High" ? "#fee2e2" : "#fef3c7",
                        color: s.risk === "High" ? "#991b1b" : "#92400e"
                      }}
                    >
                      {s.risk}
                    </span>
                  </td>
                  <td style={{ padding: "9px 4px" }}>
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: "10px",
                        fontSize: "10.5px",
                        fontWeight: "700",
                        background: s.status === "In Transit" ? "#dcfce7" : "#fee2e2",
                        color: s.status === "In Transit" ? "#166534" : "#991b1b"
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
    </div>
  );
}
