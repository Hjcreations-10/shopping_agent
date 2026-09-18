import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ShieldCheck,
  ArrowRightLeft,
  Check,
  Sparkles,
  Scale,
  Bell,
  Tag,
  StickyNote,
  X,
  Plus,
  Edit3,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Scan
} from 'lucide-react';
import { BasketItem, Product } from '../types';
import { PriceAlertManager } from '../agent/priceAlertManager';

interface ProductCardProps {
  item: BasketItem;
  onSwap?: (originalId: string, substitute: Product) => void;
  onCompare?: (product: Product) => void;
  onSetAlert?: (product: Product) => void;
  onUpdateDirective?: (productId: string, note?: string, tags?: string[]) => void;
  onFeedback?: (productId: string, feedback: 'up' | 'down' | null, reason?: string) => void;
  onInspectProduct?: (product: Product) => void;
}

const PRESET_TAGS = [
  'Buy 2 if on offer',
  'Must Have',
  'Prefer Organic',
  'Substitute if Cheaper',
  'Stock Up'
];

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onSwap,
  onCompare,
  onSetAlert,
  onUpdateDirective,
  onFeedback,
  onInspectProduct
}) => {
  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const [isEditingDirective, setIsEditingDirective] = useState(false);
  const [noteInput, setNoteInput] = useState(item.customNote || '');
  const [tagsState, setTagsState] = useState<string[]>(item.customTags || []);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(item.userFeedback || null);
  const [feedbackReason, setFeedbackReason] = useState<string | undefined>(item.feedbackReason);

  useEffect(() => {
    setNoteInput(item.customNote || '');
    setTagsState(item.customTags || []);
    setFeedback(item.userFeedback || null);
    setFeedbackReason(item.feedbackReason);
  }, [item.customNote, item.customTags, item.userFeedback, item.feedbackReason]);

  const handleFeedback = (type: 'up' | 'down') => {
    const nextFeedback = feedback === type ? null : type;
    setFeedback(nextFeedback);
    const reason = nextFeedback === 'down' ? feedbackReason : undefined;
    if (onFeedback) {
      onFeedback(product.id, nextFeedback, reason);
    }
  };

  const handleSelectReason = (reason: string) => {
    const nextReason = feedbackReason === reason ? undefined : reason;
    setFeedbackReason(nextReason);
    if (onFeedback && feedback === 'down') {
      onFeedback(product.id, 'down', nextReason);
    }
  };

  const { product, quantity, subtotal, whySelected, scoreBreakdown, substitutionOptions, customNote, customTags, directiveOutcome } = item;
  const existingAlert = PriceAlertManager.hasAlert(product.id);
  const hasDirective = Boolean(customNote || (customTags && customTags.length > 0));

  const handleTogglePresetTag = (tag: string) => {
    if (tagsState.includes(tag)) {
      setTagsState(tagsState.filter(t => t !== tag));
    } else {
      setTagsState([...tagsState, tag]);
      if (tag === 'Buy 2 if on offer' && !noteInput) {
        setNoteInput('buy 2 if on offer');
      } else if (tag === 'Must Have' && !noteInput) {
        setNoteInput('must have essential');
      }
    }
  };

  const handleSaveDirective = () => {
    if (onUpdateDirective) {
      onUpdateDirective(product.id, noteInput, tagsState);
    }
    setIsEditingDirective(false);
  };

  const handleClearDirective = () => {
    setNoteInput('');
    setTagsState([]);
    if (onUpdateDirective) {
      onUpdateDirective(product.id, '', []);
    }
    setIsEditingDirective(false);
  };

  const isTopScore = (scoreBreakdown?.overallScore ?? 0) >= 88;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="bg-white rounded-xl border border-stone-200/90 p-4 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group/card ui-card-lift relative overflow-hidden"
    >
      {/* Top Value Shimmer Accent Bar for High-Score Items */}
      {isTopScore && (
        <div className="absolute top-0 inset-x-0 h-0.5 ui-shimmer-emerald pointer-events-none" />
      )}

      <div>
        {/* Top bar: Brand, Verified badge, Subcategory */}
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
            {product.brand}
          </span>
          <div className="flex items-center space-x-1.5">
            {isTopScore && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-600" />
                Top Pick
              </span>
            )}
            {product.verified && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                Verified
              </span>
            )}
            <span className="text-stone-400 text-[11px]">{product.subcategory}</span>
          </div>
        </div>

        {/* Image & Title with Interactive AI Agent Garment Lens */}
        <div className="flex space-x-3 mb-3">
          <div
            onClick={() => onInspectProduct && onInspectProduct(product)}
            className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0 border border-stone-200 group/img cursor-pointer shadow-inner"
            title={product.category === 'clothing' ? 'Click to scan cloth fabric, fit & outfit synergy' : 'Click to inspect product telemetry'}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-115 group-hover/img:brightness-105"
              referrerPolicy="no-referrer"
            />

            {/* Holographic Laser Scanline on hover */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none shadow-[0_0_8px_#10b981] animate-bounce" />

            {/* Hover Overlay with Agent Scan Badge */}
            <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center">
              <Scan className="w-5 h-5 text-emerald-400 animate-pulse mb-0.5" />
              <span className="text-[9px] font-bold text-white bg-emerald-700/90 px-1.5 py-0.5 rounded-full tracking-tight">
                {product.category === 'clothing' ? 'Cloth Scan' : 'Inspect'}
              </span>
            </div>

            {/* Corner radar ping indicator for clothing */}
            {product.category === 'clothing' && (
              <div className="absolute top-1 left-1 flex items-center gap-0.5 px-1 py-0.2 rounded bg-stone-900/80 text-[8px] font-mono text-emerald-400 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>AI</span>
              </div>
            )}
          </div>

          <div className="overflow-hidden flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1 text-xs text-stone-500">
                <span className="font-medium text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded text-[11px]">
                  {product.unit}
                </span>
                <div className="flex items-center text-amber-600 font-semibold text-[11px]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                  {product.rating}
                  <span className="text-stone-400 font-normal ml-0.5">({product.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Direct Agent Cloth Inspector Action Pill for clothing items */}
            {product.category === 'clothing' && onInspectProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectProduct(product);
                }}
                className="self-start mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-all cursor-pointer shadow-2xs"
              >
                <Scan className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>AI Fabric & Fit Scan</span>
              </button>
            )}
          </div>
        </div>

        {/* Why Selected Rationale & Preference Feedback */}
        <div className="mb-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-xs text-stone-700 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-stone-900 flex items-center text-[11px]">
              <Sparkles className="w-3 h-3 text-emerald-600 mr-1" />
              Why Selected:
            </span>

            {/* Recommendation Feedback Controls (Thumbs Up / Down) with Framer Motion Click Animations */}
            <div className="flex items-center space-x-1.5" title="Rate this recommendation">
              <motion.button
                type="button"
                id={`feedback-up-${product.id}`}
                onClick={() => handleFeedback('up')}
                title="Helpful recommendation (Thumbs Up)"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                animate={
                  feedback === 'up'
                    ? { scale: [1, 1.28, 0.96, 1], rotate: [0, -12, 6, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.35, type: 'spring', stiffness: 450, damping: 15 }}
                className={`relative p-1.5 rounded-md transition-colors flex items-center justify-center text-[11px] cursor-pointer overflow-visible ${
                  feedback === 'up'
                    ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 shadow-xs'
                    : 'text-stone-400 hover:text-emerald-700 hover:bg-emerald-50/80'
                }`}
              >
                {/* Visual ripple burst when rated up */}
                {feedback === 'up' && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-md bg-emerald-400 pointer-events-none"
                  />
                )}
                <motion.div
                  animate={feedback === 'up' ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${feedback === 'up' ? 'fill-emerald-600 text-emerald-700' : ''}`} />
                </motion.div>
              </motion.button>

              <motion.button
                type="button"
                id={`feedback-down-${product.id}`}
                onClick={() => handleFeedback('down')}
                title="Not a good fit (Thumbs Down)"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                animate={
                  feedback === 'down'
                    ? { scale: [1, 1.28, 0.96, 1], rotate: [0, 12, -6, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.35, type: 'spring', stiffness: 450, damping: 15 }}
                className={`relative p-1.5 rounded-md transition-colors flex items-center justify-center text-[11px] cursor-pointer overflow-visible ${
                  feedback === 'down'
                    ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300 shadow-xs'
                    : 'text-stone-400 hover:text-rose-700 hover:bg-rose-50/80'
                }`}
              >
                {/* Visual ripple burst when rated down */}
                {feedback === 'down' && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-md bg-rose-400 pointer-events-none"
                  />
                )}
                <motion.div
                  animate={feedback === 'down' ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <ThumbsDown className={`w-3.5 h-3.5 ${feedback === 'down' ? 'fill-rose-600 text-rose-700' : ''}`} />
                </motion.div>
              </motion.button>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-stone-600">{whySelected}</p>

          {/* Animated Visual Feedback with Framer Motion AnimatePresence */}
          <AnimatePresence mode="wait">
            {feedback === 'up' && (
              <motion.div
                key="feedback-up-confirmation"
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="mt-2 flex items-center justify-between text-[10.5px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs"
              >
                <div className="flex items-center gap-1.5">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="w-2.5 h-2.5" />
                  </motion.div>
                  <span>Preference recorded: Recommendation positively rated</span>
                </div>
                <motion.button
                  type="button"
                  onClick={() => handleFeedback('up')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[10px] text-emerald-600 hover:text-emerald-900 underline ml-2 cursor-pointer whitespace-nowrap"
                  title="Undo feedback"
                >
                  Undo
                </motion.button>
              </motion.div>
            )}

            {feedback === 'down' && (
              <motion.div
                key="feedback-down-tray"
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mt-2 p-2.5 rounded-lg bg-white border border-rose-200 shadow-xs text-[10.5px] space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between text-stone-700">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-mono flex-shrink-0"
                    >
                      !
                    </motion.div>
                    <span>Why is this not a good fit?</span>
                  </div>
                  {substitutionOptions && substitutionOptions.length > 0 && onSwap && (
                    <button
                      type="button"
                      onClick={() => setShowSubstitutes(true)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
                    >
                      View alternatives
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {['Too expensive', "Don't need", 'Brand preference', 'Wrong size/type'].map((reason) => {
                    const isSelected = feedbackReason === reason;
                    return (
                      <motion.button
                        key={reason}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectReason(reason)}
                        className={`px-2 py-0.5 rounded text-[10px] border font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-2xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                        }`}
                      >
                        {reason}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-rose-100">
                  <p className="text-[9.5px] text-stone-500 italic">
                    The agent penalizes similar items during optimization and replanning.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleFeedback('down')}
                    className="text-[9.5px] text-rose-500 hover:text-rose-800 underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Item Directive & Custom Notes Banner / Controls */}
        <div className="mb-3">
          {!isEditingDirective ? (
            hasDirective ? (
              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-emerald-900 font-semibold text-[11px]">
                    <StickyNote className="w-3 h-3 text-emerald-600" />
                    <span>Custom Directive / Note</span>
                  </div>
                  {onUpdateDirective && (
                    <button
                      onClick={() => setIsEditingDirective(true)}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center space-x-0.5 hover:underline"
                    >
                      <Edit3 className="w-2.5 h-2.5 mr-0.5" />
                      Edit
                    </button>
                  )}
                </div>

                {/* Tags Badges */}
                {customTags && customTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {customTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-emerald-800 border border-emerald-300 shadow-2xs"
                      >
                        <Tag className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Custom Note Content */}
                {customNote && (
                  <p className="text-[11px] text-emerald-950 font-medium italic">
                    "{customNote}"
                  </p>
                )}

                {/* Evaluated Outcome by Optimizer */}
                {directiveOutcome && (
                  <div className="pt-1 border-t border-emerald-200 text-[10.5px] text-emerald-800 font-medium leading-tight">
                    {directiveOutcome}
                  </div>
                )}
              </div>
            ) : (
              onUpdateDirective && (
                <button
                  onClick={() => setIsEditingDirective(true)}
                  className="w-full py-1.5 px-2 rounded-lg border border-dashed border-stone-200 hover:border-emerald-400 bg-stone-50/50 hover:bg-emerald-50/40 text-[11px] font-medium text-stone-600 hover:text-emerald-800 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  <span>Add Note / Directive (e.g. 'buy 2 if on offer')</span>
                </button>
              )
            )
          ) : (
            /* Inline Directive Editor */
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-300 space-y-2 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 text-[11px] flex items-center">
                  <Tag className="w-3 h-3 mr-1 text-emerald-600" />
                  Add Custom Note or Tags
                </span>
                <button
                  onClick={() => setIsEditingDirective(false)}
                  className="text-stone-400 hover:text-stone-600 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Preset Directive Pills */}
              <div>
                <span className="text-[10px] text-stone-500 font-medium block mb-1">Quick Directives:</span>
                <div className="flex flex-wrap gap-1">
                  {PRESET_TAGS.map((tag) => {
                    const active = tagsState.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTogglePresetTag(tag)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all ${
                          active
                            ? 'bg-emerald-600 text-white border border-emerald-700 shadow-2xs'
                            : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note Text Input */}
              <div>
                <label className="text-[10px] text-stone-500 font-medium block mb-1">Custom Note for Optimizer:</label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g. buy 2 if on offer, essential for dinner, max ₹200"
                  className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                {hasDirective && (
                  <button
                    type="button"
                    onClick={handleClearDirective}
                    className="text-[10px] text-rose-600 hover:text-rose-800 font-medium hover:underline"
                  >
                    Clear Note
                  </button>
                )}
                <div className="flex items-center space-x-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditingDirective(false)}
                    className="px-2 py-1 rounded text-[11px] text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDirective}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-2xs flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Apply to Optimizer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Score Breakdown Pills */}
        {scoreBreakdown && (
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3 px-1">
            <span>Score: <strong className="text-stone-900 font-semibold">{scoreBreakdown.totalScore}/100</strong></span>
            <span className="text-stone-400">|</span>
            <span>Value: <strong className="text-stone-900 font-semibold">{scoreBreakdown.valueForMoney}</strong></span>
            <span className="text-stone-400">|</span>
            <span>Budget: <strong className="text-stone-900 font-semibold">{scoreBreakdown.budgetFit}</strong></span>
          </div>
        )}
      </div>

      {/* Bottom bar: Pricing, Quantity & Substitution Actions */}
      <div className="pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-base font-bold text-stone-900 font-mono">
                ₹{product.price}
              </span>
              {quantity > 1 && (
                <span className="text-xs text-stone-500 font-medium">
                  × {quantity} = <strong className="font-mono text-stone-900">₹{subtotal}</strong>
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-stone-400 line-through">
                  MRP ₹{product.originalPrice}
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                  Save ₹{product.originalPrice - product.price} (Offer)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            {onSetAlert && (
              <button
                onClick={() => onSetAlert(product)}
                title={existingAlert ? `Alert active: Target ₹${existingAlert.targetPrice}` : "Set Price Drop Alert"}
                className={`p-1.5 rounded-md text-xs transition-colors flex items-center relative ${
                  existingAlert
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'hover:bg-stone-100 text-stone-500 hover:text-stone-800'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${existingAlert ? 'fill-amber-500 text-amber-700' : ''}`} />
                {existingAlert && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
            )}

            {onCompare && (
              <button
                onClick={() => onCompare(product)}
                title="Compare with other items"
                className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-800 text-xs transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}

            {substitutionOptions && substitutionOptions.length > 0 && onSwap && (
              <button
                onClick={() => setShowSubstitutes(!showSubstitutes)}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
              >
                <ArrowRightLeft className="w-3 h-3 mr-1" />
                Swap
              </button>
            )}
          </div>
        </div>

        {/* Substitution Drawer Options */}
        {showSubstitutes && substitutionOptions && (
          <div className="mt-2 pt-2 border-t border-dashed border-stone-200 space-y-2">
            <span className="text-[11px] font-semibold text-stone-700 block">Available Substitutes:</span>
            {substitutionOptions.map((sub, i) => (
              <div
                key={i}
                className="p-2 rounded bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <span className="font-medium text-stone-900 block truncate">{sub.substituteProduct.name}</span>
                  <span className="text-[10px] text-stone-500 block">{sub.reason}</span>
                </div>
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  {onSetAlert && (
                    <button
                      onClick={() => onSetAlert(sub.substituteProduct)}
                      title="Set Alert for this substitute"
                      className="p-1 rounded hover:bg-stone-200 text-stone-500 hover:text-amber-800"
                    >
                      <Bell className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSwap(product.id, sub.substituteProduct);
                      setShowSubstitutes(false);
                    }}
                    className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
