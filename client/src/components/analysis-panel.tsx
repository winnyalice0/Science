import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface DataPoint {
  time: number;
  temperature: number;
  ph: number;
  volume?: number;
  concentration?: number;
  absorbance?: number;
  dnaAmount?: number;
}

interface AnalysisProps {
  data: DataPoint[];
  simulationType: string;
  title: string;
}

export function RealtimeGraphAnalysis({ data, simulationType, title }: AnalysisProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Prepare data for chart
  const chartData = data.map((point, idx) => ({
    time: (point.time / 1000).toFixed(1),
    temperature: point.temperature,
    ph: point.ph,
    ...(point.volume && { volume: point.volume }),
    ...(point.absorbance && { absorbance: (point.absorbance * 100).toFixed(1) }),
  }));

  // Calculate statistics
  const stats = {
    avgTemp: data.length > 0 ? (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(2) : "0",
    avgPh: data.length > 0 ? (data.reduce((sum, d) => sum + d.ph, 0) / data.length).toFixed(2) : "7",
    tempChange: data.length > 1 ? (data[data.length - 1].temperature - data[0].temperature).toFixed(2) : "0",
    phChange: data.length > 1 ? (data[data.length - 1].ph - data[0].ph).toFixed(2) : "0",
    maxTemp: data.length > 0 ? Math.max(...data.map(d => d.temperature)).toFixed(2) : "0",
    minTemp: data.length > 0 ? Math.min(...data.map(d => d.temperature)).toFixed(2) : "0",
  };

  const exportData = () => {
    const csv = [
      ["Time (s)", "Temperature (°C)", "pH Level", "Notes"].join(","),
      ...data.map(d => [
        (d.time / 1000).toFixed(1),
        d.temperature.toFixed(2),
        d.ph.toFixed(2),
        simulationType
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `experiment-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Real-time Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Real-Time Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="h-96">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{ value: "Time (seconds)", position: "insideBottomRight", offset: -5 }}
                  />
                  <YAxis
                    yAxisId="left"
                    label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "pH Level", angle: 90, position: "insideRight" }}
                  />
                  <Tooltip
                    formatter={(value: any) => typeof value === "number" ? value.toFixed(2) : value}
                    labelFormatter={(label) => `Time: ${label}s`}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff6b6b"
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ph"
                    stroke="#4287f5"
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Run the simulation to see real-time data</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Panel */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Temperature Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average:</span>
              <span className="font-mono font-semibold">{stats.avgTemp}°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Maximum:</span>
              <span className="font-mono font-semibold text-red-600">{stats.maxTemp}°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum:</span>
              <span className="font-mono font-semibold text-blue-600">{stats.minTemp}°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Change:</span>
              <span className="font-mono font-semibold">{stats.tempChange}°C</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">pH Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average pH:</span>
              <span className="font-mono font-semibold">{stats.avgPh}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">pH Change:</span>
              <span className="font-mono font-semibold">{stats.phChange}</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-xs text-muted-foreground">pH Scale:</div>
              <div className="flex justify-between text-xs">
                <span>Acidic</span>
                <span>Neutral</span>
                <span>Basic</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reaction Information */}
      {simulationType === "acid-base" && (
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Acid-Base Titration:</strong> Equivalence point occurs when moles of acid equals moles of base.
            At this point, pH = 7 for strong acid-strong base reactions.
          </AlertDescription>
        </Alert>
      )}

      {simulationType === "enzyme-kinetics" && (
        <Alert className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <AlertCircle className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800 dark:text-purple-200">
            <strong>Enzyme Kinetics:</strong> Optimal reaction rate occurs at 37°C and pH 7.4 for most human enzymes.
            Temperature and pH significantly affect enzyme activity.
          </AlertDescription>
        </Alert>
      )}

      {simulationType === "pcr" && (
        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>PCR Cycling:</strong> Each cycle doubles DNA amount: 2^n copies after n cycles.
            30 cycles = ~1 billion copies. Success confirmed by gel electrophoresis.
          </AlertDescription>
        </Alert>
      )}

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Export Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={exportData}
              disabled={data.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const text = `Experiment Data:\n${JSON.stringify(data, null, 2)}`;
                navigator.clipboard.writeText(text);
              }}
              disabled={data.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DataTableView({ data }: { data: DataPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Data Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Time (s)</th>
                <th className="text-left py-2 px-2">Temp (°C)</th>
                <th className="text-left py-2 px-2">pH</th>
                <th className="text-left py-2 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-20).map((point, idx) => (
                <tr key={idx} className="border-b hover:bg-muted">
                  <td className="py-2 px-2 font-mono">{(point.time / 1000).toFixed(1)}</td>
                  <td className="py-2 px-2 font-mono">{point.temperature.toFixed(2)}</td>
                  <td className="py-2 px-2 font-mono">{point.ph.toFixed(2)}</td>
                  <td className="py-2 px-2 text-muted-foreground">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
