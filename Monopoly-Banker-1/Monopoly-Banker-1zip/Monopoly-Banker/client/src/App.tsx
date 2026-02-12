import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import SetupPage from "@/pages/SetupPage";
import DashboardPage from "@/pages/DashboardPage";
import PropertiesPage from "@/pages/PropertiesPage";
import LedgerPage from "@/pages/LedgerPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SetupPage} />
      <Route path="/setup" component={SetupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/properties" component={PropertiesPage} />
      <Route path="/ledger" component={LedgerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
