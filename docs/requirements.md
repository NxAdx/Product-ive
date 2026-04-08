# Product +ive Requirements

> Last Updated: 2026-04-08 (IST)

## 1) Core Product Requirements

1. Ship 20 rule-driven experiences across 4 categories.
2. Keep 7 reusable engines as the execution layer for rules.
3. Keep app behavior offline-first with local persistence.
4. Track consistency with positivity score, levels, streak logic, and reflection history.
5. Maintain updater behavior through safe staged rollout (GitHub check -> APK handoff -> native installer completion).

## 2) Active UX Requirements

1. Home top bar keeps one actionable icon on the right (Settings).
2. Settings includes:
   - Theme controls (system-follow + manual dark/light)
   - Bug report export as `.txt` with runtime logs
   - Changelog section
   - About/Protocol details
   - Software update check and action flow
   - Background reliability controls (notification settings, battery optimization, power manager)
3. App brand text renders as `Product +ive`.
4. Rule screens fail safely for invalid/missing config.
5. Timed sessions show reliable countdown behavior in-app and through foreground notifications.
6. Activities that require written input must not allow completion/advance when input is empty.

## 3) Positivity and Scoring Requirements

1. Session completion adds rule base points.
2. First completion of a unique rule adds one-time discovery bonus.
3. Weekly score resets by week boundary.
4. Lifetime score never resets.
5. Reflection score input (1-5) is recorded for post-session insight history.

## 4) Engineering Requirements

1. TypeScript strict mode remains enabled.
2. CI lint must pass with zero warnings.
3. Type-check must pass before merge.
4. Real automated tests must run in CI (`npm test -- --coverage --ci`).
5. Docs and handoff context must be updated for each non-trivial change.
6. Dependency changes must remain Expo SDK compatible.

## 5) CI/CD Requirements

Required checks:

- `npm ci`
- `npx eslint app src --max-warnings=0`
- `npx tsc --noEmit`
- `npm test -- --coverage --ci`
- `npx expo-doctor`

Recommended release checks:

- `npx expo export --platform web --clear`
- Android release build via generated `android/` project

## 6) Environment Requirements

- Node.js >= 20.19.4 (22 LTS recommended)
- npm 10.x+
- Java 17 (Temurin)
- Android SDK API 34+
- Either `ANDROID_HOME`/`ANDROID_SDK_ROOT` must point to a valid SDK path or `android/local.properties` must define `sdk.dir=...` for local release builds.

## 7) Role / Folder / Skills Context

### Primary role reference

- `docs/Your_Role.md`

### Important folders

- `app/` routes and screens
- `src/` engines, stores, data, theme, db
- `.github/workflows/` CI/CD
- `docs/` handoff and product documentation
- `.agents/skills/` installed project skills

### Most relevant skills for current phase

- `react-native-expert`
- `react-native-testing`
- `react-native-architecture`
- `expo-cicd-workflows`
- `android-updater-patterns`

## 8) Current Completion Snapshot

1. All 20 rules configured across 4 categories.
2. All 7 engines implemented and routed.
3. Positivity, todo, session, settings, wellness state stores are active.
4. SQLite bootstrap + session/point-event repository persistence added.
5. Updater now uses live release checks with semver comparison and APK asset detection.
6. Real Jest test suite is active (store regression coverage).

## 9) Remaining Implementation Work

1. Native Android PackageInstaller bridge for direct updater install completion.
2. Full notifications coverage across all engine lifecycle flows.
3. Session history and analytics UI backed by SQLite data.
4. Broader repository test coverage and CI quality threshold hardening.
