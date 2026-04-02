import { create } from 'zustand';

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

export const useSessionStore = create<SessionState>((set) => ({
  activeRuleId: null,
  phase: 'idle',
  startTime: null,
  pausedAt: null,
  durationPassed: 0,

  startSession: (ruleId) => set({ 
    activeRuleId: ruleId, 
    phase: 'work', 
    startTime: Date.now(),
    pausedAt: null,
    durationPassed: 0
  }),
  pauseSession: () => set((state) => {
    if (state.phase === 'idle' || state.pausedAt) return state;
    return { pausedAt: Date.now() };
  }),
  resumeSession: () => set((state) => {
    if (!state.pausedAt || !state.startTime) return state;
    const pauseDuration = Date.now() - state.pausedAt;
    return { 
      startTime: state.startTime + pauseDuration,
      pausedAt: null 
    };
  }),
  endSession: () => set({ 
    activeRuleId: null, 
    phase: 'idle', 
    startTime: null, 
    pausedAt: null,
    durationPassed: 0 
  }),
  setPhase: (phase) => set({ phase })
}));
