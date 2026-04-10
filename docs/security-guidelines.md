# Product+ive — Security Guidelines

> **Last Updated:** 2026-04-01

---

## Security Model

Product+ive is a **primarily offline app** with **no user accounts** and **zero telemetry**. All data stays on the device. The **only network access** is for the in-app updater (checking GitHub Releases API and downloading APKs).

## Data Storage

| Data Type | Storage | Encryption |
|-----------|---------|------------|
| Theme preference | AsyncStorage | None needed (non-sensitive) |
| User settings | AsyncStorage | None needed (non-sensitive) |
| Sessions, Tasks | expo-sqlite | Device-level encryption |
| Positivity data | expo-sqlite | Device-level encryption |
| Spaced rep schedules | expo-sqlite | Device-level encryption |

## Rules

1. **Minimal network** — internet ONLY used for update check + APK download (no analytics, no telemetry)
2. **No analytics/telemetry** — zero data collection, zero tracking
3. **No user accounts** — no PII stored
4. **No hardcoded secrets** — nothing to hide
5. **Input validation** — sanitise all user text input (task titles, topic names)
6. **No WebView** — no XSS attack surface
7. **Export safety** — if/when export is added, sanitise output
8. **APK integrity** — verify downloaded APK matches GitHub release checksum

## Permissions Required

- **INTERNET** — for update check (GitHub API) + APK download only
- **REQUEST_INSTALL_PACKAGES** — for direct APK install via PackageInstaller
- **FOREGROUND_SERVICE** — for background APK download
- **Notifications** (expo-notifications) — for rule reminders, streak alerts
- **Vibration** — for timer completion feedback

## In-App Updater Security

- Download APK only from our **own GitHub Releases** (hardcoded repo URL)
- Use HTTPS only (SSL/TLS enforced)
- Verify APK file size matches GitHub API `size` field before install
- Never auto-install — always require explicit user consent
- Download to app's private cache directory (not public storage)
- Clean up downloaded APK after installation
- MIUI fallback uses `Intent.ACTION_VIEW` with FileProvider (no world-readable files)

## Dependency Security

- Run `npm audit` before every release
- Pin dependency versions in `package-lock.json`
- Update dependencies monthly
- Review changelogs before major upgrades
