import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import Home from "@/pages/home";
import Simulations from "@/pages/simulations";
import VirtualLab from "@/pages/virtual-lab";
import Dashboard from "@/pages/dashboard";
import Workspaces from "@/pages/workspaces";
import ProfilePage from "@/pages/profile";
import Training from "@/pages/training";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isAuthPage = location.startsWith("/auth");
  const isHomePage = location === "/";

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      
      {/* Protected Routes (would normally check auth) */}
      <Route path="/simulations" component={Simulations} />
      <Route path="/lab/:id" component={VirtualLab} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/workspaces" component={Workspaces} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/training" component={Training} />
      
      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAuthPage = location.startsWith("/auth");
  const isHomePage = location === "/";
  const isLabPage = location.startsWith("/lab/");

  // Don't show sidebar on auth pages, home page, or lab page
  const showSidebar = !isAuthPage && !isHomePage && !isLabPage;

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {showSidebar ? (
            <SidebarProvider style={sidebarStyle as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <SidebarInset className="flex flex-col flex-1">
                  <header className="flex h-14 items-center gap-4 border-b px-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <div className="flex-1" />
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 overflow-auto">
                    <Router />
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          ) : (
            <div className="min-h-screen">
              {!isAuthPage && !isLabPage && (
                <div className="fixed top-4 right-4 z-50">
                  <ThemeToggle />
                </div>
              )}
              <Router />
            </div>
          )}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
