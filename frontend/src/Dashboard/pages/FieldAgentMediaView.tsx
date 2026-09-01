import { useState, useRef } from "react";
import {
  UploadCloud,
  Search,
  ChevronDown,
  Image,
  Mic,
  Check,
  Play,
  Square,
  Volume2
} from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  road: string;
  district: string;
  date: string;
  type: "photo" | "voice";
  duration?: string;
}

export default function FieldAgentMediaView() {
  const [activeTab, setActiveTab] = useState<"photos" | "voice">("photos");
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photos, setPhotos] = useState<MediaItem[]>([
    { id: "p1", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60", road: "NH-27", district: "Dima Hasao", date: "20 May 2025", type: "photo" },
    { id: "p2", url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop&q=60", road: "NH-37", district: "Karbi Anglong", date: "20 May 2025", type: "photo" },
    { id: "p3", url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=60", road: "NH-6", district: "Cachar", date: "19 May 2025", type: "photo" },
    { id: "p4", url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=60", road: "NH-15", district: "Golaghat", date: "19 May 2025", type: "photo" },
    { id: "p5", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=60", road: "NH-10", district: "Hailakandi", date: "18 May 2025", type: "photo" },
    { id: "p6", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=60", road: "NH-27", district: "Kamrup", date: "18 May 2025", type: "photo" },
    { id: "p7", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60", road: "NH-37", district: "Lakhimpur", date: "17 May 2025", type: "photo" }
  ]);

  const [voiceNotes, setVoiceNotes] = useState<MediaItem[]>([
    { id: "v1", url: "", road: "NH-27 Km 14+200", district: "Dima Hasao", date: "20 May 2025", type: "voice", duration: "0:45" },
    { id: "v2", url: "", road: "Bridge #3 Inspection", district: "Karbi Anglong", date: "19 May 2025", type: "voice", duration: "1:12" },
    { id: "v3", url: "", road: "Culvert Washout Notice", district: "Cachar", date: "18 May 2025", type: "voice", duration: "0:28" }
  ]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const newPhoto: MediaItem = {
        id: "p_" + Date.now(),
        url: URL.createObjectURL(files[0]),
        road: "NH-27 Field Photo",
        district: "Guwahati",
        date: "Today, Just now",
        type: "photo"
      };
      setPhotos([newPhoto, ...photos]);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      const newVoice: MediaItem = {
        id: "v_" + Date.now(),
        url: "",
        road: "Field Audio Dispatch",
        district: "Current Location",
        date: "Today, Just now",
        type: "voice",
        duration: `0:${recordTimer < 10 ? "0" + recordTimer : recordTimer}`
      };
      setVoiceNotes([newVoice, ...voiceNotes]);
      setRecordTimer(0);
    } else {
      setIsRecording(true);
      setRecordTimer(0);
      const timer = setInterval(() => {
        setRecordTimer(t => {
          if (t >= 60) {
            clearInterval(timer);
            setIsRecording(false);
            return 60;
          }
          return t + 1;
        });
      }, 1000);
    }
  };

  const filteredPhotos = photos.filter(p => {
    const matchesSearch = p.road.toLowerCase().includes(search.toLowerCase()) || p.district.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === "All Districts" || p.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 1. Header */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <UploadCloud size={24} color="#16a34a" />
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
            Media Upload
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Share photos and videos of field conditions for better monitoring.
          </p>
        </div>
      </div>

      {/* 2. Tabs & Controls Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Top Tab Bar */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", gap: "24px" }}>
          <button
            onClick={() => setActiveTab("photos")}
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "700",
              color: activeTab === "photos" ? "#16a34a" : "#64748b",
              borderBottom: activeTab === "photos" ? "2px solid #16a34a" : "none",
              paddingBottom: "8px",
              cursor: "pointer"
            }}
          >
            <Image size={17} /> Photos ({photos.length})
          </button>

          <button
            onClick={() => setActiveTab("voice")}
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "700",
              color: activeTab === "voice" ? "#16a34a" : "#64748b",
              borderBottom: activeTab === "voice" ? "2px solid #16a34a" : "none",
              paddingBottom: "8px",
              cursor: "pointer"
            }}
          >
            <Mic size={17} /> Voice Notes ({voiceNotes.length})
          </button>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          {/* Search Box */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 14px", width: "280px" }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search media..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", width: "100%" }}
            />
          </div>

          {/* Select Dropdowns */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <select
                value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                style={{ padding: "8px 28px 8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", background: "#ffffff", appearance: "none", fontWeight: 600 }}
              >
                <option value="All Districts">All Districts</option>
                <option value="Dima Hasao">Dima Hasao</option>
                <option value="Karbi Anglong">Karbi Anglong</option>
                <option value="Cachar">Cachar</option>
                <option value="Golaghat">Golaghat</option>
                <option value="Hailakandi">Hailakandi</option>
                <option value="Kamrup">Kamrup</option>
                <option value="Lakhimpur">Lakhimpur</option>
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: "absolute", right: "10px", pointerEvents: "none" }} />
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <select
                style={{ padding: "8px 28px 8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", background: "#ffffff", appearance: "none", fontWeight: 600 }}
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: "absolute", right: "10px", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        {/* 3. Media Grid: Photos View */}
        {activeTab === "photos" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginTop: "8px" }}>
            {filteredPhotos.map((photo) => {
              const isSelected = selectedIds.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => toggleSelect(photo.id)}
                  style={{
                    background: "#ffffff",
                    border: `2px solid ${isSelected ? "#16a34a" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    position: "relative"
                  }}
                >
                  {/* Photo Thumbnail */}
                  <div style={{ position: "relative", height: "130px", width: "100%", background: "#e2e8f0" }}>
                    <img src={photo.url} alt={photo.road} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {/* Checkbox badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "22px",
                        height: "22px",
                        borderRadius: "5px",
                        background: isSelected ? "#16a34a" : "rgba(0,0,0,0.4)",
                        border: "1.5px solid #ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff"
                      }}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Info Label */}
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a" }}>
                      📍 {photo.road} – {photo.district}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                      {photo.date}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Upload More Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "#f0fdf4",
                border: "2px dashed #86efac",
                borderRadius: "12px",
                minHeight: "185px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "background 0.15s ease"
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UploadCloud size={22} color="#16a34a" />
              </div>
              <strong style={{ fontSize: "13px", color: "#166534" }}>Upload More</strong>
              <span style={{ fontSize: "18px", color: "#16a34a", fontWeight: "700" }}>+</span>
            </div>
          </div>
        )}

        {/* Voice Notes View */}
        {activeTab === "voice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            {/* Record New Voice Note Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: isRecording ? "#fef2f2" : "#f8fafc", border: `1px solid ${isRecording ? "#fca5a5" : "#e2e8f0"}`, borderRadius: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: isRecording ? "#dc2626" : "#16a34a",
                    border: "none",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                  }}
                >
                  {isRecording ? <Square size={18} /> : <Mic size={20} />}
                </button>
                <div>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                    {isRecording ? `Recording Field Report... 0:${recordTimer < 10 ? "0" + recordTimer : recordTimer}` : "Record Voice Dispatch"}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {isRecording ? "Speak clearly into your microphone" : "Click microphone to record a quick field audio note"}
                  </span>
                </div>
              </div>

              {isRecording && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#dc2626", fontWeight: "700", fontSize: "13px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#dc2626" }} /> LIVE
                </div>
              )}
            </div>

            {/* Voice Notes List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
              {voiceNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Volume2 size={18} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{note.road}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{note.district} • {note.date}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", background: "#f0fdf4", padding: "2px 6px", borderRadius: "4px" }}>
                      {note.duration}
                    </span>
                    <button
                      onClick={() => alert(`Playing voice report: ${note.road}`)}
                      style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#16a34a", border: "none", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <Play size={12} style={{ marginLeft: "2px" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <button
            onClick={() => alert("All 24 field media files synchronized.")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              color: "#166534",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            View All Media →
          </button>
        </div>
      </div>
    </div>
  );
}
