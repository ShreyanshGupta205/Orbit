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
  Truck,
  HardHat,
  UserCheck,
  ShieldAlert,
  ArrowUpRight
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
  onSelectRole?: (role: string, name?: string) => void;
}

function Header({ onGetStarted, onSelectRole }: { onGetStarted?: () => void; onSelectRole?: (role: string, name?: string) => void }) {
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
          <a href="#roles" onClick={() => setOpen(false)}>Workspaces</a>
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#live-data" onClick={() => setOpen(false)}>Live Data</a>
          <a href="#mobile-app" onClick={() => setOpen(false)}>Mobile App</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </nav>

        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => onSelectRole ? onSelectRole("Citizen", "Rahul Sharma") : onGetStarted && onGetStarted()}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
          >
            Citizen Portal
          </button>

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
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#dcfce7", color: "#166534", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", marginBottom: "14px" }}>
            ✨ Enterprise Multi-Tenant Disaster &amp; Logistics SaaS
          </div>
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
                const rolesEl = document.getElementById("roles");
                if (rolesEl) rolesEl.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Workspaces ↓
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleWorkspaces({ onSelectRole }: { onSelectRole?: (role: string, name?: string) => void }) {
  const roles = [
    {
      id: "authority",
      role: "Authority / Analyst",
      name: "Rakshana",
      title: "Disaster Management & Regional Oversight",
      desc: "District hazard analytics, live corridor maps, road resilience scoring, and evacuation route planning.",
      icon: ShieldAlert,
      badge: "Command Center",
      color: "#ef4444",
      bg: "#fff5f5",
      border: "#fecaca"
    },
    {
      id: "logistics",
      role: "Logistics Operator",
      name: "Rahul Sharma",
      title: "Supply Chain & Transit Dispatch",
      desc: "Real-time fleet GPS tracking, critical cargo priority routes, shipment status, and route risk donut analytics.",
      icon: Truck,
      badge: "Fleet Dispatch",
      color: "#2563eb",
      bg: "#eff6ff",
      border: "#bfdbfe"
    },
    {
      id: "field",
      role: "Field Agent",
      name: "Rahul",
      title: "On-Ground Incident Response",
      desc: "Instant field hazard submission, geotagged photo capture, voice dispatch notes, and offline sync queue.",
      icon: HardHat,
      badge: "Field Operations",
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0"
    },
    {
      id: "citizen",
      role: "Citizen",
      name: "Rahul Sharma",
      title: "Public Road Safety & Emergency Alerts",
      desc: "Real-time hazard warnings, emergency helpline directory, road damage reporting, and my reports tracking.",
      icon: UserCheck,
      badge: "Public Portal",
      color: "#059669",
      bg: "#f0fdf4",
      border: "#bbf7d0"
    },
    {
      id: "admin",
      role: "Admin",
      name: "Admin",
      title: "Platform Administration & Audit Security",
      desc: "Role & permission matrix, user provisioning, infrastructure telemetry, and comprehensive audit logs.",
      icon: ShieldCheck,
      badge: "System Governance",
      color: "#7c3aed",
      bg: "#faf5ff",
      border: "#e9d5ff"
    }
  ];

  return (
    <section id="roles" style={{ padding: "80px 0", background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 50px auto" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#16a34a", textTransform: "uppercase", letterSpacing: "1px" }}>
            Tailored Role Experiences
          </span>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: "8px 0 12px 0", letterSpacing: "-0.5px" }}>
            Unified Workspaces for Every Stakeholder
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6" }}>
            Experience purpose-built dashboards designed specifically for disaster authorities, logistics fleets, ground field agents, citizens, and system administrators.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {roles.map((r) => {
            const IconComp = r.icon;
            return (
              <div
                key={r.id}
                style={{
                  background: "#ffffff",
                  border: `1.5px solid ${r.border}`,
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: r.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={24} color={r.color} />
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: r.bg, color: r.color }}>
                      {r.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px 0" }}>
                    {r.role}
                  </h3>
                  <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                    {r.title}
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>
                    {r.desc}
                  </p>
                </div>

                <button
                  onClick={() => onSelectRole && onSelectRole(r.role, r.name)}
                  style={{
                    marginTop: "20px",
                    padding: "11px 16px",
                    borderRadius: "10px",
                    background: r.bg,
                    border: `1px solid ${r.border}`,
                    color: r.color,
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span>Launch {r.role.split("/")[0].trim()} Workspace</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
  { icon: "road", value: "6,420+", label: "Roads Monitored" },
  { icon: "vehicle", value: "50,000+", label: "Vehicles Tracked" },
  { icon: "incident", value: "1,248+", label: "Incidents Detected" },
  { icon: "location", value: "8", label: "States & Districts Covered" },
];

const steps = [
  { icon: <Monitor />, title: "Monitor", description: "Collect real-time data" },
  { icon: <Search />, title: "Detect", description: "Identify risks early" },
  { icon: <BarChart3 />, title: "Analyze", description: "Assess impact & trends" },
  { icon: <Megaphone />, title: "Respond", description: "Enable quick action" },
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
              className={`kf-stat ${index !== stats.length - 1 ? "kf-stat-border" : ""}`}
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
          Access NERA Enterprise Platform
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

        <FooterColumn title="Quick Links" links={["About", "Workspaces", "Features", "Mobile App"]} />
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
    <div className="footer-links">
      <h4>{title}</h4>
      {links.map((link) => (
        <a href="#" key={link}>
          {link}
        </a>
      ))}
    </div>
  );
}

export default function LandingPage({ onGetStarted, onSelectRole }: LandingPageProps) {
  return (
    <div className="landing-page">
      <Header onGetStarted={onGetStarted} onSelectRole={onSelectRole} />
      <Hero onGetStarted={onGetStarted} />
      <RoleWorkspaces onSelectRole={onSelectRole} />
      <KeyFeatures />
      <LiveData />
      <MobileApp />
      <Integrations />
      <Testimonials />
      <FAQ />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
