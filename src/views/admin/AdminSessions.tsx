import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  Trash2,
  RefreshCw,
  IndianRupee,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminSessions: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSessionDetails, setSelectedSessionDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        if (data.sessions?.length > 0 && !selectedSessionId) {
          fetchSessionDetail(data.sessions[0].sessionId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedSessionId(id);
        setSelectedSessionDetails(data);
      }
    } catch (err) {
      console.error('Failed to fetch session detail:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to purge this session from memory?')) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(sessions.filter(s => s.sessionId !== id));
        if (selectedSessionId === id) {
          setSelectedSessionId(null);
          setSelectedSessionDetails(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Shopping Sessions Memory</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Inspect live multi-turn conversation states, active knapsack plans, and incremental re-planning history.
          </p>
        </div>

        <button
          onClick={fetchSessions}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Sessions</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Sessions</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {sessions.length} recorded
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-xs text-stone-400 py-8 text-center">
                No active shopping sessions recorded yet. Launch a plan from the client store to populate.
              </p>
            ) : (
              sessions.map(s => {
                const isSelected = selectedSessionId === s.sessionId;
                return (
                  <div
                    key={s.sessionId}
                    onClick={() => fetchSessionDetail(s.sessionId)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-stone-50/50 border-stone-200 hover:bg-stone-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] text-stone-800 truncate max-w-[140px]">
                        {s.sessionId}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(s.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-stone-600 mt-1 line-clamp-1 font-medium">{s.latestUserGoal}</p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100 text-[10px] text-stone-500">
                      <span>{s.turnsCount} turns</span>
                      <span className="font-bold text-stone-800">₹{s.latestSpend?.toLocaleString()} spent</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Session Detail View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          {selectedSessionDetails ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                      ID: {selectedSessionDetails.sessionId}
                    </span>
                    <span className="text-xs text-stone-400">
                      Created: {new Date(selectedSessionDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-stone-900 mt-1">
                    {selectedSessionDetails.latestPlan?.requirements?.category?.toUpperCase()} Planning Session
                  </h3>
                </div>

                <button
                  onClick={() => handleDeleteSession(selectedSessionDetails.sessionId)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Purge session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Requirements Extracted */}
              {selectedSessionDetails.latestPlan?.requirements && (
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Extracted Requirements (Stage 2)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Budget Cap</span>
                      <span className="font-bold text-stone-900">
                        ₹{selectedSessionDetails.latestPlan.requirements.budget?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Household</span>
                      <span className="font-bold text-stone-900">
                        {selectedSessionDetails.latestPlan.requirements.people} People
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Duration</span>
                      <span className="font-bold text-stone-900">
                        {selectedSessionDetails.latestPlan.requirements.durationDays} Days
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Dietary</span>
                      <span className="font-bold text-stone-900 capitalize">
                        {selectedSessionDetails.latestPlan.requirements.diet || 'Standard'}
                      </span>
                    </div>
                  </div>

                  {selectedSessionDetails.latestPlan.requirements.existingItems?.length > 0 && (
                    <div className="pt-2 border-t border-stone-200 text-xs">
                      <span className="text-stone-500 font-medium">Pantry Exclusions Omitted: </span>
                      <span className="font-semibold text-emerald-800">
                        {selectedSessionDetails.latestPlan.requirements.existingItems.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Conversational Turn History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Turn-by-Turn History ({selectedSessionDetails.turns?.length || 0} Turns)
                </h4>
                <div className="space-y-3">
                  {(selectedSessionDetails.turns || []).map((t: any) => (
                    <div key={t.turnNumber} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">Turn #{t.turnNumber}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(t.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs text-stone-800 font-medium bg-white p-2.5 rounded-lg border border-stone-200">
                        <span className="text-emerald-700 font-bold block text-[10px] uppercase">User Prompt:</span>
                        &quot;{t.userGoal}&quot;
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed italic">
                        &quot;{t.explanation?.slice(0, 160)}...&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-stone-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select a shopping session from the left panel to inspect its full state.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
