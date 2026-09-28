export type BrewMethod = 'v60' | 'aeropress' | 'mokapot' | 'kalita' | 'chemex' | 'frenchpress';

export type RoastLevel = 'light' | 'light-medium' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

export type ProcessMethod = 'Washed' | 'Natural' | 'Honey' | 'Anaerobic / Experimental';

export interface RecipeStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  targetWaterGrams: number;
  durationSeconds: number;
  flowRateRecommendation?: string; // e.g., "4.5 g/s steady circular pour"
  isBloom?: boolean;
  isAgitation?: boolean;
}

export interface GrinderClicks {
  comandanteC40?: string;
  timemoreC2C3?: string;
  baratzaEncore?: string;
  fellowOdeGen2?: string;
  oneZpressoJx?: string;
}

export interface BrewRecipe {
  id: string;
  title: string;
  subtitle: string;
  author: {
    name: string;
    handle: string;
    role: string;
    avatarInitials: string;
    avatarColor: string;
    experienceLevel: 'Beginner' | 'Enthusiast' | 'Q-Grader / Barista' | 'Champion';
  };
  method: BrewMethod;
  methodLabel: string;
  coffeeBean: {
    name: string;
    origin: string;
    process: ProcessMethod;
    roastLevel: RoastLevel;
    roaster?: string;
    altitude?: string;
    varietal?: string;
  };
  doseGrams: number;
  waterGrams: number;
  ratio: string; // e.g., "1:16.7"
  waterTempC: number;
  waterTempF: number;
  grindSize: {
    category: 'Extra Fine' | 'Fine' | 'Medium-Fine' | 'Medium' | 'Medium-Coarse' | 'Coarse';
    microns: number;
    clicks: GrinderClicks;
    visualDescriptor: string; // e.g. "Table salt consistency" or "Coarse sea sand"
  };
  filterType: string;
  totalTargetTimeSec: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: RecipeStep[];
  tastingNotes: string[];
  authorTips: string;
  likesCount: number;
  bookmarksCount: number;
  forksCount: number;
  commentsCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface RecipeComment {
  id: string;
  recipeId: string;
  author: {
    name: string;
    handle: string;
    role: string;
    avatarInitials: string;
    avatarColor: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  userVoted?: boolean;
  variableTweak?: {
    variable: string;
    suggestion: string;
  };
}

export interface BrewLogEntry {
  id: string;
  recipeId: string;
  recipeTitle: string;
  method: BrewMethod;
  date: string;
  doseGrams: number;
  waterGrams: number;
  waterTempC: number;
  grinderUsed: string;
  grindSetting: string;
  actualDrawdownSec: number;
  sensoryBalance: 'sour_underextracted' | 'balanced_sweet' | 'bitter_overextracted';
  overallRating: number; // 1 to 5
  notes: string;
  tastingNotesDetected: string[];
}

export interface CommunityDiscussion {
  id: string;
  author: {
    name: string;
    handle: string;
    role: string;
    avatarInitials: string;
    avatarColor: string;
  };
  method: BrewMethod;
  title: string;
  body: string;
  tags: string[];
  extractionDetails?: {
    dose: string;
    water: string;
    grind: string;
    temp: string;
    totalTime: string;
  };
  replies: {
    id: string;
    author: {
      name: string;
      handle: string;
      role: string;
      avatarInitials: string;
      avatarColor: string;
    };
    content: string;
    createdAt: string;
    upvotes: number;
    userUpvoted?: boolean;
    isAcceptedTip?: boolean;
  }[];
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
}
