/**
 * ShopPilot RAG Knowledge Retrieval Engine
 * Grounded domain information retrieval with category metadata filtering and relevance scoring.
 */

import { KnowledgeChunk, ProductCategory } from '../types';
import { KNOWLEDGE_BASE } from '../data/knowledgeBase';

export interface RAGRetrievalInput {
  query: string;
  category?: ProductCategory;
  topK?: number;
  tags?: string[];
}

export interface GroundedContextResult {
  chunks: KnowledgeChunk[];
  groundingNotice: string;
  sources: string[];
}

export class RAGEngine {
  /**
   * Retrieves the most relevant knowledge chunks matching user requirements.
   */
  public static retrieve(input: RAGRetrievalInput): GroundedContextResult {
    const { query, category, topK = 3, tags = [] } = input;
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    let candidates = KNOWLEDGE_BASE;

    // Apply strict category metadata filtering (e.g. groceries query should not fetch electronics)
    if (category) {
      candidates = candidates.filter(c => c.category === category);
    }

    const scored = candidates.map(chunk => {
      let score = 0;
      const titleLower = chunk.title.toLowerCase();
      const contentLower = chunk.content.toLowerCase();
      const chunkTags = chunk.tags.map(t => t.toLowerCase());

      // Token match scoring
      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 5;
        if (contentLower.includes(token)) score += 2;
        if (chunkTags.some(t => t.includes(token))) score += 4;
      }

      // Explicit tag overlap bonus
      if (tags.length > 0) {
        const matchingTags = tags.filter(t => chunkTags.includes(t.toLowerCase()));
        score += matchingTags.length * 3;
      }

      return { chunk, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Pick top K, or fallback to first items in the category if score is 0
    const topChunks = scored.slice(0, topK).map(s => s.chunk);
    const sources = Array.from(new Set(topChunks.map(c => c.source)));

    return {
      chunks: topChunks,
      sources,
      groundingNotice: `Retrieved ${topChunks.length} verified knowledge guidelines from ${sources.join(', ')}.`
    };
  }
}
