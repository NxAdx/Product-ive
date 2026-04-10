# Product +ive CI/CD Guide

> Last Updated: 2026-04-07 (IST)

## Workflow File

- `.github/workflows/ci-cd.yml`

## Trigger Rules

- Push branches: `main`, `develop`
- Pull request branches: `main`, `develop`
- Ignored paths:
  - `docs/**`
  - `.agents/**`
  - `ss/**`

## Runtime Settings

- Runner: `ubuntu-latest`
- Node: `22`
- Java: Temurin `17`
- Concurrency: enabled (`cancel-in-progress: true`)

## Job 1: Lint, TypeCheck, Test

1. `actions/checkout@v4`
2. `actions/setup-node@v4` (npm cache)
3. `npm ci --no-audit --prefer-offline --legacy-peer-deps || npm ci`
4. `npx eslint app src --max-warnings=0`
5. `npx tsc --noEmit --incremental`
6. `npm test -- --coverage --ci`

## Job 2: Build Android APK

Runs only when:

- event is `push`
- branch is `main` or `develop`
- lint/typecheck/test job passed

Steps:

1. `actions/checkout@v4`
2. `actions/setup-node@v4` (npm cache)
3. `actions/setup-java@v4` with `cache: gradle`
4. `npm ci --omit=dev --no-audit --prefer-offline --legacy-peer-deps || npm ci --omit=dev`
5. `expo/expo-github-action@v8`
6. `npx expo prebuild --platform android --non-interactive`
7. `./gradlew assembleRelease --no-daemon --parallel --max-workers=2 --build-cache`
8. `actions/upload-artifact@v4` (release APK output)

## Current Notes

- Automated tests are now active and part of CI gating.
- Some npm deprecation warnings are transitive from Expo/RN toolchains and tracked in docs.
- Local Android builds need a configured SDK path (`ANDROID_HOME` or `android/local.properties`).
- Local verification (2026-04-07):
  - `npx expo export --platform web --clear` -> PASS
  - `cd android && .\\gradlew.bat assembleRelease` -> blocked in local environment until SDK path is set
