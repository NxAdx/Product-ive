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

  startSession: (ruleId) => {
    const rule = RULES.find((r) => r.id === ruleId);
    let durationMs = 0;
    
    if (rule?.engine === 'countdown' || rule?.engine === 'interval') {
      // Find duration in numeric minutes representing this rule
      durationMs = 25 * 60 * 1000; // default
      
      if (rule.engineConfig?.workDuration) {
        durationMs = rule.engineConfig.workDuration * 1000; // workDuration is in seconds
      } else if (rule.engineConfig?.intervalMinutes) {
        durationMs = rule.engineConfig.intervalMinutes * 60 * 1000; // intervalMinutes is in minutes
      }
      
      startForegroundTimer(durationMs, rule.name).catch(console.error);
    } else {
      // Not a timed countdown, just a standard stopwatch
      startForegroundTimer(60 * 60 * 1000, rule?.name || 'Active Session').catch(console.error); 
    }

    set({
      activeRuleId: ruleId,
      phase: 'work',
      startTime: Date.now(),
      pausedAt: null,
      durationPassed: 0,
    });
  },

  pauseSession: () => {
    const state = get();
    if (state.phase === 'idle' || state.pausedAt || !state.activeRuleId) return;

    set({ pausedAt: Date.now() });
    pauseForegroundTimer().catch(console.error);
  },

  resumeSession: () => {
    const state = get();
    if (!state.pausedAt || !state.startTime || !state.activeRuleId) return;

    const pauseDuration = Date.now() - state.pausedAt;
    set({
      startTime: state.startTime + pauseDuration,
      pausedAt: null,
    });
    resumeForegroundTimer().catch(console.error);
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

        const positivity = usePositivityStore.getState();
        positivity.checkAndResetWeekly();
        positivity.addSessionMetric(sessionDuration);
        positivity.addPoints(rule.pointsPerSession, 'session_complete', activeRuleId);
        const isFirstTimeRule = positivity.markRuleUsed(activeRuleId);
        let discoveryPoints = 0;
        if (isFirstTimeRule) {
          discoveryPoints = rule.discoveryBonus;
          positivity.addPoints(rule.discoveryBonus, 'rule_discovery', activeRuleId);
        }
        if (typeof options?.reflectionScore === 'number') {
          positivity.addReflectionScore(activeRuleId, options.reflectionScore);
        }

        const sessionId = `${activeRuleId}_${completedAt}`;
        const totalPoints = rule.pointsPerSession + discoveryPoints;
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
    });
  },

  setPhase: (phase) => set({ phase }),
}));
