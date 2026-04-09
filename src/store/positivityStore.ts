import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setWidgetData } from 'expo-widgets';

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

import { XP_LEVELS, getLevelName } from './constants';

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
            // Persistence Hardening: Don't reset streak to 0 on Mon if user was active on Sun
            todayRulesUsed = [];
          }

          if (!isSameDay(state.lastActiveDate, now)) {
            // New Day! 
            if (isYesterday(state.lastActiveDate, now)) {
              weeklyStreak = state.weeklyStreak + 1;
            } else if (state.lastActiveDate === '') {
              weeklyStreak = 1;
            } else {
              // Streak broken!
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

          // Sync to Home Screen Widget
          setWidgetData('ProductiveGlance', {
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
          
          // Reset today's rules if it's a new day
          if (!isSameDay(state.lastActiveDate, now)) {
            todayRulesUsed = [];
          }
          
          // Track in today's rules
          if (!todayRulesUsed.includes(ruleId)) {
            todayRulesUsed = [...todayRulesUsed, ruleId];
          }
          
          return { todayRulesUsed };
        });
        
        // Track in lifetime rulesUsed
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
    { name: 'positivity', storage: createJSONStorage(() => AsyncStorage) }
  )
);
