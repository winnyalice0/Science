import Dashboard from "@/pages/dashboard";
import { ProtectedRoute } from "@/components/protected-route";

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
