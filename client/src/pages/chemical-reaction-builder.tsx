import { useState, Suspense, useEffect } from "react";
import { useLocation } from "wouter";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Play,
  RotateCcw,
  Flame,
  Beaker,
  Thermometer,
  Zap,
  AlertCircle,
  Download,
  Save,
  ArrowLeft,
  Check,
} from "lucide-react";
import { AdvancedApparatus3D } from "@/components/advanced-apparatus-3d";
import { RealtimeGraphAnalysis, DataTableView, type DataPoint } from "@/components/analysis-panel";
import {
  CHEMICAL_DATABASE,
  REACTION_DATABASE,
  ChemicalCompound,
  ReactionEquation,
  suggestReactions,
  calculateStoichiometry,
} from "@/lib/chemical-reaction-db";

interface ReactionSetup {
  reactants: { compound: ChemicalCompound; moles: number }[];
  selectedReaction: ReactionEquation | null;
  equation: string;
  temperature: number;
}

function ChemicalReactionScene({
  reaction,
  temperature,
  isRunning,
}: {
  reaction: ReactionEquation | null;
  temperature: number;
  isRunning: boolean;
}) {
  const flameIntensity = isRunning && reaction ? Math.min(Math.abs(reaction.deltaH) / 1000, 1) : 0;
  const evaporationRate = isRunning && temperature > 80 ? Math.min((temperature - 80) / 50, 1) : 0;
  const smokeAmount = isRunning && flameIntensity > 0.5 ? (flameIntensity - 0.5) * 2 : 0;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 4]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Stage environment="studio" intensity={1}>
        {/* Bunsen Burner */}
        <AdvancedApparatus3D
          type="bunsen_burner"
          isHeating={isRunning && temperature > 25}
          flameIntensity={flameIntensity}
          temperature={temperature}
          scale={1.2}
        />

        {/* Tripod Stand */}
        <group position={[0, 0.05, 0]}>
          <AdvancedApparatus3D
            type="tripod_stand"
            scale={1.2}
          />
        </group>

        {/* Wire Gauze */}
        <group position={[0, 0.8, 0]}>
          <AdvancedApparatus3D
            type="wire_gauze"
            temperature={temperature}
            scale={1.2}
          />
        </group>

        {/* Heated Beaker */}
        <group position={[0, 1.3, 0]}>
          <AdvancedApparatus3D
            type="beaker_heated"
            isHeating={isRunning && temperature > 25}
            flameIntensity={flameIntensity}
            evaporationRate={evaporationRate}
            scale={1.2}
          />
        </group>
      </Stage>

      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} />
    </>
  );
}

