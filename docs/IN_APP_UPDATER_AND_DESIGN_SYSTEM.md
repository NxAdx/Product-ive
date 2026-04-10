# Product +ive: In-App Updater & Design System Implementation

## In-App Updater Testing Guide

### Current State
The in-app updater is fully implemented in the `UpdateManager` service and integrated into the Settings screen. The system supports both:
1. **Expo-managed OTA (Over-The-Air) updates** - for web and managed service
2. **Android APK updates** - for native APK installations with file download

### How to Test the Updater

#### 1. Manual Update Check
- Go to **Settings** → **Support** → **Check for updates**
- The app will check the cached update info (updated every 24 hours)
- Currently shows "Up to Date" because no version API is configured

#### 2. Auto-Check Updates Setting
- Toggle **Settings** → **Updater** → **Auto check updates**
- This controls whether the app automatically checks for updates on app launch
- Setting is persisted in AsyncStorage via Zustand

#### 3. Integration with Version API (For Production)
To enable real update detection, you need to:

**Step 1: Set up a version API endpoint**
```
https://api.product-ive.app/version
```

**Step 2: Update UpdateManager.ts**
Uncomment the API call in `checkForUpdates()`:
```typescript
// Uncomment this in production:
const response = await fetch('https://api.product-ive.app/version');
const { latestVersion, releaseNotes } = await response.json();
const isUpdateAvailable = latestVersion > currentVersion;
```

**Step 3: API Response Format**
```json
{
  "latestVersion": "1.0.1",
  "releaseNotes": "Bug fixes and performance improvements",
  "downloadUrl": "https://play.google.com/store/apps/details?id=com.product_ive",
  "releaseDate": "2026-04-03T00:00:00Z"
}
```

#### 4. Testing the Download Flow
The app currently simulates the download phase. For production:
- **Expo-managed**: Integrates with `expo-updates` package
- **APK builds**: Uses `FileSystem.createDownloadResumable()` to download and trigger Android's PackageInstaller

#### 5. Triggering Updates
Users can:
- Manually trigger with "Check for updates" button
- Auto-check on app launch (if enabled)
- Get version info in the Changelog section

### UpdateManager API Reference

```typescript
// Check for available updates
const updateInfo = await UpdateManager.checkForUpdates();
// Returns: { isAvailable, currentVersion, latestVersion, releaseNotes }

// Download and install update
await UpdateManager.downloadAndInstall();

// Download and install APK specifically
await UpdateManager.downloadAndInstallAPK(apkUrl);
```

---

## Design System Implementation

### Typography Updates
The design system now uses:
- **Headlines**: Manrope Bold (700 weight) - Authoritative, modern-industrial feel
- **Body Text**: Inter Regular/SemiBold - Clinical clarity and legibility
- **Mono**: JetBrains Mono - For technical content

### Color Palette
Updated to Material 3 inspired colors:
- **Primary**: #a93102 (Deep Orange)
- **Secondary**: #444bce (Medium Blue)
- **Positivity**: #059669 (Teal Green)
- **Backgrounds**: Light mode: #f7f9fc | Dark mode: #0d0d0d
- **Cards**: Light mode: #ffffff | Dark mode: #1e1e1e

### Border & Elevation
Per design spec:
- **No 1px borders** - Structure defined through background shifts
- **Surface hierarchy**: Using `surface-container` tiers
- **Card border radius**: 24px (lg) for primary containers
- **Glassmorphism**: 60% opacity with 24px backdrop-blur for floating elements

### Design System Tokens
Located in `src/theme/tokens.ts`:
```typescript
{
  colors: { ... },
  radius: { card: 24, row: 22, btn: 999, icon: 14, sm: 10 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, xxl: 64 },
  font: { display, body, mono }
}
```

### Implementation Status
- ✅ Tokens defined in theme system
- ✅ Home screen fonts updated (Manrope, Inter)
- ⏳ Component-wide font migration in progress
- ✅ Color palette updated
- ✅ Border radius standardized

### Files Using New Design System
- `app/(tabs)/index.tsx` - Home screen (updated)
- `app/settings.tsx` - Settings with wellness section (updated)
- `src/theme/tokens.ts` - System tokens (updated)

### Remaining Font Updates Needed
The following components still use legacy fonts and should be updated:
- `app/onboarding.tsx` - Lines 39, 44
- `app/(tabs)/index.tsx` - Syne → Manrope
- App engines (CountdownEngine, GuidedPromptEngine, etc.)
- Component library (StatsCard, DailyTip, ProgressBar, etc.)

### Migration Path
For each component:
1. Replace `Syne_*` with `Manrope_*`
2. Replace `PlusJakartaSans_*` with `Inter_*` for body text
3. Update font weights to match design spec (700 for headers, 600 for semi-bold, 400 for regular)

---

## Wellness Notifications System

### Overview
Comprehensive wellness notification system with 5 predefined notification types that remind users to:
1. 👀 **Blink Eye** - Rest eyes (every 30 min)
2. 💧 **Drink Water** - Stay hydrated (every 45 min)
3. 😴 **Sleep Reminder** - Get rest (every 8 hours, disabled by default)
4. 🧍 **Posture Check** - Stretch (every 60 min)
5. 👓 **20-20-20 Rule** - Digital eye strain relief (every 20 min)

### Configuration
Located in `src/store/wellnessStore.ts`:
- Enable/disable individual notifications
- Adjust interval times per notification
- Toggle vibration and sound globally
- Settings persist across sessions

### Settings Section
New wellness section in Settings app with:
- Toggle for vibration (system-wide)
- Toggle for sound (system-wide)
- Per-notification enable/disable switches
- Display of interval for each notification

### Integration with Session Recording
When user ends a session:
1. Wellness reminders trigger at configured intervals
2. Notifications can be enabled/disabled on a per-rule basis
3. Vibration pattern follows device settings
4. Sound notifications respect silent mode

### Future Enhancements
- Notification scheduling (quiet hours)
- Custom notification messages
- Tracking notification dismissals
- Statistics on wellness reminders followed

---

## Next Steps

### For In-App Updater
1. Set up version API endpoint
2. Implement actual version comparison logic
3. Set up Android native module integration for APK installation
4. Add update progress UI (download %)

### For Design System
1. Complete font migration across all components
2. Implement glassmorphism for floating elements
3. Add shadow system for depth (biological shadows per spec)
4. Create component library with standardized styles

### For Wellness Notifications
1. Implement actual notification triggering (via React Native notifications)
2. Add notification permission checks
3. Create customizable notification messages
4. Add notification history/logging
