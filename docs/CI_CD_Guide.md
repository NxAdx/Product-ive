# Product+ive — CI/CD Guide

> **Last Updated:** 2026-04-01

---

## Overview

GitHub Actions-based CI/CD pipeline for automated builds, testing, and APK generation.

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `chore/*` | Maintenance, deps, docs |

## Pipeline Stages

### On Pull Request (→ develop)
1. **Lint** — ESLint check
2. **Type Check** — `tsc --noEmit`
3. **Test** — Jest with coverage threshold (≥80%)
4. **Build Validation** — Expo export check

### On Push (→ main)
1. All PR checks above
2. **Android APK Build** — `./gradlew assembleRelease`
3. **Artifact Upload** — APK as GitHub release asset
4. **Dependency Audit** — `npm audit`

## GitHub Actions Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npx eslint src/
      - run: npx tsc --noEmit
      - run: npm test -- --coverage

  build-android:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/
```

## Release Process

1. Merge `develop` → `main` via PR
2. CI builds APK automatically
3. Create GitHub Release with version tag
4. Upload APK as release asset
5. Update `docs/RELEASES/vX.Y.Z.md` with changelog