export default function ChemicalReactionBuilder() {
  const [, navigate] = useLocation();
  const [reactants, setReactants] = useState<ChemicalCompound[]>([]);
  const [selectedReaction, setSelectedReaction] = useState<ReactionEquation | null>(null);
  const [equation, setEquation] = useState("");
  const [temperature, setTemperature] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [experimentData, setExperimentData] = useState<DataPoint[]>([]);
  const [observations, setObservations] = useState("");
  const [activeTab, setActiveTab] = useState("setup");

  // Chemical compounds by type
  const acids = Object.values(CHEMICAL_DATABASE).filter(c => c.type === "acid");
  const bases = Object.values(CHEMICAL_DATABASE).filter(c => c.type === "base");
  const salts = Object.values(CHEMICAL_DATABASE).filter(c => c.type === "salt");
  const oxides = Object.values(CHEMICAL_DATABASE).filter(c => c.type === "oxide");
  const elements = Object.values(CHEMICAL_DATABASE).filter(c => c.type === "element");

  // Get suggested reactions
  const suggestedReactions = suggestReactions(reactants);

  const addReactant = (compound: ChemicalCompound) => {
    if (!reactants.find(r => r.id === compound.id)) {
      setReactants([...reactants, compound]);
    }
  };

  const removeReactant = (id: string) => {
    setReactants(reactants.filter(r => r.id !== id));
    setSelectedReaction(null);
  };

  const selectReaction = (reaction: ReactionEquation) => {
    setSelectedReaction(reaction);
    setEquation(reaction.equation);
    setTemperature(reaction.condition === "heat" ? 100 : 25);
  };

  const runReaction = () => {
    if (!selectedReaction) return;

    setIsRunning(true);
    setExperimentData([]);

    let timeElapsed = 0;
    const reactionDuration = 8000; // 8 seconds

    const interval = setInterval(() => {
      timeElapsed += 500;

      // Calculate temperature change based on reaction exothermicity
      const tempChange = (selectedReaction.deltaH < 0 ? -selectedReaction.deltaH : selectedReaction.deltaH) / 200;
      const currentTemp = 25 + tempChange * (timeElapsed / reactionDuration) * (isRunning ? 1 : 0);

      setExperimentData(prev => [
        ...prev,
        {
          time: Date.now(),
          temperature: currentTemp,
          ph: 7 + (Math.random() - 0.5) * 2,
        },
      ]);

      if (timeElapsed >= reactionDuration) {
        clearInterval(interval);
        setIsRunning(false);
        setTemperature(25);

        // Add observation
        const newObs = `✓ Reaction complete: ${selectedReaction.equation}\n` +
          `Heat released: ${Math.abs(selectedReaction.deltaH)} kJ/mol\n` +
          `Observations: ${selectedReaction.observations.join(", ")}\n`;

        setObservations(prev => prev + newObs);
      }
    }, 500);
  };

  const resetReaction = () => {
    setIsRunning(false);
    setTemperature(25);
    setExperimentData([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/simulations")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">🔬 Chemical Reaction Builder</h1>
            <p className="text-sm text-muted-foreground">Write your own equations and see real reactions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Reaction
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left Panel - Chemical Selection */}
        <div className="overflow-y-auto space-y-4">
          {/* Acid-Base Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Select Reactants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Acids */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">🧪 Acids</Label>
                <div className="space-y-1">
                  {acids.map(acid => (
                    <Button
                      key={acid.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => addReactant(acid)}
                      disabled={reactants.find(r => r.id === acid.id) !== undefined}
                    >
                      <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: acid.color }} />
                      {acid.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bases */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">🧫 Bases</Label>
                <div className="space-y-1">
                  {bases.map(base => (
                    <Button
                      key={base.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => addReactant(base)}
                      disabled={reactants.find(r => r.id === base.id) !== undefined}
                    >
                      <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: base.color }} />
                      {base.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Elements & Compounds */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">⚛️ Elements</Label>
                <div className="space-y-1">
                  {elements.map(elem => (
                    <Button
                      key={elem.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => addReactant(elem)}
                      disabled={reactants.find(r => r.id === elem.id) !== undefined}
                    >
                      <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: elem.color }} />
                      {elem.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center-Left - Reaction Setup */}
        <div className="overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="equation">Equation</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="mt-4 space-y-4">
              {/* Selected Reactants */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Selected Reactants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {reactants.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Select chemicals from the left</p>
                  ) : (
                    reactants.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                          <span className="text-xs font-semibold">{r.formula}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReactant(r.id)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Suggested Reactions */}
              {suggestedReactions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">💡 Suggested Reactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {suggestedReactions.map((reaction, idx) => (
                      <Button
                        key={idx}
                        variant={selectedReaction === reaction ? "default" : "outline"}
                        className="w-full justify-start text-xs h-auto py-2"
                        onClick={() => selectReaction(reaction)}
                      >
                        <div className="text-left">
                          <p className="font-mono text-xs">{reaction.equation}</p>
                          <p className="text-xs text-muted-foreground">ΔH = {reaction.deltaH} kJ/mol</p>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="equation" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Edit Equation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Chemical Equation</Label>
                    <Input
                      value={equation}
                      onChange={(e) => setEquation(e.target.value)}
                      placeholder="e.g., 2Mg + O₂ → 2MgO"
                      className="font-mono text-xs mt-1"
                    />
                  </div>

                  {selectedReaction && (
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                        <p className="font-semibold">ΔH (Enthalpy): {selectedReaction.deltaH} kJ/mol</p>
                        <p className="text-muted-foreground">
                          {selectedReaction.deltaH < 0 ? "🔥 Exothermic (releases heat)" : "❄️ Endothermic (absorbs heat)"}
                        </p>
                      </div>
                      <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded text-xs">
                        <p className="font-semibold">Observations:</p>
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                          {selectedReaction.observations.map((obs, i) => (
                            <li key={i} className="text-xs">{obs}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center-Right - 3D Visualization */}
        <div className="lg:col-span-2 overflow-hidden">
          <Card className="h-full">
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Loading 3D reaction...</p>
                </div>
              }
            >
              <Canvas>
                <ChemicalReactionScene
                  reaction={selectedReaction}
                  temperature={temperature}
                  isRunning={isRunning}
                />
              </Canvas>
            </Suspense>
          </Card>
        </div>
      </div>

      {/* Bottom - Controls and Analysis */}
      <div className="border-t p-4 bg-white dark:bg-slate-900 space-y-4">
        {/* Controls */}
        <div className="flex gap-2 items-center">
          <Button
            onClick={runReaction}
            disabled={!selectedReaction || isRunning}
            className="gap-2"
            size="lg"
          >
            <Flame className="h-5 w-5" />
            {isRunning ? "Reaction in Progress..." : "Run Reaction"}
          </Button>
          <Button
            variant="outline"
            onClick={resetReaction}
            disabled={isRunning}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          {/* Temperature Control */}
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              <Label className="text-sm">Temperature:</Label>
              <span className="font-mono font-semibold">{temperature.toFixed(0)}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              disabled={isRunning}
              className="w-32"
            />
          </div>

          {/* Info */}
          {selectedReaction && (
            <div className="flex items-center gap-2 ml-4 p-2 bg-amber-50 dark:bg-amber-950 rounded">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold">
                {selectedReaction.deltaH < 0 ? "🔥 Exothermic" : "❄️ Endothermic"}
              </span>
            </div>
          )}
        </div>

        {/* Analysis and Notes */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Real-Time Analysis</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-4">
            {experimentData.length > 0 ? (
              <RealtimeGraphAnalysis
                data={experimentData}
                simulationType={selectedReaction?.equation || "reaction"}
                title="Reaction Analysis"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Run the reaction to see real-time analysis</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <Textarea
                  placeholder="Record your observations, hypothesis, and results..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            {experimentData.length > 0 ? (
              <DataTableView data={experimentData} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No data collected yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
