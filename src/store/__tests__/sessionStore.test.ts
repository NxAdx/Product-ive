/* global describe, beforeEach, it, expect, jest */
import { usePositivityStore } from '../positivityStore';
import { useSessionStore } from '../sessionStore';

jest.mock('../../services/ForegroundTimerService', () => ({
  startForegroundTimer: jest.fn().mockResolvedValue(undefined),
  stopForegroundTimer: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../db/sessionRepository', () => ({
  insertSessionRecord: jest.fn().mockResolvedValue(undefined),
  insertPointEvents: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../utils/runtimeLogs', () => ({
  logRuntimeEvent: jest.fn().mockResolvedValue(undefined),
}));

function resetStores() {
  usePositivityStore.setState(usePositivityStore.getInitialState(), true);
  useSessionStore.setState(useSessionStore.getInitialState(), true);
}

function startMockSession(ruleId: string, secondsAgo: number) {
  const now = Date.now();
  useSessionStore.setState(
    {
      ...useSessionStore.getInitialState(),
      activeRuleId: ruleId,
      phase: 'work',
      startTime: now - secondsAgo * 1000,
      pausedAt: null,
      durationPassed: 0,
    },
    true
  );
}

describe('sessionStore', () => {
  beforeEach(() => {
    resetStores();
  });

  it('awards base + discovery points only once and stores reflection score', () => {
    startMockSession('pomodoro', 60);
    useSessionStore.getState().endSession({ reflectionScore: 4 });

    let positivity = usePositivityStore.getState();
    expect(positivity.weeklyScore).toBe(45); // 20 base + 25 discovery
    expect(positivity.rulesUsed).toContain('pomodoro');
    expect(positivity.reflectionEntries.at(-1)?.score).toBe(4);

    startMockSession('pomodoro', 45);
    useSessionStore.getState().endSession();

    positivity = usePositivityStore.getState();
    expect(positivity.weeklyScore).toBe(65); // +20 only, discovery not repeated
    expect(positivity.rulesUsed.filter((id) => id === 'pomodoro')).toHaveLength(1);
  });
});
