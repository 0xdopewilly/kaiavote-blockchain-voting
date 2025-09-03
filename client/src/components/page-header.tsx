import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Vote, Shield } from "lucide-react";

interface PageHeaderProps {
  showHomeButton?: boolean;
}

export default function PageHeader({ showHomeButton = false }: PageHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
      <div className="w-full px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo - Far Top Left */}
          <div className="flex items-center space-x-3">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                  <Vote className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold" style={{
                  background: 'linear-gradient(135deg, #ffeb3b 0%, #fdd835 50%, #f9a825 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>CryptoVote</span>
              </div>
            </Link>
          </div>

          {/* Navigation Buttons - Far Top Right */}
          <div className="flex items-center gap-3 ml-auto">
            {showHomeButton && (
              <Link href="/" className="reference-cta-button" data-testid="button-nav-home">
                Home
              </Link>
            )}
            <Link href="/registration" className="reference-cta-button" data-testid="button-nav-register">
              Register to Vote
            </Link>
            <Link href="/zkp-demo" className="reference-cta-button" data-testid="button-nav-demo">
              <Shield className="mr-2 h-4 w-4" />
              Learn ZKP
            </Link>
            <Link href="/admin-login" className="reference-cta-button" data-testid="button-nav-admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}