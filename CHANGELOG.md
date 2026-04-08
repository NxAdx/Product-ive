# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-04-08

### Added

- Shared session timing resolver:
  - `src/utils/sessionTiming.ts`
- Native Android updater bridge files:
  - `android/app/src/main/java/com/aadarshlokhande/productive/ApkInstallerModule.kt`
  - `android/app/src/main/java/com/aadarshlokhande/productive/ApkInstallerPackage.kt`
  - `android/app/src/main/java/com/aadarshlokhande/productive/PackageInstallerStatusReceiver.kt`
- SQLite query helpers for stats:
  - `getRecentSessions(limit)`
  - `getTodayPointDelta()`
- Stats screen session history + today point delta UI.
- Session regression test coverage for duration-resolution path.

### Changed

- `sessionStore.startSession()` now uses unified rule duration resolution before starting foreground timer.
- `CountdownEngine` and `FreeWriteRecallEngine` now use absolute elapsed-time math to prevent timer drift.
- `SessionStatusBadge` now uses shared rule duration resolution.
- `UpdateManager` now prefers native PackageInstaller flow and falls back to share/install intent when needed.
- Android packaging settings updated with `android.packagingOptions.doNotStrip=**/*.so` for reliable release builds on Windows.

### Fixed

- Fixed notification timer vs in-app timer mismatch caused by inconsistent duration source usage.
- Fixed fast/unsynced timer behavior from local decrement loops in timed engines.
- Closed native updater direct-install gap.
- Closed stats history visibility gap by surfacing SQLite data.
- Fixed local release build failure path and verified successful `assembleRelease`.

### Validation

- `npm test -- --coverage --ci` -> PASS
- `npx tsc --noEmit` -> PASS
- `npx eslint app src --max-warnings=0` -> PASS
- `npx expo-doctor` -> PASS (16/16)
- `npx expo export --platform web --clear` -> PASS
- `cd android && .\\gradlew.bat assembleRelease --console=plain --no-daemon` -> PASS

## [1.0.0] - 2026-04-06

### Added

- Core v1 release with 20 rules across 4 categories and 7 reusable engines.
- Onboarding flow, positivity scoring, themed UI foundation, and settings module.
- Foreground chronometer support and core session lifecycle controls.

### Changed

- Unified key UI interactions under app-themed modal and navigation patterns.
- Refined home/session experiences and baseline gamification indicators.

### Fixed

- Multiple runtime/import/animation stability issues during v1 hardening.
