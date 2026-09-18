import React, { useState } from 'react';
import { X, Bell, TrendingDown, PackageCheck, AlertCircle, Check, Sparkles, Mail } from 'lucide-react';
import { Product, PriceAlert } from '../types';
import { PriceAlertManager } from '../agent/priceAlertManager';

interface PriceAlertModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAlertSaved: (alert: PriceAlert) => void;
  currentRemainingBudget?: number;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  product,
  isOpen,
  onClose,
  onAlertSaved,
  currentRemainingBudget
}) => {
  if (!isOpen || !product) return null;

  const existingAlert = PriceAlertManager.hasAlert(product.id);

  const default10Percent = Math.round(product.price * 0.9);
  const default20Percent = Math.round(product.price * 0.8);
  const defaultRemaining = currentRemainingBudget && currentRemainingBudget > 0 && currentRemainingBudget < product.price
    ? currentRemainingBudget
    : null;

  const [targetPrice, setTargetPrice] = useState<number>(
    existingAlert ? existingAlert.targetPrice : default10Percent
  );
  const [notifyOnStock, setNotifyOnStock] = useState<boolean>(
    existingAlert ? existingAlert.notifyOnStock : !product.inStock
  );
  const [email, setEmail] = useState<string>(existingAlert?.emailNotification || 'shopper@example.com');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;

    const alert = PriceAlertManager.createAlert({
      product,
      targetPrice,
      notifyOnStock,
      emailNotification: email
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onAlertSaved(alert);
      onClose();
    }, 600);
  };

  const discountPercent = Math.max(0, Math.round(((product.price - targetPrice) / product.price) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
                {existingAlert ? 'Update Price Alert' : 'Set Price Alert'}
              </h3>
              <p className="text-xs text-stone-500">
                Track price drops and restock availability
              </p>
            </div>
          </div>
          <button
            id="close-price-alert-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Product Summary Card */}
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover bg-stone-100 flex-shrink-0 border border-stone-200"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block">
                {product.brand}
              </span>
              <h4 className="text-sm font-bold text-stone-900 truncate">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-bold text-stone-900 font-mono">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-stone-400">({product.unit})</span>
                {!product.inStock && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-700 border border-red-200">
                    Currently Unavailable
                  </span>
                )}
                {product.inStock && currentRemainingBudget && product.price > currentRemainingBudget && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    Exceeds remaining ₹{currentRemainingBudget}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Target Presets */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Notify me when price drops to:</span>
              {discountPercent > 0 && (
                <span className="text-amber-700 font-bold text-[11px] flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {discountPercent}% drop needed
                </span>
              )}
            </label>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                id="preset-10-percent"
                onClick={() => setTargetPrice(default10Percent)}
                className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                  targetPrice === default10Percent
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="block text-[10px] text-stone-500 font-normal">10% Drop</span>
                <span className="font-mono font-bold">₹{default10Percent}</span>
              </button>

              <button
                type="button"
                id="preset-20-percent"
                onClick={() => setTargetPrice(default20Percent)}
                className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                  targetPrice === default20Percent
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="block text-[10px] text-stone-500 font-normal">20% Drop</span>
                <span className="font-mono font-bold">₹{default20Percent}</span>
              </button>

              {defaultRemaining ? (
                <button
                  type="button"
                  id="preset-budget-match"
                  onClick={() => setTargetPrice(defaultRemaining)}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    targetPrice === defaultRemaining
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block text-[10px] text-stone-500 font-normal">Fits Budget</span>
                  <span className="font-mono font-bold">₹{defaultRemaining}</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="preset-custom"
                  onClick={() => setTargetPrice(Math.round(product.price * 0.7))}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    targetPrice === Math.round(product.price * 0.7)
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="block text-[10px] text-stone-500 font-normal">30% Drop</span>
                  <span className="font-mono font-bold">₹{Math.round(product.price * 0.7)}</span>
                </button>
              )}
            </div>

            {/* Custom Input Field */}
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-400 font-bold font-mono">₹</span>
              <input
                id="target-price-input"
                type="number"
                min="1"
                max={product.price}
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-stone-300 rounded-lg text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                placeholder="Enter custom target price"
                required
              />
            </div>
          </div>

          {/* Restock Notification Checkbox */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                id="notify-stock-checkbox"
                type="checkbox"
                checked={notifyOnStock}
                onChange={(e) => setNotifyOnStock(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-semibold text-stone-800 block flex items-center">
                  <PackageCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Notify when back in stock
                </span>
                <span className="text-[11px] text-stone-500 block leading-tight">
                  Triggers immediate notification as soon as inventory is replenished
                </span>
              </div>
            </label>
          </div>

          {/* Notification Destination */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1 text-stone-400" />
              Send alert notification to:
            </label>
            <input
              id="alert-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400/20"
              placeholder="name@example.com"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              id="cancel-price-alert-btn"
              onClick={onClose}
              className="w-1/3 py-2 px-3 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-price-alert-btn"
              disabled={savedSuccess}
              className={`w-2/3 py-2 px-4 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5 ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Alert Saved!</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>{existingAlert ? 'Update Alert' : 'Track Price Drop'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
