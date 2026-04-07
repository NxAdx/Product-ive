# Comprehensive Testing Plan - Phase 3 (v1.0.0 + Fixes)

## Updated: April 2, 2026
**Status**: Ready for Manual & Automated Testing
**Fixes Applied**: Keyboard UX, Typography, Icon Consistency, Rule Logic

---

## Section 1: Regression Testing (Fixes Verification)

### 1.1 Keyboard UX Fix - Todo Screen
**Test Case**: Add Task - Keyboard Doesn't Cover Input
```
Steps:
1. Navigate to "Tasks" tab (bottom nav)
2. Tap in the text input field "Add a task..."
3. Virtual keyboard should appear
4. Input area should remain visible above keyboard
5. Priority selector buttons should not be covered

Expected Result: ✅ Input and priority buttons stay visible
Regression: ❌ Keyboard covers input field
```

### 1.2 Typography Fix - Rule Detail Title
**Test Case**: Rule Detail Screen Title Layout
```
Steps:
1. Tap any rule (e.g., "5-Second Rule")
2. Observe title in the top bar
3. Title should not break oddly (no "5" appearing below text)
4. Title should be properly centered

Expected Result: ✅ Title displays correctly with proper line height
Regression: ❌ Title text wraps incorrectly or overflows
```

### 1.3 Icon Consistency - Home Bar
**Test Case**: Bottom Navigation Icons
```
Steps:
1. Observe bottom navigation bar
2. Check all 4 icons: Home, Plus, Compass, BarChart
3. All icons should be same size (20px)
4. Active state: strokeWidth 2.5, inactive: 2
5. All icons properly centered in touch targets

Expected Result: ✅ All icons have uniform appearance
Regression: ❌ Icons different sizes or misaligned
```

### 1.4 Rule Logic Fix - 1-4-7 Rule
**Test Case**: 1-4-7 Spacing Rule Configuration
```
Steps:
1. Navigate to Learning category
2. Find "1-4-7 Spacing Rule"
3. Verify rule description mentions "reminders on day 4 and 7"
4. Check engineConfig: { intervals: [0, 4, 7], reminderDays: [4, 7] }

Expected Result: ✅ Rule config updated with reminder days
Regression: ❌ No reminder days specified or wrong description
```

---

## Section 2: Feature Testing (Tier 1 & Foundation)

### 2.1 Home Screen Features (Tier 1)
**Test Case**: Home Screen Components Display
```
Steps:
1. Open app, land on home screen
2. Scroll down and verify these components appear:
   - StatsCard (Weekly score, streak, rules used)
   - DailyTip (Random tip with lightbulb icon)
   - ProgressBar (4-tier milestones: Starter→Catalyst→Master→Legend)
3. Each component should match theme (light/dark)

Expected Result: ✅ All 3 components visible and styled correctly
Regression: ❌ Components missing, misaligned, or wrong colors
```

### 2.2 Stats Card Functionality
```
Steps:
1. Navigate home screen
2. Locate StatsCard with trophy icon
3. Weekly score should update after sessions
4. Streak count should reflect consecutive days
5. "Rules used today" should increment with each rule practiced

Expected Result: ✅ All metrics update correctly
Regression: ❌ Static values, not updating, or wrong calculations
```

### 2.3 Daily Tip Rotation
```
Steps:
1. Open app on different days
2. DailyTip should show different tips each day
3. Tips should be from the 10 configured productivity tips
4. Tip should persist throughout the day

Expected Result: ✅ New tip each calendar day
Regression: ❌ Same tip all the time or tips repeat
```

### 2.4 Progress Milestones
```
Steps:
1. Check ProgressBar component
2. Verify 4 tiers: Starter (0-25), Catalyst (25-50), Master (50-75), Legend (75+)
3. Current milestone should be highlighted
4. Non-active tiers should be dimmed

Expected Result: ✅ Correct tier highlighted based on score
Regression: ❌ Wrong tier shown or all highlighted/dimmed
```

---

## Section 3: Core Functionality Testing

### 3.1 Category Navigation
```
Steps:
1. Home screen shows 2×2 category grid
2. Tap each category card (Focus, Learning, Productivity, Study)
3. Should navigate to category detail with rule list
4. Should not crash or show errors

Expected Result: ✅ All 4 categories navigate without errors
Regression: ❌ Navigation fails, crashes, or shows blank page
```

### 3.2 Rule Details & Engine Start
```
Steps:
1. From category page, tap any rule
2. Rule detail screen loads with title, description, "Why it works"
3. Engine area should display (specific to rule type)
4. Tap info icon - modal should show with details
5. Tap "How it works" or engine button - should start session

Expected Result: ✅ All rule details load, engines initialize
Regression: ❌ Missing info, crash, or engine doesn't start
```

### 3.3 Todo (Task) Management
```
Steps:
1. Tap "+" in bottom nav or go to Tasks tab
2. Type a task name
3. Select priority (Low/Medium/High)
4. Tap add button - task should appear in list
5. Tap checkbox to mark complete
6. Tap trash icon to delete

Expected Result: ✅ CRUD operations work, keyboard visible
Regression: ❌ Cannot add task, keyboard covers input, crashes
```

### 3.4 Explore & Search
```
Steps:
1. Tap Compass icon in bottom nav
2. View all 20 rules in grid
3. Tap search bar, type "pomodoro"
4. Results should filter to matching rules
5. Tap result to navigate to rule detail

Expected Result: ✅ Search filters correctly, navigation works
Regression: ❌ Search doesn't work, wrong results, crashes
```

### 3.5 Positivity Meter
```
Steps:
1. Tap BarChart icon in bottom nav
2. Should show weekly score progress
3. Should display current level/tier
4. Should show current streak

Expected Result: ✅ Meter displays all stats
Regression: ❌ Missing stats, wrong values, crashes
```

