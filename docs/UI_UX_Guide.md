# Product+ive — UI/UX Guide

> **Last Updated:** 2026-04-01

---

## Design Philosophy

**Monochromatic base (black + white) with category colours as semantic accents.** Clean, spacious, and confident. The design lets the colour of the category be the only accent — rules are the content; the UI should not compete.

## Colour System

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | #FFFFFF | #000000 | Screen background |
| `surface` | #FFFFFF | #1A1A1A | Cards, rows, bottom sheets |
| `surface-2` | #F5F5F5 | #242424 | Input backgrounds |
| `ink` | #1A1916 | #FFFFFF | Primary text |
| `ink-2` | #6B6B6B | #9A9A9A | Secondary text |
| `action-fill` | #1A1916 | #FFFFFF | Action button fills |
| `action-text` | #FFFFFF | #1A1916 | Button text/icons |
| `border` | rgba(0,0,0,0.08) | rgba(255,255,255,0.08) | Dividers |
| `learn-accent` | #7C3AED | #A78BFA | Learning & Memory |
| `focus-accent` | #2563EB | #60A5FA | Focus & Sessions |
| `prod-accent` | #22A06B | #34D399 | Productivity |
| `study-accent` | #D97706 | #FBBF24 | Study Techniques |
| `positivity` | #22A06B | #34D399 | Meter fill |

## Typography

- **Display font:** Syne (headers, titles, brand)
- **Body font:** Plus Jakarta Sans (UI text, descriptions)
- **Mono font:** JetBrains Mono (badges, labels, code)

## Component Patterns

- **Category Card:** Large rounded-rect, 56px icon, bold name, grey rule count
- **Rule Row:** Full-width pill (24px radius, ~72px height), black circle → arrow button
- **Bottom Nav:** Floating pill shape, 3 items (Home, +, Meter)
- **Bottom Sheet:** Slide-up modal for info, task creation, about
- **Progress Ring:** Circular SVG, spring animation on fill

## Animation

- Card press: scale 0.97 spring-back (Reanimated 3)
- Theme switch: fade transition (200ms)
- Points earned: rolling number animation (800ms)
- Meter fill: spring-based ring animation
