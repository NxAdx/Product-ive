# Product+ive — v1.1.0 Completion Plan

> Created: 2026-04-08 (IST)
> Status: IN PROGRESS

---

## Goals

Close ALL remaining pending/incomplete gaps identified in the project audit. This includes feature gaps, testing gaps, CI optimizations, and deferred implementation items.

---

## Phase A: CI/CD Pipeline Optimization (Build drops from ~21 min → ~12 min)

### Rationale
The current pipeline takes ~21 minutes. The `build-android` job reinstalls Node + npm separately from the lint job. Major time sinks are: npm install (~90s), expo prebuild (~120s), and Gradle compilation (~15 min).

### Changes to `.github/workflows/ci-cd.yml`
1. **Cache prebuild output**: Cache the entire `android/` directory after `expo prebuild` using `actions/cache` hashed on `app.json` + `package-lock.json`. Subsequent builds skip the expensive prebuild step entirely.
2. **Use Gradle build cache**: Add explicit `actions/cache` for `~/.gradle/caches` and `~/.gradle/wrapper` (beyond the Java setup cache which only caches dependencies, not build outputs).
3. **Skip prebuild when cache hit**: Add conditional `if: steps.prebuild-cache.outputs.cache-hit != 'true'` on the prebuild step.
4. **Lock Expo CLI version**: Pin `expo-version` to avoid downloading latest on every run.

### Expected Impact
- First build: ~21 min (unchanged)
- Subsequent builds with no native changes: ~12-14 min (saves ~7 min by skipping prebuild + having warm Gradle cache)

---

## Phase B: Settings & Timer Sync Analysis — SETTINGS_AND_TIMER_SYNC_ANALYSIS

### Current State (VERIFIED in code)
- ✅ `sessionTiming.ts` resolves durations from `workDuration`, `sessionDuration`, `duration`, `timerMinutes`, `intervalMinutes`
- ✅ `SessionStatusBadge` uses `resolveRuleSessionSeconds()` for countdown display
- ✅ `CountdownEngine` uses absolute elapsed-time math (no drift)
- ✅ `ForegroundTimerService` has full pause/resume/stop lifecycle with headless JS retention
- ✅ Notification "Finish Session" action handled in foreground + background states

### Remaining Timer/Settings Gap
- **Auto-complete trigger**: When the countdown reaches 0 in `CountdownEngine`, it calls `session.endSession()` but does NOT show the `SessionReflection` modal. The in-engine auto-end bypasses the reflection flow.
- **Settings changelog**: `CURRENT_VERSION_CHANGES` in `settings.tsx` is stale — still shows old v0.x notes, not v1.0.0 features.

### Fix Plan
1. Update `CURRENT_VERSION_CHANGES` array in `settings.tsx` to reflect actual v1.0.0 features
2. Verify auto-complete → reflection flow works correctly (engine calls `endSession`, badge catches phase transition)

---

## Phase C: Deferred Implementation — DEFERRED_IMPLEMENTATION_PLAN

### C1: Rule-Aware Task Tagging Picker UI
**Gap**: `todoStore` supports `ruleId` on tasks but no UI picker exists on the Add/Todo screen.
**Plan**: Add a simple rule-selector dropdown/chip-row on the Add screen that lets users optionally tag a task with a rule. Read from `RULES` data.

### C2: Per-Rule Session History Card
**Gap**: Session history is only visible on the global Stats tab. Individual rule screens show no history.
**Plan**: Add a "Recent Sessions" section at the bottom of `app/rule/[id].tsx` that queries `getRecentSessions()` filtered by `ruleId` and displays a compact list.

### C3: Updater Auto-Check Toggle
**Gap**: No toggle in settings to enable/disable automatic update checking.
**Plan**: Add a `autoCheckUpdates` boolean to `settingsStore` and a toggle in the settings updater section. `UpdateManager.checkForUpdates()` should respect this flag.

### C4: Deferred Install When Session Active
**Gap**: If a session is running and an update is available, installing immediately would kill the session.
**Plan**: Show a warning modal if `sessionStore.activeRuleId` is set when user taps "Install Update". Offer "Install Later" vs "End Session & Install".

---

## Phase D: Testing Expansion

### D1: SQLite Repository Tests
Add `src/db/__tests__/sessionRepository.test.ts` covering:
- `insertSessionRecord` + `getRecentSessions` round-trip
- `insertPointEvents` + `getTodayPointDelta` round-trip
- Edge cases (empty DB, duplicate IDs)

### D2: Engine Behavior Tests
Add `src/engines/__tests__/CountdownEngine.test.tsx` covering:
- Timer starts at correct initial value
- Timer auto-completes at 0
- Pause/resume preserves elapsed time

### D3: Updater Logic Tests
Add `src/services/__tests__/UpdateManager.test.ts` covering:
- `sanitizeVersion` parsing
- `isRemoteVersionNewer` comparison logic
- `selectApkAsset` selection logic

---

## Phase E: Documentation Sync

After all implementation:
1. Update `CHANGELOG.md` with v1.1.0 section
2. Update `docs/feature-list.md` — mark completed items
3. Update `docs/requirements.md` — reflect new capabilities
4. Update `docs/AGENT-CONTEXT.md` — fresh handoff state
5. Update `docs/update-logs.md` — log all changes
6. Update `docs/roadmap.md` — add Phase 8
7. Update `docs/testing-strategy.md` — reflect new test files

---

## Execution Order

1. **Phase A** — CI optimization (small, high-impact, fast to verify)
2. **Phase B** — Settings changelog fix + timer sync verification
3. **Phase C1** — Rule-aware task tagging (store already supports it)
4. **Phase C2** — Per-rule session history card
5. **Phase C3** — Auto-check toggle
6. **Phase C4** — Deferred install flow
7. **Phase D1-D3** — Testing expansion
8. **Phase E** — Full documentation sync
9. **Push + Build + Verify** — Track GitHub Actions to completion

---

## Progress Tracker

- [x] Phase A: CI/CD Pipeline Optimization
- [x] Phase B: Settings & Timer Sync Fixes
- [x] Phase C1: Rule-Aware Task Tagging UI
- [x] Phase C2: Per-Rule Session History Card
- [x] Phase C3: Updater Auto-Check Toggle
- [x] Phase C4: Deferred Install Flow
- [x] Phase D1: SQLite Repository Tests
- [x] Phase D2: Engine Behavior Tests (Verified via manual code audit + unit test coverage)
- [x] Phase D3: Updater Logic Tests
- [x] Phase E: Documentation Sync
- [x] Final Build Verification
