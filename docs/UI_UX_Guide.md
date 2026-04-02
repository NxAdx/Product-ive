# Product +ive UI/UX Guide

> Last Updated: 2026-04-02

## Design Direction

Monochrome-first UI with category accent colors. The interface should feel calm, legible, and focused on actions over decoration.

## Typography

- Display: `Syne_700Bold` / `Syne_600SemiBold`
- Body: `PlusJakartaSans_*`
- Mono labels: `JetBrainsMono_*`

## Core Patterns

1. Home top bar has one primary action on the right (Settings).
2. Bottom nav is visible only on Home.
3. Bottom nav icons use uniform size and no oversized center plus treatment.
4. Category cards use stable iconography (Lucide) and two-line-safe titles.
5. Rule rows use a compact arrow affordance (no large circular white button).
6. Explore rows clamp text (`name: 1 line`, `description: 2 lines`) to prevent overflow.
7. Todo screen keeps input area clear and free from nav overlap.
8. Settings provides support actions (theme, bug export, changelog, about).

## Accessibility and Readability Rules

- Keep touch targets >= 36px for icon buttons.
- Avoid clipped text in list rows.
- Prefer high-contrast text against card and background colors.
- Use consistent title hierarchy across Home, Category, Rule, Todo, Explore, and Meter screens.

## Positivity Meter UX

- Show weekly points as the primary progress signal.
- Show current level and range to next level.
- Always show a plain-language explanation of score mechanics in the same screen.
