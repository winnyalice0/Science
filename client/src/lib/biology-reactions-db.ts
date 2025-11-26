/**
 * Advanced Biology Lab Database
 * Real biological processes, reactions, and cellular activities
 */

export interface BiologicalProcess {
  id: string;
  name: string;
  category: "cellular" | "enzymatic" | "microbial" | "molecular" | "photosynthesis" | "respiration";
  description: string;
  duration: number; // milliseconds
  equipment: string[];
  materials: string[];
  procedure: string[];
  observations: string[];
  visualEffects: BiologyVisualization[];
  dataCollected: string[];
}

export interface BiologyVisualization {
  type:
    | "cell_division"
    | "dna_replication"
    | "protein_synthesis"
    | "enzyme_action"
    | "fermentation"
    | "photosynthesis"
    | "cellular_respiration"
    | "bacterial_growth"
    | "mitosis"
    | "diffusion"
    | "osmosis"
    | "color_change"
    | "bubble_formation"
    | "crystallization";
  intensity: number;
  duration: number;
  color?: string;
  particleCount?: number;
}

export interface ExperimentData {
  timestamp: number;
  cellCount?: number;
  temperature: number;
  ph: number;
  enzymeActivity?: number;
  proteinProduction?: number;
  glucose?: number;
  oxygenLevel?: number;
  carbonDioxide?: number;
}

