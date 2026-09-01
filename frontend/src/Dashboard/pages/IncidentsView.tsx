import { useState, useMemo, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  X,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useApi } from "../../api/client";
import type { IncidentFromApi } from "../../api/client";

export interface IncidentItem {
  id: string;
  type: string;
  category: "Critical" | "Road Damage" | "Flood" | "Landslide" | "Accident" | "Blockage" | "Resolved" | string;
  location: string;
  reportedBy: string;
  severity: "Critical" | "High" | "Medium" | "Low" | string;
  status: "Reported" | "Verified" | "Assigned" | "In Progress" | "Resolved" | string;
  time: string;
  description?: string;
  photoUrl?: string | null;
  // raw API data for actions
  _raw?: IncidentFromApi;
}

const initialIncidents: IncidentItem[] = [
  {
    id: "INC-2026-1145",
    type: "Landslide",
    category: "Landslide",
    location: "NH-15, Dima Hasao",
    reportedBy: "Mobile App",
    severity: "Critical",
    status: "Reported",
    time: "10 min ago",
    description: "Massive debris blockage at Km 12+400 restricting all heavy vehicle transit."
  },
  {
    id: "INC-2026-1144",
    type: "Road Damage",
    category: "Road Damage",
    location: "SH-29, West Karbi Anglong",
    reportedBy: "Patrolling Team",
    severity: "High",
    status: "Verified",
    time: "28 min ago",
    description: "Deep shoulder cracks and asphalt erosion due to flash rain."
  },
  {
    id: "INC-2026-1143",
    type: "Flood",
    category: "Flood",
    location: "NH-27, Kamrup",
    reportedBy: "Mobile App",
    severity: "High",
    status: "Assigned",
    time: "1 hr ago",
    description: "Waterlogging 1.5 ft above road level near highway culvert."
  },
  {
    id: "INC-2026-1142",
    type: "Blockage",
    category: "Critical",
    location: "NH-37, Golaghat",
    reportedBy: "Control Room",
    severity: "Medium",
    status: "Reported",
    time: "2 hr ago",
    description: "Broken container truck obstructing the eastbound dual lane."
  },
  {
    id: "INC-2026-1141",
    type: "Accident",
    category: "Accident",
    location: "NH-27, Kamrup",
    reportedBy: "Mobile App",
    severity: "Medium",
    status: "Resolved",
    time: "4 hr ago",
    description: "Minor collision between two cargo vehicles cleared by patrol unit."
  },
  {
    id: "INC-2026-1140",
    type: "Landslide",
    category: "Landslide",
    location: "NH-2, Arunachal Border",
    reportedBy: "Patrolling Team",
    severity: "High",
    status: "Assigned",
    time: "5 hr ago",
    description: "Hill mud erosion on northern hairpin curve."
  },
  {
    id: "INC-2026-1139",
    type: "Road Damage",
    category: "Road Damage",
    location: "NH-52, Karbi Anglong",
    reportedBy: "Mobile App",
    severity: "Medium",
    status: "Verified",
    time: "6 hr ago",
    description: "Surface potholes expanding on bridge approach."
  },
  {
    id: "INC-2026-1138",
    type: "Flood",
    category: "Resolved",
    location: "SH-12, Haflong",
    reportedBy: "Mobile App",
    severity: "Low",
    status: "Resolved",
    time: "12 hr ago",
    description: "Drainage cleared and normal movement fully restored."
  }
];

interface IncidentsViewProps {
  selectedDistrict?: string;
}

