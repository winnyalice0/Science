import { useState, useEffect, Suspense } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Play,
  RotateCcw,
  Download,
  ArrowLeft,
  Settings,
  BarChart3,
  Beaker,
  Database,
  AlertCircle,
  Gauge,
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Simulation } from "@shared/schema";
import { Apparatus3D } from "@/components/apparatus-3d";
import { RealtimeGraphAnalysis, DataTableView, type DataPoint } from "@/components/analysis-panel";
import {
  REACTION_CONFIGS,
  calculateReactionColor,
  calculateReactionState,
  SimulationType,
  SimulationConfig,
} from "@/lib/advanced-simulations";
import * as THREE from "three";

// Advanced 3D Lab Scene
function AdvancedLabScene({
  simulationType,
  temperature,
  ph,
  volume = 50,
  boiling = false,
}: {
  simulationType: SimulationType;
  temperature: number;
  ph: number;
  volume?: number;
  boiling?: boolean;
}) {
  const config = REACTION_CONFIGS[simulationType];
  const { progress, boiling: isBoiling } = calculateReactionState(
    simulationType,
    temperature,
    ph,
    Date.now() % 5000
  );

  const reactionColor = calculateReactionColor(simulationType, temperature, ph, progress);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 4]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Stage environment="studio" intensity={1}>
        <Apparatus3D
          type="beaker"
          volume={volume}
          maxVolume={250}
          temperature={temperature}
          color={reactionColor}
          boiling={isBoiling || boiling}
          scale={1.5}
        />
      </Stage>

      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} />
    </>
  );
}

