import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Layout, Plus, Trash2, AlertTriangle } from "lucide-react";

interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  usageCount: number;
  isPublished: boolean;
}

export default function AdminWorkspaceTemplatesTab() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Chemistry",
    icon: "⚗️",
  });
  const [error, setError] = useState("");

  const { data: templates, isLoading } = useQuery<WorkspaceTemplate[]>({
    queryKey: ["/api/admin/workspace-templates"],
  });

  const createTemplate = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/workspace-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          templateData: JSON.stringify({ type: formData.category }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workspace template");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workspace-templates"] });
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        category: "Chemistry",
        icon: "⚗️",
      });
      setError("");
      toast({
        title: "Workspace Template Created",
        description: "New template added successfully.",
      });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/workspace-templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete workspace template");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workspace-templates"] });
      toast({
        title: "Template Deleted",
        description: "The workspace template has been removed.",
      });
    },
  });

  const categoryIcons: Record<string, string> = {
    Chemistry: "⚗️",
    Biology: "🧬",
    Biochemistry: "🧪",
    Physics: "⚛️",
    Microbiology: "🔬",
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Workspace Templates</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create templates for users to start workspaces
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Workspace Template</DialogTitle>
              <DialogDescription>
                Add a new workspace template for users
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Acid-Base Experiments"
                />
              </div>

              <div>
                <Label htmlFor="template-desc">Description</Label>
                <Textarea
                  id="template-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this template..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="template-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value, icon: categoryIcons[value] || "⚗️" })}>
                  <SelectTrigger id="template-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Microbiology">Microbiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="template-icon">Icon</Label>
                <Input
                  id="template-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., ⚗️"
                  maxLength={2}
                />
              </div>

              <Button
                onClick={() => createTemplate.mutate()}
                disabled={!formData.name || !formData.description || createTemplate.isPending}
                className="w-full"
              >
                {createTemplate.isPending ? "Creating..." : "Create Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workspace Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Templates</CardTitle>
          <CardDescription>
            {templates?.length || 0} templates available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading templates...
            </div>
          ) : templates && templates.length > 0 ? (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground line-clamp-1">
                        {template.description}
                      </TableCell>
                      <TableCell>{template.usageCount} workspaces</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}>
                          {template.isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTemplate.mutate(template.id)}
                          disabled={deleteTemplate.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No workspace templates yet</p>
              <p className="text-sm mt-1">Create your first template to help users get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
