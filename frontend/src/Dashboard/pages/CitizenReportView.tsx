import { useState, useRef } from "react";
import {
  FileEdit,
  MapPin,
  UploadCloud,
  Send,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { saasStore } from "../../store/saasStore";

interface CitizenReportViewProps {
  onSuccess?: () => void;
}

export default function CitizenReportView({ onSuccess }: CitizenReportViewProps) {
  const [category, setCategory] = useState("Road Damage");
  const [location, setLocation] = useState("NH-27, Near Haflong, Dima Hasao");
  const [description, setDescription] = useState("");
  const [shareLiveLocation, setShareLiveLocation] = useState(true);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    { label: "Road Damage", icon: "⚠️", desc: "Potholes, surface erosion, fissures" },
    { label: "Landslide", icon: "🔺", desc: "Slope debris, mud blocking highway" },
    { label: "Flood", icon: "🌊", desc: "Waterlogging, submerged culverts" },
    { label: "Bridge Issue", icon: "🌉", desc: "Structural crack, scour, barrier damage" },
    { label: "Traffic Blockage", icon: "⛔", desc: "Stalled vehicle, fallen trees, protests" },
    { label: "Other", icon: "🟢", desc: "General infrastructure hazard" },
  ];

  const handleClear = () => {
    setCategory("Road Damage");
    setLocation("");
    setDescription("");
    setMediaFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      saasStore.addCitizenReport({
        title: description ? description.slice(0, 40) : `${category} reported on ${location}`,
        location: location || "Assam Corridor",
        category,
        status: "In Progress",
        image: mediaFile ? URL.createObjectURL(mediaFile) : "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=60",
        description,
        reportedBy: "Rahul Sharma",
        liveLocation: shareLiveLocation
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1200);
      }
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileEdit size={24} color="#16a34a" />
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
            Report an Issue
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Help us keep the region safe by reporting road and infrastructure issues.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={36} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Issue Reported Successfully!</h2>
          <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "450px", margin: 0 }}>
            Thank you for contributing. Your report for <strong>{location || "North East Corridor"}</strong> has been logged into the public emergency grid and dispatched for field agent verification.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            style={{ marginTop: "10px", padding: "10px 24px", borderRadius: "8px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Top Form Row: Category + Location */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Category Dropdown */}
            <div style={{ position: "relative" }}>
              <label style={{ fontSize: "12.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                Issue Category
              </label>
              <div
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  color: "#0f172a"
                }}
              >
                <span>{categories.find(c => c.label === category)?.icon} {category}</span>
                <ChevronDown size={16} color="#64748b" />
              </div>

              {categoryDropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden" }}>
                  {categories.map((cat) => (
                    <div
                      key={cat.label}
                      onClick={() => {
                        setCategory(cat.label);
                        setCategoryDropdownOpen(false);
                      }}
                      style={{
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: category === cat.label ? "#f0fdf4" : "transparent",
                        color: category === cat.label ? "#166534" : "#1e293b",
                        fontWeight: category === cat.label ? 700 : 500,
                        fontSize: "13px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9"
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                      <div>
                        <div>{cat.label}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{cat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Input */}
            <div>
              <label style={{ fontSize: "12.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                Location
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "9px 12px" }}>
                <MapPin size={16} color="#64748b" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Enter location (District, City, Landmark)"
                  required
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: "13.5px", width: "100%", color: "#0f172a" }}
                />
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              required
              style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", color: "#0f172a", outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          {/* Add Photo / Video Upload Box */}
          <div>
            <label style={{ fontSize: "12.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
              Add Photo / Video
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed #bfdbfe",
                background: "#f0f7ff",
                borderRadius: "12px",
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setMediaFile(e.target.files[0]);
                  }
                }}
                accept="image/*,video/*"
                style={{ display: "none" }}
              />
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UploadCloud size={22} color="#2563eb" />
              </div>
              <strong style={{ fontSize: "14px", color: "#1e3a8a" }}>
                {mediaFile ? `Attached: ${mediaFile.name}` : "Upload Media"}
              </strong>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                JPG, PNG, MP4 (Max 10MB)
              </span>
            </div>
          </div>

          {/* Bottom Row: Share Live Location Toggle + Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", paddingTop: "8px" }}>
            {/* Live Location Toggle */}
            <div
              onClick={() => setShareLiveLocation(!shareLiveLocation)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer"
              }}
            >
              <MapPin size={16} color={shareLiveLocation ? "#16a34a" : "#64748b"} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Share Live Location</span>
              <div
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "10px",
                  background: shareLiveLocation ? "#16a34a" : "#cbd5e1",
                  position: "relative",
                  transition: "background 0.2s ease"
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    position: "absolute",
                    top: "2px",
                    left: shareLiveLocation ? "18px" : "2px",
                    transition: "left 0.2s ease"
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  background: "#16a34a",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 6px rgba(22,163,74,0.3)"
                }}
              >
                <Send size={15} />
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
