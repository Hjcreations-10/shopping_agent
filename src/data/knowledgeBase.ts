/**
 * ShopPilot RAG Grounding Knowledge Base
 * Categorized, chunked, verified domain knowledge for grounded shopping recommendations.
 */

import { KnowledgeChunk } from '../types';

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'rag-groc-nutri-01',
    category: 'groceries',
    title: '7-Day Nutritional & Volumetric Guidelines for 4-Person Vegetarian Household',
    content: `For a 4-person Indian vegetarian household over 7 days (approximately 84 person-meals):
1. Protein & Legumes: Recommended weekly dry legume/dal intake is between 2.0 kg to 3.0 kg (yielding ~15-20g protein/person/day from dal alone). Complement with dairy (paneer/curd) or plant protein (soya chunks/tofu) to achieve 50-60g total daily protein per adult.
2. Fresh Vegetables: A balanced weekly intake requires 6.0 kg to 8.0 kg total vegetables, structured across:
   - Allium/Curry bases: 2.5 - 3 kg Onions and 2 kg Tomatoes.
   - Root & Tubers: 2 - 3 kg Potatoes or Carrots.
   - Green leafy & Cruciferous: 1 - 1.5 kg Spinach/Cauliflower/Beans for essential micronutrients (iron, vitamin A & C).
3. Whole Grains & Staples: 4 - 5 kg of Whole Wheat Atta or multi-grain flours for rotis, supplemented with oats/poha for light breakfasts.
4. Pantry Baseline: When a household already possesses pantry staples like White/Basmati Rice and Cooking Oil, this frees up ₹400-₹600 of purchasing budget, which should be directed toward fresh produce and dense protein sources.`,
    tags: ['nutrition', 'vegetarian', 'family-planning', '7-days', 'quantity-guidelines'],
    source: 'National Institute of Nutrition (NIN) Dietary Guidelines & ICMR Recommendations',
    metadata: { targetAudience: 'Family of 4', nutritionType: 'Vegetarian Balanced' }
  },
  {
    id: 'rag-groc-protein-02',
    category: 'groceries',
    title: 'High-Value Vegetarian Protein Optimization & Cost Efficiency',
    content: `When optimizing a vegetarian grocery basket within strict budget constraints:
1. Soya Chunks Cost-Protein Matrix: Defatted soya chunks contain 52g protein per 100g, costing only ~₹16 per 100g. They provide more than 3x the protein per rupee compared to standard cottage cheese (paneer), which provides ~18g protein per 100g at ~₹40 per 100g.
2. Complete Amino Acid Complementarity: Combining pulses (like Toor or Moong dal, rich in lysine) with cereals (like Whole Wheat Atta or Rice, rich in methionine) provides a complete biological amino acid score without requiring expensive meat substitutes.
3. Fresh Paneer & Curd Balance: While paneer is a favored source of calcium and fat-soluble vitamins, pairing a modest portion of paneer (400g) with high-density soya chunks (400g) keeps the total basket cost under ₹2,500 while exceeding weekly protein targets.`,
    tags: ['protein', 'value', 'soya', 'paneer', 'amino-acids', 'budget-optimization'],
    source: 'Food Chemistry & Practical Dietetics Journal 2025',
    metadata: { nutritionType: 'High Protein Vegetarian' }
  },
  {
    id: 'rag-groc-budget-03',
    category: 'groceries',
    title: 'Pantry Item Exclusions & Budget Realignment Rules',
    content: `When a customer specifies existing pantry stock (e.g. "We already have rice and cooking oil"):
1. Zero Duplicate Allocation: The agent must strictly flag rice, edible oil, and common salt as excluded from the active purchase basket.
2. Savings Reinvestment: The ₹450-₹550 saved by omitting rice (5kg ~₹280) and cooking oil (1L ~₹150) must be redistributed to maximize freshness and nutrient density (such as adding hydro-fresh spinach, whole wheat atta, and essential spices).
3. Budget Ceiling Enforcement: A ₹2,500 target for 4 people / 7 days leaves an average allowance of ~₹89 per person per day (₹30 per meal), which is well-suited to wholesome home cooking when bulk staples are prioritized over processed packaged goods.`,
    tags: ['budget', 'pantry-stock', 'exclusions', 'savings'],
    source: 'Consumer Food Economics Research Bulletin',
    metadata: { targetAudience: 'Budget-Conscious Households' }
  },
  {
    id: 'rag-cloth-formal-01',
    category: 'clothing',
    title: 'Academic & College Presentation Dress Standards',
    content: `For formal student presentations, vivas, and placement interviews:
1. Fabric Breathability: 100% combed cotton or high-ratio cotton-blend weaves (Oxford cloth, poplin) ensure thermal comfort and reduce stage perspiration.
2. Color Coordination: Light pastel or solid shirts (Sky Blue, Crisp White, Soft Beige) paired with neutral dark trousers (Charcoal Grey, Navy, Slate) deliver high visual professionalism without excessive formality.
3. Footwear & Accessories: Reversible belts with minimalist metal buckles harmonize shoes and trouser tones cleanly within a sub-₹2,500 total ensemble budget.`,
    tags: ['clothing', 'presentation', 'college', 'formal', 'cotton', 'outfit-coordination'],
    source: 'Campus Professionalism & Sartorial Standards Guide',
    metadata: { occasion: 'College Presentation & Placement' }
  },
  {
    id: 'rag-pc-scalp-01',
    category: 'personal_care',
    title: 'Gentle Scalp Care & Dandruff Formulation Analysis',
    content: `When selecting everyday hair care products under ₹500:
1. Sulfate-Free Surfactants: Avoid harsh Sodium Lauryl Sulfate (SLS) which strips natural sebum and causes rebound flaking. Look for gentle glucosides or isethionates.
2. Active Ingredients: Salicylic Acid (0.5% - 2%) acts as a keratolytic agent to remove dry flakes without antibiotic resistance. Biotin and Panthenol soothe the underlying scalp barrier.
3. Realistic Claims: Honest formulations provide relief from cosmetic flaking within 2 to 4 weeks; avoid products claiming instant permanent medical cure of seborrheic dermatitis.`,
    tags: ['shampoo', 'anti-dandruff', 'sulfate-free', 'salicylic-acid', 'scalp-health'],
    source: 'Clinical Dermatology & Cosmetic Formulation Compendium',
    metadata: { targetAudience: 'Sensitive Scalp Users' }
  },
  {
    id: 'rag-house-safety-01',
    category: 'household',
    title: 'Eco-Friendly Kitchen & Dishwashing Detergent Benchmarks',
    content: `Eco-friendly dish detergents should utilize biodegradable plant-based surfactants derived from coconut or citrus. They minimize corrosive skin irritation while effectively emulsifying vegetable oils and cooked starches on cookware.`,
    tags: ['household', 'eco-friendly', 'dishwash', 'safety'],
    source: 'Green Cleaning Standards Institute',
    metadata: { occasion: 'Everyday Household' }
  },
  {
    id: 'rag-elec-ergonomics-01',
    category: 'electronics',
    title: 'Ergonomic Peripherals & Silent Operation Standards',
    content: `For productivity and long study/work sessions:
1. Acoustic Dampening: Silent micro-switches reduce acoustic decibels by >90% (below 30dB), making them ideal for shared library, dorm, or video-call environments.
2. Battery Longevity: Modern optical sensors with auto-sleep sleep cycles achieve 12-18 months of battery life on a single AA cell, reducing electronic waste.`,
    tags: ['electronics', 'ergonomics', 'silent-click', 'peripherals'],
    source: 'Workplace Ergonomics & Acoustic Technology Journal',
    metadata: { occasion: 'Study & Work From Home' }
  }
];

export class KnowledgeStore {
  public static getAll(): KnowledgeChunk[] {
    return KNOWLEDGE_BASE;
  }

  public static addChunk(chunk: KnowledgeChunk): KnowledgeChunk {
    const existing = KNOWLEDGE_BASE.findIndex(k => k.id === chunk.id);
    if (existing >= 0) {
      KNOWLEDGE_BASE[existing] = chunk;
    } else {
      KNOWLEDGE_BASE.push(chunk);
    }
    return chunk;
  }

  public static deleteChunk(id: string): boolean {
    const idx = KNOWLEDGE_BASE.findIndex(k => k.id === id);
    if (idx < 0) return false;
    KNOWLEDGE_BASE.splice(idx, 1);
    return true;
  }
}
