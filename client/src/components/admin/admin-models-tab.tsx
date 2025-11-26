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
import { Plus, Trash2, Eye, AlertTriangle, Loader2 } from "lucide-react";

interface Model3D {
  id: string;
  name: string;
  category: "Biology" | "Chemistry" | "Laboratory Materials";
  description: string;
  model: string;
  thumbnail: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isPublished: boolean;
  createdAt: string;
}

interface AdminModelsTabProps {
  admin: AdminData;
}

const defaultFormData = {
  name: "",
  category: "Biology" as const,
  description: "",
  fullDescription: "",
  model: "",
  thumbnail: "",
  difficulty: "Intermediate" as const,
  learningPoints: "",
  credit: "",
};

export default function AdminModelsTab({ admin }: AdminModelsTabProps) {
  const [models, setModels] = useState<Model3D[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/models", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();
        setModels(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load models");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.model) {
        setSubmitError("Model name and Sketchfab URL are required");
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        ...formData,
        learningPoints: formData.learningPoints
          .split("\n")
          .filter((p: string) => p.trim()),
      };

      const response = await fetch("/api/admin/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to add model");
      }

      const newModel = await response.json();
      setModels([...models, newModel]);
      setFormData(defaultFormData);
      setIsDialogOpen(false);
      setSuccessMessage("Model added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to add model");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;

    try {
      const response = await fetch(`/api/admin/models/${modelId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete model");
      }

      setModels(models.filter((m) => m.id !== modelId));
      setSuccessMessage("Model deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to delete model");
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
            <CardTitle>3D Models Management</CardTitle>
            <CardDescription>Add and manage 3D organ and material models</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New 3D Model</DialogTitle>
                <DialogDescription>
                  Add a new 3D model from Sketchfab or other sources
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold">
                      Model Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Human Heart"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-semibold">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, category: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Laboratory Materials">Laboratory Materials</SelectItem>
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
                    <Label htmlFor="thumbnail" className="font-semibold">
                      Thumbnail URL
                    </Label>
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="/public/3d-models/thumb.png"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="font-semibold">
                    Sketchfab Embed URL *
                  </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="https://sketchfab.com/models/{ID}/embed"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-slate-500">
                    Get the embed URL from Sketchfab model page
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit" className="font-semibold">
                    Credit/Attribution
                  </Label>
                  <Input
                    id="credit"
                    value={formData.credit}
                    onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                    placeholder="Model name by Artist on Sketchfab"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold">
                    Short Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description for the card"
                    disabled={isSubmitting}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescription" className="font-semibold">
                    Full Description
                  </Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed description shown in modal"
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learningPoints" className="font-semibold">
                    Learning Points (one per line)
                  </Label>
                  <Textarea
                    id="learningPoints"
                    value={formData.learningPoints}
                    onChange={(e) => setFormData({ ...formData, learningPoints: e.target.value })}
                    placeholder="Key learning point 1&#10;Key learning point 2&#10;Key learning point 3"
                    disabled={isSubmitting}
                    rows={3}
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
                      "Add Model"
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
          ) : models.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">No models added yet</p>
              <p className="text-sm text-slate-500 mt-1">Click "Add Model" to get started</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Difficulty</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-700 dark:text-blue-400">
                          {model.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs">{model.difficulty}</span>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View model"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModel(model.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && !error && models.length > 0 && (
            <div className="pt-4 border-t text-sm text-slate-600 dark:text-slate-400">
              Total: {models.length} models
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
