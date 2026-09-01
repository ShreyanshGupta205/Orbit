import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Car,
  ChevronRight,
  Database,
  Leaf,
  MapPin,
  Megaphone,
  Menu,
  Monitor,
  Phone,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "../index.css";
import neraLogo from "../assets/nera-logo.jpg";
import LiveData from "../Components/LiveData";
import Integrations from "../Components/Integrations";
import Testimonials from "../Components/Testimonials";
import FAQ from "../Components/FAQ";
import MobileApp from "../Components/MobileApp";

export interface LandingPageProps {
  onGetStarted?: () => void;
}

function Header({ onGetStarted }: { onGetStarted?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="container nav">
        <a className="logo" href="#">
          <img
            src={neraLogo}
            alt="NERA - North East Resilience Assistant"
            className="nav-logo-img"
          />
        </a>

        <nav className={open ? "nav-links mobile-open" : "nav-links"}>
          <a href="#hero" onClick={() => setOpen(false)}>Home</a>
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#live-data" onClick={() => setOpen(false)}>Live Data</a>
          <a href="#mobile-app" onClick={() => setOpen(false)}>Mobile App</a>
          <a href="#integrations" onClick={() => setOpen(false)}>Integrations</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </nav>

        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SignedOut>
            <button className="login-btn" onClick={onGetStarted} title="Sign In to NERA">
              <Users size={15} />
              Sign In
            </button>
          </SignedOut>

          <SignedIn>
            <button className="login-btn" onClick={onGetStarted} title="Open NERA Dashboard">
              <Users size={15} />
              Dashboard
            </button>
            <UserButton />
          </SignedIn>

          <button
            className="menu-btn"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-image" />

      <div className="container hero-content">
        <div className="hero-copy">
          <h1>
            Building a Resilient Northeast,
            <br />
            <span>One Road at a Time.</span>
          </h1>

          <p>
            NERA (North East Resilience Assistant) is a unified platform to
            monitor, manage and strengthen the region's transport and
            infrastructure for a safer, more connected and resilient
            Northeast.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={onGetStarted}>
              Get Started
              <ArrowRight size={16} />
            </button>

            <button
              className="outline-btn"
              onClick={() => {
                const liveDataEl = document.getElementById("live-data");
                if (liveDataEl) liveDataEl.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <PlayIcon />
              Watch Overview
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <span className="play-icon">
      <span />
    </span>
  );
}

const Features = [
  {
    icon: "road",
    title: "Road Monitoring",
    description: "Track road conditions and infrastructure health in real time.",
  },
  {
    icon: "incident",
    title: "Incident Management",
    description: "Get instant alerts on road incidents and take quick action.",
  },
  {
    icon: "vehicle",
    title: "Vehicle & Shipment Tracking",
    description: "Monitor movement of vehicles and shipments across the region.",
  },
  {
    icon: "resilience",
    title: "Resilience Intelligence",
    description: "Analyze risks and prepare better for future challenges.",
  },
];

const stats = [
  {
    icon: "road",
    value: "5,000+",
    label: "Roads Monitored",
  },
  {
    icon: "vehicle",
    value: "50,000+",
    label: "Vehicles Tracked",
  },
  {
    icon: "incident",
    value: "1,200+",
    label: "Incidents Detected",
  },
  {
    icon: "location",
    value: "8",
    label: "Districts Covered",
  },
];

const steps = [
  {
    icon: <Monitor />,
    title: "Monitor",
    description: "Collect real-time data",
  },
  {
    icon: <Search />,
    title: "Detect",
    description: "Identify risks early",
  },
  {
    icon: <BarChart3 />,
    title: "Analyze",
    description: "Assess impact & trends",
  },
  {
    icon: <Megaphone />,
    title: "Respond",
    description: "Enable quick action",
  },
];

function FeatureIcon({ type }: { type: string }) {
  switch (type) {
    case "road":
      return (
        <div className="kf-road-icon">
          <div className="road-left" />
          <div className="road-right" />
          <div className="road-center" />
        </div>
      );
    case "incident":
      return <AlertTriangle />;
    case "vehicle":
      return <Car />;
    case "resilience":
      return <ShieldCheck />;
    case "location":
      return <MapPin />;
    default:
      return null;
  }
}

function KeyFeatures() {
  return (
    <section id="features" className="key-features">
      <div className="kf-container">
        <div className="kf-heading">
          <h2>Key Features</h2>
          <p>Real-time insights for better planning and faster response</p>
        </div>

        <div className="kf-feature-grid">
          {Features.map((feature) => (
            <div className="kf-feature-card" key={feature.title}>
              <div className="kf-feature-icon">
                <FeatureIcon type={feature.icon} />
              </div>
              <div className="kf-feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="kf-stats">
          {stats.map((stat, index) => (
            <div
              className={`kf-stat ${
                index !== stats.length - 1 ? "kf-stat-border" : ""
              }`}
              key={stat.label}
            >
              <div className="kf-stat-icon">
                <FeatureIcon type={stat.icon} />
              </div>
              <div className="kf-stat-text">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="kf-how">
          <div className="kf-how-title">
            <h2>How It Works</h2>
            <p>From data to decisions — in real time</p>
          </div>

          <div className="kf-how-divider" />

          <div className="kf-steps">
            {steps.map((step, index) => (
              <div className="kf-step-wrapper" key={step.title}>
                <div className="kf-step">
                  <div className="kf-step-icon">{step.icon}</div>
                  <div className="kf-step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <ChevronRight className="kf-arrow" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section className="cta">
      <div className="container cta-inner">
        <div>
          <span className="cta-icon">
            <Leaf size={20} />
          </span>

          <div>
            <h2>Ready to make the Northeast more resilient?</h2>
            <p>Join the network helping build safer, smarter roads.</p>
          </div>
        </div>

        <button className="white-btn" onClick={onGetStarted}>
          Access NERA Dashboard
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="logo footer-logo" href="#">
            <img
              src={neraLogo}
              alt="NERA Logo"
              className="footer-logo-img"
            />
          </a>

          <p>North East Resilience Assistant</p>

          <div className="socials">
            <span>in</span>
            <span>𝕏</span>
            <span>f</span>
          </div>
        </div>

        <FooterColumn title="Quick Links" links={["About", "Features", "Mobile App"]} />
        <FooterColumn title="Resources" links={["Documentation", "API Reference"]} />
        <FooterColumn title="Legal" links={["Privacy Policy", "Terms of Service"]} />

        <div className="footer-contact">
          <h4>Contact</h4>

          <a href="mailto:hello@nera.network">
            <span className="contact-icon">
              <Database size={14} />
            </span>
            hello@nera.network
          </a>

          <a href="tel:+18005550123">
            <span className="contact-icon">
              <Phone size={14} />
            </span>
            +1 (800) 555-0123
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>
      {links.map((link) => (
        <a href="#" key={link}>
          {link}
        </a>
      ))}
    </div>
  );
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="landing-root">
      <Header onGetStarted={onGetStarted} />
      <main>
        <Hero onGetStarted={onGetStarted} />
        <KeyFeatures />
        <div id="live-data">
          <LiveData />
        </div>
        <div id="mobile-app">
          <MobileApp />
        </div>
        <div id="integrations">
          <Integrations />
        </div>
        <Testimonials />
        <div id="faq">
          <FAQ />
        </div>
        <CTA onGetStarted={onGetStarted} />
      </main>
      <Footer />
    </div>
  );
}
