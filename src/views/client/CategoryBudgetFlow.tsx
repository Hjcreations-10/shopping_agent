import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Shirt,
  Sparkles,
  Home,
  Cpu,
  IndianRupee,
  Users,
  Calendar,
  Check,
  ArrowRight,
  RotateCcw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { joyAudio } from '../../utils/joyEffects';

interface CategoryBudgetFlowProps {
  category: ProductCategory;
  onPlanSubmit: (generatedQuery: string, category: ProductCategory) => void;
  onCancel?: () => void;
}

const CATEGORY_META: Record<
  ProductCategory,
  {
    title: string;
    tagline: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultBudget: number;
    budgetPills: number[];
    accentColor: string;
    buttonText: string;
    headerGradient: string;
    iconBg: string;
    activePill: string;
    badgeStyle: string;
  }
> = {
  groceries: {
    title: 'Grocery Basket Planner',
    tagline: 'Plan 7-day balanced pantry & fresh meals tailored to your family and budget.',
    icon: ShoppingBag,
    defaultBudget: 2500,
    budgetPills: [1000, 1800, 2200, 2500, 3500],
    accentColor: 'emerald',
    buttonText: 'Build my grocery basket',
    headerGradient: 'from-emerald-50 via-teal-50/40 to-stone-50 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    activePill: 'bg-emerald-600 text-white border-emerald-600',
    badgeStyle: 'text-emerald-800 bg-emerald-100/70 border-emerald-200'
  },
  clothing: {
    title: 'Wardrobe & Outfit Builder',
    tagline: 'Coordinate college presentation and professional outfits within your budget cap.',
    icon: Shirt,
    defaultBudget: 2500,
    budgetPills: [1200, 1800, 2500, 3500, 5000],
    accentColor: 'indigo',
    buttonText: 'Build my clothing plan',
    headerGradient: 'from-indigo-50 via-sky-50/40 to-stone-50 border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    activePill: 'bg-indigo-600 text-white border-indigo-600',
    badgeStyle: 'text-indigo-800 bg-indigo-100/70 border-indigo-200'
  },
  personal_care: {
    title: 'Personal Care Kit Planner',
    tagline: 'Find gentle, dermatologist-vetted scalp and skincare essentials under your target.',
    icon: Sparkles,
    defaultBudget: 800,
    budgetPills: [400, 800, 1200, 1800, 2500],
    accentColor: 'rose',
    buttonText: 'Build my personal care kit',
    headerGradient: 'from-rose-50 via-amber-50/40 to-stone-50 border-rose-200',
    iconBg: 'bg-rose-100 text-rose-800 border-rose-200',
    activePill: 'bg-rose-600 text-white border-rose-600',
    badgeStyle: 'text-rose-800 bg-rose-100/70 border-rose-200'
  },
  household: {
    title: 'Household Cleaning Essentials',
    tagline: 'Select eco-friendly, streak-free surface cleaners and dishwash supplies.',
    icon: Home,
    defaultBudget: 800,
    budgetPills: [300, 600, 800, 1200, 2000],
    accentColor: 'teal',
    buttonText: 'Build my household essentials',
    headerGradient: 'from-teal-50 via-emerald-50/40 to-stone-50 border-teal-200',
    iconBg: 'bg-teal-100 text-teal-800 border-teal-200',
    activePill: 'bg-teal-600 text-white border-teal-600',
    badgeStyle: 'text-teal-800 bg-teal-100/70 border-teal-200'
  },
  electronics: {
    title: 'Peripherals & Tech Essentials',
    tagline: 'Compare silent mice, fast chargers, stands and audio gear under your budget.',
    icon: Cpu,
    defaultBudget: 1500,
    budgetPills: [500, 800, 1500, 2500, 3500],
    accentColor: 'sky',
    buttonText: 'Build my electronics plan',
    headerGradient: 'from-sky-50 via-blue-50/40 to-stone-50 border-sky-200',
    iconBg: 'bg-sky-100 text-sky-800 border-sky-200',
    activePill: 'bg-sky-600 text-white border-sky-600',
    badgeStyle: 'text-sky-800 bg-sky-100/70 border-sky-200'
  }
};

