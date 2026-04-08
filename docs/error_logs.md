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

---

## 2026-04-08 - Notification timer and in-app timer mismatch

### Error

- Notification chronometer and in-app activity timer diverged after pause/resume and on certain interval rules.

### Root Cause

- Session start used non-canonical duration fields for foreground notifications (e.g., `intervalMinutes`) while UI/session logic relied on other fields (e.g., `sessionDuration`).
- Timed engines used local decrement loops susceptible to JS timer drift.

### Fix

- Added shared duration resolver (`src/utils/sessionTiming.ts`) and routed `sessionStore.startSession()` through it.
- Reworked timed engines to compute display time from absolute elapsed session time.
- Updated session badge timer to use the same duration resolver.
- Added regression tests for session duration resolution.

### Status

- Fixed and validated through test/lint/typecheck/export/release-build checks.

---

## 2026-04-08 - Android release build failure during symbol stripping (Windows)

### Error

- `assembleRelease` failed while stripping native debug symbols for `.so` libraries.

### Root Cause

- Windows build environment/toolchain mismatch in symbol-strip step for some native artifacts.

### Fix

- Added `android.packagingOptions.doNotStrip=**/*.so` to `android/gradle.properties`.

### Status

- Fixed. Local `assembleRelease --console=plain --no-daemon` now passes.

---

## 2026-04-08 - Release APK exploded to ~740 MB

### Error

- Release APK size grew to approximately 740 MB (installed footprint close to 1 GB).

### Root Cause

- Universal APK included four ABIs (`arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64`).
- Global `android.packagingOptions.doNotStrip=**/*.so` preserved large native symbols in release output.

### Fix

- Removed global `doNotStrip` from repository `android/gradle.properties`.
- Enabled ABI split release output in `android/app/build.gradle` with:
  - `include "arm64-v8a", "armeabi-v7a"`
  - `universalApk false`

### Status

- Fixed.
- Current release outputs:
  - `app-arm64-v8a-release.apk` ~45.11 MB
  - `app-armeabi-v7a-release.apk` ~38.68 MB
