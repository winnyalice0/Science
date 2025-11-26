import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminData } from "@/hooks/use-admin-auth";
import { Plus, Trash2, AlertTriangle, Loader2, Clock, BookOpen } from "lucide-react";

interface Simulation {
  id: string;
  title: string;
  subject: string;
  type: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  isPublished: boolean;
  createdAt: string;
  completionCount: number;
}

interface AdminSimulationsTabProps {
  admin: AdminData;
}

const defaultFormData = {
  title: "",
  description: "",
  subject: "Biology" as const,
  type: "observation",
  difficulty: "Intermediate" as const,
  duration: 30,
  thumbnailUrl: "",
  objectives: "",
  learningOutcomes: "",
  tags: "",
  content: "",
};

const subjects = [
  "Biology",
  "Chemistry",
  "Biochemistry",
  "Physics",
  "Microbiology",
  "Genetics",
];
const simulationTypes = [
  "acid-base",
  "precipitation",
  "redox",
  "enzyme-kinetics",
  "pcr",
  "observation",
  "experiment",
  "interactive",
];

export default function AdminSimulationsTab({ admin }: AdminSimulationsTabProps) {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/simulations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch simulations");
        }

        const data = await response.json();
        setSimulations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load simulations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        setSubmitError("Title and description are required");
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        ...formData,
        objectives: formData.objectives.split("\n").filter((o: string) => o.trim()),
        learningOutcomes: formData.learningOutcomes
          .split("\n")
          .filter((o: string) => o.trim()),
        tags: formData.tags.split(",").map((t: string) => t.trim()),
      };

      const response = await fetch("/api/admin/simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to add simulation");
      }

      const newSimulation = await response.json();
      setSimulations([...simulations, newSimulation]);
      setFormData(defaultFormData);
      setIsDialogOpen(false);
      setSuccessMessage("Simulation added successfully!");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to add simulation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSimulation = async (simulationId: string) => {
    if (!window.confirm("Are you sure you want to delete this simulation?")) return;

    try {
      const response = await fetch(`/api/admin/simulations/${simulationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete simulation");
      }

      setSimulations(simulations.filter((s) => s.id !== simulationId));
      setSuccessMessage("Simulation deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to delete simulation");
    }
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
          <AlertDescription className="text-green-700 dark:text-green-400">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Simulation Contents Management</CardTitle>
            <CardDescription>Create and manage educational simulation content</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Simulation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Simulation</DialogTitle>
                <DialogDescription>Create a new simulation content for users</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="title" className="font-semibold">
                      Simulation Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Acid-Base Titration"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-semibold">
                      Subject *
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, subject: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="font-semibold">
                      Simulation Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {simulationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="font-semibold">
                      Difficulty
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, difficulty: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="font-semibold">
                      Duration (minutes)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: parseInt(e.target.value) })
                      }
                      placeholder="30"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the simulation"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives" className="font-semibold">
                    Learning Objectives (one per line)
                  </Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="Understand the concept of pH&#10;Learn titration techniques&#10;Analyze experimental results"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcomes" className="font-semibold">
                    Learning Outcomes (one per line)
                  </Label>
                  <Textarea
                    id="outcomes"
                    value={formData.learningOutcomes}
                    onChange={(e) =>
                      setFormData({ ...formData, learningOutcomes: e.target.value })
                    }
                    placeholder="Students will be able to determine acid-base concentrations&#10;Students will master laboratory techniques"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-semibold">
                    Tags (comma-separated)
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="titration, acid-base, chemistry, lab"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="font-semibold">
                    Simulation Content (HTML/JSON)
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="HTML or JSON structure for the simulation interface"
                    disabled={isSubmitting}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Simulation"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : simulations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No simulations created yet</p>
              <p className="text-sm text-slate-500 mt-1">Click "Add Simulation" to get started</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Subject</TableHead>
                    <TableHead className="hidden lg:table-cell">Type</TableHead>
                    <TableHead className="hidden lg:table-cell">Difficulty</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulations.map((sim) => (
                    <TableRow key={sim.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <TableCell className="font-medium">{sim.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-block px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-xs font-semibold text-purple-700 dark:text-purple-400">
                          {sim.subject}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{sim.type}</TableCell>
                      <TableCell className="hidden lg:table-cell">{sim.difficulty}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="text-xs text-slate-500 hidden sm:block">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {sim.duration}m
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSimulation(sim.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && !error && simulations.length > 0 && (
            <div className="pt-4 border-t text-sm text-slate-600 dark:text-slate-400">
              Total: {simulations.length} simulations
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
