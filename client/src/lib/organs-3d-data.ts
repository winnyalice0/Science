// Define 3D organ/material content with categories
export interface Organ3D {
  id: string;
  name: string;
  category: "Biology" | "Chemistry" | "Laboratory Materials";
  description: string;
  thumbnail: string;
  model: string; // Sketchfab embed code or model URL
  modelType: "sketchfab" | "iframe" | "html"; // Type of 3D model
  fullDescription: string;
  learningPoints: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  credit?: string; // Attribution for Sketchfab models
}

export const organs3DData: Organ3D[] = [
        // Biology - Organs
    {
  id: "lab-prokaryoticcell",
  name: "Prokaryotic Cell",
  category: "Biology",
  description: "3D model of a typical prokaryotic cell",
  thumbnail: "https://i.pinimg.com/736x/6d/b9/27/6db927c0b5c23de01bbe23f846845e14.jpg",
  model: "https://sketchfab.com/models/82bc1082b3a741749a5edac388b43478/embed", 
  modelType: "sketchfab",
  fullDescription:
    "A prokaryotic cell is a simple, single-celled organism that lacks a true nucleus and membrane-bound organelles. It includes bacteria and archaea. Genetic material is contained in a nucleoid, and it may have structures like a cell wall, plasma membrane, ribosomes, and sometimes flagella or pili for movement and attachment.",
  learningPoints: [
    "Nucleoid and DNA storage",
    "Cell wall structure and function",
    "Plasma membrane and transport",
    "Ribosomes and protein synthesis",
    "Flagella and movement",
    "Pili and attachment to surfaces",
    "Differences from eukaryotic cells",
  ],
  difficulty: "Beginner",
  credit: "Prokaryotic Cell Model on Sketchfab",
},
{
  id: "lab-eukaryoticcell",
  name: "Eukaryotic Cell",
  category: "Biology",
  description: "3D model of a typical eukaryotic cell",
  thumbnail: "https://i.pinimg.com/736x/66/11/3b/66113b9c72215fe7d51eeaf2bf45c405.jpg",
  model: "https://sketchfab.com/models/f258c65762e5435c9d58c1aa136b557a/embed", 
  modelType: "sketchfab",
  fullDescription:
    "A eukaryotic cell is a complex cell type found in plants, animals, fungi, and protists. It has a true nucleus enclosed by a nuclear membrane and various membrane-bound organelles such as mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, and, in plants, a cell wall and chloroplasts.",
  learningPoints: [
    "Nucleus and DNA storage",
    "Mitochondria and energy production",
    "Endoplasmic reticulum and protein/lipid synthesis",
    "Golgi apparatus and packaging molecules",
    "Lysosomes and waste breakdown",
    "Chloroplasts and photosynthesis (in plant cells)",
    "Cell wall structure (in plant cells)",
    "Vacuoles for storage",
  ],
  difficulty: "Beginner",
  credit: "Eukaryotic Cell Model on Sketchfab",
   },

     {
  id: "lab-plantcell",
   name: "Plant Cell",
  category: "Biology",
  description: "3D model of a typical plant cell",
  thumbnail: "https://i.pinimg.com/736x/0e/53/56/0e53563acb05b731f1fbb5445977e8d6.jpg",
  model: "https://sketchfab.com/models/06c34533b4f441569bfa207aff7c8a19/embed", 
  modelType: "sketchfab",
  fullDescription:
    "A plant cell is the basic structural and functional unit of plants. It has a rigid cell wall, chloroplasts for photosynthesis, a large central vacuole, and other organelles such as the nucleus, mitochondria, and endoplasmic reticulum.",
  learningPoints: [
    "Cell wall structure and function",
    "Chloroplasts and photosynthesis",
    "Vacuole and storage",
    "Nucleus and genetic material",
    "Other organelles and their roles",
  ],
  difficulty: "Beginner",
  credit: "Plant Cell Model on Sketchfab",
},
 
  {
    id: "bio-heart",
    name: "Human Heart",
    category: "Biology",
    description: "The pumping organ of the circulatory system",
    thumbnail: "https://i.pinimg.com/1200x/8f/8a/f5/8f8af5fb4c64ad83f130d2777868a787.jpg",
    model: "https://sketchfab.com/models/1b7bfb07e6b24dd891099395ed98e989/embed",
    modelType: "sketchfab",
    fullDescription:
      "The heart is a muscular organ about the size of a closed fist that functions as the pump within the circulatory system. It pumps blood through the circulatory system continuously.",
    learningPoints: [
      "Cardiac chambers and valves",
      "Blood flow through the heart",
      "Electrical conduction system",
      "Heart sounds and pulses",
    ],
    difficulty: "Intermediate",
    credit: "Human Heart Anatomy Labeled by srikanthsamba on Sketchfab",
  },
  {
    id: "bio-brain",
    name: "Human Brain",
    category: "Biology",
    description: "The control center of the nervous system",
    thumbnail: "https://i.pinimg.com/736x/5c/0e/6b/5c0e6b8dc8e710692da97458a8cd903c.jpg",
    model: "https://sketchfab.com/models/720038f031074c1fa150ea364deb2b59/embed",
    modelType: "sketchfab",
    fullDescription:
      "The brain is the primary control center for the body. It receives sensory information from the body and transmits motor signals to the muscles.",
    learningPoints: [
      "Major brain regions",
      "Cerebral hemispheres",
      "Brain stem and cerebellum",
      "Neurological functions",
    ],
    difficulty: "Intermediate",
    credit: "3D Brain Model on Sketchfab",
  },
  {
    id: "bio-lungs",
    name: "Human Lungs",
    category: "Biology",
    description: "Organs responsible for gas exchange",
    thumbnail: "https://i.pinimg.com/736x/b3/18/f9/b318f9e12012c590f4b20eee5bebf7dd.jpg",
    model: "https://sketchfab.com/models/50c877863fe64d11a55044afb79f5664/embed",
    modelType: "sketchfab",
    fullDescription:
      "The lungs are respiratory organs in air-breathing animals that serve the function of gas exchange. They absorb oxygen and expel carbon dioxide.",
    learningPoints: [
      "Alveoli and gas exchange",
      "Bronchial system",
      "Pulmonary circulation",
      "Breathing mechanics",
    ],
    difficulty: "Intermediate",
    credit: "Lungs Model on Sketchfab",
  },
  {
    id: "bio-liver",
    name: "Human Liver",
    category: "Biology",
    description: "The body's chemical processing center",
    thumbnail: "https://i.pinimg.com/1200x/32/40/84/32408426fea752f51ab2f3970b4a7198.jpg",
    model: "https://sketchfab.com/models/a20686a3e4a54792bfede17ad32f4b1a/embed",
    modelType: "sketchfab",
    fullDescription:
      "The liver is a vital organ that serves multiple functions including detoxification, protein synthesis, and production of biochemicals necessary for digestion.",
    learningPoints: [
      "Hepatic lobes",
      "Metabolic functions",
      "Bile production",
      "Detoxification",
    ],
    difficulty: "Advanced",
    credit: "Liver Model on Sketchfab",
  },
  {
    id: "bio-kidney",
    name: "Human Kidney",
    category: "Biology",
    description: "Organs that filter waste from the blood",
    thumbnail: "https://i.pinimg.com/1200x/e4/d5/f7/e4d5f7b1d4f3996eaeb0e29e14c33b76.jpg",
    model: "https://sketchfab.com/models/e07e67249f8a4e8ea4861153e9fd3501/embed",
    modelType: "sketchfab",
    fullDescription:
      "Kidneys are bean-shaped organs that filter blood to remove waste and form urine. They play a crucial role in maintaining electrolyte balance.",
    learningPoints: [
      "Nephron structure",
      "Filtration process",
      "Waste elimination",
      "Fluid regulation",
    ],
    difficulty: "Advanced",
    credit: "Kidney Model on Sketchfab",
  },
  {
    id: "bio-dna",
    name: "DNA Molecule",
    category: "Biology",
    description: "The molecular basis of heredity",
    thumbnail: "https://i.pinimg.com/736x/94/6d/a9/946da9ae16b7d98b8887b0383d060b77.jpg",
    model: "https://sketchfab.com/models/9ecd1c4f32904ba4acbceef2e615554a/embed",
    modelType: "sketchfab",
    fullDescription:
      "Deoxyribonucleic acid (DNA) is a molecule that carries genetic instructions for life. It consists of two intertwined strands forming a double helix.",
    learningPoints: [
      "Double helix structure",
      "Base pairing rules",
      "Nucleotide composition",
      "Gene expression",
    ],
    difficulty: "Intermediate",
    credit: "DNA Model on Sketchfab",
  },

  // Chemistry - Molecules and Compounds
  {
    id: "chem-water",
    name: "Water Molecule",
    category: "Chemistry",
    description: "The universal solvent and essential compound",
    thumbnail: "https://i.pinimg.com/736x/b1/75/ca/b175ca9d5be3bed43a54a9f2789dbbf4.jpg",
    model: "https://sketchfab.com/models/960db05560484053b1c7f565b16b6c7d/embed",
    modelType: "sketchfab",
    fullDescription:
      "Water (H2O) is a polar molecule that is essential for life. It has unique properties including high specific heat capacity and the ability to dissolve many substances.",
    learningPoints: [
      "Covalent bonding",
      "Polar molecule properties",
      "Hydrogen bonding",
      "Solvent properties",
    ],
    difficulty: "Beginner",
    credit: "Water Molecule Model on Sketchfab",
  },
  {
    id: "chem-glucose",
    name: "Glucose Molecule",
    category: "Chemistry",
    description: "A simple sugar and primary energy source",
    thumbnail: "https://i.pinimg.com/736x/9d/1a/a3/9d1aa3efebe48b7c2039bb78c8884d71.jpg",
    model: "https://sketchfab.com/models/240a13d47b0a47b5b506cda04efee770/embed",
    modelType: "sketchfab",
    fullDescription:
      "Glucose is a simple carbohydrate and the most important simple sugar. It is a primary source of energy for cells and is used in cellular respiration.",
    learningPoints: [
      "Carbohydrate structure",
      "Monosaccharide properties",
      "Energy metabolism",
      "Glycemic index",
    ],
    difficulty: "Intermediate",
    credit: "Glucose Model on Sketchfab",
  },
  {
    id: "chem-protein",
    name: "Protein Structure",
    category: "Chemistry",
    description: "Complex molecules made from amino acids",
    thumbnail: "https://i.pinimg.com/1200x/ec/2e/0b/ec2e0b8af17417048cbb124129b3ee1e.jpg",
    model: "https://sketchfab.com/models/9f71a8c0c1ed4b0895631956d4ddaaa5/embed",
    modelType: "sketchfab",
    fullDescription:
      "Proteins are large biomolecules made up of amino acids linked together. They perform numerous functions including enzyme catalysis and structural support.",
    learningPoints: [
      "Primary structure (amino acid sequence)",
      "Secondary structure (alpha helices and beta sheets)",
      "Tertiary and quaternary structures",
      "Protein folding",
    ],
    difficulty: "Advanced",
    credit: "Protein Model on Sketchfab",
  },
  {
    id: "chem-nacl",
    name: "Sodium Chloride (Salt)",
    category: "Chemistry",
    description: "Common ionic compound",
    thumbnail: "https://i.pinimg.com/736x/3f/ba/35/3fba3525dc96e5311163dbb6d6ae88bc.jpg",
    model: "https://sketchfab.com/models/b2cfd5f87d4848bc80c64981ee36d1dc/embed",
    modelType: "sketchfab",
    fullDescription:
      "Sodium chloride (NaCl) is an ionic compound composed of sodium and chlorine ions. It is commonly known as table salt and is essential for physiological functions.",
    learningPoints: [
      "Ionic bonding",
      "Crystal lattice structure",
      "Dissociation in water",
      "Electrolyte properties",
    ],
    difficulty: "Beginner",
    credit: "Salt Model on Sketchfab",
  },
  {
    id: "chem-atp",
    name: "ATP (Adenosine Triphosphate)",
    category: "Chemistry",
    description: "The energy currency of cells",
    thumbnail: "https://i.pinimg.com/736x/fb/32/3b/fb323b3bcc1f90ffa2908821468e7d1b.jpg",
    model: "https://sketchfab.com/models/c57e3245be264e97a25d96ae9aa7c8ba/embed",
    modelType: "sketchfab",
    fullDescription:
      "Adenosine triphosphate (ATP) is a nucleotide that transports chemical energy within cells. It is often referred to as the energy currency of the cell.",
    learningPoints: [
      "Nucleotide structure",
      "Phosphate bonds",
      "Energy release mechanism",
      "Cellular metabolism",
    ],
    difficulty: "Advanced",
    credit: "ATP Model on Sketchfab",
  },

  // Laboratory Materials and Equipment
  {
    id: "lab-microscope",
    name: "Optical Microscope",
    category: "Laboratory Materials",
    description: "Essential instrument for viewing microscopic objects",
    thumbnail: "https://i.pinimg.com/736x/40/9c/1b/409c1bf0ea2f46ac03669313cc9de3b2.jpg",
    model: "https://sketchfab.com/models/eb3c5598827742d3b1e0e8661445121b/embed",
    modelType: "sketchfab",
    fullDescription:
      "An optical microscope uses visible light and lenses to magnify objects. It is one of the most important tools in biological and medical research.",
    learningPoints: [
      "Lens systems",
      "Magnification and resolution",
      "Sample preparation",
      "Proper handling",
    ],
    difficulty: "Beginner",
    credit: "Microscope Model on Sketchfab",
  },
  {
    id: "lab-beaker",
    name: "Laboratory Beaker",
    category: "Laboratory Materials",
    description: "Common glassware for mixing and measuring",
    thumbnail: "https://i.pinimg.com/736x/f1/e1/22/f1e1227b52ea7be48e712083934b5d19.jpg",
    model: "https://sketchfab.com/models/c1560b532f1d4f9f808f4963d6c877c8/embed",
    modelType: "sketchfab",
    fullDescription:
      "A beaker is a common piece of laboratory glassware used for holding, mixing, and heating liquids. It is usually cylindrical and made of borosilicate glass.",
    learningPoints: [
      "Volume measurement",
      "Heat resistance",
      "Material composition",
      "Laboratory safety",
    ],
    difficulty: "Beginner",
    credit: "Beaker Model on Sketchfab",
  },
  {
    id: "lab-centrifuge",
    name: "Laboratory Centrifuge",
    category: "Laboratory Materials",
    description: "Equipment for separating substances by density",
    thumbnail: "https://i.pinimg.com/736x/ff/ed/5a/ffed5ad893bc33dda31a82bffe50e4e1.jpg",
    model: "https://sketchfab.com/models/843d5b9c344c48ca8a44ba3d61d84979/embed",
    modelType: "sketchfab",
    fullDescription:
      "A centrifuge is a machine that spins samples at high speed to separate substances of different densities. It is commonly used in biological and chemical laboratories.",
    learningPoints: [
      "Rotational mechanics",
      "Density separation",
      "Safety procedures",
      "Sample preparation",
    ],
    difficulty: "Intermediate",
    credit: "Centrifuge Model on Sketchfab",
  },
  {
    id: "lab-spectrophotometer",
    name: "Spectrophotometer",
    category: "Laboratory Materials",
    description: "Instrument for measuring light absorption",
    thumbnail: "https://i.pinimg.com/1200x/29/a9/2a/29a92a3c25876ac7142ce0a82008a926.jpg",
    model: "https://sketchfab.com/models/8dfbc8e441754bf0adfea68498a81cb9/embed",
    modelType: "sketchfab",
    fullDescription:
      "A spectrophotometer is an instrument that measures the intensity of light as a function of wavelength. It is used to determine the concentration of substances in solutions.",
    learningPoints: [
      "Light absorption",
      "Wavelength measurement",
      "Beer's Law",
      "Quantitative analysis",
    ],
    difficulty: "Advanced",
    credit: "Spectrophotometer Model on Sketchfab",
  },
  {
    id: "lab-pipette",
    name: "Micropipette",
    category: "Laboratory Materials",
    description: "Precision instrument for measuring small volumes",
    thumbnail: "https://i.pinimg.com/736x/18/00/03/1800032c46d776712f48e84ba4cb708b.jpg",
    model: "https://sketchfab.com/models/2ada8e71963b49e0bcaaf367634d0279/embed",
    modelType: "sketchfab",
    fullDescription:
      "A micropipette is a laboratory instrument used to transport a small volume of liquid. It is essential for precise measurements in modern research.",
    learningPoints: [
      "Volume precision",
      "Calibration techniques",
      "Proper usage",
      "Tip handling",
    ],
    difficulty: "Beginner",
    credit: "Pipette Model on Sketchfab",
  },
  {
    id: "lab-petridish",
    name: "Petri Dish",
    category: "Laboratory Materials",
    description: "Container for culturing microorganisms",
    thumbnail: "https://i.pinimg.com/736x/62/4b/7d/624b7dbbf5f198363d3b0ca816c1e9f4.jpg",
    model: "https://sketchfab.com/models/3b720187d6ae44db86d9a3574ce70ea1/embed",
    modelType: "sketchfab",
    fullDescription:
      "A Petri dish is a shallow cylindrical glass or plastic dish used for culturing microorganisms. It is named after Julius Richard Petri, who invented it.",
    learningPoints: [
      "Microbial culture",
      "Sterilization",
      "Colony growth",
      "Contamination prevention",
    ],
    difficulty: "Beginner",
    credit: "Petri Dish Model on Sketchfab",
  },
  {
  id: "lab-testtube",
  name: "Test Tube",
  category: "Laboratory Materials",
  description: "Cylindrical glass container used in laboratories",
  thumbnail: "https://i.pinimg.com/736x/02/2e/43/022e43d028246ef1da1e8910b817e73a.jpg",
  model: "https://sketchfab.com/models/c0dd417a4f5444c9a2bcf1dc2eb084c7/embed",
  modelType: "sketchfab",
  fullDescription:
    "A test tube is a common laboratory glassware used to hold, mix, or heat small amounts of liquid or solid chemicals. It is widely used in experiments, chemical reactions, and sample storage.",
  learningPoints: [
    "Handling and safety",
    "Mixing and heating chemicals",
    "Observation of reactions",
    "Proper cleaning and storage",
  ],
  difficulty: "Beginner",
  credit: "Test Tube Model on Sketchfab",
},
{
  id: "lab-conicalflask",
  name: "Conical Flask",
  category: "Laboratory Materials",
  description: "Glass container with a conical body and narrow neck",
  thumbnail: "https://i.pinimg.com/1200x/0d/0f/6a/0d0f6a7320d6a54c9c46e62da8428a99.jpg",
  model: "https://sketchfab.com/models/f2991abcaaa44616ad5f72d29a3d47b3/embed", 
  modelType: "sketchfab",
  fullDescription:
    "A conical flask, also known as an Erlenmeyer flask, is a type of laboratory flask with a conical body and narrow neck. It is commonly used for mixing, heating, and storing liquids, as its shape reduces the risk of spillage.",
  learningPoints: [
    "Safe mixing and swirling of liquids",
    "Heating liquids evenly",
    "Reducing spillage and contamination",
    "Use with stoppers and equipment",
  ],
  difficulty: "Beginner",
  credit: "Conical Flask Model on Sketchfab",
},
{
  id: "lab-volumetricflask",
  name: "Volumetric Flask",
  category: "Laboratory Materials",
  description: "Precision flask for preparing solutions of exact volume",
  thumbnail: "https://i.pinimg.com/736x/4e/5e/50/4e5e500bdebaa3178d31780f579cdfd8.jpg",
  model: "https://sketchfab.com/models/e7349e27d83c4a01b9118ebfecf68b0c/embed", 
  modelType: "sketchfab",
  fullDescription:
    "A volumetric flask is a type of laboratory glassware designed to contain a precise volume at a particular temperature. It is mainly used to prepare standard solutions and for accurate dilutions.",
  learningPoints: [
    "Accurate measurement of liquid volumes",
    "Preparation of standard solutions",
    "Proper handling and cleaning",
    "Use of stoppers to prevent contamination",
  ],
  difficulty: "Beginner",
  credit: "Volumetric Flask Model on Sketchfab",
},
{
  id: "lab-graduatedcylinder",
  name: "Graduated Cylinder",
  category: "Laboratory Materials",
  description: "Tall, narrow cylinder used to measure liquid volumes accurately",
  thumbnail: "https://i.pinimg.com/1200x/24/80/7c/24807c3d8d1d8b866dbf6563ea7829a5.jpg",
  model: "https://sketchfab.com/models/e80739446d4c46d4a9c637c025694fec/embed",
  modelType: "sketchfab",
  fullDescription:
    "A graduated cylinder is a piece of laboratory glassware used to measure the volume of liquids accurately. It has marked graduations along its length for precise readings and is commonly used in chemistry and biology labs.",
  learningPoints: [
    "Measuring liquid volumes accurately",
    "Reading the meniscus correctly",
    "Handling with care to avoid breakage",
    "Cleaning and storing properly",
  ],
  difficulty: "Beginner",
  credit: "Graduated Cylinder Model on Sketchfab",
},
{
  id: "lab-burette",
  name: "Burette",
  category: "Laboratory Materials",
  description: "Precision glass tube used to dispense measured volumes of liquid",
  thumbnail: "https://i.pinimg.com/736x/25/5c/2b/255c2b7ba75ca8df06b3af619579261c.jpg",
  model: "https://sketchfab.com/models/fb213ff737fe4bf8b5b53f64f2d064b7/embed", 
  modelType: "sketchfab",
  fullDescription:
    "A burette is a long, graduated glass tube with a stopcock at the bottom, used to dispense precise volumes of liquid, especially during titrations in chemistry. It allows for accurate measurement and control of liquid flow.",
  learningPoints: [
    "Measuring precise volumes of liquids",
    "Using the stopcock correctly",
    "Reading the meniscus accurately",
    "Proper cleaning and maintenance",
  ],
  difficulty: "Beginner",
  credit: "Burette Model on Sketchfab",
},
{
  id: "lab-pipette",
  name: "Pipette",
  category: "Laboratory Materials",
  description: "Tool for measuring and transferring small volumes of liquid",
  thumbnail: "https://i.pinimg.com/1200x/58/d6/d3/58d6d33cd1f4b9933b6fc0e7c3084d84.jpg",
  model: "https://sketchfab.com/models/4ed0651f9de14cdf96891449acb7cc38/embed",
  modelType: "sketchfab",
  fullDescription:
    "A pipette is a laboratory tool used to measure and transfer small amounts of liquid with precision. Pipettes can be manual or electronic and come in various types such as volumetric, graduated, and micropipettes.",
  learningPoints: [
    "Accurate measurement of liquids",
    "Proper handling to avoid contamination",
    "Calibration and maintenance",
    "Different types of pipettes and their uses",
  ],
  difficulty: "Beginner",
  credit: "Pipette Model on Sketchfab",
},
];
  
export const getOrgansByCategory = (category: string): Organ3D[] => {
  return organs3DData.filter((organ) => organ.category === category);
};

export const getOrganById = (id: string): Organ3D | undefined => {
  return organs3DData.find((organ) => organ.id === id);
};

export const categories = ["Biology", "Chemistry", "Laboratory Materials"];
