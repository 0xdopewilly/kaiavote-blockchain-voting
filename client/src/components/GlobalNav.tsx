import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Vote, Sun, Moon, Home } from "lucide-react";

export default function GlobalNav({ showHomeButton = false }: { showHomeButton?: boolean }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="relative z-20 w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <Vote className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">CryptoVote</span>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Home Button (if needed) */}
            {showHomeButton && (
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="cyber-button border border-slate-300 dark:border-white/30 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white px-3 py-2 transition-all duration-300 hover:scale-105"
                  data-testid="button-home"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Button>
              </Link>
            )}
            
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="cyber-button border border-slate-300 dark:border-white/30 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white px-3 py-2 transition-all duration-300 hover:scale-105"
              data-testid="button-theme-toggle"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}