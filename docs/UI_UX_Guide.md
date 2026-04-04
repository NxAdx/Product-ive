# Product +ive UI/UX Guide

> Last Updated: 2026-04-04  
> Version: 1.2.1  
> Status: ✅ Production Ready

---

## Design Direction

Clean, monochrome-first UI with category accent colors. Focus on clarity, accessibility, and user productivity with minimal visual noise.

**Core Principles:**
- Semantic color layering over explicit borders
- 8px grid-based spacing throughout
- Category-driven color system (Learning, Focus, Productivity, Study)
- 3-font typography system for optimal legibility

---

## Typography System (v1.2.1)

### Display Font: Manrope
- **Usage:** Headlines, titles, prominent metrics, CTAs
- **Weights:** 700 Bold (primary)
- **Sizes:** 20-32px
- **Examples:** Home screen categories, rule headers, stat values
- **Letter-spacing:** -0.02 (tight for impact)

#### Implementation Examples:
```typescript
// Headlines
styles.title = {
  fontFamily: 'Manrope_700Bold',
  fontSize: 20,
  letterSpacing: -0.02,
};

// Stat values
styles.statValue = {
  fontFamily: 'Manrope_700Bold',
  fontSize: 20,
  letterSpacing: -0.01,
};
```

### Body Font: Inter
- **Usage:** Body text, descriptions, labels, UI labels
- **Weights:** 400 Regular, 500 Medium, 600 SemiBold, 700 Bold
- **Sizes:** 12-18px
- **Examples:** Descriptions, buttons, secondary text
- **Letter-spacing:** 0 (baseline)

#### Weight Mapping:
| Weight | Usage | Size | Examples |
|--------|-------|------|----------|
| 400 Regular | Body text, descriptions | 14-16px | Tab descriptions, rule details |
| 500 Medium | Secondary labels | 12-14px | Secondary text, metadata |
| 600 SemiBold | Emphasized text, labels | 16-18px | Button text, rule names |
| 700 Bold | Strong emphasis, headings | 16-20px | Card titles, CTAs |

#### Implementation Examples:
```typescript
// Body text
styles.description = {
  fontFamily: 'Inter_400Regular',
  fontSize: 14,
  lineHeight: 20,
};

// Button/CTA
styles.buttonText = {
  fontFamily: 'Inter_700Bold',
  fontSize: 16,
};

// Secondary labels
styles.label = {
  fontFamily: 'Inter_500Medium',
  fontSize: 12,
};
```

### Monospace Font: JetBrainsMono
- **Usage:** Code, technical metadata, timestamps, machine-readable text
- **Weights:** 400 Regular, 500 Medium, 600 SemiBold, 700 Bold
- **Sizes:** 10-14px
- **Examples:** Session badges ("Work" / "Break"), JSON data, session IDs
- **Letter-spacing:** 0 (monospace default)

#### Implementation Examples:
```typescript
// Code/Data display
styles.code = {
  fontFamily: 'JetBrainsMono_400Regular',
  fontSize: 12,
};

// Session labels
styles.sessionLabel = {
  fontFamily: 'JetBrainsMono_600SemiBold',
  fontSize: 11,
  textTransform: 'uppercase',
};
```

---

## Spacing & Layout Grid

**Base Unit:** 4px  
**Primary Grid:** 8px, 16px, 24px, 32px, 48px

### Card Spacing Standard
All home screen cards use consistent spacing:
```typescript
const cardStyles = {
  paddingHorizontal: 24,     // 6 x 4px
  paddingVertical: 24,       // 6 x 4px
  marginHorizontal: 24,      // 6 x 4px
  marginBottom: 24,          // 6 x 4px
  borderRadius: 24,          // Match padding
};
```

### Section Gaps
Between major content sections on home screen:
```typescript
sectionGap = 48px  // 12 x 4px
```

### Common Component Spacing
| Component | Padding | Margin | Border Radius |
|-----------|---------|--------|---------------|
| StatsCard | 24px | 24 (H) / 24 (B) | 24px |
| DailyTip | 24px | 24 (H) / 24 (B) | 24px |
| ProgressBar | 24px | 24 (H) / 24 (B) | 24px |
| RuleRow | 20 (H) / 18 (V) | 16 / 10 (B) | 22px |
| Button (Touch Target) | Min 36-44px | Varies | 8-16px |

---

## Color System

### Surface Tiers
- **surfaceLowest:** Background for cards (elevated)
- **surfaceLow:** Cards and popovers
- **surfaceBase:** Standard card background
- **card:** General card container
- **border:** Dividers and subtle outlines

### Semantic Colors
- **ink:** Foreground/text
- **inkMid:** Secondary text
- **inkDim:** Tertiary/disabled text
- **positivity:** Primary accent (CTAs, success states)
- **info:** Secondary accent (tips, infos)

### Category Colors
- **learn:** Purple - Learning & Memory category
- **focus:** Blue - Focus & Sessions category  
- **prod:** Teal - Productivity category
- **study:** Orange - Study Techniques category

---

## Core UI Patterns

### 1. Home Screen Layout
```
┌─ Top Bar (Title + Settings) ─────┐
├─ Session Badge (if active) ──────┤
├─ Category Grid (2x2) ────────────┤
├─ 48px Section Gap ───────────────┤
├─ StatsCard (Weekly Score) ───────┤
├─ DailyTip ───────────────────────┤
├─ ProgressBar (Milestones) ───────┤
├─ SmartRuleRecommendations ───────┤
└─ Bottom Nav ─────────────────────┘
```

