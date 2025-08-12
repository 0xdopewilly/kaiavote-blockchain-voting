import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LandingPage from "@/pages/landing";
import RegistrationPage from "@/pages/registration";
import VotingPage from "@/pages/voting";
import ConfirmationPage from "@/pages/confirmation";
import ZKPDemoPage from "@/pages/zkp-demo";
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboardPage from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import { Web3Provider } from "@/hooks/use-web3";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/registration" component={RegistrationPage} />
      <Route path="/voting" component={VotingPage} />
      <Route path="/confirmation" component={ConfirmationPage} />
      <Route path="/zkp-demo" component={ZKPDemoPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      <Route path="/admin-dashboard" component={AdminDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Web3Provider>
          <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/30 transition-all duration-500">
              {/* Futuristic grid overlay */}
              <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" 
                     style={{
                       backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px), 
                                       linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
                       backgroundSize: '50px 50px'
                     }}>
                </div>
              </div>
              
              {/* Main content */}
              <Router />
            </div>
            <Toaster />
          </TooltipProvider>
        </Web3Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
