/**
 * Biology Laboratory Materials Database
 * Complete inventory of materials used in biological experiments
 */

export interface Material {
  id: string;
  name: string;
  category: "chemical" | "equipment" | "culture" | "sample" | "stain" | "consumable";
  quantity: number;
  unit: string;
  hazard?: string[];
  storageTemp?: number; // Celsius
  expiry?: string;
  description?: string;
  color?: string;
}

export interface MaterialSet {
  processId: string;
  materials: Material[];
  totalCost?: number;
}

// Complete materials database for biology lab
export const BIOLOGY_MATERIALS: Record<string, Material> = {
  // Chemicals
  NaOH: {
    id: "NaOH",
    name: "Sodium Hydroxide (NaOH)",
    category: "chemical",
    quantity: 500,
    unit: "g",
    hazard: ["corrosive", "toxic"],
    storageTemp: 20,
    description: "Strong base used in cell lysis",
  },
  HCl: {
    id: "HCl",
    name: "Hydrochloric Acid (HCl)",
    category: "chemical",
    quantity: 1000,
    unit: "mL",
    hazard: ["corrosive", "toxic"],
    storageTemp: 20,
    description: "Strong acid used in DNA extraction and staining",
  },
  Ethanol: {
    id: "Ethanol",
    name: "Ethanol (95%)",
    category: "chemical",
    quantity: 2000,
    unit: "mL",
    hazard: ["flammable", "toxic"],
    storageTemp: 4,
    description: "Used for DNA precipitation and preservation",
  },
  Acetone: {
    id: "Acetone",
    name: "Acetone",
    category: "chemical",
    quantity: 1000,
    unit: "mL",
    hazard: ["flammable"],
    storageTemp: 20,
    description: "Used for cleaning and extraction",
  },
  Methylene_Blue: {
    id: "Methylene_Blue",
    name: "Methylene Blue Stain",
    category: "stain",
    quantity: 100,
    unit: "mL",
    storageTemp: 20,
    description: "Cellular stain for microscopy",
    color: "#0066cc",
  },
  Iodine_Solution: {
    id: "Iodine_Solution",
    name: "Iodine Solution",
    category: "stain",
    quantity: 500,
    unit: "mL",
    hazard: ["toxic"],
    storageTemp: 20,
    description: "Starch indicator, also used for staining",
    color: "#663300",
  },
  Malachite_Green: {
    id: "Malachite_Green",
    name: "Malachite Green Stain",
    category: "stain",
    quantity: 50,
    unit: "mL",
    storageTemp: 20,
    description: "Spore staining",
    color: "#00cc66",
  },
  Crystal_Violet: {
    id: "Crystal_Violet",
    name: "Crystal Violet",
    category: "stain",
    quantity: 50,
    unit: "mL",
    storageTemp: 20,
    description: "Gram staining",
    color: "#9900cc",
  },

  // Culture Media
  LB_Broth: {
    id: "LB_Broth",
    name: "Luria-Bertani (LB) Broth",
    category: "culture",
    quantity: 5,
    unit: "L",
    storageTemp: 20,
    description: "Bacterial growth medium",
  },
  LB_Agar: {
    id: "LB_Agar",
    name: "LB Agar Plates",
    category: "culture",
    quantity: 50,
    unit: "plates",
    storageTemp: 4,
    description: "Solid bacterial growth medium",
  },
  Glucose_Solution: {
    id: "Glucose_Solution",
    name: "Glucose Solution (1M)",
    category: "chemical",
    quantity: 1000,
    unit: "mL",
    storageTemp: 4,
    description: "Substrate for enzyme and respiration experiments",
  },
  Saline_Solution: {
    id: "Saline_Solution",
    name: "Normal Saline (0.9% NaCl)",
    category: "chemical",
    quantity: 2000,
    unit: "mL",
    storageTemp: 20,
    description: "Osmotic solution for osmosis experiments",
  },
  Sucrose_Solution: {
    id: "Sucrose_Solution",
    name: "Sucrose Solution (1M)",
    category: "chemical",
    quantity: 1000,
    unit: "mL",
    storageTemp: 4,
    description: "Hypertonic solution for osmosis",
  },

  // Enzymes
  Amylase: {
    id: "Amylase",
    name: "Amylase Enzyme",
    category: "chemical",
    quantity: 100,
    unit: "U/mL",
    storageTemp: -20,
    description: "Starch-degrading enzyme",
  },
  Protease: {
    id: "Protease",
    name: "Protease Enzyme",
    category: "chemical",
    quantity: 100,
    unit: "U/mL",
    storageTemp: -20,
    description: "Protein-degrading enzyme",
  },
  Lysozyme: {
    id: "Lysozyme",
    name: "Lysozyme",
    category: "chemical",
    quantity: 50,
    unit: "mg",
    storageTemp: -20,
    description: "Cell wall degrading enzyme",
  },

  // Samples & Cultures
  Ecoli: {
    id: "Ecoli",
    name: "E. coli Culture",
    category: "sample",
    quantity: 100,
    unit: "mL",
    storageTemp: 4,
    description: "Standard laboratory bacteria",
  },
  Yeast_Culture: {
    id: "Yeast_Culture",
    name: "Baker's Yeast Culture",
    category: "sample",
    quantity: 50,
    unit: "g",
    storageTemp: 4,
    description: "For fermentation experiments",
  },
  Spinach_Leaves: {
    id: "Spinach_Leaves",
    name: "Fresh Spinach Leaves",
    category: "sample",
    quantity: 500,
    unit: "g",
    storageTemp: 4,
    description: "For photosynthesis experiments",
  },
  Onion_Root: {
    id: "Onion_Root",
    name: "Onion Root Tips",
    category: "sample",
    quantity: 20,
    unit: "root tips",
    storageTemp: 20,
    description: "For mitosis observation",
  },
  Strawberry: {
    id: "Strawberry",
    name: "Strawberry Tissue",
    category: "sample",
    quantity: 500,
    unit: "g",
    storageTemp: 4,
    description: "For DNA extraction",
  },

  // Equipment
  Microscope: {
    id: "Microscope",
    name: "Compound Microscope",
    category: "equipment",
    quantity: 1,
    unit: "unit",
    description: "Magnification: 40x - 1000x",
  },
  Microscope_Slides: {
    id: "Microscope_Slides",
    name: "Glass Microscope Slides",
    category: "equipment",
    quantity: 100,
    unit: "slides",
    description: "Standard 75 × 25 mm",
  },
  Cover_Slips: {
    id: "Cover_Slips",
    name: "Glass Cover Slips",
    category: "equipment",
    quantity: 500,
    unit: "slips",
    description: "Size: 22 × 22 mm",
  },
  Petri_Dishes: {
    id: "Petri_Dishes",
    name: "Petri Dishes",
    category: "equipment",
    quantity: 100,
    unit: "dishes",
    storageTemp: 20,
    description: "90 mm diameter",
  },
  Test_Tubes: {
    id: "Test_Tubes",
    name: "Glass Test Tubes",
    category: "equipment",
    quantity: 50,
    unit: "tubes",
    description: "16 × 100 mm",
  },
  Beakers: {
    id: "Beakers",
    name: "Glass Beakers",
    category: "equipment",
    quantity: 20,
    unit: "beakers",
    description: "Assorted sizes (50mL - 500mL)",
  },
  Flasks: {
    id: "Flasks",
    name: "Erlenmeyer Flasks",
    category: "equipment",
    quantity: 15,
    unit: "flasks",
    description: "250 mL and 500 mL",
  },
  Graduated_Cylinders: {
    id: "Graduated_Cylinders",
    name: "Graduated Cylinders",
    category: "equipment",
    quantity: 10,
    unit: "cylinders",
    description: "10mL to 1000mL",
  },
  Pipettes: {
    id: "Pipettes",
    name: "Graduated Pipettes",
    category: "equipment",
    quantity: 50,
    unit: "pipettes",
    description: "1mL, 5mL, 10mL",
  },
  Pipette_Tips: {
    id: "Pipette_Tips",
    name: "Sterile Pipette Tips",
    category: "consumable",
    quantity: 5000,
    unit: "tips",
    description: "Sterile, RNase/DNase free",
  },
  Thermometer: {
    id: "Thermometer",
    name: "Lab Thermometer",
    category: "equipment",
    quantity: 5,
    unit: "thermometers",
    description: "-10°C to 110°C",
  },
  pH_Meter: {
    id: "pH_Meter",
    name: "Digital pH Meter",
    category: "equipment",
    quantity: 2,
    unit: "meters",
    description: "Range: 0-14 pH",
  },
  Spectrophotometer: {
    id: "Spectrophotometer",
    name: "UV-Vis Spectrophotometer",
    category: "equipment",
    quantity: 1,
    unit: "unit",
    description: "Wavelength: 200-1000 nm",
  },
  Incubator: {
    id: "Incubator",
    name: "Microbial Incubator",
    category: "equipment",
    quantity: 2,
    unit: "units",
    description: "Temperature control 5-65°C",
  },
  Centrifuge: {
    id: "Centrifuge",
    name: "Tabletop Centrifuge",
    category: "equipment",
    quantity: 1,
    unit: "unit",
    description: "Max speed: 15,000 rpm",
  },
  Dialysis_Bags: {
    id: "Dialysis_Bags",
    name: "Dialysis Bags",
    category: "consumable",
    quantity: 20,
    unit: "bags",
    description: "MWCO 6000-8000 Da",
  },

  // Consumables
  Tissue_Paper: {
    id: "Tissue_Paper",
    name: "Laboratory Tissue Paper",
    category: "consumable",
    quantity: 10,
    unit: "boxes",
    description: "For cleaning",
  },
  Gloves: {
    id: "Gloves",
    name: "Nitrile Gloves",
    category: "consumable",
    quantity: 1000,
    unit: "pairs",
    description: "Powder-free",
  },
  Lab_Coat: {
    id: "Lab_Coat",
    name: "Lab Coat",
    category: "consumable",
    quantity: 5,
    unit: "coats",
    description: "White, size L",
  },
  Safety_Glasses: {
    id: "Safety_Glasses",
    name: "Safety Glasses",
    category: "consumable",
    quantity: 10,
    unit: "glasses",
    description: "UV protection",
  },
  Petri_Dish_Labels: {
    id: "Petri_Dish_Labels",
    name: "Autoclave Labels",
    category: "consumable",
    quantity: 500,
    unit: "labels",
    description: "Heat-resistant",
  },
};

