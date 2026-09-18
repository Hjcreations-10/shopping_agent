import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Search,
  BookOpen,
  Filter,
  MessageSquareQuote,
  Sliders,
  CheckCircle2,
  Clock,
  Zap,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const AdminAgentOps: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent/pipeline');
      if (res.ok) {
        const data = await res.json();
        setPipelineData(data);
      }
    } catch (err) {
      console.error('Failed to fetch agent pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const STAGE_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
    1: Shield,
    2: Search,
    3: BookOpen,
    4: Filter,
    5: MessageSquareQuote,
    6: Sliders,
    7: CheckCircle2,
    8: Clock
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">AI Agent Operations & Pipeline</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Architecture and execution orchestration of the Google ADK Autonomous Shopping Planner.
          </p>
        </div>

        <button
          onClick={fetchPipeline}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* ADK Pipeline Architecture Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ADK
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">8-Stage Deterministic Orchestration Pipeline</h3>
              <p className="text-xs text-stone-500">Autonomous loop from user intent to verifiable basket solution</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Active in Production
          </span>
        </div>

        {/* 8 Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(pipelineData?.pipeline || [
            {
              stage: 1,
              name: 'Security Shield & Sanitization',
              description: 'Defends against prompt injections, extracts sanitized text, and neutralizes untrusted catalog payloads',
              tool: 'SecurityShield.scan'
            },
            {
              stage: 2,
              name: 'Intent Understanding & Goal Extraction',
              description: 'Extracts category, numeric INR budget, household size, planning duration, pantry stock, exclusions, and priority attributes',
              tool: 'ShoppingOrchestrator.extractRequirements'
            },
            {
              stage: 3,
              name: 'Knowledge & RAG Retrieval',
              description: 'Retrieves verified domain guidelines, ICMR dietary ratios, portion sizing, and apparel rules',
              tool: 'RAGEngine.retrieve'
            },
            {
              stage: 4,
              name: 'Product Search & Hard Filtering',
              description: 'Filters live catalog products by category, in-stock availability, dietary restrictions, and pantry exclusions',
              tool: 'CatalogSearch.filter (VERIFIED_CATALOG)'
            },
            {
              stage: 5,
              name: 'Review Intelligence & Sentiment Synthesis',
              description: 'Mines verified customer reviews for recurring positive praise (freshness, durability) and flags negative signals',
              tool: 'ReviewIntelligence.analyzeBatch'
            },
            {
              stage: 6,
              name: 'Deterministic Basket Optimization & Substitutions',
              description: 'Solves budget knapsack optimization, calculates multi-attribute scores, balances categories, and proposes cheaper swaps',
              tool: 'BasketOptimizer.optimize'
            },
            {
              stage: 7,
              name: 'Grounded Decision Explanation',
              description: 'Synthesizes transparent rationale explaining budget strategy, nutritional coverage, and substitution tradeoffs',
              tool: 'ShoppingOrchestrator.generateExplanation'
            },
            {
              stage: 8,
              name: 'Session Memory & Dynamic Re-planning',
              description: 'Maintains conversational state across turns and updates plans incrementally when user modifies requirements',
              tool: 'SessionStore + ShoppingOrchestrator.replan'
            }
          ]).map((st: any) => {
            const Icon = STAGE_ICONS[st.stage] || Activity;
            return (
              <div
                key={st.stage}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-emerald-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                      {st.stage}
                    </span>
                    <h4 className="font-bold text-stone-900 text-xs">{st.name}</h4>
                  </div>
                  <Icon className="w-4 h-4 text-emerald-600" />
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{st.description}</p>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-stone-400 uppercase font-semibold">Specialized Tool:</span>
                  <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {st.tool}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
