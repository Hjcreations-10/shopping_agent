import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Sliders,
  ArrowRight,
  TrendingDown,
  RotateCcw
} from 'lucide-react';
import { BasketOptimizationResult } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { joyAudio, fireMiniSparkleConfetti } from '../utils/joyEffects';

interface BudgetMeterProps {
  basket: BasketOptimizationResult;
  onReplanBudget?: (newBudget: number) => void;
}

export const BudgetMeter: React.FC<BudgetMeterProps> = ({ basket, onReplanBudget }) => {
  const [showSlider, setShowSlider] = useState(false);
  const [sliderBudget, setSliderBudget] = useState(basket.budget);

  const percentageSpent = Math.min(100, Math.round((basket.optimizedTotal / (basket.budget || 1)) * 100));
  const isWithinBudget = basket.optimizedTotal <= basket.budget;

  const simulatedBuffer = sliderBudget - basket.optimizedTotal;
  const isSimulatedOver = simulatedBuffer < 0;

  const handleApplyBudget = () => {
    if (onReplanBudget && sliderBudget !== basket.budget) {
      joyAudio.playCelebrationChime();
      fireMiniSparkleConfetti();
      onReplanBudget(sliderBudget);
      setShowSlider(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-stone-900 font-['Outfit']">Basket Budget & Optimization</h2>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                isWithinBudget
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {isWithinBudget ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Budget Satisfied ({percentageSpent}% spent)
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Over Budget
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Deterministic Knapsack constraint optimization with substitution solving
          </p>
        </div>

        {/* Big Key Metric Numbers with AnimatedCounter */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div>
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Budget</span>
            <span className="text-lg font-bold text-stone-900 font-mono">
              <AnimatedCounter value={basket.budget} prefix="₹" />
            </span>
          </div>

          <div className="border-l border-stone-200 pl-4 sm:pl-6">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Estimated Total</span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono">
              <AnimatedCounter value={basket.optimizedTotal} prefix="₹" />
            </span>
          </div>

          <div className="border-l border-stone-200 pl-4 sm:pl-6">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Remaining Buffer</span>
            <span className={`text-lg font-bold font-mono ${basket.remainingBudget >= 0 ? 'text-stone-700' : 'text-rose-600'}`}>
              <AnimatedCounter value={basket.remainingBudget} prefix="₹" />
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar with Animated Stripe & Shimmer Effect */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-stone-600 mb-1.5 font-medium">
          <span>₹0</span>
          <span className="font-semibold text-stone-800">
            ₹{basket.optimizedTotal.toLocaleString()} of ₹{basket.budget.toLocaleString()} allocated ({percentageSpent}%)
          </span>
          <span>₹{basket.budget.toLocaleString()}</span>
        </div>
        <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/90 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
              isWithinBudget ? 'bg-emerald-600 ui-striped-progress' : 'bg-rose-500'
            }`}
            style={{ width: `${percentageSpent}%` }}
          >
            <div className="absolute inset-0 ui-shimmer-sweep pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Interactive "What-If?" Budget Simulator Toggle */}
      {onReplanBudget && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setShowSlider(!showSlider);
                setSliderBudget(basket.budget);
                joyAudio.playPop();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showSlider ? 'Close Budget Simulator' : '⚡ Interactive "What-If?" Budget Simulator'}</span>
            </button>

            {showSlider && (
              <button
                onClick={() => setSliderBudget(basket.budget)}
                className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to ₹{basket.budget.toLocaleString()}</span>
              </button>
            )}
          </div>

          <AnimatePresence>
            {showSlider && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-stone-900 font-['Outfit'] block">
                      Slide to Test Alternative Budget Caps
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Drag to simulate higher savings or tighter limits. The agent will re-optimize the basket to match.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-800">
                      Target: ₹{sliderBudget.toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSimulatedOver
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isSimulatedOver
                        ? `₹${Math.abs(simulatedBuffer)} over current`
                        : `₹${simulatedBuffer} buffer`}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min={Math.max(800, Math.round(basket.budget * 0.5))}
                    max={Math.round(basket.budget * 1.8)}
                    step={50}
                    value={sliderBudget}
                    onChange={(e) => setSliderBudget(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>₹{Math.max(800, Math.round(basket.budget * 0.5)).toLocaleString()}</span>
                    <span>Current: ₹{basket.budget.toLocaleString()}</span>
                    <span>₹{Math.round(basket.budget * 1.8).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyBudget}
                    disabled={sliderBudget === basket.budget}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Apply & Re-plan Basket (₹{sliderBudget.toLocaleString()})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Optimization Delta Callout with Ambient Glow Effect */}
      {basket.savings > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50/90 via-emerald-50/60 to-emerald-100/40 border border-emerald-200 flex items-center justify-between text-xs ui-glow-emerald transition-all">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0 ui-ambient-float">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-emerald-950">Intelligent Substitution Savings: </span>
              <span className="text-emerald-900">
                Initial cart estimated at{' '}
                <span className="line-through text-stone-500 font-mono">₹{basket.originalEstimatedTotal.toLocaleString()}</span>. Substituted non-essential brands to save{' '}
                <strong className="font-bold text-emerald-800 bg-emerald-200/70 px-1.5 py-0.5 rounded-md font-mono">
                  <AnimatedCounter value={basket.savings} prefix="₹" />
                </strong> while meeting nutritional constraints.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Balance Breakdown Chips with UI Hover Lift */}
      {basket.categoryBalance && basket.categoryBalance.length > 0 && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-700 block mb-2">Category Balance Breakdown:</span>
          <div className="flex flex-wrap gap-2">
            {basket.categoryBalance.map((cat, i) => (
              <div
                key={i}
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 ui-card-lift"
              >
                <span className="font-medium text-stone-900 mr-1.5">{cat.category}:</span>
                <span className="text-stone-500 mr-1.5">({cat.itemCount} items)</span>
                <span className="font-mono font-semibold text-stone-900">₹{cat.subtotal}</span>
                <span className="text-[10px] text-stone-400 ml-1 font-mono">({cat.percentageOfTotal}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
