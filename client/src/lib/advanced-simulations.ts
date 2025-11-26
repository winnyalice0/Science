/**
 * Advanced Simulation Engine with Real Chemical Reactions
 * Provides realistic chemical reactions, apparatus control, and parameter tracking
 */

export type SimulationType = 
  | "acid-base" 
  | "enzyme-kinetics" 
  | "pcr" 
  | "gel-electrophoresis" 
  | "precipitation";

export interface ChemicalReaction {
  reactants: string[];
  products: string[];
  equation: string;
  deltaH: number; // kJ/mol
  minTemp: number;
  maxTemp: number;
  minPh: number;
  maxPh: number;
  colorBefore: string;
  colorAfter: string;
  boils: boolean;
  boilTemp?: number;
}

export interface SimulationConfig {
  type: SimulationType;
  title: string;
  description: string;
  reaction: ChemicalReaction;
  parameters: SimulationParameter[];
  apparatus: ApparatusItem[];
  expectedOutcome: string;
}

export interface SimulationParameter {
  name: string;
  unit: string;
  min: number;
  max: number;
  current: number;
  step: number;
}

export interface ApparatusItem {
  id: string;
  name: string;
  type: "container" | "heater" | "measurement" | "accessory";
  active: boolean;
  volume?: number;
  maxVolume?: number;
}

export interface ExperimentData {
  timestamp: number;
  temperature: number;
  ph: number;
  volume?: number;
  particleCount?: number;
  color?: string;
  state?: "liquid" | "solid" | "boiling" | "reacted";
}

