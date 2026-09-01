import { useState } from "react";
import type { FormEvent } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Shield,
  BadgeCheck,
  Building,
  Radio,
  Clock,
  CheckCircle2,
  FileCheck,
  Users,
  AlertTriangle,
  History
} from "lucide-react";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "OF";
}

interface ProfileViewProps {
  location: string;
  language: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onUpdateLocation?: (loc: string) => void;
  onUpdateUser?: (user: { name: string; email?: string; role?: string }) => void;
}

export default function ProfileView({
  location,
  language,
  userName = "Manas",
  userEmail = "manas.officer@assam.gov.in",
  userRole = "District Disaster Management Officer",
  onUpdateUser
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"general" | "jurisdiction" | "contacts" | "activity">("general");

  // Editable form state
  const [fullName, setFullName] = useState(userName);
  const [designation, setDesignation] = useState(userRole);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState("+91 94350-12849");
  const [radioChannel, setRadioChannel] = useState("VHF CH-14 (Assam Relief Net)");
  const [department, setDepartment] = useState("Department of Revenue & Disaster Management");
  const [stationBase, setStationBase] = useState("Haflong District Emergency Operations Centre");
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ name: fullName, email, role: designation });
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const activityLog = [
    {
      id: "ACT-8491",
      action: "Approved Incident Dispatch",
      target: "NH-15 Landslide Clearance Unit at Km 12+400",
      time: "25 min ago",
      icon: AlertTriangle,
      color: "red"
    },
    {
      id: "ACT-8490",
      action: "Verified Relief Shipment Delivery",
      target: "SHP-2026-1146 (500 Medicine Boxes to Kamrup)",
      time: "1.5 hrs ago",
      icon: FileCheck,
      color: "green"
    },
    {
      id: "ACT-8489",
      action: "Updated District Vulnerability Assessment",
      target: "Dima Hasao Preparedness Audit Score (82/100)",
      time: "4 hrs ago",
      icon: Shield,
      color: "blue"
    },
    {
      id: "ACT-8488",
      action: "Vehicle Fleet Relocation Order",
      target: "Assigned AS-01-AC-1123 to Northern Bypass Patrol",
      time: "Yesterday, 17:30",
      icon: Users,
      color: "amber"
    }
  ];

  const emergencyContacts = [
    {
      name: "Pranab Kalita",
      role: "Deputy Control Commander",
      phone: "+91 94350-99120",
      channel: "VHF CH-14",
      status: "On Duty"
    },
    {
      name: "Debojit Bora",
      role: "State Highway Patrol Coordinator",
      phone: "+91 94350-88123",
      channel: "VHF CH-12",
      status: "In Field"
    },
    {
      name: "Haflong Civil Hospital Liaison",
      role: "Emergency Medical Relief",
      phone: "+91 3673-236221",
      channel: "Direct Line",
      status: "Available 24x7"
    },
    {
      name: "SDRF 1st Battalion Control",
      role: "State Disaster Response Force",
      phone: "+91 361-2237011",
      channel: "VHF CH-16",
      status: "High Readiness"
    }
  ];

  return (
    <div className="view-container">
      {/* Header Banner */}
      <div className="profile-banner-card">
        <div className="profile-banner-top">
          <div className="profile-hero-avatar">
            <span>{getInitials(fullName)}</span>
            <div className="profile-online-badge" title="Officer Active On Duty" />
          </div>

          <div className="profile-hero-info">
            <div className="profile-hero-name-row">
              <h1>{fullName}</h1>
              <span className="officer-badge">
                <BadgeCheck size={14} /> Verified Official
              </span>
              <span className="officer-id-pill">ID: NERA-AS-8842</span>
            </div>
            <p className="profile-hero-title">{designation}</p>
            <div className="profile-hero-meta">
              <span>
                <MapPin size={13} /> {location}, Assam
              </span>
              <span>
                <Building size={13} /> {stationBase}
              </span>
              <span>
                <Shield size={13} /> Clearance: Level 3 (Emergency Ops)
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs-row">
          <button
            className={`profile-tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <UserRound size={15} />
            <span>Officer Details</span>
          </button>
          <button
            className={`profile-tab-btn ${activeTab === "jurisdiction" ? "active" : ""}`}
            onClick={() => setActiveTab("jurisdiction")}
          >
            <MapPin size={15} />
            <span>Assigned Corridors</span>
          </button>
          <button
            className={`profile-tab-btn ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <Users size={15} />
            <span>Emergency Team</span>
          </button>
          <button
            className={`profile-tab-btn ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            <History size={15} />
            <span>Action Log</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="download-toast-banner animate-fade">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>Profile information updated and synced with state disaster directory.</span>
        </div>
      )}

      {/* =========================================
          TAB 1: GENERAL OFFICER DETAILS
      ========================================= */}
      {activeTab === "general" && (
        <div className="profile-content-grid">
          <div className="table-card-full profile-form-card">
            <div className="table-card-header-bar">
              <h2>Official Credentials & Contact Details</h2>
              <span className="text-muted-xs">Last updated today</span>
            </div>

            <form onSubmit={handleSave} className="profile-settings-form">
              <div className="form-row-2">
                <div className="form-field">
                  <label>Full Officer Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Official Role / Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Government Email Address</label>
                  <div className="input-search-inner standalone">
                    <Mail size={15} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Direct Contact Phone</label>
                  <div className="input-search-inner standalone">
                    <Phone size={15} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Relief Radio Frequency / Channel</label>
                  <div className="input-search-inner standalone">
                    <Radio size={15} />
                    <input
                      type="text"
                      value={radioChannel}
                      onChange={(e) => setRadioChannel(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Governing Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Duty Station Base & Headquarters</label>
                <input
                  type="text"
                  value={stationBase}
                  onChange={(e) => setStationBase(e.target.value)}
                />
              </div>

              <div className="profile-form-footer">
                <button type="submit" className="primary-action-btn">
                  <CheckCircle2 size={16} />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Sidebar */}
          <div className="profile-side-stats">
            <div className="side-metric-card">
              <span className="metric-label">System Privileges</span>
              <strong className="text-dark">Full District Access</strong>
              <p className="text-muted-xs">Authorized to declare emergency bypasses & dispatch state relief inventory.</p>
            </div>

            <div className="side-metric-card">
              <span className="metric-label">Active Session Details</span>
              <div className="meta-list-sm">
                <div><span>Primary District</span><strong>{location}</strong></div>
                <div><span>Interface Language</span><strong>{language}</strong></div>
                <div><span>Connected Network</span><strong>GovNet SSL Secure</strong></div>
                <div><span>Duty Shift</span><strong>24x7 On-Call Lead</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 2: ASSIGNED CORRIDORS
      ========================================= */}
      {activeTab === "jurisdiction" && (
        <div className="corridor-cards-grid">
          <div className="corridor-card">
            <div className="corridor-head">
              <span className="id-badge bold">NH-15</span>
              <span className="pill-badge severity-critical">High Priority</span>
            </div>
            <h3>Dima Hasao – Haflong Highway</h3>
            <p>Critical mountain pass connection. Prone to slope failure during heavy monsoons.</p>
            <div className="corridor-stats-row">
              <div><span>Total Length</span><strong>84 km</strong></div>
              <div><span>Monitoring Units</span><strong>3 Vehicles</strong></div>
              <div><span>Vulnerability</span><strong>82 / 100</strong></div>
            </div>
          </div>

          <div className="corridor-card">
            <div className="corridor-head">
              <span className="id-badge bold">NH-27</span>
              <span className="pill-badge status-active">Active Safe</span>
            </div>
            <h3>East-West Corridor (Kamrup Section)</h3>
            <p>Dual-lane heavy transit highway connecting Guwahati logistics hubs with eastern districts.</p>
            <div className="corridor-stats-row">
              <div><span>Total Length</span><strong>142 km</strong></div>
              <div><span>Monitoring Units</span><strong>6 Vehicles</strong></div>
              <div><span>Vulnerability</span><strong>28 / 100</strong></div>
            </div>
          </div>

          <div className="corridor-card">
            <div className="corridor-head">
              <span className="id-badge bold">SH-29</span>
              <span className="pill-badge status-idle">Moderate Watch</span>
            </div>
            <h3>West Karbi Anglong Link</h3>
            <p>Secondary state highway serving rural relief supply hubs and food grain depots.</p>
            <div className="corridor-stats-row">
              <div><span>Total Length</span><strong>65 km</strong></div>
              <div><span>Monitoring Units</span><strong>2 Vehicles</strong></div>
              <div><span>Vulnerability</span><strong>45 / 100</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 3: EMERGENCY CONTACTS TEAM
      ========================================= */}
      {activeTab === "contacts" && (
        <div className="table-card-full">
          <div className="table-card-header-bar">
            <h2>Immediate Emergency Coordination Roster</h2>
            <span className="text-muted-xs">Updated 24x7 Response Network</span>
          </div>
          <div className="custom-table-wrap">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Contact Name</th>
                  <th>Designation / Role</th>
                  <th>Direct Contact</th>
                  <th>Radio Frequency</th>
                  <th>Readiness Status</th>
                </tr>
              </thead>
              <tbody>
                {emergencyContacts.map((c) => (
                  <tr key={c.name}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.role}</td>
                    <td>
                      <a href={`tel:${c.phone}`} className="phone-link">
                        <Phone size={13} style={{ display: "inline", marginRight: 4 }} />
                        {c.phone}
                      </a>
                    </td>
                    <td>
                      <span className="mono-num">{c.channel}</span>
                    </td>
                    <td>
                      <span className="pill-badge status-verified">{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 4: RECENT ACTION LOG
      ========================================= */}
      {activeTab === "activity" && (
        <div className="table-card-full">
          <div className="table-card-header-bar">
            <h2>Officer Action & Audit Timeline</h2>
            <span className="text-muted-xs">Immutable cryptographic log</span>
          </div>
          <div className="activity-timeline-list">
            {activityLog.map((act) => {
              const Icon = act.icon;
              return (
                <div className="activity-log-row" key={act.id}>
                  <div className={`activity-icon-badge ${act.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="activity-main">
                    <div className="activity-title-line">
                      <strong>{act.action}</strong>
                      <span className="activity-id-tag">{act.id}</span>
                    </div>
                    <p>{act.target}</p>
                  </div>
                  <div className="activity-time-col">
                    <Clock size={12} />
                    <span>{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
