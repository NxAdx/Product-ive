# Fixes Changes To Do

> Last Updated: 2026-04-08 (IST)
> Scope: Feedback report closure + pending/mismatch/risk closure

## 1) Timer Synchronization and Performance

- [x] Unified session duration resolution between in-app and notification timers (`src/utils/sessionTiming.ts`).
- [x] Updated `sessionStore.startSession()` to start foreground timers with the same resolved duration.
- [x] Reworked countdown/freewrite engines to compute time from absolute elapsed session time.
- [x] Updated session badge timer to use the same duration resolver.
- [x] Added regression test for interval/session duration timing path.

## 2) Background Operation and Permissions

- [x] Added background reliability controls in settings:
  - open notification settings
  - battery optimization settings (Android)
  - power manager settings (Android)
- [x] Added installer permission guidance for APK update installs.

## 3) UI / Theme Issues

- [x] Removed tiny non-functional username chevron from Settings identity row.
- [x] Added and wired system-theme following mode (`system` / `light` / `dark`).
- [x] Replaced remaining native alerts with themed modal UX in key flows.

## 4) Activity Validation

- [x] Guided prompt now blocks `Next` / `Complete` when required input is empty.

## 5) Pending / Not Fully Done / Mismatches / Risks

- [x] Native updater PackageInstaller bridge completed.
- [x] SQLite session history surfaced in Stats UI.
- [x] Android local release build blocker resolved and verified.
- [x] Core status docs, logs, changelog, and handoff context synchronized.

## 6) Verification Evidence

- [x] `npm test -- --coverage --ci` PASS
- [x] `npx tsc --noEmit` PASS
- [x] `npx eslint app src --max-warnings=0` PASS
- [x] `npx expo-doctor` PASS
- [x] `npx expo export --platform web --clear` PASS
- [x] `cd android && .\\gradlew.bat assembleRelease --console=plain --no-daemon` PASS
