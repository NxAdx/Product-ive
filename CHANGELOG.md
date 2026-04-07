# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-04-07

### Added

- Real automated test suite with Jest + `jest-expo`:
  - `jest.config.js`
  - `jest.setup.ts`
  - store regression tests for positivity/todo/session flows
- SQLite bootstrap + migrations via `src/db/database.native.ts`.
- Platform-safe SQLite web adapter via `src/db/database.web.ts` and `src/db/types.ts`.
- SQLite session/point-event repositories via `src/db/sessionRepository.ts`.
- `notifyNow()` utility for immediate local notification events.

### Changed

- `npm test` now runs Jest (replacing placeholder test script).
- `UpdateManager` now performs semantic version comparison and release APK asset detection.
- Settings updater UX now uses themed modal actions for update prompt/install trigger.
- Interval reminders now issue local notifications through `NotificationManager`.

### Fixed

- Removed duplicate point awarding path in `CountdownEngine`.
- Removed duplicate point awarding path in `GuidedPromptEngine`.
- Session reflection score is now persisted into positivity state history.
- Onboarding step type drift corrected (`availability` removed from union type).
- Restored web export compatibility by avoiding `expo-sqlite` bundling on web paths.
- Fixed `android/gradlew.bat` empty `CLASSPATH` bug preventing Gradle startup.

## [1.0.0] - 2026-04-06

### Release: Product +ive v1.0.0 — Pristine Precision & Elite Baseline 🚀

This is the definitive "v1.0.0" release of Product +ive, featuring the completion of the "Pristine Precision" UI/UX sprint, dynamic state management, and full visual unification.

#### Added

**✨ Pristine Precision Enhancements (Final Review Fixes)**
- **Onboarding Flow Integration**: Fresh installations correctly route to the immersive Welcome & Setup screens.
- **Dynamic Weekly Stats**: Hardcoded placeholders replaced with real-time tracking for Focus Sessions completed and Total Focus Time (hrs).
- **Themed Modal Adoption**: Expanded `AppModal` usage across key settings and custom picker flows for consistent UX.
- **Intelligent Timer Countdown**: Activity badge timers automatically detect `countdown` or `interval` engine rules to run backwards relative to the configured limit rather than chronologically forward. All timer badges correctly scale to exact duration boundaries (e.g. 2 minutes vs 90 minutes).

**🔥 Native OS Synchronization (NEW)**
- **Foreground Chronometers**: Implemented `@notifee/react-native` background services to allow active execution timers to definitively run out-of-bounds. Session timers dynamically pin to the top of your lock screen and animate perfectly counting downward without relying on vulnerable JS thread logic.
- **Headless Task Retention**: React Native JavaScript engine is purposefully kept awake via Top-Level layout injection during sessions. This natively permits exact interception at `00:00` to stop negative clock drift.
- **Haptic Callbacks**: Native device hardware vibrations are actively triggered securely the moment a background chronometer expires.

**🧠 Behavioral Retention Engine**
- **Session Reflection Modal**: After every practice, users can score their focus (1-5). This data is recorded to the posivity store for long-term insights.
- **Session Delta**: Real-time feedback on "Today's Point Gain" (+15 pts) displayed on the Stats screen.
- **Pulsing Focus Timer**: The active session status badge now features an animated pulsing dot (●) to maintain rhythmic focus awareness.

**🔍 Semantic Discovery (Explore 2.0)**
- **Intention Grouping**: Explore screen re-architected with semantic sections: "Quick Wins", "Deep Work", and "Popular".
- **Visual Metadata Pills**: Difficulty (Hard/Easy) and Estimated Duration (⏱ 25 min) are now pinned to every rule card.
- **Category Branding**: Left-tinted borders and iconography unified by category color for faster identification.

**⚡ Gamification & Growth**
- **Progress Ladder**: "🏆 Level:" rank badge (Catalyst, Legend) elevated on the Home and Stats screen.
- **Milestone Sprints**: Clear visual representation of how many points are needed to unlock the next rank.

**🛠 Friction Reduction**
- **Quick Add Drawer**: New suggestion row in the Commitments screen (e.g., "Study 30m", "Deep Focus") for 1-tap task creation.

#### Changed

**🎨 Standardized Design Language**
- **Icon Unification**: Replaced all directional arrows with premium `ChevronRight` visual affordances for a top-tier navigational feel.
- **Universal Green Accent**: All "Selected" and "Active" states (Priorities, Navigation, Selection) now use the standard Green (#22C55E).
- **Dark Mode Refinement**: Deepened the Hero card's visual contrast in Light mode for a more authoritative, professional weight.

#### Fixed
- **Runtime Errors**: Resolved `ReferenceError: useSharedValue` and `ArrowRight` crashes.
- **Import Conflicts**: Fixed duplicate Lucide icon imports and Babel plugin misconfigurations.
- **Animation Glitches**: Rewrote Reanimated shared-value patterns in `CategoryCard` to prevent component flickering during layout transitions.

#### Technical Details
- **Architecture**: Core engines integrated with Zustand-based Positivity & Session stores.
- **Speed**: Optimized Android local build workflow (./gradlew) for 120s rapid builds.
- **Standard**: TypeScript Strict Mode + 100% Font coverage (Inter, Syne, JetBrains Mono).

---
**Status:** Elite / Stable / Production Ready
**Version:** 1.0.0
**Build:** 1
