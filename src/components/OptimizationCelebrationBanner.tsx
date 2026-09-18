import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PartyPopper, ThumbsUp, Heart, CheckCircle2, TrendingDown, Volume2, VolumeX } from 'lucide-react';
import { AgentPlanResponse } from '../types';
import { fireCelebrationConfetti, joyAudio } from '../utils/joyEffects';

interface OptimizationCelebrationBannerProps {
  plan: AgentPlanResponse;
  onDismiss?: () => void;
}

const EMOJI_REACTIONS = [
  { emoji: '😍', label: 'Love it!' },
  { emoji: '👏', label: 'Spot on!' },
  { emoji: '🚀', label: 'Super smart!' },
  { emoji: '👍', label: 'Great value!' },
  { emoji: '🎉', label: 'Excited!' }
];

export const OptimizationCelebrationBanner: React.FC<OptimizationCelebrationBannerProps> = ({
  plan,
  onDismiss
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const budget = plan.requirements.budgetLimit;
  const total = plan.basket.totalPrice;
  const savings = Math.max(0, budget - total);
  const itemCount = plan.basket.items.length;

  const handleReact = (emoji: string) => {
    setSelectedEmoji(emoji);
    joyAudio.playPop();
  };

  const handleBurstConfetti = () => {
    joyAudio.playCelebrationChime();
    fireCelebrationConfetti();
  };

  if (isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 350, damping: 25 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-4 sm:p-5 text-white shadow-lg border border-emerald-300/40 ui-glow-emerald"
    >
      {/* Dynamic light sweep reflection across banner */}
      <div className="absolute inset-0 w-full h-full ui-shimmer-sweep opacity-20 pointer-events-none" />

      {/* Decorative background confetti dots */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-amber-300/20 blur-lg pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Joyful emoji and messaging */}
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Animated bouncing smiling avatar / emoji */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -8, 8, 0]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl flex-shrink-0 shadow-inner border border-white/30 cursor-pointer"
            onClick={handleBurstConfetti}
            title="Click for celebratory confetti!"
          >
            {selectedEmoji || '🥳'}
          </motion.div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] tracking-tight flex items-center gap-1.5">
                <span>Basket Optimally Planned!</span>
                <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200 animate-pulse" />
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/25 text-white font-mono border border-white/20">
                100% Budget Adherent
              </span>
            </div>

            <p className="text-xs text-emerald-50/90 mt-0.5">
              {savings > 0 ? (
                <span>
                  Woohoo! You stay <strong className="text-white font-bold underline decoration-amber-300">₹{savings.toLocaleString('en-IN')} under budget</strong> across all {itemCount} recommended items.
                </span>
              ) : (
                <span>
                  Exact optimal allocation across all {itemCount} items without compromising quality or household needs.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Joyful reactions and actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Interactive Emoji Feedback Bar */}
          <div className="flex items-center bg-black/15 backdrop-blur-xs rounded-xl p-1 border border-white/20">
            <span className="text-[11px] text-white/80 font-medium px-2 hidden sm:inline">Rate plan:</span>
            {EMOJI_REACTIONS.map(({ emoji, label }) => {
              const isSelected = selectedEmoji === emoji;
              return (
                <motion.button
                  key={emoji}
                  type="button"
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleReact(emoji)}
                  title={label}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-stone-900 shadow-sm scale-110 font-bold'
                      : 'hover:bg-white/20 text-white'
                  }`}
                >
                  {emoji}
                </motion.button>
              );
            })}
          </div>

          {/* Confetti Trigger Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleBurstConfetti}
            className="px-3 py-1.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <PartyPopper className="w-3.5 h-3.5 text-amber-500" />
            <span>Celebrate!</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
