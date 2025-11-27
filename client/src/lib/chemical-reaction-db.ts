/**
 * Advanced Chemical Reaction Database
 * Comprehensive library of real chemical reactions with realistic visualization
 */

export interface ChemicalCompound {
  id: string;
  name: string;
  formula: string;
  type: "acid" | "base" | "salt" | "oxide" | "compound" | "element";
  molarMass: number;
  color: string;
  state: "solid" | "liquid" | "gas";
  density?: number;
  boilingPoint?: number;
  meltingPoint?: number;
  hazard?: string[];
}

export interface ReactionEquation {
  reactants: { compound: ChemicalCompound; moles: number }[];
  products: { compound: ChemicalCompound; moles: number }[];
  equation: string;
  deltaH: number; // kJ/mol - negative = exothermic (releases heat/fire)
  deltaS: number;
  condition: "heat" | "light" | "catalyst" | "room_temp" | "cold";
  visualEffects: VisualizationEffect[];
  observations: string[];
  productColor?: string;
  fireIntensity?: number; // 0-1 scale
  smokeAmount?: number; // 0-1 scale
  evaporationRate?: number; // 0-1 scale
  explosiveness?: number; // 0-1 scale
  canExplode?: boolean; // True if reaction can cause explosion
  explosionIntensity?: number; // 0-1 scale for explosion severity
  explosionRadius?: number; // meters
}

export interface VisualizationEffect {
  type: "flame" | "smoke" | "evaporation" | "effervescence" | "precipitation" | "color_change" | "light" | "crystallization";
  intensity: number; // 0-1
  duration: number; // milliseconds
  color?: string;
  particle_count?: number;
}

