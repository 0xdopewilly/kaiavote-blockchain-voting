import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="reference-layout">
      {/* Navigation - Exact match to reference */}
      <nav className="reference-nav">
        <div className="reference-logo">
          CryptoVote
        </div>
        <div className="reference-nav-links">
          <a href="#" className="reference-nav-link">Why?</a>
          <a href="#" className="reference-nav-link">Features</a>
          <a href="#" className="reference-nav-link">Security</a>
          <Link to="/register" className="reference-cta-button">
            Vote
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ marginRight: window.innerWidth > 1024 ? '350px' : '0' }}>
        {/* Hero Section - Exact match to reference */}
        <section className={`reference-hero transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="reference-title">
            THE 
            <span className="reference-title-highlight">VOTES</span>
            THEY<br />
            HOPE YOU'LL 
            <span className="reference-title-highlight">IGNORE</span>
          </h1>
          
          <p className="reference-subtitle">
            CryptoVote shines light on the dark in hopes of sparking understanding.
          </p>
          
          <Link to="/register" className="reference-main-button">
            Start Voting
          </Link>
        </section>

        {/* Quote Section - Exact match to reference */}
        <section className={`reference-quote-section transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <blockquote className="reference-quote">
            "VOTES ARE THE DOORS THEY WANT<br />
            SHUT. OPEN THEM, AND YOU'LL<br />
            SEE THE TRUTHS 
            <span className="reference-quote-highlight">THEY FEAR</span>"
          </blockquote>
          <cite className="reference-quote-author">
            - CryptoVote
          </cite>
        </section>
      </div>

      {/* Sidebar - Updated for CryptoVote project */}
      <aside className="reference-sidebar hidden lg:block">
        <div className="reference-card">
          <div className="reference-tag">VOTE SECURELY</div>
          <h3 className="reference-card-title">KAIA BLOCKCHAIN</h3>
          <p className="reference-card-subtitle">
            Powered by KAIA Chain technology for ultra-low gas fees and 
            lightning-fast transactions. Your vote counts and costs almost nothing.
          </p>
          <div className="flex gap-2 text-xs">
            <span className="text-muted-foreground">Register Now</span>
            <span className="text-muted-foreground">Cast Vote</span>
          </div>
        </div>

        <div className="reference-card">
          <div className="reference-tag">PRIVACY FIRST</div>
          <h3 className="reference-card-title">ZERO-KNOWLEDGE PROOFS</h3>
          <p className="reference-card-description">
            Vote privately with cryptographic proofs. Your identity stays protected 
            while ensuring complete vote integrity and transparency.
          </p>
        </div>

        <div className="reference-card">
          <div className="reference-tag">ACADEMIC ELECTIONS</div>
          <h3 className="reference-card-title">12 POSITIONS AVAILABLE</h3>
          <p className="reference-card-description">
            Class Presidents, Departmental Presidents, Faculty Presidents, and 
            Financial Secretaries - all positions ready for democratic participation.
          </p>
        </div>
      </aside>
    </div>
  );
}