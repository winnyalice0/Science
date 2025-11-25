import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Clock, Target, TrendingUp, ArrowRight } from "lucide-react";
import type { Profile, SimulationHistory } from "@shared/schema";

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const { data: recentHistory, isLoading: historyLoading } = useQuery<SimulationHistory[]>({
    queryKey: ["/api/simulation-history/recent"],
  });

  const skillLevelColor = {
    beginner: "bg-green-500",
    intermediate: "bg-blue-500",
    advanced: "bg-purple-500",
  }[profile?.skillLevel || "beginner"];

  const xpToNextLevel = 1000;
  const xpProgress = ((profile?.xp || 0) / xpToNextLevel) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Banner */}
      <Card className="mb-8 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-2">
                Welcome back{profile?.fullName ? `, ${profile.fullName}` : ''}!
              </h1>
              <p className="text-muted-foreground">
                Continue your scientific journey and explore new simulations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Badge className={`${skillLevelColor} text-white mb-2`} data-testid="badge-skill-level">
                  {profile?.skillLevel?.toUpperCase() || 'BEGINNER'}
                </Badge>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level Progress</span>
                    <span className="font-medium" data-testid="text-xp">
                      {profile?.xp || 0} / {xpToNextLevel} XP
                    </span>
                  </div>
                  <Progress value={xpProgress} className="w-48" data-testid="progress-xp" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {profileLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Completed</CardDescription>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-completed">
                  {profile?.completedSimulations || 0}
                </div>
                <p className="text-xs text-muted-foreground">Simulations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Hours Logged</CardDescription>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-hours">
                  {profile?.totalHoursLogged || 0}
                </div>
                <p className="text-xs text-muted-foreground">Learning time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Experience</CardDescription>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-xp-total">
                  {profile?.xp || 0}
                </div>
                <p className="text-xs text-muted-foreground">XP earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>This Week</CardDescription>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600" data-testid="stat-weekly">
                  +{Math.floor(Math.random() * 100)}
                </div>
                <p className="text-xs text-muted-foreground">XP gained</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest simulation runs</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentHistory && recentHistory.length > 0 ? (
              <div className="space-y-4">
                {recentHistory.slice(0, 5).map((history) => (
                  <div key={history.id} className="flex items-center gap-4 p-3 rounded-lg hover-elevate" data-testid={`activity-${history.id}`}>
                    <div className="flex-1">
                      <p className="font-medium">Simulation Run</p>
                      <p className="text-sm text-muted-foreground">
                        {history.completed ? 'Completed' : 'In Progress'} • 
                        {history.score && ` Score: ${history.score}`}
                      </p>
                    </div>
                    <Badge variant={history.completed ? "default" : "secondary"}>
                      {history.completed ? "✓ Done" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No activity yet</p>
                <Button variant="outline" className="mt-4" asChild data-testid="button-start-first">
                  <Link href="/simulations">Start Your First Simulation</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump right in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-between" asChild data-testid="button-browse-sims">
              <Link href="/simulations">
                Browse Simulations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild data-testid="button-my-workspaces">
              <Link href="/workspaces">
                My Workspaces
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild data-testid="button-training-hub">
              <Link href="/training">
                Training Hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild data-testid="button-edit-profile">
              <Link href="/profile">
                Edit Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
