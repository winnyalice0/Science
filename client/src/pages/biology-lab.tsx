import { useState, Suspense } from "react";
import { useLocation } from "wouter";
import { Canvas } from "@react-three/fiber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  RotateCcw,
  Microscope,
  TestTube,
  Beaker,
  Zap,
  ArrowLeft,
  Download,
  Save,
} from "lucide-react";
import { RealtimeGraphAnalysis, DataTableView, type DataPoint } from "@/components/analysis-panel";
import {
  BIOLOGY_PROCESSES,
  BiologicalProcess,
  simulatePhotosynthesis,
  simulateResponsion,
  simulateBacterialGrowth,
  simulateEnzymeActivity,
} from "@/lib/biology-reactions-db";

interface ProcessSetup {
  selectedProcess: BiologicalProcess | null;
  isRunning: boolean;
  experimentData: DataPoint[];
  observations: string;
  temperature: number;
}

function BiologyVisualization3D({
  processId,
  isRunning,
  timeElapsed,
}: {
  processId: string;
  isRunning: boolean;
  timeElapsed: number;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-4">
        <div className="text-6xl">
          {processId === "photosynthesis" && "🌱"}
          {processId === "aerobic_respiration" && "⚡"}
          {processId === "anaerobic_fermentation" && "🧫"}
          {processId === "enzyme_catalysis" && "🧬"}
          {processId === "mitosis_cell_division" && "🔬"}
          {processId === "dna_extraction" && "🧬"}
          {processId === "bacterial_growth" && "🦠"}
          {processId === "osmosis_diffusion" && "💧"}
          {processId === "protein_synthesis" && "🧬"}
        </div>
        <div className="text-sm text-muted-foreground">
          {isRunning ? "Experiment Running..." : "Ready to Start"}
        </div>
        {isRunning && (
          <div className="text-sm font-mono">
            Time: {(timeElapsed / 1000).toFixed(1)}s
          </div>
        )}
        <div className="animate-pulse text-2xl">
          {isRunning ? "●" : "○"}
        </div>
      </div>
    </div>
  );
}

