/* eslint-disable @typescript-eslint/no-require-imports */
/* global describe, beforeEach, it, expect, jest */
import { usePositivityStore } from '../positivityStore';
import { useSessionStore } from '../sessionStore';

jest.mock('../../services/ForegroundTimerService', () => ({
  startForegroundTimer: jest.fn().mockResolvedValue(undefined),
  pauseForegroundTimer: jest.fn().mockResolvedValue(undefined),
  resumeForegroundTimer: jest.fn().mockResolvedValue(undefined),
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
    jest.clearAllMocks();
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

  it('keeps foreground notification timer in sync on pause and resume', () => {
    const foreground = require('../../services/ForegroundTimerService');
    startMockSession('pomodoro', 60);

    useSessionStore.getState().pauseSession();
    expect(useSessionStore.getState().pausedAt).not.toBeNull();
    expect(foreground.pauseForegroundTimer).toHaveBeenCalledTimes(1);

    useSessionStore.getState().resumeSession();
    expect(useSessionStore.getState().pausedAt).toBeNull();
    expect(foreground.resumeForegroundTimer).toHaveBeenCalledTimes(1);
  });

  it('uses full session duration for interval rules (not reminder interval only)', () => {
    const foreground = require('../../services/ForegroundTimerService');

    useSessionStore.getState().startSession('20_20_20');

    expect(foreground.startForegroundTimer).toHaveBeenCalledWith(
      2 * 60 * 60 * 1000,
      '20-20-20 Rule'
    );
  });

  it('uses timerMinutes for freewrite-style timed sessions', () => {
    const foreground = require('../../services/ForegroundTimerService');

    useSessionStore.getState().startSession('blurting');

    expect(foreground.startForegroundTimer).toHaveBeenCalledWith(
      10 * 60 * 1000,
      'Blurting'
    );
  });
});
