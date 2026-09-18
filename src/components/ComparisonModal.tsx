import React from 'react';
import { X, Star, ShieldCheck, Check, AlertTriangle, Scale } from 'lucide-react';
import { Product } from '../types';
import { ReviewIntelligence } from '../agent/reviewIntelligence';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
                Side-by-Side Product Comparison
              </h3>
              <p className="text-xs text-stone-500">
                Grounded attribute, price-per-unit, and verified review comparison
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

        {/* Modal Content Table / Grid */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className={`grid grid-cols-${products.length > 2 ? 3 : 2} gap-4`}>
            {products.map((p) => {
              const reviewInsight = ReviewIntelligence.analyze(p);
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-stone-200 p-4 bg-stone-50/50 flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Image & Basic info */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-36 object-cover rounded-lg bg-stone-100 mb-3 border border-stone-100"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      {p.brand}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-0.5 mb-2 leading-snug">
                      {p.name}
                    </h4>

                    {/* Price and Unit */}
                    <div className="flex items-baseline space-x-2 mb-3">
                      <span className="text-xl font-extrabold text-stone-900 font-mono">
                        ₹{p.price}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">/{p.unit}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{p.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Rating & Review ratio */}
                    <div className="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1.5 text-xs mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Star Rating:</span>
                        <span className="flex items-center font-bold text-amber-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                          {p.rating} / 5
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-500">
                        <span>Ratings Count:</span>
                        <span className="font-medium text-stone-800">
                          {p.reviewCount.toLocaleString()} ratings
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-500">
                        <span>Verified Ratio:</span>
                        <span className="font-medium text-emerald-700">
                          {Math.round(reviewInsight.verifiedBuyerRatio * 100)}% Verified
                        </span>
                      </div>
                    </div>

                    {/* Positive Review Themes */}
                    <div className="space-y-1.5 text-xs mb-3">
                      <span className="font-semibold text-stone-700 block">Recurring Praise:</span>
                      <div className="space-y-1">
                        {reviewInsight.positiveThemes.slice(0, 3).map((t, idx) => (
                          <div key={idx} className="flex items-start space-x-1.5 text-emerald-800">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-[11px]">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Negative or Cautions */}
                    {reviewInsight.negativeThemes.length > 0 && (
                      <div className="space-y-1 text-xs mb-3">
                        <span className="font-semibold text-stone-700 block">Noted Cautions:</span>
                        {reviewInsight.negativeThemes.slice(0, 2).map((t, idx) => (
                          <div key={idx} className="flex items-start space-x-1.5 text-rose-800">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                            <span className="text-[11px]">{t}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-[11px] text-stone-500 leading-relaxed pt-2 border-t border-stone-200">
                      {p.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
