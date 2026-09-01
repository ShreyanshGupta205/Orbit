import { useState, useMemo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  X
} from "lucide-react";

export interface DistrictResilience {
  district: string;
  score: number;
  riskLevel: "Low" | "Moderate" | "High";
  keyRisks: string;
  lastUpdated: string;
  population?: string;
  preparednessScore?: number;
  shelters?: number;
}

const initialDistricts: DistrictResilience[] = [
  {
    district: "Dimapur",
    score: 92,
    riskLevel: "Low",
    keyRisks: "Heavy Rain, Landslide",
    lastUpdated: "20 May 06:30 PM",
    population: "380,000",
    preparednessScore: 94,
    shelters: 18
  },
  {
    district: "Kohima",
    score: 88,
    riskLevel: "Low",
    keyRisks: "Heavy Rain, Road Damage",
    lastUpdated: "20 May 06:20 PM",
    population: "270,000",
    preparednessScore: 90,
    shelters: 14
  },
  {
    district: "Wokha",
    score: 76,
    riskLevel: "Moderate",
    keyRisks: "Flood, Waterlogging",
    lastUpdated: "20 May 06:15 PM",
    population: "165,000",
    preparednessScore: 78,
    shelters: 8
  },
  {
    district: "Mon",
    score: 68,
    riskLevel: "Moderate",
    keyRisks: "Landslide, Blockage",
    lastUpdated: "20 May 06:10 PM",
    population: "250,000",
    preparednessScore: 72,
    shelters: 10
  },
  {
    district: "Haflong",
    score: 82,
    riskLevel: "Low",
    keyRisks: "Landslide, Heavy Rain",
    lastUpdated: "20 May 05:45 PM",
    population: "190,000",
    preparednessScore: 85,
    shelters: 12
  },
  {
    district: "Dima Hasao",
    score: 54,
    riskLevel: "High",
    keyRisks: "Slope Instability, Flash Floods",
    lastUpdated: "20 May 05:30 PM",
    population: "215,000",
    preparednessScore: 60,
    shelters: 9
  }
];

interface ResilienceViewProps {
  selectedDistrict?: string;
  onNavigateToReports?: () => void;
}