// Controls Panel Component
function ControlsPanel({
  config,
  parameters,
  onParameterChange,
  onRun,
  onReset,
  isRunning,
  selectedApparatus,
  onApparatusSelect,
}: {
  config: SimulationConfig;
  parameters: Record<string, number>;
  onParameterChange: (name: string, value: number) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  selectedApparatus: string[];
  onApparatusSelect: (id: string) => void;
}) {
  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Experiment Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Parameter Controls */}
        <div>
          <h3 className="font-semibold mb-4 text-sm">Parameters</h3>
          <div className="space-y-4">
            {config.parameters.map((param) => (
              <div key={param.name}>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm">{param.name}</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {parameters[param.name]?.toFixed(1) || param.current}{" "}
                    <span className="text-muted-foreground">{param.unit}</span>
                  </span>
                </div>
                <Slider
                  value={[parameters[param.name] || param.current]}
                  onValueChange={(vals) => onParameterChange(param.name, vals[0])}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{param.min}</span>
                  <span>{param.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={onRun}
            disabled={isRunning}
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running Simulation..." : "Run Simulation"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onReset}
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Parameters
          </Button>
        </div>

        {/* Apparatus Selection */}
        <div>
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Apparatus
          </h3>
          <div className="space-y-2">
            {config.apparatus.map((item) => (
              <Button
                key={item.id}
                variant={selectedApparatus.includes(item.id) ? "default" : "secondary"}
                size="sm"
                className="w-full justify-start"
                onClick={() => onApparatusSelect(item.id)}
              >
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: selectedApparatus.includes(item.id) ? "#00ff00" : "#cccccc",
                  }}
                />
                {item.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-4">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-2">
              💡 Experiment Tip:
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              {config.expectedOutcome}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// Statistics Panel
function StatsPanel({
  temperature,
  ph,
  volume,
  reactionProgress,
  reactionColor,
}: {
  temperature: number;
  ph: number;
  volume: number;
  reactionProgress: number;
  reactionColor: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Real-Time Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Parameters */}
        <div>
          <h3 className="font-semibold mb-4 text-sm">Current Parameters</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Temperature</span>
                <span className="font-mono font-semibold">{temperature.toFixed(1)}°C</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/20 transition-all"
                  style={{ width: `${(temperature / 100) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">pH Level</span>
                <span className="font-mono font-semibold">{ph.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/20 transition-all"
                  style={{ width: `${(ph / 14) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Reaction Progress</span>
                <span className="font-mono font-semibold">{(reactionProgress * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all"
                  style={{ width: `${reactionProgress * 100}%` }}
                />
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Reaction Color</span>
              <div className="h-8 rounded border-2 border-muted flex items-center justify-center" style={{ backgroundColor: reactionColor }}>
                <span className="text-xs font-mono text-white drop-shadow">{reactionColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Indicator */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Solution Volume</span>
            <span className="text-sm font-mono text-blue-900 dark:text-blue-100">{volume.toFixed(1)} mL</span>
          </div>
          <div className="h-3 bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(volume / 250) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdvancedVirtualLab() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // State management
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [experimentData, setExperimentData] = useState<DataPoint[]>([]);
  const [selectedApparatus, setSelectedApparatus] = useState<string[]>([]);
  const [observations, setObservations] = useState("");
  const [activeTab, setActiveTab] = useState("experiment");

  const { data: simulation, isLoading } = useQuery<Simulation>({
    queryKey: ["/api/simulations", id],
  });

  const simulationType = (simulation?.type || "acid-base") as SimulationType;
  const config = REACTION_CONFIGS[simulationType];

  // Initialize parameters
  useEffect(() => {
    if (config && Object.keys(parameters).length === 0) {
      const newParams: Record<string, number> = {};
      config.parameters.forEach((p) => {
        newParams[p.name] = p.current;
      });
      setParameters(newParams);
      setSelectedApparatus([config.apparatus[0]?.id || ""]);
    }
  }, [config, parameters]);

  // Get current values
  const temperature = parameters["Temperature"] || 25;
  const ph = parameters["pH Level"] || 7;
  const volume = parameters["Volume (Acid)"] || 50;

  // Calculate reaction progress
  const { progress: reactionProgress } = calculateReactionState(
    simulationType,
    temperature,
    ph,
    experimentData.length > 0 ? Date.now() - experimentData[0].time : 0
  );

  const reactionColor = calculateReactionColor(simulationType, temperature, ph, reactionProgress);

  const saveToWorkspace = useMutation({
    mutationFn: async () => {
      const data = {
        simulationId: id,
        title: `${simulation?.title} - ${new Date().toLocaleDateString()}`,
        data: { parameters, experimentData, observations },
        notes: observations,
      };
      return apiRequest("POST", "/api/workspace-items", data);
    },
    onSuccess: () => {
      toast({
        title: "Saved to Workspace",
        description: "Your advanced experiment has been saved successfully.",
      });
    },
  });

  const runSimulation = () => {
    setIsRunning(true);
    setExperimentData([]);

    let timeElapsed = 0;
    const interval = setInterval(() => {
      timeElapsed += 500;

      setExperimentData((prev) => [
        ...prev,
        {
          time: Date.now(),
          temperature: temperature + (Math.random() - 0.5) * 2,
          ph: ph + (Math.random() - 0.5) * 0.5,
          volume: volume,
        },
      ]);

      if (timeElapsed >= 10000) {
        clearInterval(interval);
        setIsRunning(false);
        setObservations(
          (prev) =>
            prev +
            `\n✓ Reaction completed at ${temperature}°C, pH ${ph.toFixed(1)}. ` +
            `${config?.reaction.equation}`
        );
        toast({
          title: "Experiment Complete",
          description: "Simulation finished successfully. Check the analysis panel.",
        });
      }
    }, 500);

    return () => clearInterval(interval);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setExperimentData([]);
    const newParams: Record<string, number> = {};
    config?.parameters.forEach((p) => {
      newParams[p.name] = p.current;
    });
    setParameters(newParams);
    setObservations("");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex-1 grid lg:grid-cols-4 gap-4 p-4">
          <Skeleton className="h-full" />
          <Skeleton className="lg:col-span-2 h-full" />
          <Skeleton className="h-full" />
        </div>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Simulation not found</p>
            <Button className="mt-4" onClick={() => navigate("/simulations")}>
              Back to Simulations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/simulations")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{config?.title}</h1>
            <div className="flex gap-2 mt-1">
              <Badge>{simulation.subject}</Badge>
              <Badge variant="outline">{simulation.difficulty}</Badge>
              <Badge variant="secondary">{simulationType}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveToWorkspace.mutate()}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const csv = experimentData
                .map(
                  (d) => `${(d.time / 1000).toFixed(2)},${d.temperature.toFixed(2)},${d.ph.toFixed(2)}`
                )
                .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `experiment-${Date.now()}.csv`;
              a.click();
            }}
            disabled={experimentData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="overflow-auto">
          <ControlsPanel
            config={config!}
            parameters={parameters}
            onParameterChange={(name, value) => {
              setParameters((prev) => ({ ...prev, [name]: value }));
            }}
            onRun={runSimulation}
            onReset={resetSimulation}
            isRunning={isRunning}
            selectedApparatus={selectedApparatus}
            onApparatusSelect={(id) => {
              setSelectedApparatus((prev) =>
                prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
              );
            }}
          />
        </div>

        {/* Center - 3D Canvas */}
        <div className="lg:col-span-2 overflow-hidden">
          <Card className="h-full">
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Loading 3D experiment...</p>
                </div>
              }
            >
              <Canvas>
                <AdvancedLabScene
                  simulationType={simulationType}
                  temperature={temperature}
                  ph={ph}
                  volume={volume}
                  boiling={reactionProgress > 0.5}
                />
              </Canvas>
            </Suspense>
          </Card>
        </div>

        {/* Right Panel - Analysis */}
        <div className="overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monitoring" className="text-xs">
                <Gauge className="h-3 w-3 mr-1" />
                Monitor
              </TabsTrigger>
              <TabsTrigger value="observations" className="text-xs">
                <Database className="h-3 w-3 mr-1" />
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="mt-4">
              <StatsPanel
                temperature={temperature}
                ph={ph}
                volume={volume}
                reactionProgress={reactionProgress}
                reactionColor={reactionColor}
              />
            </TabsContent>

            <TabsContent value="observations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Observations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Record your observations, hypothesis, and results here..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom - Data Analysis */}
      {activeTab === "monitoring" && experimentData.length > 0 && (
        <div className="border-t p-4 bg-white dark:bg-slate-900 max-h-96 overflow-y-auto">
          <RealtimeGraphAnalysis
            data={experimentData}
            simulationType={simulationType}
            title={config?.title || "Simulation"}
          />
        </div>
      )}
    </div>
  );
}
