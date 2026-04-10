# Icon Update Guide

## Current Status
The app currently has a successful icon with the PRO+ive duck mascot and black text on white background.

## How to Update with Your White Background Icon

If you have a new icon design with white background, follow these steps:

### 1. **Prepare the Icon Files**

You'll need versions at different resolutions:
- **1024×1024 px** - Main icon (primary source)
- **512×512 px** - Medium (iOS App Store)
- **192×192 px** - Medium (Android)
- **192×192 px** - mipmap/xhdpi (Android)

### 2. **Update Main Icon**

Replace `assets/images/icon.png` with your new icon file.

```bash
# Copy your new icon to the project
cp /path/to/your/white-background-icon-1024x1024.png assets/images/icon.png
```

### 3. **Update Android-Specific Assets**

The Android icon uses a special "Adaptive Icon" format with:
- **Foreground** (centered logo/image)
- **Background color** (from app.json)

If your icon has separate components:

```bash
# Update the foreground (the image that appears on top)
cp /path/to/your/icon-foreground.png assets/images/android-icon-foreground.png

# The background color is configured in app.json:
# android.adaptiveIcon.backgroundColor (currently "#FFFFFF" = white)
```

### 4. **Regenerate Android Resources**

To apply the changes and regenerate Android-specific drawables:

```bash
npx expo prebuild --platform android --clean
```

Or if you're using EAS:
```bash
eas build --platform android --clean
```

### 5. **Update app.json** (if needed)

If your icon has a different background color:

```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#FFFFFF",  // Change this if needed
        "foregroundImage": "./assets/images/android-icon-foreground.png"
      }
    }
  }
}
```

### 6. **Test**

Build and test on Android:
```bash
npm run android
# OR
eas build --platform android
```

Verify the icon appears correctly:
- On home screen
- In app drawer
- In system settings
- On app store listing

---

## Icon Format Specifications

### Minimum Requirements
- **Format:** PNG (32-bit with alpha channel recommended)
- **Resolution:** 1024×1024 px minimum
- **Safe zone:** Keep content within center 512×512 px on adaptive icons
- **Background:** Already accounted for with white (#FFFFFF)

### Android Adaptive Icon (Recommended)
- **Foreground:** Your logo/duck on transparent background
- **Background:** Solid color (configured in app.json)
- **Margin:** Leave 108 dp margin on all sides (system will mask)

### iOS Requirements
- **Resolution:** 1024×1024 px
- **Format:** PNG or JPEG
- **Rounded corners:** Should work with rounded presentation
- **Safe zone:** Keep content within 512×512 px center

---

## Current Configuration

Your current `app.json` android settings:

```json
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#FFFFFF",
    "foregroundImage": "./assets/images/android-icon-foreground.png"
  },
  "predictiveBackGestureEnabled": false
}
```

---

## Next Steps

1. **Prepare your white background icon file**
2. **Place it in the project** (or provide path)
3. **Run `npx expo prebuild --platform android --clean`**
4. **Build and test on device**
5. **Commit with message:** `feat: update app icon with white background`

---

## Troubleshooting

### Icon not updating after prebuild?
- Clear cache: `npx expo prebuild --platform android --clean`
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear app cache on device: Settings → Apps → Product+ive → Clear Cache

### Icon looks blurry on some devices?
- Ensure you have high-res source (1024×1024 minimum)
- Check PNG is properly optimized
- Verify safe zone (keep content in center)

### Icon has white border/frame?
- Android system adds masking automatically
- Adjust `backgroundColor` in app.json if needed
- Ensure foreground has transparent background

---

## Ready to Update?

Share the icon file path or upload it, and I'll handle the integration and testing.
