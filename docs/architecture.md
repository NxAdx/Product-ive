# Product+ive — Architecture

> **Last Updated:** 2026-04-01 | **Status:** Planning Phase

---

## System Architecture

### Config-Driven Rule Engine

The core architectural decision: **all 20 rules are data, not code**. Each rule is a `RuleConfig` JSON object that specifies which of the 7 reusable engine components to use and what parameters to pass.

```
RuleConfig → Engine Component → Session → Points → Positivity Meter
```

### 7 Reusable Engines

1. **CountdownTimerEngine** — Pomodoro, 90-min Ultradian, 2-Minute Rule
2. **IntervalReminderEngine** — 20-20-20 Rule  
3. **GuidedPromptEngine** — Feynman, Cornell, SQ3R, Mind Mapping, Elaborative Interrogation
4. **SmartTaskSorterEngine** — Eat the Frog, 1-3-5, 80/20
5. **SpacedRepetitionEngine** — SRS, 1-4-7 Rule
6. **AwarenessReflectionEngine** — Parkinson's Law, 5-Second Rule
7. **FreeWriteRecallEngine** — Active Recall, Blurting, Chunking, Interleaving

### Navigation Architecture

- **Bottom Tab Nav** (3 items): Home | + (Todo create) | Meter
- **Stack Nav**: Home → Category List → Rule Page

### State Management

- **Zustand stores**: themeStore, positivityStore, todoStore, sessionStore, settingsStore
- **SQLite** (expo-sqlite): persistent sessions, tasks, positivity data
- **AsyncStorage**: theme preference, settings

### Data Flow

```
User Action → Engine Component → PointsEventEmitter → Positivity Store → UI Update
```

---

## Folder Structure

See `docs/Your_Role.md` section 5 for complete project structure.