// Biological processes database
export const BIOLOGY_PROCESSES: Record<string, BiologicalProcess> = {
  photosynthesis: {
    id: "photosynthesis",
    name: "🌱 Photosynthesis",
    category: "photosynthesis",
    description: "Plants convert light energy into chemical energy (glucose) using CO₂ and water",
    duration: 10000,
    equipment: ["Light source", "Plant leaves", "Microscope", "Spectrophotometer"],
    materials: ["Spinach leaves", "Distilled water", "Phenolphthalein", "NaOH solution"],
    procedure: [
      "Place plant under controlled light",
      "Measure initial O₂ levels",
      "Observe chlorophyll fluorescence",
      "Monitor CO₂ absorption",
      "Record O₂ production",
      "Measure glucose synthesis",
    ],
    observations: [
      "Oxygen bubbles released",
      "Glucose accumulates in leaves",
      "Chlorophyll absorbs light",
      "CO₂ concentration decreases",
      "Light energy converted to chemical energy",
      "Plant cells become greener",
    ],
    visualEffects: [
      { type: "photosynthesis", intensity: 0.9, duration: 10000, color: "#00ff00", particleCount: 150 },
      { type: "color_change", intensity: 0.7, duration: 10000, color: "#00aa00" },
      { type: "bubble_formation", intensity: 0.6, duration: 10000, particleCount: 80 },
    ],
    dataCollected: ["O₂ Production (mL/min)", "CO₂ Consumption (ppm)", "Light Intensity (lux)", "Glucose (mg/mL)"],
  },

  aerobic_respiration: {
    id: "aerobic_respiration",
    name: "⚡ Aerobic Respiration",
    category: "respiration",
    description: "Cells use oxygen to break down glucose and release energy as ATP",
    duration: 8000,
    equipment: ["Respirometer", "Thermometer", "pH meter", "Oxygen sensor"],
    materials: ["Yeast culture", "Glucose solution", "Mineral oil", "KOH (CO₂ absorber)"],
    procedure: [
      "Prepare yeast suspension with glucose",
      "Seal respirometer with KOH",
      "Measure initial O₂ consumption",
      "Record temperature increase",
      "Monitor CO₂ production",
      "Measure ATP generation",
    ],
    observations: [
      "O₂ level decreases rapidly",
      "Temperature increases",
      "CO₂ is produced and absorbed",
      "Energy (ATP) is generated",
      "Water produced as byproduct",
      "Cell activity increases",
    ],
    visualEffects: [
      { type: "cellular_respiration", intensity: 0.85, duration: 8000, color: "#ff6600", particleCount: 120 },
      { type: "color_change", intensity: 0.7, duration: 8000, color: "#ff3300" },
      { type: "bubble_formation", intensity: 0.8, duration: 8000, particleCount: 100 },
    ],
    dataCollected: ["O₂ Consumption (mL/min)", "Temperature (°C)", "CO₂ Production (ppm)", "ATP Generated (nmol)"],
  },

  anaerobic_fermentation: {
    id: "anaerobic_fermentation",
    name: "🧫 Anaerobic Fermentation",
    category: "fermentation",
    description: "Microorganisms break down glucose without oxygen, producing ethanol or lactate",
    duration: 12000,
    equipment: ["Fermentation vessel", "pH meter", "Gas collection tube", "Thermometer"],
    materials: ["Yeast", "Glucose", "Bread dough", "Lactobacillus culture"],
    procedure: [
      "Create anaerobic environment (seal vessel)",
      "Add glucose and microorganisms",
      "Monitor pH changes",
      "Collect gas produced",
      "Measure ethanol/lactate production",
      "Observe foam/bubbling",
    ],
    observations: [
      "Strong bubbling (CO₂ release)",
      "Alcohol smell (ethanol produced)",
      "pH decreases (lactic acid formation)",
      "Gas accumulation",
      "Foam rises in vessel",
      "Temperature increases slightly",
    ],
    visualEffects: [
      { type: "fermentation", intensity: 0.9, duration: 12000, color: "#ffcc00", particleCount: 200 },
      { type: "bubble_formation", intensity: 1, duration: 12000, particleCount: 150 },
      { type: "color_change", intensity: 0.6, duration: 12000, color: "#ffaa00" },
    ],
    dataCollected: ["CO₂ Production (mL/min)", "Ethanol (% v/v)", "pH", "Temperature (°C)"],
  },

  enzyme_catalysis: {
    id: "enzyme_catalysis",
    name: "🧬 Enzyme Catalysis",
    category: "enzymatic",
    description: "Enzymes catalyze biochemical reactions by lowering activation energy",
    duration: 6000,
    equipment: ["Spectrophotometer", "Water bath", "Enzyme solution", "Substrate"],
    materials: ["Amylase enzyme", "Starch solution", "Iodine indicator", "Buffer solution"],
    procedure: [
      "Add enzyme to substrate",
      "Mix thoroughly",
      "Monitor reaction rate",
      "Measure product formation",
      "Test at different temperatures",
      "Calculate enzyme activity",
    ],
    observations: [
      "Reaction rate increases",
      "Blue-black color fades (starch broken down)",
      "Heat speeds up reaction",
      "Optimal temperature found",
      "Enzyme not consumed",
      "Reaction follows kinetics",
    ],
    visualEffects: [
      { type: "enzyme_action", intensity: 0.8, duration: 6000, color: "#0099ff", particleCount: 100 },
      { type: "color_change", intensity: 0.95, duration: 6000, color: "#ffffff" },
      { type: "diffusion", intensity: 0.7, duration: 6000, particleCount: 80 },
    ],
    dataCollected: ["Reaction Rate (μmol/min)", "Temperature (°C)", "Enzyme Concentration (U/mL)", "Substrate Consumed (%)"],
  },

  mitosis_cell_division: {
    id: "mitosis_cell_division",
    name: "🔬 Mitosis (Cell Division)",
    category: "cellular",
    description: "Process of nuclear division resulting in two identical daughter cells",
    duration: 15000,
    equipment: ["Microscope", "Staining kit", "Onion root tip", "Slide preparations"],
    materials: ["Onion root sections", "Methylene blue", "Acid alcohol", "Mounting medium"],
    procedure: [
      "Prepare onion root sections",
      "Fix and stain cells",
      "Mount on slide",
      "Observe under microscope",
      "Identify mitotic phases",
      "Count dividing cells",
    ],
    observations: [
      "Prophase: Chromatin condenses",
      "Metaphase: Chromosomes align",
      "Anaphase: Chromosomes separate",
      "Telophase: Nuclear envelope reforms",
      "Cytokinesis: Cell wall forms",
      "Two daughter cells created",
    ],
    visualEffects: [
      { type: "mitosis", intensity: 0.85, duration: 15000, color: "#6600ff", particleCount: 120 },
      { type: "cell_division", intensity: 0.8, duration: 15000, color: "#cc00ff" },
      { type: "color_change", intensity: 0.7, duration: 15000, color: "#3300ff" },
    ],
    dataCollected: ["Cell Cycle Duration (min)", "Mitotic Index (%)", "Phase Duration (min)", "Cell Count"],
  },

  dna_extraction: {
    id: "dna_extraction",
    name: "🧬 DNA Extraction",
    category: "molecular",
    description: "Isolate and visualize DNA from cells using chemical precipitation",
    duration: 5000,
    equipment: ["Beaker", "Stirring rod", "Cheesecloth", "Test tube"],
    materials: ["Onion/strawberry", "Dish soap", "Salt solution", "Ethanol", "Cold water"],
    procedure: [
      "Chop plant tissue",
      "Add soap solution (breaks down membranes)",
      "Add salt (helps DNA precipitation)",
      "Filter mixture",
      "Add cold ethanol",
      "DNA precipitates out",
    ],
    observations: [
      "Tissue breaks down",
      "Solution becomes viscous",
      "Ethanol creates cloudy layer",
      "White DNA strands appear",
      "DNA is visible to naked eye",
      "DNA is stringy and fibrous",
    ],
    visualEffects: [
      { type: "dna_replication", intensity: 0.75, duration: 5000, color: "#00ccff", particleCount: 90 },
      { type: "crystallization", intensity: 0.9, duration: 5000, color: "#ffffff" },
      { type: "diffusion", intensity: 0.6, duration: 5000, particleCount: 70 },
    ],
    dataCollected: ["DNA Yield (μg)", "DNA Purity (A260/A280)", "Sample Concentration (ng/μL)", "Fragment Size (bp)"],
  },

  bacterial_growth: {
    id: "bacterial_growth",
    name: "🦠 Bacterial Growth Kinetics",
    category: "microbial",
    description: "Monitor bacterial population growth through different phases",
    duration: 20000,
    equipment: ["Culture plates", "Incubator", "Spectrophotometer", "Hemocytometer"],
    materials: ["Bacterial culture", "Growth medium", "Petri dishes", "Inoculation loop"],
    procedure: [
      "Inoculate growth medium",
      "Incubate at 37°C",
      "Measure optical density",
      "Count colonies regularly",
      "Plot growth curve",
      "Identify growth phases",
    ],
    observations: [
      "Lag phase: Initial slow growth",
      "Log phase: Exponential growth",
      "Stationary phase: Growth plateau",
      "Medium becomes turbid",
      "Cell density increases",
      "Metabolic byproducts accumulate",
    ],
    visualEffects: [
      { type: "bacterial_growth", intensity: 0.9, duration: 20000, color: "#00ff66", particleCount: 200 },
      { type: "diffusion", intensity: 0.7, duration: 20000, particleCount: 150 },
      { type: "color_change", intensity: 0.8, duration: 20000, color: "#00aa33" },
    ],
    dataCollected: ["Cell Density (OD600)", "Colony Forming Units (CFU/mL)", "Generation Time (min)", "Growth Rate (1/hour)"],
  },

  osmosis_diffusion: {
    id: "osmosis_diffusion",
    name: "💧 Osmosis & Diffusion",
    category: "cellular",
    description: "Observe movement of water and solutes across semipermeable membranes",
    duration: 10000,
    equipment: ["Dialysis bags", "Beakers", "Stirring rods", "Refractometer"],
    materials: ["Sucrose solution", "Food coloring", "Salt water", "Starch solution"],
    procedure: [
      "Fill dialysis bag with sucrose",
      "Submerge in water",
      "Add food coloring",
      "Observe color diffusion",
      "Measure water uptake",
      "Test with different solutions",
    ],
    observations: [
      "Water enters dialysis bag",
      "Bag becomes turgid",
      "Color spreads through solution",
      "Solutes distribute evenly",
      "Concentration gradient drives movement",
      "Water moves from low to high solute",
    ],
    visualEffects: [
      { type: "osmosis", intensity: 0.8, duration: 10000, color: "#00ff99", particleCount: 100 },
      { type: "diffusion", intensity: 0.85, duration: 10000, color: "#ff0099", particleCount: 120 },
      { type: "color_change", intensity: 0.9, duration: 10000 },
    ],
    dataCollected: ["Mass Change (g)", "Water Uptake (mL)", "Time to Equilibrium (min)", "Concentration (%)"],
  },

  protein_synthesis: {
    id: "protein_synthesis",
    name: "🧬 Protein Synthesis Simulation",
    category: "molecular",
    description: "Simulate translation process: mRNA → tRNA → Protein formation",
    duration: 8000,
    equipment: ["mRNA template", "tRNA models", "Ribosome model", "Amino acid blocks"],
    materials: ["Molecular models", "Color-coded components", "Instruction cards"],
    procedure: [
      "Position mRNA on ribosome",
      "Add tRNA with complementary anticodon",
      "Form peptide bonds",
      "Move ribosome along mRNA",
      "Add next tRNA",
      "Release completed protein",
    ],
    observations: [
      "tRNA brings amino acids",
      "Peptide bonds form",
      "Protein chain grows",
      "Codon read sequentially",
      "Protein folds as it forms",
      "Correct amino acid sequence critical",
    ],
    visualEffects: [
      { type: "protein_synthesis", intensity: 0.8, duration: 8000, color: "#ff99ff", particleCount: 110 },
      { type: "dna_replication", intensity: 0.6, duration: 8000, color: "#cc66ff" },
      { type: "color_change", intensity: 0.7, duration: 8000 },
    ],
    dataCollected: ["Translation Rate (amino acids/sec)", "Codon Read Count", "Protein Length (aa)", "Error Rate (%)"],
  },
};

