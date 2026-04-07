/* global describe, beforeEach, it, expect */
import { usePositivityStore } from '../positivityStore';

function resetPositivityStore() {
  usePositivityStore.setState(usePositivityStore.getInitialState(), true);
}

describe('positivityStore', () => {
  beforeEach(() => {
    resetPositivityStore();
  });

  it('adds points and updates weekly/lifetime scores', () => {
    usePositivityStore.getState().addPoints(120, 'session_complete', 'pomodoro');

    const state = usePositivityStore.getState();
    expect(state.weeklyScore).toBe(120);
    expect(state.lifetimeScore).toBe(120);
    expect(state.currentLevel).toBe('Building Momentum');
    expect(state.weeklyStreak).toBe(1);
  });

  it('resets week-bound metrics when a new week starts', () => {
    const initial = usePositivityStore.getInitialState();
    usePositivityStore.setState(
      {
        ...initial,
        weeklyScore: 350,
        weeklyStreak: 4,
        weeklySessionsCompleted: 5,
        weeklyFocusTimeSeconds: 7200,
        todayRulesUsed: ['pomodoro'],
        lastActiveDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      true
    );

    usePositivityStore.getState().checkAndResetWeekly();
    const state = usePositivityStore.getState();

    expect(state.weeklyScore).toBe(0);
    expect(state.weeklyStreak).toBe(0);
    expect(state.weeklySessionsCompleted).toBe(0);
    expect(state.weeklyFocusTimeSeconds).toBe(0);
    expect(state.todayRulesUsed).toEqual([]);
  });

  it('stores reflection scores in a bounded history', () => {
    usePositivityStore.getState().addReflectionScore('pomodoro', 9);
    usePositivityStore.getState().addReflectionScore('srs', 2);

    const entries = usePositivityStore.getState().reflectionEntries;
    expect(entries).toHaveLength(2);
    expect(entries[0]?.score).toBe(5);
    expect(entries[0]?.ruleId).toBe('pomodoro');
    expect(entries[1]?.score).toBe(2);
    expect(entries[1]?.ruleId).toBe('srs');
  });
});
