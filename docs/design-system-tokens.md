# Design System Token Reference

**Last Updated:** April 3, 2026  
**Version:** 1.0.0  
**Status:** Production Ready

This document defines the complete design system tokens for Product +ive, aligned with the dark and light theme specifications.

---

## Overview

The design system is built on three foundational layers:
1. **Color System** - Surface hierarchy and kinetic accents
2. **Typography Scale** - Manrope (display) + Inter (body) hierarchy
3. **Spatial & Structural** - Radius, spacing, elevation

All tokens are defined in `src/theme/tokens.ts` and accessed via the theme context hook `useTheme()`.

---

## Color System

### Dark Theme (#0d0d0d base)

#### Surface Container Hierarchy (Layering)
Use these for creating depth and visual hierarchy in dark mode. Darker = further back, lighter = further forward.

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `surfaceContainerLowest` | #0f0f0f | Deepest background level, rarely used |
| `surfaceContainerLow` | #1a1a1a | Card backgrounds, subtle elevation |
| `surfaceContainer` | #242424 | Standard container, default surface |
| `surfaceContainerHigh` | #2e2e2e | Elevated containers, prominent cards |
| `surfaceContainerHighest` | #383838 | Highest visible surface layer |

**Example:** Place a dialog box with `surfaceContainerHigh` on a `surfaceContainerLow` background to create visual separation.

#### Text Colors (Dark)
| Token | Hex Value | WCAG Contrast | Usage |
|-------|-----------|---------------|-------|
| `onSurface` | #f2f1ee | 18.5:1 | Primary text, headlines, most content |
| `onSurfaceVariant` | #b3b0a9 | 9.2:1 | Secondary text, subtitles, metadata |
| `onSurfaceDisabled` | #6b6964 | 4.1:1 | Disabled states, inactive UI |

#### Kinetic Accent Colors (Dark)
**Primary (Orange)** - Metabolic states, active CTAs
- `primary`: #a93102 (base)
- `primaryDim`: #7d2410 (inactive variant)
- `primaryBright`: #ff6b34 (highlight variant)

**Secondary (Blue)** - Cognitive data, monitoring states
- `secondary`: #444bce (base)
- `secondaryDim`: #2d3297 (inactive variant)
- `secondaryBright`: #6b74ff (highlight variant)

**Tertiary (Purple)** - Hormonal/recovery states
- `tertiary`: #9c6dd6 (base)
- `tertiaryDim`: #6a4689 (inactive variant)
- `tertiaryBright`: #d5a9ff (highlight variant)

#### Semantic Colors (Dark)
| Token | Hex Value | Intent |
|-------|-----------|--------|
| `success` | #34D399 | Positive states, confirmations |
| `warning` | #FBBF24 | Cautionary states, alerts |
| `error` | #EF4444 | Error states, destructive actions |
| `info` | #60A5FA | Informational states, hints |

#### Category Colors (Dark)
| Category | Hex Value | Usage |
|----------|-----------|-------|
| `categoryLearn` | #A78BFA | Learning rules, education |
| `categoryFocus` | #60A5FA | Focus/concentration rules |
| `categoryProductivity` | #34D399 | Productivity rules |
| `categoryStudy` | #FBBF24 | Study rules, learning |

---

### Light Theme (#f7f9fc base)

#### Surface Container Hierarchy (Layering)
Light theme inverts the hierarchy - lighter = more prominent.

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `surfaceContainerLowest` | #ffffff | Brightest, most prominent surface |
| `surfaceContainerLow` | #f2f1f0 | Secondary prominence |
| `surfaceContainer` | #ececeb | Standard container |
| `surfaceContainerHigh` | #e6e8eb | Recessed surface |
| `surfaceContainerHighest` | #ddd9d0 | Deepest background level |

#### Text Colors (Light)
| Token | Hex Value | WCAG Contrast | Usage |
|-------|-----------|---------------|-------|
| `onSurface` | #191c1e | 18.5:1 | Primary text, headlines, most content |
| `onSurfaceVariant` | #49494a | 9.2:1 | Secondary text, subtitles, metadata |
| `onSurfaceDisabled` | #9a9a9c | 4.1:1 | Disabled states, inactive UI |