// Comprehensive chemical database
export const CHEMICAL_DATABASE: Record<string, ChemicalCompound> = {
  // Acids
  HCl: {
    id: "HCl",
    name: "Hydrochloric Acid",
    formula: "HCl",
    type: "acid",
    molarMass: 36.46,
    color: "#ffcccc",
    state: "liquid",
    boilingPoint: -85,
    hazard: ["corrosive", "toxic"],
  },
  H2SO4: {
    id: "H2SO4",
    name: "Sulfuric Acid",
    formula: "H₂SO₄",
    type: "acid",
    molarMass: 98.08,
    color: "#ffaaaa",
    state: "liquid",
    boilingPoint: 337,
    hazard: ["corrosive", "dehydrating"],
  },
  HNO3: {
    id: "HNO3",
    name: "Nitric Acid",
    formula: "HNO₃",
    type: "acid",
    molarMass: 63.01,
    color: "#ffdddd",
    state: "liquid",
    boilingPoint: 83,
    hazard: ["corrosive", "oxidizing"],
  },
  CH3COOH: {
    id: "CH3COOH",
    name: "Acetic Acid",
    formula: "CH₃COOH",
    type: "acid",
    molarMass: 60.05,
    color: "#ffffcc",
    state: "liquid",
    boilingPoint: 118,
  },

  // Bases
  NaOH: {
    id: "NaOH",
    name: "Sodium Hydroxide",
    formula: "NaOH",
    type: "base",
    molarMass: 40.0,
    color: "#ccffcc",
    state: "solid",
    meltingPoint: 318,
    hazard: ["corrosive"],
  },
  KOH: {
    id: "KOH",
    name: "Potassium Hydroxide",
    formula: "KOH",
    type: "base",
    molarMass: 56.1,
    color: "#ccffcc",
    state: "solid",
    meltingPoint: 360,
    hazard: ["corrosive"],
  },
  NH3: {
    id: "NH3",
    name: "Ammonia",
    formula: "NH₃",
    type: "base",
    molarMass: 17.03,
    color: "#ccffff",
    state: "gas",
    boilingPoint: -33,
  },

  // Salts and Compounds
  NaCl: {
    id: "NaCl",
    name: "Sodium Chloride",
    formula: "NaCl",
    type: "salt",
    molarMass: 58.44,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 801,
  },
  AgNO3: {
    id: "AgNO3",
    name: "Silver Nitrate",
    formula: "AgNO₃",
    type: "salt",
    molarMass: 169.87,
    color: "#ffffcc",
    state: "solid",
    meltingPoint: 212,
    hazard: ["oxidizing"],
  },
  CaCO3: {
    id: "CaCO3",
    name: "Calcium Carbonate",
    formula: "CaCO₃",
    type: "salt",
    molarMass: 100.09,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 1339,
  },
  Na2CO3: {
    id: "Na2CO3",
    name: "Sodium Carbonate",
    formula: "Na₂CO₃",
    type: "salt",
    molarMass: 105.99,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 851,
  },

  // Oxides
  CuO: {
    id: "CuO",
    name: "Copper Oxide",
    formula: "CuO",
    type: "oxide",
    molarMass: 79.55,
    color: "#000000",
    state: "solid",
    meltingPoint: 1800,
  },
  MnO2: {
    id: "MnO2",
    name: "Manganese Dioxide",
    formula: "MnO₂",
    type: "oxide",
    molarMass: 86.94,
    color: "#3d3d3d",
    state: "solid",
    meltingPoint: 535,
  },
  Fe2O3: {
    id: "Fe2O3",
    name: "Iron(III) Oxide",
    formula: "Fe₂O₃",
    type: "oxide",
    molarMass: 159.69,
    color: "#cc0000",
    state: "solid",
    meltingPoint: 1565,
  },
  MgO: {
    id: "MgO",
    name: "Magnesium Oxide",
    formula: "MgO",
    type: "oxide",
    molarMass: 40.3,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 2852,
  },

  // Elements
  Mg: {
    id: "Mg",
    name: "Magnesium",
    formula: "Mg",
    type: "element",
    molarMass: 24.31,
    color: "#cccccc",
    state: "solid",
    meltingPoint: 650,
  },
  C: {
    id: "C",
    name: "Carbon",
    formula: "C",
    type: "element",
    molarMass: 12.01,
    color: "#000000",
    state: "solid",
  },
  S: {
    id: "S",
    name: "Sulfur",
    formula: "S",
    type: "element",
    molarMass: 32.06,
    color: "#ffff00",
    state: "solid",
    meltingPoint: 115,
  },
  Fe: {
    id: "Fe",
    name: "Iron",
    formula: "Fe",
    type: "element",
    molarMass: 55.85,
    color: "#999999",
    state: "solid",
    meltingPoint: 1538,
  },

  // Gases and Combustibles
  O2: {
    id: "O2",
    name: "Oxygen",
    formula: "O₂",
    type: "element",
    molarMass: 32.0,
    color: "#ccffff",
    state: "gas",
  },
  H2: {
    id: "H2",
    name: "Hydrogen",
    formula: "H₂",
    type: "element",
    molarMass: 2.02,
    color: "#ccffff",
    state: "gas",
  },
  CO2: {
    id: "CO2",
    name: "Carbon Dioxide",
    formula: "CO₂",
    type: "compound",
    molarMass: 44.01,
    color: "#ffffff",
    state: "gas",
  },
  H2O: {
    id: "H2O",
    name: "Water",
    formula: "H₂O",
    type: "compound",
    molarMass: 18.02,
    color: "#ccffff",
    state: "liquid",
    boilingPoint: 100,
  },

  // More Acids
  HBr: {
    id: "HBr",
    name: "Hydrobromic Acid",
    formula: "HBr",
    type: "acid",
    molarMass: 80.91,
    color: "#ffcccc",
    state: "liquid",
    boilingPoint: -67,
    hazard: ["corrosive"],
  },
  HF: {
    id: "HF",
    name: "Hydrofluoric Acid",
    formula: "HF",
    type: "acid",
    molarMass: 20.01,
    color: "#ffdddd",
    state: "liquid",
    boilingPoint: 19,
    hazard: ["corrosive", "toxic"],
  },
  H3PO4: {
    id: "H3PO4",
    name: "Phosphoric Acid",
    formula: "H₃PO₄",
    type: "acid",
    molarMass: 98.0,
    color: "#ffffcc",
    state: "liquid",
    boilingPoint: 213,
  },

  // More Bases
  Ca_OH_2: {
    id: "Ca_OH_2",
    name: "Calcium Hydroxide",
    formula: "Ca(OH)₂",
    type: "base",
    molarMass: 74.09,
    color: "#ccffcc",
    state: "solid",
    meltingPoint: 512,
  },
  Ba_OH_2: {
    id: "Ba_OH_2",
    name: "Barium Hydroxide",
    formula: "Ba(OH)₂",
    type: "base",
    molarMass: 171.34,
    color: "#ccffcc",
    state: "solid",
    meltingPoint: 407,
  },

  // More Salts
  CuSO4: {
    id: "CuSO4",
    name: "Copper Sulfate",
    formula: "CuSO₄",
    type: "salt",
    molarMass: 159.61,
    color: "#0099ff",
    state: "solid",
    meltingPoint: 650,
  },
  FeSO4: {
    id: "FeSO4",
    name: "Iron(II) Sulfate",
    formula: "FeSO₄",
    type: "salt",
    molarMass: 151.91,
    color: "#99ccff",
    state: "solid",
    meltingPoint: 64,
  },
  Fe2_SO4_3: {
    id: "Fe2_SO4_3",
    name: "Iron(III) Sulfate",
    formula: "Fe₂(SO₄)₃",
    type: "salt",
    molarMass: 399.88,
    color: "#ffcccc",
    state: "solid",
    meltingPoint: 480,
  },
  KMnO4: {
    id: "KMnO4",
    name: "Potassium Permanganate",
    formula: "KMnO₄",
    type: "salt",
    molarMass: 158.04,
    color: "#660066",
    state: "solid",
    meltingPoint: 240,
    hazard: ["oxidizing"],
  },
  K2Cr2O7: {
    id: "K2Cr2O7",
    name: "Potassium Dichromate",
    formula: "K₂Cr₂O₇",
    type: "salt",
    molarMass: 294.19,
    color: "#ff9900",
    state: "solid",
    meltingPoint: 398,
    hazard: ["oxidizing", "toxic"],
  },
  NaI: {
    id: "NaI",
    name: "Sodium Iodide",
    formula: "NaI",
    type: "salt",
    molarMass: 149.89,
    color: "#ffffcc",
    state: "solid",
    meltingPoint: 661,
  },
  PbNO3_2: {
    id: "PbNO3_2",
    name: "Lead(II) Nitrate",
    formula: "Pb(NO₃)₂",
    type: "salt",
    molarMass: 331.21,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 470,
    hazard: ["toxic"],
  },

  // Oxidizing Agents
  Cl2: {
    id: "Cl2",
    name: "Chlorine Gas",
    formula: "Cl₂",
    type: "element",
    molarMass: 70.9,
    color: "#ffff00",
    state: "gas",
    hazard: ["toxic", "oxidizing"],
  },
  Br2: {
    id: "Br2",
    name: "Bromine",
    formula: "Br₂",
    type: "element",
    molarMass: 159.81,
    color: "#ff6600",
    state: "liquid",
    boilingPoint: 59,
    hazard: ["toxic", "corrosive"],
  },
  I2: {
    id: "I2",
    name: "Iodine",
    formula: "I₂",
    type: "element",
    molarMass: 253.81,
    color: "#330033",
    state: "solid",
    meltingPoint: 114,
  },

  // Organic Compounds
  CH3OH: {
    id: "CH3OH",
    name: "Methanol",
    formula: "CH₃OH",
    type: "compound",
    molarMass: 32.04,
    color: "#ccffff",
    state: "liquid",
    boilingPoint: 65,
    hazard: ["toxic", "flammable"],
  },
  C2H5OH: {
    id: "C2H5OH",
    name: "Ethanol",
    formula: "C₂H₅OH",
    type: "compound",
    molarMass: 46.07,
    color: "#ccffff",
    state: "liquid",
    boilingPoint: 78,
    hazard: ["flammable"],
  },
  C6H12O6: {
    id: "C6H12O6",
    name: "Glucose",
    formula: "C₆H₁₂O₆",
    type: "compound",
    molarMass: 180.16,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 146,
  },

  // Metals
  Cu: {
    id: "Cu",
    name: "Copper",
    formula: "Cu",
    type: "element",
    molarMass: 63.55,
    color: "#ff6600",
    state: "solid",
    meltingPoint: 1085,
  },
  Zn: {
    id: "Zn",
    name: "Zinc",
    formula: "Zn",
    type: "element",
    molarMass: 65.38,
    color: "#cccccc",
    state: "solid",
    meltingPoint: 420,
  },
  Al: {
    id: "Al",
    name: "Aluminum",
    formula: "Al",
    type: "element",
    molarMass: 26.98,
    color: "#eeeeee",
    state: "solid",
    meltingPoint: 660,
  },
  Al2O3: {
    id: "Al2O3",
    name: "Aluminum Oxide",
    formula: "Al₂O₃",
    type: "oxide",
    molarMass: 101.96,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 2072,
  },
  H2O2: {
    id: "H2O2",
    name: "Hydrogen Peroxide",
    formula: "H₂O₂",
    type: "compound",
    molarMass: 34.01,
    color: "#ccffff",
    state: "liquid",
    boilingPoint: 150,
    hazard: ["oxidizing", "irritant"],
  },

  // Gases
  NH4Cl: {
    id: "NH4Cl",
    name: "Ammonium Chloride",
    formula: "NH₄Cl",
    type: "salt",
    molarMass: 53.49,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 338,
  },
  NaHCO3: {
    id: "NaHCO3",
    name: "Sodium Bicarbonate",
    formula: "NaHCO₃",
    type: "salt",
    molarMass: 84.01,
    color: "#ffffff",
    state: "solid",
    meltingPoint: 50,
  },
};

