# Product+ive - Feature List

> Last Updated: 2026-04-02 (IST)

## Core Screens

### Home

- [x] 2x2 category grid (4 cards)
- [ ] Theme toggle button (theme system exists, direct UI toggle is pending)
- [ ] About action wiring (icon exists, action pending)
- [x] Floating bottom nav (Home, Tasks, Explore, Meter)
- [x] Card press animation with spring feedback

### Todo

- [x] Task creation from in-screen input form
- [ ] Rule-aware task tagging UI picker (state supports tags, UI still pending)
- [x] "Eat the Frog" high-priority spotlight section
- [ ] Quick 2-min section
- [ ] 1-3-5 section layout
- [x] Active/completed task sections
- [ ] Positivity points on task completion (not fully integrated yet)
- [ ] Modal `app/todo.tsx` save action to store (TODO in code)

### Positivity Meter

- [x] Weekly score display
- [x] Streak and lifetime stat cards
- [ ] Circular progress ring
- [ ] Activity feed
- [ ] Weekly streak calendar dots
- [ ] Milestone celebration visuals
- [ ] Mascot placement

### Category List

- [x] Back navigation + category header
- [x] Full-width rule rows
- [x] Arrow affordance in row item
- [x] Category color + rule metadata in row

### Rule Page

- [x] Rule header + engine mount area
- [x] Engine routing by rule engine type
- [x] Start/pause/end controls (inside engines)
- [ ] Rule info sheet action (Info button TODO)
- [ ] Session history card UI

### Explore

- [x] Search input
- [x] Real-time filter
- [x] Rule list navigation to details

### Onboarding

- [x] Basic onboarding screen
- [ ] Full multi-step onboarding flow

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
- [x] Positivity store and session store
- [x] Todo store and settings store
- [ ] Notifications wiring to live app flows
- [ ] SQLite persistence layer wiring
- [ ] Real automated test suite

## In-App Updater (Android)

- [ ] GitHub releases version check
- [ ] Update available state + UI
- [ ] Changelog display
- [ ] APK download with progress
- [ ] Package installer flow
- [ ] MIUI fallback behavior
- [ ] Auto-check toggle in settings
- [ ] Deferred install flow when session active
- [ ] Install permission handling

Reference docs:
- Updater research: `D:\Development\Production\research\docs\research\updater-logic\`
- Skill reference: `.agents/skills/android-updater-patterns/SKILL.md`
