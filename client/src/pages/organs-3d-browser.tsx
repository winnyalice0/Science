import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  organs3DData,
  categories,
  getOrgansByCategory,
  type Organ3D,
} from "@/lib/organs-3d-data";
import { Organ3DCard } from "@/components/organ-3d-card";
import { Organ3DViewer } from "@/components/organ-3d-viewer";

export default function Organs3DBrowser() {
  const [selectedOrgan, setSelectedOrgan] = useState<Organ3D | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);

  // Filter organs by category and search
  const filteredOrgans = getOrgansByCategory(selectedCategory).filter((organ) =>
    organ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    organ.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalOrgans: organs3DData.length,
    biology: getOrgansByCategory("Biology").length,
    chemistry: getOrgansByCategory("Chemistry").length,
    labMaterials: getOrgansByCategory("Laboratory Materials").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">3D Organ & Material Explorer</h1>
        <p className="text-muted-foreground text-lg">
          Explore interactive 3D models of biological organs, chemical structures, and laboratory equipment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Models</p>
            <p className="text-3xl font-bold">{stats.totalOrgans}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Biology</p>
            <p className="text-3xl font-bold text-green-500">{stats.biology}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Chemistry</p>
            <p className="text-3xl font-bold text-blue-500">{stats.chemistry}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Lab Materials</p>
            <p className="text-3xl font-bold text-purple-500">{stats.labMaterials}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organs, molecules, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-organs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
        data-testid="tabs-categories"
      >
        <TabsList className="grid w-full md:w-auto md:grid-cols-3 gap-2 mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} data-testid={`tab-${category.toLowerCase()}`}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Biology Category */}
        <TabsContent value="Biology">
          <div className="space-y-4 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Biological Organs & Structures</h2>
              <p className="text-muted-foreground">
                Explore the fascinating world of human anatomy and cellular biology through interactive 3D models.
              </p>
            </div>

            {filteredOrgans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrgans.map((organ) => (
                  <Organ3DCard
                    key={organ.id}
                    organ={organ}
                    onClick={setSelectedOrgan}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No organs found matching your search.</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Chemistry Category */}
        <TabsContent value="Chemistry">
          <div className="space-y-4 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Chemical Structures & Molecules</h2>
              <p className="text-muted-foreground">
                Understand the molecular basis of chemistry with detailed 3D visualizations of important compounds.
              </p>
            </div>

            {filteredOrgans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrgans.map((organ) => (
                  <Organ3DCard
                    key={organ.id}
                    organ={organ}
                    onClick={setSelectedOrgan}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No molecules found matching your search.</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Laboratory Materials Category */}
        <TabsContent value="Laboratory Materials">
          <div className="space-y-4 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Laboratory Equipment & Materials</h2>
              <p className="text-muted-foreground">
                Learn about essential laboratory instruments and how to properly use them in scientific research.
              </p>
            </div>

            {filteredOrgans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrgans.map((organ) => (
                  <Organ3DCard
                    key={organ.id}
                    organ={organ}
                    onClick={setSelectedOrgan}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No equipment found matching your search.</p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 3D Viewer Modal */}
      {selectedOrgan && (
        <Organ3DViewer
          organ={selectedOrgan}
          onClose={() => setSelectedOrgan(null)}
        />
      )}
    </div>
  );
}
