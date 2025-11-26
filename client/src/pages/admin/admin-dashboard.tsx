import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase, signOut } from "@/lib/supabase";
import {
  LogOut,
  Users,
  Microscope,
  Play,
  BarChart3,
  AlertTriangle,
  Loader2,
  BookOpen,
  Layout,
} from "lucide-react";
import AdminUsersTab from "@/components/admin/admin-users-tab";
import AdminModelsTab from "@/components/admin/admin-models-tab";
import AdminSimulationsTab from "@/components/admin/admin-simulations-tab";
import AdminOverviewTab from "@/components/admin/admin-overview-tab";
import AdminTrainingHubTab from "@/components/admin/admin-training-hub-tab";
import AdminWorkspaceTemplatesTab from "@/components/admin/admin-workspace-templates-tab";

export default function AdminDashboard() {
  const { admin, isAdmin, isLoading, error } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin || !admin) {
    return (
      <div className="w-full h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {error || "You do not have admin access."}
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      sessionStorage.removeItem("admin_access_verified");
      setLocation("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Welcome, {admin.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-semibold">{admin.role.toUpperCase()}</p>
              <p className="text-xs text-slate-500">{admin.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-6 bg-white dark:bg-slate-900 border">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Microscope className="w-4 h-4" />
                <span className="hidden sm:inline">3D Models</span>
              </TabsTrigger>
              <TabsTrigger value="simulations" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Sims</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview">
                <AdminOverviewTab admin={admin} />
              </TabsContent>

              <TabsContent value="users">
                <AdminUsersTab admin={admin} />
              </TabsContent>

              <TabsContent value="models">
                <AdminModelsTab admin={admin} />
              </TabsContent>

              <TabsContent value="simulations">
                <AdminSimulationsTab admin={admin} />
              </TabsContent>

              <TabsContent value="training">
                <AdminTrainingHubTab />
              </TabsContent>

              <TabsContent value="templates">
                <AdminWorkspaceTemplatesTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
