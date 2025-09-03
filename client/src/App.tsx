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
      <Web3Provider>
        <TooltipProvider>
          <div className="min-h-screen reference-layout">
            
            {/* Main content with beautiful theme */}
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
