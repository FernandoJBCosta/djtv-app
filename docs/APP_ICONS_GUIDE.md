# App Icons & Splash Screen Setup Guide

This guide explains how to add the DJTV logo as app icons and splash screens for iOS and Android.

## Your Logo

The DJTV logo is available at `public/app-icon.png` (downloaded from https://app.djtv.pt/Logo_DJTV.png).

## Prerequisites

After pulling the latest changes, run:
```bash
npm install
npx cap sync
```

## App Icons

### iOS App Icons

1. Open the iOS project in Xcode: `npx cap open ios`
2. Navigate to `App/App/Assets.xcassets/AppIcon.appiconset`
3. Replace the placeholder icons with your icons in these sizes:
   - 20x20 (1x, 2x, 3x)
   - 29x29 (1x, 2x, 3x)
   - 40x40 (1x, 2x, 3x)
   - 60x60 (2x, 3x)
   - 76x76 (1x, 2x) - iPad
   - 83.5x83.5 (2x) - iPad Pro
   - 1024x1024 - App Store

**Tip:** Use a tool like [App Icon Generator](https://appicon.co/) to generate all sizes from a single 1024x1024 image.

### Android App Icons

1. Open the Android project in Android Studio: `npx cap open android`
2. Right-click on `app/src/main/res` → New → Image Asset
3. Select "Launcher Icons (Adaptive and Legacy)"
4. Choose your foreground image (should be centered with padding)
5. Configure background color or image
6. Click Next → Finish

**Icon locations:**
- `android/app/src/main/res/mipmap-mdpi/` (48x48)
- `android/app/src/main/res/mipmap-hdpi/` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/` (192x192)

## Splash Screen

### iOS Splash Screen

1. Open Xcode: `npx cap open ios`
2. Navigate to `App/App/Assets.xcassets/Splash.imageset`
3. Add your splash image (recommended: 2732x2732 for universal)
4. Or customize `App/App/Base.lproj/LaunchScreen.storyboard`

### Android Splash Screen

1. Create splash screen images in these folders:
   - `android/app/src/main/res/drawable/splash.png` (default)
   - `android/app/src/main/res/drawable-land-hdpi/splash.png` (landscape)
   - `android/app/src/main/res/drawable-port-hdpi/splash.png` (portrait)

2. Recommended sizes:
   - mdpi: 320x480
   - hdpi: 480x800
   - xhdpi: 720x1280
   - xxhdpi: 1080x1920
   - xxxhdpi: 1440x2560

### Splash Screen Configuration

The splash screen is configured in `capacitor.config.ts`:

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,      // Duration in ms
    launchAutoHide: true,          // Auto hide after duration
    launchFadeOutDuration: 500,    // Fade animation duration
    backgroundColor: '#0a0a0a',    // Background color (DJTV dark theme)
    androidSplashResourceName: 'splash',
    androidScaleType: 'CENTER_CROP',
    showSpinner: false,
    splashFullScreen: true,
    splashImmersive: true,
  },
}
```

## Quick Setup with App Icon Generator

The easiest way to generate all required icon sizes:

1. Go to [App Icon Generator](https://appicon.co/) or [Icon Kitchen](https://icon.kitchen/)
2. Upload `public/app-icon.png` (your DJTV logo)
3. Set background color to `#0a0a0a` (DJTV dark theme)
4. Download the generated icons
5. Copy the iOS icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
6. Copy the Android icons to `android/app/src/main/res/mipmap-*/`

### Recommended Design

- **App Icon:** DJTV logo centered on dark background (#0a0a0a)
- **Splash Screen:** DJTV logo centered, dark background

## Programmatic Splash Screen Control

You can control the splash screen programmatically:

```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Show splash screen
await SplashScreen.show({
  showDuration: 2000,
  autoHide: true,
});

// Hide splash screen manually
await SplashScreen.hide();
```

## After Making Changes

Always sync your changes:
```bash
npm run build
npx cap sync
```

Then rebuild your native apps:
- iOS: `npx cap run ios`
- Android: `npx cap run android`
