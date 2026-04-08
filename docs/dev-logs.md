# Product +ive Development Logs

> Records key engineering decisions and rationale.

---

## 2026-04-02 - CI order and UX stabilization decisions

**Decision:** Keep managed Expo workflow (no committed `android/`), but prebuild in CI before Java Gradle cache setup.

**Reasoning:**

- Avoids repository bloat from committed generated native folders.
- Fixes hard build failures in `setup-java` cache scanning.
- Keeps build reproducibility from source config.

**Decision:** Move category icons from emoji text to Lucide mapping.

**Reasoning:**

- Prevents rendering issues caused by encoding and font differences.
- Keeps icon style consistent across themes and devices.
- Improves visual parity with design system typography.

## 2026-04-01 - Project structure baseline

**Decision:** Adopt the same governance shape used in related production projects.

**Reasoning:**

- Consistent process across repos
- Documentation-first workflow
- Reliable AI handoff via `docs/AGENT-CONTEXT.md`

**Structure adopted:**

- `.agents/` for agent configuration and skills
- `.github/workflows/` for CI/CD
- `app/` and `src/` for product code
- `docs/` for architecture, requirements, logs, and handoff
- `ss/` for screenshot references

## 2026-04-08 - Timer source unification and updater native bridge

**Decision:** Centralize session duration resolution in a shared utility consumed by stores and UI.

**Reasoning:**

- Prevents drift between foreground notification chronometer and in-app timers.
- Removes rule-specific duration ambiguity (`sessionDuration` vs `intervalMinutes` vs `timerMinutes`).
- Makes regressions easier to test with one canonical resolver.

**Decision:** Replace local decrement loops in timed engines with absolute elapsed-time math from session state.

**Reasoning:**

- Local decrement loops drift when JS thread timing jitter occurs.
- Absolute elapsed-time computation keeps UI aligned with OS-level timer behavior.

**Decision:** Complete Android updater install path through a native PackageInstaller bridge with fallback.

**Reasoning:**

- Direct install path reduces user friction for APK updates.
- Fallback path preserves compatibility on OEM/legacy behaviors.
- Permission checks and settings deep-linking improve reliability and UX transparency.

**Decision:** Keep release-build stabilization flag `android.packagingOptions.doNotStrip=**/*.so`.

**Reasoning:**

- Resolves known Windows release-build symbol strip failures.
- Improves deterministic local release verification.
