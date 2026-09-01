import { Check } from "lucide-react";
import "./MobileApp.css";

const features = [
  "Real-time Road Conditions",
  "Incident Reporting",
  "Live Vehicle Tracking",
  "Weather Alerts",
  "Offline Access",
];

export default function MobileApp() {
  return (
    <section className="mobile-app-section">
      <div className="mobile-app-container">
        {/* Phones */}
        <div className="mobile-app-visual">
          <img
            src="/images/nera-phones.png"
            alt="NERA mobile application on two phones"
            className="mobile-app-phones"
          />
        </div>

        {/* Main content */}
        <div className="mobile-app-content">
          <h2>NERA Mobile App</h2>

          <h3>Power in Your Pocket</h3>

          <p>
            Access real-time maps, report incidents, and
            <br className="desktop-break" />
            receive alerts on the go.
          </p>

          <div className="mobile-app-stores">
            <a href="#" aria-label="Download on the App Store">
              <img
                src="/images/nera-app-store-badge.png"
                alt="Download on the App Store"
              />
            </a>

            <a href="#" aria-label="Get it on Google Play">
              <img
                src="/images/nera-google-play-badge.png"
                alt="Get it on Google Play"
              />
            </a>
          </div>
        </div>

        {/* Feature list */}
        <div className="mobile-app-features">
          {features.map((feature) => (
            <div className="mobile-app-feature" key={feature}>
              <Check />
              <span>{feature}</span>
            </div>
          ))}

          <button className="mobile-app-button">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}