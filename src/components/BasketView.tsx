import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  Sparkles,
  AlertCircle,
  Bell,
  TrendingDown,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  Scan,
  Shirt,
  LayoutGrid,
  ListChecks,
  Check,
  CheckCircle2,
  RotateCcw,
  CheckSquare,
  Square,
  ArrowRightLeft,
  Store,
  Tag,
  Info,
  Filter
} from 'lucide-react';
import { BasketItem, Product, ShoppingRequirements } from '../types';
import { ProductCard } from './ProductCard';
import { PriceAlertManager } from '../agent/priceAlertManager';
import { joyAudio, fireCelebrationConfetti } from '../utils/joyEffects';

type ViewMode = 'detailed' | 'checklist';
type ChecklistFilter = 'all' | 'pending' | 'checked';

interface BasketViewProps {
  items: BasketItem[];
  onSwapItem?: (originalId: string, substitute: Product) => void;
  onCompareItem?: (product: Product) => void;
  onSetAlertItem?: (product: Product) => void;
  onUpdateDirectiveItem?: (productId: string, note?: string, tags?: string[]) => void;
  onFeedbackItem?: (productId: string, feedback: 'up' | 'down' | null, reason?: string) => void;
  onInspectProduct?: (product: Product) => void;
  requirements?: ShoppingRequirements;
  onOpenAlertsCenter?: () => void;
}

