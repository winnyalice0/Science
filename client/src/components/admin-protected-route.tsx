import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminProtectedRouteProps {
  component: React.ComponentType;
}

export default function AdminProtectedRoute({
  component: Component,
}: AdminProtectedRouteProps) {
  const { isAdmin, isLoading, error } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      // Redirect to access page after a short delay
      const timer = setTimeout(() => {
        setLocation("/admin/access");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAdmin, setLocation]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="space-y-4 w-full max-w-3xl px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error || "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
}
