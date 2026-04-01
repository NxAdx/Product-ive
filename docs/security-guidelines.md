# Product+ive — Security Guidelines

> **Last Updated:** 2026-04-01

---

## Security Model

Product+ive is a **100% offline app** with **no user accounts** and **zero telemetry**. All data stays on the device.

## Data Storage

| Data Type | Storage | Encryption |
|-----------|---------|------------|
| Theme preference | AsyncStorage | None needed (non-sensitive) |
| User settings | AsyncStorage | None needed (non-sensitive) |
| Sessions, Tasks | expo-sqlite | Device-level encryption |
| Positivity data | expo-sqlite | Device-level encryption |
| Spaced rep schedules | expo-sqlite | Device-level encryption |

## Rules

1. **No network permissions** — app works 100% offline
2. **No analytics/telemetry** — zero data collection
3. **No user accounts** — no PII stored
4. **No hardcoded secrets** — nothing to hide
5. **Input validation** — sanitise all user text input (task titles, topic names)
6. **No WebView** — no XSS attack surface
7. **Export safety** — if/when export is added, sanitise output

## Permissions Required

- **Notifications** (expo-notifications) — for rule reminders, streak alerts
- **Vibration** — for timer completion feedback
- No other permissions needed

## Dependency Security

- Run `npm audit` before every release
- Pin dependency versions in `package-lock.json`
- Update dependencies monthly
- Review changelogs before major upgrades
