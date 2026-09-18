import React, { useState } from 'react';
import {
  X,
  Bell,
  TrendingDown,
  PackageCheck,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Play,
  ArrowRight,
  Plus,
  RefreshCw,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { PriceAlert, Product, ShoppingRequirements, BasketItem } from '../types';
import { PriceAlertManager } from '../agent/priceAlertManager';

interface PriceAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  onRefreshAlerts: () => void;
  onOpenSetAlertModal: (product: Product) => void;
  currentRequirements?: ShoppingRequirements;
  basketItems?: BasketItem[];
  onReplanWithItem?: (product: Product) => void;
}

export const PriceAlertsDrawer: React.FC<PriceAlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onRefreshAlerts,
  onOpenSetAlertModal,
  currentRequirements,
  basketItems = [],
  onReplanWithItem
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'candidates'>('alerts');
  const [simulationToast, setSimulationToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  if (!isOpen) return null;

  // Retrieve out-of-budget and unavailable products
  const defaultReqs: ShoppingRequirements = currentRequirements || {
    category: 'groceries',
    budget: 2500,
    people: 4,
    durationDays: 7,
    diet: 'vegetarian',
    existingItems: [],
    excludedItems: [],
    priorities: ['healthy', 'value']
  };

  const candidates = PriceAlertManager.findCandidates(defaultReqs, basketItems);

  const handleDelete = (id: string) => {
    PriceAlertManager.removeAlert(id);
    onRefreshAlerts();
  };

  const handleSimulateDrop = (alertId: string) => {
    const result = PriceAlertManager.simulatePriceDrop(alertId, 25);
    onRefreshAlerts();
    if (result.alert) {
      setSimulationToast({
        message: `🎉 Price drop simulated! ${result.alert.productName} dropped from ₹${result.oldPrice.toLocaleString()} to ₹${result.newPrice.toLocaleString()}${
          result.triggered ? ' (Target Alert Triggered!)' : ''
        }`,
        type: 'success'
      });
      setTimeout(() => setSimulationToast(null), 4500);
    }
  };

  const handleSimulateRestock = (alertId: string) => {
    const result = PriceAlertManager.simulateRestock(alertId);
    onRefreshAlerts();
    if (result.alert) {
      setSimulationToast({
        message: `📦 Restock simulated! ${result.alert.productName} is now back in stock!`,
        type: 'success'
      });
      setTimeout(() => setSimulationToast(null), 4500);
    }
  };

  const triggeredCount = alerts.filter(a => a.isTriggered).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
                    Price & Stock Alerts Hub
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {alerts.length} tracked
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Automated tracking for out-of-budget & unavailable items
                </p>
              </div>
            </div>
            <button
              id="close-price-alerts-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Simulation Toast Notification */}
          {simulationToast && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 text-xs text-emerald-900 font-medium flex items-center justify-between animate-in slide-in-from-top duration-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{simulationToast.message}</span>
              </div>
              <button
                onClick={() => setSimulationToast(null)}
                className="text-emerald-700 hover:text-emerald-900 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 px-5 bg-white">
            <button
              id="tab-active-alerts"
              onClick={() => setActiveTab('alerts')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-colors ${
                activeTab === 'alerts'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Active Alerts ({alerts.length})</span>
              {triggeredCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white animate-pulse">
                  {triggeredCount} dropped
                </span>
              )}
            </button>

            <button
              id="tab-discover-candidates"
              onClick={() => setActiveTab('candidates')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-colors ${
                activeTab === 'candidates'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Out of Budget & Unavailable ({candidates.outOfBudget.length + candidates.unavailable.length})</span>
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === 'alerts' ? (
              alerts.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-stone-300">
                  <Bell className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <h4 className="text-sm font-bold text-stone-800">No active price alerts</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    Track price drops on items that currently exceed your budget or are out of stock.
                  </p>
                  <button
                    onClick={() => setActiveTab('candidates')}
                    className="mt-4 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 inline-flex items-center space-x-1"
                  >
                    <span>Browse Out-of-Budget Candidates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const priceDropNeeded = Math.max(0, alert.currentPrice - alert.targetPrice);
                    const percentDropNeeded = Math.max(0, Math.round((priceDropNeeded / alert.currentPrice) * 100));

                    return (
                      <div
                        key={alert.id}
                        id={`alert-card-${alert.id}`}
                        className={`p-4 rounded-xl border transition-all ${
                          alert.isTriggered
                            ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {/* Status Header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                            {alert.productBrand} • {alert.productCategory}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            {alert.isTriggered ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                Alert Triggered!
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="w-3 h-3 mr-1 text-amber-600" />
                                Tracking Price
                              </span>
                            )}
                            <button
                              id={`delete-alert-${alert.id}`}
                              onClick={() => handleDelete(alert.id)}
                              title="Delete Alert"
                              className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-stone-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex space-x-3 mb-3">
                          <img
                            src={alert.imageUrl}
                            alt={alert.productName}
                            className="w-14 h-14 rounded-lg object-cover bg-stone-100 flex-shrink-0 border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-stone-900 leading-snug line-clamp-1">
                              {alert.productName}
                            </h4>
                            <span className="text-xs text-stone-500">{alert.unit}</span>

                            <div className="flex items-center space-x-3 mt-1.5">
                              <div>
                                <span className="text-[10px] text-stone-400 block">Current</span>
                                <span className="text-sm font-bold font-mono text-stone-900">
                                  ₹{alert.currentPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-stone-300">→</div>
                              <div>
                                <span className="text-[10px] text-stone-400 block">Target Alert</span>
                                <span className="text-sm font-bold font-mono text-amber-700">
                                  ₹{alert.targetPrice.toLocaleString()}
                                </span>
                              </div>
                              {priceDropNeeded > 0 ? (
                                <div className="text-[11px] text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded font-medium ml-auto">
                                  Needs ₹{priceDropNeeded} ({percentDropNeeded}%) drop
                                </div>
                              ) : (
                                <div className="text-[11px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold ml-auto">
                                  Target Met!
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Triggered reason callout */}
                        {alert.isTriggered && alert.triggeredReason && (
                          <div className="mb-3 p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                            <span className="font-semibold flex items-center">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-700 mr-1.5 flex-shrink-0" />
                              {alert.triggeredReason}
                            </span>
                            {onReplanWithItem && (
                              <button
                                onClick={() => {
                                  // Find product object
                                  const prod = candidates.categoryItems.find(p => p.id === alert.productId);
                                  if (prod) {
                                    onReplanWithItem(prod);
                                    onClose();
                                  }
                                }}
                                className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[11px] font-bold transition-colors ml-2 flex-shrink-0"
                              >
                                Re-plan with this
                              </button>
                            )}
                          </div>
                        )}

                        {/* Price History Sparkline */}
                        {alert.priceHistory && alert.priceHistory.length > 1 && (
                          <div className="mb-3 p-2 rounded-lg bg-stone-50 border border-stone-100">
                            <span className="text-[10px] font-semibold text-stone-500 block mb-1">
                              Price Tracking History:
                            </span>
                            <div className="flex items-center justify-between text-[11px]">
                              {alert.priceHistory.map((point, idx) => (
                                <div key={idx} className="text-center">
                                  <span className="text-[10px] text-stone-400 block">{point.date}</span>
                                  <span className="font-mono font-semibold text-stone-700">₹{point.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Simulation Controls */}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[11px] text-stone-500 font-medium">
                            {alert.notifyOnStock ? '✓ Stock alerts enabled' : ''}
                          </span>
                          <div className="flex items-center space-x-2">
                            {!alert.inStock && (
                              <button
                                id={`simulate-restock-${alert.id}`}
                                onClick={() => handleSimulateRestock(alert.id)}
                                title="Test Restock Event"
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 border border-stone-200"
                              >
                                <PackageCheck className="w-3 h-3 text-emerald-600" />
                                <span>Simulate Restock</span>
                              </button>
                            )}

                            <button
                              id={`simulate-drop-${alert.id}`}
                              onClick={() => handleSimulateDrop(alert.id)}
                              title="Test Price Drop Event"
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded text-[11px] font-medium transition-colors flex items-center space-x-1 border border-amber-200"
                            >
                              <Play className="w-3 h-3 text-amber-700" />
                              <span>Simulate Price Drop</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Out of Budget & Unavailable Candidates Tab */
              <div className="space-y-6">
                {/* Out of Budget Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      Products Exceeding Budget
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      {candidates.outOfBudget.length} available
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">
                    High-quality items that were not selected because their price exceeded the target or remaining budget.
                  </p>

                  <div className="space-y-3">
                    {candidates.outOfBudget.map(({ product, reason }) => {
                      const isTracked = PriceAlertManager.hasAlert(product.id);

                      return (
                        <div
                          key={product.id}
                          className="p-3 rounded-xl bg-white border border-stone-200 hover:border-stone-300 flex items-center justify-between space-x-3"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-stone-100 flex-shrink-0 border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold uppercase text-stone-400">
                              {product.brand}
                            </span>
                            <h5 className="text-xs font-bold text-stone-900 truncate">
                              {product.name}
                            </h5>
                            <p className="text-[11px] text-amber-700 font-medium">
                              {reason}
                            </p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-xs font-bold font-mono text-stone-900">
                                ₹{product.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-stone-400">({product.unit})</span>
                            </div>
                          </div>

                          <button
                            id={`candidate-alert-btn-${product.id}`}
                            onClick={() => onOpenSetAlertModal(product)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 flex-shrink-0 transition-colors ${
                              isTracked
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-900 text-white hover:bg-stone-800'
                            }`}
                          >
                            <Bell className="w-3 h-3" />
                            <span>{isTracked ? 'Alert Set' : 'Track Price'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Unavailable Products Section */}
                {candidates.unavailable.length > 0 && (
                  <div className="pt-4 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center">
                        <PackageCheck className="w-3.5 h-3.5 mr-1 text-red-600" />
                        Currently Unavailable Items
                      </h4>
                      <span className="text-[11px] text-stone-400">
                        {candidates.unavailable.length} items
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">
                      High-demand essentials currently out of stock. Set an alert to be notified when inventory arrives.
                    </p>

                    <div className="space-y-3">
                      {candidates.unavailable.map((product) => {
                        const isTracked = PriceAlertManager.hasAlert(product.id);

                        return (
                          <div
                            key={product.id}
                            className="p-3 rounded-xl bg-stone-50/70 border border-stone-200 flex items-center justify-between space-x-3"
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-100 flex-shrink-0 opacity-75 border border-stone-200"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-semibold uppercase text-stone-400">
                                {product.brand}
                              </span>
                              <h5 className="text-xs font-bold text-stone-900 truncate">
                                {product.name}
                              </h5>
                              <span className="inline-block text-[10px] font-semibold text-red-700 bg-red-100/70 px-1.5 py-0.2 rounded mt-0.5">
                                Temporarily Out of Stock
                              </span>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-xs font-bold font-mono text-stone-700">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-stone-400">({product.unit})</span>
                              </div>
                            </div>

                            <button
                              id={`unavailable-alert-btn-${product.id}`}
                              onClick={() => onOpenSetAlertModal(product)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 flex-shrink-0 transition-colors ${
                                isTracked
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-stone-900 text-white hover:bg-stone-800'
                              }`}
                            >
                              <Bell className="w-3 h-3" />
                              <span>{isTracked ? 'Alert Set' : 'Notify Restock'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
