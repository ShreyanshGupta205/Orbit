import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail
} from "lucide-react";

export default function AdminUsersView() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [showAddModal, setShowAddModal] = useState(false);

  const users = [
    { id: "u-1", name: "Amit Sharma", email: "amit@nera.gov.in", role: "Logistics Operator", district: "Assam", status: "Active", joined: "12 Jan 2025" },
    { id: "u-2", name: "Priya Das", email: "priya@nera.gov.in", role: "Field Agent", district: "Meghalaya", status: "Active", joined: "14 Feb 2025" },
    { id: "u-3", name: "Rahul Verma", email: "rahul@nera.gov.in", role: "Citizen", district: "Nagaland", status: "Inactive", joined: "02 Mar 2025" },
    { id: "u-4", name: "Sunita Iyer", email: "sunita@nera.gov.in", role: "Authority", district: "Manipur", status: "Active", joined: "20 Jan 2025" },
    { id: "u-5", name: "Rakshana", email: "rakshana.authority@nera.gov.in", role: "Authority", district: "Assam", status: "Active", joined: "05 Jan 2025" },
    { id: "u-6", name: "Arup Boro", email: "arup.field@nera.gov.in", role: "Field Agent", district: "Assam", status: "Active", joined: "18 Apr 2025" },
  ];

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Users size={24} color="#16a34a" />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
              User Management
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Provision, configure and manage authorized personnel across all Northeast districts
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
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
          <Plus size={16} /> Add New User
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 14px", width: "280px" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name, email..."
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "100%" }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: 600, color: "#334155", background: "#ffffff" }}
        >
          <option value="All Roles">All Roles</option>
          <option value="Authority">Authority</option>
          <option value="Logistics Operator">Logistics Operator</option>
          <option value="Field Agent">Field Agent</option>
          <option value="Citizen">Citizen</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#64748b", fontSize: "11.5px", textTransform: "uppercase" }}>
              <th style={{ padding: "14px 18px" }}>User Name</th>
              <th style={{ padding: "14px 18px" }}>Role</th>
              <th style={{ padding: "14px 18px" }}>District</th>
              <th style={{ padding: "14px 18px" }}>Joined Date</th>
              <th style={{ padding: "14px 18px" }}>Status</th>
              <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#166534" }}>
                      {u.name[0]}
                    </div>
                    <div>
                      <strong style={{ fontSize: "13.5px", color: "#0f172a", display: "block" }}>{u.name}</strong>
                      <span style={{ fontSize: "11.5px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Mail size={12} /> {u.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 18px", fontWeight: "600", color: "#334155" }}>{u.role}</td>
                <td style={{ padding: "14px 18px", color: "#475569" }}>{u.district}</td>
                <td style={{ padding: "14px 18px", color: "#64748b" }}>{u.joined}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "700", background: u.status === "Active" ? "#dcfce7" : "#fee2e2", color: u.status === "Active" ? "#166534" : "#991b1b" }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: "14px 18px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button style={{ padding: "6px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", cursor: "pointer", color: "#475569" }}><Edit size={14} /></button>
                    <button style={{ padding: "6px", borderRadius: "6px", border: "1px solid #fecaca", background: "#fff5f5", cursor: "pointer", color: "#dc2626" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", width: "420px", maxWidth: "90%" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 14px 0" }}>Add New User</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input placeholder="Full Name" style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              <input placeholder="Email Address" type="email" style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              <select style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}>
                <option value="Authority">Authority</option>
                <option value="Logistics Operator">Logistics Operator</option>
                <option value="Field Agent">Field Agent</option>
                <option value="Citizen">Citizen</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", cursor: "pointer" }}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