// Experiment data types for real-time monitoring
export function initializeExperimentData(): ExperimentData {
  return {
    timestamp: Date.now(),
    temperature: 25,
    ph: 7,
    cellCount: 1000,
    enzymeActivity: 0,
    proteinProduction: 0,
    glucose: 100,
    oxygenLevel: 21,
    carbonDioxide: 0.04,
  };
}

// Helper functions
export function getProcessesByCategory(category: string): BiologicalProcess[] {
  return Object.values(BIOLOGY_PROCESSES).filter(p => p.category === category);
}

export function getAllProcesses(): BiologicalProcess[] {
  return Object.values(BIOLOGY_PROCESSES);
}

export function getProcessById(id: string): BiologicalProcess | undefined {
  return BIOLOGY_PROCESSES[id];
}

// Simulation helpers
export function simulatePhotosynthesis(timeElapsed: number): ExperimentData {
  const progress = Math.min(timeElapsed / 10000, 1);
  return {
    timestamp: Date.now(),
    temperature: 25 + progress * 5,
    ph: 7,
    glucose: 100 + progress * 40,
    oxygenLevel: 21 + progress * 8,
    carbonDioxide: 0.04 - progress * 0.02,
  };
}

export function simulateResponsion(timeElapsed: number): ExperimentData {
  const progress = Math.min(timeElapsed / 8000, 1);
  return {
    timestamp: Date.now(),
    temperature: 25 + progress * 10,
    ph: 7,
    glucose: 100 - progress * 40,
    oxygenLevel: 21 - progress * 8,
    carbonDioxide: 0.04 + progress * 0.04,
  };
}

export function simulateBacterialGrowth(timeElapsed: number): ExperimentData {
  const progress = Math.min(timeElapsed / 20000, 1);
  // Exponential growth pattern
  const cellCount = 1000 * Math.exp(progress * 5);
  return {
    timestamp: Date.now(),
    temperature: 37,
    ph: 7 - progress * 0.5,
    cellCount: Math.floor(cellCount),
    glucose: Math.max(0, 100 - progress * 90),
    carbonDioxide: progress * 0.05,
  };
}

export function simulateEnzymeActivity(timeElapsed: number, temperature: number): ExperimentData {
  const progress = Math.min(timeElapsed / 6000, 1);
  // Activity increases with temperature (up to optimal ~37°C, then decreases)
  const tempFactor = temperature < 37 ? temperature / 37 : (100 - temperature) / 63;
  const enzymeActivity = 100 * progress * tempFactor;
  return {
    timestamp: Date.now(),
    temperature,
    ph: 7,
    enzymeActivity: Math.min(enzymeActivity, 100),
    glucose: Math.max(0, 100 - progress * enzymeActivity),
  };
}
