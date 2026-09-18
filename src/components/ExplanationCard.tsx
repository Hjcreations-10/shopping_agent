import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { KnowledgeChunk } from '../types';

interface ExplanationCardProps {
  explanation: {
    objective: string;
    budgetStrategy: string;
    nutritionStrategy?: string;
    substitutionsRationale: string;
    trustNotice: string;
  };
  retrievedKnowledge: KnowledgeChunk[];
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  retrievedKnowledge,
}) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-['Outfit']">
            Agent Decision & Grounding Rationale
          </h3>
          <p className="text-xs text-stone-500">
            Transparent explanation grounded in retrieved domain facts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Objective & Goal */}
        <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-100">
          <span className="font-semibold text-stone-900 block mb-1">Shopping Objective:</span>
          <p className="text-stone-700 leading-relaxed">{explanation.objective}</p>
        </div>

        {/* Budget Strategy */}
        <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-100">
          <span className="font-semibold text-stone-900 block mb-1">Budget Allocation Strategy:</span>
          <p className="text-stone-700 leading-relaxed">{explanation.budgetStrategy}</p>
        </div>

        {/* Nutrition or Category Strategy */}
        {explanation.nutritionStrategy && (
          <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-100">
            <span className="font-semibold text-stone-900 block mb-1">Nutritional & Family Coverage:</span>
            <p className="text-stone-700 leading-relaxed">{explanation.nutritionStrategy}</p>
          </div>
        )}

        {/* Substitutions Rationale */}
        <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-100">
          <span className="font-semibold text-stone-900 block mb-1">Substitutions & Trade-Offs:</span>
          <p className="text-stone-700 leading-relaxed">{explanation.substitutionsRationale}</p>
        </div>
      </div>

      {/* RAG Knowledge Citations */}
      {retrievedKnowledge && retrievedKnowledge.length > 0 && (
        <div className="pt-3 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-700 flex items-center mb-2">
            <BookOpen className="w-3.5 h-3.5 text-stone-500 mr-1.5" />
            Grounded Knowledge Guidelines (RAG):
          </span>
          <div className="space-y-1.5">
            {retrievedKnowledge.map((k) => (
              <div
                key={k.id}
                className="p-2 rounded bg-stone-50 border border-stone-100 text-[11px] text-stone-600"
              >
                <div className="flex items-center justify-between font-medium text-stone-800 mb-0.5">
                  <span>{k.title}</span>
                  <span className="text-[10px] text-stone-400 font-mono">Source: {k.source}</span>
                </div>
                <p className="line-clamp-2 text-stone-500">{k.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Trust Notice */}
      <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200 text-[11px] text-stone-500 flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-stone-700">AI Trust & Anti-Hallucination Policy: </strong>
          <span>{explanation.trustNotice}</span>
        </div>
      </div>
    </div>
  );
};
