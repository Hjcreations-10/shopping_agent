/**
2:  * ShopPilot Backend In-Memory & Persistent Session Store
3:  * Retains session memory, conversational turns, requirements evolution,
4:  * and state histories for seamless contextual re-planning across requests.
5:  */

import { AgentPlanResponse, ShoppingRequirements } from '../types';

export interface SessionHistoryItem {
  id: string;
  timestamp: string;
  type: 'initial_plan' | 'replan' | 'substitution';
  userQuery: string;
  requirements: ShoppingRequirements;
  basketTotal: number;
  remainingBudget: number;
  itemCount: number;
  planSnapshot: AgentPlanResponse;
}

export interface SessionRecord {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  turnCount: number;
  currentPlan: AgentPlanResponse;
  history: SessionHistoryItem[];
}

export class SessionStore {
  private static sessions: Map<string, SessionRecord> = new Map();

  /**
   * Saves or creates a session with its plan and logs the conversational turn in history
   */
  public static savePlan(
    sessionId: string,
    plan: AgentPlanResponse,
    userQuery: string,
    type: 'initial_plan' | 'replan' | 'substitution' = 'initial_plan'
  ): SessionRecord {
    const existing = this.sessions.get(sessionId);
    const now = new Date().toISOString();

    const historyItem: SessionHistoryItem = {
      id: `turn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      type,
      userQuery,
      requirements: JSON.parse(JSON.stringify(plan.requirements)),
      basketTotal: plan.basket.optimizedTotal,
      remainingBudget: plan.basket.remainingBudget,
      itemCount: plan.basket.items.length,
      planSnapshot: plan
    };

    if (existing) {
      existing.updatedAt = now;
      existing.turnCount += 1;
      existing.currentPlan = plan;
      existing.history.push(historyItem);
      // Keep up to 20 history records per session to prevent unbounded memory growth
      if (existing.history.length > 20) {
        existing.history.shift();
      }
      this.sessions.set(sessionId, existing);
      return existing;
    }

    const newRecord: SessionRecord = {
      sessionId,
      createdAt: now,
      updatedAt: now,
      turnCount: 1,
      currentPlan: plan,
      history: [historyItem]
    };

    this.sessions.set(sessionId, newRecord);
    return newRecord;
  }

  /**
   * Retrieves an active session record by ID
   */
  public static getSession(sessionId: string): SessionRecord | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Gets the latest plan response stored for a session
   */
  public static getLatestPlan(sessionId: string): AgentPlanResponse | undefined {
    return this.sessions.get(sessionId)?.currentPlan;
  }

  /**
   * Lists all active sessions with summary metadata
   */
  public static listSessions(): {
    sessionId: string;
    createdAt: string;
    updatedAt: string;
    turnCount: number;
    category: string;
    budget: number;
    basketTotal: number;
  }[] {
    const list: any[] = [];
    this.sessions.forEach((val) => {
      list.push({
        sessionId: val.sessionId,
        createdAt: val.createdAt,
        updatedAt: val.updatedAt,
        turnCount: val.turnCount,
        category: val.currentPlan.requirements.category,
        budget: val.currentPlan.requirements.budget,
        basketTotal: val.currentPlan.basket.optimizedTotal
      });
    });
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Resets or deletes a session
   */
  public static deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Clears all sessions (useful for tests)
   */
  public static clear(): void {
    this.sessions.clear();
  }
}