// Detailed reaction configurations
export const REACTION_CONFIGS: Record<SimulationType, SimulationConfig> = {
  "acid-base": {
    type: "acid-base",
    title: "Acid-Base Titration",
    description: "Master volumetric analysis by performing a precise titration experiment",
    reaction: {
      reactants: ["HCl", "NaOH"],
      products: ["NaCl", "H₂O"],
      equation: "HCl + NaOH → NaCl + H₂O",
      deltaH: -57.3,
      minTemp: 0,
      maxTemp: 100,
      minPh: 0,
      maxPh: 14,
      colorBefore: "#ff4444",
      colorAfter: "#f5f5f5",
      boils: false,
    },
    parameters: [
      { name: "Temperature", unit: "°C", min: 0, max: 100, current: 25, step: 1 },
      { name: "pH Level", unit: "pH", min: 0, max: 14, current: 7, step: 0.1 },
      { name: "Volume (Acid)", unit: "mL", min: 0, max: 250, current: 50, step: 1 },
      { name: "Concentration", unit: "M", min: 0.1, max: 2, current: 1, step: 0.1 },
    ],
    apparatus: [
      { id: "burette", name: "Burette", type: "container", active: true, volume: 0, maxVolume: 50 },
      { id: "beaker", name: "Beaker (250mL)", type: "container", active: true, volume: 50, maxVolume: 250 },
      { id: "ph-meter", name: "pH Meter", type: "measurement", active: false },
      { id: "thermometer", name: "Thermometer", type: "measurement", active: false },
      { id: "stirrer", name: "Glass Stirrer", type: "accessory", active: false },
    ],
    expectedOutcome:
      "At equivalence point (pH ~7), the color indicator changes. Record the volume of titrant used to calculate acid concentration.",
  },

  "enzyme-kinetics": {
    type: "enzyme-kinetics",
    title: "Enzyme Kinetics Analysis",
    description: "Investigate enzyme catalysis and reaction rates under different conditions",
    reaction: {
      reactants: ["Substrate (S)", "Enzyme (E)"],
      products: ["Product (P)"],
      equation: "E + S ⇌ ES → E + P",
      deltaH: -45,
      minTemp: 4,
      maxTemp: 90,
      minPh: 5,
      maxPh: 9,
      colorBefore: "#87ceeb",
      colorAfter: "#ffeb3b",
      boils: false,
    },
    parameters: [
      { name: "Temperature", unit: "°C", min: 4, max: 90, current: 37, step: 1 },
      { name: "pH Level", unit: "pH", min: 5, max: 9, current: 7.4, step: 0.1 },
      { name: "Substrate Conc.", unit: "mM", min: 0, max: 10, current: 5, step: 0.5 },
      { name: "Enzyme Conc.", unit: "U/mL", min: 0, max: 100, current: 50, step: 5 },
      { name: "Reaction Time", unit: "min", min: 0, max: 30, current: 0, step: 1 },
    ],
    apparatus: [
      { id: "cuvette", name: "Cuvette", type: "container", active: true, volume: 1, maxVolume: 4.5 },
      { id: "spectrophotometer", name: "Spectrophotometer", type: "measurement", active: true },
      { id: "incubator", name: "Water Bath", type: "heater", active: true },
      { id: "pipette", name: "Micropipette", type: "accessory", active: false },
    ],
    expectedOutcome:
      "Observe changes in absorbance over time. Calculate Vmax and Km. Optimal reaction rate occurs at physiological conditions (37°C, pH 7.4).",
  },

  "pcr": {
    type: "pcr",
    title: "Polymerase Chain Reaction (PCR)",
    description: "Amplify specific DNA sequences using thermal cycling",
    reaction: {
      reactants: ["DNA Template", "Primers", "dNTPs", "Taq Polymerase"],
      products: ["Amplified DNA"],
      equation: "DNA → DNA × 2ⁿ (exponential amplification)",
      deltaH: 0,
      minTemp: 50,
      maxTemp: 95,
      minPh: 7,
      maxPh: 8,
      colorBefore: "#e8f4f8",
      colorAfter: "#4db8ff",
      boils: false,
    },
    parameters: [
      { name: "Denaturation Temp", unit: "°C", min: 90, max: 95, current: 94, step: 0.5 },
      { name: "Annealing Temp", unit: "°C", min: 50, max: 65, current: 58, step: 0.5 },
      { name: "Extension Temp", unit: "°C", min: 70, max: 75, current: 72, step: 0.5 },
      { name: "Number of Cycles", unit: "cycles", min: 20, max: 40, current: 30, step: 1 },
      { name: "Extension Time", unit: "sec/kb", min: 30, max: 120, current: 60, step: 10 },
    ],
    apparatus: [
      { id: "pcr-tube", name: "PCR Tube", type: "container", active: true, volume: 0.05, maxVolume: 0.2 },
      { id: "thermal-cycler", name: "Thermal Cycler", type: "heater", active: true },
      { id: "gel-tray", name: "Gel Tray", type: "container", active: false },
    ],
    expectedOutcome:
      "After 30 cycles, DNA amplifies exponentially (2³⁰ = ~1 billion copies). Success confirmed by gel electrophoresis showing bright bands.",
  },

  "gel-electrophoresis": {
    type: "gel-electrophoresis",
    title: "DNA Gel Electrophoresis",
    description: "Separate and analyze DNA fragments by size",
    reaction: {
      reactants: ["DNA Samples", "Loading Buffer"],
      products: ["Separated DNA Fragments"],
      equation: "DNA + Electric Field → Fragments by Size",
      deltaH: 0,
      minTemp: 4,
      maxTemp: 50,
      minPh: 8,
      maxPh: 8.5,
      colorBefore: "#ffcccc",
      colorAfter: "#00aa00",
      boils: false,
    },
    parameters: [
      { name: "Gel Concentration", unit: "%", min: 0.5, max: 2, current: 1, step: 0.1 },
      { name: "Voltage", unit: "V", min: 50, max: 150, current: 100, step: 10 },
      { name: "Run Time", unit: "min", min: 10, max: 90, current: 45, step: 5 },
      { name: "DNA Amount", unit: "μg", min: 0.5, max: 5, current: 2, step: 0.5 },
    ],
    apparatus: [
      { id: "gel-box", name: "Gel Box", type: "container", active: true },
      { id: "power-supply", name: "Power Supply", type: "heater", active: true },
      { id: "loading-pipette", name: "Loading Pipette", type: "accessory", active: false },
      { id: "ladder", name: "DNA Ladder", type: "accessory", active: true },
    ],
    expectedOutcome:
      "DNA fragments separate based on size. Smaller fragments move farther. Compare with DNA ladder to determine fragment sizes (100bp, 500bp, etc.).",
  },

  "precipitation": {
    type: "precipitation",
    title: "Precipitation Reactions",
    description: "Observe solubility and precipitate formation",
    reaction: {
      reactants: ["AgNO₃", "NaCl"],
      products: ["AgCl↓", "NaNO₃"],
      equation: "Ag⁺ + Cl⁻ → AgCl↓ (white precipitate)",
      deltaH: -65,
      minTemp: 0,
      maxTemp: 100,
      minPh: 5,
      maxPh: 9,
      colorBefore: "#e3f2fd",
      colorAfter: "#eeeeee",
      boils: false,
    },
    parameters: [
      { name: "Temperature", unit: "°C", min: 0, max: 100, current: 25, step: 1 },
      { name: "pH Level", unit: "pH", min: 5, max: 9, current: 7, step: 0.1 },
      { name: "Concentration", unit: "M", min: 0.01, max: 1, current: 0.1, step: 0.05 },
      { name: "Volume Ratio", unit: "ratio", min: 1, max: 5, current: 1, step: 0.5 },
    ],
    apparatus: [
      { id: "test-tube", name: "Test Tube", type: "container", active: true, volume: 0, maxVolume: 15 },
      { id: "beaker", name: "Beaker", type: "container", active: true, volume: 0, maxVolume: 250 },
      { id: "thermometer", name: "Thermometer", type: "measurement", active: false },
      { id: "stirrer", name: "Glass Rod", type: "accessory", active: false },
    ],
    expectedOutcome:
      "White precipitate of AgCl forms immediately upon mixing. Insoluble in dilute nitric acid, dissolving only in ammonia.",
  },
};

