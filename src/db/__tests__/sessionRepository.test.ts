/**
 * Tests for sessionRepository — verifies correct SQL calls and data shaping.
 * Uses a mock database (getDatabase returns a mock via jest.setup.ts).
 */
import {
  insertSessionRecord,
  insertPointEvents,
  getRecentSessions,
  getTodayPointDelta,
} from '../sessionRepository';

// Create a controlled mock for the database module
const mockRunAsync = jest.fn().mockResolvedValue(undefined);
const mockGetFirstAsync = jest.fn().mockResolvedValue({ total: 42 });
const mockGetAllAsync = jest.fn().mockResolvedValue([]);
const mockTxRunAsync = jest.fn().mockResolvedValue(undefined);
const mockWithExclusiveTransactionAsync = jest.fn().mockImplementation(
  async (task: (tx: { runAsync: jest.Mock }) => Promise<void>) => {
    await task({ runAsync: mockTxRunAsync });
  }
);

jest.mock('../database', () => ({
  getDatabase: jest.fn().mockResolvedValue({
    runAsync: (...args: unknown[]) => mockRunAsync(...args),
    getFirstAsync: (...args: unknown[]) => mockGetFirstAsync(...args),
    getAllAsync: (...args: unknown[]) => mockGetAllAsync(...args),
    withExclusiveTransactionAsync: (...args: unknown[]) =>
      mockWithExclusiveTransactionAsync(...args),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('insertSessionRecord', () => {
  it('calls runAsync with correct INSERT SQL and all parameters', async () => {
    const record = {
      id: 'test_1234',
      ruleId: 'pomodoro',
      engine: 'countdown',
      startedAt: 1000,
      completedAt: 2500,
      durationSeconds: 1500,
      pointsEarned: 15,
      reflectionScore: 4,
    };

    await insertSessionRecord(record);

    expect(mockRunAsync).toHaveBeenCalledTimes(1);
    const [sql, ...params] = mockRunAsync.mock.calls[0];
    expect(sql).toContain('INSERT INTO sessions');
    expect(params).toContain('test_1234');
    expect(params).toContain('pomodoro');
    expect(params).toContain('countdown');
    expect(params).toContain(1500);
    expect(params).toContain(15);
    expect(params).toContain(4);
  });

  it('passes null for missing reflectionScore', async () => {
    await insertSessionRecord({
      id: 'test_no_ref',
      ruleId: 'r1',
      engine: 'guided',
      startedAt: 0,
      completedAt: 100,
      durationSeconds: 100,
      pointsEarned: 10,
    });

    expect(mockRunAsync).toHaveBeenCalledTimes(1);
    const params = mockRunAsync.mock.calls[0].slice(1);
    // reflectionScore should be null (the 8th positional param)
    expect(params).toContain(null);
  });
});

describe('insertPointEvents', () => {
  it('does nothing for empty array', async () => {
    await insertPointEvents([]);
    expect(mockWithExclusiveTransactionAsync).not.toHaveBeenCalled();
  });

  it('inserts each event inside a transaction', async () => {
    await insertPointEvents([
      { sessionId: 's1', amount: 15, source: 'session_complete', ruleId: 'pomodoro' },
      { sessionId: 's1', amount: 25, source: 'rule_discovery', ruleId: 'pomodoro' },
    ]);

    expect(mockWithExclusiveTransactionAsync).toHaveBeenCalledTimes(1);
    expect(mockTxRunAsync).toHaveBeenCalledTimes(2);

    const firstCall = mockTxRunAsync.mock.calls[0];
    expect(firstCall[0]).toContain('INSERT INTO point_events');
    expect(firstCall[2]).toBe(15); // amount
    expect(firstCall[3]).toBe('session_complete'); // source
  });
});

describe('getRecentSessions', () => {
  it('queries with default limit of 8', async () => {
    await getRecentSessions();
    expect(mockGetAllAsync).toHaveBeenCalledTimes(1);
    const [sql, limit] = mockGetAllAsync.mock.calls[0];
    expect(sql).toContain('SELECT');
    expect(sql).toContain('FROM sessions');
    expect(sql).toContain('ORDER BY completed_at DESC');
    expect(limit).toBe(8);
  });

  it('clamps limit between 1 and 50', async () => {
    await getRecentSessions(0);
    expect(mockGetAllAsync.mock.calls[0][1]).toBe(1);

    await getRecentSessions(100);
    expect(mockGetAllAsync.mock.calls[1][1]).toBe(50);
  });
});

describe('getTodayPointDelta', () => {
  it('returns the total from the database', async () => {
    mockGetFirstAsync.mockResolvedValueOnce({ total: 42 });
    const result = await getTodayPointDelta();
    expect(result).toBe(42);
  });

  it('returns 0 when no rows match', async () => {
    mockGetFirstAsync.mockResolvedValueOnce(null);
    const result = await getTodayPointDelta();
    expect(result).toBe(0);
  });

  it('queries point_events with today start boundary', async () => {
    await getTodayPointDelta();
    const [sql] = mockGetFirstAsync.mock.calls[0];
    expect(sql).toContain('FROM point_events');
    expect(sql).toContain('WHERE created_at >=');
  });
});
