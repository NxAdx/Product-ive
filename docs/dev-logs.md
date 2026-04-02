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
