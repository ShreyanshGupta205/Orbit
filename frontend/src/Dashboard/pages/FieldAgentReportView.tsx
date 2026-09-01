import { useState } from "react";
import {
  FileText,
  Camera,
  Mic,
  Send,
  CheckCircle2
} from "lucide-react";

interface FieldAgentReportViewProps {
  onSuccess?: () => void;
}

export default function FieldAgentReportView({ onSuccess }: FieldAgentReportViewProps) {
  const [incidentType, setIncidentType] = useState("Landslide");
  const [corridor, setCorridor] = useState("NH-27 (Dima Hasao - Silchar)");
  const [severity, setSeverity] = useState<"Critical" | "High" | "Moderate" | "Low">("High");
  const [description, setDescription] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileText size={24} color="#16a34a" />
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
            Submit Field Incident Report
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Broadcast immediate road hazards or hazard assessments to regional disaster response command.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={36} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Incident Report Submitted!</h2>
          <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "450px", margin: 0 }}>
            Your report for <strong>{corridor}</strong> has been logged to the NERA incident grid and broadcasted to dispatch authorities.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            style={{ marginTop: "10px", padding: "10px 24px", borderRadius: "8px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Field 1: Incident Type */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Incident Category
              </label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", color: "#0f172a", background: "#f8fafc", fontWeight: 500 }}
              >
                <option value="Landslide">Landslide / Slope Failure</option>
                <option value="Road Blockage">Road Blockage / Debris</option>
                <option value="Flash Flood">Flash Flood Waterlogging</option>
                <option value="Bridge Damage">Bridge Structural Damage</option>
                <option value="Vehicle Breakdown">Heavy Vehicle Breakdown</option>
              </select>
            </div>

            {/* Field 2: Target Corridor */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Affected Highway / Corridor
              </label>
              <select
                value={corridor}
                onChange={e => setCorridor(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", color: "#0f172a", background: "#f8fafc", fontWeight: 500 }}
              >
                <option value="NH-27 (Dima Hasao - Silchar)">NH-27 (Dima Hasao - Silchar)</option>
                <option value="NH-37 (Jorhat - Haflong)">NH-37 (Jorhat - Haflong)</option>
                <option value="NH-06 (Guwahati - Shillong)">NH-06 (Guwahati - Shillong)</option>
                <option value="SH-22 (West Karbi Anglong)">SH-22 (West Karbi Anglong)</option>
                <option value="NH-15 (Dima Hasao)">NH-15 (Dima Hasao)</option>
              </select>
            </div>
          </div>

          {/* Severity Selector */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              Hazard Severity Level
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {(["Critical", "High", "Moderate", "Low"] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  style={{
                    padding: "10px 8px",
                    borderRadius: "8px",
                    border: severity === sev ? "2px solid #16a34a" : "1px solid #cbd5e1",
                    background: severity === sev ? "#f0fdf4" : "#ffffff",
                    color: severity === sev ? "#166534" : "#475569",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Field Observations &amp; Damage Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe road blockage dimensions, passable lanes, water level, or machinery required..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", color: "#0f172a", outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          {/* Photo & Voice Attachments */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div
              onClick={() => setHasPhoto(!hasPhoto)}
              style={{
                border: `2px dashed ${hasPhoto ? "#16a34a" : "#cbd5e1"}`,
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: hasPhoto ? "#f0fdf4" : "#f8fafc",
                cursor: "pointer"
              }}
            >
              <Camera size={22} color={hasPhoto ? "#16a34a" : "#64748b"} />
              <div>
                <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>
                  {hasPhoto ? "1 Photo Attached (NH-27.jpg)" : "Attach Photo"}
                </strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Click to capture or upload evidence</span>
              </div>
            </div>

            <div
              style={{
                border: "2px dashed #cbd5e1",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#f8fafc",
                cursor: "pointer"
              }}
            >
              <Mic size={22} color="#64748b" />
              <div>
                <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>Attach Voice Note</strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Optional audio dispatch report</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: "10px",
              background: "#16a34a",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              fontSize: "14px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(22,163,74,0.3)"
            }}
          >
            <Send size={16} />
            {isSubmitting ? "Transmitting Report..." : "Submit Incident Report"}
          </button>
        </form>
      )}
    </div>
  );
}
