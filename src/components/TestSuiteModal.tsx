import React, { useState } from 'react';
import { X, Play, CheckCircle2, XCircle, Clock, Terminal, RotateCw } from 'lucide-react';
import { TestResult } from '../types';
import { TestRunner } from '../agent/testRunner';

interface TestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestSuiteModal: React.FC<TestSuiteModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    summary: { total: number; passed: number; failed: number; totalDurationMs: number };
    results: TestResult[];
  } | null>(null);

  if (!isOpen) return null;

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      // Call test endpoint or direct test runner
      const res = await fetch('/api/test/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTestResults(data);
      } else {
        const fallback = await TestRunner.runAllTests();
        setTestResults(fallback);
      }
    } catch {
      const fallback = await TestRunner.runAllTests();
      setTestResults(fallback);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
                Automated Verification & Test Suite
              </h3>
              <p className="text-xs text-stone-500">
                Unit tests, agent constraints, price alerts, and all 8 End-to-End hackathon scenarios
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

        {/* Controls and Summary Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {testResults ? (
              <div className="flex items-center space-x-3 text-xs">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {testResults.summary.passed} of {testResults.summary.total} Passed
                </span>
                <span className="text-stone-500 font-mono">
                  Duration: {testResults.summary.totalDurationMs} ms
                </span>
              </div>
            ) : (
              <span className="text-xs text-stone-600">Click "Run All Scenarios" to execute automated test validation.</span>
            )}
          </div>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
          >
            {isRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Test Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run All Scenarios</span>
              </>
            )}
          </button>
        </div>

        {/* Test Result List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {testResults ? (
            testResults.results.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  t.status === 'passed'
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-rose-200 bg-rose-50/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {t.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    )}
                    <span className="font-bold text-stone-900">{t.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-600 text-[10px]">
                      {t.category}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500">{t.executionTimeMs}ms</span>
                </div>
                <p className="mt-1.5 text-stone-700 pl-6 text-[11px]">{t.details}</p>
                {t.assertion && (
                  <div className="mt-1 font-mono text-[10px] text-stone-500 pl-6">
                    Assertion: {t.assertion}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-stone-400 text-xs">
              Automated tests have not been executed yet. Click above to run the 8 end-to-end and unit scenarios.
            </div>
          )}
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
