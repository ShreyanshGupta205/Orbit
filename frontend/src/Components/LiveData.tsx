import {
  AlertTriangle,
  Bell,
  Car,
  Check,
  ShieldAlert,
} from "lucide-react";

import "./LiveData.css";

type Incident = {
  location: string;
  type: string;
  time: string;
  severity: "green" | "yellow";
};

const incidents: Incident[] = [
  {
    location: "NH-27, Assam",
    type: "Vehicle Crash",
    time: "5 min ago",
    severity: "green",
  },
  {
    location: "NH-6, Meghalaya",
    type: "Road Closure",
    time: "12 min ago",
    severity: "green",
  },
  {
    location: "NH-39, Manipur",
    type: "Flooding",
    time: "18 min ago",
    severity: "green",
  },
  {
    location: "NH-2, Arunachal",
    type: "Landslide",
    time: "25 min ago",
    severity: "yellow",
  },
];

const roadLevels = [
  { label: "Good", className: "good" },
  { label: "Moderate", className: "moderate" },
  { label: "Poor", className: "poor" },
  { label: "Critical", className: "critical" },
];

const weatherLevels = [
  { label: "Light", className: "good" },
  { label: "Moderate", className: "moderate" },
  { label: "Heavy", className: "heavy" },
  { label: "Extreme", className: "critical" },
];

function MapBackground({
  variant,
}: {
  variant: "road" | "vehicle" | "weather";
}) {
  return (
    <div className={`live-map ${variant}`}>
      {/* map-like terrain */}
      <div className="map-terrain terrain-one" />
      <div className="map-terrain terrain-two" />
      <div className="map-terrain terrain-three" />

      {/* roads */}
      <div className="map-road map-road-1" />
      <div className="map-road map-road-2" />
      <div className="map-road map-road-3" />
      <div className="map-road map-road-4" />

      {/* small rivers */}
      <div className="map-river river-one" />
      <div className="map-river river-two" />

      {variant === "road" && (
        <>
          <span className="road-label assam">ASSAM</span>
          <span className="road-label guwahati">Guwahati</span>

          <span className="map-warning warning-one">!</span>
          <span className="map-warning warning-two">!</span>
          <span className="map-warning warning-three">!</span>

          <span className="map-marker blue-marker" />
        </>
      )}

      {variant === "vehicle" && (
        <>
          <span className="vehicle-marker marker-one">
            <Car size={10} />
          </span>

          <span className="vehicle-marker marker-two">
            <Car size={10} />
          </span>

          <span className="vehicle-marker marker-three">
            <Car size={10} />
          </span>

          <div className="vehicle-popup">
            <strong>Truck: 234-4567</strong>
            <span>Speed: 48 km/h</span>
            <span>Heading: NE</span>
            <span>
              Status: <b>Normal</b>
            </span>
          </div>
        </>
      )}

      {variant === "weather" && (
        <>
          <div className="weather-zone" />
          <div className="weather-zone zone-two" />
          <span className="weather-marker">•</span>
        </>
      )}
    </div>
  );
}

function RoadConditions() {
  return (
    <article className="live-card road-card">
      <h3>Road Conditions</h3>

      <div className="legend">
        {roadLevels.map((level) => (
          <span key={level.label}>
            <i className={level.className} />
            {level.label}
          </span>
        ))}
      </div>

      <MapBackground variant="road" />

      <p className="card-description">
        See current road conditions
        <br />
        across Northeast India.
      </p>
    </article>
  );
}

function LiveIncidents() {
  return (
    <article className="live-card incident-card">
      <h3>Live Incidents</h3>

      <div className="incident-list">
        {incidents.map((incident) => (
          <div className="incident-row" key={incident.location}>
            <div className={`incident-icon ${incident.severity}`}>
              <AlertTriangle size={12} />
            </div>

            <div className="incident-info">
              <strong>{incident.location}</strong>
              <span>{incident.type}</span>
            </div>

            <time>{incident.time}</time>
          </div>
        ))}
      </div>

      <button className="live-outline-button">
        View all incidents
      </button>
    </article>
  );
}

function VehicleTracking() {
  return (
    <article className="live-card vehicle-card">
      <h3>Vehicle Tracking</h3>

      <MapBackground variant="vehicle" />

      <p className="card-description">
        Track vehicles and shipments
        <br />
        in real time.
      </p>
    </article>
  );
}

function WeatherImpact() {
  return (
    <article className="live-card weather-card">
      <h3>Weather Impact</h3>

      <MapBackground variant="weather" />

      <div className="legend weather-legend">
        {weatherLevels.map((level) => (
          <span key={level.label}>
            <i className={level.className} />
            {level.label}
          </span>
        ))}
      </div>

      <p className="card-description">
        Monitor weather conditions
        <br />
        and forecast impacts.
      </p>
    </article>
  );
}

function SmartAlerts() {
  return (
    <div className="live-intelligence-card">
      <div className="live-intelligence-icon alert-icon">
        <Bell size={31} strokeWidth={2} />
      </div>

      <div className="live-intelligence-body">
        <h3>Smart Alerts</h3>

        <div className="live-check-list">
          <div>
            <Check size={16} />
            <span>Road Closure on NH-6</span>
          </div>

          <div>
            <Check size={16} />
            <span>Flood Risk Detected in Manipur</span>
          </div>

          <div>
            <Check size={16} />
            <span>Landslide Warning in Nagaland</span>
          </div>
        </div>

        <p>
          Get instant notifications and take
          <br />
          action before it’s too late.
        </p>

        <button className="live-action-btn">
          Manage Alerts
        </button>
      </div>
    </div>
  );
}


function ResilienceIntelligence() {
  return (
    <div className="live-intelligence-card">
      <div className="live-intelligence-icon ai-icon">
        <ShieldAlert size={31} strokeWidth={2} />
      </div>

      <div className="live-intelligence-body">
        <h3>AI-Powered Resilience Intelligence</h3>

        <div className="live-check-list">
          <div>
            <Check size={16} />
            <span>Risk Assessment</span>
          </div>

          <div>
            <Check size={16} />
            <span>Predictive Analytics</span>
          </div>

          <div>
            <Check size={16} />
            <span>Scenario Planning</span>
          </div>
        </div>

        <p>
          AI analyzes data to identify risks and recommend
          <br />
          actions for a more resilient infrastructure.
        </p>

        <button className="live-action-btn">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default function LiveData() {
  return (
    <section className="live-data-section">
      <div className="live-data-container">

        {/* Heading */}
        <div className="live-heading">
          <h2>Real-Time Data at Your Fingertips</h2>

          <p>
            Live maps, live updates, smarter decisions.
          </p>
        </div>

        {/* Four cards */}
        <div className="live-cards-grid">
          <RoadConditions />
          <LiveIncidents />
          <VehicleTracking />
          <WeatherImpact />
        </div>

        {/* Bottom intelligence cards */}
        <div className="intelligence-grid">
          <SmartAlerts />
          <ResilienceIntelligence />
        </div>

      </div>
    </section>
  );
}