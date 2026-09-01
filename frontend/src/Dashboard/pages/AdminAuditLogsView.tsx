import { useState } from "react";
import {
  FileText,
  Download,
  Search,
  ChevronDown,
  User,
  Users,
  Folder,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useSaaSStore } from "../../store/saasStore";

export default function AdminAuditLogsView() {
  const { auditLogs } = useSaaSStore();
  const [userFilter, setUserFilter] = useState("All Users");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [page, setPage] = useState(1);

  const logs = auditLogs;

  const filteredLogs = logs.filter(l => {
    const matchUser = userFilter === "All Users" || l.userName.includes(userFilter);
    const matchModule = moduleFilter === "All Modules" || l.module === moduleFilter;
    return matchUser && matchModule;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={24} color="#16a34a" />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
              Audit Logs
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Track and monitor all system activities and user actions
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Exporting audit logs as CSV...")}
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
          <Download size={15} color="#16a34a" /> Export Logs <ChevronDown size={14} />
        </button>
      </div>

      {/* 2. Filter Controls Row */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Date Range */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "4px" }}>Date Range</label>
            <input
              type="text"
              defaultValue="20 May 2025 – 20 May 2026"
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12.5px", color: "#334155", fontWeight: 600, background: "#f8fafc" }}
            />
          </div>

          {/* User dropdown */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "4px" }}>User</label>
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12.5px", color: "#334155", fontWeight: 600, background: "#f8fafc" }}
            >
              <option value="All Users">All Users</option>
              <option value="Amit Sharma">Amit Sharma</option>
              <option value="Priya Das">Priya Das</option>
              <option value="Rahul Verma">Rahul Verma</option>
              <option value="Sunita Iyer">Sunita Iyer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Module dropdown */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "4px" }}>Module</label>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12.5px", color: "#334155", fontWeight: 600, background: "#f8fafc" }}
            >
              <option value="All Modules">All Modules</option>
              <option value="Authentication">Authentication</option>
              <option value="Incidents">Incidents</option>
              <option value="Users">Users</option>
              <option value="Media">Media</option>
              <option value="System">System</option>
            </select>
          </div>

          {/* Action Type */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "4px" }}>Action Type</label>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12.5px", color: "#334155", fontWeight: 600, background: "#f8fafc" }}
            >
              <option value="All Actions">All Actions</option>
              <option value="Login">Login</option>
              <option value="Incident Report">Incident Report</option>
              <option value="Role Update">Role Update</option>
              <option value="Media Upload">Media Upload</option>
            </select>
          </div>
        </div>

        <button
          style={{
            alignSelf: "flex-end",
            padding: "9px 20px",
            borderRadius: "8px",
            background: "#16a34a",
            color: "#ffffff",
            border: "none",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Search size={15} /> Search
        </button>
      </div>

      {/* 3. 4 Top Status Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {/* Total Actions */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={20} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>1,248</div>
            <span style={{ fontSize: "11.5px", color: "#475569" }}>Total Actions</span>
            <div style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
              <ArrowUpRight size={11} /> 12% vs last week
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={20} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>342</div>
            <span style={{ fontSize: "11.5px", color: "#475569" }}>Active Users</span>
            <div style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
              <ArrowUpRight size={11} /> 8% vs last week
            </div>
          </div>
        </div>

        {/* Modules Monitored */}
        <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Folder size={20} color="#9333ea" />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>6</div>
            <span style={{ fontSize: "11.5px", color: "#475569" }}>Modules Monitored</span>
            <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "700", marginTop: "2px" }}>
              0% vs last week
            </div>
          </div>
        </div>

        {/* Critical Actions */}
        <div style={{ background: "#fffbeb", border: "1px solid #fef08a", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={20} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>12</div>
            <span style={{ fontSize: "11.5px", color: "#475569" }}>Critical Actions</span>
            <div style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
              <ArrowDownRight size={11} /> 20% vs last week
            </div>
          </div>
        </div>
      </div>

      {/* 4. Audit Logs Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Audit Logs
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
            <span>Rows per page:</span>
            <select style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", background: "#ffffff" }}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#64748b", fontSize: "11.5px", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>Timestamp</th>
                <th style={{ padding: "12px 16px" }}>User</th>
                <th style={{ padding: "12px 16px" }}>Action</th>
                <th style={{ padding: "12px 16px" }}>Module</th>
                <th style={{ padding: "12px 16px" }}>Details</th>
                <th style={{ padding: "12px 16px" }}>IP Address</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {/* Timestamp */}
                  <td style={{ padding: "14px 16px", color: "#475569", fontSize: "12.5px" }}>
                    {log.timestamp}
                  </td>

                  {/* User */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#334155" }}>
                        {log.userName[0]}
                      </div>
                      <div>
                        <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>{log.userName}</strong>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{log.userEmail}</span>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "700", background: log.actionColor, color: "#1e293b" }}>
                      {log.action}
                    </span>
                  </td>

                  {/* Module */}
                  <td style={{ padding: "14px 16px", color: "#475569", fontWeight: "600" }}>
                    {log.module}
                  </td>

                  {/* Details */}
                  <td style={{ padding: "14px 16px", color: "#334155" }}>
                    {log.details}
                  </td>

                  {/* IP Address */}
                  <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>
                    {log.ip}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: log.status === "Success" ? "#dcfce7" : "#fee2e2", color: log.status === "Success" ? "#166534" : "#991b1b" }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderTop: "1px solid #f1f5f9", fontSize: "12.5px", color: "#64748b" }}>
          <span>Showing 1–10 of 1248 logs</span>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronLeft size={14} />
            </button>
            <button style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#16a34a", color: "#ffffff", fontWeight: "700", cursor: "pointer" }}>
              1
            </button>
            <button style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569", fontWeight: "600", cursor: "pointer" }}>
              2
            </button>
            <button style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569", fontWeight: "600", cursor: "pointer" }}>
              3
            </button>
            <span>...</span>
            <button style={{ width: "32px", height: "28px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569", fontWeight: "600", cursor: "pointer" }}>
              125
            </button>
            <button
              onClick={() => setPage(page + 1)}
              style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
