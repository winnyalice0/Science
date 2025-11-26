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

        // Fetch admin data from database with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch("/api/admin/auth/check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.id}`,
            },
            body: JSON.stringify({ userId: user.id }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            if (response.status === 403) {
              setError("User is not an admin");
            } else if (response.status === 401) {
              setError("Unauthorized");
            } else {
              setError("Failed to verify admin status");
            }
            return null;
          }

          const adminData = await response.json();
          
          // Validate the response has required fields
          if (!adminData || typeof adminData !== 'object') {
            setError("Invalid response from server");
            return null;
          }

          setError(null);
          return adminData;
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') {
            setError("Request timeout");
          } else {
            const message = fetchErr instanceof Error ? fetchErr.message : "Network error";
            setError(message);
          }
          return null;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      } finally {
        setIsChecking(false);
      }
    },
    retry: 1,
    staleTime: Infinity,
  });

  const isAdmin = !!admin && admin.isActive === true;

  return {
    admin,
    isAdmin,
    isLoading: isLoading || isChecking,
    error,
    refetch,
  };
}
