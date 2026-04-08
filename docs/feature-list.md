# Product+ive - Feature List

> Last Updated: 2026-04-08 (IST)

## Core Screens

### Home

- [x] Active session status card with pause/resume/finish controls
- [x] Settings entry point
- [x] Rule recommendation surfaces
- [x] Floating bottom nav

### Todo

- [x] Task creation and completion flow
- [x] Active/completed task sections
- [x] Positivity points on task completion
- [ ] Rule-aware task tagging picker UI (store support exists)

### Stats

- [x] Weekly score, streak, and lifetime cards
- [x] Progress ring and milestone ladder
- [x] Live weekly summary from store metrics
- [x] SQLite-backed recent session history
- [x] SQLite-backed today point delta

### Settings

- [x] Theme controls (light/dark/system)
- [x] Background reliability controls (notifications, battery optimization, power settings)
- [x] Software update check + install trigger
- [x] Bug report export and changelog view
- [x] Non-functional username chevron removed

### Rule Page

- [x] Rule header + engine mount area
- [x] Engine routing by rule engine type
- [x] Start/pause/end controls (inside engines)
- [x] Required-input validation for guided writing activities
- [ ] Rule-specific session history card (history currently shown on Stats)

### Explore

- [x] Search input
- [x] Real-time filtering
- [x] Rule list navigation to details

### Onboarding

- [x] Full multi-step onboarding flow

## Engines

- [x] CountdownEngine
- [x] IntervalReminderEngine
- [x] GuidedPromptEngine
- [x] SmartTaskSorterEngine
- [x] SpacedRepetitionEngine
- [x] AwarenessReflectionEngine
- [x] FreeWriteRecallEngine

## System Features

- [x] Theme architecture with AsyncStorage persistence
- [x] Positivity/session/todo/settings/wellness stores
- [x] Notifications wired to live app flows
- [x] Foreground timer pause/resume synchronization
- [x] SQLite persistence layer
- [x] Real automated test suite

## In-App Updater (Android)

- [x] GitHub releases version check
- [x] Update available state + UI
- [x] Changelog display
- [x] APK download flow
- [x] Native PackageInstaller flow
- [x] Install permission handling
- [x] OEM fallback behavior (share/install handoff)
- [ ] Auto-check toggle in settings (enhancement)
- [ ] Deferred install flow when session active (enhancement)

Reference docs:
- Updater skill reference: `.agents/skills/android-updater-patterns/SKILL.md`
