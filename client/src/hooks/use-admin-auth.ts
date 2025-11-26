import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface AdminData {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  isActive: boolean;
  lastLogin: string | null;
}

export function useAdminAuth() {
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data: admin,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-auth"],
    queryFn: async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Not authenticated");
          return null;
        }

        // Fetch admin data from database
        const response = await fetch("/api/admin/auth/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.id}`,
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          if (response.status === 403) {
            setError("User is not an admin");
          } else {
            setError("Failed to verify admin status");
          }
          return null;
        }

        const adminData = await response.json();
        setError(null);
        return adminData;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      } finally {
        setIsChecking(false);
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  const isAdmin = !!admin && admin.isActive;

  return {
    admin,
    isAdmin,
    isLoading: isLoading || isChecking,
    error,
    refetch,
  };
}
