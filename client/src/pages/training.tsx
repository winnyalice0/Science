import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Lock, CheckCircle2, Circle } from "lucide-react";

interface TrainingPath {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  estimatedDuration: number;
  moduleCount: number;
  isPublished: boolean;
}

export default function Training() {
  const { data: paths, isLoading } = useQuery<TrainingPath[]>({
    queryKey: ["/api/training-hub"],
    queryFn: async () => {
      const response = await fetch("/api/training-hub");
      if (!response.ok) throw new Error("Failed to fetch training paths");
      return response.json();
    },
  });
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-2">Training Hub</h1>
        <p className="text-muted-foreground">
          Structured learning paths to guide your scientific education
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Paths</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-paths-total">
              {isLoading ? <Skeleton className="h-8 w-12" /> : paths?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-modules-total">
              {isLoading ? <Skeleton className="h-8 w-12" /> : paths?.reduce((sum, p) => sum + p.moduleCount, 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available Subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-subjects">
              {isLoading ? <Skeleton className="h-8 w-12" /> : new Set(paths?.map(p => p.subject)).size || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-2 w-full mb-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paths && paths.length > 0 ? (
          paths.map((path) => (
            <Card key={path.id} data-testid={`learning-path-${path.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {path.description}
                      </CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {path.subject}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {path.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" data-testid={`badge-progress-${path.id}`}>
                    {path.moduleCount} Modules
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Estimated Duration: {path.estimatedDuration} min
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="details" className="border-0">
                    <AccordionTrigger data-testid={`accordion-trigger-${path.id}`}>
                      View Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <div>
                          <p className="font-semibold text-sm mb-2">About This Path</p>
                          <p className="text-sm text-muted-foreground">
                            {path.description}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-2">Getting Started</p>
                          <Button size="sm" className="w-full">
                            Start Learning
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No training paths available yet</p>
                <p className="text-sm mt-1">Check back soon or contact your administrator</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
