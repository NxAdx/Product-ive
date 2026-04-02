# Product+ive — Feature List

> **Last Updated:** 2026-04-01

---

## Core Features

### Screen 1: Home
- [ ] 2×2 category grid (4 visual cards with icons)
- [ ] Theme toggle (sun/moon, top-right)
- [ ] About button (ⓘ, top-left)
- [ ] Floating pill bottom nav (Home | + | Meter)
- [ ] Press animation (scale 0.97 spring-back)

### Screen 2: Todo
- [ ] Task creation via + button (bottom sheet)
- [ ] Rule-aware task tagging (horizontal pill picker)
- [ ] Frog of the Day section (Eat the Frog)
- [ ] Quick 2-min section (2-Minute Rule)
- [ ] 1-3-5 section (Big/Medium/Small slots)
- [ ] General tasks section
- [ ] Positivity points on completion

### Screen 3: Positivity Meter
- [ ] Circular progress ring (fills clockwise)
- [ ] 3 stat cards (Sessions, Tasks, Rules)
- [ ] Activity log (chronological point feed)
- [ ] Weekly streak calendar (7 dots)
- [ ] Milestone celebrations
- [ ] Duck mascot at ring fill point

### Screen 4: Category List
- [ ] Back arrow + category header
- [ ] Full-width pill rows per rule
- [ ] Black circle → arrow button (protruding effect)
- [ ] Category colour dot + rule name + description

### Screen 5: Rule Page
- [ ] Rule name header + info button (ⓘ)
- [ ] Engine area (~60% screen)
- [ ] Start/Pause/End session controls
- [ ] Session history card
- [ ] Description bottom sheet (What, Why, Best For)

---

## 7 Logic Engines

- [ ] CountdownTimerEngine
- [ ] IntervalReminderEngine
- [ ] GuidedPromptEngine
- [ ] SmartTaskSorterEngine
- [ ] SpacedRepetitionEngine
- [ ] AwarenessReflectionEngine
- [ ] FreeWriteRecallEngine

---

## System Features

- [ ] Light/Dark theme (persisted via AsyncStorage)
- [ ] Positivity scoring system
- [ ] Local notifications (expo-notifications)
- [ ] SQLite persistence (expo-sqlite)
- [ ] Onboarding flow (3 screens)
- [ ] About screen (bottom sheet or page)

---

## In-App Updater (Direct Install)

- [ ] GitHub API version check (compare current vs latest release tag)
- [ ] Update available notification/badge on About or Home screen
- [ ] Changelog display (rich text from GitHub release body)
- [ ] APK download with progress indicator (foreground service)
- [ ] Direct install via PackageInstaller Session API
- [ ] MIUI fallback (Intent.ACTION_VIEW for Xiaomi devices)
- [ ] Auto-check toggle in settings (enable/disable periodic checks)
- [ ] Delayed install (if user is mid-session, install later)
- [ ] `REQUEST_INSTALL_PACKAGES` permission handling

**Research Reference:** `D:\Development\Production\research\docs\research\updater-logic\`
**Pattern Reference:** `.agents/skills/android-updater-patterns/SKILL.md`