// Common reactions database
export const REACTION_DATABASE: ReactionEquation[] = [
  {
    reactants: [
      { compound: CHEMICAL_DATABASE.HCl, moles: 1 },
      { compound: CHEMICAL_DATABASE.NaOH, moles: 1 },
    ],
    products: [
      { compound: CHEMICAL_DATABASE.NaCl, moles: 1 },
      { compound: CHEMICAL_DATABASE.H2O, moles: 1 },
    ],
    equation: "HCl + NaOH → NaCl + H₂O",
    deltaH: -57.3,
    deltaS: -0.177,
    condition: "room_temp",
    visualEffects: [
      { type: "color_change", intensity: 0.5, duration: 2000, color: "#ffcccc" },
      { type: "light", intensity: 0.3, duration: 2000 },
    ],
    observations: ["Heat released (exothermic)", "pH indicator color change", "Solution becomes neutral"],
    productColor: "#ffffff",
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.Mg, moles: 1 },
      { compound: CHEMICAL_DATABASE.O2, moles: 0.5 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.MgO, moles: 1 }],
    equation: "2Mg + O₂ → 2MgO",
    deltaH: -1200,
    deltaS: -0.217,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.9, duration: 5000, color: "#ffff00" },
      { type: "light", intensity: 1, duration: 5000, color: "#ffffff" },
      { type: "smoke", intensity: 0.6, duration: 5000, color: "#cccccc" },
    ],
    observations: ["Bright white flame", "Heat released", "White product (MgO) forms", "Very hot reaction"],
    productColor: "#ffffff",
    fireIntensity: 0.9,
    smokeAmount: 0.6,
    explosiveness: 0.3,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.C, moles: 1 },
      { compound: CHEMICAL_DATABASE.O2, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.CO2, moles: 1 }],
    equation: "C + O₂ → CO₂",
    deltaH: -393,
    deltaS: 0.003,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.8, duration: 4000, color: "#ff6600" },
      { type: "smoke", intensity: 0.7, duration: 4000, color: "#999999" },
      { type: "evaporation", intensity: 0.8, duration: 4000 },
    ],
    observations: ["Orange/red flame", "Smoke produced", "Carbon dioxide gas released", "Heat released"],
    productColor: "#ffffff",
    fireIntensity: 0.8,
    smokeAmount: 0.7,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.CaCO3, moles: 1 },
      { compound: CHEMICAL_DATABASE.HCl, moles: 2 },
    ],
    products: [
      { compound: CHEMICAL_DATABASE.CuO, moles: 1 }, // placeholder for CaCl2
      { compound: CHEMICAL_DATABASE.H2O, moles: 1 },
      { compound: CHEMICAL_DATABASE.CO2, moles: 1 },
    ],
    equation: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑",
    deltaH: -15.2,
    deltaS: 0.233,
    condition: "room_temp",
    visualEffects: [
      { type: "effervescence", intensity: 0.9, duration: 3000, particle_count: 100 },
      { type: "color_change", intensity: 0.6, duration: 3000 },
    ],
    observations: ["Vigorous bubbling/fizzing", "Gas released (CO₂)", "Temperature rise", "Effervescence observed"],
    productColor: "#ffffcc",
    evaporationRate: 0.7,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.AgNO3, moles: 1 },
      { compound: CHEMICAL_DATABASE.NaCl, moles: 1 },
    ],
    products: [
      { compound: CHEMICAL_DATABASE.NaCl, moles: 1 }, // AgCl precipitate (using placeholder)
      { compound: CHEMICAL_DATABASE.NaCl, moles: 1 },
    ],
    equation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
    deltaH: -65.5,
    deltaS: -0.098,
    condition: "room_temp",
    visualEffects: [
      { type: "precipitation", intensity: 0.8, duration: 2000, color: "#ffffff" },
      { type: "color_change", intensity: 0.7, duration: 2000 },
    ],
    observations: ["White precipitate forms immediately", "Color change to white", "Silver chloride forms", "Insoluble compound"],
    productColor: "#ffffff",
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.Fe, moles: 1 },
      { compound: CHEMICAL_DATABASE.S, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.CuO, moles: 1 }], // placeholder for FeS
    equation: "Fe + S → FeS",
    deltaH: -20.1,
    deltaS: -0.100,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.6, duration: 3000, color: "#ff6600" },
      { type: "light", intensity: 0.7, duration: 3000 },
      { type: "color_change", intensity: 0.8, duration: 3000, color: "#000000" },
    ],
    observations: ["Heat required to initiate", "Black product forms", "Bright light emission", "Sparks observed"],
    productColor: "#000000",
    fireIntensity: 0.6,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.Cu, moles: 1 },
      { compound: CHEMICAL_DATABASE.O2, moles: 0.5 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.CuO, moles: 1 }],
    equation: "2Cu + O₂ → 2CuO",
    deltaH: -310,
    deltaS: -0.166,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.7, duration: 4000, color: "#ff6600" },
      { type: "color_change", intensity: 0.9, duration: 4000, color: "#000000" },
    ],
    observations: ["Red copper turns black", "Heat required", "Oxidation occurs", "Product is copper oxide"],
    productColor: "#000000",
    fireIntensity: 0.7,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.CuSO4, moles: 1 },
      { compound: CHEMICAL_DATABASE.Zn, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.Fe, moles: 1 }],
    equation: "CuSO₄ + Zn → ZnSO₄ + Cu",
    deltaH: -220,
    deltaS: 0.034,
    condition: "room_temp",
    visualEffects: [
      { type: "precipitation", intensity: 0.8, duration: 3000, color: "#ff6600" },
      { type: "color_change", intensity: 0.9, duration: 3000, color: "#ff6600" },
    ],
    observations: ["Blue solution turns colorless", "Red copper deposits form", "Displacement reaction", "Exothermic"],
    productColor: "#ff6600",
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.KMnO4, moles: 2 },
      { compound: CHEMICAL_DATABASE.H2O, moles: 3 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.MnO2, moles: 1 }],
    equation: "2KMnO₄ + 3H₂O → 2MnO₂ + ...",
    deltaH: -180,
    deltaS: -0.152,
    condition: "light",
    visualEffects: [
      { type: "color_change", intensity: 1, duration: 5000, color: "#cccccc" },
      { type: "light", intensity: 0.8, duration: 5000 },
    ],
    observations: ["Purple color fades to colorless", "Manganese dioxide precipitates", "Light-sensitive reaction", "Brown powder forms"],
    productColor: "#cccccc",
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.H2SO4, moles: 1 },
      { compound: CHEMICAL_DATABASE.C, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.CO2, moles: 1 }],
    equation: "H₂SO₄ + C → CO₂ + SO₂ + H₂O",
    deltaH: -350,
    deltaS: 0.156,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.85, duration: 4000, color: "#ff6600" },
      { type: "smoke", intensity: 0.8, duration: 4000, color: "#999999" },
      { type: "color_change", intensity: 0.9, duration: 4000, color: "#000000" },
    ],
    observations: ["Carbon turns black", "Thick smoke released", "Strong heat generation", "Charring occurs"],
    productColor: "#000000",
    fireIntensity: 0.85,
    smokeAmount: 0.8,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.H2SO4, moles: 2 },
      { compound: CHEMICAL_DATABASE.Cu, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.CuO, moles: 1 }],
    equation: "2H₂SO₄ + Cu → CuSO₄ + SO₂ + 2H₂O",
    deltaH: -360,
    deltaS: 0.110,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.75, duration: 4000, color: "#ff3300" },
      { type: "smoke", intensity: 0.9, duration: 4000, color: "#666666", particle_count: 150 },
      { type: "color_change", intensity: 0.85, duration: 4000, color: "#0099ff" },
    ],
    observations: ["Copper dissolves", "Blue solution forms", "Brown SO₂ gas produced", "Heat released", "Vigorous reaction"],
    productColor: "#0099ff",
    fireIntensity: 0.75,
    smokeAmount: 0.9,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.H3PO4, moles: 3 },
      { compound: CHEMICAL_DATABASE.NaOH, moles: 3 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.H2O, moles: 3 }],
    equation: "3NaOH + H₃PO₄ → Na₃PO₄ + 3H₂O",
    deltaH: -173,
    deltaS: -0.541,
    condition: "room_temp",
    visualEffects: [
      { type: "color_change", intensity: 0.5, duration: 3000, color: "#ccffcc" },
      { type: "light", intensity: 0.4, duration: 3000 },
    ],
    observations: ["Neutralization reaction", "Heat released", "pH becomes neutral", "Salt solution forms"],
    productColor: "#cccccc",
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.NaHCO3, moles: 1 },
      { compound: CHEMICAL_DATABASE.CH3COOH, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.H2O, moles: 1 }, { compound: CHEMICAL_DATABASE.CO2, moles: 1 }],
    equation: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑",
    deltaH: -48,
    deltaS: 0.134,
    condition: "room_temp",
    visualEffects: [
      { type: "effervescence", intensity: 0.85, duration: 4000, particle_count: 120 },
      { type: "evaporation", intensity: 0.9, duration: 4000 },
    ],
    observations: ["Vigorous fizzing", "Gas bubbles rise", "Baking soda reacts with vinegar", "Foam forms", "Endothermic (cools)"],
    productColor: "#ffffff",
    evaporationRate: 0.7,
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.I2, moles: 1 },
      { compound: CHEMICAL_DATABASE.H2, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.HBr, moles: 1 }],
    equation: "I₂ + H₂ → 2HI",
    deltaH: 53,
    deltaS: -0.167,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.5, duration: 3000, color: "#ff9900" },
      { type: "color_change", intensity: 0.8, duration: 3000, color: "#000000" },
      { type: "evaporation", intensity: 0.6, duration: 3000 },
    ],
    observations: ["Dark purple iodine", "Heat absorption", "Endothermic reaction", "Hydrogen iodide gas forms", "Reversible reaction"],
    productColor: "#000000",
  },

  {
    reactants: [
      { compound: CHEMICAL_DATABASE.Al, moles: 2 },
      { compound: CHEMICAL_DATABASE.Fe2O3, moles: 1 },
    ],
    products: [{ compound: CHEMICAL_DATABASE.Fe, moles: 1 }],
    equation: "2Al + Fe₂O₃ → 2Fe + Al₂O₃",
    deltaH: -852,
    deltaS: -0.188,
    condition: "heat",
    visualEffects: [
      { type: "flame", intensity: 0.95, duration: 6000, color: "#ffff00" },
      { type: "light", intensity: 1, duration: 6000, color: "#ffffff" },
      { type: "precipitation", intensity: 0.8, duration: 6000, color: "#ffffff" },
    ],
    observations: ["Extremely bright white flame", "Very high temperature", "Molten iron forms", "Thermite reaction", "Industrial welding"],
    productColor: "#ffffff",
    fireIntensity: 0.95,
    explosiveness: 0.5,
  },
];

