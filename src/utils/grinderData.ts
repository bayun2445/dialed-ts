export interface GrinderModelInfo {
  id: string;
  name: string;
  type: 'Hand Grinder' | 'Electric Flat Burr' | 'Electric Conical Burr';
  burrSize: string;
  micronStep: number; // approximate microns per click
  ranges: {
    espresso: string;
    mokapot: string;
    aeropress: string;
    v60: string;
    chemex: string;
    frenchpress: string;
    coldbrew: string;
  };
}

export const GRINDERS: GrinderModelInfo[] = [
  {
    id: 'comandante-c40',
    name: 'Comandante C40 (Nitro Blade)',
    type: 'Hand Grinder',
    burrSize: '39mm Conical',
    micronStep: 30,
    ranges: {
      espresso: '8 – 12 clicks',
      mokapot: '13 – 16 clicks',
      aeropress: '14 – 20 clicks',
      v60: '18 – 24 clicks',
      chemex: '24 – 28 clicks',
      frenchpress: '27 – 32 clicks',
      coldbrew: '30 – 35 clicks',
    },
  },
  {
    id: 'timemore-c2-c3',
    name: 'Timemore C2 / C3 Chestnut',
    type: 'Hand Grinder',
    burrSize: '38mm Conical',
    micronStep: 28,
    ranges: {
      espresso: '7 – 9 clicks',
      mokapot: '10 – 12 clicks',
      aeropress: '12 – 15 clicks',
      v60: '13 – 16 clicks',
      chemex: '17 – 20 clicks',
      frenchpress: '20 – 24 clicks',
      coldbrew: '24 – 28 clicks',
    },
  },
  {
    id: 'baratza-encore',
    name: 'Baratza Encore',
    type: 'Electric Conical Burr',
    burrSize: '40mm M2/M3 Conical',
    micronStep: 45,
    ranges: {
      espresso: 'Not ideal (4 – 8)',
      mokapot: '8 – 11',
      aeropress: '11 – 15',
      v60: '13 – 17',
      chemex: '18 – 22',
      frenchpress: '26 – 30',
      coldbrew: '32 – 36',
    },
  },
  {
    id: 'fellow-ode-gen2',
    name: 'Fellow Ode Gen 2',
    type: 'Electric Flat Burr',
    burrSize: '64mm Flat Burrs',
    micronStep: 25,
    ranges: {
      espresso: 'Not rated for espresso',
      mokapot: '2.0 – 3.0',
      aeropress: '3.0 – 4.2',
      v60: '4.0 – 5.2',
      chemex: '6.0 – 7.2',
      frenchpress: '8.0 – 9.1',
      coldbrew: '9.2 – 11.0',
    },
  },
  {
    id: '1zpresso-jx',
    name: '1Zpresso JX / K-Ultra',
    type: 'Hand Grinder',
    burrSize: '48mm Conical',
    micronStep: 20,
    ranges: {
      espresso: '12 – 16 clicks',
      mokapot: '18 – 22 clicks',
      aeropress: '20 – 26 clicks',
      v60: '24 – 32 clicks',
      chemex: '32 – 38 clicks',
      frenchpress: '36 – 44 clicks',
      coldbrew: '42 – 50 clicks',
    },
  },
];

export interface ExtractionIssue {
  id: string;
  tasteCategory: 'sour' | 'bitter' | 'weak' | 'stalled_slow' | 'fast_watery' | 'channeling';
  userExperience: string;
  sensoryHallmarks: string[];
  diagnosis: string;
  primaryRemedy: string;
  actionableSteps: string[];
  parameterAdjustments: {
    grindSize: string;
    waterTemp: string;
    ratioOrDose: string;
    techniqueTweak: string;
  };
}

