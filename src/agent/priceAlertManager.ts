/**
 * ShopPilot Price Alert & Stock Tracking Engine
 * Manages user price drop alerts, historical price trends, restock notifications,
 * out-of-budget product discovery, and real-time alert trigger simulations.
 */

import { PriceAlert, PriceHistoryPoint, Product, ProductCategory, ShoppingRequirements, BasketItem } from '../types';
import { VERIFIED_CATALOG } from '../data/catalog';

const STORAGE_KEY = 'shoppilot_price_alerts_v2';

// In-memory fallback for Node.js / server-side environments
let inMemoryAlertsCache: PriceAlert[] | null = null;

export class PriceAlertManager {
  /**
   * Retrieve all saved price alerts from localStorage (or in-memory cache on Node server)
   */
  public static getAlerts(): PriceAlert[] {
    if (typeof window === 'undefined') {
      if (!inMemoryAlertsCache) {
        inMemoryAlertsCache = this.getDefaultAlerts();
      }
      return inMemoryAlertsCache;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: PriceAlert[] = JSON.parse(data);
        return parsed;
      }
    } catch {
      // Fallback on JSON parse error
    }

    return this.getDefaultAlerts();
  }

  private static getDefaultAlerts(): PriceAlert[] {
    const defaultAlerts: PriceAlert[] = [
      {
        id: 'alert-seed-01',
        productId: 'groc-prem-01',
        productName: 'Two Brothers Organic A2 Cultured Desi Cow Ghee (Bilona)',
        productBrand: 'Two Brothers Organic',
        productCategory: 'groceries',
        unit: '500 ml Jar',
        imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&auto=format&fit=crop&q=80',
        originalPriceAtCreation: 1350,
        currentPrice: 1350,
        targetPrice: 1100,
        inStock: true,
        notifyOnStock: false,
        isTriggered: false,
        createdAt: '2026-09-10T10:00:00.000Z',
        emailNotification: 'user@example.com',
        priceHistory: [
          { date: 'Aug 14', price: 1550 },
          { date: 'Aug 24', price: 1450 },
          { date: 'Sep 02', price: 1390 },
          { date: 'Sep 10', price: 1350 }
        ]
      },
      {
        id: 'alert-seed-02',
        productId: 'groc-pulse-04',
        productName: 'Tata Sampann Organic Chitra Rajma (Himalayan Kidney Beans)',
        productBrand: 'Tata Sampann',
        productCategory: 'groceries',
        unit: '1 kg',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        originalPriceAtCreation: 195,
        currentPrice: 195,
        targetPrice: 175,
        inStock: false,
        notifyOnStock: true,
        isTriggered: false,
        createdAt: '2026-09-11T12:00:00.000Z',
        priceHistory: [
          { date: 'Aug 10', price: 225 },
          { date: 'Aug 20', price: 210 },
          { date: 'Sep 01', price: 195 }
        ]
      }
    ];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAlerts));
    } catch {}

    return defaultAlerts;
  }

  /**
   * Persist alerts to localStorage (or in-memory cache)
   */
  public static saveAlerts(alerts: PriceAlert[]): void {
    inMemoryAlertsCache = alerts;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch {}
  }

  /**
   * Create or update a price alert for a product
   */
  public static createAlert(params: {
    product: Product;
    targetPrice: number;
    notifyOnStock?: boolean;
    emailNotification?: string;
  }): PriceAlert {
    const alerts = this.getAlerts();
    const existingIndex = alerts.findIndex(a => a.productId === params.product.id);

    // Generate realistic price history points
    const basePrice = params.product.price;
    const history: PriceHistoryPoint[] = [
      { date: '30d ago', price: Math.round(basePrice * 1.15) },
      { date: '20d ago', price: Math.round(basePrice * 1.08) },
      { date: '10d ago', price: Math.round(basePrice * 1.02) },
      { date: 'Today', price: basePrice }
    ];

    const alert: PriceAlert = {
      id: existingIndex >= 0 ? alerts[existingIndex].id : `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: params.product.id,
      productName: params.product.name,
      productBrand: params.product.brand,
      productCategory: params.product.category,
      unit: params.product.unit,
      imageUrl: params.product.imageUrl,
      originalPriceAtCreation: params.product.price,
      currentPrice: params.product.price,
      targetPrice: params.targetPrice,
      inStock: params.product.inStock,
      notifyOnStock: params.notifyOnStock ?? !params.product.inStock,
      isTriggered: params.product.price <= params.targetPrice,
      triggeredAt: params.product.price <= params.targetPrice ? new Date().toISOString() : undefined,
      triggeredReason: params.product.price <= params.targetPrice ? `Price already at or below target ₹${params.targetPrice}!` : undefined,
      createdAt: new Date().toISOString(),
      priceHistory: existingIndex >= 0 && alerts[existingIndex].priceHistory?.length > 0 ? alerts[existingIndex].priceHistory : history,
      emailNotification: params.emailNotification
    };

    if (existingIndex >= 0) {
      alerts[existingIndex] = alert;
    } else {
      alerts.unshift(alert);
    }

    this.saveAlerts(alerts);
    return alert;
  }

  /**
   * Remove an alert by ID
   */
  public static removeAlert(id: string): void {
    const alerts = this.getAlerts().filter(a => a.id !== id);
    this.saveAlerts(alerts);
  }

  /**
   * Check if a product has an active alert
   */
  public static hasAlert(productId: string): PriceAlert | undefined {
    const alerts = this.getAlerts();
    return alerts.find(a => a.productId === productId);
  }

  /**
   * Simulate a price drop for demo/testing purposes
   * Drops the price down to or below target, or by a percentage
   */
  public static simulatePriceDrop(alertId: string, percentageDrop: number = 20): {
    alert: PriceAlert | null;
    oldPrice: number;
    newPrice: number;
    triggered: boolean;
  } {
    const alerts = this.getAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return { alert: null, oldPrice: 0, newPrice: 0, triggered: false };

    const oldPrice = alert.currentPrice;
    // Calculate new dropped price (either drop by percentage or down to target price - ₹20)
    const discountAmount = Math.max(25, Math.round(oldPrice * (percentageDrop / 100)));
    let newPrice = Math.max(10, oldPrice - discountAmount);

    // If target price was set, ensure it dips to or below target to trigger the alert event!
    if (newPrice > alert.targetPrice) {
      newPrice = alert.targetPrice;
    }

    alert.currentPrice = newPrice;
    alert.priceHistory.push({
      date: 'Just now',
      price: newPrice
    });

    const isTriggered = newPrice <= alert.targetPrice;
    if (isTriggered) {
      alert.isTriggered = true;
      alert.triggeredAt = new Date().toISOString();
      alert.triggeredReason = `Price dropped to ₹${newPrice.toLocaleString()} (below target ₹${alert.targetPrice.toLocaleString()})!`;
    }

    this.saveAlerts(alerts);
    return { alert, oldPrice, newPrice, triggered: isTriggered };
  }

  /**
   * Simulate product restock
   */
  public static simulateRestock(alertId: string): {
    alert: PriceAlert | null;
    triggered: boolean;
  } {
    const alerts = this.getAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return { alert: null, triggered: false };

    alert.inStock = true;
    let triggered = false;

    if (alert.notifyOnStock) {
      alert.isTriggered = true;
      alert.triggeredAt = new Date().toISOString();
      alert.triggeredReason = 'Product is back in stock!';
      triggered = true;
    }

    this.saveAlerts(alerts);
    return { alert, triggered };
  }

  /**
   * Discover candidate products that are out of budget or currently unavailable
   * based on the user's active shopping session.
   */
  public static findCandidates(
    requirements: ShoppingRequirements,
    basketItems: BasketItem[] = []
  ): {
    outOfBudget: { product: Product; exceedsBudgetBy: number; reason: string }[];
    unavailable: Product[];
    categoryItems: Product[];
  } {
    const category = requirements.category || 'groceries';
    const totalBudget = requirements.budget || 2500;
    const basketTotal = basketItems.reduce((sum, item) => sum + item.subtotal, 0);
    const remainingBudget = Math.max(0, totalBudget - basketTotal);

    const basketProductIds = new Set(basketItems.map(i => i.product.id));

    // Get catalog products in this category
    const relevantProducts = VERIFIED_CATALOG.filter(p => p.category === category);

    // 1. Unavailable items in this category
    const unavailable = relevantProducts.filter(p => !p.inStock);

    // 2. Out-of-budget items:
    // Either price exceeds remaining budget (if basket exists), or price alone exceeds 60% of total budget
    const outOfBudget: { product: Product; exceedsBudgetBy: number; reason: string }[] = [];

    relevantProducts.forEach(product => {
      // Skip if already in basket or out of stock
      if (basketProductIds.has(product.id) || !product.inStock) return;

      // Check if price exceeds remaining budget
      if (basketItems.length > 0 && product.price > remainingBudget) {
        outOfBudget.push({
          product,
          exceedsBudgetBy: product.price - remainingBudget,
          reason: `Exceeds current remaining budget (₹${remainingBudget.toLocaleString()}) by ₹${(product.price - remainingBudget).toLocaleString()}`
        });
      } else if (product.price > totalBudget * 0.5) {
        // High-ticket item that consumes excessive portion of the total budget
        outOfBudget.push({
          product,
          exceedsBudgetBy: product.price - Math.round(totalBudget * 0.4),
          reason: `Premium item consuming ${Math.round((product.price / totalBudget) * 100)}% of total budget ceiling`
        });
      }
    });

    // Sort by price descending so highest-value items are prominent
    outOfBudget.sort((a, b) => b.product.price - a.product.price);

    return {
      outOfBudget,
      unavailable,
      categoryItems: relevantProducts
    };
  }
}
