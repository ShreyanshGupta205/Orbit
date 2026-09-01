import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Filter,
  Calendar,
  Search,
  AlertTriangle,
  Car,
  Package,
  ShieldCheck,
  Info,
  CheckCircle2,
  FileText,
  MapPin
} from "lucide-react";
import { useApi } from "../../api/client";

export interface ReportItem {
  id: string;
  type: "Incident" | "Vehicle" | "Shipment" | "Inspection";
  location: string;
  description: string;
  reportedBy: string;
  status: "Critical" | "High" | "Resolved" | "In Progress" | "Info";
  time: string;
}

const initialReports: ReportItem[] = [
  {
    id: "REP-2026-1145",
    type: "Incident",
    location: "NH-15, Dima Hasao",
    description: "Landslide reported at Km 12+400",
    reportedBy: "Mobile App",
    status: "Critical",
    time: "10 min ago"
  },
  {
    id: "REP-2026-1144",
    type: "Incident",
    location: "SH-29, West Karbi Anglong",
    description: "Road damage due to heavy rainfall",
    reportedBy: "Patrolling Team",
    status: "High",
    time: "28 min ago"
  },
  {
    id: "REP-2026-1143",
    type: "Vehicle",
    location: "NH-27, Kamrup",
    description: "Truck breakdown on highway",
    reportedBy: "Transport Dept.",
    status: "Resolved",
    time: "1 hr ago"
  },
  {
    id: "REP-2026-1142",
    type: "Shipment",
    location: "NH-37, Golaghat",
    description: "Relief materials dispatch pending",
    reportedBy: "Logistics Team",
    status: "In Progress",
    time: "2 hr ago"
  },
  {
    id: "REP-2026-1141",
    type: "Inspection",
    location: "Cachar River Culvert",
    description: "Hydraulic gauge calibration check",
    reportedBy: "Water Resources Dept",
    status: "Resolved",
    time: "3 hr ago"
  }
];

interface ReportsViewProps {
  selectedDistrict?: string;
}