export default function IncidentsView({ selectedDistrict = "Dima Hasao" }: IncidentsViewProps) {
  const { user } = useUser();
  const { apiFetch } = useApi();
  const userRole = (user?.publicMetadata?.role as string) || "citizen";
  const canVerifyResolve = ["admin", "authority", "field_agent"].includes(userRole);
  const canDelete = userRole === "admin";

  const [incidents, setIncidents] = useState<IncidentItem[]>(initialIncidents);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<IncidentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);  // tracks which incident is being verified
  const [confirmVerifyId, setConfirmVerifyId] = useState<string | null>(null);  // two-step confirmation
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const PAGE_SIZE = 20;

  // New incident form state
  const [newType, setNewType] = useState("Landslide");
  const [newLocation, setNewLocation] = useState(`NH-15, ${selectedDistrict}`);
  const [newSeverity, setNewSeverity] = useState<"Critical" | "High" | "Medium" | "Low">("High");
  const [newDescription, setNewDescription] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Map API incident → UI IncidentItem
  function toIncidentItem(api: IncidentFromApi): IncidentItem {
    const status = api.resolvedAt
      ? "Resolved"
      : api.verified
        ? "Verified"
        : "Reported";
    const loc = [api.roadName, api.districtName].filter(Boolean).join(", ") || "Unknown";
    const ago = timeAgo(api.reportedAt);
    return {
      id: String(api.id),
      type: capitalize(api.type.replace(/_/g, " ")),
      category: mapCategory(api.type, api.severity, status),
      location: loc,
      reportedBy: api.reportedBy || "Citizen",
      severity: capitalize(api.severity),
      status,
      time: ago,
      description: api.description,
      photoUrl: api.photoUrl,
      _raw: api
    };
  }

  function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function mapCategory(type: string, severity: string, status: string): string {
    if (status === "Resolved") return "Resolved";
    if (severity === "critical") return "Critical";
    const typeMap: Record<string, string> = {
      landslide: "Landslide",
      flood: "Flood",
      road_damage: "Road Damage",
      bridge_damage: "Road Damage",
      traffic_congestion: "Blockage",
      fallen_tree: "Blockage",
      snowfall: "Flood",
      other: "Accident"
    };
    return typeMap[type] || capitalize(type.replace(/_/g, " "));
  }

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  // Fetch incidents from API
  const fetchIncidents = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("limit", String(PAGE_SIZE));
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      // When on the Unverified tab, pass the filter so the backend uses idx_incidents_unverified
      if (activeTab === "Unverified") {
        params.set("verified", "false");
      }
      const res = await apiFetch(`/api/incidents?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const mapped = (json.data || []).map(toIncidentItem);
        setIncidents(mapped);
        setHasMore(mapped.length >= PAGE_SIZE);
        setPage(pageNum);
      }
    } catch {
      // On error keep existing data (including fallback mock data)
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTab, apiFetch]);

  useEffect(() => {
    fetchIncidents(1);
  }, [fetchIncidents]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchIncidents(1), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateIncident = async (e: FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    setSubmitting(true);
    try {
      // Upload photo if provided
      let photoUrl: string | null = null;
      if (newPhotoFile) {
        const formData = new FormData();
        formData.append("file", newPhotoFile);
        const uploadRes = await apiFetch("/api/uploads", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          photoUrl = uploadJson.url;
        }
      }

      // Map UI type → DB enum
      const typeMap: Record<string, string> = {
        "Landslide": "landslide",
        "Road Damage": "road_damage",
        "Flood": "flood",
        "Blockage": "traffic_congestion",
        "Accident": "other"
      };

      const body = {
        type: typeMap[newType] || "other",
        severity: newSeverity.toLowerCase(),
        longitude: 93.0, // Default coordinates for the region – user can refine
        latitude: 25.0,
        description: newDescription || "Reported through NERA Dashboard.",
        photoUrl
      };

      const res = await apiFetch("/api/incidents", {
        method: "POST",
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setReportModalOpen(false);
        setNewLocation("");
        setNewDescription("");
        setNewPhotoFile(null);
        fetchIncidents(1);
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  // Verify an incident — only authority/admin should call this
  const handleVerify = async (incidentId: string) => {
    setVerifyingId(incidentId);
    setActionError(null);
    try {
      const res = await apiFetch(`/api/incidents/${incidentId}/verify`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setConfirmVerifyId(null);
        setDetailModalItem(null);
        fetchIncidents(page);
      } else if (res.status === 409) {
        setActionError("This incident is already verified.");
      } else if (res.status === 403) {
        setActionError("You are not authorized to verify incidents.");
      } else if (res.status === 401) {
        setActionError("Authentication required. Please sign in again.");
      } else if (res.status === 404) {
        setActionError("Incident not found.");
      } else {
        setActionError(json?.message || "Verification failed. Please try again.");
      }
    } catch {
      setActionError("Network error. Please check your connection.");
    } finally {
      setVerifyingId(null);
    }
  };

  // Resolve an incident
  const handleResolve = async (incidentId: string) => {
    setResolvingId(incidentId);
    setActionError(null);
    try {
      const res = await apiFetch(`/api/incidents/${incidentId}/resolve`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        fetchIncidents(page);
        setDetailModalItem(null);
      } else {
        setActionError(json?.message || "Could not resolve incident. Please try again.");
      }
    } catch {
      setActionError("Network error. Please check your connection.");
    } finally {
      setResolvingId(null);
    }
  };

  // Delete an incident (admin only)
  const handleDelete = async (incidentId: string) => {
    try {
      const res = await apiFetch(`/api/incidents/${incidentId}`, { method: "DELETE" });
      if (res.ok) {
        fetchIncidents(page);
        setDetailModalItem(null);
      }
    } catch { /* silent */ }
  };

  // Dynamic category counts from current page data
  const categories = useMemo(() => {
    const counts: Record<string, number> = { All: incidents.length, Critical: 0, "Road Damage": 0, Flood: 0, Landslide: 0, Accident: 0, Resolved: 0, Unverified: 0 };
    incidents.forEach(item => {
      if (item.severity === "Critical") counts["Critical"]++;
      if (item.status === "Resolved") counts["Resolved"]++;
      if (!item._raw?.verified) counts["Unverified"]++;
      if (item.category === "Landslide") counts["Landslide"]++;
      else if (item.category === "Flood") counts["Flood"]++;
      else if (item.category === "Road Damage") counts["Road Damage"]++;
      else if (item.category === "Accident") counts["Accident"]++;
    });
    const baseTabs = [
      { key: "All", label: "All", count: counts["All"], color: "#166534" },
      { key: "Critical", label: "Critical", count: counts["Critical"], color: "#ef4444" },
      { key: "Road Damage", label: "Road Damage", count: counts["Road Damage"], color: "#f97316" },
      { key: "Flood", label: "Flood", count: counts["Flood"], color: "#0284c7" },
      { key: "Landslide", label: "Landslide", count: counts["Landslide"], color: "#b45309" },
      { key: "Accident", label: "Accident", count: counts["Accident"], color: "#7e22ce" },
      { key: "Resolved", label: "Resolved", count: counts["Resolved"], color: "#15803d" },
    ];
    // Unverified queue tab — only visible to authority and admin
    if (canVerifyResolve) {
      baseTabs.push({ key: "Unverified", label: "Unverified", count: counts["Unverified"], color: "#dc2626" });
    }
    return baseTabs;
  }, [incidents, canVerifyResolve]);

  const filteredIncidents = useMemo(() => {
    let result = incidents.filter((item) => {
      if (activeTab === "Critical" && item.severity !== "Critical") return false;
      if (activeTab === "Resolved" && item.status !== "Resolved") return false;
      if (activeTab === "Unverified" && item._raw?.verified !== false) return false;
      if (
        activeTab !== "All" &&
        activeTab !== "Critical" &&
        activeTab !== "Resolved" &&
        activeTab !== "Unverified" &&
        item.type !== activeTab &&
        item.category !== activeTab
      ) {
        return false;
      }
      return true;
    });

    if (selectedDistrict && selectedDistrict !== "All") {
      result = [...result].sort((a, b) => {
        const aMatch = a.location.toLowerCase().includes(selectedDistrict.toLowerCase()) ? 1 : 0;
        const bMatch = b.location.toLowerCase().includes(selectedDistrict.toLowerCase()) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return result;
  }, [incidents, activeTab, selectedDistrict]);

  return (
    <div className="view-container">
      {/* Top Header */}
      <div className="view-header">
        <div>
          <h1>Incidents</h1>
          <p>Manage and track all reported incidents</p>
        </div>
        <div className="view-header-actions">
          <button
            className="secondary-btn"
            onClick={() => setFilterDrawerOpen((v) => !v)}
          >
            <Filter size={15} />
            <span>Filters</span>
          </button>
          <button
            className="primary-action-btn"
            onClick={() => setReportModalOpen(true)}
          >
            <Plus size={16} />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Filter Drawer / Search Bar */}
      {filterDrawerOpen && (
        <div className="view-filter-bar animate-fade">
          <div className="view-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by ID, location, or reported by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary Filter Tabs Cards */}
      <div className="category-cards-grid">
        {categories.map((cat) => {
          const isActive = activeTab === cat.key;
          return (
            <button
              key={cat.key}
              className={`category-card ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(cat.key)}
            >
              <div className="cat-text" style={{ color: cat.color }}>
                <strong>{cat.label}</strong>
                <span className="cat-count">({cat.count})</span>
              </div>
              {isActive && <div className="cat-active-bar" />}
            </button>
          );
        })}
      </div>

      {/* Incidents Table Card */}
      <div className="table-card-full">
        <div className="custom-table-wrap">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Reported By</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Time</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length ? (
                filteredIncidents.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="id-badge">{item.id}</span>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      <div className="loc-cell">
                        <MapPin size={13} className="loc-pin" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td>{item.reportedBy}</td>
                    <td>
                      <span className={`pill-badge severity-${item.severity.toLowerCase()}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`pill-badge status-${item.status.toLowerCase().replace(" ", "-")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="time-text">{item.time}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="action-icon-btn"
                        onClick={() => setDetailModalItem(item)}
                        title="View details"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-table-row">
                    No incidents found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-center" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button
            className="secondary-btn"
            disabled={page <= 1 || loading}
            onClick={() => fetchIncidents(page - 1)}
            style={{ padding: "6px 12px" }}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ fontSize: 13, opacity: 0.7 }}>Page {page}</span>
          <button
            className="secondary-btn"
            disabled={!hasMore || loading}
            onClick={() => fetchIncidents(page + 1)}
            style={{ padding: "6px 12px" }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* =========================================
          REPORT INCIDENT MODAL
      ========================================= */}
      {reportModalOpen && (
        <div className="modal-backdrop" onClick={() => setReportModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Report New Incident</h3>
              <button onClick={() => setReportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateIncident} className="modal-body-form">
              <div className="form-field">
                <label>Incident Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                  <option value="Landslide">Landslide</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Flood">Flood</option>
                  <option value="Blockage">Blockage</option>
                  <option value="Accident">Accident</option>
                </select>
              </div>

              <div className="form-field">
                <label>Location / Road</label>
                <input
                  type="text"
                  placeholder="e.g. NH-15, Dima Hasao near Haflong"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-field">
                <label>Description & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe damage, vehicle involvement, or lane blockage..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="modal-foot-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setReportModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Incident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          INCIDENT DETAIL MODAL
      ========================================= */}
      {detailModalItem && (
        <div className="modal-backdrop" onClick={() => { setDetailModalItem(null); setConfirmVerifyId(null); setActionError(null); }}>
          <div className="modal-card detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="id-badge">{detailModalItem.id}</span>
                <h3 style={{ marginTop: "4px" }}>{detailModalItem.type} Details</h3>
              </div>
              <button onClick={() => { setDetailModalItem(null); setConfirmVerifyId(null); setActionError(null); }}>
                <X size={18} />
              </button>
            </div>

            <div className="detail-modal-body">
              {/* Core Info Grid */}
              <div className="detail-grid">
                <div>
                  <span className="detail-label">Location</span>
                  <strong>{detailModalItem.location}</strong>
                </div>
                <div>
                  <span className="detail-label">Reported By</span>
                  <strong>{detailModalItem.reportedBy}</strong>
                </div>
                <div>
                  <span className="detail-label">Severity</span>
                  <span className={`pill-badge severity-${detailModalItem.severity.toLowerCase()}`}>
                    {detailModalItem.severity}
                  </span>
                </div>
                <div>
                  <span className="detail-label">Status</span>
                  <span className={`pill-badge status-${detailModalItem.status.toLowerCase().replace(" ", "-")}`}>
                    {detailModalItem.status}
                  </span>
                </div>
                <div>
                  <span className="detail-label">Reported Time</span>
                  <strong>{detailModalItem.time}</strong>
                </div>
                <div>
                  <span className="detail-label">Verified</span>
                  <span className={`pill-badge ${detailModalItem._raw?.verified ? "status-verified" : "status-reported"}`}>
                    {detailModalItem._raw?.verified ? "✓ Verified" : "Unverified"}
                  </span>
                </div>
              </div>

              {/* Coordinates from PostGIS geometry */}
              {detailModalItem._raw?.geometry?.coordinates && (
                <div className="detail-desc-box" style={{ marginTop: 8 }}>
                  <span className="detail-label">
                    <MapPin size={12} style={{ display: "inline", marginRight: 4 }} />
                    Location Coordinates
                  </span>
                  <p style={{ fontFamily: "monospace", fontSize: 13, marginTop: 4 }}>
                    Lat {detailModalItem._raw.geometry.coordinates[1].toFixed(6)},&nbsp;
                    Lng {detailModalItem._raw.geometry.coordinates[0].toFixed(6)}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="detail-desc-box">
                <span className="detail-label">Situation Summary</span>
                <p>{detailModalItem.description || "No further details recorded."}</p>
              </div>

              {/* Photo Evidence */}
              {detailModalItem.photoUrl && (
                <div className="detail-desc-box" style={{ marginTop: 8 }}>
                  <span className="detail-label">Photo Evidence</span>
                  <img
                    src={detailModalItem.photoUrl}
                    alt="Incident photo"
                    style={{ width: "100%", borderRadius: 8, marginTop: 6, maxHeight: 220, objectFit: "cover", border: "1px solid #e5e7eb" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}

              {/* Error Message */}
              {actionError && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6,
                  padding: "8px 12px", color: "#dc2626", fontSize: 13, marginTop: 8
                }}>
                  {actionError}
                </div>
              )}

              {/* Verify Confirmation Step (two-step safety) */}
              {confirmVerifyId === detailModalItem.id && canVerifyResolve && (
                <div style={{
                  background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8,
                  padding: "12px 14px", marginTop: 8
                }}>
                  <p style={{ fontWeight: 600, marginBottom: 6, color: "#92400e" }}>
                    Verify this incident?
                  </p>
                  <p style={{ fontSize: 13, color: "#78350f", marginBottom: 10 }}>
                    This will mark the incident as verified and may affect risk analysis and routing.
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="modal-submit-btn"
                      style={{ background: "#16a34a" }}
                      disabled={verifyingId === detailModalItem.id}
                      onClick={() => handleVerify(detailModalItem.id)}
                    >
                      {verifyingId === detailModalItem.id
                        ? <><Loader2 size={14} style={{ display: "inline", animation: "spin 1s linear infinite" }} /> Verifying...</>
                        : <><ShieldCheck size={14} style={{ display: "inline", marginRight: 4 }} />Confirm Verify</>
                      }
                    </button>
                    <button
                      className="modal-cancel-btn"
                      onClick={() => { setConfirmVerifyId(null); setActionError(null); }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-foot-actions" style={{ flexWrap: "wrap", gap: 8 }}>
                {/* Verify button — authority/admin only, hidden once verified */}
                {canVerifyResolve && !detailModalItem._raw?.verified && confirmVerifyId !== detailModalItem.id && (
                  <button
                    className="modal-submit-btn"
                    style={{ background: "#2563eb" }}
                    onClick={() => { setActionError(null); setConfirmVerifyId(detailModalItem.id); }}
                  >
                    <ShieldCheck size={16} style={{ display: "inline", marginRight: 6 }} />
                    Verify Incident
                  </button>
                )}

                {/* Resolve button — authority/admin/field_agent, wired to real API */}
                {canVerifyResolve && !detailModalItem._raw?.resolvedAt && (
                  <button
                    className="modal-submit-btn"
                    disabled={resolvingId === detailModalItem.id}
                    onClick={() => handleResolve(detailModalItem.id)}
                  >
                    {resolvingId === detailModalItem.id
                      ? <><Loader2 size={14} style={{ display: "inline", animation: "spin 1s linear infinite" }} /> Resolving...</>
                      : <><CheckCircle2 size={16} style={{ display: "inline", marginRight: 6 }} />Mark as Resolved</>
                    }
                  </button>
                )}

                {/* Delete — admin only */}
                {canDelete && (
                  <button
                    className="modal-cancel-btn"
                    style={{ color: "#dc2626", borderColor: "#fca5a5" }}
                    onClick={() => {
                      if (window.confirm("Delete this incident? This action cannot be undone.")) {
                        handleDelete(detailModalItem.id);
                      }
                    }}
                  >
                    <Trash2 size={14} style={{ display: "inline", marginRight: 4 }} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
