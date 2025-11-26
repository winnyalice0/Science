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
  const { isAdmin, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/admin/access");
    }
  }, [isLoading, isAdmin, setLocation]);

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

  if (!isAdmin) {
    return null;
  }

  return <Component />;
}
