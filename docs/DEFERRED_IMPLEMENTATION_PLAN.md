# Product +ive - Deferred Implementation Plan

> Saved On: 2026-04-08 (IST)
> Status: Saved for later execution

## Goal
Close remaining enhancement backlog and implement two aligned features:
1. Optional wellbeing self-check-in (mental health style questionnaire, non-diagnostic)
2. Consistency visualization (GitHub-style heatmap)

## Current Project Snapshot
- Core phases (0-7): complete
- Timer sync mismatch: resolved
- SQLite stats history: implemented
- Android updater native bridge: implemented
- Release verification gates: passing

## Execution Plan

### Phase A - Existing Enhancement Backlog
1. Implement rule-aware task tagging UI in Add/Todo flows
2. Add rule-specific session history card on rule detail screen
3. Wire updater auto-check toggle to actual update behavior
4. Add deferred install behavior when session is active
5. Clean naming debt (`hapicsEnabled` -> `hapticsEnabled`) with migration-safe fallback

### Phase B - Data Foundation (SQLite Migration v2)
1. Add `wellbeing_assessments` table
2. Add repository methods for assessments and trend reads
3. Add daily consistency aggregation query support for heatmap
4. Add migration and compatibility tests

### Phase C - Wellbeing Check-in MVP
1. Add new route/screen (e.g., `wellbeing-checkin`)
2. Add consent + disclaimer (not medical diagnosis)
3. Add short, structured questionnaire and scoring bands
4. Save local-only records to SQLite
5. Show trend + supportive recommendations in-app

### Phase D - Consistency Heatmap
1. Create reusable heatmap component (12-week and 52-week ranges)
2. Feed from session activity and/or point events
3. Add day tap details (sessions, points, rules)
4. Integrate into Stats screen

### Phase E - Quality Hardening
1. Add unit tests for scoring and aggregation logic
2. Add repository tests for SQLite queries
3. Add screen smoke tests for new routes/components
4. Run full validation:
   - `npm test -- --coverage --ci`
   - `npx tsc --noEmit`
   - `npx eslint app src --max-warnings=0`
   - `npx expo-doctor`
   - `npx expo export --platform web --clear`
   - `cd android && .\\gradlew.bat assembleRelease --console=plain --no-daemon`

### Phase F - Documentation and Release Hygiene
1. Update implementation/roadmap/requirements docs
2. Update update-logs, changelog, and handoff context
3. Push and monitor CI/build completion

## Guardrails
1. Keep wellbeing feature optional and privacy-first (offline/local only)
2. Avoid diagnostic language; include help-seeking safety copy
3. Keep UI/UX aligned with Product +ive design system and theme behavior
4. Preserve existing app performance and timer reliability

## Deferred Start Trigger
Begin when explicitly requested by user.
