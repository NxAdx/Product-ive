# Product +ive Error Logs

> Tracks runtime errors and build failures with root cause and fix status.

---

## 2026-04-02 - GitHub Android build failed before Gradle build

### Error

- Build job failed in `actions/setup-java@v5` with Gradle cache scan:
  - `No file ... matched to [**/*.gradle* ...]`

### Root Cause

- Workflow tried to enable Gradle cache before `android/` existed.
- Managed Expo repo does not keep Android native folder committed by default.

### Fix

- Reordered workflow:
  - Expo prebuild first (create `android/` if missing)
  - Java setup with Gradle cache second

### Status

- Fixed in workflow and validated locally via project checks.

---

## 2026-04-02 - Rule screen crash on some guided rules

### Error

- Some guided rules could crash when opening due invalid React child rendering.

### Root Cause

- `GuidedPromptEngine` attempted to render object-based `steps` directly in `<Text>`.
- Feynman-style config uses step objects (`{ title, prompt }`) not plain strings.

### Fix

- Replaced guided engine prompt normalization:
  - Handles string/object `steps`
  - Supports `prompts`, `sections`, and single `prompt` fallbacks

### Status

- Fixed in source and validated by lint/typecheck/export.

---

## 2026-04-02 - UI text/icon corruption

### Error

- Some screens showed corrupted symbols and malformed icons.

### Root Cause

- Source encoding artifacts introduced mojibake characters.

### Fix

- Cleaned and standardized app/source text to stable ASCII.
- Replaced fragile emoji category icons with Lucide icon mapping.

### Status

- Fixed in `app/` and `src/` codebase.
