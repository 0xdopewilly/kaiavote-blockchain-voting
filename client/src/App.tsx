import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/landing";
import RegistrationPage from "@/pages/registration";
import VotingPage from "@/pages/voting";
import ConfirmationPage from "@/pages/confirmation";
import ZKPDemoPage from "@/pages/zkp-demo";
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <TooltipProvider>
          <div className="min-h-screen animated-bg">
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
    </QueryClientProvider>
  );
}

export default App;
