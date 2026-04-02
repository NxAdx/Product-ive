# Product+ive - Project Overview

> Rules that work. Habits that last.

Product+ive is an offline-first React Native app that turns evidence-based productivity and study rules into guided interactive sessions.

## What the app currently includes

- 20 rules across 4 categories
- 7 reusable engines mapped by rule configuration
- Home, Todo, Explore, Meter, Category, and Rule screens
- Positivity scoring stores and session state stores
- On-device persistence (AsyncStorage via Zustand)

## Current stack (repo state)

- Expo SDK 55 (`expo@^55.0.9`)
- React Native 0.83.4
- React 19.2.0
- TypeScript strict mode
- Expo Router + Zustand + Expo SQLite (integration pending)

## Current quality status

Validated on 2026-04-02:

- `npm ci` passes
- `npx eslint app src --max-warnings=0` passes
- `npx tsc --noEmit` passes
- `npx expo-doctor` passes (17/17)
- `npx expo export --platform web --clear` passes

## Documentation map

See the `docs/` folder for details:

- `docs/requirements.md`
- `docs/implementation.md`
- `docs/feature-list.md`
- `docs/roadmap.md`
- `docs/AGENT-CONTEXT.md`
- `docs/update-logs.md`
