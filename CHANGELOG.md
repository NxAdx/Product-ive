# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-04-08

### Added

- Core v1 release with 20 rules across 4 categories and 7 reusable engines.
- Onboarding flow, positivity scoring, themed UI foundation, and settings module.
- Foreground chronometer support with Notifee native Android foreground service.
- Headless JS task registration (`_layout.tsx`) to keep JS thread alive during background sessions.
- Pause/resume synchronization for foreground notification timers.
- "Finish Session" notification action handling in foreground and background app states.
- System theme follow mode and manual override in settings.
- Background reliability controls (notification settings, battery optimization, power manager).
- Shared session timing resolver (`src/utils/sessionTiming.ts`) for unified duration source.
- Native Android updater bridge (Kotlin PackageInstaller):
  - `ApkInstallerModule.kt`, `ApkInstallerPackage.kt`, `PackageInstallerStatusReceiver.kt`
- SQLite persistence layer with session/point_event tables and repository queries:
  - `getRecentSessions(limit)`, `getTodayPointDelta()`
- Stats screen wired to real SQLite session history and daily point delta.
- Jest regression test suite for positivity, todo, and session stores.
- ABI-split release packaging (`arm64-v8a`, `armeabi-v7a`) — ~45 MB per APK.

### Changed

- `sessionStore.startSession()` uses unified rule duration resolution before starting foreground timer.
- `CountdownEngine` and `FreeWriteRecallEngine` use absolute elapsed-time math to prevent drift.
- `SessionStatusBadge` uses shared rule duration resolution (no more hardcoded 25-min default).
- `UpdateManager` prefers native PackageInstaller flow and falls back to share/install intent.
- Unified all popup dialogs under themed `AppModal` — no native `Alert.alert` remains.
- `GuidedPromptEngine` blocks next/complete when required input is empty.

### Fixed

- Fixed notification timer vs in-app timer mismatch caused by inconsistent duration source.
- Fixed negative chronometer drift (`-00:22`) by adding headless JS timeout termination at zero.
- Fixed static 25-minute countdown default for all timed rules (2-min, 20-min, 90-min now correct).
- Fixed oversized release APK (~740 MB → ~45 MB) by enabling ABI splits and removing global `doNotStrip`.
- Closed native updater direct-install gap.
- Closed stats history visibility gap by surfacing SQLite data.
- Multiple runtime/import/animation stability issues resolved during hardening.

### Validation

- `npm test -- --coverage --ci` → PASS
- `npx tsc --noEmit` → PASS
- `npx eslint app src --max-warnings=0` → PASS
- `npx expo-doctor` → PASS (16/16)
- `npx expo export --platform web --clear` → PASS
- `cd android && gradlew assembleRelease` → PASS
