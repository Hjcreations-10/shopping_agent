import React from 'react';
import { ShoppingBag, Sparkles, Terminal, ShieldCheck, FileText, Activity, Bell } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenTests: () => void;
  onOpenArch: () => void;
  onOpenObservability: () => void;
  onOpenSecurity: () => void;
  onOpenAlerts?: () => void;
  alertsCount?: number;
  hasTriggeredAlerts?: boolean;
}

const CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: 'groceries', label: 'Groceries', icon: '🍎' },
  { id: 'clothing', label: 'Clothing', icon: '👕' },
  { id: 'personal_care', label: 'Personal Care', icon: '🧴' },
  { id: 'household', label: 'Household', icon: '🏠' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
];

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenTests,
  onOpenArch,
  onOpenObservability,
  onOpenSecurity,
  onOpenAlerts,
  alertsCount = 0,
  hasTriggeredAlerts = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-stone-900 font-['Outfit']">ShopPilot</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  ADK Agent
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">AI Everyday Shopping Planner & Optimizer</p>
            </div>
          </div>

          {/* Category Shortcuts */}
          <nav className="hidden md:flex items-center space-x-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {cat.id === 'groceries' && (
                    <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200 ml-1">
                      Primary
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center space-x-2">
            {onOpenAlerts && (
              <button
                id="header-alerts-btn"
                onClick={onOpenAlerts}
                title="Price Alerts & Tracking"
                className={`p-2 rounded-lg text-xs flex items-center space-x-1.5 transition-colors border relative ${
                  hasTriggeredAlerts
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <Bell className={`w-4 h-4 ${hasTriggeredAlerts ? 'text-amber-700 animate-bounce' : 'text-amber-600'}`} />
                <span className="hidden sm:inline">Alerts</span>
                {alertsCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      hasTriggeredAlerts
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {alertsCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="header-security-btn"
              onClick={onOpenSecurity}
              title="Security & Injection Defense"
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center space-x-1 transition-colors border border-stone-200"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Security</span>
            </button>

            <button
              id="header-tests-btn"
              onClick={onOpenTests}
              title="Run Automated Tests"
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center space-x-1 transition-colors border border-stone-200"
            >
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Test Suite</span>
            </button>

            <button
              id="header-observability-btn"
              onClick={onOpenObservability}
              title="Observability & Tool Logs"
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center space-x-1 transition-colors border border-stone-200"
            >
              <Activity className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Traces</span>
            </button>

            <button
              id="header-arch-btn"
              onClick={onOpenArch}
              title="Architecture & AWS Blueprint"
              className="px-3 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Specs & Arch</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
