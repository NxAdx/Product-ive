# Product+ive - Architecture

> Last Updated: 2026-04-07 (IST) | Status: Active

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
- `sessionStore`: active session state and completion logic.
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
- repositories:
  - `src/db/sessionRepository.ts`

### 4) Notification Layer

- `@notifee/react-native` foreground chronometer for active timed sessions.
- `expo-notifications` for permission checks, wellness schedules, and immediate local reminders.
- `NotificationManager` mediates notification behavior and Expo Go safety checks.

### 5) Updater Layer

- `UpdateManager` checks GitHub latest release metadata.
- Uses semantic version comparison.
- Detects APK release assets and triggers download/install handoff.
- Native PackageInstaller bridge remains pending for full direct-install flow.

## Data Flow Examples

### Session completion flow

`Engine end -> sessionStore.endSession() -> positivity points/streak -> SQLite session + point_events write -> foreground timer cleanup`

### Task completion flow

`todoStore.toggleTodo() -> positivity +10 -> SQLite point_event write`

## Constraints / Open Design Items

1. Updater still needs native installer bridge completion.
2. Session history UI should be added on top of current SQLite tables.
3. Full notification parity across all engines is still incremental.
