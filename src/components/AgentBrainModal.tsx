import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
  Clock,
  X,
  RefreshCw,
  ExternalLink,
  Layers,
  Database,
  Lock
} from 'lucide-react';
import { joyAudio, fireCelebrationConfetti } from '../utils/joyEffects';

interface AgentBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

const REGISTERED_TOOLS = [
  { name: 'SecurityShield', desc: 'Zero-day prompt injection & input sanitizer', type: 'Defense' },
  { name: 'IntentExtractor', desc: 'Constraint & parameter decomposition', type: 'Reasoning' },
  { name: 'RAGEngine', desc: 'ICMR nutrition standards & fabric care guidelines', type: 'Knowledge' },
  { name: 'CatalogSearch', desc: 'Hard constraint filtering across 80+ products', type: 'Database' },
  { name: 'ReviewIntelligence', desc: 'Aspect sentiment mining from verified buyers', type: 'Sentiment' },
  { name: 'BasketOptimizer', desc: 'Deterministic Knapsack solver & value substitution', type: 'Solver' },
  { name: 'ExplanationSynthesizer', desc: 'Grounded rationale & transparent trade-offs', type: 'Synthesis' },
  { name: 'PriceAlertManager', desc: 'Autonomous price drop & restocking tracker', type: 'Monitoring' }
];

export const AgentBrainModal: React.FC<AgentBrainModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey
}) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; latencyMs?: number; model?: string; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!keyInput.trim()) return;
    setTesting(true);
    setTestResult(null);
    joyAudio.playPop();

    try {
      const res = await fetch('/api/agent/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyInput.trim() })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setTestResult({ ok: true, latencyMs: data.latencyMs, model: data.model });
        joyAudio.playCelebrationChime();
        fireCelebrationConfetti();
      } else {
        setTestResult({ ok: false, error: data.error || 'Connection failed' });
      }
    } catch (err: any) {
      setTestResult({ ok: false, error: err?.message || 'Network error' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    joyAudio.playCelebrationChime();
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
    setTestResult(null);
    joyAudio.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] flex items-center gap-2">
                <span>ShopPilot Agent Brain & API Config</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ADK Core
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Configure live Gemini LLM reasoning or run in deterministic offline mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar text-xs">
          {/* Active Mode Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-950 block text-xs">
                {keyInput.trim() ? 'Online Google Gemini Mode' : 'High-Fidelity Deterministic ADK Mode'}
              </span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                {keyInput.trim()
                  ? 'Your Gemini API key enables real dynamic reasoning for intent extraction, explanation formulation, and conversational Co-Pilot interaction.'
                  : 'Currently operating in 100% offline deterministic mode. Knapsack solver, catalog constraint filtering, and RAG knowledge remain fully operational without requiring an API key.'}
              </p>
            </div>
          </div>

          {/* API Key Input Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="api-key-input" className="font-bold text-stone-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-stone-500" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 text-[11px]"
              >
                <span>Get a free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="api-key-input"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {keyInput && (
                  <button
                    onClick={handleClear}
                    className="text-[11px] text-stone-400 hover:text-stone-700 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleTestKey}
                  disabled={testing || !keyInput.trim()}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-amber-400" />}
                  <span>Test</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-stone-400" />
              <span>Keys are saved locally in your browser session and never shared publicly.</span>
            </p>

            {/* Test Result Callout */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  testResult.ok
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {testResult.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {testResult.ok ? 'Connection Verified!' : 'Verification Failed'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {testResult.ok
                        ? `Live response from ${testResult.model} (${testResult.latencyMs}ms latency)`
                        : testResult.error}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Registered Autonomous Tools Section */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <span className="font-bold text-stone-900 block">
              Autonomous Agent Tool Registry ({REGISTERED_TOOLS.length} Active Tools)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REGISTERED_TOOLS.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 font-mono text-[11px]">{tool.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700 font-semibold uppercase">
                      {tool.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 leading-snug">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
