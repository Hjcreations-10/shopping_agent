/**
 * ShopPilot — AI Everyday Shopping Agent
 * TypeScript Type Definitions
 */

export type ProductCategory = 'groceries' | 'clothing' | 'personal_care' | 'household' | 'electronics';

export interface BaseReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  aspects?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    feature: string;
  }[];
}

export interface BaseProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  price: number; // in INR (₹)
  originalPrice?: number;
  unit: string; // e.g. "1 kg", "500 g", "Pack of 2", "M", "250 ml"
  rating: number;
  reviewCount: number;
  reviews: BaseReview[];
  inStock: boolean;
  verified: boolean;
  imageUrl: string;
  description: string;
  tags: string[];
}

export interface GroceryProduct extends BaseProduct {
  category: 'groceries';
  dietaryTags: ('vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free' | 'organic' | 'high_protein')[];
  ingredients: string[];
  nutritionPer100g?: {
    calories?: number;
    proteinGrams?: number;
    carbsGrams?: number;
    fatGrams?: number;
    fiberGrams?: number;
  };
  shelfLifeDays?: number;
  isPerishable: boolean;
}

export interface ClothingProduct extends BaseProduct {
  category: 'clothing';
  size: string;
  color: string;
  material: string;
  style: string;
  occasion: string[]; // e.g. ["college", "presentation", "formal", "casual"]
  gender?: 'men' | 'women' | 'unisex';
  careInstructions?: string;
}

export interface PersonalCareProduct extends BaseProduct {
  category: 'personal_care';
  skinType?: string[];
  hairType?: string[];
  activeIngredients: string[];
  volumeMl?: number;
  isCrueltyFree: boolean;
  isSulfateFree?: boolean;
  benefits: string[];
}

export interface HouseholdProduct extends BaseProduct {
  category: 'household';
  packSize: number;
  ecoFriendly: boolean;
  surfaceType?: string;
}

export interface ElectronicsProduct extends BaseProduct {
  category: 'electronics';
  specifications: Record<string, string>;
  warrantyMonths: number;
  features: string[];
}

export type Product = GroceryProduct | ClothingProduct | PersonalCareProduct | HouseholdProduct | ElectronicsProduct;

export interface ShoppingRequirements {
  category: ProductCategory;
  budget: number;
  people: number;
  durationDays: number;
  diet?: 'vegetarian' | 'vegan' | 'non_vegetarian' | 'any';
  existingItems: string[];
  excludedItems: string[];
  priorities: string[]; // e.g. ["healthy", "value", "protein", "fresh"]
  preferredBrands?: string[];
  stylePreference?: string;
  occasion?: string;
  notes?: string;
  itemDirectives?: Record<string, { note?: string; tags?: string[] }>;
  itemFeedback?: Record<string, { feedback: 'up' | 'down'; reason?: string }>;
}

export interface ItemDirective {
  note?: string;
  tags?: string[];
}

export interface KnowledgeChunk {
  id: string;
  category: ProductCategory;
  title: string;
  content: string;
  tags: string[];
  source: string;
  metadata: {
    targetAudience?: string;
    nutritionType?: string;
    occasion?: string;
  };
}

export interface ReviewInsight {
  productId: string;
  productName: string;
  positiveThemes: string[];
  negativeThemes: string[];
  sentimentScore: number; // 0 to 100
  verifiedBuyerRatio: number;
  recurringPraise: string[];
  recurringComplaints: string[];
  summary: string;
}

export interface ScoreBreakdown {
  totalScore: number; // 0 - 100
  requirementMatch: number; // 0 - 100
  budgetFit: number; // 0 - 100
  valueForMoney: number; // 0 - 100
  reviewQuality: number; // 0 - 100
  preferenceFit: number; // 0 - 100
  explanation: string;
}

export interface BasketItem {
  product: Product;
  quantity: number;
  subtotal: number;
  whySelected: string;
  scoreBreakdown: ScoreBreakdown;
  substitutionOptions?: {
    originalProductId: string;
    substituteProduct: Product;
    reason: string;
    priceDelta: number;
  }[];
  customNote?: string;
  customTags?: string[];
  directiveOutcome?: string;
  userFeedback?: 'up' | 'down' | null;
  feedbackReason?: string;
}

export interface SubstitutionRecord {
  originalItemName: string;
  substituteItemName: string;
  reason: string;
  costSaved: number;
}

export interface BasketOptimizationResult {
  budget: number;
  originalEstimatedTotal: number;
  optimizedTotal: number;
  remainingBudget: number;
  savings: number;
  items: BasketItem[];
  substitutionsMade: SubstitutionRecord[];
  categoryBalance: {
    category: string;
    itemCount: number;
    subtotal: number;
    percentageOfTotal: number;
  }[];
  nutritionalMetrics?: {
    estimatedTotalProteinG: number;
    estimatedDailyProteinPerPersonG: number;
    servingsCoverageDays: number;
    balancedScore: number; // 0-100
  };
  decisionSummary: string;
}

export interface AgentStep {
  id: string;
  agentName: string;
  toolUsed?: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  durationMs: number;
  timestamp: string;
  inputPayload?: any;
  outputPayload?: any;
  summary: string;
}

export interface AgentPlanResponse {
  sessionId: string;
  requirements: ShoppingRequirements;
  assumptions: string[];
  retrievedKnowledge: KnowledgeChunk[];
  basket: BasketOptimizationResult;
  reviewInsights: ReviewInsight[];
  steps: AgentStep[];
  explanation: {
    objective: string;
    budgetStrategy: string;
    nutritionStrategy?: string;
    substitutionsRationale: string;
    trustNotice: string;
  };
  observability: {
    totalLatencyMs: number;
    modelCallsCount: number;
    retrievalCount: number;
    toolCallsCount: number;
    cacheHit: boolean;
    securityCheckPassed: boolean;
  };
}

export interface TestResult {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'running';
  executionTimeMs: number;
  details: string;
  assertion: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productCategory: ProductCategory;
  unit: string;
  imageUrl: string;
  originalPriceAtCreation: number;
  currentPrice: number;
  targetPrice: number;
  inStock: boolean;
  notifyOnStock: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  triggeredReason?: string;
  createdAt: string;
  priceHistory: PriceHistoryPoint[];
  emailNotification?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  thought?: string;
  toolUsed?: string;
  suggestedAction?: {
    type: 'replan' | 'swap' | 'adjust_budget' | 'apply_diet' | 'custom';
    label: string;
    payload?: any;
  };
}

export interface AgentChatResponse {
  reply: string;
  thought?: string;
  toolUsed?: string;
  suggestedAction?: {
    type: 'replan' | 'swap' | 'adjust_budget' | 'apply_diet' | 'custom';
    label: string;
    payload?: any;
  };
  modelUsed?: string;
}