// Color calculation based on reaction parameters
export function calculateReactionColor(
  simType: SimulationType,
  temperature: number,
  ph: number,
  progress: number
): string {
  const config = REACTION_CONFIGS[simType];
  if (!config) return "#4287f5";

  const tempProgress = Math.max(0, Math.min(1, (temperature - config.reaction.minTemp) / (config.reaction.maxTemp - config.reaction.minTemp)));
  const phOffset = Math.abs(ph - 7) / 7;
  const reactionProgress = Math.min(progress, 1);

  // Interpolate between before and after colors
  const beforeColor = hexToRgb(config.reaction.colorBefore);
  const afterColor = hexToRgb(config.reaction.colorAfter);

  const r = Math.round(beforeColor.r + (afterColor.r - beforeColor.r) * reactionProgress);
  const g = Math.round(beforeColor.g + (afterColor.g - beforeColor.g) * reactionProgress);
  const b = Math.round(beforeColor.b + (afterColor.b - beforeColor.b) * reactionProgress);

  return rgbToHex(r, g, b);
}

// Utility functions for color conversion
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 66, g: 135, b: 245 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Calculate reaction progress and state
export function calculateReactionState(
  simType: SimulationType,
  temperature: number,
  ph: number,
  timeElapsed: number
): { progress: number; boiling: boolean; state: "idle" | "reacting" | "complete" } {
  const config = REACTION_CONFIGS[simType];
  if (!config) return { progress: 0, boiling: false, state: "idle" };

  const isInValidRange =
    temperature >= config.reaction.minTemp &&
    temperature <= config.reaction.maxTemp &&
    ph >= config.reaction.minPh &&
    ph <= config.reaction.maxPh;

  if (!isInValidRange) {
    return { progress: 0, boiling: false, state: "idle" };
  }

  const progress = Math.min((timeElapsed / 5000) * 100, 100) / 100;
  const boiling = config.reaction.boils && temperature >= (config.reaction.boilTemp || 100);

  return {
    progress,
    boiling,
    state: progress === 0 ? "idle" : progress === 1 ? "complete" : "reacting",
  };
}

// Particle system data for visualization
export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export function generateReactionParticles(
  simType: SimulationType,
  count: number,
  baseColor: string
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: (Math.random() - 0.5) * 4,
      y: Math.random() * 2 - 1,
      z: (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 0.02,
      vy: Math.random() * 0.03,
      vz: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 0.1 + 0.05,
      color: baseColor,
      life: 1,
      maxLife: 1,
    });
  }
  return particles;
}

// Real-time data analysis
export function analyzeExperimentData(data: ExperimentData[]): {
  avgTemp: number;
  avgPh: number;
  reactionRate: number;
  timeElapsed: number;
} {
  if (data.length === 0)
    return { avgTemp: 0, avgPh: 0, reactionRate: 0, timeElapsed: 0 };

  const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
  const avgPh = data.reduce((sum, d) => sum + d.ph, 0) / data.length;
  const timeElapsed = data[data.length - 1].timestamp - data[0].timestamp;

  // Calculate reaction rate based on color change
  const initialColor = data[0].color || "#4287f5";
  const finalColor = data[data.length - 1].color || "#ff0000";
  const colorDistance = hexToRgb(initialColor); // Simplified
  const reactionRate = timeElapsed > 0 ? colorDistance.r / timeElapsed : 0;

  return { avgTemp, avgPh, reactionRate, timeElapsed };
}
