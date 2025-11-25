import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Award, Clock, Target } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";

export default function ProfilePage() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [bio, setBio] = useState(profile?.bio || "");

  const updateProfile = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/profile", {
        fullName,
        bio,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    },
  });

  const reassessSkillLevel = useMutation({
    mutationFn: async (level: string) => {
      return apiRequest("PATCH", "/api/profile", {
        skillLevel: level,
        lastAssessmentDate: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Skill Level Updated",
        description: "Your skill level has been reassessed.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const skillLevelColor = {
    beginner: "bg-green-500",
    intermediate: "bg-blue-500",
    advanced: "bg-purple-500",
  }[profile?.skillLevel || "beginner"];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl lg:text-4xl font-semibold mb-8">Profile Settings</h1>

      <div className="grid gap-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    data-testid="input-full-name"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    data-testid="textarea-bio"
                  />
                </div>
                <Button
                  onClick={() => updateProfile.mutate()}
                  disabled={updateProfile.isPending}
                  data-testid="button-save-profile"
                >
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold" data-testid="stat-xp">{profile?.xp || 0}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold" data-testid="stat-completed">
                  {profile?.completedSimulations || 0}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold" data-testid="stat-hours">
                  {profile?.totalHoursLogged || 0}
                </div>
                <div className="text-sm text-muted-foreground">Hours Logged</div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Skill Level</Label>
              <div className="flex items-center gap-4">
                <Badge className={`${skillLevelColor} text-white`} data-testid="badge-skill-level">
                  {profile?.skillLevel?.toUpperCase() || 'BEGINNER'}
                </Badge>
                <Select
                  value={profile?.skillLevel || "beginner"}
                  onValueChange={(value) => reassessSkillLevel.mutate(value)}
                >
                  <SelectTrigger className="w-48" data-testid="select-skill-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Last assessed: {profile?.lastAssessmentDate 
                  ? new Date(profile.lastAssessmentDate).toLocaleDateString() 
                  : 'Never'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Account Created</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-created-at">
                {profile?.createdAt 
                  ? new Date(profile.createdAt).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
            <div>
              <Label>Last Updated</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-updated-at">
                {profile?.updatedAt 
                  ? new Date(profile.updatedAt).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
