import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Mic,
  Search,
  ShoppingBag,
  Shirt,
  Heart,
  Home,
  Cpu,
  CheckCircle,
  TrendingDown,
  ShieldCheck,
  Zap,
  Info,
  Scan
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { joyAudio } from '../../utils/joyEffects';
import { FriendlyLoadingState } from '../../components/FriendlyLoadingState';

interface ClientHomeProps {
  onPromptSubmit: (query: string) => void;
  onSelectCategory: (category: ProductCategory) => void;
  isPlanning: boolean;
}

const PRESET_CHIPS = [
  {
    label: '🥦 7-Day Veg Groceries (₹2,500 / 4 People)',
    query: 'I have ₹2,500 for groceries for 4 people for 7 days. We are vegetarian. We already have rice and cooking oil. Prioritize healthy food and good value.',
    category: 'groceries' as ProductCategory
  },
  {
    label: '👕 College Presentation Outfit (<₹2,500)',
    query: 'I need a comfortable college presentation outfit under ₹2,500. I prefer simple professional colors like sky blue and charcoal.',
    category: 'clothing' as ProductCategory
  },
  {
    label: '🧴 Sulfate-Free Gentle Scalp Care (<₹500)',
    query: 'Find a shampoo under ₹500 with good reviews and gentle sulfate-free ingredients for sensitive scalp.',
    category: 'personal_care' as ProductCategory
  },
  {
    label: '🏠 Eco Kitchen & Disinfectant Pack (<₹800)',
    query: 'Find eco-friendly household dishwash and floor disinfectant supplies under ₹800.',
    category: 'household' as ProductCategory
  },
  {
    label: '📱 Silent Mouse for Library Study (<₹1,000)',
    query: 'Find a silent wireless optical mouse under ₹1,000 with long battery life for library study.',
    category: 'electronics' as ProductCategory
  }
];

const CATEGORY_CARDS: {
  id: ProductCategory;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'groceries',
    title: 'Groceries',
    subtitle: 'Plan affordable everyday groceries',
    description: 'Weekly meal planning for families. Nutritious pulses, fresh greens, dairy and flours optimized against your pantry.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    tag: 'Weekly Essentials',
    icon: ShoppingBag
  },
  {
    id: 'clothing',
    title: 'Clothing',
    subtitle: 'Build outfits within your budget',
    description: 'Coordinated formal presentation shirts, stretch chinos, and accessories matched for college and placement vivas.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    tag: 'Style & Presentation',
    icon: Shirt
  },
  {
    id: 'personal_care',
    title: 'Personal Care',
    subtitle: 'Compare everyday personal-care products',
    description: 'Dermatologist formulations, anti-dandruff sulfate-free scalp washes, aqua-gel sunscreens and gentle cleansers.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    tag: 'Gentle & Vetted',
    icon: Heart
  },
  {
    id: 'household',
    title: 'Household',
    subtitle: 'Find practical household essentials',
    description: 'Plant-derived dishwashing gels, multi-surface disinfectants, and high-absorbency microfiber cleaning cloths.',
    image: 'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=600&auto=format&fit=crop&q=80',
    tag: 'Clean & Eco-friendly',
    icon: Home
  },
  {
    id: 'electronics',
    title: 'Electronics',
    subtitle: 'Compare devices and accessories',
    description: 'Library-quiet silent optical mice, GaN fast wall chargers, ergonomic laptop risers and tangle-free audio cables.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    tag: 'Productivity & Tech',
    icon: Cpu
  }
];

