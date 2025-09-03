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
          <Link to="/register">
            <button className="reference-cta-button">
              Vote
            </button>
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
          
          <Link to="/register">
            <button className="reference-main-button">
              Start Voting
            </button>
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

      {/* Sidebar - Exact match to reference */}
      <aside className="reference-sidebar hidden lg:block">
        <div className="reference-card">
          <div className="reference-tag">ONE VOTE AT A TIME</div>
          <h3 className="reference-card-title">EYES EVERYWHERE</h3>
          <p className="reference-card-subtitle">
            Revealing the hidden world of surveillance and privacy erosion, 
            empowering readers with the knowledge to reclaim control in a 
            connected reality.
          </p>
          <div className="flex gap-2 text-xs">
            <span className="text-muted-foreground">Paper Copy</span>
            <span className="text-muted-foreground">Free e-Book</span>
          </div>
        </div>

        <div className="reference-card">
          <div className="reference-tag">COMING SOON</div>
          <h3 className="reference-card-title">BLOCKCHAIN DEMOCRACY</h3>
          <p className="reference-card-description">
            Uncover the patterns. AI power. Insights.
          </p>
        </div>

        <div className="reference-card">
          <div className="reference-tag">JOIN</div>
          <h3 className="reference-card-title">SECURE VOTING</h3>
          <p className="reference-card-description">
            Experience the future of democratic participation with zero-knowledge 
            proofs and blockchain technology.
          </p>
        </div>
      </aside>
    </div>
  );
}