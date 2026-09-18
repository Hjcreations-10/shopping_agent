import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Tag, Heart, Shirt, Zap, CheckCircle2 } from 'lucide-react';
import { ProductCategory } from '../types';

interface FriendlyLoadingStateProps {
  category?: ProductCategory;
  userGoal?: string;
}

const FRIENDLY_MESSAGES: Record<string, string[]> = {
  default: [
    'Finding the best deals for you...',
    'Scanning verified catalogs for lowest unit prices...',
    'Solving the optimal budget knapsack allocation...',
    'Checking ingredient quality & customer satisfaction...',
    'Adding the final touches to your smart basket...'
  ],
  groceries: [
    'Harvesting the freshest grocery deals...',
    'Balancing ICMR nutrition ratios for your household...',
    'Checking pantry staples against your recipe needs...',
    'Optimizing pulse, grain & produce values...',
    'Almost ready with your wholesome meal plan...'
  ],
  clothing: [
    'Scouting coordinated outfit styles under budget...',
    'Inspecting breathable weaves and wrinkle resistance...',
    'Checking formal & viva dress code appropriateness...',
    'Pairing top & bottom colors for maximum synergy...',
    'Finalizing your presentation-ready look...'
  ],
  personal_care: [
    'Filtering gentle, dermatologist-vetted formulations...',
    'Checking sulfate-free and sensitive skin safety...',
    'Finding top value on daily care essentials...',
    'Assembling your personalized self-care kit...'
  ],
  electronics: [
    'Comparing specs, durability & user review ratings...',
    'Hunting for GaN chargers & quiet accessories...',
    'Verifying genuine brand warranty and compatibility...',
    'Curating your productivity tech upgrades...'
  ],
  household: [
    'Selecting eco-friendly, non-toxic cleaning essentials...',
    'Optimizing multi-surface supplies for long-lasting use...',
    'Computing maximum household cleaning mileage...',
    'Packaging your sparkling clean home essentials...'
  ]
};

const FLOATING_ICONS = [
  { icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  { icon: Tag, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  { icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
  { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  { icon: Shirt, color: 'text-sky-500', bg: 'bg-sky-50 border-sky-200' },
];

export const FriendlyLoadingState: React.FC<FriendlyLoadingStateProps> = ({
  category = 'groceries',
  userGoal
}) => {
  const messages = FRIENDLY_MESSAGES[category] || FRIENDLY_MESSAGES.default;
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="py-14 sm:py-20 max-w-xl mx-auto px-4 text-center select-none">
      {/* Animated Playful Agent Avatar & Floating Items */}
      <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
        {/* Pulsing ambient rings */}
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-emerald-400 blur-md pointer-events-none"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-full border-2 border-dashed border-emerald-400/50 pointer-events-none"
        />

        {/* Central playful robot / bag face */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg flex flex-col items-center justify-center relative z-10 border-2 border-white/60"
        >
          {/* Smiling eyes & smile */}
          <div className="flex items-center space-x-2.5 mb-1">
            <motion.span
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}
              className="w-2.5 h-2.5 rounded-full bg-white block"
            />
            <motion.span
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}
              className="w-2.5 h-2.5 rounded-full bg-white block"
            />
          </div>
          <div className="w-4 h-2 border-b-2 border-white rounded-full" />
          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            className="absolute -top-1.5 -right-1 w-6 h-6 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[11px] shadow-sm font-bold"
          >
            ✨
          </motion.div>
        </motion.div>

        {/* Orbiting playful badges */}
        {FLOATING_ICONS.map((item, idx) => {
          const angle = (idx / FLOATING_ICONS.length) * 2 * Math.PI;
          const radius = 56;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const Icon = item.icon;

          return (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{
                scale: [0.85, 1.1, 0.85],
                y: [y - 3, y + 3, y - 3],
                x: [x, x + 2, x]
              }}
              transition={{
                duration: 2.4 + idx * 0.3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${x - 14}px, ${y - 14}px)` }}
              className={`w-7 h-7 rounded-xl ${item.bg} border shadow-xs flex items-center justify-center ${item.color} z-20`}
            >
              <Icon className="w-3.5 h-3.5" />
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Friendly Message Carousel */}
      <div className="h-14 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-base sm:text-lg font-bold text-stone-900 font-['Outfit']">
              {messages[messageIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtitle with active goal excerpt */}
      <p className="text-xs text-stone-500 max-w-md mx-auto mt-2 line-clamp-2">
        {userGoal ? `Analyzing: "${userGoal}"` : 'AI Shopping Agent is coordinating constraints, real-time prices & verified catalogs.'}
      </p>

      {/* Playful Animated Progress Tracker */}
      <div className="mt-6 max-w-xs mx-auto">
        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden relative">
          <motion.div
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="h-full w-1/2 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 rounded-full"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 font-medium">
          <span>Catalog Match</span>
          <span>•</span>
          <span>Budget Knapsack</span>
          <span>•</span>
          <span>Optimal Cart</span>
        </div>
      </div>
    </div>
  );
};
