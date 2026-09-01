import { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { useSaaSStore } from "../../store/saasStore";

export default function CitizenMyReportsView() {
  const { citizenReports } = useSaaSStore();
  const [activeTab, setActiveTab] = useState<"all" | "in_progress" | "resolved" | "needs_attention">("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const reports = citizenReports;

  const inProgressCount = reports.filter(r => r.status === "In Progress").length;
  const resolvedCount = reports.filter(r => r.status === "Resolved").length;
  const needsAttentionCount = reports.filter(r => r.status === "Needs Attention").length;

  const filteredReports = reports.filter(r => {
    if (activeTab === "in_progress") return r.status === "In Progress";
    if (activeTab === "resolved") return r.status === "Resolved";
    if (activeTab === "needs_attention") return r.status === "Needs Attention";
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileText size={24} color="#16a34a" />
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
            My Reports
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Track the status of your reported issues in real time.
          </p>
        </div>
      </div>

      {/* 2. Top Tabs */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "24px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "14px",
            fontWeight: "700",
            color: activeTab === "all" ? "#16a34a" : "#64748b",
            borderBottom: activeTab === "all" ? "2px solid #16a34a" : "none",
            paddingBottom: "8px",
            cursor: "pointer"
          }}
        >
          All Reports
        </button>

        <button
          onClick={() => setActiveTab("in_progress")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "14px",
            fontWeight: "700",
            color: activeTab === "in_progress" ? "#16a34a" : "#64748b",
            borderBottom: activeTab === "in_progress" ? "2px solid #16a34a" : "none",
            paddingBottom: "8px",
            cursor: "pointer"
          }}
        >
          In Progress
        </button>

        <button
          onClick={() => setActiveTab("resolved")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "14px",
            fontWeight: "700",
            color: activeTab === "resolved" ? "#16a34a" : "#64748b",
            borderBottom: activeTab === "resolved" ? "2px solid #16a34a" : "none",
            paddingBottom: "8px",
            cursor: "pointer"
          }}
        >
          Resolved
        </button>

        <button
          onClick={() => setActiveTab("needs_attention")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "14px",
            fontWeight: "700",
            color: activeTab === "needs_attention" ? "#16a34a" : "#64748b",
            borderBottom: activeTab === "needs_attention" ? "2px solid #16a34a" : "none",
            paddingBottom: "8px",
            cursor: "pointer"
          }}
        >
          Needs Attention
        </button>
      </div>

      {/* 3. 4 Top Status Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        {/* Card 1 */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={20} color="#2563eb" />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#64748b" }}>Total Reports</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{reports.length}</div>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={20} color="#2563eb" />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#64748b" }}>In Progress</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{inProgressCount}</div>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={20} color="#16a34a" />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#64748b" }}>Resolved</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{resolvedCount}</div>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={20} color="#d97706" />
          </div>
          <div>
            <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#64748b" }}>Needs Attention</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{needsAttentionCount}</div>
          </div>
        </div>
      </div>

      {/* 4. Reports Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1.2fr 40px", padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: "11.5px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
          <span>Issue Details</span>
          <span>Location</span>
          <span>Category</span>
          <span>Status</span>
          <span>Date</span>
          <span></span>
        </div>

        <div>
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1.2fr 40px",
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                alignItems: "center",
                cursor: "pointer",
                transition: "background 0.15s ease"
              }}
            >
              {/* Issue Details with Image */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={report.image}
                  alt={report.title}
                  style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                />
                <strong style={{ fontSize: "13.5px", color: "#0f172a" }}>{report.title}</strong>
              </div>

              {/* Location */}
              <span style={{ fontSize: "13px", color: "#475569" }}>{report.location}</span>

              {/* Category */}
              <span style={{ fontSize: "13px", color: "#475569" }}>{report.category}</span>

              {/* Status Pill */}
              <div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "11.5px",
                    fontWeight: "700",
                    background:
                      report.status === "Resolved" ? "#dcfce7" :
                      report.status === "Needs Attention" ? "#fee2e2" :
                      "#fef3c7",
                    color:
                      report.status === "Resolved" ? "#166534" :
                      report.status === "Needs Attention" ? "#991b1b" :
                      "#92400e"
                  }}
                >
                  {report.status}
                </span>
              </div>

              {/* Date */}
              <span style={{ fontSize: "12.5px", color: "#64748b" }}>{report.date}</span>

              {/* Chevron */}
              <ChevronRight size={16} color="#94a3b8" />
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div style={{ padding: "14px 20px", display: "flex", justifyContent: "center", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={() => setActiveTab("all")}
            style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            View All Reports →
          </button>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "24px", width: "450px", maxWidth: "90%" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px 0" }}>{selectedReport.title}</h3>
            <img src={selectedReport.image} alt={selectedReport.title} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "14px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
              <div><strong>Location:</strong> {selectedReport.location}</div>
              <div><strong>Category:</strong> {selectedReport.category}</div>
              <div><strong>Reported Date:</strong> {selectedReport.date}</div>
              <div><strong>Status:</strong> {selectedReport.status}</div>
            </div>
            <button onClick={() => setSelectedReport(null)} style={{ marginTop: "16px", width: "100%", padding: "10px", borderRadius: "8px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
