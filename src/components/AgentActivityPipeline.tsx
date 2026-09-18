import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, ChevronDown, ChevronUp, Layers, Cpu, Sparkles } from 'lucide-react';
import { AgentStep } from '../types';

interface AgentActivityPipelineProps {
  steps: AgentStep[];
  isPlanning: boolean;
  totalLatencyMs?: number;
}

export const AgentActivityPipeline: React.FC<AgentActivityPipelineProps> = ({
  steps,
  isPlanning,
  totalLatencyMs,
}) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    setExpandedStepId(expandedStepId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 font-['Outfit'] flex items-center gap-1.5">
              <span>ADK Agent Execution Pipeline</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-xs text-stone-500">
              Deterministic tools + Gemini reasoning orchestration
            </p>
          </div>
        </div>

        {totalLatencyMs !== undefined && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono font-medium">
              <Clock className="w-3 h-3 mr-1 text-stone-500" />
              {totalLatencyMs} ms total
            </span>
          </div>
        )}
      </div>

      {/* Steps List */}
      <div className="mt-3 space-y-2">
        {steps.map((step, idx) => {
          const isExpanded = expandedStepId === step.id;
          return (
            <motion.div
              key={step.id || idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.2 }}
              className={`rounded-lg border transition-all text-xs ${
                isExpanded
                  ? 'border-indigo-200 bg-indigo-50/30'
                  : 'border-stone-100 bg-stone-50/60 hover:bg-stone-50'
              }`}
            >
              <div
                className="flex items-center justify-between p-2.5 cursor-pointer select-none"
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="flex-shrink-0">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    )}
                  </div>
                  <div className="truncate">
                    <span className="font-medium text-stone-900 mr-2">{step.title}</span>
                    <span className="text-[11px] font-mono text-stone-500">({step.agentName})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="font-mono text-[11px] text-stone-500">{step.durationMs}ms</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Step Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 pb-3 pt-1 border-t border-stone-100 space-y-2 text-stone-700 overflow-hidden"
                  >
                    <p className="text-xs">{step.summary}</p>
                    {step.toolUsed && (
                      <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded">
                        Tool invoked: {step.toolUsed}
                      </div>
                    )}
                    {step.outputPayload && (
                      <div className="bg-stone-900 text-stone-100 p-2 rounded text-[11px] font-mono overflow-x-auto max-h-36">
                        <pre>{JSON.stringify(step.outputPayload, null, 2)}</pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {isPlanning && (
          <div className="flex items-center space-x-2.5 p-3 rounded-lg border border-indigo-200 bg-indigo-50/50 text-xs text-indigo-900 animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <span className="font-medium">Orchestrator reasoning and optimizing constraints...</span>
          </div>
        )}
      </div>
    </div>
  );
};
