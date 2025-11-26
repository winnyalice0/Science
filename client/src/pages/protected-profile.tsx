import ProfilePage from "@/pages/profile";
import { ProtectedRoute } from "@/components/protected-route";

export default function ProtectedProfile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
