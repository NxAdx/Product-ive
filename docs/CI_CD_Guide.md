# Product+ive - CI/CD Guide

> Last Updated: 2026-04-02 (IST)

## Workflow file

- `.github/workflows/ci-cd.yml`

## Trigger rules

- Push: `main`, `develop`
- Pull request: `main`, `develop`
- Docs-only and agent-config-only changes are ignored (`docs/**`, `.agents/**`, `ss/**`) to avoid unnecessary CI runs.

## Runtime and tooling

- Runner: `ubuntu-latest`
- Node: `22`
- Java: Temurin `17`
- Action runtime migration flag: `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`
- Workflow concurrency: enabled (`cancel-in-progress: true`) to cancel older in-flight runs for the same ref.

## Job 1: Lint, TypeCheck and Test

1. `actions/checkout@v6`
2. `actions/setup-node@v6` (`node-version: 22`, npm cache)
3. `npm ci`
4. `npx eslint app src --max-warnings=0`
5. `npx tsc --noEmit`
6. `npm test -- --coverage --ci`
7. `npm audit --audit-level=high` (non-blocking)

## Job 2: Build Android APK

Runs only when:
- event is push
- branch is `main`
- job 1 passed

Steps:
1. `actions/checkout@v6`
2. `actions/setup-java@v5` (Temurin 17)
   - Gradle dependency cache enabled (`cache: gradle`)
3. `actions/setup-node@v6` (Node 22)
4. `npm ci`
5. `expo/expo-github-action@v8` with Expo/EAS cache enabled
6. If `android/` is missing, run `npx expo prebuild --platform android --non-interactive`
7. Build with Gradle performance flags:
   - `./gradlew assembleRelease --no-daemon --parallel --build-cache`
8. Upload artifact with `actions/upload-artifact@v4`

## Notes

- Current `npm test` script is a placeholder; CI still executes it but it does not provide real coverage.
- Add real test setup before relying on coverage gating.
- Local Node below 20.19.4 can still run but emits engine warnings with RN 0.83.
