import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Search,
  Users,
  Calendar,
  IndianRupee,
  CheckCircle,
  Zap,
  Layers,
  Heart,
  ShoppingCart,
  Bell,
  X,
  ArrowLeft
} from 'lucide-react';
import {
  AgentPlanResponse,
  ProductCategory,
  Product,
  ShoppingRequirements,
  PriceAlert
} from './types';
import { AgentActivityPipeline } from './components/AgentActivityPipeline';
import { BudgetMeter } from './components/BudgetMeter';
import { BasketView } from './components/BasketView';
import { ExplanationCard } from './components/ExplanationCard';
import { ReplanningConsole } from './components/ReplanningConsole';
import { ComparisonModal } from './components/ComparisonModal';
import { ObservabilityDrawer } from './components/ObservabilityDrawer';
import { TestSuiteModal } from './components/TestSuiteModal';
import { SecurityTestModal } from './components/SecurityTestModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { PriceAlertsDrawer } from './components/PriceAlertsDrawer';
import { ClothAgentVisualizerModal } from './components/ClothAgentVisualizerModal';
import { ElectronicsAgentVisualizerModal } from './components/ElectronicsAgentVisualizerModal';
import { PriceAlertManager } from './agent/priceAlertManager';
import { ShoppingOrchestrator } from './agent/orchestrator';
import { VERIFIED_CATALOG } from './data/catalog';

// Client Views
import { ClientHeader } from './views/client/ClientHeader';
import { ClientHome } from './views/client/ClientHome';
import { CategoryBudgetFlow } from './views/client/CategoryBudgetFlow';

// Admin Views
import { AdminLayout, AdminTab } from './views/admin/AdminLayout';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminProducts } from './views/admin/AdminProducts';
import { AdminCategories } from './views/admin/AdminCategories';
import { AdminSessions } from './views/admin/AdminSessions';
import { AdminAgentOps } from './views/admin/AdminAgentOps';
import { AdminRAG } from './views/admin/AdminRAG';
import { AdminReviews } from './views/admin/AdminReviews';
import { AdminSecurity } from './views/admin/AdminSecurity';
import { AdminHealth } from './views/admin/AdminHealth';
import { AdminTestSuite } from './views/admin/AdminTestSuite';
import { AdminSettings } from './views/admin/AdminSettings';
import { motion, AnimatePresence } from 'motion/react';
import { joyAudio, fireCelebrationConfetti } from './utils/joyEffects';
import { FriendlyLoadingState } from './components/FriendlyLoadingState';
import { OptimizationCelebrationBanner } from './components/OptimizationCelebrationBanner';

type AppExperience = 'client' | 'admin';
type ClientView = 'home' | 'category' | 'plan';

const CATEGORY_BG_GRADIENTS: Record<ProductCategory, string> = {
  groceries: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  clothing: 'from-indigo-500/10 via-sky-500/5 to-transparent',
  personal_care: 'from-rose-500/10 via-amber-500/5 to-transparent',
  household: 'from-teal-500/10 via-emerald-500/5 to-transparent',
  electronics: 'from-sky-500/10 via-blue-500/5 to-transparent',
};

