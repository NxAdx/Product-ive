import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PositivityStore {
  weeklyScore: number;
  lifetimeScore: number;
  currentLevel: string;
  weeklyStreak: number;
  rulesUsed: string[];
  lastActiveDate: string;
  addPoints: (amount: number, source: string, ruleId?: string) => void;
  markRuleUsed: (ruleId: string) => boolean;
  checkAndResetWeekly: () => void;
}

const LEVELS = [
  { min: 0, name: 'Getting Started' },
  { min: 100, name: 'Building Momentum' },
  { min: 250, name: 'In the Zone' },
  { min: 500, name: 'Rule Master' },
  { min: 1000, name: 'Productively Positive' },
];

const getLevel = (score: number) => {
  const level = [...LEVELS].reverse().find((l) => score >= l.min);
  return level ? level.name : LEVELS[0].name;
};

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
      lastActiveDate: '',

      addPoints: (amount) => {
        const now = new Date();
        set((state) => {
          let weeklyScore = state.weeklyScore;
          let weeklyStreak = state.weeklyStreak;

          if (isDifferentWeek(state.lastActiveDate, now)) {
            weeklyScore = 0;
            weeklyStreak = 0;
          }

          if (!isSameDay(state.lastActiveDate, now)) {
            weeklyStreak = isYesterday(state.lastActiveDate, now) ? state.weeklyStreak + 1 : 1;
          }

          const nextWeeklyScore = weeklyScore + amount;
          const nextLifetimeScore = state.lifetimeScore + amount;

          return {
            weeklyScore: nextWeeklyScore,
            lifetimeScore: nextLifetimeScore,
            weeklyStreak,
            currentLevel: getLevel(nextWeeklyScore),
            lastActiveDate: now.toISOString(),
          };
        });
      },

      markRuleUsed: (ruleId) => {
        const { rulesUsed } = get();
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
          set({ weeklyScore: 0, weeklyStreak: 0 });
        }
      },
    }),
    { name: 'positivity', storage: createJSONStorage(() => AsyncStorage) }
  )
);
