import React from 'react';
import { IndianRupee, ArrowDownRight, CheckCircle, AlertCircle, PieChart, Sparkles } from 'lucide-react';
import { BasketOptimizationResult } from '../types';

interface BudgetMeterProps {
  basket: BasketOptimizationResult;
}

export const BudgetMeter: React.FC<BudgetMeterProps> = ({ basket }) => {
  const percentageSpent = Math.min(100, Math.round((basket.optimizedTotal / (basket.budget || 1)) * 100));
  const isWithinBudget = basket.optimizedTotal <= basket.budget;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
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

        {/* Big Key Metric Numbers */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div>
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Budget</span>
            <span className="text-lg font-bold text-stone-900 font-mono">
              ₹{basket.budget.toLocaleString()}
            </span>
          </div>

          <div className="border-l border-stone-200 pl-4 sm:pl-6">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Estimated Total</span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono">
              ₹{basket.optimizedTotal.toLocaleString()}
            </span>
          </div>

          <div className="border-l border-stone-200 pl-4 sm:pl-6">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">Remaining Buffer</span>
            <span className="text-lg font-bold text-stone-700 font-mono">
              ₹{basket.remainingBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar with Tailwind Animated Stripe & Shimmer Effect */}
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
            className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
              isWithinBudget ? 'bg-emerald-600 ui-striped-progress' : 'bg-rose-500'
            }`}
            style={{ width: `${percentageSpent}%` }}
          >
            {/* Subtle light sweep reflection */}
            <div className="absolute inset-0 ui-shimmer-sweep pointer-events-none" />
          </div>
        </div>
      </div>

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
                <strong className="font-bold text-emerald-800 bg-emerald-200/70 px-1.5 py-0.5 rounded-md font-mono">₹{basket.savings.toLocaleString()}</strong> while meeting nutritional constraints.
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
