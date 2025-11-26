import { Link, useLocation } from "wouter";
import {
  Home,
  Beaker,
  GraduationCap,
  FolderOpen,
  User,
  BarChart3,
  LogOut,
  Microscope,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Browse Simulations", url: "/simulations", icon: Beaker },
  { title: "3D Organs & Materials", url: "/organs-3d", icon: Microscope },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Workspaces", url: "/workspaces", icon: FolderOpen },
  { title: "Training Hub", url: "/training", icon: GraduationCap },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    }
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Beaker className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Science ASimulation</span>
            <span className="text-xs text-muted-foreground">Virtual Laboratory</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section - Only show if user is admin */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-red-600 dark:text-red-400">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location === "/admin-dashboard"} data-testid="link-admin-panel">
                    <Link href="/admin-dashboard">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {isAdmin ? "Admin User" : "Active"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