### 2. Category Detail Screen
```
┌─ Top Bar (Back + Category + Count) ─┐
├─ RuleRow (List items) ──────────────┤
│ └─ Category Color Dot ───────────────┤
│ └─ Rule Name + Description ──────────┤
│ └─ Arrow Icon ───────────────────────┤
└──────────────────────────────────────┘
```

### 3. Notification System
**Wellness Notifications (No Emojis):**
- Blink Eye - Every 30 min
- Drink Water - Every 45 min
- Posture Check - Every 60 min
- 20-20-20 Rule - Every 20 min
- Sleep Reminder - 11 PM (configurable)

**Settings Display:**
```
┌─ Notification Label (no emoji) ────┐
├─ Description ──────────────────────┤
├─ Enable/Disable Toggle ────────────┤
└─ Time/Interval Display ────────────┘
    └─ "Every 30 min" OR
    └─ "Notify at 11:00 PM"
```

---

## Accessibility Rules

### Touch Targets
- Minimum 36px for small buttons (icon-only)
- Minimum 44px for primary actions
- Visual feedback on all interactive elements

### Text Clarity
- Keep text clipped to prevent overflow:
  - Single-line text: `numberOfLines={1}`
  - Multi-line text: `numberOfLines={2-3}`
- Maintain high contrast between text and background
- Use `letter-spacing` values for improved readability in headings

### Semantic HTML/Structure
- Buttons always have `Pressable` wrapper
- Icons have size ≥ 18px for tappable areas
- Toggle switches use standard React Native `Switch`

---

## Component Best Practices

### Cards
✅ **DO:**
- Use consistent 24px padding for all cards
- Apply 24px bottom margin for spacing between cards
- Use 24px border radius
- Layer colors via surface tiers, not borders

❌ **DON'T:**
- Mix padding sizes (20px vs 24px)
- Use `borderWidth` for card separation
- Add explicit dividers between cards

### Typography
✅ **DO:**
- Use Manrope_700Bold for headlines
- Use Inter for body and labels
- Use JetBrainsMono for code/data
- Maintain consistent letter-spacing values

❌ **DON'T:**
- Use emoji in notification labels
- Mix font families in single card
- Apply manual font fallbacks (system fonts)

### Spacing
✅ **DO:**
- Use 8px/16px/24px/48px increments
- Match padding and border-radius
- Apply 48px gaps between major sections

❌ **DON'T:**
- Use arbitrary spacing values (13px, 17px, etc.)
- Mix margin and padding inconsistently

### Color
✅ **DO:**
- Use category colors for accent elements
- Layer via surface tiers for depth
- Apply semantic color names (positivity, info)

❌ **DON'T:**
- Use hardcoded hex colors
- Override theme colors in components
- Mix color systems

---

## Responsive Design

### Breakpoints
- **Mobile:** 320-400px (primary)
- **Tablet:** 768px+ (secondary support)
- **Desktop:** Web deployment (CSS Grid)

### Safe Margins
```typescript
// All cards include safe area padding
marginHorizontal: 24,  // Content margin
paddingBottom: 100,    // Bottom nav clearance
```

---

## Dark/Light Mode

### Implementation
```typescript
// All colors use theme context
backgroundColor: t.card
color: t.ink
borderColor: t.border
```

### Dark Mode Specifics
```typescript
// React Native specific
backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)'
```

---

## Notification System Specification (v2.0)

### Wellness Reminders (Updated)
**Features:**
- Clean labels without emoji
- Two notification types:
  - **Interval-based:** Trigger every N minutes
  - **Time-based:** Trigger at specific hour (e.g., 11 PM)
- User can toggle and customize in Settings
- Respects vibration/sound preferences

**Configuration:**
```typescript
interface WellnessNotification {
  id: string;
  label: string;              // No emoji
  description: string;
  enabled: boolean;
  intervalMinutes?: number;   // For interval notifications
  notificationTime?: number;  // For time notifications (0-23)
  lastTriggered?: number;
}
```

---

## Error Handling & Edge Cases

### Time Display
✅ Clamped to prevent negative values
```typescript
const elapsed = Math.max(0, elapsedSeconds);
```

### Font Loading
✅ All fonts pre-loaded in app/_layout.tsx
✅ Fallback system (Inter for unknown fonts)

### Spacing Consistency
✅ All cards use 24px padding/margin
✅ Sections separated by 48px gaps

---

## Testing Checklist

- [ ] iOS font rendering
- [ ] Android font rendering
- [ ] Web font rendering
- [ ] Dark mode colors
- [ ] Light mode colors
- [ ] Card spacing alignment
- [ ] Text overflow prevention
- [ ] Touch target sizes
- [ ] Notification display (interval & time-based)
- [ ] Time never displays negative

---

## Metrics & Performance

| Metric | Target | Status |
|--------|--------|--------|
| Font loading time | <100ms | ✅ |
| Card render time | <16ms | ✅ |
| Color theme switching | <200ms | ✅ |
| No layout shift (CLS) | 0 | ✅ |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.2.1 | 2026-04-04 | Font completion, emoji removal, spacing fixes |
| 1.2.0 | 2026-04-03 | Design system alignment, typography migration |
| 1.1.0 | 2026-03-01 | Initial UI/UX documentation |
