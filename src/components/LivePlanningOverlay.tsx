import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Search,
  BookOpen,
  Cpu,
  Star,
  CheckCircle2,
  Clock,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { ProductCategory } from '../types';

interface LivePlanningOverlayProps {
  userGoal: string;
  category?: ProductCategory;
}

const STAGES = [
  { id: 'sec', name: 'Security & Safety Shield', icon: ShieldCheck, tool: 'SecurityShield.scan', desc: 'Sanitizing prompt and verifying injection defense' },
  { id: 'intent', name: 'Constraint & Intent Extraction', icon: Search, tool: 'IntentExtractor', desc: 'Decomposing budget, headcount, days, and pantry exclusions' },
  { id: 'rag', name: 'Domain Knowledge Grounding', icon: BookOpen, tool: 'RAGEngine.retrieve', desc: 'Retrieving ICMR nutritional guidelines and fabric care standards' },
  { id: 'catalog', name: 'Catalog Constraint Filtering', icon: ShoppingBag, tool: 'CatalogSearch.filter', desc: 'Scanning verified products, stock, and dietary rules' },
  { id: 'review', name: 'Aspect Review Sentiment Mining', icon: Star, tool: 'ReviewIntelligence.analyze', desc: 'Filtering misleading reviews & verifying buyer satisfaction' },
  { id: 'knapsack', name: 'Knapsack Budget Optimization', icon: Cpu, tool: 'BasketOptimizer.solve', desc: 'Solving exact rupee ceiling and value substitutions' },
  { id: 'synthesis', name: 'Decision Rationale Synthesis', icon: Sparkles, tool: 'ExplanationSynthesizer', desc: 'Formulating transparent justification and nutritional stats' }
];

export const LivePlanningOverlay: React.FC<LivePlanningOverlayProps> = ({
  userGoal,
  category = 'groceries'
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Elapsed timer
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Stage progression animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStageIndex(prev => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-10 max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-500/30 p-6 sm:p-8 shadow-xl ui-glow-emerald"
      >
        {/* Top Header with Glowing Agent Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-stone-100">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
            {/* Spinning orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-1 rounded-2xl border-2 border-dashed border-emerald-400/60 pointer-events-none"
            />
            <Cpu className="w-8 h-8 text-white animate-pulse" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-between flex-wrap gap-2">
              <h2 className="text-lg font-bold text-stone-900 font-['Outfit'] flex items-center gap-2">
                <span>ShopPilot Autonomous Execution</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
              </h2>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono text-xs">
                <Clock className="w-3 h-3 mr-1 text-stone-500" />
                {elapsedMs} ms elapsed
              </span>
            </div>

            <p className="text-xs text-stone-500 line-clamp-2">
              Goal: &ldquo;<span className="font-medium text-stone-700">{userGoal}</span>&rdquo;
            </p>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-stone-500 mb-1.5 font-medium">
            <span>Executing Tool Pipeline</span>
            <span className="font-mono text-emerald-700 font-bold">
              Stage {activeStageIndex + 1} of {STAGES.length}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <motion.div
              initial={{ width: '5%' }}
              animate={{ width: `${Math.round(((activeStageIndex + 1) / STAGES.length) * 100)}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 ui-shimmer-sweep" />
            </motion.div>
          </div>
        </div>

        {/* Live Stage Execution List */}
        <div className="mt-6 space-y-2.5">
          {STAGES.map((stage, idx) => {
            const isDone = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex;
            const isPending = idx > activeStageIndex;
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-xs ui-glow-emerald'
                    : isDone
                      ? 'bg-white border-stone-200/80 text-stone-600'
                      : 'bg-stone-50/50 border-stone-100 text-stone-400'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="flex-shrink-0">
                    {isDone ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center font-mono text-[10px]">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${isCurrent ? 'text-emerald-950 font-[\'Outfit\']' : isDone ? 'text-stone-800' : 'text-stone-400'}`}>
                        {stage.name}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        [{stage.tool}]
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                      Active
                    </span>
                  )}
                  {isDone && (
                    <span className="text-emerald-600 font-bold text-[11px]">
                      Done
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