// Get reaction by formula equation
export function findReactionByFormulas(reactantFormulas: string[]): ReactionEquation | null {
  return REACTION_DATABASE.find(reaction =>
    reaction.reactants.every(r =>
      reactantFormulas.includes(r.compound.formula)
    )
  ) || null;
}

// Suggest reactions based on selected compounds
export function suggestReactions(selectedCompounds: ChemicalCompound[]): ReactionEquation[] {
  return REACTION_DATABASE.filter(reaction =>
    reaction.reactants.some(r =>
      selectedCompounds.find(c => c.id === r.compound.id)
    ) &&
    reaction.reactants.length <= selectedCompounds.length
  );
}

// Calculate stoichiometry
export function calculateStoichiometry(reaction: ReactionEquation, limitingReactantMoles: number) {
  const limitingReactant = reaction.reactants[0];
  const ratio = limitingReactantMoles / limitingReactant.moles;

  return {
    reactants: reaction.reactants.map(r => ({
      ...r,
      molesUsed: r.moles * ratio,
    })),
    products: reaction.products.map(p => ({
      ...p,
      molesProduced: p.moles * ratio,
    })),
  };
}

// Pre-made reactions with full material lists
export interface PreMadeReaction {
  id: string;
  name: string;
  category: "demonstration" | "synthesis" | "separation" | "decomposition" | "explosive";
  description: string;
  materials: { compound: ChemicalCompound; amount: number; unit: string }[];
  equipment: string[];
  procedure: string[];
  expectedReaction: ReactionEquation;
  videoUrl?: string;
  safetyNotes: string[];
}

