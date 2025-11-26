import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Download, Share2, BookOpen, ExternalLink } from "lucide-react";
import type { Organ3D } from "@/lib/organs-3d-data";

interface Organ3DViewerProps {
  organ: Organ3D;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  Biology: "bg-green-500",
  Chemistry: "bg-blue-500",
  "Laboratory Materials": "bg-purple-500",
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export function Organ3DViewer({ organ, onClose }: Organ3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when organ changes
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [organ]);

  // Render different embed types
  const renderModelViewer = () => {
    if (organ.modelType === "sketchfab") {
      return (
        <iframe
          title={organ.name}
          className="w-full h-full border-0"
          src={organ.model}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking="true"
          execution-while-out-of-viewport="true"
          execution-while-not-rendered="true"
          web-share="true"
          data-testid={`iframe-sketchfab-${organ.id}`}
          onLoad={() => setIsLoading(false)}
        />
      );
    } else if (organ.modelType === "iframe" || organ.modelType === "html") {
      return (
        <iframe
          title={organ.name}
          className="w-full h-full border-0"
          src={organ.model}
          onLoad={() => setIsLoading(false)}
          data-testid={`iframe-3d-${organ.id}`}
        />
      );
    }

    return (
      <div className="text-center text-white/50 flex items-center justify-center h-full">
        <div>
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>3D Model: {organ.name}</p>
          <p className="text-sm mt-2">Model type: {organ.modelType}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" data-testid="modal-organ-viewer">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <CardHeader className="border-b pb-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex-1">
            <CardTitle className="text-2xl">{organ.name}</CardTitle>
            <CardDescription>{organ.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 p-0"
            data-testid="button-close-viewer"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-auto p-0">
          <div className="grid md:grid-cols-3 gap-6 h-full">
            {/* 3D Model Viewer - 2/3 width */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center min-h-96 relative overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-sm">Loading 3D Model...</p>
                  </div>
                </div>
              )}

              {/* Render model based on type */}
              {renderModelViewer()}
            </div>

            {/* Info Panel - 1/3 width */}
            <div className="md:col-span-1 border-l p-6">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  {/* Badges */}
                  <div className="space-y-2">
                    <p className="font-semibold text-sm text-muted-foreground">Classification</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={categoryColors[organ.category] || "bg-gray-500"}>
                        {organ.category}
                      </Badge>
                      <Badge className={difficultyColors[organ.difficulty] || "bg-gray-100"}>
                        {organ.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <p className="font-semibold text-sm text-muted-foreground">Description</p>
                    <p className="text-sm leading-relaxed">{organ.fullDescription}</p>
                  </div>

                  {/* Learning Points */}
                  <div className="space-y-3">
                    <p className="font-semibold text-sm text-muted-foreground">Learning Points</p>
                    <ul className="space-y-2">
                      {organ.learningPoints.map((point, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Credit */}
                  {organ.credit && (
                    <div className="space-y-2 pt-4 border-t">
                      <p className="font-semibold text-sm text-muted-foreground">Credit</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{organ.credit}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(organ.model, "_blank")}
                      data-testid="button-open-external"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(organ.model);
                      }}
                      data-testid="button-copy-link"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
