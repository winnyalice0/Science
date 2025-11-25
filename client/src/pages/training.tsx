import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Lock, CheckCircle2, Circle } from "lucide-react";

const learningPaths = [
  {
    id: "chemistry-basics",
    title: "Chemistry Fundamentals",
    description: "Master the basics of chemical reactions and laboratory techniques",
    progress: 65,
    modules: [
      { title: "Introduction to Chemical Reactions", duration: "15 min", completed: true },
      { title: "Acid-Base Chemistry", duration: "20 min", completed: true },
      { title: "Redox Reactions", duration: "25 min", completed: false },
      { title: "Precipitation Reactions", duration: "20 min", completed: false, locked: true },
    ],
  },
  {
    id: "biology-basics",
    title: "Biology Essentials",
    description: "Explore cellular biology and biochemical processes",
    progress: 30,
    modules: [
      { title: "Cell Structure & Function", duration: "20 min", completed: true },
      { title: "DNA & RNA Basics", duration: "25 min", completed: false },
      { title: "Protein Synthesis", duration: "30 min", completed: false, locked: true },
      { title: "Cellular Respiration", duration: "30 min", completed: false, locked: true },
    ],
  },
  {
    id: "advanced-biochem",
    title: "Advanced Biochemistry",
    description: "Dive deep into enzyme kinetics and metabolic pathways",
    progress: 0,
    modules: [
      { title: "Enzyme Kinetics", duration: "35 min", completed: false },
      { title: "Metabolic Pathways", duration: "40 min", completed: false, locked: true },
      { title: "PCR & Gene Amplification", duration: "35 min", completed: false, locked: true },
      { title: "Protein Analysis", duration: "40 min", completed: false, locked: true },
    ],
  },
];

export default function Training() {
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
            <CardDescription>Paths Started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-paths-started">2/3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Modules Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-modules-completed">3/12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-avg-progress">32%</div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths */}
      <div className="space-y-6">
        {learningPaths.map((path) => (
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
                  </div>
                </div>
                <Badge variant={path.progress > 0 ? "default" : "secondary"} data-testid={`badge-progress-${path.id}`}>
                  {path.progress}% Complete
                </Badge>
              </div>
              <div className="mt-4">
                <Progress value={path.progress} className="h-2" data-testid={`progress-${path.id}`} />
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="modules" className="border-0">
                  <AccordionTrigger data-testid={`accordion-trigger-${path.id}`}>
                    View Modules ({path.modules.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {path.modules.map((module, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            module.locked
                              ? "bg-muted/50 opacity-60"
                              : "hover-elevate bg-card"
                          }`}
                          data-testid={`module-${path.id}-${idx}`}
                        >
                          <div className="flex items-center gap-3">
                            {module.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : module.locked ? (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">{module.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {module.duration}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={module.completed ? "outline" : "default"}
                            disabled={module.locked}
                            data-testid={`button-module-${path.id}-${idx}`}
                          >
                            {module.completed ? "Review" : module.locked ? "Locked" : "Start"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
