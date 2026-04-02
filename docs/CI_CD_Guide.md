# Product +ive CI/CD Guide

> Last Updated: 2026-04-02 (IST)

## Workflow File

- `.github/workflows/ci-cd.yml`

## Trigger Rules

- Push branches: `main`, `develop`
- Pull request branches: `main`, `develop`
- Ignored paths:
  - `docs/**`
  - `.agents/**`
  - `ss/**`

## Global Runtime Settings

- Runner: `ubuntu-latest`
- Node: `22`
- Java: Temurin `17`
- Action runtime flag: `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`
- Concurrency enabled:
  - `cancel-in-progress: true` for same workflow/ref

## Job 1: Lint, TypeCheck & Test

1. `actions/checkout@v6`
2. `actions/setup-node@v6` with npm cache
3. `npm ci --no-audit --prefer-offline`
4. `npx eslint app src --max-warnings=0`
5. `npx tsc --noEmit`
6. `npm test -- --coverage --ci` (currently placeholder)
7. `npm audit --audit-level=high` (non-blocking)

## Job 2: Build Android APK

Runs only when:

- event is `push`
- branch is `main`
- lint/typecheck/test job passed

Steps:

1. `actions/checkout@v6`
2. `actions/setup-node@v6` with npm cache
3. `npm ci --omit=dev --no-audit --prefer-offline`
4. `expo/expo-github-action@v8` with `eas-cache: true`
5. Prebuild Android if missing:
   - `npx expo prebuild --platform android --non-interactive --no-install`
6. `actions/setup-java@v5` with `cache: gradle`
7. Build APK:
   - `./gradlew assembleRelease --no-daemon --parallel --build-cache`
8. Upload artifact:
   - `actions/upload-artifact@v4`

## Why Java Setup Is After Prebuild

`actions/setup-java` with `cache: gradle` scans for Gradle files.
In managed Expo apps, those files do not exist until `expo prebuild` creates `android/`.
If Java caching runs first, the job fails with:

- `No file ... matched to [**/*.gradle* ...]`

## Known Warnings

- Some npm deprecation warnings are currently transitive (Expo/RN toolchain).
- These are tracked in `docs/update-logs.md` and should be rechecked after each push/build.