export const CategoryBudgetFlow: React.FC<CategoryBudgetFlowProps> = ({
  category,
  onPlanSubmit,
  onCancel
}) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.groceries;
  const CategoryIcon = meta.icon;

  // Shared Budget State
  const [budget, setBudget] = useState<number>(meta.defaultBudget);
  const [customBudgetInput, setCustomBudgetInput] = useState<string>(meta.defaultBudget.toString());

  // Groceries Specific
  const [people, setPeople] = useState<number>(4);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [diet, setDiet] = useState<string>('vegetarian');
  const [pantryItems, setPantryItems] = useState<string[]>(['Rice', 'Cooking Oil']);
  const [groceryPriorities, setGroceryPriorities] = useState<string[]>(['Healthy & Nutritious', 'High Protein']);
  const [excludedNote, setExcludedNote] = useState<string>('');

  // Clothing Specific
  const [occasion, setOccasion] = useState<string>('College Presentation');
  const [size, setSize] = useState<string>('M / 40');
  const [style, setStyle] = useState<string>('Modern Semi-Formal');
  const [preferredColors, setPreferredColors] = useState<string[]>(['Sky Blue', 'Charcoal Grey']);
  const [clothingGender, setClothingGender] = useState<string>('Men');
  const [clothingPriority, setClothingPriority] = useState<string>('Balanced Style & Value');

  // Personal Care Specific
  const [productType, setProductType] = useState<string>('Haircare & Sensitive Scalp');
  const [skinType, setSkinType] = useState<string>('Sensitive / Flake-prone');
  const [carePreferences, setCarePreferences] = useState<string[]>(['Sulfate-free', 'Gentle / Hypoallergenic']);
  const [routineScale, setRoutineScale] = useState<string>('Daily Essentials');

  // Household Specific
  const [cleaningFocus, setCleaningFocus] = useState<string>('Kitchen & Floor Disinfection');
  const [packSize, setPackSize] = useState<string>('Standard 1-Month Family Pack');
  const [householdEco, setHouseholdEco] = useState<string>('Eco-Friendly / Gentle on Hands');

  // Electronics Specific
  const [deviceCategory, setDeviceCategory] = useState<string>('Study & Productivity Setup (Mouse + Audio)');
  const [electronicsUseCase, setElectronicsUseCase] = useState<string>('College & Library Study');
  const [featuresWanted, setFeaturesWanted] = useState<string[]>(['Silent Clicks', 'Tangle-free Wire / Wireless']);

  const handleBudgetPillClick = (val: number) => {
    setBudget(val);
    setCustomBudgetInput(val.toString());
  };

  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setCustomBudgetInput(valStr);
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num > 0) {
      setBudget(num);
    }
  };

  const toggleArrayItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleBuildPlan = (e: React.FormEvent) => {
    e.preventDefault();

    let synthesizedQuery = '';

    if (category === 'groceries') {
      const pantryText = pantryItems.length > 0 ? ` We already have ${pantryItems.join(' and ')}.` : '';
      const priorityText = groceryPriorities.length > 0 ? ` Prioritize ${groceryPriorities.join(', ')}.` : '';
      const excludeText = excludedNote.trim() ? ` Please avoid ${excludedNote.trim()}.` : '';
      synthesizedQuery = `I have ₹${budget.toLocaleString()} for groceries for ${people} people for ${durationDays} days. We are ${diet}.${pantryText}${priorityText}${excludeText}`;
    } else if (category === 'clothing') {
      const colorText = preferredColors.length > 0 ? ` in ${preferredColors.join(' and ')}` : '';
      synthesizedQuery = `I need a complete ${occasion} outfit (${style}) for ${clothingGender} under ₹${budget.toLocaleString()} in size ${size}${colorText}. Priority: ${clothingPriority}.`;
    } else if (category === 'personal_care') {
      const prefText = carePreferences.length > 0 ? ` Prefer ${carePreferences.join(', ')}.` : '';
      synthesizedQuery = `Find ${productType} products for ${skinType} under ₹${budget.toLocaleString()} for ${routineScale}.${prefText}`;
    } else if (category === 'household') {
      synthesizedQuery = `Find ${householdEco} supplies for ${cleaningFocus} (${packSize}) under ₹${budget.toLocaleString()}.`;
    } else if (category === 'electronics') {
      const feats = featuresWanted.length > 0 ? ` with ${featuresWanted.join(', ')}` : '';
      synthesizedQuery = `Find ${deviceCategory} for ${electronicsUseCase} under ₹${budget.toLocaleString()}${feats}.`;
    }

    onPlanSubmit(synthesizedQuery, category);
  };

  return (
    <div id="category-budget-flow" className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Header Banner with Smooth Category Gradient Transition */}
        <div className={`transition-all duration-500 ease-in-out bg-gradient-to-r ${meta.headerGradient} border-b border-stone-200 px-6 py-6 sm:px-8`}>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.08 }}
              transition={{ duration: 0.3 }}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-xs ${meta.iconBg}`}
            >
              <CategoryIcon className="w-6 h-6" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${meta.badgeStyle}`}>
                  Step 1: Budget & Requirements
                </span>
                <span className="text-xs text-stone-500 font-medium">ShopPilot AI Copilot</span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">{meta.title}</h2>
              <p className="text-sm text-stone-600 mt-0.5">{meta.tagline}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleBuildPlan} className="p-6 sm:p-8 space-y-8">
          {/* QUESTION 1: BUDGET FLOW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="budget-input" className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                How much are you comfortable spending on {meta.title.toLowerCase()}?
              </label>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Target Cap: ₹{budget.toLocaleString()}
              </span>
            </div>

            {/* Quick Budget Pills with Playful Bouncing Motion */}
            <div className="flex flex-wrap gap-2 pt-1">
              {meta.budgetPills.map(val => {
                const isSelected = budget === val;
                return (
                  <motion.button
                    key={val}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      joyAudio.playPop();
                      handleBudgetPillClick(val);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                      isSelected
                        ? `${meta.activePill} shadow-sm`
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    ₹{val.toLocaleString()}
                  </motion.button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-stone-500 font-medium">Or enter exact budget:</span>
              <div className="relative w-44">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-semibold text-sm">₹</span>
                <input
                  id="budget-input"
                  type="number"
                  min="200"
                  max="100000"
                  step="50"
                  value={customBudgetInput}
                  onChange={handleCustomBudgetChange}
                  className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6">
            <h3 className="text-base font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Category Requirements & Specifics
            </h3>

            {/* GROCERY FORM CONTROLS */}
            {category === 'groceries' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Household Size */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Household Size
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPeople(num)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border text-center transition-colors ${
                          people === num
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {num} {num === 1 ? 'Person' : 'People'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Planning Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 7, 14, 30].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDurationDays(days)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border text-center transition-colors ${
                          durationDays === days
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Preference */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Dietary Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['vegetarian', 'vegan', 'any'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDiet(d)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border text-center capitalize transition-colors ${
                          diet === d
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pantry Checklist (Already have at home) */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Pantry Check (Already have at home)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Rice', 'Cooking Oil', 'Common Salt', 'Sugar', 'Turmeric'].map(item => {
                      const checked = pantryItems.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem(pantryItems, setPantryItems, item)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            checked
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                            checked ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                          }`}>
                            {checked && <Check className="w-2.5 h-2.5" />}
                          </span>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">ShopPilot will omit checked items and reallocate funds to fresh greens & protein.</p>
                </div>

                {/* Priorities */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Nutritional & Shopping Priorities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Healthy & Nutritious', 'High Protein', 'Lowest Price', 'Fresh Greens Focus', 'Organic/Pure'].map(p => {
                      const sel = groceryPriorities.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => toggleArrayItem(groceryPriorities, setGroceryPriorities, p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            sel
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '} {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exclusions or Allergies */}
                <div className="sm:col-span-2">
                  <label htmlFor="excluded-input" className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                    Items to Exclude / Dietary Allergies (Optional)
                  </label>
                  <input
                    id="excluded-input"
                    type="text"
                    placeholder="e.g. peanuts, mushroom, eggs"
                    value={excludedNote}
                    onChange={e => setExcludedNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* CLOTHING FORM CONTROLS */}
            {category === 'clothing' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Occasion / Purpose
                  </label>
                  <select
                    value={occasion}
                    onChange={e => setOccasion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>College Presentation</option>
                    <option>Placement Interview</option>
                    <option>Campus Daily Smart Casual</option>
                    <option>Conference / Viva</option>
                    <option>Weekend Casual</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Size Requirement
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['S / 38', 'M / 40', 'L / 42', 'XL / 44', '32 Chino'].map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSize(sz)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-medium border transition-colors ${
                          size === sz
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Preferred Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Modern Semi-Formal', 'Classic Business', 'Minimalist Clean', 'Smart Casual'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStyle(st)}
                        className={`py-2 px-3 text-left rounded-lg text-xs font-medium border transition-colors ${
                          style === st
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Color Palette Preferences
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Sky Blue', 'Charcoal Grey', 'Crisp White', 'Deep Navy', 'Tan Leather'].map(col => {
                      const isSel = preferredColors.includes(col);
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => toggleArrayItem(preferredColors, setPreferredColors, col)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSel
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '} {col}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Category / Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Men', 'Women', 'Unisex'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setClothingGender(g)}
                        className={`py-2 px-3 text-center rounded-lg text-xs font-medium border transition-colors ${
                          clothingGender === g
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Optimization Priority
                  </label>
                  <select
                    value={clothingPriority}
                    onChange={e => setClothingPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Balanced Style & Value</option>
                    <option>Strictly under budget (Maximum savings)</option>
                    <option>100% Breathable Cotton Fabric</option>
                    <option>Highest Customer Rating</option>
                  </select>
                </div>
              </div>
            )}

            {/* PERSONAL CARE FORM CONTROLS */}
            {category === 'personal_care' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Primary Product Need
                  </label>
                  <select
                    value={productType}
                    onChange={e => setProductType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Haircare & Sensitive Scalp</option>
                    <option>Daily Facial Cleanser & Sunscreen Kit</option>
                    <option>Hydrating Skincare Routine</option>
                    <option>All-round Grooming Essentials</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Skin / Scalp Sensitivity
                  </label>
                  <select
                    value={skinType}
                    onChange={e => setSkinType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Sensitive / Flake-prone</option>
                    <option>Oily / Acne-prone</option>
                    <option>Dry / Dehydrated Barrier</option>
                    <option>Normal / Combination</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Formulation Preferences
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Sulfate-free', 'Gentle / Hypoallergenic', 'Cruelty-free', 'Zero White Cast', 'Fragrance-free'].map(pref => {
                      const isSel = carePreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => toggleArrayItem(carePreferences, setCarePreferences, pref)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSel
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '} {pref}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* HOUSEHOLD FORM CONTROLS */}
            {category === 'household' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Cleaning Focus
                  </label>
                  <select
                    value={cleaningFocus}
                    onChange={e => setCleaningFocus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Kitchen & Floor Disinfection</option>
                    <option>Dishwashing & Degreasing</option>
                    <option>Surface Cleaning & Microfiber Cloths</option>
                    <option>Complete Monthly Cleaning Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Household Attributes
                  </label>
                  <select
                    value={householdEco}
                    onChange={e => setHouseholdEco(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Eco-Friendly / Gentle on Hands</option>
                    <option>Heavy-Duty Disinfectant</option>
                    <option>Long-Lasting Bulk Pack</option>
                  </select>
                </div>
              </div>
            )}

            {/* ELECTRONICS FORM CONTROLS */}
            {category === 'electronics' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Device Setup
                  </label>
                  <select
                    value={deviceCategory}
                    onChange={e => setDeviceCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Study & Productivity Setup (Mouse + Audio)</option>
                    <option>Silent Wireless Mouse for Library</option>
                    <option>Fast Wall Charger & Braided Cable</option>
                    <option>Ergonomic Aluminum Laptop Riser</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Primary Use Environment
                  </label>
                  <select
                    value={electronicsUseCase}
                    onChange={e => setElectronicsUseCase(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>College & Library Study</option>
                    <option>Work From Home & Video Calls</option>
                    <option>Hostel & Shared Room</option>
                    <option>Travel & Commute</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Key Features Wanted
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Silent Clicks', 'Tangle-free Wire / Wireless', 'Multi-device Ergonomics', 'Fast Charge PD 20W', 'High Durability'].map(feat => {
                      const isSel = featuresWanted.includes(feat);
                      return (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => toggleArrayItem(featuresWanted, setFeaturesWanted, feat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSel
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '} {feat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {onCancel && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  joyAudio.playPop();
                  onCancel();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Back to Categories
              </motion.button>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => joyAudio.playPop()}
              className="w-full sm:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>{meta.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};
