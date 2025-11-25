import { useState, Suspense } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Save, Play, RotateCcw, Download, ArrowLeft } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Simulation } from "@shared/schema";
import * as THREE from "three";

// Simple 3D Molecule Component
function Molecule({ color = "#4287f5" }: { color?: string }) {
  return (
    <group>
      {/* Central atom */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Surrounding atoms */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 1.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.5,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#ff6b6b" />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D Scene
function LabScene({ temperature }: { temperature: number }) {
  const colorIntensity = Math.min(temperature / 100, 1);
  const moleculeColor = new THREE.Color().lerpColors(
    new THREE.Color("#4287f5"),
    new THREE.Color("#ff6b6b"),
    colorIntensity
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Molecule color={`#${moleculeColor.getHexString()}`} />
      <gridHelper args={[10, 10]} />
    </>
  );
}

export default function VirtualLab() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [temperature, setTemperature] = useState(25);
  const [ph, setPh] = useState(7);
  const [observations, setObservations] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const { data: simulation, isLoading } = useQuery<Simulation>({
    queryKey: ["/api/simulations", id],
  });

  const saveToWorkspace = useMutation({
    mutationFn: async () => {
      const data = {
        simulationId: id,
        title: `${simulation?.title} - ${new Date().toLocaleDateString()}`,
        data: { temperature, ph, observations },
        notes: observations,
      };
      return apiRequest("POST", "/api/workspace-items", data);
    },
    onSuccess: () => {
      toast({
        title: "Saved to Workspace",
        description: "Your experiment has been saved successfully.",
      });
    },
  });

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setObservations(prev => 
        prev + `\n[${new Date().toLocaleTimeString()}] Reaction observed at ${temperature}°C, pH ${ph.toFixed(1)}`
      );
    }, 2000);
  };

  const resetSimulation = () => {
    setTemperature(25);
    setPh(7);
    setObservations("");
    setIsRunning(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex-1 grid lg:grid-cols-[300px_1fr_300px] gap-4 p-4">
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
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
      {/* Top Toolbar */}
      <div className="border-b p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/simulations")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-sim-title">{simulation.title}</h1>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{simulation.subject}</Badge>
              <Badge variant="outline">{simulation.difficulty}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => saveToWorkspace.mutate()} data-testid="button-save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" data-testid="button-export">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Lab Interface */}
      <div className="flex-1 grid lg:grid-cols-[300px_1fr_350px] gap-4 p-4 overflow-hidden">
        {/* Left Panel - Controls */}
        <Card className="overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-2 block">Temperature (°C)</Label>
              <Slider
                value={[temperature]}
                onValueChange={(vals) => setTemperature(vals[0])}
                min={0}
                max={100}
                step={1}
                className="mb-2"
                data-testid="slider-temperature"
              />
              <div className="text-sm text-muted-foreground text-center" data-testid="text-temperature">
                {temperature}°C
              </div>
            </div>

            <div>
              <Label className="mb-2 block">pH Level</Label>
              <Slider
                value={[ph]}
                onValueChange={(vals) => setPh(vals[0])}
                min={0}
                max={14}
                step={0.1}
                className="mb-2"
                data-testid="slider-ph"
              />
              <div className="text-sm text-muted-foreground text-center" data-testid="text-ph">
                {ph.toFixed(1)}
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={runSimulation}
                disabled={isRunning}
                data-testid="button-run"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running..." : "Run Simulation"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetSimulation}
                data-testid="button-reset"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Apparatus</Label>
              <div className="space-y-2">
                {['Beaker (250mL)', 'Burette', 'pH Meter', 'Thermometer'].map((item, i) => (
                  <Button key={i} variant="secondary" size="sm" className="w-full justify-start" data-testid={`button-apparatus-${i}`}>
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center - 3D Canvas */}
        <Card className="overflow-hidden">
          <div className="h-full w-full" data-testid="canvas-3d">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Loading 3D view...</p>
              </div>
            }>
              <Canvas>
                <LabScene temperature={temperature} />
              </Canvas>
            </Suspense>
          </div>
        </Card>

        {/* Right Panel - Observations */}
        <Card className="overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg">Observation Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Current Parameters</Label>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="font-medium font-mono">{temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">pH:</span>
                  <span className="font-medium font-mono">{ph.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Notes</Label>
              <Textarea
                placeholder="Record your observations here..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                data-testid="textarea-observations"
              />
            </div>

            {simulation.type === 'acid-base' && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Expected Reaction:</p>
                  <p className="font-mono text-sm">
                    HCl + NaOH → NaCl + H₂O
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ΔH = -57 kJ/mol
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
