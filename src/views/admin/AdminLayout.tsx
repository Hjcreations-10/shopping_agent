import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Activity,
  BookOpen,
  MessageSquareQuote,
  Shield,
  HeartPulse,
  FlaskConical,
  Settings,
  ArrowLeft,
  Search,
  Bell,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
  Lock,
  Cpu
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'sessions'
  | 'agent_ops'
  | 'rag'
  | 'reviews'
  | 'security'
  | 'health'
  | 'tests'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onReturnToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onReturnToStore,
  children
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview & Metrics', icon: LayoutDashboard },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'categories', label: 'Categories Config', icon: FolderTree },
    { id: 'sessions', label: 'Shopping Sessions', icon: ShoppingBag },
    { id: 'agent_ops', label: 'AI Agent Operations', icon: Activity, badge: '8 Stages' },
    { id: 'rag', label: 'RAG Knowledge Base', icon: BookOpen },
    { id: 'reviews', label: 'Review Intelligence', icon: MessageSquareQuote },
    { id: 'security', label: 'Security & Shield', icon: Shield, badge: 'Active' },
    { id: 'health', label: 'System Health', icon: HeartPulse },
    { id: 'tests', label: 'Automated Tests', icon: FlaskConical, badge: '14 Tests' },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-50">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 md:hidden"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 font-black flex items-center justify-center text-base">
                SP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white tracking-tight">ShopPilot Admin</span>
                  <span className="text-[10px] font-semibold bg-emerald-900/60 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-700/50">
                    SaaS Console
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 -mt-0.5 hidden sm:block">AI Orchestrator & Catalog Control Plane</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/90 border border-stone-700 text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>

            {/* Admin User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-800 border border-stone-700 text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                J
              </div>
              <span className="text-stone-300 font-medium">jyothsnasinguluri@gmail.com</span>
              <span className="text-[10px] bg-stone-700 text-stone-300 px-1 rounded uppercase font-semibold">Admin</span>
            </div>

            {/* Return to Client Storefront */}
            <button
              onClick={onReturnToStore}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 shrink-0">
          <div className="p-3 border-b border-stone-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 px-3 py-1">
              Management Modules
            </p>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-emerald-200/80 text-emerald-900'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 text-xs text-stone-500 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span>ADK Orchestrator</span>
              <span className="font-semibold text-emerald-700">v2.4.0</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span>Gemini 3.8 Flash</span>
              <span className="text-emerald-700 font-semibold">Active</span>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setIsMobileSidebarOpen(false)} />
            <aside className="relative flex flex-col w-72 bg-white border-r border-stone-200 p-4 space-y-2 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-bold text-sm text-stone-800">Admin Modules</span>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 rounded text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1 flex-1 overflow-y-auto">
                {NAV_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                        isActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-stone-500" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
