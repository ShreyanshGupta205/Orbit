import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  Play,
  RefreshCw,
  Search,
  CheckCircle2,
  Database,
  CloudRain,
  Folder,
  Radio,
  FileText,
  UserCheck
} from "lucide-react";
import { useApi } from "../../api/client";

export default function AdminView() {
  const { apiFetch } = useApi();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "audit" | "jobs" | "health">("overview");

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userPage] = useState(1);
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditPage] = useState(1);
  const [auditActionFilter, setAuditActionFilter] = useState("");

  const [jobs, setJobs] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);

  // Modals & notifications
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [inspectingAudit, setInspectingAudit] = useState<any>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/overview");
      if (res.ok) {
        const json = await res.json();
        setOverview(json.data);
      }
    } catch { /* silent fallback */ }
  }, [apiFetch]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiFetch(
        `/api/admin/users?page=${userPage}&limit=10&role=${encodeURIComponent(userRoleFilter)}&search=${encodeURIComponent(userSearch)}`
      );
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data.users || []);
      }
    } catch { /* silent fallback */ }
  }, [apiFetch, userPage, userRoleFilter, userSearch]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await apiFetch(
        `/api/admin/audit-logs?page=${auditPage}&limit=10&action=${encodeURIComponent(auditActionFilter)}`
      );
      if (res.ok) {
        const json = await res.json();
        setAuditLogs(json.data.logs || []);
      }
    } catch { /* silent fallback */ }
  }, [apiFetch, auditPage, auditActionFilter]);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/jobs");
      if (res.ok) {
        const json = await res.json();
        setJobs(json.data || []);
      }
    } catch { /* silent fallback */ }
  }, [apiFetch]);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/health");
      if (res.ok) {
        const json = await res.json();
        setHealth(json.data);
      }
    } catch { /* silent fallback */ }
  }, [apiFetch]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "audit") fetchAuditLogs();
    if (activeTab === "jobs") fetchJobs();
    if (activeTab === "health") fetchHealth();
  }, [activeTab, fetchUsers, fetchAuditLogs, fetchJobs, fetchHealth]);

  const handleRoleChange = async () => {
    if (!editingUser) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/users/${editingUser.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: selectedRole })
      });
      if (res.ok) {
        setNotice(`Role for ${editingUser.fullName || editingUser.email} updated to '${selectedRole}'`);
        setEditingUser(null);
        fetchUsers();
        fetchOverview();
      } else {
        const json = await res.json();
        setNotice(`Error: ${json.message || 'Failed to update role'}`);
      }
    } catch {
      setNotice("Failed to update user role");
    } finally {
      setLoading(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleRunJob = async (jobName: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/jobs/${jobName}/run`, { method: "POST" });
      if (res.ok) {
        setNotice(`Job '${jobName}' triggered and completed successfully.`);
        fetchJobs();
        fetchOverview();
      } else {
        const json = await res.json();
        setNotice(`Job Error: ${json.message}`);
      }
    } catch {
      setNotice(`Failed to trigger job ${jobName}`);
    } finally {
      setLoading(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1>Admin & System Operations</h1>
            <span className="pill-badge status-resolved" style={{ fontSize: "11px", fontWeight: 700 }}>
              RBAC PROTECTED
            </span>
          </div>
          <p>System-wide operational visibility, audit trail, background jobs & Clerk user management</p>
        </div>
        <button className="subtle-action-btn" onClick={fetchOverview}>
          <RefreshCw size={15} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {notice && (
        <div className="download-toast-banner animate-fade">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Admin Tab Bar */}
      <div className="tab-pill-row mb-4">
        <button className={`tab-pill-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
          <ShieldAlert size={14} /> Overview
        </button>
        <button className={`tab-pill-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          <Users size={14} /> User Management ({overview?.users?.totalUsers || 0})
        </button>
        <button className={`tab-pill-btn ${activeTab === "audit" ? "active" : ""}`} onClick={() => setActiveTab("audit")}>
          <FileText size={14} /> Audit Logs ({overview?.auditEventsCount || 0})
        </button>
        <button className={`tab-pill-btn ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>
          <Play size={14} /> Background Jobs ({overview?.jobs?.totalJobs || 6})
        </button>
        <button className={`tab-pill-btn ${activeTab === "health" ? "active" : ""}`} onClick={() => setActiveTab("health")}>
          <Database size={14} /> System Health
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <>
          <div className="reports-kpi-grid">
            <div className="reports-kpi-card">
              <div className="kpi-icon-wrap blue-light">
                <Users size={22} className="text-sky-600" />
              </div>
              <div className="kpi-content">
                <div className="kpi-num">{overview ? overview.users.totalUsers : "—"}</div>
                <div className="kpi-title">Total Clerk Users</div>
                <div className="kpi-delta success">
                  <span className="delta-arrow">{overview ? `${overview.users.byRole.admin || 0} Admins` : 'Clerk Backend'}</span>
                </div>
              </div>
            </div>

            <div className="reports-kpi-card">
              <div className="kpi-icon-wrap red-light">
                <AlertTriangle size={22} className="text-red-700" />
              </div>
              <div className="kpi-content">
                <div className="kpi-num">{overview ? overview.incidents.unverified : "—"}</div>
                <div className="kpi-title">Unverified Queue</div>
                <div className="kpi-delta danger">
                  <span className="delta-arrow">{overview ? `${overview.incidents.verified} Verified` : 'PostGIS Queue'}</span>
                </div>
              </div>
            </div>

            <div className="reports-kpi-card">
              <div className="kpi-icon-wrap yellow-light">
                <ShieldAlert size={22} className="text-amber-600" />
              </div>
              <div className="kpi-content">
                <div className="kpi-num">{overview ? overview.risk.criticalRoads : "—"}</div>
                <div className="kpi-title">Critical Road Segments</div>
                <div className="kpi-delta danger">
                  <span className="delta-arrow">Risk Score ≥ 0.70</span>
                </div>
              </div>
            </div>

            <div className="reports-kpi-card">
              <div className="kpi-icon-wrap green-light">
                <Play size={22} className="text-emerald-700" />
              </div>
              <div className="kpi-content">
                <div className="kpi-num">{overview ? overview.jobs.totalJobs : "6"}</div>
                <div className="kpi-title">Active Background Jobs</div>
                <div className="kpi-delta success">
                  <span className="delta-arrow">Automated Scheduler</span>
                </div>
              </div>
            </div>
          </div>

          <div className="reports-middle-grid mt-4">
            <div className="resilience-chart-card">
              <div className="chart-card-head">
                <h3>Users by Role Distribution</h3>
              </div>
              <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {overview && Object.entries(overview.users.byRole).map(([r, c]) => (
                  <div key={r} style={{ background: "#f8faf9", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>{r.replace("_", " ")}</div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>{c as number}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="resilience-chart-card">
              <div className="chart-card-head">
                <h3>System Operations Summary</h3>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Active Realtime Alerts</span>
                  <strong>{overview?.alerts?.activeAlerts || 0} sent</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Operational Facilities</span>
                  <strong>{overview?.resources?.operationalFacilities || 0} / {overview?.resources?.totalFacilities || 0}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Total Audit Log Records</span>
                  <strong>{overview?.auditEventsCount || 0} events</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: "#64748b" }}>Background Jobs Health</span>
                  <span className="pill-badge status-resolved">All Idle / Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="table-card-full">
          <div className="table-card-header-bar">
            <h2>Clerk User Directory & RBAC Roles</h2>
            <div className="header-search-wrap">
              <div className="input-search-inner compact">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search user email or name..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              <select
                className="filter-pill-btn compact"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                style={{ paddingRight: "24px" }}
              >
                <option value="all">All Roles</option>
                <option value="citizen">Citizen</option>
                <option value="field_agent">Field Agent</option>
                <option value="logistics">Logistics</option>
                <option value="authority">Authority</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="custom-table-wrap">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length ? (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td><span className="id-badge">{u.id.substring(0, 14)}...</span></td>
                      <td><strong>{u.fullName}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`pill-badge status-${u.role === 'admin' ? 'critical' : u.role === 'authority' ? 'high' : 'resolved'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td><span className="time-text">{new Date(u.createdAt).toLocaleDateString()}</span></td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="table-action-pill-btn download-btn"
                          onClick={() => { setEditingUser(u); setSelectedRole(u.role); }}
                        >
                          <UserCheck size={13} /> Edit Role
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="empty-table-row">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="table-card-full">
          <div className="table-card-header-bar">
            <h2>System Operational Audit Trail</h2>
            <div className="header-search-wrap">
              <input
                type="text"
                className="input-search-inner compact"
                placeholder="Filter by action..."
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="custom-table-wrap">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Actor User ID</th>
                  <th>Target Resource</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                  <th style={{ textAlign: "center" }}>Inspect</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length ? (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td><span className="id-badge">#{log.id}</span></td>
                      <td>{log.actor_user_id.substring(0, 16)}...</td>
                      <td>{log.target_user_id}</td>
                      <td><span className="pill-badge status-assigned">{log.action}</span></td>
                      <td><span className="time-text">{new Date(log.created_at).toLocaleString()}</span></td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="table-action-pill-btn download-btn"
                          onClick={() => setInspectingAudit(log)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="empty-table-row">No audit log entries recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKGROUND JOBS */}
      {activeTab === "jobs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {jobs.map((j) => (
            <div key={j.name} className="resilience-chart-card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{j.name}</h3>
                <span className={`pill-badge status-${j.status === 'running' ? 'assigned' : j.status === 'failed' ? 'critical' : 'resolved'}`}>
                  {j.status}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>{j.description}</p>
              <div style={{ fontSize: "12px", color: "#475569", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "16px" }}>
                <div>Interval: <strong>Every {j.intervalMinutes}m</strong></div>
                <div>Duration: <strong>{j.durationMs}ms</strong></div>
                <div>Last Run: <strong>{j.lastRun ? new Date(j.lastRun).toLocaleTimeString() : 'Never'}</strong></div>
                <div>Retries: <strong>{j.retryCount}</strong></div>
              </div>
              <button
                className="primary-action-btn"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={loading || j.status === 'running'}
                onClick={() => handleRunJob(j.name)}
              >
                <Play size={14} /> Run Job Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: SYSTEM HEALTH */}
      {activeTab === "health" && health && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <div className="resilience-chart-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <Database className="text-sky-600" size={20} />
              <h3>Database (Neon PostgreSQL + PostGIS)</h3>
            </div>
            <div style={{ fontSize: "13px" }}>
              <div>Status: <strong className="text-emerald-600">{health.services.database.status}</strong></div>
              <div>Provider: {health.services.database.provider}</div>
            </div>
          </div>

          <div className="resilience-chart-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <CloudRain className="text-sky-600" size={20} />
              <h3>Weather Service (Open-Meteo)</h3>
            </div>
            <div style={{ fontSize: "13px" }}>
              <div>Status: <strong className="text-emerald-600">{health.services.weatherApi.status}</strong></div>
              <div>Provider: {health.services.weatherApi.provider}</div>
            </div>
          </div>

          <div className="resilience-chart-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <Folder className="text-amber-600" size={20} />
              <h3>Upload Storage Directory</h3>
            </div>
            <div style={{ fontSize: "13px" }}>
              <div>Status: <strong className="text-emerald-600">{health.services.storage.status}</strong></div>
              <div>Directory: {health.services.storage.directory}</div>
            </div>
          </div>

          <div className="resilience-chart-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <Radio className="text-purple-600" size={20} />
              <h3>Realtime Stream (Server-Sent Events)</h3>
            </div>
            <div style={{ fontSize: "13px" }}>
              <div>Status: <strong className="text-emerald-600">{health.services.realtimeSSE.status}</strong></div>
              <div>Channel: /api/alerts/stream</div>
            </div>
          </div>
        </div>
      )}

      {/* Role Edit Modal */}
      {editingUser && (
        <div className="modal-backdrop-custom">
          <div className="modal-card-custom" style={{ maxWidth: "400px" }}>
            <h3>Change Role for {editingUser.fullName || editingUser.email}</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              Updates Clerk metadata and application access. Action will be recorded in audit logs.
            </p>
            <div className="toolbar-field" style={{ marginBottom: "16px" }}>
              <label>Select New Role</label>
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                <option value="citizen">Citizen</option>
                <option value="field_agent">Field Agent</option>
                <option value="logistics">Logistics</option>
                <option value="authority">Authority</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="subtle-action-btn" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="primary-action-btn" disabled={loading} onClick={handleRoleChange}>Save Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Detail Modal */}
      {inspectingAudit && (
        <div className="modal-backdrop-custom">
          <div className="modal-card-custom" style={{ maxWidth: "500px" }}>
            <h3>Audit Record #{inspectingAudit.id}</h3>
            <div style={{ fontSize: "13px", margin: "12px 0" }}>
              <div><strong>Action:</strong> {inspectingAudit.action}</div>
              <div><strong>Actor ID:</strong> {inspectingAudit.actor_user_id}</div>
              <div><strong>Target ID:</strong> {inspectingAudit.target_user_id}</div>
              <div><strong>Timestamp:</strong> {new Date(inspectingAudit.created_at).toLocaleString()}</div>
            </div>
            <div style={{ background: "#0f172a", color: "#e2e8f0", padding: "12px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace" }}>
              <pre>{JSON.stringify({ oldValue: inspectingAudit.old_value, newValue: inspectingAudit.new_value, metadata: inspectingAudit.metadata }, null, 2)}</pre>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button className="subtle-action-btn" onClick={() => setInspectingAudit(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
