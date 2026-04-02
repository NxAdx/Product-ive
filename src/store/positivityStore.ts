import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PositivityStore {
  weeklyScore:    number;
  lifetimeScore:  number;
  currentLevel:   string;
  weeklyStreak:   number;
  rulesUsed:      string[];
  lastActiveDate: string;
  addPoints: (amount: number, source: string, ruleId?: string) => void;
  markRuleUsed: (ruleId: string) => boolean;  // returns true if first time
  checkAndResetWeekly: () => void;
}

const LEVELS = [
  { min: 0,    name: 'Getting Started 🌱' },
  { min: 100,  name: 'Building Momentum 🔥' },
  { min: 250,  name: 'In the Zone ⚡' },
  { min: 500,  name: 'Rule Master 🧠' },
  { min: 1000, name: 'Productively Positive 🏆' },
];

const getLevel = (score: number) => {
  const level = [...LEVELS].reverse().find(l => score >= l.min);
  return level ? level.name : LEVELS[0].name;
};

const isNewWeek = (lastActiveStr: string) => {
  if (!lastActiveStr) return true;
  const lastActive = new Date(lastActiveStr);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
  return diffDays >= 7 || today.getDay() < lastActive.getDay(); // very simple heuristic
};

export const usePositivityStore = create<PositivityStore>()(
  persist(
    (set, get) => ({
      weeklyScore:   0,
      lifetimeScore: 0,
      currentLevel:  'Getting Started 🌱',
      weeklyStreak:  0,
      rulesUsed:     [],
      lastActiveDate: '',

      addPoints: (amount, source, ruleId) => {
        set(s => {
          const weekly    = s.weeklyScore + amount;
          const lifetime  = s.lifetimeScore + amount;
          const level     = getLevel(weekly);
          return { weeklyScore: weekly, lifetimeScore: lifetime, currentLevel: level };
        });
        // TODO: Emit event for PointsToast animation (pointsEventEmitter.emit({ amount, source, ruleId }))
      },

      markRuleUsed: (ruleId) => {
        const { rulesUsed } = get();
        if (!rulesUsed.includes(ruleId)) {
          set(s => ({ rulesUsed: [...s.rulesUsed, ruleId] }));
          return true;  // first time — caller should add discoveryBonus
        }
        return false;
      },

      checkAndResetWeekly: () => {
        const today = new Date().toDateString();
        const { lastActiveDate } = get();
        // Reset weekly on Monday
        if (isNewWeek(lastActiveDate)) {
          set({ weeklyScore: 0, weeklyStreak: 0 });
        }
        set({ lastActiveDate: today });
      },
    }),
    { name: 'positivity', storage: createJSONStorage(() => AsyncStorage) }
  )
);
