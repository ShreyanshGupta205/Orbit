import {
  Cloud,
  CloudRain,
  Database,
  Globe2,
  MessageSquare,
  Radio,
} from "lucide-react";

import "./Integrations.css";

const integrations = [
  {
    icon: Globe2,
    title: "GIS & Mapping",
    subtitle: "Services",
  },
  {
    icon: CloudRain,
    title: "Weather",
    subtitle: "APIs",
  },
  {
    icon: Radio,
    title: "Traffic & IoT",
    subtitle: "Sensors",
  },
  {
    icon: Database,
    title: "Government",
    subtitle: "Databases",
  },
  {
    icon: MessageSquare,
    title: "Messaging",
    subtitle: "Platforms",
  },
  {
    icon: Cloud,
    title: "Cloud",
    subtitle: "Infrastructure",
  },
];

export default function Integrations() {
  return (
    <section className="integrations-section">
      <div className="integrations-container">

        <div className="integrations-heading">
          <h2>Seamless Integrations</h2>

          <p>
            NERA works with the tools and systems you already use.
          </p>
        </div>

        <div className="integration-list">
          {integrations.map((item) => {
            const Icon = item.icon;

            return (
              <div className="integration-item" key={item.title}>
                <div className="integration-icon">
                  <Icon />
                </div>

                <div className="integration-text">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}