export const BasketView: React.FC<BasketViewProps> = ({
  items,
  onSwapItem,
  onCompareItem,
  onSetAlertItem,
  onUpdateDirectiveItem,
  onFeedbackItem,
  onInspectProduct,
  requirements,
  onOpenAlertsCenter
}) => {
  const [showWatchlist, setShowWatchlist] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [checklistFilter, setChecklistFilter] = useState<ChecklistFilter>('all');
  const [swappingItemId, setSwappingItemId] = useState<string | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
        <ShoppingCart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
        <p className="font-medium text-stone-700">No items in the recommended basket yet.</p>
        <p className="text-xs text-stone-400 mt-1">Submit your shopping goal above to generate an optimized basket.</p>
      </div>
    );
  }

  // Calculate candidates that are out of budget or unavailable
  const candidates = requirements
    ? PriceAlertManager.findCandidates(requirements, items)
    : { outOfBudget: [], unavailable: [] };

  // Group items by subcategory for neat visual scanning / aisle routing
  const grouped: Record<string, BasketItem[]> = {};
  items.forEach((it) => {
    const subcat = it.product.subcategory || 'General Essentials';
    if (!grouped[subcat]) grouped[subcat] = [];
    grouped[subcat].push(it);
  });

  // Calculate in-store checklist totals
  const totalBasketCost = items.reduce((acc, it) => acc + it.subtotal, 0);
  const checkedItems = items.filter(it => checkedIds.has(it.product.id));
  const pickedCost = checkedItems.reduce((acc, it) => acc + it.subtotal, 0);
  const remainingCost = Math.max(0, totalBasketCost - pickedCost);
  const checkedCount = checkedItems.length;
  const totalCount = items.length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  // Toggle item checked state in checklist
  const toggleItemChecked = (productId: string) => {
    joyAudio.playPop();
    setCheckedIds(prev => {
      const next = new Set(prev);
      const willBeChecked = !next.has(productId);
      if (willBeChecked) {
        next.add(productId);
        // Check if all items now checked
        if (next.size === items.length) {
          joyAudio.playCelebrationChime();
          fireCelebrationConfetti();
        }
      } else {
        next.delete(productId);
      }
      return next;
    });
  };

  const handleMarkAllChecked = () => {
    joyAudio.playCelebrationChime();
    fireCelebrationConfetti();
    setCheckedIds(new Set(items.map(it => it.product.id)));
  };

  const handleResetChecklist = () => {
    joyAudio.playPop();
    setCheckedIds(new Set());
  };

  return (
    <div id="basket-view-container" className="space-y-6">
      {/* Top Header with Title, In-Store Mode Toggle & Price Alerts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900 font-['Outfit'] flex items-center space-x-2">
              <span>Recommended Shopping Basket</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                {items.length} items
              </span>
            </h3>
            {checkedCount > 0 && viewMode === 'detailed' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                {checkedCount}/{items.length} in cart
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {viewMode === 'detailed'
              ? 'Verified items matched against budget, dietary preferences, and nutritional targets'
              : 'Compact aisle checklist for ticking off items in the physical store with live cart totals'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* VIEW MODE TOGGLE (Detailed Grid vs Compact In-Store Checklist) */}
          <div
            id="basket-view-toggle"
            className="inline-flex p-1 bg-stone-100/90 rounded-xl border border-stone-200 shadow-2xs"
            role="tablist"
            aria-label="Basket View Modes"
          >
            <button
              id="basket-toggle-detailed"
              type="button"
              role="tab"
              aria-selected={viewMode === 'detailed'}
              onClick={() => {
                joyAudio.playPop();
                setViewMode('detailed');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'detailed'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-stone-600" />
              <span>Detailed List</span>
            </button>

            <button
              id="basket-toggle-checklist"
              type="button"
              role="tab"
              aria-selected={viewMode === 'checklist'}
              onClick={() => {
                joyAudio.playPop();
                setViewMode('checklist');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'checklist'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>In-Store Checklist</span>
              {checkedCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  viewMode === 'checklist' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {checkedCount}/{totalCount}
                </span>
              )}
            </button>
          </div>

          {onOpenAlertsCenter && (
            <button
              id="view-price-alerts-btn"
              onClick={onOpenAlertsCenter}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Track Price Drops</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Garment Agent Interactive Banner when clothing items exist */}
      {items.some(i => i.product.category === 'clothing') && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 text-white border border-emerald-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Shirt className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white font-['Outfit']">
                  AI Garment Inspector & Outfit Coordinator Active
                </h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                  Interactive Agent
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Hover or click any cloth picture to trigger holographic fabric weave scan, color harmony, and fit suitability.
              </p>
            </div>
          </div>

          {onInspectProduct && (
            <button
              onClick={() => {
                const firstCloth = items.find(i => i.product.category === 'clothing');
                if (firstCloth) onInspectProduct(firstCloth.product);
              }}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Launch Garment Scan</span>
            </button>
          )}
        </motion.div>
      )}

      {/* VIEW MODE 1: COMPACT IN-STORE CHECKLIST VIEW */}
      {viewMode === 'checklist' && (
        <motion.div
          id="in-store-checklist-view"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {/* Checklist Hub Control Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Info & Progress */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 font-['Outfit']">
                        In-Store Aisle Checklist
                      </h4>
                      <p className="text-xs text-stone-500">
                        Tap items as you put them in your trolley
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-2xs">
                    {checkedCount} / {totalCount} picked ({progressPercent}%)
                  </span>
                </div>

                {/* Animated Progress Bar with Tailwind Stripe & Shimmer Effect */}
                <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden p-0.5 border border-stone-300/60 shadow-inner">
                  <motion.div
                    className="bg-emerald-600 h-full rounded-full ui-striped-progress relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div className="absolute inset-0 ui-shimmer-sweep pointer-events-none" />
                  </motion.div>
                </div>
              </div>

              {/* Live Cost Summary Badges with UI Card Lift */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap border-t lg:border-t-0 lg:border-l border-stone-200 pt-3 lg:pt-0 lg:pl-5">
                <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 flex-1 sm:flex-none min-w-[110px] ui-card-lift">
                  <span className="text-[10px] text-stone-500 font-semibold block uppercase tracking-wider">Picked in Cart</span>
                  <span className="text-sm font-bold font-mono text-emerald-700">₹{pickedCost.toLocaleString()}</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 flex-1 sm:flex-none min-w-[110px] ui-card-lift">
                  <span className="text-[10px] text-stone-500 font-semibold block uppercase tracking-wider">Remaining</span>
                  <span className="text-sm font-bold font-mono text-stone-700">₹{remainingCost.toLocaleString()}</span>
                </div>
                <div className="bg-stone-100/90 border border-stone-200/80 rounded-xl px-3 py-2 flex-1 sm:flex-none min-w-[110px] ui-card-lift">
                  <span className="text-[10px] text-stone-500 font-semibold block uppercase tracking-wider">Target Basket</span>
                  <span className="text-sm font-bold font-mono text-stone-900">₹{totalBasketCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Checklist Filters and Action Buttons */}
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500 font-semibold mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-stone-400" /> Filter:
                </span>
                {(['all', 'pending', 'checked'] as ChecklistFilter[]).map(filter => {
                  const label =
                    filter === 'all'
                      ? `All (${totalCount})`
                      : filter === 'pending'
                      ? `Pending (${totalCount - checkedCount})`
                      : `In Cart (${checkedCount})`;
                  const isActive = checklistFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        joyAudio.playPop();
                        setChecklistFilter(filter);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllChecked}
                  disabled={checkedCount === totalCount}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Mark All</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetChecklist}
                  disabled={checkedCount === 0}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-stone-400" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* All Items Picked Celebration Banner */}
          {checkedCount === totalCount && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold font-['Outfit'] text-emerald-900">
                    All {totalCount} Items Picked Into Your Cart!
                  </h5>
                  <p className="text-xs text-emerald-700">
                    Everything on your list is accounted for. Total spent: ₹{pickedCost.toLocaleString()}. Ready for checkout!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  joyAudio.playCelebrationChime();
                  fireCelebrationConfetti();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Celebrate</span>
              </button>
            </motion.div>
          )}

          {/* Compact Checklist Items Grouped by Subcategory / Aisle */}
          <div className="space-y-6">
            {Object.entries(grouped).map(([categoryName, categoryItems]) => {
              // Apply filter
              const filteredItems = categoryItems.filter(item => {
                const isChecked = checkedIds.has(item.product.id);
                if (checklistFilter === 'pending') return !isChecked;
                if (checklistFilter === 'checked') return isChecked;
                return true;
              });

              if (filteredItems.length === 0) return null;

              const aisleCheckedCount = categoryItems.filter(it => checkedIds.has(it.product.id)).length;
              const isAisleComplete = aisleCheckedCount === categoryItems.length;

              return (
                <div key={categoryName} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                  {/* Aisle Section Header */}
                  <div className={`px-4 py-2.5 border-b border-stone-200 flex items-center justify-between transition-colors ${
                    isAisleComplete ? 'bg-emerald-50/70' : 'bg-stone-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-800 font-['Outfit']">
                        {categoryName}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        ({categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isAisleComplete
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {isAisleComplete && <Check className="w-3 h-3 text-emerald-700" />}
                        {aisleCheckedCount} of {categoryItems.length} found
                      </span>
                    </div>
                  </div>

                  {/* Compact Rows */}
                  <div className="divide-y divide-stone-100">
                    {filteredItems.map(item => {
                      const isChecked = checkedIds.has(item.product.id);
                      const isSwapping = swappingItemId === item.product.id;
                      const hasSubstitutes = item.substitutionOptions && item.substitutionOptions.length > 0;

                      return (
                        <div
                          key={item.product.id}
                          className={`p-3.5 sm:px-4 sm:py-3 transition-colors flex flex-col gap-2 ${
                            isChecked
                              ? 'bg-stone-50/60 hover:bg-stone-100/50'
                              : 'bg-white hover:bg-stone-50/70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Tap Checkbox with Accessible Touch Target */}
                            <button
                              type="button"
                              id={`checklist-check-${item.product.id}`}
                              onClick={() => toggleItemChecked(item.product.id)}
                              aria-label={`Toggle check for ${item.product.name}`}
                              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all cursor-pointer border"
                              style={{
                                backgroundColor: isChecked ? '#059669' : '#ffffff',
                                borderColor: isChecked ? '#059669' : '#d6d3d1'
                              }}
                            >
                              {isChecked ? (
                                <motion.div
                                  initial={{ scale: 0.5, rotate: -20 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                  <Check className="w-4 h-4 text-white stroke-[3]" />
                                </motion.div>
                              ) : (
                                <Square className="w-4 h-4 text-stone-300" />
                              )}
                            </button>

                            {/* Product Thumbnail */}
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className={`w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0 bg-stone-100 transition-opacity ${
                                isChecked ? 'opacity-50 grayscale' : 'opacity-100'
                              }`}
                              referrerPolicy="no-referrer"
                            />

                            {/* Center Product Details */}
                            <div
                              className="min-w-0 flex-1 cursor-pointer"
                              onClick={() => toggleItemChecked(item.product.id)}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                                  {item.product.brand}
                                </span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                                  Qty: {item.quantity}
                                </span>
                                {item.product.unit && (
                                  <span className="text-[10px] text-stone-400">
                                    • {item.product.unit}
                                  </span>
                                )}
                              </div>

                              <h5
                                className={`text-sm font-bold text-stone-900 truncate leading-snug transition-all ${
                                  isChecked ? 'line-through text-stone-400 font-medium' : 'text-stone-900'
                                }`}
                              >
                                {item.product.name}
                              </h5>

                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 truncate max-w-[200px]">
                                  {item.whySelected}
                                </span>
                                {item.customNote && (
                                  <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                    Note: {item.customNote}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right Price & Actions */}
                            <div className="text-right flex flex-col items-end flex-shrink-0">
                              <div className="text-sm font-bold font-mono text-stone-900">
                                ₹{item.subtotal.toLocaleString()}
                              </div>
                              {item.quantity > 1 && (
                                <span className="text-[10px] text-stone-400 font-mono">
                                  (₹{item.product.price} each)
                                </span>
                              )}

                              <div className="mt-1 flex items-center gap-1.5">
                                {hasSubstitutes && onSwapItem && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      joyAudio.playPop();
                                      setSwappingItemId(isSwapping ? null : item.product.id);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                                      isSwapping
                                        ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                        : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                                    }`}
                                    title="View aisle substitutions"
                                  >
                                    <ArrowRightLeft className="w-2.5 h-2.5" />
                                    <span>Swap</span>
                                  </button>
                                )}

                                {item.product.category === 'clothing' && onInspectProduct && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onInspectProduct(item.product);
                                    }}
                                    className="p-1 rounded bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
                                    title="Inspect garment fabric"
                                  >
                                    <Scan className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Inline Substitution Drawer in Checklist Mode */}
                          {isSwapping && hasSubstitutes && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                                <span>Can't find this on the shelf? Verified store alternatives:</span>
                                <button
                                  type="button"
                                  onClick={() => setSwappingItemId(null)}
                                  className="text-[11px] text-stone-500 hover:text-stone-800"
                                >
                                  Close
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.substitutionOptions?.map(opt => (
                                  <div
                                    key={opt.substituteProduct.id}
                                    className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between gap-2 shadow-2xs"
                                  >
                                    <div className="min-w-0">
                                      <h6 className="text-xs font-bold text-stone-900 truncate">
                                        {opt.substituteProduct.name}
                                      </h6>
                                      <p className="text-[10px] text-stone-500 truncate">
                                        {opt.reason}
                                      </p>
                                      <span className="text-xs font-mono font-bold text-emerald-700">
                                        ₹{opt.substituteProduct.price.toLocaleString()}
                                        {opt.priceDelta !== 0 && (
                                          <span className="ml-1 text-[10px] font-normal text-stone-500">
                                            ({opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : `-₹${Math.abs(opt.priceDelta)}`})
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        joyAudio.playCelebrationChime();
                                        onSwapItem?.(item.product.id, opt.substituteProduct);
                                        setSwappingItemId(null);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                                    >
                                      Pick This
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* VIEW MODE 2: DETAILED PRODUCT GRID VIEW */}
      {viewMode === 'detailed' && (
        <motion.div
          id="detailed-grid-view"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {Object.entries(grouped).map(([categoryName, categoryItems]) => (
            <div key={categoryName} className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-stone-200 pb-1.5">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {categoryName}
                </h4>
                <span className="text-[11px] text-stone-400">({categoryItems.length} products)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map((item) => (
                  <div key={item.product.id} className="relative">
                    <ProductCard
                      item={item}
                      onSwap={onSwapItem}
                      onCompare={onCompareItem}
                      onSetAlert={onSetAlertItem}
                      onUpdateDirective={onUpdateDirectiveItem}
                      onFeedback={onFeedbackItem}
                      onInspectProduct={onInspectProduct}
                    />
                    {/* Subtle badge indicating if already checked off in in-store checklist */}
                    {checkedIds.has(item.product.id) && (
                      <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3" />
                        <span>In Cart</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Out of Budget & Unavailable Items to Watch */}
      {(candidates.outOfBudget.length > 0 || candidates.unavailable.length > 0) && (
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-4 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-['Outfit']">
                    Out of Budget & Unavailable Items to Watch
                  </h4>
                  <p className="text-xs text-stone-500">
                    High-rated items that exceeded the budget limit or are temporarily out of stock. Track price drops or restock alerts.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWatchlist(!showWatchlist)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 cursor-pointer"
              >
                {showWatchlist ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showWatchlist && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stone-200">
                {candidates.outOfBudget.slice(0, 4).map(({ product, reason }) => {
                  const hasAlert = PriceAlertManager.hasAlert(product.id);
                  return (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between space-x-3 shadow-2xs"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-11 h-11 rounded-lg object-cover bg-stone-100 border border-stone-200 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400">
                          {product.brand}
                        </span>
                        <h5 className="text-xs font-bold text-stone-900 truncate">
                          {product.name}
                        </h5>
                        <p className="text-[10px] text-amber-700 font-medium truncate">
                          {reason}
                        </p>
                        <span className="text-xs font-mono font-bold text-stone-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>

                      {onSetAlertItem && (
                        <button
                          id={`basket-alert-btn-${product.id}`}
                          onClick={() => onSetAlertItem(product)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 flex-shrink-0 transition-colors cursor-pointer ${
                            hasAlert
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-900 text-white hover:bg-stone-800'
                          }`}
                        >
                          <Bell className="w-3 h-3" />
                          <span>{hasAlert ? 'Alert Active' : 'Track Price'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}

                {candidates.unavailable.slice(0, 2).map((product) => {
                  const hasAlert = PriceAlertManager.hasAlert(product.id);
                  return (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between space-x-3 shadow-2xs"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-11 h-11 rounded-lg object-cover bg-stone-100 border border-stone-200 opacity-70 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400">
                          {product.brand}
                        </span>
                        <h5 className="text-xs font-bold text-stone-900 truncate">
                          {product.name}
                        </h5>
                        <span className="text-[10px] text-red-600 font-semibold block">
                          Temporarily Out of Stock
                        </span>
                        <span className="text-xs font-mono font-bold text-stone-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>

                      {onSetAlertItem && (
                        <button
                          id={`basket-unavailable-alert-btn-${product.id}`}
                          onClick={() => onSetAlertItem(product)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 flex-shrink-0 transition-colors cursor-pointer ${
                            hasAlert
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-900 text-white hover:bg-stone-800'
                          }`}
                        >
                          <Bell className="w-3 h-3" />
                          <span>{hasAlert ? 'Alert Active' : 'Notify Restock'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