export default function BiologyLab() {
  const [, navigate] = useLocation();
  const [selectedProcess, setSelectedProcess] = useState<BiologicalProcess | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [experimentData, setExperimentData] = useState<DataPoint[]>([]);
  const [observations, setObservations] = useState("");
  const [temperature, setTemperature] = useState(25);
  const [activeTab, setActiveTab] = useState("setup");

  const categories = ["cellular", "enzymatic", "microbial", "molecular", "photosynthesis", "respiration"];

  const runExperiment = () => {
    if (!selectedProcess) return;

    setIsRunning(true);
    setTimeElapsed(0);
    setExperimentData([]);

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 500;
      setTimeElapsed(elapsed);

      // Simulate different processes
      let data: any;
      switch (selectedProcess.id) {
        case "photosynthesis":
          data = simulatePhotosynthesis(elapsed);
          break;
        case "aerobic_respiration":
          data = simulateResponsion(elapsed);
          break;
        case "bacterial_growth":
          data = simulateBacterialGrowth(elapsed);
          break;
        case "enzyme_catalysis":
          data = simulateEnzymeActivity(elapsed, temperature);
          break;
        default:
          data = {
            timestamp: Date.now(),
            temperature: temperature + Math.random() * 2,
            ph: 7 + (Math.random() - 0.5) * 0.5,
          };
      }

      setExperimentData(prev => [
        ...prev,
        {
          time: Date.now(),
          temperature: data.temperature || temperature,
          ph: data.ph || 7,
        },
      ]);

      if (elapsed >= selectedProcess.duration) {
        clearInterval(interval);
        setIsRunning(false);

        // Add completion observation
        const newObs = `✓ Experiment Complete: ${selectedProcess.name}\n` +
          `Duration: ${selectedProcess.duration / 1000} seconds\n` +
          `Key Observation: ${selectedProcess.observations[0]}\n`;

        setObservations(prev => prev + newObs);
      }
    }, 500);
  };

  const resetExperiment = () => {
    setIsRunning(false);
    setTimeElapsed(0);
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
            <h1 className="text-2xl font-bold">🔬 Advanced Biology Lab</h1>
            <p className="text-sm text-muted-foreground">Real cellular & biological processes with live visualization</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Experiment
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left Panel - Process Selection */}
        <div className="overflow-y-auto space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Processes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map(category => {
                const processes = Object.values(BIOLOGY_PROCESSES).filter(
                  p => p.category === category
                );
                return (
                  <div key={category}>
                    <Label className="text-xs font-semibold capitalize mb-1 block">
                      {category.replace(/_/g, " ")}
                    </Label>
                    <div className="space-y-1">
                      {processes.map(process => (
                        <Button
                          key={process.id}
                          variant={
                            selectedProcess?.id === process.id
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="w-full justify-start text-xs h-auto py-2"
                          onClick={() => {
                            setSelectedProcess(process);
                            setTemperature(25);
                          }}
                          disabled={isRunning}
                        >
                          <div className="text-left">
                            <p className="font-semibold">{process.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(process.duration / 1000).toFixed(0)}s
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Center-Left - Process Details */}
        <div className="overflow-y-auto">
          {selectedProcess ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3 text-xs">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="procedure">Steps</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-3 space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{selectedProcess.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {selectedProcess.description}
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold">Key Observations:</p>
                        <ul className="text-xs mt-1 space-y-1 list-disc list-inside">
                          {selectedProcess.observations.slice(0, 3).map((obs, i) => (
                            <li key={i}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="procedure" className="mt-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs">Procedure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="text-xs space-y-2 list-decimal list-inside">
                      {selectedProcess.procedure.map((step, i) => (
                        <li key={i} className="text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="mt-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs">Equipment & Materials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold mb-1">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProcess.equipment.map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1">Materials:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProcess.materials.map((item, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>Select a process to begin</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Center-Right - 3D Visualization */}
        <div className="lg:col-span-2 overflow-hidden">
          <Card className="h-full">
            {selectedProcess ? (
              <BiologyVisualization3D
                processId={selectedProcess.id}
                isRunning={isRunning}
                timeElapsed={timeElapsed}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Select a process to view visualization</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Bottom - Controls and Analysis */}
      <div className="border-t p-4 bg-white dark:bg-slate-900 space-y-4">
        {/* Controls */}
        <div className="flex gap-2 items-center flex-wrap">
          <Button
            onClick={runExperiment}
            disabled={!selectedProcess || isRunning}
            className="gap-2"
            size="lg"
          >
            <Zap className="h-5 w-5" />
            {isRunning ? "Experiment Running..." : "Start Experiment"}
          </Button>
          <Button
            variant="outline"
            onClick={resetExperiment}
            disabled={isRunning}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          {/* Temperature Control */}
          {selectedProcess?.category === "enzymatic" && (
            <div className="ml-auto flex items-center gap-2">
              <Label className="text-sm">Temperature:</Label>
              <span className="font-mono font-semibold w-12">{temperature}°C</span>
              <input
                type="range"
                min="0"
                max="80"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                disabled={isRunning}
                className="w-32"
              />
            </div>
          )}

          {/* Data Summary */}
          {selectedProcess && (
            <div className="ml-auto flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
              <Microscope className="h-4 w-4" />
              <span className="font-semibold">{selectedProcess.dataCollected.length} Parameters Tracked</span>
            </div>
          )}
        </div>

        {/* Analysis and Notes */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Live Analysis</TabsTrigger>
            <TabsTrigger value="data">Data Table</TabsTrigger>
            <TabsTrigger value="notes">Lab Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-4">
            {experimentData.length > 0 ? (
              <RealtimeGraphAnalysis
                data={experimentData}
                simulationType={selectedProcess?.name || "Biology"}
                title="Experiment Analysis"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Run an experiment to see live analysis</p>
              </div>
            )}
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

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <Textarea
                  placeholder="Record your observations, hypothesis, findings, and conclusions..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
