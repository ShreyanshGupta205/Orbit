import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  Navigation,
  AlertTriangle,
  Info,
  Loader2,
  Route as RouteIcon
} from "lucide-react";
import { useApi } from "../../api/client";

interface EvacuationViewProps {
  selectedDistrict?: string;
}

interface EvacuationRecommendation {
  id: string;
  destination: {
    id: number;
    name: string;
    type: string;
    operatingStatus: string;
    districtId: number;
    geometry: { type: string; coordinates: [number, number] };
  };
  startPoint: { lat: number; lng: number };
  route: {
    totalDistanceKm: number;
    maxRisk: number;
    routeSafety: string;
    steps: Array<{
      seq: number;
      node_id: number;
      node_name: string;
      road_segment_id: number;
      road_name: string;
      road_type: string;
      length_km: string;
      segment_risk: number;
      geometry: { type: string; coordinates: Array<[number, number]> };
    }>;
  };
  alternativeRoute?: {
    totalDistanceKm: number;
    steps: Array<any>;
  };
  avoidedBlockedRoads: Array<{ id: number; name: string }>;
  explanation: string;
  safetyDisclaimer: string;
  timestamp: string;
}

export default function EvacuationView({ selectedDistrict: _selectedDistrict }: EvacuationViewProps) {
  const { apiFetch } = useApi();
  const [loading, setLoading] = useState(false);
  const [startLat, setStartLat] = useState("25.18");
  const [startLng, setStartLng] = useState("93.02");
  const [recommendation, setRecommendation] = useState<EvacuationRecommendation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCalculateEvacuation = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiFetch("/api/evacuation/recommend", {
        method: "POST",
        body: JSON.stringify({
          lat: parseFloat(startLat),
          lng: parseFloat(startLng)
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setRecommendation(json.data);
      } else {
        setErrorMsg(json.message || "Failed to generate evacuation recommendation");
      }
    } catch {
      setErrorMsg("Network error communicating with evacuation routing engine");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, startLat, startLng]);

  // Initial calculation on load
  useEffect(() => {
    handleCalculateEvacuation();
  }, [handleCalculateEvacuation]);

  return (
    <div className="evacuation-view-container" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header Banner */}
      <div className="view-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15, 23, 42, 0.6)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
            <ShieldAlert color="#ef4444" size={24} /> Emergency Evacuation Recommendation Engine
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", opacity: 0.7 }}>
            Risk-penalized evacuation routing avoiding blocked roads, high-risk segments, and active hazard zones.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={startLat}
            onChange={e => setStartLat(e.target.value)}
            placeholder="Lat"
            style={{ width: "80px", padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #334155", color: "#fff" }}
          />
          <input
            type="text"
            value={startLng}
            onChange={e => setStartLng(e.target.value)}
            placeholder="Lng"
            style={{ width: "80px", padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #334155", color: "#fff" }}
          />
          <button
            onClick={handleCalculateEvacuation}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
          >
            {loading ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />} Calculate Route
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", fontSize: "14px" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {recommendation && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Left Column: Recommendation Summary & Explanation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Safe Destination Card */}
            <div style={{ background: "#1e293b", padding: "18px", borderRadius: "12px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700", letterSpacing: "0.5px" }}>Recommended Safe Destination</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#38bdf8", margin: "6px 0 10px 0" }}>
                {recommendation.destination.name}
              </h3>
              <div style={{ display: "flex", gap: "12px", fontSize: "13px" }}>
                <span><strong>Type:</strong> {recommendation.destination.type.replace("_", " ")}</span>
                <span><strong>Status:</strong> <span style={{ color: "#4ade80" }}>{recommendation.destination.operatingStatus}</span></span>
                <span><strong>Distance:</strong> {recommendation.route.totalDistanceKm} km</span>
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
                ℹ️ Capacity: Capacity untracked in current database schema
              </div>
            </div>

            {/* Empirical Explanation */}
            <div style={{ background: "#0f172a", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", margin: "0 0 8px 0" }}>
                <Info size={16} color="#38bdf8" /> Route Selection Rationale
              </h4>
              <p style={{ fontSize: "13px", lineHeight: "1.5", color: "#cbd5e1", margin: 0 }}>
                {recommendation.explanation}
              </p>
            </div>

            {/* Safety Disclaimer */}
            <div style={{ background: "#1e1b4b", padding: "12px 16px", borderRadius: "8px", borderLeft: "4px solid #6366f1", fontSize: "12px", color: "#c7d2fe" }}>
              🛡️ <strong>Safety Notice:</strong> {recommendation.safetyDisclaimer}
            </div>

            {/* Avoided Blocked Roads */}
            {recommendation.avoidedBlockedRoads.length > 0 && (
              <div style={{ background: "#1e293b", padding: "14px", borderRadius: "8px", border: "1px solid #334155" }}>
                <h4 style={{ fontSize: "13px", color: "#f87171", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={15} /> Avoided Impassable Road Segments
                </h4>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#cbd5e1" }}>
                  {recommendation.avoidedBlockedRoads.map(b => (
                    <li key={b.id}>{b.name} (Verified Incident)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Route Steps Breakdown */}
          <div style={{ background: "#1e293b", padding: "18px", borderRadius: "12px", border: "1px solid #334155", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <RouteIcon size={18} color="#38bdf8" /> Recommended Evacuation Route
              </h3>
              <span style={{
                padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
                background: recommendation.route.routeSafety === "Safe" ? "#166534" : recommendation.route.routeSafety === "Moderate Risk" ? "#854d0e" : "#991b1b",
                color: "#fff"
              }}>
                {recommendation.route.routeSafety}
              </span>
            </div>

            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", textAlign: "left", color: "#94a3b8" }}>
                    <th style={{ padding: "6px 8px" }}>Step</th>
                    <th style={{ padding: "6px 8px" }}>Segment / Node</th>
                    <th style={{ padding: "6px 8px" }}>Distance</th>
                    <th style={{ padding: "6px 8px" }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendation.route.steps.map((step, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "8px" }}>#{step.seq || idx + 1}</td>
                      <td style={{ padding: "8px" }}><strong>{step.road_name || step.node_name || "Road Segment"}</strong></td>
                      <td style={{ padding: "8px" }}>{step.length_km ? `${step.length_km} km` : "—"}</td>
                      <td style={{ padding: "8px" }}>
                        <span style={{
                          color: step.segment_risk >= 0.7 ? "#ef4444" : step.segment_risk >= 0.5 ? "#f59e0b" : "#22c55e",
                          fontWeight: "600"
                        }}>
                          {(step.segment_risk || 0).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
