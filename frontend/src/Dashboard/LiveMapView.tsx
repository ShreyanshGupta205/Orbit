import { useState, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";
import {
  AlertTriangle,
  Car,
  Building2,
  X,
  CloudRain,
  Droplets,
  Plus,
  Minus,
  Layers,
  Crosshair,
  Compass,
  ChevronDown
} from "lucide-react";

export interface RoadDetail {
  id: string;
  name: string;
  district: string;
  riskLevel: "Safe" | "Moderate" | "High" | "Critical";
  riskScore: number;
  accessibility: string;
  primaryHazard: string;
  lastUpdated: string;
  weatherTemp: string;
  weatherCondition: string;
  humidity: string;
  trendData: number[]; // 8-10 points for 20-day trend
  trendDates: string[];
}

export const roadDetailsDatabase: Record<string, RoadDetail> = {
  "NH-15": {
    id: "NH-15",
    name: "NH-15",
    district: "Dima Hasao District",
    riskLevel: "High",
    riskScore: 82,
    accessibility: "Partially Accessible",
    primaryHazard: "Landslide",
    lastUpdated: "2 min ago",
    weatherTemp: "22°C",
    weatherCondition: "Light Rain",
    humidity: "85%",
    trendData: [48, 62, 75, 52, 49, 58, 79, 72, 85, 92, 82],
    trendDates: ["14 May", "17 May", "20 May"]
  },
  "NH-27": {
    id: "NH-27",
    name: "NH-27",
    district: "Kamrup / Nagaon District",
    riskLevel: "Moderate",
    riskScore: 54,
    accessibility: "Fully Accessible",
    primaryHazard: "Traffic Congestion",
    lastUpdated: "5 min ago",
    weatherTemp: "26°C",
    weatherCondition: "Overcast",
    humidity: "74%",
    trendData: [30, 42, 48, 55, 60, 52, 54],
    trendDates: ["14 May", "17 May", "20 May"]
  },
  "AH-2": {
    id: "AH-2",
    name: "AH-2",
    district: "Karbi Anglong District",
    riskLevel: "Safe",
    riskScore: 24,
    accessibility: "Fully Accessible",
    primaryHazard: "None",
    lastUpdated: "12 min ago",
    weatherTemp: "25°C",
    weatherCondition: "Partly Cloudy",
    humidity: "68%",
    trendData: [20, 25, 22, 28, 24, 21, 24],
    trendDates: ["14 May", "17 May", "20 May"]
  },
  "SH-22": {
    id: "SH-22",
    name: "SH-22",
    district: "West Karbi Anglong",
    riskLevel: "Critical",
    riskScore: 94,
    accessibility: "Blocked",
    primaryHazard: "Flash Flood & Mudflow",
    lastUpdated: "1 min ago",
    weatherTemp: "21°C",
    weatherCondition: "Heavy Rain",
    humidity: "92%",
    trendData: [40, 55, 65, 80, 88, 92, 94],
    trendDates: ["14 May", "17 May", "20 May"]
  },
  "NH-37": {
    id: "NH-37",
    name: "NH-37",
    district: "Golaghat / Jorhat",
    riskLevel: "Safe",
    riskScore: 18,
    accessibility: "Fully Accessible",
    primaryHazard: "None",
    lastUpdated: "15 min ago",
    weatherTemp: "27°C",
    weatherCondition: "Clear",
    humidity: "62%",
    trendData: [15, 18, 16, 20, 19, 17, 18],
    trendDates: ["14 May", "17 May", "20 May"]
  }
};

// Route Polylines across Assam / Northeast region
interface RouteSegment {
  id: string;
  roadName: string;
  district: string;
  riskLevel: "Safe" | "Moderate" | "High" | "Critical";
  roadType: string;
  coords: [number, number][];
}

const roadRoutes: RouteSegment[] = [
  // NH-02 Northern connection
  {
    id: "nh-02-north",
    roadName: "NH-02",
    district: "Karbi Anglong",
    riskLevel: "Safe",
    roadType: "National Highway",
    coords: [
      [26.25, 92.95],
      [26.05, 93.10],
      [25.95, 93.15]
    ]
  },
  // NH-27 West-East central corridor
  {
    id: "nh-27-west",
    roadName: "NH-27",
    district: "Kamrup",
    riskLevel: "Critical",
    roadType: "National Highway",
    coords: [
      [25.95, 93.15],
      [25.80, 93.12],
      [25.68, 93.05]
    ]
  },
  {
    id: "nh-27-mid",
    roadName: "NH-27",
    district: "Karbi Anglong",
    riskLevel: "Moderate",
    roadType: "National Highway",
    coords: [
      [25.68, 93.05],
      [25.62, 93.20],
      [25.66, 93.38]
    ]
  },
  {
    id: "nh-27-east",
    roadName: "NH-27",
    district: "Golaghat",
    riskLevel: "Safe",
    roadType: "National Highway",
    coords: [
      [25.66, 93.38],
      [25.85, 93.65],
      [26.05, 93.88],
      [26.22, 93.98]
    ]
  },
  // AH-2 Corridor
  {
    id: "ah-2-west",
    roadName: "AH-2",
    district: "West Karbi Anglong",
    riskLevel: "Safe",
    roadType: "National Highway",
    coords: [
      [25.60, 92.65],
      [25.55, 92.78],
      [25.42, 92.92]
    ]
  },
  {
    id: "ah-2-south",
    roadName: "AH-2",
    district: "Dima Hasao",
    riskLevel: "Critical",
    roadType: "National Highway",
    coords: [
      [25.42, 92.92],
      [25.28, 93.05],
      [25.22, 93.18]
    ]
  },
  // NH-15 Dima Hasao High-risk route
  {
    id: "nh-15-highrisk",
    roadName: "NH-15",
    district: "Dima Hasao",
    riskLevel: "High",
    roadType: "National Highway",
    coords: [
      [25.22, 93.18],
      [25.35, 93.30],
      [25.48, 93.45],
      [25.56, 93.58]
    ]
  },
  // SH-22 Southern connecting spur
  {
    id: "sh-22-spur",
    roadName: "SH-22",
    district: "Dima Hasao",
    riskLevel: "Critical",
    roadType: "State Highway",
    coords: [
      [25.48, 93.45],
      [25.32, 93.52],
      [25.10, 93.55],
      [24.95, 93.52]
    ]
  },
  // NH-37 Eastern Safe route
  {
    id: "nh-37-east",
    roadName: "NH-37",
    district: "Golaghat",
    riskLevel: "Safe",
    roadType: "National Highway",
    coords: [
      [26.22, 93.98],
      [25.95, 93.85],
      [25.70, 93.75],
      [25.40, 93.92],
      [25.15, 94.02]
    ]
  },
  // Lumding to Haflong internal connector
  {
    id: "lumding-haflong-connector",
    roadName: "NH-15",
    district: "Dima Hasao",
    riskLevel: "Moderate",
    roadType: "District Road",
    coords: [
      [25.75, 93.16],
      [25.52, 93.12],
      [25.35, 93.30]
    ]
  },
  {
    id: "haflong-east-connector",
    roadName: "NH-15",
    district: "Dima Hasao",
    riskLevel: "High",
    roadType: "State Highway",
    coords: [
      [25.35, 93.30],
      [25.42, 93.72],
      [25.56, 93.82]
    ]
  }
];

interface MapIncident {
  id: string;
  roadName: string;
  district: string;
  lat: number;
  lng: number;
  label: string;
  hazard: string;
}

const incidentsData: MapIncident[] = [
  { id: "inc-1", roadName: "AH-2", district: "West Karbi Anglong", lat: 25.42, lng: 92.92, label: "Flash Flood Warning", hazard: "Flood" },
  { id: "inc-2", roadName: "NH-27", district: "Karbi Anglong", lat: 25.68, lng: 93.28, label: "Heavy Vehicle Breakdown", hazard: "Traffic Breakdown" },
  { id: "inc-3", roadName: "NH-15", district: "Dima Hasao", lat: 25.40, lng: 93.78, label: "Major Landslide Blockage", hazard: "Landslide" }
];

interface MapVehicle {
  id: string;
  lat: number;
  lng: number;
  plate: string;
  speed: string;
}

const vehiclesData: MapVehicle[] = [
  { id: "v-1", lat: 25.65, lng: 93.36, plate: "AS-01-EA-4921", speed: "42 km/h" },
  { id: "v-2", lat: 25.72, lng: 93.26, plate: "AS-09-C-1842", speed: "38 km/h" }
];

const riskColorMap = {
  Safe: "#22c55e",
  Moderate: "#eab308",
  High: "#f97316",
  Critical: "#ef4444"
};

function makeIncidentIcon() {
  return L.divIcon({
    className: "livemap-incident-marker",
    html: `<div class="marker-pulse-triangle"><svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13" stroke="#ffffff" stroke-width="2.5"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#ffffff" stroke-width="3"/></svg></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 24]
  });
}

function makeVehicleIcon() {
  return L.divIcon({
    className: "livemap-vehicle-marker",
    html: `<div class="marker-vehicle-bubble"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function makePlaceLabelIcon(name: string, isState = false) {
  return L.divIcon({
    className: isState ? "livemap-state-label" : "livemap-place-label",
    html: `<span>${name}</span>`,
    iconSize: [100, 20],
    iconAnchor: [50, 10]
  });
}

function makeRoadBadgeIcon(name: string, bg: string = "#15803d") {
  return L.divIcon({
    className: "livemap-road-badge",
    html: `<span style="background:${bg}">${name}</span>`,
    iconSize: [44, 18],
    iconAnchor: [22, 9]
  });
}

function LiveMapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  return (
    <div className="livemap-controls-group">
      <button
        className="ctrl-btn"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <Plus size={18} />
      </button>
      <button
        className="ctrl-btn"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <Minus size={18} />
      </button>
      <button
        className="ctrl-btn"
        onClick={() => {}}
        aria-label="Map Layers"
        title="Map Layers"
      >
        <Layers size={18} />
      </button>
      <button
        className="ctrl-btn"
        onClick={() => map.setView(center, zoom)}
        aria-label="Re-center"
        title="Re-center map"
      >
        <Crosshair size={18} />
      </button>
    </div>
  );
}

function LiveMapResetCompass() {
  const map = useMap();
  return (
    <div className="livemap-compass-group">
      <button
        className="ctrl-btn compass-btn"
        onClick={() => map.setView([25.60, 93.30], 8.5)}
        aria-label="Reset orientation"
        title="Reset view orientation"
      >
        <Compass size={18} />
      </button>
    </div>
  );
}

// Sparkline / Risk Trend Line Chart Component
function RiskTrendChart({ data, dates }: { data: number[]; dates: string[] }) {
  const width = 280;
  const height = 90;
  const paddingLeft = 24;
  const paddingBottom = 18;
  const paddingTop = 8;
  const paddingRight = 8;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const minVal = 0;
  const maxVal = 100;

  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * chartW;
    const y = paddingTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${paddingTop + chartH} L ${points[0].x},${paddingTop + chartH} Z`;

  return (
    <div className="risk-trend-chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg">
        <defs>
          <linearGradient id="riskTrendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Grid lines and labels */}
        <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="#f0f2f1" strokeWidth="1" />
        <text x={paddingLeft - 4} y={paddingTop + 4} textAnchor="end" className="chart-axis-label">100</text>

        <line x1={paddingLeft} y1={paddingTop + chartH / 2} x2={width - paddingRight} y2={paddingTop + chartH / 2} stroke="#f0f2f1" strokeWidth="1" />
        <text x={paddingLeft - 4} y={paddingTop + chartH / 2 + 4} textAnchor="end" className="chart-axis-label">50</text>

        <line x1={paddingLeft} y1={paddingTop + chartH} x2={width - paddingRight} y2={paddingTop + chartH} stroke="#f0f2f1" strokeWidth="1" />
        <text x={paddingLeft - 4} y={paddingTop + chartH + 3} textAnchor="end" className="chart-axis-label">0</text>

        {/* Gradient fill area */}
        <path d={areaD} fill="url(#riskTrendGrad)" />

        {/* Line stroke */}
        <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={i === points.length - 1 ? "4" : "2.8"} fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
        ))}

        {/* X Dates */}
        <text x={paddingLeft} y={height - 2} className="chart-date-label">{dates[0] || "14 May"}</text>
        <text x={paddingLeft + chartW / 2} y={height - 2} textAnchor="middle" className="chart-date-label">{dates[1] || "17 May"}</text>
        <text x={width - paddingRight} y={height - 2} textAnchor="end" className="chart-date-label">{dates[2] || "20 May"}</text>
      </svg>
    </div>
  );
}

const districtCoords: Record<string, { center: [number, number]; zoom: number; primaryRoad: string }> = {
  "Dima Hasao": { center: [25.18, 93.02], zoom: 9, primaryRoad: "NH-15" },
  "Kamrup": { center: [26.18, 91.73], zoom: 9.5, primaryRoad: "NH-27" },
  "Golaghat": { center: [26.52, 93.97], zoom: 9.5, primaryRoad: "NH-37" },
  "West Karbi Anglong": { center: [25.85, 92.65], zoom: 9.5, primaryRoad: "SH-22" },
  "Karbi Anglong": { center: [26.05, 93.45], zoom: 9, primaryRoad: "NH-02" },
  "Haflong": { center: [25.17, 93.02], zoom: 10.5, primaryRoad: "NH-15" },
  "Maibong": { center: [25.30, 93.16], zoom: 10.5, primaryRoad: "SH-22" },
  "Lumding": { center: [25.75, 93.17], zoom: 10.5, primaryRoad: "NH-27" },
};

function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface LiveMapViewProps {
  selectedDistrict?: string;
  onDistrictChange?: (district: string) => void;
}

export default function LiveMapView({
  selectedDistrict: propDistrict = "Dima Hasao",
  onDistrictChange
}: LiveMapViewProps) {
  const [selectedDistrict, setSelectedDistrict] = useState(propDistrict);
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [selectedRoadType, setSelectedRoadType] = useState("All");
  const [selectedHazard, setSelectedHazard] = useState("All");
  const [selectedFacility, setSelectedFacility] = useState("All");
  const [showVehicles, setShowVehicles] = useState(true);

  // Inspector card state (default selected: NH-15 as shown in image)
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>("NH-15");
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Sync when propDistrict changes from Navbar
  useEffect(() => {
    if (propDistrict && propDistrict !== "All") {
      setSelectedDistrict(propDistrict);
      const conf = districtCoords[propDistrict];
      if (conf) {
        setSelectedRoadId(conf.primaryRoad);
        setInspectorOpen(true);
      }
    }
  }, [propDistrict]);

  const mapCenter = useMemo(() => {
    if (selectedDistrict !== "All" && districtCoords[selectedDistrict]) {
      return districtCoords[selectedDistrict].center;
    }
    return [25.62, 93.20] as [number, number];
  }, [selectedDistrict]);

  const mapZoom = useMemo(() => {
    if (selectedDistrict !== "All" && districtCoords[selectedDistrict]) {
      return districtCoords[selectedDistrict].zoom;
    }
    return 8.5;
  }, [selectedDistrict]);

  const selectedRoadData = useMemo(() => {
    if (!selectedRoadId) return roadDetailsDatabase["NH-15"];
    return roadDetailsDatabase[selectedRoadId] || roadDetailsDatabase["NH-15"];
  }, [selectedRoadId]);

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    if (onDistrictChange && district !== "All") {
      onDistrictChange(district);
    }
    if (district !== "All" && districtCoords[district]) {
      setSelectedRoadId(districtCoords[district].primaryRoad);
      setInspectorOpen(true);
    }
  };

  const handleClearFilters = () => {
    setSelectedDistrict("All");
    setSelectedRisk("All");
    setSelectedRoadType("All");
    setSelectedHazard("All");
    setSelectedFacility("All");
    setShowVehicles(true);
  };

  // Filtered route segments
  const filteredRoutes = useMemo(() => {
    return roadRoutes.filter((r) => {
      if (selectedDistrict !== "All" && !r.district.includes(selectedDistrict)) return false;
      if (selectedRisk !== "All" && r.riskLevel !== selectedRisk) return false;
      if (selectedRoadType !== "All" && r.roadType !== selectedRoadType) return false;
      return true;
    });
  }, [selectedDistrict, selectedRisk, selectedRoadType]);

  const filteredIncidents = useMemo(() => {
    return incidentsData.filter((inc) => {
      if (selectedDistrict !== "All" && !inc.district.includes(selectedDistrict)) return false;
      if (selectedHazard !== "All" && inc.hazard !== selectedHazard) return false;
      return true;
    });
  }, [selectedDistrict, selectedHazard]);

  return (
    <div className="livemap-page">
      {/* Page Header */}
      <div className="livemap-header">
        <h1>Live Map</h1>
        <p>Real-time road status and incident overview</p>
      </div>

      {/* Main 3-Column Layout */}
      <div className="livemap-layout">
        {/* =========================================
            LEFT COLUMN: FILTERS PANEL
        ========================================= */}
        <aside className="livemap-filter-sidebar">
          <div className="filter-panel-header">
            <h2>Filters</h2>
            <button className="clear-btn" onClick={handleClearFilters}>
              Clear all
            </button>
          </div>

          <div className="filter-controls">
            {/* District */}
            <div className="filter-group">
              <label>District</label>
              <div className="custom-select-wrap">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictSelect(e.target.value)}
                >
                  <option value="All">All Districts</option>
                  <option value="Dima Hasao">Dima Hasao</option>
                  <option value="Kamrup">Kamrup</option>
                  <option value="Golaghat">Golaghat</option>
                  <option value="West Karbi Anglong">West Karbi Anglong</option>
                  <option value="Karbi Anglong">Karbi Anglong</option>
                  <option value="Haflong">Haflong</option>
                  <option value="Maibong">Maibong</option>
                  <option value="Lumding">Lumding</option>
                </select>
                <ChevronDown size={15} className="select-arrow" />
              </div>
            </div>

            {/* Risk Level */}
            <div className="filter-group">
              <label>Risk Level</label>
              <div className="custom-select-wrap">
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Safe">Safe</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <ChevronDown size={15} className="select-arrow" />
              </div>
            </div>

            {/* Road Type */}
            <div className="filter-group">
              <label>Road Type</label>
              <div className="custom-select-wrap">
                <select
                  value={selectedRoadType}
                  onChange={(e) => setSelectedRoadType(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="National Highway">National Highway</option>
                  <option value="State Highway">State Highway</option>
                  <option value="District Road">District Road</option>
                </select>
                <ChevronDown size={15} className="select-arrow" />
              </div>
            </div>

            {/* Hazard Type */}
            <div className="filter-group">
              <label>Hazard Type</label>
              <div className="custom-select-wrap">
                <select
                  value={selectedHazard}
                  onChange={(e) => setSelectedHazard(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Flood">Flood</option>
                  <option value="Traffic Breakdown">Traffic Breakdown</option>
                </select>
                <ChevronDown size={15} className="select-arrow" />
              </div>
            </div>

            {/* Facility Type */}
            <div className="filter-group">
              <label>Facility Type</label>
              <div className="custom-select-wrap">
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Fuel Station">Fuel Station</option>
                  <option value="Relief Camp">Relief Camp</option>
                </select>
                <ChevronDown size={15} className="select-arrow" />
              </div>
            </div>

            {/* Show Vehicles Toggle */}
            <div className="filter-toggle-row">
              <span>Show Vehicles</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showVehicles}
                  onChange={(e) => setShowVehicles(e.target.checked)}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
        </aside>

        {/* =========================================
            CENTER: INTERACTIVE MAP AREA
        ========================================= */}
        <section className="livemap-center-container">
          <div className="livemap-canvas-wrapper">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              minZoom={7}
              maxZoom={12}
              zoomControl={false}
              attributionControl={false}
              className="livemap-leaflet"
            >
              <MapFlyTo center={mapCenter} zoom={mapZoom} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {/* Road Segments Polylines */}
              {filteredRoutes.map((route) => (
                <Polyline
                  key={route.id}
                  positions={route.coords}
                  pathOptions={{
                    color: riskColorMap[route.riskLevel],
                    weight: 3.8,
                    opacity: 0.95,
                    lineCap: "round",
                    lineJoin: "round"
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedRoadId(route.roadName);
                      setInspectorOpen(true);
                    }
                  }}
                >
                  <Popup>
                    <strong>{route.roadName}</strong> ({route.district})
                    <br />
                    Risk: <span style={{ color: riskColorMap[route.riskLevel], fontWeight: 700 }}>{route.riskLevel}</span>
                  </Popup>
                </Polyline>
              ))}

              {/* State & City Text Overlays */}
              <Marker position={[25.90, 93.00]} icon={makePlaceLabelIcon("ASSAM", true)} />
              <Marker position={[25.28, 93.05]} icon={makePlaceLabelIcon("Lumding")} />
              <Marker position={[25.32, 93.52]} icon={makePlaceLabelIcon("Haflong")} />
              <Marker position={[26.05, 93.88]} icon={makePlaceLabelIcon("Golaghat")} />

              {/* Road Badges (AH-2, NH-27, NH-02, NH-37, etc.) */}
              <Marker position={[25.60, 92.65]} icon={makeRoadBadgeIcon("AH-2", "#15803d")} />
              <Marker position={[25.66, 93.38]} icon={makeRoadBadgeIcon("AH-2", "#15803d")} />
              <Marker position={[25.68, 93.05]} icon={makeRoadBadgeIcon("NH-27", "#e75050")} />
              <Marker position={[26.15, 93.02]} icon={makeRoadBadgeIcon("NH-02", "#15803d")} />
              <Marker position={[25.95, 93.15]} icon={makeRoadBadgeIcon("NH-27", "#15803d")} />
              <Marker position={[25.95, 93.85]} icon={makeRoadBadgeIcon("NH-37", "#15803d")} />
              <Marker position={[25.35, 93.50]} icon={makeRoadBadgeIcon("SH-22", "#15803d")} />
              <Marker position={[24.95, 93.52]} icon={makeRoadBadgeIcon("N-27", "#0284c7")} />

              {/* Incident Markers */}
              {filteredIncidents.map((inc) => (
                <Marker
                  key={inc.id}
                  position={[inc.lat, inc.lng]}
                  icon={makeIncidentIcon()}
                  eventHandlers={{
                    click: () => {
                      setSelectedRoadId(inc.roadName);
                      setInspectorOpen(true);
                    }
                  }}
                >
                  <Popup>
                    <strong>{inc.label}</strong>
                    <br />
                    {inc.roadName} — {inc.district}
                  </Popup>
                </Marker>
              ))}

              {/* Vehicles on Map */}
              {showVehicles &&
                vehiclesData.map((v) => (
                  <Marker
                    key={v.id}
                    position={[v.lat, v.lng]}
                    icon={makeVehicleIcon()}
                  >
                    <Popup>
                      <strong>Active Vehicle</strong>
                      <br />
                      Plate: {v.plate}
                      <br />
                      Speed: {v.speed}
                    </Popup>
                  </Marker>
                ))}

              <LiveMapController center={[25.60, 93.30]} zoom={8.5} />
              <LiveMapResetCompass />
            </MapContainer>

            {/* Floating Bottom Legend */}
            <div className="livemap-bottom-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#22c55e" }} />
                <span>Safe</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#eab308" }} />
                <span>Moderate</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#f97316" }} />
                <span>High</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#ef4444" }} />
                <span>Critical</span>
              </div>
              <div className="legend-divider" />
              <div className="legend-item">
                <AlertTriangle size={14} className="legend-icon-warn" />
                <span>Incident</span>
              </div>
              <div className="legend-item">
                <Car size={14} className="legend-icon-veh" />
                <span>Vehicle</span>
              </div>
              <div className="legend-item">
                <Building2 size={14} className="legend-icon-fac" />
                <span>Facility</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            RIGHT COLUMN: ROAD INSPECTOR CARD
        ========================================= */}
        {inspectorOpen && (
          <aside className="livemap-inspector-sidebar">
            <div className="inspector-card">
              {/* Header */}
              <div className="inspector-header">
                <div className="inspector-title-row">
                  <h3>{selectedRoadData.name}</h3>
                  <span className={`risk-badge ${selectedRoadData.riskLevel.toLowerCase()}`}>
                    {selectedRoadData.riskLevel} Risk
                  </span>
                  <button
                    className="inspector-close-btn"
                    onClick={() => setInspectorOpen(false)}
                    aria-label="Close panel"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="inspector-subtitle">{selectedRoadData.district}</p>
              </div>

              {/* Risk Score */}
              <div className="inspector-metric-box">
                <span className="metric-label">Risk Score</span>
                <div className="metric-value-row">
                  <span className="metric-num">{selectedRoadData.riskScore}</span>
                  <span className="metric-max">/100</span>
                </div>
              </div>

              {/* Key Attributes */}
              <div className="inspector-info-list">
                <div className="info-row">
                  <span className="info-label">Accessibility</span>
                  <span className="info-val">{selectedRoadData.accessibility}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Primary Hazard</span>
                  <span className="info-val">{selectedRoadData.primaryHazard}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Updated</span>
                  <span className="info-val-muted">{selectedRoadData.lastUpdated}</span>
                </div>
              </div>

              {/* Risk Trend Chart */}
              <div className="inspector-trend-section">
                <div className="trend-head">
                  <h4>Risk Trend</h4>
                  <span className="trend-sub">(20 Days)</span>
                </div>
                <RiskTrendChart
                  data={selectedRoadData.trendData}
                  dates={selectedRoadData.trendDates}
                />
              </div>

              {/* Weather Widget */}
              <div className="inspector-weather-section">
                <h4>Weather</h4>
                <div className="weather-grid">
                  <div className="weather-metric">
                    <CloudRain size={18} className="weather-icon" />
                    <div>
                      <strong>{selectedRoadData.weatherTemp}</strong>
                      <span>{selectedRoadData.weatherCondition}</span>
                    </div>
                  </div>
                  <div className="weather-metric">
                    <Droplets size={18} className="weather-icon blue" />
                    <div>
                      <strong>{selectedRoadData.humidity}</strong>
                      <span>Humidity</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="inspector-action-btn">
                View Details
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
