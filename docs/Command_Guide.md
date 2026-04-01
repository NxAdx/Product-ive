# Product+ive — Command Guide

> CLI reference for development.

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Start on Android
npx expo run:android

# Start on iOS
npx expo run:ios

# Clear cache and restart
npx expo start --clear
```

## Build

```bash
# Build Android APK (local)
npx expo run:android --variant release

# Build with EAS
eas build --platform android --profile production

# Build APK locally
cd android && ./gradlew assembleRelease
```

## Lint & Format

```bash
# Run ESLint
npx eslint src/

# Run TypeScript check
npx tsc --noEmit

# Run Prettier
npx prettier --write "src/**/*.{ts,tsx}"
```

## Database

```bash
# SQLite is embedded — no external setup needed
# Schema managed via src/db/schema.ts
```

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```
