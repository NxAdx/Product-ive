import { create } from 'zustand';

import { RULES } from '../data/rules';
import { usePositivityStore } from './positivityStore';
import {
  pauseForegroundTimer,
  resumeForegroundTimer,
  startForegroundTimer,
  stopForegroundTimer,
} from '../services/ForegroundTimerService';
import { insertPointEvents, insertSessionRecord } from '../db/sessionRepository';
import { logRuntimeEvent } from '../utils/runtimeLogs';
import { resolveForegroundDurationMs, resolveRuleSessionSeconds } from '../utils/sessionTiming';
import { SESSION_THRESHOLDS } from '../data/constants';

export type SessionPhase = 'work' | 'break' | 'done' | 'idle';

interface EndSessionOptions {
  reflectionScore?: number;
}

interface SessionState {
  activeRuleId: string | null;
  phase: SessionPhase;
  startTime: number | null;
  pausedAt: number | null;
  durationPassed: number;
  deadlineAtMs: number | null;

  startSession: (ruleId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: (options?: EndSessionOptions) => void;
  setPhase: (phase: SessionPhase) => void;
}


export const useSessionStore = create<SessionState>((set, get) => ({
  activeRuleId: null,
  phase: 'idle',
  startTime: null,
  pausedAt: null,
  durationPassed: 0,
  deadlineAtMs: null,

  startSession: (ruleId) => {
    const current = get();
    if (current.activeRuleId && current.phase !== 'idle') {
      stopForegroundTimer(false).catch(console.error);
    }

    const rule = RULES.find((r) => r.id === ruleId);
    const durationMs = resolveForegroundDurationMs(rule ?? null);
    
    // Phase 2 Sync: Calculate absolute deadline once
    const now = Date.now();
    const deadlineAtMs = now + durationMs;

    startForegroundTimer({
      durationMs,
      title: rule?.name || 'Active Session',
      deadlineAtMs,
    }).catch(console.error);

    set({
      activeRuleId: ruleId,
      phase: 'work',
      startTime: now,
      pausedAt: null,
      durationPassed: 0,
      deadlineAtMs,
    });
  },

  pauseSession: () => {
    const state = get();
    if (state.phase === 'idle' || state.pausedAt || !state.activeRuleId) return;

    const now = Date.now();
    set({ pausedAt: now });
    pauseForegroundTimer().catch(console.error);
  },

  resumeSession: () => {
    const state = get();
    if (!state.pausedAt || !state.startTime || !state.activeRuleId || !state.deadlineAtMs) return;

    const now = Date.now();
    const pauseDuration = now - state.pausedAt;
    
    // Update both virtual start and absolute deadline
    const newStartTime = state.startTime + pauseDuration;
    const newDeadlineAtMs = state.deadlineAtMs + pauseDuration;

    set({
      startTime: newStartTime,
      deadlineAtMs: newDeadlineAtMs,
      pausedAt: null,
    });

    resumeForegroundTimer(newDeadlineAtMs).catch(console.error);
  },

  endSession: (options) => {
    const state = get();
    const activeRuleId = state.activeRuleId;
    const completedAt = state.pausedAt || Date.now();
    if (activeRuleId) {
      const rule = RULES.find((r) => r.id === activeRuleId);
      if (rule) {
        let sessionDuration = 0;
        if (state.startTime) {
          sessionDuration = Math.max(0, Math.floor((completedAt - state.startTime) / 1000));
        }

        const targetSeconds = resolveRuleSessionSeconds(rule) || 0;
        const minRequiredSeconds = targetSeconds * SESSION_THRESHOLDS.MIN_PERCENTAGE_FOR_XP;
        const isLegitSession = sessionDuration >= minRequiredSeconds || targetSeconds === 0;

        const pointsToAward = isLegitSession ? rule.pointsPerSession : 0;

        const positivity = usePositivityStore.getState();
        positivity.checkAndResetWeekly();
        positivity.addSessionMetric(sessionDuration);
        
        if (pointsToAward > 0) {
          positivity.addPoints(pointsToAward, 'session_complete', activeRuleId);
        }

        const isFirstTimeRule = positivity.markRuleUsed(activeRuleId);
        let discoveryPoints = 0;
        if (isFirstTimeRule && isLegitSession) {
          discoveryPoints = rule.discoveryBonus;
          positivity.addPoints(rule.discoveryBonus, 'rule_discovery', activeRuleId);
        }
        
        if (typeof options?.reflectionScore === 'number') {
          positivity.addReflectionScore(activeRuleId, options.reflectionScore);
        }

        const sessionId = `${activeRuleId}_${completedAt}`;
        const totalPoints = pointsToAward + discoveryPoints;
        insertSessionRecord({
          id: sessionId,
          ruleId: activeRuleId,
          engine: rule.engine,
          startedAt: state.startTime ?? completedAt,
          completedAt,
          durationSeconds: sessionDuration,
          pointsEarned: totalPoints,
          reflectionScore: options?.reflectionScore,
        })
          .catch((error) => {
            logRuntimeEvent('sqlite_session_insert_failed', {
              message: error instanceof Error ? error.message : 'unknown',
              sessionId,
            }).catch(() => {});
          });

        insertPointEvents([
          {
            sessionId,
            amount: rule.pointsPerSession,
            source: 'session_complete',
            ruleId: activeRuleId,
          },
          ...(discoveryPoints > 0
            ? [{ sessionId, amount: discoveryPoints, source: 'rule_discovery', ruleId: activeRuleId }]
            : []),
        ]).catch((error) => {
          logRuntimeEvent('sqlite_point_event_insert_failed', {
            message: error instanceof Error ? error.message : 'unknown',
            sessionId,
          }).catch(() => {});
        });
      }
    }

    const completed = Boolean(activeRuleId && state.phase !== 'idle');
    stopForegroundTimer(completed).catch(console.error);

    set({
      activeRuleId: null,
      phase: 'idle',
      startTime: null,
      pausedAt: null,
      durationPassed: 0,
      deadlineAtMs: null,
    });
  },

  setPhase: (phase) => set({ phase }),
}));