export default function App() {
  // Experience State: Client vs Admin
  const [experience, setExperience] = useState<AppExperience>(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'client';
  });

  // Client Routing State
  const [clientView, setClientView] = useState<ClientView>('home');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('groceries');

  // Admin Tab State
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Shopping Agent & Plan State
  const [userGoal, setUserGoal] = useState<string>(
    'I have ₹2,500 for groceries for 4 people for 7 days. We are vegetarian. We already have rice and cooking oil. Prioritize healthy food and good value.'
  );
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [isReplanning, setIsReplanning] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<AgentPlanResponse | null>(null);

  // Modals & Drawers
  const [isTestsOpen, setIsTestsOpen] = useState<boolean>(false);
  const [isArchOpen, setIsArchOpen] = useState<boolean>(false);
  const [isObservabilityOpen, setIsObservabilityOpen] = useState<boolean>(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState<boolean>(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Price Alerts State
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState<boolean>(false);
  const [alertTargetProduct, setAlertTargetProduct] = useState<Product | null>(null);
  const [isSetAlertModalOpen, setIsSetAlertModalOpen] = useState<boolean>(false);
  const [activeTriggeredToast, setActiveTriggeredToast] = useState<PriceAlert | null>(null);

  // Garment & Fabric Agent Inspector State (clothing)
  const [inspectTargetProduct, setInspectTargetProduct] = useState<Product | null>(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState<boolean>(false);

  // Electronics Agent Gadget Scanner State
  const [isElectronicsInspectOpen, setIsElectronicsInspectOpen] = useState<boolean>(false);

  // Sync URL changes
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setExperience('admin');
      } else {
        setExperience('client');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToExperience = (exp: AppExperience) => {
    setExperience(exp);
    const newPath = exp === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const refreshAlerts = () => {
    const list = PriceAlertManager.getAlerts();
    setAlerts(list);
    const triggered = list.find(a => a.isTriggered);
    if (triggered) {
      setActiveTriggeredToast(triggered);
    }
  };

  // Initial load
  useEffect(() => {
    refreshAlerts();
  }, []);

  // Execute Agent Plan
  const handleExecutePlan = async (goalToExecute: string, catOverride?: ProductCategory) => {
    setIsPlanning(true);
    setClientView('plan');
    setUserGoal(goalToExecute);
    try {
      const activeSessionId = currentPlan?.sessionId || `session_${Date.now()}`;
      const res = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalToExecute, sessionId: activeSessionId })
      });

      if (res.ok) {
        const plan: AgentPlanResponse = await res.json();
        setCurrentPlan(plan);
        setActiveCategory(plan.requirements.category);
        joyAudio.playCelebrationChime();
        fireCelebrationConfetti();
      } else {
        const plan = await ShoppingOrchestrator.executePlan(goalToExecute, activeSessionId);
        setCurrentPlan(plan);
        setActiveCategory(plan.requirements.category);
        joyAudio.playCelebrationChime();
        fireCelebrationConfetti();
      }
    } catch (err) {
      console.warn('Fallback to direct client orchestrator:', err);
      const plan = await ShoppingOrchestrator.executePlan(goalToExecute);
      setCurrentPlan(plan);
      setActiveCategory(plan.requirements.category);
      joyAudio.playCelebrationChime();
      fireCelebrationConfetti();
    } finally {
      setIsPlanning(false);
    }
  };

  // Multi-turn Re-plan
  const handleReplan = async (followUpQuery: string) => {
    if (!currentPlan) return;
    setIsReplanning(true);
    try {
      const res = await fetch('/api/agent/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousState: currentPlan,
          sessionId: currentPlan.sessionId,
          followUpQuery
        })
      });

      if (res.ok) {
        const updatedPlan: AgentPlanResponse = await res.json();
        setCurrentPlan(updatedPlan);
        joyAudio.playCelebrationChime();
        fireCelebrationConfetti();
      } else {
        const updatedPlan = await ShoppingOrchestrator.replan(currentPlan, followUpQuery);
        setCurrentPlan(updatedPlan);
        joyAudio.playCelebrationChime();
        fireCelebrationConfetti();
      }
    } catch (err) {
      console.warn('Fallback to direct replan:', err);
      const updatedPlan = await ShoppingOrchestrator.replan(currentPlan, followUpQuery);
      setCurrentPlan(updatedPlan);
      joyAudio.playCelebrationChime();
      fireCelebrationConfetti();
    } finally {
      setIsReplanning(false);
    }
  };

  // Update item-specific custom notes/tags and re-optimize
  const handleUpdateItemDirective = async (productId: string, note?: string, tags?: string[]) => {
    if (!currentPlan) return;
    setIsReplanning(true);
    try {
      const res = await fetch('/api/agent/update-item-directive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousState: currentPlan,
          sessionId: currentPlan.sessionId,
          productId,
          directive: { note, tags }
        })
      });

      if (res.ok) {
        const updatedPlan: AgentPlanResponse = await res.json();
        setCurrentPlan(updatedPlan);
      } else {
        const updatedPlan = await ShoppingOrchestrator.updateItemDirective(
          currentPlan,
          productId,
          { note, tags }
        );
        setCurrentPlan(updatedPlan);
      }
    } catch (err) {
      console.warn('Fallback to direct directive optimization:', err);
      const updatedPlan = await ShoppingOrchestrator.updateItemDirective(
        currentPlan,
        productId,
        { note, tags }
      );
      setCurrentPlan(updatedPlan);
    } finally {
      setIsReplanning(false);
    }
  };

  // Record item feedback (thumbs up / down) signaling preference quality to agent
  const handleFeedbackItem = async (productId: string, feedback: 'up' | 'down' | null, reason?: string) => {
    if (!currentPlan) return;
    try {
      const res = await fetch('/api/agent/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousState: currentPlan,
          productId,
          feedback,
          reason
        })
      });

      if (res.ok) {
        const updatedPlan: AgentPlanResponse = await res.json();
        setCurrentPlan(updatedPlan);
      } else {
        const updatedPlan = ShoppingOrchestrator.recordItemFeedback(
          currentPlan,
          productId,
          feedback,
          reason
        );
        setCurrentPlan(updatedPlan);
      }
    } catch (err) {
      console.warn('Fallback to direct feedback recording:', err);
      const updatedPlan = ShoppingOrchestrator.recordItemFeedback(
        currentPlan,
        productId,
        feedback,
        reason
      );
      setCurrentPlan(updatedPlan);
    }
  };

  // Interactive Swap item inside basket
  const handleSwapItem = (originalId: string, substitute: Product) => {
    if (!currentPlan) return;
    const updatedItems = currentPlan.basket.items.map((item) => {
      if (item.product.id === originalId) {
        return {
          ...item,
          product: substitute,
          subtotal: substitute.price * item.quantity,
          whySelected: `Manually swapped for ${substitute.name}.`
        };
      }
      return item;
    });

    const newTotal = updatedItems.reduce((acc, it) => acc + it.subtotal, 0);
    const newRemaining = Math.max(0, currentPlan.basket.budget - newTotal);

    setCurrentPlan({
      ...currentPlan,
      basket: {
        ...currentPlan.basket,
        items: updatedItems,
        optimizedTotal: newTotal,
        remainingBudget: newRemaining,
        substitutionsMade: [
          ...currentPlan.basket.substitutionsMade,
          {
            originalItemName: originalId,
            substituteItemName: substitute.name,
            reason: 'User-applied direct catalog swap.',
            costSaved: 0
          }
        ]
      }
    });
  };

  // Open comparison for product
  const handleCompareItem = (product: Product) => {
    const peers = VERIFIED_CATALOG.filter(
      p => p.subcategory === product.subcategory && p.category === product.category
    );
    setComparisonProducts(peers.slice(0, 3));
    setIsCompareOpen(true);
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setActiveCategory(cat);
    setClientView('category');
  };

  // ==========================================
  // RENDER ADMIN EXPERIENCE
  // ==========================================
  if (experience === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onReturnToStore={() => navigateToExperience('client')}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={setAdminTab} />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'sessions' && <AdminSessions />}
        {adminTab === 'agent_ops' && <AdminAgentOps />}
        {adminTab === 'rag' && <AdminRAG />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'security' && <AdminSecurity />}
        {adminTab === 'health' && <AdminHealth />}
        {adminTab === 'tests' && <AdminTestSuite />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // ==========================================
  // RENDER CLIENT EXPERIENCE
  // ==========================================
  const basketCount = currentPlan?.basket?.items?.length || 0;
  const basketTotal = currentPlan?.basket?.optimizedTotal || 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Customer E-commerce Header */}
      <ClientHeader
        currentView={clientView}
        activeCategory={activeCategory}
        onNavigateHome={() => setClientView('home')}
        onSelectCategory={handleSelectCategory}
        onOpenBasket={() => {
          if (currentPlan) {
            setClientView('plan');
          } else {
            handleExecutePlan(userGoal);
          }
        }}
        onOpenPriceAlerts={() => setIsAlertsDrawerOpen(true)}
        onOpenAgentPrompt={() => {
          setClientView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSwitchToAdmin={() => navigateToExperience('admin')}
        basketCount={basketCount}
        basketTotal={basketTotal}
        alertsCount={alerts.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Triggered Price Drop Toast Banner */}
        {activeTriggeredToast && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Price Drop Alert Triggered
                </span>
                <p className="text-xs sm:text-sm font-bold text-stone-900">
                  {activeTriggeredToast.productName} dropped to{' '}
                  <span className="font-mono text-emerald-700">₹{activeTriggeredToast.currentPrice}</span> (Target: ₹{activeTriggeredToast.targetPrice})!
                </p>
                {activeTriggeredToast.triggeredReason && (
                  <span className="text-xs text-emerald-700">{activeTriggeredToast.triggeredReason}</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                id="replan-with-alerted-item-btn"
                onClick={() => {
                  const prod = VERIFIED_CATALOG.find(p => p.id === activeTriggeredToast.productId);
                  if (prod) {
                    handleReplan(`Include ${prod.name} in my basket as its price dropped to ₹${activeTriggeredToast.currentPrice}.`);
                  }
                  setActiveTriggeredToast(null);
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Re-plan with Item
              </button>
              <button
                id="dismiss-triggered-alert-btn"
                onClick={() => setActiveTriggeredToast(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: CLIENT HOME */}
        {clientView === 'home' && (
          <ClientHome
            onPromptSubmit={handleExecutePlan}
            onSelectCategory={handleSelectCategory}
            isPlanning={isPlanning}
          />
        )}

        {/* VIEW 2: CATEGORY BUDGET QUESTIONNAIRE FLOW */}
        {clientView === 'category' && (
          <div className="space-y-4">
            <button
              onClick={() => setClientView('home')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <CategoryBudgetFlow
              category={activeCategory}
              onPlanSubmit={(synthesizedQuery, cat) => {
                handleExecutePlan(synthesizedQuery, cat);
              }}
              onCancel={() => setClientView('home')}
            />
          </div>
        )}

        {/* VIEW 3: ACTIVE SHOPPING PLAN & OPTIMIZED BASKET WORKSPACE */}
        {clientView === 'plan' && currentPlan && (
          <div className="space-y-6">
            {/* Top Return navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setClientView('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shopping Home</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsObservabilityOpen(true)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  Inspect Agent Telemetry
                </button>
              </div>
            </div>

            {/* Requirement Summary Badges Bar */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="font-semibold text-stone-500 text-[11px] uppercase tracking-wider mr-1">
                Extracted Constraints:
              </span>

              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium border border-stone-200">
                <IndianRupee className="w-3.5 h-3.5 mr-1 text-stone-500" />
                <span>Budget: ₹{currentPlan.requirements.budget.toLocaleString()}</span>
              </div>

              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium border border-stone-200">
                <Users className="w-3.5 h-3.5 mr-1 text-stone-500" />
                <span>Headcount: {currentPlan.requirements.people} people</span>
              </div>

              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium border border-stone-200">
                <Calendar className="w-3.5 h-3.5 mr-1 text-stone-500" />
                <span>Duration: {currentPlan.requirements.durationDays} days</span>
              </div>

              {currentPlan.requirements.diet && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                  <Heart className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span className="capitalize">{currentPlan.requirements.diet}</span>
                </div>
              )}

              {currentPlan.requirements.existingItems.length > 0 && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-medium border border-amber-200">
                  <span>Already in Pantry: {currentPlan.requirements.existingItems.join(', ')}</span>
                </div>
              )}

              {currentPlan.basket.nutritionalMetrics && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 font-medium border border-indigo-200 ml-auto">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  <span>Est. Protein: ~{currentPlan.basket.nutritionalMetrics.estimatedDailyProteinPerPersonG}g / person / day</span>
                </div>
              )}
            </div>

            {/* ADK Execution Activity Pipeline */}
            <AgentActivityPipeline
              steps={currentPlan.steps}
              isPlanning={isPlanning || isReplanning}
              totalLatencyMs={currentPlan.observability?.totalLatencyMs}
            />

            {/* Budget & Optimization Meter */}
            <BudgetMeter basket={currentPlan.basket} />

            {/* Recommended Shopping Basket Products Grid */}
            <BasketView
              items={currentPlan.basket.items}
              onSwapItem={handleSwapItem}
              onCompareItem={handleCompareItem}
              onSetAlertItem={(product) => {
                setAlertTargetProduct(product);
                setIsSetAlertModalOpen(true);
              }}
              onUpdateDirectiveItem={handleUpdateItemDirective}
              onFeedbackItem={handleFeedbackItem}
              onInspectProduct={(product) => {
                setInspectTargetProduct(product);
                if (product.category === 'electronics') {
                  setIsElectronicsInspectOpen(true);
                  setIsInspectModalOpen(false);
                } else {
                  setIsInspectModalOpen(true);
                  setIsElectronicsInspectOpen(false);
                }
              }}
              requirements={currentPlan.requirements}
              onOpenAlertsCenter={() => setIsAlertsDrawerOpen(true)}
            />

            {/* Decision & Grounded Explanation Card */}
            <ExplanationCard
              explanation={currentPlan.explanation}
              retrievedKnowledge={currentPlan.retrievedKnowledge}
            />

            {/* Dynamic Re-Planning Console */}
            <ReplanningConsole
              onReplan={handleReplan}
              isReplanning={isReplanning}
            />
          </div>
        )}

        {/* Fallback loading state when plan is executing without prior plan */}
        {clientView === 'plan' && !currentPlan && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <h3 className="font-bold text-lg text-stone-900">ShopPilot AI is planning your basket...</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Scanning verified catalog items, evaluating ICMR nutritional ratios, and computing the optimal knapsack allocation.
            </p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
              S
            </div>
            <div>
              <span className="font-bold text-stone-900">ShopPilot AI</span>
              <span className="text-stone-400"> — Autonomous Everyday Shopping Planner</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              Verified Catalog Grounding
            </span>
            <span>•</span>
            <span>Zero Hallucinations</span>
            <span>•</span>
            <span>Budget Knapsack Optimization</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={comparisonProducts}
      />

      <TestSuiteModal
        isOpen={isTestsOpen}
        onClose={() => setIsTestsOpen(false)}
      />

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      <ObservabilityDrawer
        isOpen={isObservabilityOpen}
        onClose={() => setIsObservabilityOpen(false)}
        sessionId={currentPlan?.sessionId}
        observability={currentPlan?.observability}
        steps={currentPlan?.steps || []}
      />

      <SecurityTestModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />

      {/* Price Alert Modals & Drawer */}
      <PriceAlertModal
        product={alertTargetProduct}
        isOpen={isSetAlertModalOpen}
        onClose={() => {
          setIsSetAlertModalOpen(false);
          setAlertTargetProduct(null);
        }}
        onAlertSaved={() => {
          refreshAlerts();
        }}
        currentRemainingBudget={currentPlan?.basket.remainingBudget}
      />

      <PriceAlertsDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={alerts}
        onRefreshAlerts={refreshAlerts}
        onOpenSetAlertModal={(product) => {
          setAlertTargetProduct(product);
          setIsSetAlertModalOpen(true);
        }}
        currentRequirements={currentPlan?.requirements}
        basketItems={currentPlan?.basket.items}
        onReplanWithItem={(product) => {
          handleReplan(`Include ${product.name} in my basket now that price has dropped.`);
        }}
      />

      {/* AI Garment & Fabric Agent Visualizer Modal (clothing) */}
      <ClothAgentVisualizerModal
        product={inspectTargetProduct}
        isOpen={isInspectModalOpen}
        onClose={() => {
          setIsInspectModalOpen(false);
          setInspectTargetProduct(null);
        }}
        onSetAlert={(product) => {
          setAlertTargetProduct(product);
          setIsSetAlertModalOpen(true);
        }}
        onSwapItem={handleSwapItem}
      />

      {/* AI Gadget Scanner & Spec Analysis Modal (electronics) */}
      <ElectronicsAgentVisualizerModal
        product={inspectTargetProduct}
        isOpen={isElectronicsInspectOpen}
        onClose={() => {
          setIsElectronicsInspectOpen(false);
          setInspectTargetProduct(null);
        }}
        onSetAlert={(product) => {
          setAlertTargetProduct(product);
          setIsSetAlertModalOpen(true);
        }}
        onSwapItem={handleSwapItem}
      />
    </div>
  );
}
