import { useState } from "react";
import type { FormEvent } from "react";
import {
  Bell,
  Map,
  Shield,
  Database,
  Smartphone,
  CheckCircle2,
  Download,
  Trash2,
  Sliders,
  Laptop
} from "lucide-react";

interface SettingsViewProps {
  location: string;
  language: string;
  userName?: string;
  onUpdateLocation: (loc: string) => void;
  onUpdateLanguage: (lang: "English" | "Hindi" | "Assamese") => void;
}

export default function SettingsView({
  location,
  language,
  userName = "Manas",
  onUpdateLocation,
  onUpdateLanguage
}: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<"general" | "notifications" | "map" | "security" | "cache">("general");

  // General state
  const [pollingInterval, setPollingInterval] = useState("5s");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Notification toggles
  const [notifyDisruptions, setNotifyDisruptions] = useState(true);
  const [notifyWeather, setNotifyWeather] = useState(true);
  const [notifyFleet, setNotifyFleet] = useState(true);
  const [notifyShipments, setNotifyShipments] = useState(false);
  const [dailyBriefing, setDailyBriefing] = useState(true);

  // Map & GIS state
  const [mapTheme, setMapTheme] = useState("OpenStreetMap Standard");
  const [defaultZoom, setDefaultZoom] = useState("9x");
  const [glowHighRisk, setGlowHighRisk] = useState(true);
  const [showVehicleLabels, setShowVehicleLabels] = useState(true);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    setToastMessage("Settings saved successfully. Configurations synced across your session.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearCache = () => {
    setToastMessage("Offline GIS Map cache cleared (24.8 MB freed).");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadFieldPack = () => {
    setToastMessage("Offline Field GIS Package (Dima Hasao Corridor) downloaded.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h1>Dashboard Settings</h1>
          <p>Configure telemetry feeds, notification preferences, GIS layers, and security parameters</p>
        </div>
      </div>

      {toastMessage && (
        <div className="download-toast-banner animate-fade">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Navigation & Content */}
      <div className="settings-layout-grid">
        {/* Settings Navigation Menu */}
        <div className="settings-nav-card">
          <button
            className={`settings-nav-btn ${activeSection === "general" ? "active" : ""}`}
            onClick={() => setActiveSection("general")}
          >
            <Sliders size={16} />
            <span>District & Telemetry</span>
          </button>

          <button
            className={`settings-nav-btn ${activeSection === "notifications" ? "active" : ""}`}
            onClick={() => setActiveSection("notifications")}
          >
            <Bell size={16} />
            <span>Alerts & Notifications</span>
          </button>

          <button
            className={`settings-nav-btn ${activeSection === "map" ? "active" : ""}`}
            onClick={() => setActiveSection("map")}
          >
            <Map size={16} />
            <span>GIS & Map Display</span>
          </button>

          <button
            className={`settings-nav-btn ${activeSection === "security" ? "active" : ""}`}
            onClick={() => setActiveSection("security")}
          >
            <Shield size={16} />
            <span>Security & Sessions</span>
          </button>

          <button
            className={`settings-nav-btn ${activeSection === "cache" ? "active" : ""}`}
            onClick={() => setActiveSection("cache")}
          >
            <Database size={16} />
            <span>Offline Field Cache</span>
          </button>
        </div>

        {/* Settings Form Pane */}
        <div className="settings-pane-card">
          {/* =========================================
              SECTION 1: GENERAL & TELEMETRY
          ========================================= */}
          {activeSection === "general" && (
            <form onSubmit={handleSaveSettings} className="settings-section-form">
              <div className="settings-section-head">
                <h2>District Feeds & Telemetry Configuration</h2>
                <p>Manage your primary operational district and live data refresh rate.</p>
              </div>

              <div className="form-field">
                <label>Primary Assigned District</label>
                <select
                  value={location}
                  onChange={(e) => onUpdateLocation(e.target.value)}
                >
                  <option value="Dima Hasao">Dima Hasao (Headquarters)</option>
                  <option value="Kamrup">Kamrup (Central Hub)</option>
                  <option value="Golaghat">Golaghat</option>
                  <option value="West Karbi Anglong">West Karbi Anglong</option>
                  <option value="Haflong">Haflong</option>
                  <option value="Lumding">Lumding</option>
                </select>
              </div>

              <div className="form-field">
                <label>Dashboard Language</label>
                <select
                  value={language}
                  onChange={(e) => onUpdateLanguage(e.target.value as any)}
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Assamese">অসমীয়া (Assamese)</option>
                </select>
              </div>

              <div className="form-field">
                <label>Telemetry Polling Frequency</label>
                <select
                  value={pollingInterval}
                  onChange={(e) => setPollingInterval(e.target.value)}
                >
                  <option value="5s">Real-time (Every 5 seconds - High Precision)</option>
                  <option value="15s">Every 15 seconds (Standard)</option>
                  <option value="30s">Every 30 seconds (Bandwidth Saver)</option>
                  <option value="60s">Every 1 minute</option>
                </select>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>Live Stream Auto-Reconnect</strong>
                  <p>Automatically re-establish WebSocket feed on field network switches.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="settings-foot-btn">
                <button type="submit" className="primary-action-btn">
                  <CheckCircle2 size={16} />
                  <span>Save Telemetry Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================
              SECTION 2: ALERTS & NOTIFICATIONS
          ========================================= */}
          {activeSection === "notifications" && (
            <form onSubmit={handleSaveSettings} className="settings-section-form">
              <div className="settings-section-head">
                <h2>Alert Routing & Notification Rules</h2>
                <p>Choose which severity events trigger desktop notifications and field SMS alerts.</p>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>Critical Road Disruption Alerts</strong>
                  <p>Immediate broadcast when landslides or bridge closures occur on NH-15/NH-27.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifyDisruptions}
                    onChange={(e) => setNotifyDisruptions(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>IMD Flash Rain & Weather Alerts</strong>
                  <p>Receive extreme weather and precipitation warnings from Regional IMD stations.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifyWeather}
                    onChange={(e) => setNotifyWeather(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>Vehicle Fleet Offline Alerts</strong>
                  <p>Alert officer when a registered monitoring vehicle stops reporting GPS for &gt; 15 min.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifyFleet}
                    onChange={(e) => setNotifyFleet(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>Relief Shipment Delay Alerts</strong>
                  <p>Notify if high-priority medical supplies or food ration are delayed by &gt; 1 hr.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifyShipments}
                    onChange={(e) => setNotifyShipments(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>Daily 07:00 AM Morning Executive Digest</strong>
                  <p>Automated snapshot of overnight incidents and planned convoy movements.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={dailyBriefing}
                    onChange={(e) => setDailyBriefing(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="settings-foot-btn">
                <button type="submit" className="primary-action-btn">
                  <CheckCircle2 size={16} />
                  <span>Update Notification Preferences</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================
              SECTION 3: GIS & MAP DISPLAY
          ========================================= */}
          {activeSection === "map" && (
            <form onSubmit={handleSaveSettings} className="settings-section-form">
              <div className="settings-section-head">
                <h2>Cartography & Visual Overlays</h2>
                <p>Customize base tiles, route risk highlights, and default map camera bounds.</p>
              </div>

              <div className="form-field">
                <label>Base Tile Layer Style</label>
                <select value={mapTheme} onChange={(e) => setMapTheme(e.target.value)}>
                  <option value="OpenStreetMap Standard">OpenStreetMap Standard</option>
                  <option value="CartoDB Voyager">CartoDB Voyager (Clean)</option>
                  <option value="CartoDB Positron">CartoDB Positron (High Contrast Light)</option>
                  <option value="Topographic Relief">Topographic Mountain Relief</option>
                </select>
              </div>

              <div className="form-field">
                <label>Default Initial Map Zoom</label>
                <select value={defaultZoom} onChange={(e) => setDefaultZoom(e.target.value)}>
                  <option value="9x">District View (9x - Recommended)</option>
                  <option value="7x">Regional State View (7x)</option>
                  <option value="11x">Corridor Detail (11x)</option>
                </select>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>High Risk Highway Segment Glow</strong>
                  <p>Highlight vulnerable red corridors with glowing gradient stroke on the Live Map.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={glowHighRisk}
                    onChange={(e) => setGlowHighRisk(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <strong>Show Vehicle ID Badges on Map</strong>
                  <p>Display floating vehicle plate pills above active green patrol dots.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showVehicleLabels}
                    onChange={(e) => setShowVehicleLabels(e.target.checked)}
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="settings-foot-btn">
                <button type="submit" className="primary-action-btn">
                  <CheckCircle2 size={16} />
                  <span>Save GIS Preferences</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================
              SECTION 4: SECURITY & SESSIONS
          ========================================= */}
          {activeSection === "security" && (
            <div className="settings-section-form">
              <div className="settings-section-head">
                <h2>Authentication & Active Device Sessions</h2>
                <p>Officer credentials and active terminals connected to this disaster control account.</p>
              </div>

              <div className="security-status-box">
                <div className="security-icon-wrap">
                  <Shield size={24} className="text-emerald-700" />
                </div>
                <div>
                  <strong style={{ fontSize: "14px", color: "#166534" }}>
                    Two-Factor Authentication Active
                  </strong>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#4b5563" }}>
                    Protected via Government NIC-OTP dispatched to {location} Disaster Control.
                  </p>
                </div>
              </div>

              <h3 style={{ margin: "16px 0 8px", fontSize: "13.5px", color: "#17212b" }}>
                Active Terminals
              </h3>

              <div className="session-card-list">
                <div className="session-item current">
                  <div className="session-icon">
                    <Laptop size={18} />
                  </div>
                  <div className="session-info">
                    <strong>Windows 11 – NERA Web Portal (This Terminal)</strong>
                    <span>Officer: {userName} • {location} Control Room • IP 10.45.12.9 • Active Now</span>
                  </div>
                  <span className="pill-badge status-verified">Current</span>
                </div>

                <div className="session-item">
                  <div className="session-icon">
                    <Smartphone size={18} />
                  </div>
                  <div className="session-info">
                    <strong>Samsung Rugged Field Tablet (Patrol Unit #1)</strong>
                    <span>NH-15 Mobile Link • Last seen 12 min ago</span>
                  </div>
                  <button
                    className="revoke-btn"
                    onClick={() => {
                      setToastMessage("Session revoked for Patrol Unit #1 Tablet.");
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              SECTION 5: OFFLINE FIELD CACHE
          ========================================= */}
          {activeSection === "cache" && (
            <div className="settings-section-form">
              <div className="settings-section-head">
                <h2>Offline Field Operation Cache</h2>
                <p>Manage pre-cached topographic vector tiles and road network maps for zero-connectivity zones.</p>
              </div>

              <div className="cache-metric-grid">
                <div className="cache-box">
                  <span>Local GIS Cache</span>
                  <strong>24.8 MB</strong>
                </div>
                <div className="cache-box">
                  <span>Cached Road Segments</span>
                  <strong>18 Corridors</strong>
                </div>
                <div className="cache-box">
                  <span>Offline Incidents Stored</span>
                  <strong>42 Records</strong>
                </div>
              </div>

              <div className="cache-actions-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleDownloadFieldPack}
                >
                  <Download size={15} />
                  <span>Download Dima Hasao Field Pack (.pbf)</span>
                </button>

                <button
                  type="button"
                  className="revoke-btn"
                  onClick={handleClearCache}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                >
                  <Trash2 size={14} />
                  <span>Purge Local Cache</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
