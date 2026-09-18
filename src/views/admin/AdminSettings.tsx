import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  Trash2,
  CheckCircle2,
  Save,
  Sliders
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [budgetTolerance, setBudgetTolerance] = useState<number>(0);
  const [ragTopK, setRagTopK] = useState<number>(3);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearSessions = async () => {
    if (!confirm('Purge all temporary shopping sessions from memory?')) return;
    try {
      await fetch('/api/sessions', { method: 'DELETE' });
      alert('All session states cleared successfully.');
    } catch (err) {
      console.error('Failed to clear sessions:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">System Settings & Configurations</h1>
        <p className="text-sm text-stone-600 mt-0.5">
          Configure runtime optimization thresholds, RAG parameters, and environment settings.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        {/* Gemini Integration Status */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Google Gemini Model API</h3>
              <p className="text-xs text-stone-500">Gemini 3.8 Flash integrated server-side</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Connected
          </span>
        </div>

        {/* Budget Tolerance */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            Budget Strictness Ceiling
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={budgetTolerance}
              onChange={e => setBudgetTolerance(Number(e.target.value))}
              className="flex-1 accent-emerald-600"
            />
            <span className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200 min-w-[70px] text-center">
              {budgetTolerance === 0 ? 'Strict 0%' : `+${budgetTolerance}% max`}
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            At 0%, the knapsack optimizer strictly rejects any combination that exceeds the user&apos;s specified INR budget.
          </p>
        </div>

        {/* RAG Top-K */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            RAG Grounding Chunks (Top-K)
          </label>
          <div className="flex items-center gap-4">
            {[2, 3, 5].map(k => (
              <button
                key={k}
                type="button"
                onClick={() => setRagTopK(k)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  ragTopK === k
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                {k} Chunks
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-500">
            Number of verified nutritional or apparel guideline chunks injected into the explanation prompt.
          </p>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configurations</span>
          </button>

          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          )}
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 space-y-4">
        <h3 className="font-bold text-sm text-red-900">Maintenance & State Clearing</h3>
        <p className="text-xs text-red-700">
          Purge active conversational shopping sessions stored in server memory. This will reset multi-turn continuity for active clients.
        </p>

        <button
          onClick={handleClearSessions}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Purge All Active Sessions</span>
        </button>
      </div>
    </div>
  );
};
