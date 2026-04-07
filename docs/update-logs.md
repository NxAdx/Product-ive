# Product +ive Update Logs

> Change log for implementation, CI/CD, dependency, and documentation work.

---

## 2026-04-07 - Pristine Precision & v1.0.0 Release

### Stabilization & Polish
- **Pristine Precision Unification**: Removed native mobile alerts globally in favor of a unified `<AppModal>` theme system.
- **Onboarding Pipeline Fixed**: Connected `onboarded` async storage explicitly inside `_layout.tsx` to launch the Setup Wizard cleanly.
- **Dynamic Session Metrics:** Swapped the Weekly Summary from hard-coded stats to real-time `positivityStore` trackers.
- **Intelligent Timers**: Re-engineered internal badge timers to intelligently count DOWN backwards for constraints like Pomodoro.
- **Visual Legibility**: Improved WCAG contrast for Medium Priority buttons and tinted Explore category icons.
- **Pristine Notification Syncs**: Leveraged `@notifee/react-native` to render permanent Chronometer notifications using Android's native `FOREGROUND_SERVICE`, allowing rules to visibly count down without JS interval suspension. Code modified to read payload timers cleanly (`workDuration`/`intervalMinutes`) without hardcoding 25-minute bugs.
- **Pipeline Optimizations**: Fixed GitHub prebuild crashes by purging `expo-notifee` wrapper configuration from `.plugins` object in `app.json`, fully deferring to Expo SDK 50+ auto-linking logic for stable Android Continuous Native Generation.
- **Final Polish**: Updated SemVer strings to `1.0.0` inside `package.json` and `app.json`.

---

## 2026-04-04 - SDK 55 Type Compatibility Fix

### Build & CI stability

- Resolved `npx tsc` failures in GitHub Actions caused by SDK 55 (`expo-notifications`) upgrade.
- Added missing `shouldShowBanner` and `shouldShowList` to `handleNotification` behavior.
- Added explicit `type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL` to notification triggers.
- Verified local build with `npx tsc --noEmit` -> PASS.

---

## 2026-04-02 - CI failure fix + UX stabilization + handoff refresh

### CI/build fixes

- Fixed failing GitHub build caused by Gradle cache lookup before `android/` existed.
- Updated `.github/workflows/ci-cd.yml` order:
  - Setup Node and install deps
  - Expo setup
  - `expo prebuild` (if missing)
  - Setup Java with `cache: gradle`
  - Gradle release build
- Added speed flags:
  - `npm ci --no-audit --prefer-offline` (lint job)
  - `npm ci --omit=dev --no-audit --prefer-offline` (build job)
  - `expo prebuild --no-install --non-interactive`

### UX and app behavior fixes

- Home top bar now keeps single actionable control (Settings on right).
- Added full Settings screen (`app/settings.tsx`) with:
  - Theme toggle
  - Bug report `.txt` export (state snapshot + runtime logs)
  - Changelog section with alert icon and current-version changes
  - About section
- Bottom nav behavior fixed:
  - Now visible only on Home
  - Plus icon style normalized (no old white center circle)
- Todo and Explore overlap issues fixed by route-aware nav hiding and layout polish.
- Category/rule list UI fixed:
  - Rule rows no longer show oversized white arrow circles
  - Category icons converted to stable Lucide icons
- Brand text standardized to `Product +ive` in app surfaces.

### Crash and stability fixes

- Fixed likely rule crash path in `GuidedPromptEngine`:
  - Safely normalizes `engineConfig.steps/prompts/sections` before rendering.
  - Prevents object-to-Text rendering crash for rules like Feynman.
- Improved `IntervalReminderEngine` config mapping:
  - Supports `interval` and `intervalMinutes`
  - Supports `reminderMessage` and `prompt`
- `Rule` screen now guards missing rule id and avoids hard crash.

### Positivity meter improvements

- Weekly and lifetime scoring logic refined in store.
- Discovery bonus awarded once per rule.
- Meter UI now explains how scoring works directly in the screen.

### Dependency and typography cleanup

- Removed unused old DM font packages from `package.json`.
- Standardized fonts around Syne / Plus Jakarta Sans / JetBrains Mono.
- Removed corrupted text encoding from app/source files.

### Validation results

- `npx eslint app src --max-warnings=0` -> PASS
- `npx tsc --noEmit` -> PASS
- `npx expo-doctor` -> PASS (17/17)
- `npx expo export --platform web --clear` -> PASS

### Known remaining warnings (upstream/transitive)

- `npm ci` may still print deprecated warnings for:
  - `inflight@1.0.6`
  - `glob@7.2.3`
  - `rimraf@3.0.2`
- Current source chain (as of 2026-04-02):
  - `react-native@0.83.4` toolchain and Expo CLI transitive packages.
- These are not direct project dependencies and are pending upstream ecosystem updates.

---

## 2026-04-01 - Project documentation and governance setup

- Created and organized `docs/` structure.
- Added architecture, roadmap, feature, testing, and security docs.
- Added AI role/governance guidance in `docs/Your_Role.md`.
