import { useState } from "react";
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  FileText,
  Image,
  Clock,
  CheckCircle2,
  RefreshCw,
  Info,
  Database
} from "lucide-react";

export default function FieldAgentSyncView() {
  const [isOffline, setIsOffline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(65);
  const [lastSyncTime, setLastSyncTime] = useState("20 May 2025, 10:20 AM");
  const [syncCompleted, setSyncCompleted] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncCompleted(false);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setSyncProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsSyncing(false);
        setIsOffline(false);
        setSyncCompleted(true);
        const now = new Date();
        setLastSyncTime(now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }));
      }
    }, 300);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top Banner Alert (Offline State) */}
      {isOffline && (
        <div
          style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle size={20} color="#dc2626" />
            </div>
            <div>
              <strong style={{ fontSize: "14px", color: "#991b1b", display: "block" }}>You are currently offline</strong>
              <span style={{ fontSize: "12.5px", color: "#b91c1c" }}>
                No internet connection detected. Your data will be saved and synced automatically.
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOffline(false)}
            style={{ padding: "6px 12px", borderRadius: "6px", background: "#ffffff", border: "1px solid #fca5a5", color: "#b91c1c", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
          >
            Simulate Online
          </button>
        </div>
      )}

      {/* Page Title & Status */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: isOffline ? "#fee2e2" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {isOffline ? <WifiOff size={22} color="#dc2626" /> : <Wifi size={22} color="#16a34a" />}
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
              Offline / Sync Status
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Your reports and media are saved offline and will sync automatically when online.
            </p>
          </div>
        </div>

        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "20px",
            background: isOffline ? "#fef2f2" : "#f0fdf4",
            color: isOffline ? "#991b1b" : "#166534",
            fontSize: "12px",
            fontWeight: "700"
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: isOffline ? "#dc2626" : "#16a34a" }} />
          {isOffline ? "Offline" : "Synced"}
        </span>
      </div>

      {/* 2-Column Main Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px" }}>
        {/* Left: Offline Data Card */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Database size={18} color="#16a34a" /> Offline Data
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Row 1 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={18} color="#475569" />
                  <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1e293b" }}>Incident Reports</span>
                </div>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#fee2e2", color: "#991b1b", fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {syncCompleted ? "0" : "2"}
                </span>
              </div>

              {/* Row 2 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Image size={18} color="#475569" />
                  <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1e293b" }}>Media Files</span>
                </div>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#fee2e2", color: "#991b1b", fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {syncCompleted ? "0" : "4"}
                </span>
              </div>

              {/* Row 3 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Clock size={18} color="#475569" />
                  <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1e293b" }}>Pending Updates</span>
                </div>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#fee2e2", color: "#991b1b", fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {syncCompleted ? "0" : "1"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Banner at Bottom */}
          <div style={{ marginTop: "20px", display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px" }}>
            <Info size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontSize: "12px", color: "#1e40af", lineHeight: "1.4" }}>
              Data is stored securely on your device and will be synced when connection is available.
            </span>
          </div>
        </div>

        {/* Right: Sync Status Card */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>
              Sync Status
            </h3>

            {/* Circular Progress & Last Sync */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              {/* Circular Meter */}
              <div style={{ position: "relative", width: "70px", height: "70px", flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3.5"
                    strokeDasharray="88"
                    strokeDashoffset={syncCompleted ? "0" : "30"}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RefreshCw size={20} color="#16a34a" className={isSyncing ? "spin" : ""} />
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Last Sync</span>
                <strong style={{ fontSize: "15px", color: "#0f172a", display: "block", marginTop: "2px" }}>
                  {lastSyncTime}
                </strong>
                <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>
                  {syncCompleted ? "● 100% Up to date" : "● 6 Items queued"}
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534" }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>2 reports saved offline</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534" }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>4 media files saved offline</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: syncCompleted ? "#166534" : "#b45309" }}>
                {syncCompleted ? (
                  <>
                    <CheckCircle2 size={16} color="#16a34a" />
                    <span>All changes synchronized to server</span>
                  </>
                ) : (
                  <>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", margin: "3px" }} />
                    <span>Sync pending when online</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sync Now Button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            style={{
              marginTop: "24px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              color: "#166534",
              borderRadius: "10px",
              padding: "14px",
              fontSize: "14px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
          >
            <RefreshCw size={16} className={isSyncing ? "spin" : ""} />
            {isSyncing ? `Syncing Queue (${syncProgress}%)...` : "Sync Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
