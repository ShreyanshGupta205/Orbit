import { useState } from "react";
import {
  Plus,
  Edit,
  Search,
  Check,
  Save
} from "lucide-react";

interface RoleDef {
  id: string;
  name: string;
  desc: string;
  details: string;
  permissions: {
    title: string;
    description: string;
    enabled: boolean;
  }[];
}

export default function AdminRolesView() {
  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("admin");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  const [roles, setRoles] = useState<RoleDef[]>([
    {
      id: "admin",
      name: "Administrator",
      desc: "Full system access",
      details: "Full system access and configuration permissions",
      permissions: [
        { title: "User Management", description: "Create, edit and manage users", enabled: true },
        { title: "Role Management", description: "Manage user roles and permissions", enabled: true },
        { title: "System Configuration", description: "Access and configure system settings", enabled: true },
        { title: "Audit Logs Access", description: "View and analyze audit logs", enabled: true },
        { title: "Reports & Analytics", description: "Access all reports and analytics", enabled: true },
      ]
    },
    {
      id: "authority",
      name: "Authority",
      desc: "Regional monitoring & oversight",
      details: "District-wide hazard overview and evacuation planning permissions",
      permissions: [
        { title: "Regional Monitoring", description: "Full read and broadcast access to disaster corridors", enabled: true },
        { title: "Evacuation Control", description: "Activate and publish safe route plans", enabled: true },
        { title: "System Configuration", description: "Access system settings", enabled: false },
        { title: "Audit Logs Access", description: "View audit logs", enabled: true },
        { title: "Reports & Analytics", description: "Access analytical models and risk scores", enabled: true },
      ]
    },
    {
      id: "logistics",
      name: "Logistics Operator",
      desc: "Transport & shipment management",
      details: "Fleet dispatch and safe corridor routing permissions",
      permissions: [
        { title: "Fleet Management", description: "Assign and reroute supply vehicles", enabled: true },
        { title: "Shipment Tracking", description: "Monitor cargo movement and delivery ETAs", enabled: true },
        { title: "Route Planner", description: "Calculate optimal resilient paths", enabled: true },
        { title: "User Management", description: "Manage driver accounts", enabled: false },
        { title: "Audit Logs Access", description: "Access dispatch logs", enabled: false },
      ]
    },
    {
      id: "field",
      name: "Field Agent",
      desc: "On-ground incident reporting",
      details: "Field data collection and offline sync capabilities",
      permissions: [
        { title: "Incident Reporting", description: "Submit verified hazard and damage alerts", enabled: true },
        { title: "Media Upload", description: "Capture photos and voice dispatches", enabled: true },
        { title: "Offline Sync", description: "Cache reports locally without network", enabled: true },
        { title: "Role Management", description: "Manage role hierarchy", enabled: false },
        { title: "System Configuration", description: "Configure system backend", enabled: false },
      ]
    },
    {
      id: "citizen",
      name: "Citizen",
      desc: "Issue reporting & alerts",
      details: "Public emergency alerts and issue reporting access",
      permissions: [
        { title: "Public Issue Reporting", description: "Report road blockages and local hazards", enabled: true },
        { title: "Emergency Map Access", description: "View real-time safe corridors and advisories", enabled: true },
        { title: "Helpline Directory", description: "Access 24/7 disaster response contacts", enabled: true },
        { title: "Audit Logs Access", description: "Access backend audit logs", enabled: false },
        { title: "Fleet Management", description: "Manage transport assets", enabled: false },
      ]
    }
  ]);

  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (permIndex: number) => {
    if (!isEditing) return;
    setRoles(prev => prev.map(r => {
      if (r.id !== activeRole.id) return r;
      const newPerms = [...r.permissions];
      newPerms[permIndex] = { ...newPerms[permIndex], enabled: !newPerms[permIndex].enabled };
      return { ...r, permissions: newPerms };
    }));
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header & Add Role Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
            Roles &amp; Permissions
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Define and manage access control for different user roles
          </p>
        </div>

        <button
          onClick={() => setShowAddRoleModal(true)}
          style={{
            background: "#16a34a",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "13.5px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 6px rgba(22,163,74,0.3)"
          }}
        >
          <Plus size={16} /> Add Role
        </button>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "16px" }}>
        {/* Left: Roles List */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Roles
            </h3>
            <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700", cursor: "pointer" }}>
              View All
            </span>
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "7px 12px" }}>
            <Search size={15} color="#64748b" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search roles or permissions..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: "12.5px", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            {filteredRoles.map((r) => {
              const isSelected = r.id === selectedRoleId;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedRoleId(r.id);
                    setIsEditing(false);
                  }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: `1.5px solid ${isSelected ? "#16a34a" : "#e2e8f0"}`,
                    background: isSelected ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <strong style={{ fontSize: "14px", color: isSelected ? "#166534" : "#0f172a", display: "block" }}>
                    {r.name}
                  </strong>
                  <span style={{ fontSize: "12px", color: isSelected ? "#15803d" : "#64748b", marginTop: "2px", display: "block" }}>
                    {r.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Role Permissions Details */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
                  {activeRole.name}
                </h2>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  {activeRole.details}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: `1px solid ${isEditing ? "#86efac" : "#cbd5e1"}`,
                  background: isEditing ? "#dcfce7" : "#ffffff",
                  color: isEditing ? "#166534" : "#334155",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {isEditing ? <Save size={14} /> : <Edit size={14} />}
                {isEditing ? "Save Role" : "Edit Role"}
              </button>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px 0" }}>
                Permissions
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {activeRole.permissions.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTogglePermission(idx)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      cursor: isEditing ? "pointer" : "default"
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "5px",
                        background: p.enabled ? "#16a34a" : "#ffffff",
                        border: `1.5px solid ${p.enabled ? "#16a34a" : "#cbd5e1"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        flexShrink: 0,
                        marginTop: "2px"
                      }}
                    >
                      {p.enabled && <Check size={15} strokeWidth={3} />}
                    </div>

                    <div>
                      <strong style={{ fontSize: "13.5px", color: "#0f172a", display: "block" }}>
                        {p.title}
                      </strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {p.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isEditing && (
            <div style={{ marginTop: "24px", padding: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "12px", color: "#166534", fontWeight: "600" }}>
              💡 Editing mode active. Click any permission checkbox above to toggle, then click Save Role.
            </div>
          )}
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", width: "420px", maxWidth: "90%" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 14px 0" }}>Create New Role</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>Role Name</label>
                <input placeholder="e.g. District Disaster Coordinator" style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>Description</label>
                <input placeholder="e.g. Real-time emergency escalation" style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setShowAddRoleModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => setShowAddRoleModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", cursor: "pointer" }}>Create Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
