import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  Shirt,
  Heart,
  Home,
  Cpu,
  Bell,
  ShoppingCart,
  Shield,
  Sliders,
  Menu,
  X,
  ArrowUpRight,
  Zap,
  Search,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { joyAudio } from '../../utils/joyEffects';

interface ClientHeaderProps {
  currentView: 'home' | 'category' | 'plan' | 'browse';
  activeCategory: ProductCategory;
  onNavigateHome: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenBasket: () => void;
  onOpenPriceAlerts: () => void;
  onOpenAgentPrompt: () => void;
  onSwitchToAdmin: () => void;
  basketCount: number;
  basketTotal: number;
  alertsCount: number;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  currentView,
  activeCategory,
  onNavigateHome,
  onSelectCategory,
  onOpenBasket,
  onOpenPriceAlerts,
  onOpenAgentPrompt,
  onSwitchToAdmin,
  basketCount,
  basketTotal,
  alertsCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => joyAudio.isEnabled());

  const handleToggleSound = () => {
    const next = joyAudio.toggle();
    setIsSoundOn(next);
    if (next) {
      joyAudio.playCelebrationChime();
    }
  };

  const CATEGORIES: { id: ProductCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'groceries', label: 'Groceries', icon: ShoppingBag },
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'personal_care', label: 'Personal Care', icon: Heart },
    { id: 'household', label: 'Household', icon: Home },
    { id: 'electronics', label: 'Electronics', icon: Cpu }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.span>
              ShopPilot AI 2.0
            </span>
            <span className="hidden sm:inline text-stone-400">|</span>
            <span className="hidden sm:inline text-stone-300">
              Autonomous Everyday Shopping Agent with RAG & Budget Knapsack Optimization
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToAdmin}
              className="inline-flex items-center gap-1 text-stone-300 hover:text-white font-medium transition-colors cursor-pointer text-xs"
              title="Switch to Admin & AI Ops Management Dashboard"
            >
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Admin Portal</span>
              <ArrowUpRight className="w-3 h-3 text-stone-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              joyAudio.playPop();
              onNavigateHome();
            }}
            className="flex items-center gap-2.5 focus:outline-none group text-left cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-emerald-700 transition-colors"
            >
              S
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-stone-900 tracking-tight">ShopPilot</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-stone-600 -mt-0.5 hidden sm:block">Everyday Shopping Planner</p>
            </div>
          </motion.button>
        </div>

        {/* Categories Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              joyAudio.playPop();
              onNavigateHome();
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-emerald-700 bg-emerald-50 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Home
          </motion.button>

          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = currentView === 'category' && activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  joyAudio.playPop();
                  onSelectCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -14, 14, -6, 6, 0] }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center"
                >
                  <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:text-emerald-600 transition-colors" />
                </motion.div>
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Celebratory Sound FX Toggle */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleSound}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSoundOn
                ? 'text-emerald-700 hover:bg-emerald-50 bg-emerald-50/60'
                : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
            }`}
            title={isSoundOn ? 'Celebratory Sounds ON (Click to mute)' : 'Celebratory Sounds Muted (Click to enable)'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* AI Shopping Agent Quick Button with Tailwind Shimmer Sweep & Aura */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              joyAudio.playPop();
              onOpenAgentPrompt();
            }}
            className="relative overflow-hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer group ui-glow-emerald"
          >
            <span className="absolute inset-0 w-full h-full ui-shimmer-sweep opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </motion.div>
            <span className="hidden sm:inline">Ask AI Agent</span>
            <span className="sm:hidden">AI Agent</span>
          </motion.button>

          {/* Price Alerts Icon Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              joyAudio.playPop();
              onOpenPriceAlerts();
            }}
            className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Price Drop Watchlist"
          >
            <motion.div whileHover={{ rotate: [0, -12, 12, -6, 6, 0] }}>
              <Bell className="w-5 h-5" />
            </motion.div>
            {alertsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-2xs"
              >
                {alertsCount}
              </motion.span>
            )}
          </motion.button>

          {/* Shopping Basket Button with Tailwind Card Lift */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              joyAudio.playPop();
              onOpenBasket();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-stone-800 transition-all cursor-pointer ui-card-lift bg-white shadow-2xs"
            title="View Active Basket"
          >
            <div className="relative">
              <motion.div whileHover={{ rotate: [0, -8, 8, 0] }}>
                <ShoppingCart className="w-5 h-5 text-emerald-700" />
              </motion.div>
              {basketCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center"
                >
                  {basketCount}
                </motion.span>
              )}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p className="text-stone-500 leading-none">Plan Basket</p>
              <p className="font-bold text-stone-900 leading-tight">₹{basketTotal.toLocaleString()}</p>
            </div>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => {
              onNavigateHome();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-100"
          >
            Home
          </button>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{cat.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={() => {
                onSwitchToAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Admin Operations Dashboard</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
