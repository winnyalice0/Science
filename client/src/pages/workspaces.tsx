import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FolderOpen, Plus, Trash2, FileText } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Workspace, WorkspaceItem } from "@shared/schema";

export default function Workspaces() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  const { data: workspaces, isLoading: workspacesLoading } = useQuery<Workspace[]>({
    queryKey: ["/api/workspaces"],
  });

  const { data: workspaceItems, isLoading: itemsLoading } = useQuery<WorkspaceItem[]>({
    queryKey: ["/api/workspaces", selectedWorkspace, "items"],
    enabled: !!selectedWorkspace,
  });

  const createWorkspace = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/workspaces", {
        name: newWorkspaceName,
        description: newWorkspaceDesc,
        isPublic: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
      setIsCreateDialogOpen(false);
      setNewWorkspaceName("");
      setNewWorkspaceDesc("");
      toast({
        title: "Workspace Created",
        description: "Your new workspace is ready to use.",
      });
    },
  });

  const deleteWorkspace = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/workspaces/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
      setSelectedWorkspace(null);
      toast({
        title: "Workspace Deleted",
        description: "The workspace has been removed.",
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold mb-2">My Workspaces</h1>
          <p className="text-muted-foreground">
            Organize and save your experiments
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-workspace">
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
              <DialogDescription>
                Create a new workspace to organize your experiments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="My Chemistry Project"
                  data-testid="input-workspace-name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="Description of your workspace..."
                  data-testid="textarea-workspace-description"
                />
              </div>
              <Button
                onClick={() => createWorkspace.mutate()}
                disabled={!newWorkspaceName || createWorkspace.isPending}
                className="w-full"
                data-testid="button-create-workspace"
              >
                {createWorkspace.isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Workspaces List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            {workspacesLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : workspaces && workspaces.length > 0 ? (
              <div className="space-y-2">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => setSelectedWorkspace(workspace.id)}
                    className={`w-full text-left p-3 rounded-lg hover-elevate ${
                      selectedWorkspace === workspace.id ? "bg-accent" : ""
                    }`}
                    data-testid={`workspace-${workspace.id}`}
                  >
                    <div className="flex items-start gap-2">
                      <FolderOpen className="h-5 w-5 mt-0.5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{workspace.name}</p>
                        {workspace.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {workspace.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>No workspaces yet</p>
                <p className="mt-1">Create one to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workspace Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedWorkspace
                ? workspaces?.find(w => w.id === selectedWorkspace)?.name || "Workspace Items"
                : "Select a Workspace"}
            </CardTitle>
            {selectedWorkspace && (
              <CardDescription className="flex items-center justify-between">
                <span>Saved experiments and observations</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteWorkspace.mutate(selectedWorkspace)}
                  data-testid="button-delete-workspace"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Workspace
                </Button>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedWorkspace ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a workspace to view its contents</p>
              </div>
            ) : itemsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : workspaceItems && workspaceItems.length > 0 ? (
              <div className="space-y-4">
                {workspaceItems.map((item) => (
                  <Card key={item.id} className="hover-elevate" data-testid={`workspace-item-${item.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            {item.notes && (
                              <CardDescription className="mt-1 line-clamp-2">
                                {item.notes}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No experiments saved yet</p>
                <p className="text-sm mt-1">Run simulations and save them here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