---

## Section 4: Theme & Styling

### 4.1 Light Mode
```
Steps:
1. Go to Settings
2. Set theme to Light
3. Check all screens render with light colors
4. Ensure text is readable on light backgrounds

Expected Result: ✅ Proper light theme colors
Regression: ❌ Wrong colors, unreadable text, visual glitches
```

### 4.2 Dark Mode
```
Steps:
1. Set theme to Dark
2. Check all screens render with dark colors
3. Verify proper contrast for dark backgrounds
4. Check accent colors are visible

Expected Result: ✅ Proper dark theme colors
Regression: ❌ Colors incorrect, hard to read, glitches
```

### 4.3 Theme Persistence
```
Steps:
1. Set theme to Dark
2. Close app completely
3. Reopen app
4. Should remain Dark

Expected Result: ✅ Theme persists on app restart
Regression: ❌ Theme reverts to default
```

---

## Section 5: Settings & Configuration

### 5.1 Settings Screen Access
```
Steps:
1. Tap settings icon (gear) to open settings
2. Should show: Theme toggle, Bug report link, Changelog, About
3. All buttons should be tappable
4. Should navigate or open appropriate screens/links

Expected Result: ✅ All settings options work
Regression: ❌ Missing options, links broken, crashes
```

### 5.2 About Screen
```
Steps:
1. Tap "About" in settings
2. Should display app info: version, description, etc
3. Button to go back should work

Expected Result: ✅ About screen displays correctly
Regression: ❌ Missing info, navigation broken
```

---

## Section 6: Performance Testing

### 6.1 App Startup Time
```
Test: Measure time from app launch to home screen fully loaded
Target: < 3 seconds on mid-range device
```

### 6.2 Scroll Performance (Home Screen)
```
Test: Scroll through all home screen components
Expected: Smooth 60fps, no jank or lag
```

### 6.3 Category Grid Performance
```
Test: Navigate to category page with 20 rule cards
Expected: Smooth scrolling, no lag
```

### 6.4 Memory Usage
```
Test: App should not leak memory after multiple navigations
Expected: Stable memory after 10+ navigation cycles
```

---

## Section 7: Accessibility Testing

### 7.1 Touch Targets
```
Test: All interactive elements meet 44×44pt minimum
- Bottom nav icons ✅
- Category cards ✅
- Todo checkboxes ✅
- Todo delete buttons ✅
```

### 7.2 Color Contrast
```
Test: Text contrast ratio ≥ 4.5:1 for normal text
- Light mode text on light background
- Dark mode text on dark background
```

### 7.3 Text Scaling
```
Test: App supports system font size changes (110%, 120%)
Expected: All text readable, layout doesn't break
```

---

## Section 8: Error Handling & Edge Cases

### 8.1 Empty States
```
Test Cases:
- No rules completed yet (home shows guide)
- No tasks added (tasks page shows "No tasks yet")
- No search results (search shows "No rules found")
```

### 8.2 Navigation Edge Cases
```
Test Cases:
- Rapid tab switching (bottom nav)
- Back button while modal open
- Deep link to rule detail
- Return from another app (app in background)
```

### 8.3 Data Persistence
```
Test Cases:
- Add todo, restart app - todo persists
- Change theme, restart app - theme persists
- Complete rule session, check stats update
```

---

## Section 9: TypeScript & Build

### 9.1 TypeScript Compilation
```bash
Command: npx tsc --noEmit
Expected: Zero errors ✅
```

### 9.2 ESLint Checks
```bash
Command: npm run lint
Expected: No critical errors
```

### 9.3 Dependencies
```
Test: All imports resolve correctly
Test: No missing peer dependencies
Test: No security vulnerabilities
```

---

## Section 10: Manual Testing Checklist

### Before Release
- [ ] Start fresh app - onboarding smooth
- [ ] Create 5 todos - verify keyboard works
- [ ] Complete 3 rule sessions - verify stats update
- [ ] Change theme - verify persistence
- [ ] Test on both iOS and Android simulator
- [ ] Test back navigation from deep screens
- [ ] Verify all icons match size (20px baseline)
- [ ] Check typography (no odd text wrapping)
- [ ] Test on device with large system font size
- [ ] Verify dark mode contrast is adequate

### Post-Release
- [ ] Monitor crash logs
- [ ] Check user feedback for regressions
- [ ] Verify all 20 rules are functional
- [ ] Test all 7 engines work correctly
- [ ] Check update mechanism works

---

## Test Results Summary

### Fixes Applied ✅
1. [x] Keyboard UX: KeyboardAvoidingView wrapper added
2. [x] Typography: lineHeight fix applied to rule titles
3. [x] Icon Consistency: Verified all icons 20px, consistent strokeWidth
4. [x] Rule Logic: 1-4-7 rule updated with reminderDays config

### Verification Status
- [x] TypeScript: Zero errors (npx tsc --noEmit)
- [x] Files Modified: todo.tsx, rule/[id].tsx, rules.ts
- [x] Components: StatsCard, DailyTip, ProgressBar integrated
- [x] Imports: All valid, no missing dependencies

### Ready for Manual Testing
✅ All code changes verified
✅ All fixes applied
✅ No regressions in TypeScript
✅ Ready for device testing

---

## Next Steps
1. **User Manual Testing**: Test all scenarios in Section 2-8
2. **Device Testing**: iOS simulator, Android emulator
3. **Performance Profiling**: Monitor startup, scroll FPS
4. **Tier 2 Implementation**: After manual testing confirmation

---

**Generated**: April 2, 2026
**Version**: v1.0.0 + Hotfixes
**Phase**: 3 Tier 1 + Bug Fixes