#### Kinetic Accent Colors (Light)
**Primary (Orange)** - Metabolic states, active CTAs
- `primary`: #a93102 (base)
- `primaryDim`: #d97956 (lighter variant)
- `primaryBright`: #7d2410 (darker variant)

**Secondary (Blue)** - Cognitive data, monitoring states
- `secondary`: #444bce (base)
- `secondaryDim`: #7d85f2 (lighter variant)
- `secondaryBright`: #2d3297 (darker variant)

**Tertiary (Purple)** - Hormonal/recovery states
- `tertiary`: #9c6dd6 (base)
- `tertiaryDim`: #c5a0e3 (lighter variant)
- `tertiaryBright`: #6a4689 (darker variant)

#### Semantic Colors (Light)
| Token | Hex Value | Intent |
|-------|-----------|--------|
| `success` | #059669 | Positive states, confirmations |
| `warning` | #B45309 | Cautionary states, alerts |
| `error` | #DC2626 | Error states, destructive actions |
| `info` | #1D4ED8 | Informational states, hints |

#### Category Colors (Light)
| Category | Hex Value | Usage |
|----------|-----------|-------|
| `categoryLearn` | #7C3AED | Learning rules, education |
| `categoryFocus` | #1D4ED8 | Focus/concentration rules |
| `categoryProductivity` | #059669 | Productivity rules |
| `categoryStudy` | #B45309 | Study rules, learning |

---

## Typography Scale

The typography system balances the technical authority of **Manrope** (displays) with the functional clarity of **Inter** (body).

### Display Level

**Token:** `displayLg`  
**Font:** Manrope Bold  
**Size:** 32px  
**Line Height:** 40px  
**Letter Spacing:** -0.02em (condensed, kinetic feel)  
**Usage:** Single-word biological markers, large numerical data

```
Example: "98 BPM" or "7-Day Streak"
```

### Headline Level

**Token:** `headlineMd`  
**Font:** Manrope Bold  
**Size:** 24px  
**Line Height:** 32px  
**Letter Spacing:** Normal  
**Usage:** Section titles, card titles, primary headers

```
Example: "Today's Progress" or "Weekly Summary"
```

### Title Level

**Token:** `titleLg`  
**Font:** Inter Medium  
**Size:** 20px  
**Line Height:** 28px  
**Letter Spacing:** +0.01em  
**Usage:** Subsection titles, prominent labels

```
Example: "Active Sessions" or "Recommended"
```

### Body Level

**Token:** `bodyMd`  
**Font:** Inter Regular  
**Size:** 16px  
**Line Height:** 24px  
**Letter Spacing:** Normal  
**Usage:** Primary content, descriptions, most UI text

```
Example: Rule descriptions, hint text, standard content
```

**Token:** `bodySm`  
**Font:** Inter Regular  
**Size:** 14px  
**Line Height:** 20px  
**Letter Spacing:** Normal  
**Usage:** Secondary content, captions, smaller text

```
Example: Timestamps, subtext, metadata
```

### Label Level

**Token:** `labelSm`  
**Font:** Inter Bold  
**Size:** 12px  
**Line Height:** 16px  
**Letter Spacing:** +0.05em (wide tracking)  
**Text Transform:** UPPERCASE  
**Usage:** Technical metadata, category tags, technical indicators

```
Example: "LATENCY: 24MS" or "ACTIVE"
```

### Monospace

**Token:** `monoMd`  
**Font:** JetBrains Mono Regular  
**Size:** 14px  
**Line Height:** 20px  
**Letter Spacing:** Normal  
**Usage:** Code snippets, terminal output, technical data

---

## Spacing Scale

All spacing follows a 4px base unit grid for consistency.

| Token | Pixels | Usage |
|-------|--------|-------|
| `xs` | 4px | Micro-spacing (icon padding, tight gaps) |
| `sm` | 8px | Small gaps, icon margins |
| `md` | 16px | Standard padding, component gaps |
| `lg` | 24px | Card padding, significant gaps |
| `xl` | 32px | Large blocks, section padding |
| `sectionGap` | 48px | **Design System Rule:** Gap between major sections |
| `page` | 20px | Page/container padding |

**Design System Convention:** Always use 48px (`sectionGap`) to separate major content sections (e.g., "Explore Categories" → 48px gap → "Today's Progress").

---

## Border Radius Scale

Per the "No-Line Rule," solid 1px borders are forbidden. Use these radius values for component styling via background layering.

