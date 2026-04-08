# Product+ive - Architecture

> Last Updated: 2026-04-08 (IST) | Status: Active

## System Model

Product+ive uses a config-driven rule architecture:

`RuleConfig -> Engine Component -> Session Store -> Positivity + Persistence`

The app keeps the 20 rules as data and maps each rule to one of 7 reusable engines.

## Runtime Layers

### 1) UI and Navigation

- Expo Router for stack + tabs.
- Primary tabs: Home, Add, Explore, Stats.
- Rule/category/settings/onboarding are stack routes.

### 2) State Layer (Zustand)

- `positivityStore`: score, streaks, rule usage, reflection entries.
- `sessionStore`: active session state, pause/resume lifecycle, completion logic.
- `todoStore`: task lifecycle and completion scoring.
- `settingsStore`: user preferences.
- `wellnessStore`: reminder configuration.

### 3) Persistence Layer

- AsyncStorage for user/state preferences.
- SQLite (`expo-sqlite`) for structured runtime history:
  - `sessions`
  - `point_events`
- Bootstrap + migration entry:
  - `src/db/database.native.ts`
- Web-safe adapter:
  - `src/db/database.web.ts`
- Repositories:
  - `src/db/sessionRepository.ts`
- Stats queries now consume SQLite session history and daily point delta.

### 4) Notification Layer

- `@notifee/react-native` foreground chronometer for active timed sessions.
- `expo-notifications` for permission checks, wellness schedules, and immediate local reminders.
- `NotificationManager` mediates notification behavior and Expo Go safety checks.
- Session timing now resolves from a shared duration source (`src/utils/sessionTiming.ts`) to keep in-app and notification timers in lockstep.

### 5) Updater Layer

- `UpdateManager` checks GitHub latest release metadata.
- Uses semantic version comparison.
- Detects APK release assets and triggers download/install flow.
- Native bridge uses Android PackageInstaller for direct install path with permission guidance and fallback.

## Data Flow Examples

### Session completion flow

`Engine end -> sessionStore.endSession() -> positivity points/streak -> SQLite session + point_events write -> foreground timer cleanup`

### Task completion flow

`todoStore.toggleTodo() -> positivity +10 -> SQLite point_event write`

## Current Design Notes

1. Core phase-closure gaps are resolved (timer sync, native installer, release build, SQLite history surfacing).
2. Future work is enhancement-focused (deeper analytics and broader integration tests), not blocker-focused.
