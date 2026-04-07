import { create } from 'zustand';

import { RULES } from '../data/rules';
import { usePositivityStore } from './positivityStore';

export type SessionPhase = 'work' | 'break' | 'done' | 'idle';

interface SessionState {
  activeRuleId: string | null;
  phase: SessionPhase;
  startTime: number | null;
  pausedAt: number | null;
  durationPassed: number;

  startSession: (ruleId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  setPhase: (phase: SessionPhase) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  activeRuleId: null,
  phase: 'idle',
  startTime: null,
  pausedAt: null,
  durationPassed: 0,

  startSession: (ruleId) =>
    set({
      activeRuleId: ruleId,
      phase: 'work',
      startTime: Date.now(),
      pausedAt: null,
      durationPassed: 0,
    }),

  pauseSession: () =>
    set((state) => {
      if (state.phase === 'idle' || state.pausedAt) return state;
      return { pausedAt: Date.now() };
    }),

  resumeSession: () =>
    set((state) => {
      if (!state.pausedAt || !state.startTime) return state;
      const pauseDuration = Date.now() - state.pausedAt;
      return {
        startTime: state.startTime + pauseDuration,
        pausedAt: null,
      };
    }),

  endSession: () => {
    const state = get();
    const activeRuleId = state.activeRuleId;
    if (activeRuleId) {
      const rule = RULES.find((r) => r.id === activeRuleId);
      if (rule) {
        let sessionDuration = 0;
        if (state.startTime) {
          const now = state.pausedAt || Date.now();
          sessionDuration = Math.max(0, Math.floor((now - state.startTime) / 1000));
        }

        const positivity = usePositivityStore.getState();
        positivity.checkAndResetWeekly();
        positivity.addSessionMetric(sessionDuration);
        positivity.addPoints(rule.pointsPerSession, 'session_complete', activeRuleId);
        const isFirstTimeRule = positivity.markRuleUsed(activeRuleId);
        if (isFirstTimeRule) {
          positivity.addPoints(rule.discoveryBonus, 'rule_discovery', activeRuleId);
        }
      }
    }

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