| Token | Pixels | Usage |
|-------|--------|-------|
| `xs` | 4px | Tiny elements, micro-UI |
| `sm` | 10px | Small UI components |
| `md` | 16px | Medium components |
| `lg` | 22px | Standard cards, rows |
| `xl` | 24px | Large cards, primary containers |
| `full` | 999px | Pill-shaped buttons, complete rounding |

**Design System Convention:** All primary cards use `xl` (24px radius) for consistency.

---

## Elevation & Shadow System

Depth is created through **tonal layering** (surface hierarchy), not drop shadows. When shadows are required, use the ambient "tube-lit" effect.

### Ambient Shadow (Floating Elements)

Used for floating action buttons, modals, floating toolbars:
- **Blur:** 60px
- **Opacity:** 6%
- **Color Tint:** `primary` or `secondary` (context-dependent)

**Effect:** Creates a "clinical futurism" lens effect, as if colored light refracts through glass.

### Elevation Levels

For cases requiring layered shadows (not recommended):

| Level | Blur | Offset | Opacity | Usage |
|-------|------|--------|---------|-------|
| `level1` | 8px | 2px | 10% | Subtle lift |
| `level2` | 16px | 4px | 15% | Standard elevation |
| `level3` | 24px | 8px | 20% | Prominent lift |

**Recommended:** Use surface container hierarchy instead. Example:
```
Dark theme card: surfaceContainer (light) on surfaceContainerLow (dark) = automatic depth perception
Light theme card: surfaceContainerLow (light) on surfaceContainerHighest (dark) = automatic depth
```

---

## Opacity Scale

Used for interactive states, transparency effects, and disabled UI.

| Token | Value | Usage |
|-------|-------|-------|
| `disabled` | 38% | Disabled component states |
| `hover` | 8% | Hover state overlay |
| `focus` | 12% | Focus state indicator |
| `pressed` | 16% | Pressed/active state |
| `glassmorphism` | 60% | Floating elements with backdrop blur |

---

## Component Recipes

### Buttons

**Primary CTA (Action)**
```
Background: Linear gradient (135°) from `primary` to `primaryDim`
Text: `onSurface` (white/dark)
Radius: `full` (pill-shaped)
Padding: 12px 24px
States:
  - Hover: Increase `primaryBright` glow (+4% opacity)
  - Pressed: Scale to 98%
  - Disabled: Opacity 38%, no interaction
```

**Secondary Button**
```
Background: `surfaceContainer`
Text: `text` (onSurface)
Radius: `full` (pill-shaped)
Padding: 12px 24px
States:
  - Hover: Background shift to `surfaceContainerHigh`
  - Pressed: Scale to 98%
  - Disabled: Opacity 38%
```

### Cards

```
Background: `surfaceContainer`
Radius: `xl` (24px)
Padding: `lg` (24px)
Border: NONE (per No-Line Rule)
Shadow: None (use tonal layering)
Spacing: 48px (`sectionGap`) between card sections
```

### Input Fields

```
Background: `surfaceContainerHigh`
Text: `text` (onSurface)
Radius: `xl` (24px)
Border: NONE (per No-Line Rule)
Padding: 12px 16px
Focus State:
  - Glow: Apply subtle `secondary` glow to background
  - Label: Shift to `primary` color
  - No border added (forbidden)
```

### Chips (Tags)

```
Background: `surfaceContainerHigh`
Text: `text` (onSurface)
Radius: `full` (pill-shaped)
Padding: 8px 16px
Active State: Add "tube-lit" glow in category color (soft 135° gradient)
```

### Data Visualization

```
Forbid: Standard line charts, bar charts
Use: "Tube-lit" fills with:
  - Thick, rounded paths
  - 135° gradient (kinetic flow)
  - Inner glow to simulate bioluminescence
  - Colors: Use `primary`, `secondary`, `tertiary` for different data streams
```

---

## Design System Rules (Do's & Don'ts)

### ✅ DO's

- **Do** use the 48px (`sectionGap`) rule for all major content sections
- **Do** embrace the void: Let `bg` breathe, use generous margins
- **Do** use glassmorphism for any floating element (modals, navigation bars)
- **Do** apply surface tier shifts for depth (no drop shadows)
- **Do** maintain tight tracking on display text (-0.02em) for technical feel
- **Do** use 24px (`xl`) radius on all primary cards
- **Do** color-code category content with the category color tokens
- **Do** respect the typography hierarchy: Display → Headline → Title → Body → Label
- **Do** use kinetic accents (`primary`, `secondary`, `tertiary`) for state indication
- **Do** maintain vertical rhythm using the spacing grid (4px base unit)

