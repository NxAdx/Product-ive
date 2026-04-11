import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getLevelName } from '../data/constants';

export interface ReflectionEntry {
  ruleId: string;
  score: number;
  createdAt: string;
}

export interface PositivityStore {
  weeklyScore: number;
  lifetimeScore: number;
  currentLevel: string;
  weeklyStreak: number;
  rulesUsed: string[];
  todayRulesUsed: string[];
  lastActiveDate: string;
  dismissedRecommendations: string[];
  weeklySessionsCompleted: number;
  weeklyFocusTimeSeconds: number;
  reflectionEntries: ReflectionEntry[];
  addPoints: (amount: number, source: string, ruleId?: string) => void;
  addSessionMetric: (durationSeconds: number) => void;
  addReflectionScore: (ruleId: string, score: number) => void;
  markRuleUsed: (ruleId: string) => boolean;
  checkAndResetWeekly: () => void;
  dismissRecommendation: (ruleId: string) => void;
}

const startOfWeekMonday = (d: Date) => {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isDifferentWeek = (lastActiveStr: string, now: Date) => {
  if (!lastActiveStr) return false;
  const last = new Date(lastActiveStr);
  return startOfWeekMonday(last).getTime() !== startOfWeekMonday(now).getTime();
};

const isYesterday = (lastDateStr: string, now: Date) => {
  if (!lastDateStr) return false;
  const last = new Date(lastDateStr);
  const lastStart = new Date(last);
  const nowStart = new Date(now);
  lastStart.setHours(0, 0, 0, 0);
  nowStart.setHours(0, 0, 0, 0);
  const diff = nowStart.getTime() - lastStart.getTime();
  return diff === 24 * 60 * 60 * 1000;
};

const isSameDay = (lastDateStr: string, now: Date) => {
  if (!lastDateStr) return false;
  return new Date(lastDateStr).toDateString() === now.toDateString();
};

function syncHomeWidgetSnapshot(payload: { weeklyScore: number; weeklyStreak: number; currentLevel: string }) {
  if (Platform.OS === 'android') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { requestWidgetUpdate } = require('react-native-android-widget') as {
        requestWidgetUpdate: (config: { name: string; props: typeof payload }) => void;
      };
      requestWidgetUpdate({
        name: 'ProductivePlusWidget',
        props: payload,
      });
    } catch (error) {
      console.warn('Android widget snapshot sync failed:', error);
    }
    return;
  }

  // Guard iOS-only widget runtime modules from being evaluated on non-iOS startup.
  if (Platform.OS !== 'ios') return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ProductiveGlance } = require('../widgets/ProductiveGlance') as {
      ProductiveGlance?: { updateSnapshot?: (data: typeof payload) => void };
    };
    ProductiveGlance?.updateSnapshot?.(payload);
  } catch (error) {
    console.warn('Widget snapshot sync skipped:', error);
  }
}

export const usePositivityStore = create<PositivityStore>()(
  persist(
    (set, get) => ({
      weeklyScore: 0,
      lifetimeScore: 0,
      currentLevel: 'Getting Started',
      weeklyStreak: 0,
      rulesUsed: [],
      todayRulesUsed: [],
      lastActiveDate: '',
      dismissedRecommendations: [],
      weeklySessionsCompleted: 0,
      weeklyFocusTimeSeconds: 0,
      reflectionEntries: [],

      addSessionMetric: (durationSeconds) => {
        set((state) => ({
          weeklySessionsCompleted: state.weeklySessionsCompleted + 1,
          weeklyFocusTimeSeconds: state.weeklyFocusTimeSeconds + durationSeconds,
        }));
      },

      addReflectionScore: (ruleId, score) => {
        const clamped = Math.max(1, Math.min(5, Math.round(score)));
        const entry: ReflectionEntry = {
          ruleId,
          score: clamped,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reflectionEntries: [...state.reflectionEntries, entry].slice(-200),
        }));
      },

      addPoints: (amount) => {
        const now = new Date();
        set((state) => {
          let weeklyScore = state.weeklyScore;
          let weeklyStreak = state.weeklyStreak;
          let todayRulesUsed = state.todayRulesUsed;

          if (isDifferentWeek(state.lastActiveDate, now)) {
            weeklyScore = 0;
            todayRulesUsed = [];
          }

          if (!isSameDay(state.lastActiveDate, now)) {
            if (isYesterday(state.lastActiveDate, now)) {
              weeklyStreak = state.weeklyStreak + 1;
            } else if (state.lastActiveDate === '') {
              weeklyStreak = 1;
            } else {
              weeklyStreak = 1;
            }
            todayRulesUsed = [];
          }

          const nextWeeklyScore = weeklyScore + amount;
          const nextLifetimeScore = state.lifetimeScore + amount;

          const result = {
            weeklyScore: nextWeeklyScore,
            lifetimeScore: nextLifetimeScore,
            weeklyStreak,
            currentLevel: getLevelName(nextWeeklyScore),
            lastActiveDate: now.toISOString(),
            todayRulesUsed,
          };

          // Sync to Home Screen Widget (safe no-op on Android)
          syncHomeWidgetSnapshot({
            weeklyScore: result.weeklyScore,
            weeklyStreak: result.weeklyStreak,
            currentLevel: result.currentLevel,
          });

          return result;
        });
      },

      markRuleUsed: (ruleId) => {
        const { rulesUsed } = get();
        const now = new Date();
        
        set((state) => {
          let todayRulesUsed = state.todayRulesUsed;
          if (!isSameDay(state.lastActiveDate, now)) {
            todayRulesUsed = [];
          }
          if (!todayRulesUsed.includes(ruleId)) {
            todayRulesUsed = [...todayRulesUsed, ruleId];
          }
          return { todayRulesUsed };
        });
        
        if (!rulesUsed.includes(ruleId)) {
          set((state) => ({ rulesUsed: [...state.rulesUsed, ruleId] }));
          return true;
        }
        return false;
      },

      checkAndResetWeekly: () => {
        const now = new Date();
        const { lastActiveDate } = get();
        if (isDifferentWeek(lastActiveDate, now)) {
          set({
            weeklyScore: 0,
            weeklyStreak: 0,
            todayRulesUsed: [],
            weeklySessionsCompleted: 0,
            weeklyFocusTimeSeconds: 0,
          });
        } else if (!isSameDay(lastActiveDate, now)) {
          set({ todayRulesUsed: [] });
        }
      },

      dismissRecommendation: (ruleId) => {
        set((state) => ({
          dismissedRecommendations: [...state.dismissedRecommendations, ruleId],
        }));
      },
    }),
    {
      name: 'positivity',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        syncHomeWidgetSnapshot({
          weeklyScore: state.weeklyScore,
          weeklyStreak: state.weeklyStreak,
          currentLevel: state.currentLevel,
        });
      },
    }
  )
);