// Pre-made reaction library
export const PREMADE_REACTIONS: PreMadeReaction[] = [
  // Saponification (Soap Making)
  {
    id: "saponification",
    name: "Saponification (Soap Making)",
    category: "synthesis",
    description: "Production of soap from fats/oils and alkali. Classic chemistry reaction used industrially.",
    materials: [
      { compound: CHEMICAL_DATABASE.NaOH, amount: 20, unit: "g" },
      { compound: CHEMICAL_DATABASE.H2O, amount: 50, unit: "mL" },
      // Note: Would add fat/oil if in database
    ],
    equipment: ["Beaker", "Thermometer", "Stirring rod", "Graduated cylinder", "Hot plate"],
    procedure: [
      "Heat oil/fat to 40-50°C in beaker",
      "Prepare sodium hydroxide solution (20g NaOH + 50mL water)",
      "Slowly add NaOH solution to heated oil while stirring continuously",
      "Stir mixture for 30 minutes until saponification occurs",
      "Add salt (NaCl) solution to precipitate soap",
      "Cool mixture and separate soap layer",
      "Wash soap with cold water and dry",
    ],
    expectedReaction: {
      reactants: [
        { compound: CHEMICAL_DATABASE.NaOH, moles: 3 },
      ],
      products: [
        { compound: CHEMICAL_DATABASE.NaCl, moles: 1 },
      ],
      equation: "Fat/Oil + 3NaOH → Soap + Glycerol",
      deltaH: -85,
      deltaS: -0.120,
      condition: "heat",
      visualEffects: [
        { type: "color_change", intensity: 0.8, duration: 30000, color: "#ffcccc" },
        { type: "effervescence", intensity: 0.4, duration: 30000 },
      ],
      observations: [
        "Mixture becomes creamy",
        "Temperature rises gradually",
        "Soap forms at surface",
        "Distinct phases separate",
      ],
      productColor: "#ffcccc",
    },
    safetyNotes: [
      "NaOH is caustic - handle with care",
      "Wear gloves and eye protection",
      "Do not inhale vapors",
    ],
  },

  // NaCl Separation (Electrolysis)
  {
    id: "nacl_separation",
    name: "Sodium Chloride Separation (Electrolysis)",
    category: "separation",
    description: "Electrolysis of NaCl solution to produce Cl₂, H₂, and NaOH.",
    materials: [
      { compound: CHEMICAL_DATABASE.NaCl, amount: 50, unit: "g" },
      { compound: CHEMICAL_DATABASE.H2O, amount: 200, unit: "mL" },
    ],
    equipment: ["Electrolysis cell", "Power supply", "Electrodes", "Beaker", "Test tubes"],
    procedure: [
      "Dissolve 50g NaCl in 200mL water",
      "Place electrodes in solution",
      "Connect to DC power supply (12V)",
      "Observe gas evolution at electrodes",
      "Test gases with burning splint",
      "Monitor pH change over time",
      "Continue until color change observed",
    ],
    expectedReaction: {
      reactants: [
        { compound: CHEMICAL_DATABASE.NaCl, moles: 1 },
        { compound: CHEMICAL_DATABASE.H2O, moles: 1 },
      ],
      products: [
        { compound: CHEMICAL_DATABASE.Cl2, moles: 1 },
        { compound: CHEMICAL_DATABASE.H2, moles: 0.5 },
        { compound: CHEMICAL_DATABASE.NaOH, moles: 1 },
      ],
      equation: "2NaCl + 2H₂O → Cl₂ + H₂ + 2NaOH (electrolysis)",
      deltaH: 400, // Endothermic - requires electrical energy
      deltaS: 0.250,
      condition: "catalyst",
      visualEffects: [
        { type: "effervescence", intensity: 0.9, duration: 30000, color: "#ffff00" },
        { type: "color_change", intensity: 0.7, duration: 30000, color: "#ccffcc" },
        { type: "light", intensity: 0.5, duration: 30000 },
      ],
      observations: [
        "Bubbles at both electrodes",
        "Solution becomes basic (alkaline)",
        "Chlorine gas (yellow-green) produced",
        "Hydrogen gas (colorless) produced",
      ],
      productColor: "#ffff00",
    },
    safetyNotes: [
      "Chlorine gas is toxic - ensure good ventilation",
      "Do not inhale chlorine gas",
      "Wear goggles and gloves",
    ],
  },

  // Thermite Reaction (Explosive)
  {
    id: "thermite_reaction",
    name: "Thermite Reaction (Fe₂O₃ + Al)",
    category: "explosive",
    description: "Highly exothermic reaction producing molten iron. Dangerous - demonstration only!",
    materials: [
      { compound: CHEMICAL_DATABASE.Fe2O3, amount: 60, unit: "g" },
      { compound: CHEMICAL_DATABASE.Al, amount: 15, unit: "g" },
    ],
    equipment: ["Crucible", "Thermite mixture", "Fuse", "Protective barriers"],
    procedure: [
      "Mix Fe₂O₃ powder and aluminum powder in 8:3 ratio",
      "Place mixture in refractory crucible",
      "Insert fuse carefully",
      "Ensure all spectators behind barrier",
      "Ignite and observe from safe distance",
      "Allow to cool completely before handling",
    ],
    expectedReaction: {
      reactants: [
        { compound: CHEMICAL_DATABASE.Fe2O3, moles: 1 },
        { compound: CHEMICAL_DATABASE.Al, moles: 2 },
      ],
      products: [
        { compound: CHEMICAL_DATABASE.Fe, moles: 2 },
        { compound: CHEMICAL_DATABASE.Al2O3, moles: 1 },
      ],
      equation: "Fe₂O₃ + 2Al → 2Fe + Al₂O₃",
      deltaH: -3400, // Extremely exothermic
      deltaS: -0.180,
      condition: "heat",
      visualEffects: [
        { type: "flame", intensity: 1.0, duration: 5000, color: "#ffff00" },
        { type: "light", intensity: 1.0, duration: 5000 },
        { type: "color_change", intensity: 1.0, duration: 5000, color: "#ff6600" },
      ],
      observations: [
        "Brilliant white light",
        "Sparks fly dramatically",
        "Molten metal produced (2000°C+)",
        "Container may rupture",
      ],
      productColor: "#ff6600",
      fireIntensity: 1.0,
      smokeAmount: 0.7,
      canExplode: true,
      explosionIntensity: 0.9,
      explosionRadius: 5,
    },
    safetyNotes: [
      "EXTREME HAZARD - Professional use only",
      "Everyone must be behind barrier",
      "Wear full protective gear",
      "Never perform indoors",
      "Molten metal is extremely dangerous",
    ],
  },

  // Hydrogen Peroxide Decomposition (with catalyst)
  {
    id: "h2o2_decomposition",
    name: "Hydrogen Peroxide Decomposition (Elephant Toothpaste)",
    category: "demonstration",
    description: "Catalytic decomposition of H₂O₂ produces foam due to rapid O₂ evolution.",
    materials: [
      { compound: CHEMICAL_DATABASE.H2O2, amount: 200, unit: "mL" },
      { compound: CHEMICAL_DATABASE.MnO2, amount: 5, unit: "g" },
    ],
    equipment: ["Beaker", "Graduated cylinder", "Catalyst powder", "Thermometer"],
    procedure: [
      "Place 200mL 30% H₂O₂ in beaker",
      "Add food coloring if desired",
      "Add MnO₂ catalyst (5g)",
      "Observe rapid foam formation",
      "Measure temperature change",
      "Test evolved gas with burning splint",
    ],
    expectedReaction: {
      reactants: [
        { compound: CHEMICAL_DATABASE.H2O2, moles: 2 },
      ],
      products: [
        { compound: CHEMICAL_DATABASE.H2O, moles: 2 },
        { compound: CHEMICAL_DATABASE.O2, moles: 1 },
      ],
      equation: "2H₂O₂ → 2H₂O + O₂ (MnO₂ catalyst)",
      deltaH: -98,
      deltaS: 0.173,
      condition: "catalyst",
      visualEffects: [
        { type: "effervescence", intensity: 1.0, duration: 10000, particle_count: 500 },
        { type: "color_change", intensity: 0.5, duration: 10000 },
      ],
      observations: [
        "Rapid foam eruption",
        "White foam fills container",
        "Temperature increases",
        "Strong oxidizing smell",
      ],
      productColor: "#ffffff",
      smokeAmount: 0.2,
    },
    safetyNotes: [
      "H₂O₂ can cause irritation",
      "Avoid contact with eyes",
      "Use appropriate concentration (30%)",
    ],
  },

  // Combustion Reaction
  {
    id: "methanol_combustion",
    name: "Methanol Combustion (Blue Flame)",
    category: "demonstration",
    description: "Controlled combustion of methanol with clean blue flame.",
    materials: [
      { compound: CHEMICAL_DATABASE.CH3OH, amount: 50, unit: "mL" },
      { compound: CHEMICAL_DATABASE.O2, amount: 1000, unit: "mL" },
    ],
    equipment: ["Alcohol lamp", "Matches", "Beaker", "Thermometer"],
    procedure: [
      "Pour 50mL methanol into beaker",
      "Light with match",
      "Observe blue flame",
      "Measure heat output with thermometer",
      "Identify products (CO₂, H₂O)",
      "Observe soot formation (if incomplete)",
    ],
    expectedReaction: {
      reactants: [
        { compound: CHEMICAL_DATABASE.CH3OH, moles: 1 },
        { compound: CHEMICAL_DATABASE.O2, moles: 1.5 },
      ],
      products: [
        { compound: CHEMICAL_DATABASE.CO2, moles: 1 },
        { compound: CHEMICAL_DATABASE.H2O, moles: 2 },
      ],
      equation: "2CH₃OH + 3O₂ → 2CO₂ + 4H₂O",
      deltaH: -1452,
      deltaS: 0.186,
      condition: "heat",
      visualEffects: [
        { type: "flame", intensity: 0.9, duration: 10000, color: "#0099ff" },
        { type: "light", intensity: 0.8, duration: 10000 },
      ],
      observations: [
        "Clean blue flame",
        "Heat production",
        "No visible smoke",
        "Complete combustion",
      ],
      productColor: "#0099ff",
      fireIntensity: 0.9,
    },
    safetyNotes: [
      "Methanol is flammable and toxic",
      "Do not inhale fumes",
      "Keep away from open flames until ready",
      "Use fume hood if available",
    ],
  },
];

// Material connection visualization data
export interface MaterialConnection {
  from: string; // Chemical ID
  to: string; // Chemical ID  
  type: "input" | "output" | "catalyst";
  ratio: number;
  label: string;
}

// Get connections for a reaction
export function getReactionConnections(reaction: ReactionEquation): MaterialConnection[] {
  const connections: MaterialConnection[] = [];

  reaction.reactants.forEach((r) => {
    reaction.products.forEach((p) => {
      connections.push({
        from: r.compound.id,
        to: p.compound.id,
        type: "input",
        ratio: p.moles / r.moles,
        label: `${r.moles}:${p.moles}`,
      });
    });
  });

  return connections;
}

// Check if reaction can explode
export function canReactionExplode(reaction: ReactionEquation): boolean {
  return reaction.canExplode === true || (reaction.explosiveness ?? 0) > 0.7;
}

// Get explosion parameters
export function getExplosionParams(reaction: ReactionEquation) {
  return {
    canExplode: canReactionExplode(reaction),
    intensity: reaction.explosionIntensity ?? 0,
    radius: reaction.explosionRadius ?? 2,
    fireIntensity: reaction.fireIntensity ?? 0,
    smokeAmount: reaction.smokeAmount ?? 0,
  };
}
