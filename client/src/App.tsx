import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RegistrationPage from "@/pages/registration";
import VotingPage from "@/pages/voting";
import ConfirmationPage from "@/pages/confirmation";
import NotFound from "@/pages/not-found";
import { Web3Provider } from "@/hooks/use-web3";

function Router() {
  return (
    <Switch>
      <Route path="/" component={RegistrationPage} />
      <Route path="/voting" component={VotingPage} />
      <Route path="/confirmation" component={ConfirmationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
