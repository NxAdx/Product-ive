# Product+ive - Testing Strategy

> Last Updated: 2026-04-02 (IST)

## Current Reality

- There is no real automated test suite yet.
- `npm test` currently runs a placeholder script.
- CI executes the placeholder test command, so it does not currently verify app behavior.

## Target Testing Stack

- Unit/component tests: Jest + React Native Testing Library
- Integration tests: Jest (store + engine interactions)
- E2E smoke tests: Maestro or Detox (later phase)

## Priority Test Plan

### Priority 1 (must add first)

1. Engine behavior tests
   - timer start/pause/end
   - interval prompt scheduling
   - guided prompt progression
2. Store logic tests
   - positivity scoring and streak updates
   - todo add/toggle/remove flows
3. Route-level smoke tests for key screens
   - home
   - todo
   - rule detail

### Priority 2

1. Notifications scheduling logic tests
2. SQLite repository tests once persistence layer is added
3. Regression tests for onboarding and navigation edge cases

## Proposed CI gate after tests are added

- `npm ci`
- `npx eslint app src --max-warnings=0`
- `npx tsc --noEmit`
- `npm test -- --coverage --ci`

Once real tests exist, add a minimum coverage threshold in CI.
