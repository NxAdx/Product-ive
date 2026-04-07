# Product +ive Requirements

> Last Updated: 2026-04-02 (IST)

## 1) Core Product Requirements

1. Ship 20 rule-driven experiences across 4 categories.
2. Keep 7 reusable engines as the execution layer for rules.
3. Keep app behavior offline-first with local persistence.
4. Track consistency with positivity score, levels, and streak logic.
5. Keep Android updater flow planned and documented until implementation is complete.

## 2) Active UX Requirements (From Current Owner)

1. Home top bar must have one actionable icon on the right (Settings).
2. Settings must include:
   - Theme toggle
   - Report bug export as `.txt` with runtime logs
   - Changelog with alert icon, version, and current-version-only notes
   - About section
3. Bottom nav must only appear on Home.
4. Bottom nav plus icon must not use the old white circular style.
5. All bottom nav icons must be aligned and visually consistent.
6. Category labels and typography must be clean and readable.
7. App brand text must render as `Product +ive`.
8. Explore list text must not overflow cards.
9. Todo screen must not be overlapped by bottom nav.
10. Category rule rows must use a clean arrow affordance (no large white circles).
11. Rule screens must fail safely without crashes when invalid/missing config appears.

## 3) Positivity Meter Requirements

1. Completing a session adds rule base points.
2. First completion of a unique rule adds one-time discovery bonus.
3. Weekly score resets by week boundary.
4. Lifetime score never resets.
5. Meter UI must explain scoring rules directly in-app.

## 4) Engineering Requirements

1. TypeScript strict mode remains enabled.
2. CI lint must pass with zero warnings.
3. Type-check must pass before merge.
4. Docs and handoff context must be updated with each non-trivial change.
5. Dependency changes must remain Expo SDK compatible.

## 5) CI/CD Requirements

Required checks:

- `npm ci`
- `npx eslint app src --max-warnings=0`
- `npx tsc --noEmit`
- `npx expo-doctor`

Recommended release checks:

- `npx expo export --platform web --clear`
- Android release build via generated `android/` project

## 6) Deprecation Policy

1. Remove deprecated direct dependencies whenever feasible.
2. Track unavoidable transitive deprecations from Expo/React Native toolchain.
3. Keep CI logs reviewed after each push/build and record unresolved upstream warnings in docs.

## 7) Environment Requirements

- Node.js >= 20.19.4 (22 LTS recommended)
- npm 10.x+
- Java 17 (Temurin)
- Android SDK API 34+

## 8) Role / Folder / Skills Context

### Primary role reference

- `docs/Your_Role.md`

### Important folders

- `app/` routes and screens
- `src/` engines, stores, data, theme
- `.github/workflows/` CI/CD
- `docs/` handoff and product documentation
- `ss/` screenshot references
- `.agents/skills/` installed project skills

### Most relevant skills for current phase

- `react-native-design`
- `react-native-expert`
- `react-native-architecture`
- `expo-cicd-workflows`
- `upgrading-expo`
- `android-updater-patterns`

## 9) Completed in Phase 1 (2026-04-02)

1. ✅ All 20 rules fully configured across 4 categories
2. ✅ All 7 engines implemented (Countdown, Interval, Guided, Sorter, Spaced, Awareness, FreeWrite)
3. ✅ Positivity store with points, levels, streaks, weekly resets
4. ✅ Session status badge with real-time pulsing indicator
5. ✅ Theme system (light/dark mode with AsyncStorage persistence)

## 10) Completed in Phase 2: "Elite" Retention (2026-04-06)

1. ✅ **Retention Engine**: Post-session reflection modal with focus scoring (1-5).
2. ✅ **Semantic Discovery**: Explore screen re-architected with "Quick Wins", "Deep Work", and category-tinted borders.
3. ✅ **Gamification 2.0**: Daily Delta (+15 pts) and "🏆 Level:" rank branding.
4. ✅ **UI/UX Polish**: Unified all navigation to `ChevronRight` and standard Green (#22C55E) for all selected states.
5. ✅ **Metadata Discovery**: Multi-pill metadata (⏱ 25 min • Easy) on all rule cards.
6. ✅ **Friction Reduction**: "Quick Add" suggestions row in Commitments screen.

## 11) Remaining Implementation Work (Post-v1.0.0)

1. SQLite persistence layer (schema + repository wiring).
2. Advanced Notification scheduling (Rule-specific generic triggers - mostly complete via foreground chronometers).
3. In-app updater native bridge.
4. Weekly progress charts and visualizations.
5. Achievement badges system (Visual trophies).

## 12) Native Architecture Dependencies (v1.0.0+)
1. **Background Chronometers**: To circumvent React Native JS-thread suspension mechanisms when apps are minimized on Android/iOS, Productive utilizes `@notifee/react-native` for `FOREGROUND_SERVICE` integration.
2. Note: `@notifee/react-native` must be autolinked via Expo Prebuild (SDK 50+), NOT placed statically inside `app.json` `.plugins`, to prevent pipeline structural failures.
