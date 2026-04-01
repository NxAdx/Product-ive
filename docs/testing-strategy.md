# Product+ive — Testing Strategy

> **Last Updated:** 2026-04-01

---

## Testing Layers

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit Tests | Jest + React Native Testing Library | ≥80% |
| Component Tests | RNTL (render, fireEvent, queries) | All screens |
| Integration Tests | Jest | Engine ↔ Points flow |
| E2E Tests | Maestro (future) | Critical user flows |

## Critical Test Cases

### Engines
- CountdownTimerEngine: timer starts, pauses, resumes, completes, awards points
- IntervalReminderEngine: notifications fire at correct intervals
- GuidedPromptEngine: step progression, data persistence
- SmartTaskSorterEngine: correct slot assignments (frog/135/pareto)
- SpacedRepetitionEngine: correct scheduling intervals
- AwarenessReflectionEngine: countdown trigger, deadline setting
- FreeWriteRecallEngine: text input, timer mode, session save

### Positivity Meter
- Points accumulate correctly per action type
- Weekly reset on Monday 00:00
- Streak calculation (consecutive active days)
- Level thresholds trigger correctly
- Discovery bonus (+25) fires only once per rule

### Todo
- Task creation with/without rule tag
- Eat the Frog task sorts to top
- 2-Minute tasks show clock badge
- 1-3-5 tasks sort into sections
- Completion awards correct points

### Theme
- Toggle switches all colours
- Persistence across app restart
- No flash of wrong theme on launch

## Running Tests

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- --watch         # Watch mode
```