// Material sets for each process
export const MATERIAL_SETS: Record<string, MaterialSet> = {
  photosynthesis: {
    processId: "photosynthesis",
    materials: [
      BIOLOGY_MATERIALS.Spinach_Leaves,
      BIOLOGY_MATERIALS.Graduated_Cylinders,
      BIOLOGY_MATERIALS.Beakers,
      BIOLOGY_MATERIALS.Microscope,
      BIOLOGY_MATERIALS.Microscope_Slides,
      BIOLOGY_MATERIALS.Thermometer,
    ],
  },
  aerobic_respiration: {
    processId: "aerobic_respiration",
    materials: [
      BIOLOGY_MATERIALS.Yeast_Culture,
      BIOLOGY_MATERIALS.Glucose_Solution,
      BIOLOGY_MATERIALS.Test_Tubes,
      BIOLOGY_MATERIALS.Thermometer,
      BIOLOGY_MATERIALS.pH_Meter,
    ],
  },
  anaerobic_fermentation: {
    processId: "anaerobic_fermentation",
    materials: [
      BIOLOGY_MATERIALS.Yeast_Culture,
      BIOLOGY_MATERIALS.Glucose_Solution,
      BIOLOGY_MATERIALS.Flasks,
      BIOLOGY_MATERIALS.Graduated_Cylinders,
      BIOLOGY_MATERIALS.Thermometer,
    ],
  },
  enzyme_catalysis: {
    processId: "enzyme_catalysis",
    materials: [
      BIOLOGY_MATERIALS.Amylase,
      BIOLOGY_MATERIALS.Glucose_Solution,
      BIOLOGY_MATERIALS.Iodine_Solution,
      BIOLOGY_MATERIALS.Test_Tubes,
      BIOLOGY_MATERIALS.Thermometer,
      BIOLOGY_MATERIALS.Spectrophotometer,
    ],
  },
  mitosis_cell_division: {
    processId: "mitosis_cell_division",
    materials: [
      BIOLOGY_MATERIALS.Onion_Root,
      BIOLOGY_MATERIALS.HCl,
      BIOLOGY_MATERIALS.Methylene_Blue,
      BIOLOGY_MATERIALS.Microscope,
      BIOLOGY_MATERIALS.Microscope_Slides,
      BIOLOGY_MATERIALS.Cover_Slips,
    ],
  },
  dna_extraction: {
    processId: "dna_extraction",
    materials: [
      BIOLOGY_MATERIALS.Strawberry,
      BIOLOGY_MATERIALS.NaOH,
      BIOLOGY_MATERIALS.Ethanol,
      BIOLOGY_MATERIALS.Saline_Solution,
      BIOLOGY_MATERIALS.Test_Tubes,
      BIOLOGY_MATERIALS.Graduated_Cylinders,
    ],
  },
  bacterial_growth: {
    processId: "bacterial_growth",
    materials: [
      BIOLOGY_MATERIALS.Ecoli,
      BIOLOGY_MATERIALS.LB_Broth,
      BIOLOGY_MATERIALS.LB_Agar,
      BIOLOGY_MATERIALS.Petri_Dishes,
      BIOLOGY_MATERIALS.Incubator,
      BIOLOGY_MATERIALS.Spectrophotometer,
    ],
  },
  osmosis_diffusion: {
    processId: "osmosis_diffusion",
    materials: [
      BIOLOGY_MATERIALS.Dialysis_Bags,
      BIOLOGY_MATERIALS.Sucrose_Solution,
      BIOLOGY_MATERIALS.Saline_Solution,
      BIOLOGY_MATERIALS.Graduated_Cylinders,
      BIOLOGY_MATERIALS.Beakers,
    ],
  },
  protein_synthesis: {
    processId: "protein_synthesis",
    materials: [
      BIOLOGY_MATERIALS.Test_Tubes,
      BIOLOGY_MATERIALS.Glucose_Solution,
      BIOLOGY_MATERIALS.Beakers,
      BIOLOGY_MATERIALS.Thermometer,
      BIOLOGY_MATERIALS.Graduated_Cylinders,
    ],
  },
};

// Helper functions
export function getMaterialsByProcess(processId: string): Material[] {
  return MATERIAL_SETS[processId]?.materials || [];
}

export function checkMaterialAvailability(material: Material): boolean {
  return material.quantity > 0;
}

export function updateMaterialQuantity(material: Material, used: number): Material {
  return {
    ...material,
    quantity: Math.max(0, material.quantity - used),
  };
}

export function getMaterialsByCategory(category: string): Material[] {
  return Object.values(BIOLOGY_MATERIALS).filter(m => m.category === category);
}

export function calculateTotalMaterials(): number {
  return Object.values(BIOLOGY_MATERIALS).reduce((sum, m) => sum + m.quantity, 0);
}
