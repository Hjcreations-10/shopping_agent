import React, { useState } from 'react';
import { RefreshCw, Send, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface ReplanningConsoleProps {
  onReplan: (query: string) => void;
  isReplanning: boolean;
}

const QUICK_REPLAN_CHIPS = [
  'Remove paneer and add more vegetables. Keep the total below ₹2,500.',
  'Reduce my budget to ₹2,200 and prioritize protein.',
  'Switch to 100% vegan products.',
  'Prioritize budget value and save at least ₹300.',
];

export const ReplanningConsole: React.FC<ReplanningConsoleProps> = ({
  onReplan,
  isReplanning,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isReplanning) return;
    onReplan(query.trim());
    setQuery('');
  };

  const handleChipClick = (chipQuery: string) => {
    if (isReplanning) return;
    onReplan(chipQuery);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <RefreshCw className={`w-4 h-4 ${isReplanning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-['Outfit']">
              Dynamic Re-Planning Console
            </h3>
            <p className="text-xs text-stone-500">
              Iteratively adjust budget, dietary rules, or items while preserving session state
            </p>
          </div>
        </div>
      </div>

      {/* Quick Adjustment Chips */}
      <div className="mb-3">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
          Quick Demo Re-Plans:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_REPLAN_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              disabled={isReplanning}
              onClick={() => handleChipClick(chip)}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 hover:border-amber-300 text-stone-700 transition-colors text-left"
            >
              <Zap className="w-3 h-3 text-amber-500 mr-1.5 flex-shrink-0" />
              <span>{chip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Freeform input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isReplanning}
          placeholder="e.g. Remove paneer and add more vegetables. Keep total below ₹2,500..."
          className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={isReplanning || !query.trim()}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
        >
          {isReplanning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Re-planning...</span>
            </>
          ) : (
            <>
              <span>Re-plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
