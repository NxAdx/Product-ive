import type { RuleConfig } from '../data/rules';

function asPositiveNumber(value: unknown): number | null {
  if (typeof value !== 'number') return null;
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

/**
 * Returns the expected full session duration (in seconds) for a rule when available.
 * This should stay in lockstep with foreground timer duration logic.
 */
export function resolveRuleSessionSeconds(rule: RuleConfig | null | undefined): number | null {
  if (!rule) return null;

  const cfg = (rule.engineConfig || {}) as Record<string, unknown>;

  const workDurationSeconds = asPositiveNumber(cfg.workDuration);
  if (workDurationSeconds) return Math.floor(workDurationSeconds);

  const sessionDurationSeconds = asPositiveNumber(cfg.sessionDuration);
  if (sessionDurationSeconds) return Math.floor(sessionDurationSeconds);

  const durationSeconds = asPositiveNumber(cfg.duration);
  if (durationSeconds) return Math.floor(durationSeconds);

  const timerMinutes = asPositiveNumber(cfg.timerMinutes);
  if (timerMinutes) return Math.floor(timerMinutes * 60);

  const intervalMinutes = asPositiveNumber(cfg.intervalMinutes);
  if (intervalMinutes) return Math.floor(intervalMinutes * 60);

  if (rule.engine === 'countdown') return 25 * 60;
  if (rule.engine === 'interval') return 20 * 60;

  return null;
}

/**
 * Foreground timer duration fallback for engines without explicit duration config.
 */
export function resolveForegroundDurationMs(rule: RuleConfig | null | undefined): number {
  const seconds = resolveRuleSessionSeconds(rule);
  if (seconds && seconds > 0) return seconds * 1000;
  return 60 * 60 * 1000;
}