export default function ResilienceView({ selectedDistrict = "Dima Hasao", onNavigateToReports }: ResilienceViewProps) {
  const [districts] = useState<DistrictResilience[]>(initialDistricts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("All");
  const [detailModalItem, setDetailModalItem] = useState<DistrictResilience | null>(null);

  const filteredDistricts = useMemo(() => {
    let result = districts.filter((d) => {
      if (selectedRiskFilter !== "All" && d.riskLevel !== selectedRiskFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          d.district.toLowerCase().includes(q) ||
          d.keyRisks.toLowerCase().includes(q) ||
          d.riskLevel.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    if (selectedDistrict && selectedDistrict !== "All") {
      result = [...result].sort((a, b) => {
        const aMatch = a.district.toLowerCase().includes(selectedDistrict.toLowerCase()) ? 1 : 0;
        const bMatch = b.district.toLowerCase().includes(selectedDistrict.toLowerCase()) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return result;
  }, [districts, selectedRiskFilter, searchQuery, selectedDistrict]);

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h1>Resilience</h1>
          <p>Track and analyse district-level resilience and preparedness</p>
        </div>
        <button
          className="primary-action-btn"
          onClick={onNavigateToReports}
          title="Open Reports"
        >
          <Eye size={16} />
          <span>View Reports</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="resilience-kpi-grid">
        <div className="resilience-kpi-card">
          <div className="kpi-icon-wrap green-light">
            <ShieldCheck size={22} className="text-emerald-700" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">6</div>
            <div className="kpi-title">High Risk Areas</div>
            <div className="kpi-delta danger">
              <span className="delta-arrow">&Delta; 2</span> from yesterday
            </div>
          </div>
        </div>

        <div className="resilience-kpi-card">
          <div className="kpi-icon-wrap yellow-light">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">14</div>
            <div className="kpi-title">Moderate Risk Areas</div>
            <div className="kpi-delta success">
              <span className="delta-arrow">&nabla; 1</span> from yesterday
            </div>
          </div>
        </div>

        <div className="resilience-kpi-card">
          <div className="kpi-icon-wrap green-subtle">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">28</div>
            <div className="kpi-title">Low Risk Areas</div>
            <div className="kpi-delta neutral">
              <span className="delta-arrow">&Delta; 0</span> from yesterday
            </div>
          </div>
        </div>

        <div className="resilience-kpi-card">
          <div className="kpi-icon-wrap blue-light">
            <ShieldCheck size={22} className="text-sky-600" />
          </div>
          <div className="kpi-content">
            <div className="kpi-num">85%</div>
            <div className="kpi-title">Overall Resilience Score</div>
            <div className="kpi-delta success">
              <span className="delta-arrow">&Delta; 2%</span> from last week
            </div>
          </div>
        </div>
      </div>

      {/* Middle 2 Cards: Risk Trend & Resilience by Region */}
      <div className="resilience-charts-grid">
        {/* Left Card: Risk Trend */}
        <div className="resilience-chart-card">
          <div className="chart-card-head">
            <h3>Risk Trend</h3>
            <div className="chart-legend-inline">
              <span className="legend-entry">
                <i className="dot" style={{ background: "#ef4444" }} />
                High Risk
              </span>
              <span className="legend-entry">
                <i className="dot" style={{ background: "#f59e0b" }} />
                Moderate Risk
              </span>
              <span className="legend-entry">
                <i className="dot" style={{ background: "#10b981" }} />
                Low Risk
              </span>
            </div>
          </div>

          <div className="multi-trend-svg-wrap">
            <svg viewBox="0 0 460 160" className="multi-trend-svg">
              <defs>
                <linearGradient id="lowRiskArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="modRiskArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="highRiskArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Lines */}
              {[100, 80, 60, 40, 20, 0].map((val, idx) => {
                const y = 15 + idx * 22;
                return (
                  <g key={val}>
                    <line x1="30" y1={y} x2="445" y2={y} stroke="#f0f3f2" strokeWidth="1" />
                    <text x="22" y={y + 3.5} textAnchor="end" className="chart-grid-text">{val}</text>
                  </g>
                );
              })}

              {/* Low Risk Line (Green: [62, 68, 72, 70, 74, 80]) */}
              <path
                d="M 45,68 L 110,61 L 175,56 L 240,59 L 305,53 L 370,49 L 435,45"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                { x: 45, y: 68 }, { x: 110, y: 61 }, { x: 175, y: 56 },
                { x: 240, y: 59 }, { x: 305, y: 53 }, { x: 370, y: 49 }, { x: 435, y: 45 }
              ].map((p, i) => (
                <circle key={`l-${i}`} cx={p.x} cy={p.y} r="3" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
              ))}

              {/* Moderate Risk Line (Yellow: [38, 40, 42, 41, 40, 42]) */}
              <path
                d="M 45,95 L 110,93 L 175,90 L 240,92 L 305,94 L 370,91 L 435,89"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                { x: 45, y: 95 }, { x: 110, y: 93 }, { x: 175, y: 90 },
                { x: 240, y: 92 }, { x: 305, y: 94 }, { x: 370, y: 91 }, { x: 435, y: 89 }
              ].map((p, i) => (
                <circle key={`m-${i}`} cx={p.x} cy={p.y} r="3" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
              ))}

              {/* High Risk Line (Red: [16, 18, 16, 14, 15, 16]) */}
              <path
                d="M 45,124 L 110,121 L 175,124 L 240,126 L 305,125 L 370,123 L 435,123"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                { x: 45, y: 124 }, { x: 110, y: 121 }, { x: 175, y: 124 },
                { x: 240, y: 126 }, { x: 305, y: 125 }, { x: 370, y: 123 }, { x: 435, y: 123 }
              ].map((p, i) => (
                <circle key={`h-${i}`} cx={p.x} cy={p.y} r="3" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
              ))}

              {/* X Axis Dates */}
              {["14 May", "15 May", "16 May", "17 May", "18 May", "19 May", "20 May"].map((d, i) => (
                <text
                  key={d}
                  x={45 + i * 65}
                  y="152"
                  textAnchor="middle"
                  className="chart-axis-date"
                >
                  {d}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Card: Resilience by Region (Donut Chart) */}
        <div className="resilience-chart-card">
          <div className="chart-card-head">
            <h3>Resilience by Region</h3>
          </div>

          <div className="donut-and-legend-row">
            {/* SVG Donut Chart */}
            <div className="donut-chart-box">
              <svg viewBox="0 0 160 160" className="donut-svg">
                {/* 
                  Circumference = 2 * PI * 60 ≈ 377
                  Low Risk: 50% -> 188.5
                  Moderate: 25% -> 94.25
                  High: 11% -> 41.47
                  No Data: 14% -> 52.78
                */}
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray="176 352"
                  strokeDashoffset="0"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="18"
                  strokeDasharray="88 352"
                  strokeDashoffset="-176"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="18"
                  strokeDasharray="40 352"
                  strokeDashoffset="-264"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="18"
                  strokeDasharray="48 352"
                  strokeDashoffset="-304"
                />
              </svg>
              <div className="donut-center-label">
                <strong>85%</strong>
                <span>Overall<br />Score</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="donut-legend-col">
              <div className="donut-legend-item">
                <span className="dot" style={{ background: "#10b981" }} />
                <span>Low Risk — 28 (50%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="dot" style={{ background: "#f59e0b" }} />
                <span>Moderate Risk — 14 (25%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="dot" style={{ background: "#ef4444" }} />
                <span>High Risk — 6 (11%)</span>
              </div>
              <div className="donut-legend-item">
                <span className="dot" style={{ background: "#94a3b8" }} />
                <span>No Data — 4 (14%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Resilience Metrics Table */}
      <div className="table-card-full">
        <div className="table-card-header-bar">
          <h2>Resilience Metrics</h2>
          <div className="header-search-wrap">
            <div className="input-search-inner compact">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="filter-pill-btn compact"
              onClick={() => {
                setSelectedRiskFilter((prev) =>
                  prev === "All" ? "Low" : prev === "Low" ? "Moderate" : prev === "Moderate" ? "High" : "All"
                );
              }}
            >
              <Filter size={14} />
              <span>{selectedRiskFilter === "All" ? "Filter" : selectedRiskFilter}</span>
            </button>
          </div>
        </div>

        <div className="custom-table-wrap">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Resilience Score</th>
                <th>Risk Level</th>
                <th>Key Risks</th>
                <th>Last Updated</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.length ? (
                filteredDistricts.map((row) => (
                  <tr key={row.district}>
                    <td>
                      <strong>{row.district}</strong>
                    </td>
                    <td>
                      <span className="score-percentage-text">{row.score}%</span>
                    </td>
                    <td>
                      <span className={`pill-badge resilience-${row.riskLevel.toLowerCase()}`}>
                        {row.riskLevel}
                      </span>
                    </td>
                    <td>{row.keyRisks}</td>
                    <td>
                      <span className="time-text">{row.lastUpdated}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="table-action-pill-btn"
                        onClick={() => setDetailModalItem(row)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-table-row">
                    No districts found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          DISTRICT RESILIENCE DETAIL MODAL
      ========================================= */}
      {detailModalItem && (
        <div className="modal-backdrop" onClick={() => setDetailModalItem(null)}>
          <div className="modal-card detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="id-badge">{detailModalItem.district}</span>
                <h3 style={{ marginTop: "4px" }}>Preparedness Assessment</h3>
              </div>
              <button onClick={() => setDetailModalItem(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="detail-modal-body">
              <div className="detail-grid">
                <div>
                  <span className="detail-label">Resilience Score</span>
                  <strong style={{ fontSize: "18px", color: "#15803d" }}>
                    {detailModalItem.score}%
                  </strong>
                </div>
                <div>
                  <span className="detail-label">Risk Category</span>
                  <span className={`pill-badge resilience-${detailModalItem.riskLevel.toLowerCase()}`}>
                    {detailModalItem.riskLevel} Risk
                  </span>
                </div>
                <div>
                  <span className="detail-label">Estimated Population</span>
                  <strong>{detailModalItem.population || "250,000"}</strong>
                </div>
                <div>
                  <span className="detail-label">Active Relief Shelters</span>
                  <strong>{detailModalItem.shelters || "12"} Operational</strong>
                </div>
                <div>
                  <span className="detail-label">Primary Natural Risks</span>
                  <strong>{detailModalItem.keyRisks}</strong>
                </div>
                <div>
                  <span className="detail-label">Audit Timestamp</span>
                  <strong>{detailModalItem.lastUpdated}</strong>
                </div>
              </div>

              <div className="modal-foot-actions">
                <button
                  className="modal-submit-btn"
                  onClick={() => setDetailModalItem(null)}
                >
                  Close Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
