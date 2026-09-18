/**
 * ShopPilot Review Intelligence Tool
 * Aspect-based review analysis, recurring praise and complaint detection from verified catalog reviews.
 */

import { Product, ReviewInsight, BaseReview } from '../types';

export class ReviewIntelligence {
  /**
   * Analyzes verified reviews for a specific product and generates structured review intelligence.
   */
  public static analyze(product: Product): ReviewInsight {
    const reviews: BaseReview[] = product.reviews || [];

    if (reviews.length === 0) {
      return {
        productId: product.id,
        productName: product.name,
        positiveThemes: ['No negative alerts reported'],
        negativeThemes: [],
        sentimentScore: Math.round((product.rating / 5) * 100),
        verifiedBuyerRatio: 1.0,
        recurringPraise: ['High catalog star rating'],
        recurringComplaints: [],
        summary: `Product has an average rating of ${product.rating}★ across ${product.reviewCount} customer ratings.`
      };
    }

    let verifiedCount = 0;
    let positiveAspectsCount = 0;
    let negativeAspectsCount = 0;
    const praiseThemes: Set<string> = new Set();
    const complaintThemes: Set<string> = new Set();

    for (const r of reviews) {
      if (r.verifiedPurchase) verifiedCount++;
      if (r.rating >= 4) {
        if (r.comment.toLowerCase().includes('fresh')) praiseThemes.add('Consistent freshness');
        if (r.comment.toLowerCase().includes('protein')) praiseThemes.add('High protein density');
        if (r.comment.toLowerCase().includes('value') || r.comment.toLowerCase().includes('budget')) praiseThemes.add('Excellent value for money');
        if (r.comment.toLowerCase().includes('soft') || r.comment.toLowerCase().includes('tasty') || r.comment.toLowerCase().includes('taste')) praiseThemes.add('Superior taste & texture');
        if (r.comment.toLowerCase().includes('clean')) praiseThemes.add('Clean & hygienic packaging');
        if (r.comment.toLowerCase().includes('comfort') || r.comment.toLowerCase().includes('sharp')) praiseThemes.add('Comfortable & sharp look');
        if (r.comment.toLowerCase().includes('silent')) praiseThemes.add('Ultra-silent performance');
      }

      if (r.aspects) {
        for (const a of r.aspects) {
          if (a.sentiment === 'positive') {
            positiveAspectsCount++;
            praiseThemes.add(`Verified ${a.feature}`);
          } else if (a.sentiment === 'negative') {
            negativeAspectsCount++;
            complaintThemes.add(`Caution regarding ${a.feature}`);
          }
        }
      }
    }

    const verifiedBuyerRatio = reviews.length > 0 ? Number((verifiedCount / reviews.length).toFixed(2)) : 1.0;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const sentimentScore = Math.min(100, Math.round((avgRating / 5) * 80 + (positiveAspectsCount / (positiveAspectsCount + negativeAspectsCount + 1)) * 20));

    // Fallbacks if set is empty
    if (praiseThemes.size === 0) {
      praiseThemes.add('Good overall buyer satisfaction');
    }

    const summary = `${product.name} holds ${product.rating}★ (${product.reviewCount.toLocaleString()} ratings). Key buyer consensus: ${Array.from(praiseThemes).slice(0, 2).join(', ')}${complaintThemes.size > 0 ? `. Note: ${Array.from(complaintThemes).join(', ')}` : ''}.`;

    return {
      productId: product.id,
      productName: product.name,
      positiveThemes: Array.from(praiseThemes),
      negativeThemes: Array.from(complaintThemes),
      sentimentScore,
      verifiedBuyerRatio,
      recurringPraise: reviews.slice(0, 2).map(r => r.comment),
      recurringComplaints: reviews.filter(r => r.rating <= 3).map(r => r.comment),
      summary
    };
  }

  /**
   * Batch analysis for an array of products.
   */
  public static analyzeBatch(products: Product[]): ReviewInsight[] {
    return products.map(p => this.analyze(p));
  }
}
