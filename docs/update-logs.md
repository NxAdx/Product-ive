# Product +ive Update Logs

> Change log for implementation, CI/CD, dependency, and documentation work.

---

## 2026-04-08 - Phase 8 Completion Sprint

### Completed
- **CI Pipeline Optimization**: Cached `android/` prebuild and Gradle outputs, dropping rebuild time to ~12m.
- **Rule Session History**: Added a "Recent Sessions" card to `app/rule/[id].tsx` pulling from SQLite.
- **Auto-check Toggle**: Added `autoCheckUpdates` toggle to settings screen + store.
- **Deferred Install**: Prevented update installation if `sessionStore.activeRuleId` is active.
- **Testing**: Added `UpdateManager.test.ts` (semver, selection) and `sessionRepository.test.ts` (SQLite transaction mocking). Tests expanded to 5 suites (32 tests total).
- **Settings Changelog**: Updated `CURRENT_VERSION_CHANGES` to reflect v1.0.0 features.

### Next Steps
- Implement analytics visualization (charts/graphs) on Stats screen.
- Tag a `v1.0.0` release on GitHub with APK asset to enable the updater flow.

## 2026-04-08 - Android APK Size Emergency Fix

### Problem observed
- Release APK output had grown to ~740 MB and installed footprint could approach ~1 GB.

### Root cause
- The release artifact included all four ABIs (`arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64`).
- Native symbol stripping had been globally disabled via `android.packagingOptions.doNotStrip=**/*.so`.

### Fix applied
- Removed global `android.packagingOptions.doNotStrip` from `android/gradle.properties`.
- Enabled ABI splits in `android/app/build.gradle` and disabled universal APK:
  - include: `arm64-v8a`, `armeabi-v7a`
  - `universalApk false`

### Verified output
- `app-arm64-v8a-release.apk` -> 45.11 MB
- `app-armeabi-v7a-release.apk` -> 38.68 MB

### Build verification
- `cd android && .\\gradlew.bat assembleRelease --console=plain --no-daemon` -> PASS
- Note: `clean assembleRelease` still has an existing Windows RN New Architecture clean/codegen issue; normal `assembleRelease` succeeds.

---

## 2026-04-08 - Final Phase Closure Sprint (Pending/Mismatch/Risk Closure)

### Timer synchronization and performance closure
- Added shared duration resolver in `src/utils/sessionTiming.ts`.
- Updated `sessionStore.startSession()` to use unified session duration source (`resolveForegroundDurationMs`).
- Reworked `CountdownEngine` and `FreeWriteRecallEngine` to compute time from absolute elapsed session time (instead of local decrement loops).
- Updated `SessionStatusBadge` timer display to use the same shared rule-duration resolver.
- Added regression test coverage ensuring interval rules use configured full session duration.

### Persistence + UI closure
- Extended DB interface support with `getAllAsync` in `src/db/types.ts` and `src/db/database.web.ts`.
- Added repository query methods in `src/db/sessionRepository.ts`:
  - `getRecentSessions(limit)`
  - `getTodayPointDelta()`
- Updated `app/(tabs)/stats.tsx` to render real SQLite-backed session history and daily point delta.

### Updater completion
- Added native Android PackageInstaller bridge:
  - `ApkInstallerModule.kt`
  - `ApkInstallerPackage.kt`
  - `PackageInstallerStatusReceiver.kt`
- Registered native package in `MainApplication.kt`.
- Added installer permission + receiver wiring in `AndroidManifest.xml`.
- Updated `UpdateManager` to:
  - verify install permission
  - open unknown-app-install settings when needed
  - use native install first
  - fallback safely to share/install intent flow.

### Release build stabilization
- Added `android.packagingOptions.doNotStrip=**/*.so` in `android/gradle.properties` to avoid Windows strip-symbol release build failures.
- Android release build now succeeds locally.

### Validation
- `npm test -- --coverage --ci` -> PASS
- `npx tsc --noEmit` -> PASS
- `npx eslint app src --max-warnings=0` -> PASS
- `npx expo-doctor` -> PASS (16/16)
- `npx expo export --platform web --clear` -> PASS
- `cd android && .\\gradlew.bat assembleRelease --console=plain --no-daemon` -> PASS

---

## 2026-04-08 - Feedback Report Closure Sprint (UX/Theme/Permissions)

### Timer lifecycle sync
- Added pause/resume synchronization for foreground notification timers in `src/services/ForegroundTimerService.ts`.
- Wired session pause/resume lifecycle to foreground timer pause/resume in `src/store/sessionStore.ts`.
- Added `Finish Session` notification action handling for foreground and background app states in `app/_layout.tsx`.

### Background reliability and permission UX
- Added settings controls for notification settings, battery optimization exclusion (Android), and power manager settings (Android).

### UI and theming
- Added full `system` theme mode in `src/theme/ThemeContext.tsx`.
- Settings supports follow-system mode and manual override when system-follow is disabled.
- Removed tiny non-functional user-name chevron from settings identity card.

### Pop-up consistency and activity validation
- Replaced remaining native alert dialogs with themed `AppModal` in settings and core engines.
- `GuidedPromptEngine` now blocks next/complete when required input is empty.

---

## 2026-04-07 - Stabilization Sprint

- Removed duplicate session point attribution in countdown/guided engines.
- Persisted post-session reflection scores to positivity history.
- Added SQLite bootstrap/migrations and repository wiring.
- Added immediate local notification helper and interval reminder local notifications.
- Hardened updater semver/release parsing and APK handoff path.
- Replaced placeholder tests with Jest regression suite.

---

## 2026-04-02 - CI failure fix + UX stabilization

- Fixed CI/prebuild/Gradle workflow ordering issues.
- Stabilized settings, navigation behavior, and category/rule UI consistency.
- Added bug report export and changelog/about sections in settings.
- Improved rule-engine safety guards and positivity meter logic.

---

## 2026-04-01 - Documentation and governance setup

- Created and organized `docs/` structure.
- Added architecture, roadmap, feature, testing, and security docs.
- Added AI role/governance guidance in `docs/Your_Role.md`.
