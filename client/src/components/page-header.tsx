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
                <span className="text-2xl font-bold text-white">CryptoVote</span>
              </div>
            </Link>
          </div>

          {/* Navigation Buttons - Far Top Right */}
          <div className="flex items-center gap-3 ml-auto">
            {showHomeButton && (
              <Link href="/">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm" data-testid="button-nav-home">
                  Home
                </Button>
              </Link>
            )}
            <Link href="/registration">
              <Button className="cyber-button bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white px-4 py-2 text-sm font-bold border-0 shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 animate-pulse" data-testid="button-nav-register">
                Register to Vote
              </Button>
            </Link>
            <Link href="/zkp-demo">
              <Button className="cyber-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-3 py-2 text-sm font-bold border-0 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105" data-testid="button-nav-demo">
                <Shield className="mr-2 h-4 w-4" />
                Learn ZKP
              </Button>
            </Link>
            <Link href="/admin-login">
              <Button className="cyber-button bg-red-600 hover:bg-red-700 border border-red-500 text-white px-3 py-2 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-red-500/50 hover:scale-105" data-testid="button-nav-admin">
                <Shield className="mr-2 h-4 w-4 text-white" />
                Admin Access
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}