export default function ReportsView({ selectedDistrict = "All" }: ReportsViewProps) {
  const { apiFetch } = useApi();
  const [reports] = useState<ReportItem[]>(initialReports);
  const [reportType, setReportType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState(
    selectedDistrict !== "All" ? selectedDistrict : "All"
  );
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [summaryKPIs, setSummaryKPIs] = useState<{
    totalIncidents: number;
    verifiedIncidents: number;
    openIncidents: number;
    criticalRoads: number;
    activeVehicles: number;
    trackedShipments: number;
    totalAlerts: number;
    systemUptime: string;
  } | null>(null);

  // Sync with navbar & fetch analytics from API
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "All") {
      setSelectedRegion(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await apiFetch(`/api/analytics/summary?timeRange=${encodeURIComponent(timeRange)}`);
        if (res.ok) {
          const json = await res.json();
          setSummaryKPIs(json.data);
        }
      } catch { /* silent fallback */ }
    }
    fetchAnalytics();
  }, [apiFetch, timeRange]);

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      if (reportType !== "All" && item.type !== reportType) return false;
      if (selectedRegion !== "All" && !item.location.toLowerCase().includes(selectedRegion.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.id.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.reportedBy.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [reports, reportType, selectedRegion, searchQuery]);

  const handleDownloadCsv = async (reportName = "NERA-Analytical-Report") => {
    try {
      const res = await apiFetch(`/api/analytics/export?timeRange=${encodeURIComponent(timeRange)}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportName}-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setDownloadNotice(`Generated & downloaded ${reportName}.csv`);
      } else {
        setDownloadNotice("Failed to export report CSV");
      }
    } catch {
      setDownloadNotice("Error downloading CSV report");
    } finally {
      setTimeout(() => setDownloadNotice(null), 4000);
    }
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h1>Reports</h1>
          <p>Insights and analytics for better decision making</p>
        </div>
        <button
          className="primary-action-btn"
          onClick={() => handleDownloadCsv("NERA-Full-Executive-Report")}
        >
          <Download size={16} />
          <span>Download Report</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="download-toast-banner animate-fade">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Top Filter Bar */}
      <div className="view-toolbar-card">
        <div className="toolbar-grid-reports">
          <div className="toolbar-field">
            <label>Report Type</label>
            <div className="custom-select-wrap">
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="All">All Reports</option>
                <option value="Incident">Incident Report</option>
                <option value="Vehicle">Vehicle Status</option>
                <option value="Shipment">Shipment Summary</option>
                <option value="Inspection">Inspection Report</option>
              </select>
            </div>
          </div>

          <div className="toolbar-field">
            <label>Region</label>
            <div className="custom-select-wrap">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="All">All Districts</option>
                <option value="Dima Hasao">Dima Hasao</option>
                <option value="Kamrup">Kamrup</option>
                <option value="Golaghat">Golaghat</option>
                <option value="Cachar">Cachar</option>
                <option value="Karbi Anglong">Karbi Anglong</option>
              </select>
            </div>
          </div>

          <div className="toolbar-field">
            <label>Time Range</label>
            <div className="custom-select-wrap with-icon">
              <Calendar size={15} className="select-lead-icon" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ paddingLeft: "32px" }}
              >
                <option value="Last 24 Hours">Last 24 Hours</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
              </select>
            </div>
          </div>

          <div className="toolbar-apply-col">
            <button
              className="apply-filters-btn"
              onClick={() => {
                setDownloadNotice(`Filters updated for ${timeRange} across ${selectedRegion}`);
                setTimeout(() => setDownloadNotice(null), 3000);
              }}
            >
              <Filter size={15} />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="reports-kpi-grid">
        <div className="reports-kpi-card">
          <div className="kpi-icon-wrap green-light">
            <AlertTriangle size={22} className="text-emerald-700" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">{summaryKPIs ? summaryKPIs.totalIncidents : 12}</div>
            <div className="kpi-title">Incidents Reported</div>
            <div className="kpi-delta danger">
              <span className="delta-arrow">{summaryKPIs ? `${summaryKPIs.verifiedIncidents} Verified` : 'Live SQL Query'}</span>
            </div>
          </div>
        </div>

        <div className="reports-kpi-card">
          <div className="kpi-icon-wrap blue-light">
            <Car size={22} className="text-sky-600" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">{summaryKPIs ? summaryKPIs.activeVehicles : 342}</div>
            <div className="kpi-title">Active Vehicles</div>
            <div className="kpi-delta success">
              <span className="delta-arrow">Live Operational</span>
            </div>
          </div>
        </div>

        <div className="reports-kpi-card">
          <div className="kpi-icon-wrap yellow-light">
            <Package size={22} className="text-amber-600" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">{summaryKPIs ? summaryKPIs.trackedShipments : 76}</div>
            <div className="kpi-title">Tracked Shipments</div>
            <div className="kpi-delta success">
              <span className="delta-arrow">Live Logistics</span>
            </div>
          </div>
        </div>

        <div className="reports-kpi-card">
          <div className="kpi-icon-wrap purple-light">
            <ShieldCheck size={22} className="text-purple-600" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">{summaryKPIs ? summaryKPIs.systemUptime : "99.4%"}</div>
            <div className="kpi-title">System Uptime</div>
            <div className="kpi-delta success">
              <span className="delta-arrow">Neon PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Incident Trends & Recent Reports */}
      <div className="reports-middle-grid">
        {/* Left: Incident Trends */}
        <div className="resilience-chart-card">
          <div className="chart-card-head">
            <h3>Incident Trends</h3>
            <div className="chart-legend-inline">
              <span className="legend-entry">
                <i className="dot" style={{ background: "#15803d" }} />
                Critical
              </span>
              <span className="legend-entry">
                <i className="dot" style={{ background: "#f59e0b" }} />
                High
              </span>
              <span className="legend-entry">
                <i className="dot" style={{ background: "#0284c7" }} />
                Medium
              </span>
              <span className="legend-entry">
                <i className="dot" style={{ background: "#94a3b8" }} />
                Low
              </span>
            </div>
          </div>

          <div className="multi-trend-svg-wrap">
            <svg viewBox="0 0 460 160" className="multi-trend-svg">
              {/* Y Axis Grid Lines */}
              {[12, 10, 8, 6, 4, 2, 0].map((val, idx) => {
                const y = 15 + idx * 19;
                return (
                  <g key={val}>
                    <line x1="26" y1={y} x2="445" y2={y} stroke="#f0f3f2" strokeWidth="1" />
                    <text x="18" y={y + 3.5} textAnchor="end" className="chart-grid-text">{val}</text>
                  </g>
                );
              })}

              {/* High Trend Line (Yellow: [8, 9, 10, 9.5, 8.5, 7, 7]) */}
              <path
                d="M 45,60 L 110,51 L 175,41 L 240,46 L 305,55 L 370,70 L 435,70"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                { x: 45, y: 60 }, { x: 110, y: 51 }, { x: 175, y: 41 },
                { x: 240, y: 46 }, { x: 305, y: 55 }, { x: 370, y: 70 }, { x: 435, y: 70 }
              ].map((p, i) => (
                <circle key={`yh-${i}`} cx={p.x} cy={p.y} r="3" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
              ))}

              {/* Critical Trend Line (Green: [4, 5, 6, 5.8, 5.5, 4.5, 4]) */}
              <path
                d="M 45,95 L 110,86 L 175,76 L 240,78 L 305,82 L 370,91 L 435,96"
                fill="none"
                stroke="#15803d"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                { x: 45, y: 95 }, { x: 110, y: 86 }, { x: 175, y: 76 },
                { x: 240, y: 78 }, { x: 305, y: 82 }, { x: 370, y: 91 }, { x: 435, y: 96 }
              ].map((p, i) => (
                <circle key={`cr-${i}`} cx={p.x} cy={p.y} r="3" fill="#15803d" stroke="#fff" strokeWidth="1.5" />
              ))}

              {/* Medium Trend Line (Blue: [2, 3, 3.8, 3.9, 3.8, 3.5, 2.5]) */}
              <path
                d="M 45,115 L 110,105 L 175,97 L 240,96 L 305,97 L 370,100 L 435,110"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                { x: 45, y: 115 }, { x: 110, y: 105 }, { x: 175, y: 97 },
                { x: 240, y: 96 }, { x: 305, y: 97 }, { x: 370, y: 100 }, { x: 435, y: 110 }
              ].map((p, i) => (
                <circle key={`med-${i}`} cx={p.x} cy={p.y} r="3" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />
              ))}

              {/* X Axis Dates */}
              {["14 May", "15 May", "16 May", "17 May", "18 May", "19 May", "20 May"].map((d, i) => (
                <text
                  key={d}
                  x={45 + i * 65}
                  y="148"
                  textAnchor="middle"
                  className="chart-axis-date"
                >
                  {d}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Recent Reports List */}
        <div className="resilience-chart-card">
          <div className="chart-card-head">
            <h3>Recent Reports</h3>
            <button className="view-all-link-subtle" onClick={() => setReportType("All")}>
              View All
            </button>
          </div>

          <div className="recent-reports-stack">
            <div className="report-stack-item">
              <div className="report-stack-icon red">
                <AlertTriangle size={17} />
              </div>
              <div className="report-stack-main">
                <strong>Landslide at Km 12+400 - NH-15</strong>
                <span>
                  <MapPin size={11} className="inline-pin" /> Dima Hasao, Assam • 10 min ago
                </span>
              </div>
              <span className="pill-badge severity-critical">Critical</span>
            </div>

            <div className="report-stack-item">
              <div className="report-stack-icon orange">
                <AlertTriangle size={17} />
              </div>
              <div className="report-stack-main">
                <strong>Road Damage - SH-29</strong>
                <span>
                  <MapPin size={11} className="inline-pin" /> West Karbi Anglong • 28 min ago
                </span>
              </div>
              <span className="pill-badge severity-high">High</span>
            </div>

            <div className="report-stack-item">
              <div className="report-stack-icon blue">
                <Info size={17} />
              </div>
              <div className="report-stack-main">
                <strong>Water Level Rising - District</strong>
                <span>
                  <MapPin size={11} className="inline-pin" /> Cachar • 1 hr ago
                </span>
              </div>
              <span className="pill-badge status-assigned">Info</span>
            </div>

            <div className="report-stack-item">
              <div className="report-stack-icon green">
                <CheckCircle2 size={17} />
              </div>
              <div className="report-stack-main">
                <strong>Bridge Inspection Completed</strong>
                <span>
                  <MapPin size={11} className="inline-pin" /> Golaghat • 3 hrs ago
                </span>
              </div>
              <span className="pill-badge status-resolved">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Reported Items Table */}
      <div className="table-card-full">
        <div className="table-card-header-bar">
          <h2>Recent Reported Items</h2>
          <div className="header-search-wrap">
            <div className="input-search-inner compact">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="filter-pill-btn compact"
              onClick={() => {
                setReportType((prev) =>
                  prev === "All" ? "Incident" : prev === "Incident" ? "Vehicle" : prev === "Vehicle" ? "Shipment" : "All"
                );
              }}
            >
              <Filter size={14} />
              <span>{reportType === "All" ? "Filter" : reportType}</span>
            </button>
          </div>
        </div>

        <div className="custom-table-wrap">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Description</th>
                <th>Reported By</th>
                <th>Status</th>
                <th>Time</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length ? (
                filteredReports.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className="id-badge bold">{row.id}</span>
                    </td>
                    <td>
                      <span className={`report-type-tag type-${row.type.toLowerCase()}`}>
                        {row.type === "Incident" && <AlertTriangle size={12} />}
                        {row.type === "Vehicle" && <Car size={12} />}
                        {row.type === "Shipment" && <Package size={12} />}
                        {row.type === "Inspection" && <FileText size={12} />}
                        <span>{row.type}</span>
                      </span>
                    </td>
                    <td>
                      <div className="loc-cell">
                        <MapPin size={13} className="loc-pin" />
                        <span>{row.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className="desc-text">{row.description}</span>
                    </td>
                    <td>{row.reportedBy}</td>
                    <td>
                      <span className={`pill-badge status-${row.status.toLowerCase().replace(" ", "-")}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <span className="time-text">{row.time}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="table-action-pill-btn download-btn"
                        onClick={() => handleDownloadCsv(`${row.id}-details`)}
                        title="Download CSV"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-table-row">
                    No report items found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
