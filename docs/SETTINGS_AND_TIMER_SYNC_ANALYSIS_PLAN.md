# Settings Duplication + Timer Sync Issue Analysis & Plan

> Date: 2026-04-08 (IST)
> Status: Analysis only (no behavior changes made)

## Reported Issues

1. Settings shows `Notifications are Restricted` inside `Biological Optimization` while `Background Reliability` already shows notification restriction status and actions.
2. Active timer in notification and in-app timer still differ (example shown: 24:57 vs 24:58).

## Analysis

### A) Why the duplicate notification restriction warning exists

Current settings implementation has two independent UX surfaces for the same notification-permission condition:

1. `WellnessNotificationsSection` (Biological Optimization)
   - Shows warning banner `Notifications are Restricted`.
   - State is local `permStatus`, fetched once on mount via `getPermissionStatus()`.
   - This section is designed to gate wellness reminder toggles.

2. `BackgroundReliabilitySection`
   - Shows status rows (`Notifications: Allowed/Restricted`, battery optimization state).
   - Contains actions to open notification settings, battery optimization settings, power manager, and refresh status.

Because these are separate components with separate local state and lifecycle, the UX duplicates the same condition and can look inconsistent or redundant.

### B) Why timer can still differ by ~1 second

Even after prior sync fixes, there is still potential for persistent 1-second offset due to timing anchor and display math differences:

1. Different anchor creation timing
   - App timer uses `sessionStore.startTime = Date.now()`.
   - Notification timer uses `ForegroundTimerService` internal `deadlineAtMs` derived from its own `Date.now()` call.
   - These are not guaranteed to be the exact same timestamp.

2. Different display update mechanics
   - In-app timer updates via JS interval tick + `Math.floor((now-start)/1000)`.
   - Notification chronometer is OS-driven.
   - Different rounding and tick boundaries can keep one side 1 second ahead/behind.

3. Channel/setup async timing
   - Notification startup path includes async steps (`ensureChannel`, notification display), which can shift effective countdown anchor relative to UI render anchor.

This explains the screenshot-level mismatch (24:57 notification vs 24:58 in app).

## Plan (No Code Applied Yet)

### Phase 1 - Settings UX de-duplication

1. Make `Background Reliability` the single source of truth for notification restriction status.
2. Remove standalone `Notifications are Restricted` banner from `Biological Optimization` OR convert it into a passive inline hint that only links to `Background Reliability` (no duplicate status wording).
3. Lift permission status to shared screen-level state so both sections read the same value.
4. Refresh shared status on:
   - screen focus
   - app foreground return
   - completion of any settings deep-link action

Acceptance criteria:
- User sees one canonical restriction status message.
- No contradictory or stale permission states between sections.

### Phase 2 - Timer anchor unification

1. Introduce a single session timing anchor payload in store:
   - `sessionStartedAtMs`
   - `sessionDeadlineAtMs`
2. Generate both values once in store at session start.
3. Pass exact `deadlineAtMs` to foreground notification service (instead of service creating its own independent anchor).
4. Make in-app countdown compute from `deadlineAtMs - now`.

Acceptance criteria:
- App timer and notification timer use same deadline source.
- No persistent 1-second drift after start/pause/resume cycles.

### Phase 3 - Display rounding normalization

1. Standardize remaining-time conversion for both app and paused notification body.
2. Use a consistent policy (e.g., `ceil(remainingMs / 1000)` for countdown UI) to avoid off-by-one visual mismatch near second boundaries.
3. Align UI tick scheduling to second boundaries (not just every 1000ms from arbitrary start).

Acceptance criteria:
- Timer display aligns within same second at steady state.
- No repeated visible flip-flop around boundaries.

### Phase 4 - Pause/Resume regression hardening

1. Validate pause timestamp and resume offset are based on shared anchor data.
2. Add tests for:
   - fresh start sync
   - pause/resume sync
   - background->foreground return sync
   - long-running session sync
3. Add instrumentation logs for temporary debugging:
   - app remaining seconds
   - notification deadline
   - anchor timestamp delta at start/resume

Acceptance criteria:
- Regression suite catches reintroduction of drift.
- Observed timers remain aligned in real-device runs.

## Test Matrix

1. Device classes:
   - Pixel/AOSP-like
   - OEM aggressive power manager (MIUI/Realme/Oppo/Vivo)
2. App states:
   - foreground
   - background
   - lock screen
   - after returning from system settings
3. Session flows:
   - start immediately after app open
   - pause at random second
   - resume after 5-60 seconds
   - finish from notification action

## Risk Notes

1. If not fixed, users will continue to mistrust timer precision.
2. Duplicate warning status in settings can be interpreted as UI bug and erodes confidence.
3. Aggressive OEM battery behavior can mask root causes unless anchor telemetry is logged during validation.

## Suggested Implementation Order

1. Phase 1 (settings de-duplication) - quick UX cleanup.
2. Phase 2 + 3 (single deadline + rounding/tick normalization) - core timing fix.
3. Phase 4 (tests/telemetry) - prevent regressions.

---
Saved as requested for later execution.
