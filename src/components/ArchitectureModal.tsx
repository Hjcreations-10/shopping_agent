import React from 'react';
import { X, Layers, Cpu, Cloud, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
                System Architecture & AWS Production Blueprint
              </h3>
              <p className="text-xs text-stone-500">
                Google ADK Agent Orchestration & Enterprise Cloud Deployment Blueprint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs / Sections */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6 text-xs text-stone-700">
          {/* Section 1: End-to-End Orchestrator Pipeline */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center">
              <Cpu className="w-4 h-4 text-indigo-600 mr-1.5" />
              1. ShopPilot Backend Autonomous Agent Pipeline
            </h4>
            <div className="bg-stone-900 text-stone-100 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
              {`[1. User Request] ──► Natural language shopping goal or conversational constraint
         │
         ▼
[2. Agent Understands Goal] ──► SecurityShield & Intent Parser extract structured parameters
         │                      (Budget, Headcount, Duration, Dietary, Exclusions, Priorities)
         │
         ▼
[3. Agent Calls Tools] ──► Autonomous tool execution chain:
         │
         ├──► Tool A: RAGEngine.retrieve ──► Retrieves domain knowledge (ICMR, portions, guidelines)
         │
         ├──► Tool B: CatalogSearch.filter ──► Filters verified products (in-stock, dietary, exclusions)
         │
         ├──► Tool C: ReviewIntelligence.analyze ──► Mines customer sentiment, praise, and complaints
         │
         ├──► Tool D: BasketOptimizer.optimize ──► Solves knapsack budget & proposes cost-saving swaps
         │
         ▼
[4. Explains Result] ──► Synthesizes grounded, transparent decision rationale (anti-hallucination)
         │
         ▼
[5. Remembers Session] ──► Backend SessionStore saves conversational turn history & state snapshot
         │
         ▼
[6. Replans On Change] ◄── User updates requirements ("Reduce budget to ₹2,000 and remove paneer")
         │                  Re-planner merges state deltas & re-optimizes without restarting!`}
            </div>
          </div>

          {/* Section 2: AWS Enterprise Production Reference Architecture */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center">
              <Cloud className="w-4 h-4 text-sky-600 mr-1.5" />
              2. AWS Enterprise Reference Architecture
            </h4>
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
              <p className="text-stone-600 text-xs">
                To deploy ShopPilot for tens of thousands of concurrent users in an enterprise retail environment, the system maps seamlessly to AWS managed services:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">LLM Reasoning Engine</strong>
                  <span className="text-stone-600">Amazon Bedrock (Claude 3.5 Sonnet / Amazon Nova Pro) for intent extraction, explanation synthesis, and multi-turn conversational memory.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">Vector Store & Hybrid Search</strong>
                  <span className="text-stone-600">Amazon OpenSearch Serverless (Vector Engine) with Titan Multimodal Embeddings for semantic RAG guidelines and hybrid keyword catalog search.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">Deterministic Compute & APIs</strong>
                  <span className="text-stone-600">AWS Lambda & AWS Fargate (ECS) running deterministic Knapsack optimization algorithms, price math, and category constraint checking.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">State & Catalog Storage</strong>
                  <span className="text-stone-600">Amazon DynamoDB with Single-Table Design for session state, re-planning histories, and active carts; Amazon S3 for verified product media.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">Security & Guardrails</strong>
                  <span className="text-stone-600">Amazon Bedrock Guardrails + AWS WAF to filter malicious prompt injections, PII leakage, and prevent unauthorized policy overrides.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">Observability & Monitoring</strong>
                  <span className="text-stone-600">Amazon CloudWatch Metrics & AWS X-Ray distributed tracing for tool latencies, model token counts, and Knapsack execution performance.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Engineering Discipline & Anti-Hallucination Boundaries */}
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
              3. Anti-Hallucination & Deterministic Guarantees
            </h4>
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 text-stone-700 space-y-2">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>No Price Hallucination:</strong> All prices, pack sizes, and inventory states are strictly bound to verified database records. The LLM is never permitted to calculate subtotals or invent deals.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Deterministic Knapsack:</strong> Budget math and substitution trade-offs are calculated by code, preventing arithmetic errors common in generative models.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Grounded RAG:</strong> Domain guidelines (ICMR nutritional targets, fabric standards, ingredient analysis) are retrieved from categorized knowledge chunks and cited explicitly.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