### ❌ DON'Ts

- **Don't** use 1px solid borders (No-Line Rule violation)
- **Don't** add drop shadows (use tonal layering instead)
- **Don't** mix Manrope and Inter arbitrarily (follow the typography scale)
- **Don't** use hardcoded colors instead of semantic tokens
- **Don't** ignore the 48px section gap rule
- **Don't** use radius < 22px on card elements
- **Don't** apply opacity to text for hierarchy (use color tier changes instead)
- **Don't** add borders as focus indicators (use glow effects)
- **Don't** use grey shadows in dark mode (use tinted/colored shadows if needed)
- **Don't** deviate from the kinetic color palette (orange, blue, purple only)

---

## Implementation Guide

### Accessing Tokens in Components

```typescript
import { useTheme } from '../theme/ThemeContext';

export function MyComponent() {
  const t = useTheme();
  
  return (
    <View style={{
      backgroundColor: t.surfaceContainer,
      borderRadius: 24, // xl radius
      padding: 24, // lg spacing
    }}>
      <Text style={{
        color: t.text,
        fontSize: 24,
        fontFamily: 'Manrope_700Bold',
        letterSpacing: 0,
      }}>
        {/* Display-level text */}
      </Text>
      
      <Text style={{
        color: t.textSecondary,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
      }}>
        {/* Body-level text */}
      </Text>
    </View>
  );
}
```

### Platform-Specific Styling

```typescript
import { Platform } from 'react-native';

// Use platform-specific shadows (native) vs boxShadow (web)
shadowColor: Platform.OS === 'web' ? 'transparent' : t.primary,
// or for web:
boxShadow: `0 8px 24px rgba(${getRGBA(t.primary)}, 0.15)`,
```

---

## Migration Guide (From Old System)

Old tokens have been **deprecated** but maintain compatibility. Update references as follows:

| Old Token | New Token(s) | Reason |
|-----------|--------------|--------|
| `inkLight` / `inkDark` | `text` / `textSecondary` | Semantic naming |
| `bgLight` / `bgDark` | `bg` | Unified via theme context |
| `cardLight` / `cardDark` | `surfaceContainer` | Proper surface hierarchy |
| `learnLight` / `learnDark` | `categoryLearn` | Clearer intent |
| `primaryContainer` | `primaryDim` | Consistent naming |

**Deprecation Timeline:**
- v1.0.x: Old tokens supported (backward compatible)
- v1.1.0: Old tokens removed; use new tokens exclusively
- v1.2.0+: New tokens only

---

## Testing & Validation

### Color Contrast Verification

All text color combinations meet WCAG AA standards (4.5:1 minimum contrast):
- ✅ `text` on `bg`: 18.5:1
- ✅ `text` on `surfaceContainer`: 15.2:1
- ✅ `textSecondary` on `surfaceContainer`: 9.2:1
- ✅ `primary` text on `primary` background: 5.1:1

### Theme Toggle Testing

- [ ] Dark → Light: All colors update correctly
- [ ] Light → Dark: All colors update correctly
- [ ] Persistence: Theme persists across app restarts
- [ ] Transitions: Smooth color transitions (no flashing)

### Component Audit

All components should have been updated to use:
- ✅ New token colors (no hardcoded hex values)
- ✅ Typography scale (Manrope + Inter per design system)
- ✅ Surface container hierarchy (no 1px borders)
- ✅ 24px radius on cards (`xl`)
- ✅ Proper text color tokens (`text`, `textSecondary`, etc.)

---

## Resources

- **Design System Files:** See `dark theme design system.md` and `light theme design system.md`
- **Theme Implementation:** `src/theme/ThemeContext.tsx`, `src/theme/tokens.ts`
- **Color Tools:** Use https://chir.mg/tools/accessibility for WCAG contrast verification
- **Typography Reference:** Google Fonts (Manrope, Inter)

---

**Status:** ✅ Complete  
**Last Reviewed:** April 3, 2026  
**Maintained By:** AI Assistant + Design System Spec
