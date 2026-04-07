# Product+ive - Testing Strategy

> Last Updated: 2026-04-07 (IST)

## Current Reality

- A real automated test suite is now configured with Jest.
- `npm test` now executes Jest (not a placeholder script).
- CI test step (`npm test -- --coverage --ci`) is now meaningful.

## Implemented Test Stack

- Test runner: Jest (`jest-expo` preset)
- Coverage: Jest built-in coverage reports
- Current suite focus: store-level regression tests
  - positivity scoring/streak/reset
  - todo completion scoring integration
  - session scoring (including duplicate-point regression guard)

## Current Test Files

- `src/store/__tests__/positivityStore.test.ts`
- `src/store/__tests__/todoStore.test.ts`
- `src/store/__tests__/sessionStore.test.ts`

## Next Testing Priorities

### Priority 1

1. Add SQLite repository tests (`src/db/*`).
2. Add engine behavior tests for:
   - countdown completion
   - interval reminder notifications
   - guided progression
3. Add navigation/screen smoke tests for home/rule/settings routes.

### Priority 2

1. Notification scheduling integration tests.
2. Updater flow tests (version parse + asset selection + fallback paths).
3. Onboarding and edge-case regression tests.

## CI Gate (Current)

- `npm ci`
- `npx eslint app src --max-warnings=0`
- `npx tsc --noEmit`
- `npm test -- --coverage --ci`

## Planned CI Hardening

1. Add minimum coverage threshold once repository/integration tests are expanded.
2. Add dedicated build validation job outputs for release readiness tracking.
