# Product+ive - Command Guide

> Last Updated: 2026-04-02 (IST)

## Setup

```bash
# Install locked dependencies
npm ci
```

## Development

```bash
# Start Expo dev server
npm run start

# Platform shortcuts
npm run android
npm run ios
npm run web
```

## Quality checks

```bash
# CI-equivalent lint scope
npx eslint app src --max-warnings=0

# Project lint script
npm run lint

# Type check
npx tsc --noEmit

# Expo environment sanity checks
npx expo-doctor
```

## Export and build checks

```bash
# Web export
npx expo export --platform web --clear

# Multi-platform export
npx expo export --platform all --clear

# Android release (requires native android project + toolchain)
cd android && ./gradlew assembleRelease
```

## Testing (current state)

```bash
# Current placeholder test script
npm test -- --coverage --ci
```

Note: A real Jest/RNTL suite is still pending implementation.

## Environment

- Node.js >= 20.19.4 (22 LTS recommended)
- npm 10.x+
- Java 17 for Android builds