export const EXTRACTION_COMPASS_DATA: ExtractionIssue[] = [
  {
    id: 'sour',
    tasteCategory: 'sour',
    userExperience: 'My coffee is sharply sour, acidic like lemon juice, and lacks sweetness.',
    sensoryHallmarks: [
      'Sharp, puckering acidity',
      'Short, abrupt finish with no pleasant aftertaste',
      'Tastes hollow or grassy in the middle of the sip',
      'Underdeveloped body',
    ],
    diagnosis: 'Under-Extraction (Yield < 18%). Water has pulled out early bright organic acids, but failed to extract the sweeter sugars and balancing plant fibers.',
    primaryRemedy: 'Increase overall extraction energy by grinding finer and increasing water temperature.',
    actionableSteps: [
      'Grind 1 to 2 clicks finer on your grinder.',
      'Raise water temperature to 93°C – 95°C (200°F – 203°F). For light roasts, don’t hesitate to use 96°C.',
      'Extend the bloom phase from 30s to 45s and gently swirl the dripper to ensure every coffee particle is saturated.',
      'Slow down your pour rate to keep contact time slightly longer.',
    ],
    parameterAdjustments: {
      grindSize: 'Finer',
      waterTemp: 'Increase (+2°C)',
      ratioOrDose: 'Maintain ratio (or slightly increase water yield, e.g. 1:16 to 1:17)',
      techniqueTweak: 'Perform gentle bloom swirl to eliminate dry channels',
    },
  },
  {
    id: 'bitter',
    tasteCategory: 'bitter',
    userExperience: 'My coffee has an astringent, dry sandpaper tongue feel and harsh bitter aftertaste.',
    sensoryHallmarks: [
      'Drying astringency (like over-steeped black tea or dry red wine)',
      'Harsh bitterness coating the back of the palate',
      'Loss of origin sweetness or floral notes',
      'Ashy or medicinal finish',
    ],
    diagnosis: 'Over-Extraction (Yield > 22%) or localized micro-channeling. Heavy, bitter organic compounds and tannins have dissolved into the brew.',
    primaryRemedy: 'Reduce total contact extraction: grind coarser and drop water temperature.',
    actionableSteps: [
      'Grind 2 to 3 clicks coarser on your grinder.',
      'Lower water temperature to 89°C – 92°C (192°F – 198°F), especially if using medium to dark roast.',
      'Reduce excess agitation: pour gently in smooth spirals from 3–5cm height; avoid aggressive kettle splashes.',
      'Check if the filter paper was clogged by fines; do not aggressively swirl at the very end.',
    ],
    parameterAdjustments: {
      grindSize: 'Coarser',
      waterTemp: 'Decrease (-2°C)',
      ratioOrDose: 'Tighten ratio slightly (e.g. 1:15 instead of 1:17) to cut bitter tail',
      techniqueTweak: 'Lower kettle spout height to minimize turbulence',
    },
  },
  {
    id: 'stalled_slow',
    tasteCategory: 'stalled_slow',
    userExperience: 'The water is taking forever to drain (> 4:30 min) and pooling in the V60.',
    sensoryHallmarks: [
      'Drawdown completely stalls with murky water on top',
      'Coffee bed looks like muddy clay/silt',
      'Muddled, astringent flavor',
    ],
    diagnosis: 'Filter clogging from coffee fines migration or excessive agitation settling the fines into the bottom tip of the paper.',
    primaryRemedy: 'Grind coarser to produce fewer micro-fines, and cease late-stage swirling.',
    actionableSteps: [
      'Grind coarser by 2-3 clicks.',
      'Do not swirl the brewer in the 2nd half of the brew; only gentle swirl during bloom.',
      'Rinse paper filters with hot water prior to brewing.',
      'If using an entry-level blade or uneven burr, sift out microscopic fines or upgrade burr alignment.',
    ],
    parameterAdjustments: {
      grindSize: 'Coarser',
      waterTemp: 'Keep',
      ratioOrDose: 'Keep current ratio',
      techniqueTweak: 'Stop late-stage agitation and gentle single center pour',
    },
  },
  {
    id: 'fast_watery',
    tasteCategory: 'fast_watery',
    userExperience: 'Water drained in under 1:45 min. Coffee is thin, watery, and lacks punch.',
    sensoryHallmarks: [
      'Tea-like, watery mouthfeel',
      'Lacks sweetness and depth',
      'Coffee bed has crater holes or channels',
    ],
    diagnosis: 'Grind is much too coarse, or water bypassed the coffee bed without sufficient resistance.',
    primaryRemedy: 'Grind significantly finer to build proper hydraulic resistance in the coffee bed.',
    actionableSteps: [
      'Grind 3 to 4 clicks finer.',
      'Check pouring technique: ensure you are not pouring directly against the paper filter wall.',
      'Increase coffee dose by 1–2g if seeking a richer body.',
    ],
    parameterAdjustments: {
      grindSize: 'Finer',
      waterTemp: 'Keep',
      ratioOrDose: 'Consider 1:15 or 1:16 ratio for higher TDS body',
      techniqueTweak: 'Keep pour stream inside the inner 75% circle of coffee bed',
    },
  },
  {
    id: 'channeling',
    tasteCategory: 'channeling',
    userExperience: 'Weird cup: tastes simultaneously sour AND bitter/dry at the same time!',
    sensoryHallmarks: [
      'Confused flavor: sour front of tongue, harsh dry finish',
      'Uneven coffee bed after brew (holes, tunnels, or high grounds stuck to walls)',
      'Inconsistent results from day to day',
    ],
    diagnosis: 'Channeling. Water carved easy pathways (cracks/tunnels) through parts of the coffee bed, over-extracting those channels while leaving other grounds under-extracted.',
    primaryRemedy: 'Level your bed, ensure a complete bloom saturation, and pour evenly.',
    actionableSteps: [
      'Before blooming, shake the brewer horizontally to create an impeccably flat coffee bed.',
      'Use a gentle excavation spoon or small swirl during bloom to ensure 100% of grounds get wet in the first 10 seconds.',
      'Maintain a consistent 4–5 g/second flow rate without breaking the water stream.',
    ],
    parameterAdjustments: {
      grindSize: 'Keep or 1 click coarser if fines caused localized choking',
      waterTemp: 'Keep',
      ratioOrDose: 'Keep',
      techniqueTweak: 'Level bed before brew + steady spiral pouring discipline',
    },
  },
];