export const ClientHome: React.FC<ClientHomeProps> = ({
  onPromptSubmit,
  onSelectCategory,
  isPlanning
}) => {
  const [queryInput, setQueryInput] = useState<string>(
    'I have ₹2,500 for groceries for 4 people for 7 days. We are vegetarian. We already have rice and cooking oil. Prioritize healthy food and good value.'
  );
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isPlanning) return;
    onPromptSubmit(queryInput.trim());
  };

  const handleVoiceClick = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQueryInput(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      // Gentle simulation fallback
      setIsListening(true);
      setTimeout(() => {
        setQueryInput('I need groceries for 4 people for 7 days under ₹2,500. Vegetarian with high protein.');
        setIsListening(false);
      }, 1000);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION WITH TAILWIND MESH GRADIENT & AMBIENT AURA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 border-b border-stone-200/80 pt-12 pb-16 px-4 sm:px-6 lg:px-8 ui-mesh-gradient">
        {/* Soft atmospheric ambient glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none ui-ambient-float" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autonomous Everyday Shopping Planner</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight font-['Outfit']">
            Shop smarter with <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-6">ShopPilot AI</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Tell us what you need, your budget, and your preferences. ShopPilot researches verified products, compares tradeoffs, retrieves domain guidelines, and optimizes a complete basket.
          </p>

          {/* MAIN PROMPT BAR WITH TAILWIND CARD LIFT & FOCUS GLOW */}
          <div className="pt-4 max-w-3xl mx-auto text-left">
            <form onSubmit={handleSubmit} className="relative">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-emerald-500/80 shadow-md p-2 sm:p-3 transition-all focus-within:border-emerald-600 focus-within:ui-glow-emerald focus-within:shadow-xl ui-card-lift">
                <div className="flex items-start gap-3">
                  <div className="p-2 text-emerald-600 hidden sm:block">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="prompt-input" className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                      What are you looking for today?
                    </label>
                    <textarea
                      id="prompt-input"
                      rows={2}
                      value={queryInput}
                      onChange={e => setQueryInput(e.target.value)}
                      placeholder="e.g. I need groceries for 4 people for 7 days under ₹2,500. We are vegetarian and already have rice..."
                      className="w-full text-sm sm:text-base text-stone-900 placeholder:text-stone-400 resize-none border-none focus:outline-none focus:ring-0 leading-relaxed font-medium bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-1">
                  <button
                    type="button"
                    onClick={handleVoiceClick}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isListening
                        ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                        : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                    }`}
                    title="Speak your shopping requirements"
                  >
                    <Mic className="w-4 h-4 text-emerald-600" />
                    <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                  </button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isPlanning || !queryInput.trim()}
                    onClick={() => joyAudio.playPop()}
                    className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer group"
                  >
                    {/* Button hover light sweep */}
                    <span className="absolute inset-0 w-full h-full ui-shimmer-sweep opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    {isPlanning ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Planning Basket...</span>
                      </>
                    ) : (
                      <>
                        <span>Ask ShopPilot</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>

            {/* Quick preset chips with Playful Bounce */}
            <div className="pt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Try an example:
              </span>
              {PRESET_CHIPS.map(chip => (
                <motion.button
                  key={chip.label}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    joyAudio.playPop();
                    setQueryInput(chip.query);
                    onPromptSubmit(chip.query);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-medium transition-colors border border-stone-200/80 cursor-pointer"
                >
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FRIENDLY LOADING STATE WHEN AGENT IS PLANNING */}
      <AnimatePresence>
        {isPlanning && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto px-4"
          >
            <FriendlyLoadingState userGoal={queryInput} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* SHOPPING CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              <span>Verified Catalog</span>
              <span>•</span>
              <span>Budget-First Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Explore by Shopping Category
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Select a category to customize your budget, household size, and specific preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_CARDS.map(cat => {
            const Icon = cat.icon;
            const isClothCat = cat.id === 'clothing';
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col cursor-pointer ui-card-lift"
                onClick={() => {
                  joyAudio.playPop();
                  onSelectCategory(cat.id);
                }}
              >
                {/* Visual Thumbnail Image */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/85 transition-colors" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-stone-900 shadow-xs backdrop-blur-sm">
                      {cat.tag}
                    </span>

                    {isClothCat && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-stone-950 flex items-center gap-1 shadow-xs font-mono animate-pulse">
                        <Scan className="w-3 h-3" />
                        AI Stylist & Cloth Scanner
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: [0, -15, 15, -8, 8, 0] }}
                        transition={{ duration: 0.4 }}
                        className="w-7 h-7 rounded-lg bg-emerald-600/90 group-hover:bg-emerald-500 flex items-center justify-center text-white transition-colors shadow-xs"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                      <h3 className="font-bold text-lg text-white font-['Outfit'] tracking-tight">{cat.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{cat.subtitle}</h4>
                    <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{cat.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                      {isClothCat ? 'Launch Outfit & Fabric Planner' : 'Set budget & preferences'}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY SHOPEPILOT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-stone-50 rounded-2xl border border-stone-200/80 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Engineered for Grounded, Real-World Reliability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Zero Hallucinations</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Products and prices are strictly verified against our active catalog. ShopPilot never makes up fake SKUs or discount codes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Pantry Reallocation</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Items you already have at home (rice, cooking oil, spices) are omitted, freeing up ₹400+ to reinvest in fresh veggies and protein.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Interactive Directives</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Add custom notes to items like &quot;buy 2 if on offer&quot; or &quot;must have&quot; and watch the orchestrator re-solve the basket dynamically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
