import React, { useState } from 'react';
import { X, Activity, Clock, ShieldCheck, Database, Cpu, Terminal, CheckCircle, History, RotateCcw } from 'lucide-react';
import { AgentStep } from '../types';

interface ObservabilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
  observability?: {
    totalLatencyMs: number;
    modelCallsCount: number;
    retrievalCount: number;
    toolCallsCount: number;
    cacheHit: boolean;
    securityCheckPassed: boolean;
  };
  steps: AgentStep[];
}

export const ObservabilityDrawer: React.FC<ObservabilityDrawerProps> = ({
  isOpen,
  onClose,
  sessionId,
  observability,
  steps,
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'session'>('telemetry');
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const fetchSessionHistory = async () => {
    if (!sessionId) return;
    setIsLoadingSession(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSessionData(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingSession(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && activeTab === 'session' && sessionId) {
      fetchSessionHistory();
    }
  }, [isOpen, activeTab, sessionId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-['Outfit']">
                Observability & Session Traces
              </h3>
              <p className="text-xs text-stone-500">Live Agent Telemetry & Memory Log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-100 px-4 bg-stone-50/50">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'telemetry'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Live Execution & Tools
          </button>
          <button
            onClick={() => setActiveTab('session')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'session'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Session Memory ({sessionData?.turnCount || 1})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5 text-xs">
          {activeTab === 'telemetry' ? (
            <>
              {observability && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                      Total Latency
                    </span>
                    <span className="text-base font-bold text-stone-900 font-mono mt-0.5 block flex items-center">
                      <Clock className="w-3.5 h-3.5 text-stone-400 mr-1" />
                      {observability.totalLatencyMs} ms
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                      Tool Executions
                    </span>
                    <span className="text-base font-bold text-indigo-700 font-mono mt-0.5 block flex items-center">
                      <Cpu className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                      {observability.toolCallsCount} tools called
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                      RAG Chunks Retrieved
                    </span>
                    <span className="text-base font-bold text-stone-900 font-mono mt-0.5 block flex items-center">
                      <Database className="w-3.5 h-3.5 text-stone-400 mr-1" />
                      {observability.retrievalCount} chunks
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                      Security Defense
                    </span>
                    <span className="text-base font-bold text-emerald-700 font-mono mt-0.5 block flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                      {observability.securityCheckPassed ? 'Verified Safe' : 'Threat Quarantined'}
                    </span>
                  </div>
                </div>
              )}

              {/* Execution Timeline */}
              <div>
                <h4 className="font-semibold text-stone-900 text-xs mb-2 flex items-center">
                  <Terminal className="w-3.5 h-3.5 text-stone-500 mr-1.5" />
                  Step-by-Step Tool Trace Logs
                </h4>
                <div className="space-y-2">
                  {steps.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 text-[11px]">
                      <div className="flex items-center justify-between font-semibold text-stone-800 mb-1">
                        <span>{idx + 1}. {s.title}</span>
                        <span className="font-mono text-stone-500">{s.durationMs}ms</span>
                      </div>
                      <div className="text-stone-500 text-[10px] font-mono mb-1">
                        Agent: {s.agentName} | Tool: {s.toolUsed || 'none'}
                      </div>
                      <p className="text-stone-600 line-clamp-2">{s.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-800">
                  Session ID: <span className="font-mono text-stone-600">{sessionId}</span>
                </span>
                <button
                  onClick={fetchSessionHistory}
                  disabled={isLoadingSession}
                  className="p-1 rounded text-stone-500 hover:text-stone-800"
                  title="Refresh Session Memory"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isLoadingSession ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {sessionData?.history ? (
                <div className="space-y-3">
                  {sessionData.history.map((turn: any, idx: number) => (
                    <div
                      key={turn.id || idx}
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                          Turn {idx + 1}: {turn.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(turn.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-stone-800 font-medium italic">
                        "{turn.userQuery}"
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px] text-stone-600">
                        <span>Budget: ₹{turn.requirements.budget}</span>
                        <span>Cart Total: ₹{turn.basketTotal}</span>
                        <span>Items: {turn.itemCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-stone-400 bg-stone-50 rounded-xl">
                  {isLoadingSession ? 'Loading session turns...' : 'Current turn recorded in memory.'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
