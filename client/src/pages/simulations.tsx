import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Simulation } from "@shared/schema";
import chemImage from "@assets/generated_images/chemistry_reaction_simulation_preview.png";
import bioImage from "@assets/generated_images/biology_cell_structure_preview.png";
import dnaImage from "@assets/generated_images/dna_replication_simulation_preview.png";

const thumbnailMap: Record<string, string> = {
  Chemistry: chemImage,
  Biology: bioImage,
  Biochemistry: dnaImage,
};

export default function Simulations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: simulations, isLoading } = useQuery<Simulation[]>({
    queryKey: ["/api/simulations"],
  });

  const subjects = ["Chemistry", "Biology", "Biochemistry"];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const filteredSimulations = simulations?.filter(sim => {
    const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(sim.subject);
    const matchesDifficulty = selectedDifficulty === "all" || sim.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-2">Browse Simulations</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive library of virtual laboratory experiments
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Subject</Label>
                  <div className="space-y-2">
                    {subjects.map(subject => (
                      <div key={subject} className="flex items-center gap-2">
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => toggleSubject(subject)}
                          data-testid={`checkbox-subject-${subject.toLowerCase()}`}
                        />
                        <Label htmlFor={`subject-${subject}`} className="cursor-pointer">
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger data-testid="select-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {difficulties.map(diff => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground" data-testid="text-results-count">
          {filteredSimulations.length} simulation{filteredSimulations.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Simulations Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredSimulations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No simulations found matching your criteria</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubjects([]);
                setSelectedDifficulty("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((sim) => (
            <Link key={sim.id} href={`/lab/${sim.id}`}>
              <Card className="overflow-hidden hover-elevate h-full" data-testid={`card-simulation-${sim.id}`}>
                <div className="aspect-video relative">
                  <img
                    src={thumbnailMap[sim.subject] || chemImage}
                    alt={sim.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <Badge variant="secondary" data-testid={`badge-subject-${sim.id}`}>
                      {sim.subject}
                    </Badge>
                    <Badge variant="outline" data-testid={`badge-difficulty-${sim.id}`}>
                      {sim.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg" data-testid={`title-${sim.id}`}>
                    {sim.title}
                  </CardTitle>
                  <CardDescription>
                    {sim.duration} min • {sim.completionCount || 0} completions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {sim.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
