import { useState } from "react";
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Zap
} from "lucide-react";

interface WhatIfAnalysisViewProps {
  selectedDistrict?: string;
}

export default function WhatIfAnalysisView({ selectedDistrict: _selectedDistrict = "Dima Hasao" }: WhatIfAnalysisViewProps) {
  const [corridor, setCorridor] = useState("NH-15 (Dima Hasao - Silchar)");
  const [disruptionType, setDisruptionType] = useState("Landslide Blockage");
  const [severity, setSeverity] = useState<"Moderate" | "High" | "Catastrophic">("High");
  const [rainfallIntensity, setRainfallIntensity] = useState(85);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(true);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasSimulated(true);
    }, 600);
  };

  const handleReset = () => {
    setCorridor("NH-15 (Dima Hasao - Silchar)");
    setDisruptionType("Landslide Blockage");
    setSeverity("High");
    setRainfallIntensity(85);
    setHasSimulated(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "4px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "20px 24px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "10px" }}>
            <Sliders size={22} color="#16a34a" /> Scenario Simulator &amp; What-If Risk Analysis
          </h1>
          <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
            Simulate regional road disruptions, extreme monsoon flash floods, and evaluate logistics rerouting cascade impacts.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleReset}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 20px", borderRadius: "8px", border: "none", background: "#16a34a", color: "#ffffff", fontWeight: 600, fontSize: "13px", cursor: "pointer", boxShadow: "0 2px 4px rgba(22,163,74,0.3)" }}
          >
            {isSimulating ? <Zap size={16} className="spin" /> : <Play size={16} />}
            {isSimulating ? "Simulating..." : "Run Scenario Simulation"}
          </button>
        </div>
      </div>

      {/* Simulator Parameters Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {/* Param 1: Corridor */}
        <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
            Target Corridor
          </label>
          <select
            value={corridor}
            onChange={(e) => setCorridor(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", color: "#0f172a", background: "#f8fafc", outline: "none", fontWeight: 500 }}
          >
            <option value="NH-15 (Dima Hasao - Silchar)">NH-15 (Dima Hasao - Silchar)</option>
            <option value="NH-27 (Guwahati - Silchar)">NH-27 (Guwahati - Silchar)</option>
            <option value="NH-06 (Guwahati - Shillong)">NH-06 (Guwahati - Shillong)</option>
            <option value="SH-22 (West Karbi Anglong)">SH-22 (West Karbi Anglong)</option>
            <option value="NH-37 (Jorhat - Haflong)">NH-37 (Jorhat - Haflong)</option>
          </select>
        </div>

        {/* Param 2: Disruption Event */}
        <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
            Disruption Type
          </label>
          <select
            value={disruptionType}
            onChange={(e) => setDisruptionType(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", color: "#0f172a", background: "#f8fafc", outline: "none", fontWeight: 500 }}
          >
            <option value="Landslide Blockage">Major Landslide Blockage</option>
            <option value="Flash Flood Inundation">Flash Flood Inundation (&gt;1.5m)</option>
            <option value="Bridge Structural Failure">Bridge Structural Failure</option>
            <option value="Heavy Mudslide & Rockfall">Heavy Mudslide &amp; Rockfall</option>
          </select>
        </div>

        {/* Param 3: Severity */}
        <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
            Event Severity
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {(["Moderate", "High", "Catastrophic"] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverity(sev)}
                style={{
                  padding: "8px 4px",
                  borderRadius: "6px",
                  border: severity === sev ? "2px solid #16a34a" : "1px solid #cbd5e1",
                  background: severity === sev ? "#f0fdf4" : "#ffffff",
                  color: severity === sev ? "#166534" : "#475569",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Param 4: Rainfall Intensity */}
        <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              24h Rainfall
            </label>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#16a34a" }}>{rainfallIntensity} mm</span>
          </div>
          <input
            type="range"
            min="20"
            max="250"
            value={rainfallIntensity}
            onChange={(e) => setRainfallIntensity(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#16a34a", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Simulation Results */}
      {hasSimulated && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Top Impact KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
            <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", borderLeft: "4px solid #ef4444" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Estimated Delay</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>+4 hrs 15 min</div>
              <div style={{ fontSize: "12px", color: "#ef4444", fontWeight: 600, marginTop: "4px" }}>↑ 185% transit time</div>
            </div>

            <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", borderLeft: "4px solid #f59e0b" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Affected Relief Cargo</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>18 Shipments</div>
              <div style={{ fontSize: "12px", color: "#b45309", fontWeight: 600, marginTop: "4px" }}>6 Critical Medical Consignments</div>
            </div>

            <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", borderLeft: "4px solid #3b82f6" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>At-Risk Population</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>42,500 Citizens</div>
              <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600, marginTop: "4px" }}>Across 14 Valley Clusters</div>
            </div>

            <div style={{ background: "#ffffff", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", borderLeft: "4px solid #16a34a" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Recommended Alternative</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#166534", marginTop: "6px" }}>Via NH-37 &amp; Lumding</div>
              <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600, marginTop: "4px" }}>100% Passable (Risk: 0.18)</div>
            </div>
          </div>

          {/* Detailed Strategy Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Left: Recommended Rerouting Plan */}
            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} color="#16a34a" /> Automated Rerouting Strategy
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>1. Divert Heavy Freight at Lumding Junction</div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                    Notify all Guwahati-to-Silchar heavy logistics trucks to take NH-37 bypass to avoid bottleneck at Km 12+400.
                  </p>
                </div>

                <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>2. Deploy 2 Heavy Excavators from Haflong Depot</div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                    Estimated clearance turnaround: 3.5 hours once on-site.
                  </p>
                </div>

                <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>3. Issue Public SMS Alerts for Dima Hasao</div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                    Broadcast advisory to 28,000 registered citizens on the NERA network.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Rerouting Cost & Time Matrix */}
            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={18} color="#2563eb" /> Corridor Comparison Matrix
              </h3>
              <table style={{ width: "100%", fontSize: "12.5px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left" }}>
                    <th style={{ padding: "8px 4px" }}>Corridor</th>
                    <th style={{ padding: "8px 4px" }}>Distance</th>
                    <th style={{ padding: "8px 4px" }}>Risk</th>
                    <th style={{ padding: "8px 4px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 4px", fontWeight: "600", color: "#0f172a" }}>Primary ({corridor.split(" ")[0]})</td>
                    <td style={{ padding: "10px 4px", color: "#64748b" }}>142 km</td>
                    <td style={{ padding: "10px 4px", color: "#ef4444", fontWeight: "700" }}>0.88 (Critical)</td>
                    <td style={{ padding: "10px 4px" }}><span style={{ padding: "3px 8px", borderRadius: "12px", background: "#fef2f2", color: "#991b1b", fontSize: "11px", fontWeight: 700 }}>Blocked</span></td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 4px", fontWeight: "600", color: "#0f172a" }}>Alternative A (via NH-37)</td>
                    <td style={{ padding: "10px 4px", color: "#64748b" }}>178 km</td>
                    <td style={{ padding: "10px 4px", color: "#16a34a", fontWeight: "700" }}>0.18 (Low)</td>
                    <td style={{ padding: "10px 4px" }}><span style={{ padding: "3px 8px", borderRadius: "12px", background: "#f0fdf4", color: "#166534", fontSize: "11px", fontWeight: 700 }}>Recommended</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 4px", fontWeight: "600", color: "#0f172a" }}>Alternative B (via SH-22)</td>
                    <td style={{ padding: "10px 4px", color: "#64748b" }}>195 km</td>
                    <td style={{ padding: "10px 4px", color: "#f59e0b", fontWeight: "700" }}>0.48 (Moderate)</td>
                    <td style={{ padding: "10px 4px" }}><span style={{ padding: "3px 8px", borderRadius: "12px", background: "#fffbeb", color: "#b45309", fontSize: "11px", fontWeight: 700 }}>Slow Transit</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
