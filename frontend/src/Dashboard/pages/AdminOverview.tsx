import { useState, useEffect } from "react";
import {
  Users,
  Radio,
  Server,
  FileCheck2,
  AlertTriangle,
  Info,
  RefreshCw,
  ArrowUpRight
} from "lucide-react";

interface AdminOverviewProps {
  userName?: string;
  onNavigateTab?: (tab: string) => void;
}

export default function AdminOverview({
  onNavigateTab
}: AdminOverviewProps) {
  const [currentDateTime, setCurrentDateTime] = useState("");

  const updateDateTime = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    setCurrentDateTime(formatted);
  };

  useEffect(() => {
    updateDateTime();
  }, []);

  const recentUsers = [
    { name: "Amit Sharma", role: "Logistics Operator", district: "Assam", status: "Active" },
    { name: "Priya Das", role: "Field Agent", district: "Meghalaya", status: "Active" },
    { name: "Rahul Verma", role: "Citizen", district: "Nagaland", status: "Inactive" },
    { name: "Sunita Iyer", role: "Authority", district: "Manipur", status: "Active" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header with greeting and refresh */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.4px" }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            System overview and management controls
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ffffff", border: "1px solid #e2e8f0", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>
          <span>{currentDateTime || "20 May 2025, 10:32 AM"}</span>
          <button
            onClick={updateDateTime}
            style={{ background: "transparent", border: "none", color: "#16a34a", cursor: "pointer", padding: "2px", display: "flex" }}
            title="Refresh Timestamp"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {/* Total Users */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Users size={22} color="#16a34a" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Total Users</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>1,248</div>
            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px" }}>
              <ArrowUpRight size={12} /> 12% vs last month
            </span>
          </div>
        </div>

        {/* Active Sessions */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Radio size={22} color="#2563eb" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Active Sessions</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>342</div>
            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px" }}>
              <ArrowUpRight size={12} /> 8% vs last month
            </span>
          </div>
        </div>

        {/* Systems */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Server size={22} color="#2563eb" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Systems</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>6</div>
            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a" }} /> All Healthy
            </span>
          </div>
        </div>

        {/* Audit Logs */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileCheck2 size={22} color="#16a34a" />
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Audit Logs</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>12,459</div>
            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px" }}>
              <ArrowUpRight size={12} /> 20% vs last month
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: System Health + Recent Users */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "16px" }}>
        {/* Left: System Health */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              System Health
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab("Systems")}
              style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}
            >
              View Details
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "20px" }}>
            {/* Health Donut Gauge */}
            <div style={{ position: "relative", width: "130px", height: "130px", flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3.8" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3.8"
                  strokeDasharray="88"
                  strokeDashoffset="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <strong style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>98%</strong>
                <span style={{ fontSize: "10.5px", color: "#64748b" }}>Overall Health</span>
              </div>
            </div>

            {/* Health Breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", fontWeight: "600" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a" }} />
                <span style={{ color: "#334155" }}>Healthy – <strong>6</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} />
                <span style={{ color: "#334155" }}>Warning – <strong>1</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ color: "#334155" }}>Critical – <strong>0</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Users */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Recent Users
              </h3>
              <button
                onClick={() => onNavigateTab && onNavigateTab("Users")}
                style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}
              >
                View All
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9", textAlign: "left", color: "#64748b", fontSize: "11.5px", textTransform: "uppercase" }}>
                    <th style={{ padding: "8px 10px" }}>Name</th>
                    <th style={{ padding: "8px 10px" }}>Role</th>
                    <th style={{ padding: "8px 10px" }}>District</th>
                    <th style={{ padding: "8px 10px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "10px", fontWeight: "700", color: "#0f172a" }}>{u.name}</td>
                      <td style={{ padding: "10px", color: "#475569" }}>{u.role}</td>
                      <td style={{ padding: "10px", color: "#475569" }}>{u.district}</td>
                      <td style={{ padding: "10px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "700",
                            background: u.status === "Active" ? "#dcfce7" : "#fee2e2",
                            color: u.status === "Active" ? "#166534" : "#991b1b"
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Alerts + Data Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "16px" }}>
        {/* Left: Recent Alerts */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Recent Alerts
              </h3>
              <button
                onClick={() => onNavigateTab && onNavigateTab("Audit Logs")}
                style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}
              >
                View All
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "#fff5f5", borderRadius: "8px", border: "1px solid #fee2e2" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <AlertTriangle size={16} color="#dc2626" />
                  <span style={{ fontSize: "12.5px", color: "#991b1b", fontWeight: "600" }}>High system load on Media Upload service</span>
                </div>
                <span style={{ fontSize: "11px", color: "#b91c1c" }}>2 hrs ago</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Info size={16} color="#2563eb" />
                  <span style={{ fontSize: "12.5px", color: "#1e293b", fontWeight: "600" }}>New user registrations spiked in Assam</span>
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>4 hrs ago</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Info size={16} color="#2563eb" />
                  <span style={{ fontSize: "12.5px", color: "#1e293b", fontWeight: "600" }}>Audit logs backup completed successfully</span>
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>6 hrs ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Data Overview */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px 0" }}>
            Data Overview
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {/* Incidents */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 12px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Incidents</span>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>248</div>
              <span style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
                <ArrowUpRight size={11} /> 14%
              </span>
            </div>

            {/* Shipments */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 12px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Shipments</span>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>1,532</div>
              <span style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
                <ArrowUpRight size={11} /> 6%
              </span>
            </div>

            {/* Vehicles */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 12px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Vehicles</span>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>287</div>
              <span style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
                <ArrowUpRight size={11} /> 9%
              </span>
            </div>

            {/* Roads Monitored */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 12px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Roads Monitored</span>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>6,420</div>
              <span style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
                <ArrowUpRight size={11} /> 4%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
