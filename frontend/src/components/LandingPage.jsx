import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const FEATURES = [
  {
    key: "wallet",
    title: "Load Funds",
    text: "Add money to your bus card anytime.",
  },
  {
    key: "history",
    title: "Check History",
    text: "View your transactions and balances.",
  },
  {
    key: "bus",
    title: "Travel Smart",
    text: "Plan your trips and find stations near you.",
  },
];

function FeatureIcon({ name }) {
  if (name === "wallet") {
    return (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <rect x="6" y="12" width="36" height="26" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M6 20h36" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="33" cy="28" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  if (name === "history") {
    return (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 15v9l7 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M9 13l3 5 5-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
      <rect x="8" y="10" width="32" height="24" rx="5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M8 22h32" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="15" cy="34" r="3" fill="currentColor" />
      <circle cx="33" cy="34" r="3" fill="currentColor" />
    </svg>
  );
}

function Logo() {
  return (
    <div className="tbs-logo">
      <img src="/Logo.jpeg" alt="City of Tshwane" />
    </div>
  );
}

function BusIllustration() {
  return (
    <div className="tbs-bus-art" role="img" aria-label="Tshwane bus">
      <div className="tbs-bus-skyline" />
      <img src="/Bus.png" alt="" className="tbs-bus-img" />
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="tbs-phone">
      <div className="tbs-phone-notch" />
      <div className="tbs-phone-screen">
        <p className="tbs-phone-greeting">Good morning!</p>
        <div className="tbs-phone-balance">
          <div className="tbs-phone-balance-row">
            <span>Your Balance</span>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect x="0" y="0" width="20" height="14" rx="2" fill="#fff" opacity="0.85" />
              <rect x="0" y="4" width="20" height="2.5" fill="#1C7A3E" />
            </svg>
          </div>
          <strong>R 250.00</strong>
          <button className="tbs-phone-load">Load Funds +</button>
        </div>
        <div className="tbs-phone-actions">
          <span>Load Funds</span>
          <span>History</span>
          <span>Nearby</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="tbs-page">
      <header className="tbs-nav">
        <Logo />
        <nav className="tbs-nav-links">
          <a href="#home" className="is-active">Home</a>
          <a href="#about">About</a>
          <a href="#help">Help</a>
        </nav>
        <button className="tbs-btn tbs-btn--solid" onClick={() => navigate("/login")}>Login</button>
      </header>

      <main>
        <section className="tbs-hero">
          <div className="tbs-hero-copy">
            <h1>
              Your journey.
              <br />
              <span>Our priority.</span>
            </h1>
            <p>
              Load funds, manage your card and travel across Tshwane with
              ease.
            </p>
            <div className="tbs-hero-actions">
              <button className="tbs-btn tbs-btn--solid" onClick={() => navigate("/login")}>Get Started</button>
              <button className="tbs-btn tbs-btn--outline" onClick={() => navigate("/register")}>Register</button>
            </div>
          </div>
          <div className="tbs-hero-art">
            <BusIllustration />
          </div>
        </section>

        <section className="tbs-features-wrap">
          <div className="tbs-features">
            {FEATURES.map((f, i) => (
              <div className="tbs-feature" key={f.key}>
                {i > 0 && <span className="tbs-feature-divider" aria-hidden="true" />}
                <div className="tbs-feature-icon">
                  <FeatureIcon name={f.key} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="tbs-app-preview">
          <PhoneMock />
          <div className="tbs-app-copy">
            <h2>
              All your travel needs,
              <br />
              <span>in one place.</span>
            </h2>
            <p>
              A simple and secure way to manage your Tshwane Bus Services
              card.
            </p>
          </div>
          <img className="tbs-app-watermark" src="/Logo.jpeg" alt="" aria-hidden="true" />
        </section>
      </main>

      <footer className="tbs-footer-bar" />
    </div>
  );
}
