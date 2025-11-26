import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Organ3D } from "@/lib/organs-3d-data";

interface Organ3DCardProps {
  organ: Organ3D;
  onClick: (organ: Organ3D) => void;
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

export function Organ3DCard({ organ, onClick }: Organ3DCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 h-full"
      onClick={() => onClick(organ)}
      data-testid={`card-organ-${organ.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{organ.name}</CardTitle>
            <CardDescription className="text-xs">{organ.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Thumbnail Image */}
        <div className="relative w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          <img
            src={organ.thumbnail}
            alt={organ.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 160'%3E%3Crect fill='%23e5e7eb' width='200' height='160'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3E${organ.name}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </div>

        {/* Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge className={categoryColors[organ.category] || "bg-gray-500"}>
            {organ.category}
          </Badge>
          <Badge className={difficultyColors[organ.difficulty] || "bg-gray-100"}>
            {organ.difficulty}
          </Badge>
        </div>

        {/* Learning Points Preview */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Topics:</p>
          <div className="flex flex-wrap gap-1">
            {organ.learningPoints.slice(0, 2).map((point, index) => (
              <span key={index} className="inline-block bg-muted px-2 py-1 rounded">
                {point}
              </span>
            ))}
            {organ.learningPoints.length > 2 && (
              <span className="inline-block bg-muted px-2 py-1 rounded">
                +{organ.learningPoints.length - 2} more
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
