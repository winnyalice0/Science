import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminData } from "@/hooks/use-admin-auth";
import { Users, Microscope, Play, Clock } from "lucide-react";

interface OverviewStats {
  totalUsers: number;
  total3DModels: number;
  totalSimulations: number;
  lastActivityTime: string | null;
}

interface AdminOverviewTabProps {
  admin: AdminData;
}

export default function AdminOverviewTab({ admin }: AdminOverviewTabProps) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics");
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    description: string;
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className="text-slate-300 dark:text-slate-700">{Icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Admin Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
          <CardDescription>Your admin account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
              <p className="font-semibold">{admin.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="font-semibold">{admin.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
              <p className="font-semibold uppercase text-blue-600">{admin.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : error ? (
          <div className="col-span-full">
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="pt-6">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          stats && (
            <>
              <StatCard
                icon={<Users className="w-8 h-8" />}
                title="Total Users"
                value={stats.totalUsers}
                description="Registered users"
              />
              <StatCard
                icon={<Microscope className="w-8 h-8" />}
                title="3D Models"
                value={stats.total3DModels}
                description="In database"
              />
              <StatCard
                icon={<Play className="w-8 h-8" />}
                title="Simulations"
                value={stats.totalSimulations}
                description="Available"
              />
              <StatCard
                icon={<Clock className="w-8 h-8" />}
                title="Last Activity"
                value={stats.lastActivityTime || "Never"}
                description="System activity"
              />
            </>
          )
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
              <span className="text-sm font-medium">System Status</span>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
              <span className="text-sm font-medium">Database</span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
              <span className="text-sm font-medium">Authentication</span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">ACTIVE</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Capabilities</CardTitle>
          <CardDescription>What you can do from this dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Manage user accounts and permissions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Add and edit 3D models with Sketchfab integration
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Create and manage simulation contents
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              View system statistics and audit logs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Manage admin accounts and roles
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
