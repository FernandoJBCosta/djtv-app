# DJTV Build Guide

Complete step-by-step instructions for building DJTV on iOS, Android, Apple TV, and Android TV platforms.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [iOS Build](#ios-build)
4. [Android Build](#android-build)
5. [Apple TV (tvOS) Build](#apple-tv-tvos-build)
6. [Android TV Build](#android-tv-build)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Platform | Requirements |
|----------|-------------|
| **All** | Node.js 18+, npm 9+ |
| **iOS/tvOS** | macOS, Xcode 15+, Apple Developer Account |
| **Android/Android TV** | Android Studio Hedgehog+, JDK 17+ |

### Install Node.js

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

---

## Initial Setup

### Step 1: Export Project from Lovable

1. In Lovable, click **"Export to GitHub"** button
2. Select your GitHub account/organization
3. Choose repository name (e.g., `djtv-app`)
4. Click **Create Repository**

### Step 2: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/djtv-app.git
cd djtv-app

# Install dependencies
npm install
```

### Step 3: Build the Web App

```bash
npm run build
```

This creates a `dist/` folder with the production build.

### Step 4: Add Mobile Platforms

```bash
# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android

# Sync web build to native projects
npx cap sync
```

---

## iOS Build

### Step 1: Open in Xcode

```bash
npx cap open ios
```

### Step 2: Configure Signing

1. In Xcode, select the **App** project in the navigator
2. Select the **App** target
3. Go to **Signing & Capabilities** tab
4. Select your **Team** from the dropdown
5. Ensure **Bundle Identifier** is unique: `app.lovable.5bd0bda027834551bbe2c7fffad7bfb3`

### Step 3: Configure App Icons

1. In Xcode, navigate to **App > Assets.xcassets > AppIcon**
2. Drag your app icons to the appropriate slots:
   - 1024x1024px (App Store)
   - 180x180px (iPhone @3x)
   - 120x120px (iPhone @2x)
   - 167x167px (iPad Pro)
   - 152x152px (iPad)

### Step 4: Build for Device

```bash
# Run on connected device
npx cap run ios

# Or build in Xcode:
# 1. Select your device from the device dropdown
# 2. Press Cmd+R or click the Play button
```

### Step 5: Archive for App Store

1. In Xcode, select **Product > Archive**
2. Once complete, click **Distribute App**
3. Select **App Store Connect**
4. Follow the prompts to upload

---

## Android Build

### Step 1: Open in Android Studio

```bash
npx cap open android
```

### Step 2: Configure Signing (Release Build)

1. In Android Studio, go to **Build > Generate Signed Bundle/APK**
2. Select **Android App Bundle** (recommended) or **APK**
3. Create a new keystore or use existing:
   ```
   Key store path: /path/to/your-keystore.jks
   Key store password: [your-password]
   Key alias: djtv
   Key password: [your-key-password]
   ```

### Step 3: Configure App Icons

Place icons in `android/app/src/main/res/`:

```
mipmap-mdpi/    → 48x48px
mipmap-hdpi/    → 72x72px
mipmap-xhdpi/   → 96x96px
mipmap-xxhdpi/  → 144x144px
mipmap-xxxhdpi/ → 192x192px
```

### Step 4: Build Debug APK

```bash
# Run on connected device/emulator
npx cap run android

# Or build APK directly
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 5: Build Release APK/Bundle

```bash
cd android

# Build release APK
./gradlew assembleRelease

# Build App Bundle (for Play Store)
./gradlew bundleRelease
```

---

## Apple TV (tvOS) Build

Apple TV requires a separate tvOS target in Xcode.

### Step 1: Add tvOS Target

1. Open iOS project in Xcode: `npx cap open ios`
2. In Xcode, go to **File > New > Target**
3. Select **tvOS > App**
4. Configure:
   - Product Name: `DJTV-TV`
   - Bundle Identifier: `app.lovable.5bd0bda027834551bbe2c7fffad7bfb3.tv`
   - Language: Swift
   - Interface: Storyboard

### Step 2: Create WebView Container

Create a new file `TVViewController.swift` in the tvOS target:

```swift
import UIKit
import WebKit

class TVViewController: UIViewController, WKNavigationDelegate {
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        
        // Enable focus for TV navigation
        webView.allowsBackForwardNavigationGestures = true
        
        view.addSubview(webView)
        
        // Load the app
        if let url = URL(string: "https://5bd0bda0-2783-4551-bbe2-c7fffad7bfb3.lovableproject.com?forceHideBadge=true") {
            webView.load(URLRequest(url: url))
        }
    }
    
    // Handle Siri Remote navigation
    override func pressesBegan(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
        for press in presses {
            switch press.type {
            case .select:
                webView.evaluateJavaScript("document.activeElement.click()")
            case .menu:
                webView.evaluateJavaScript("window.history.back()")
            case .playPause:
                webView.evaluateJavaScript("document.querySelector('video')?.paused ? document.querySelector('video')?.play() : document.querySelector('video')?.pause()")
            default:
                super.pressesBegan(presses, with: event)
            }
        }
    }
}
```

### Step 3: Update Main Storyboard

1. Open `Main.storyboard` for the tvOS target
2. Delete the default view controller
3. Add a new View Controller
4. Set its class to `TVViewController`
5. Check **Is Initial View Controller**

### Step 4: Configure tvOS Info.plist

Add to tvOS target's `Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>arm64</string>
</array>
```

### Step 5: Add tvOS App Icons

In tvOS Assets.xcassets, add:
- App Icon (1280x768px - Large)
- App Icon (400x240px - Small)
- Top Shelf Image (1920x720px)
- Top Shelf Wide Image (2320x720px)

### Step 6: Build and Run

1. Select the tvOS target from the scheme dropdown
2. Select an Apple TV simulator or connected Apple TV
3. Press Cmd+R to build and run

### Step 7: Archive for App Store

1. Select **Product > Archive**
2. Click **Distribute App**
3. Select **App Store Connect**
4. Submit for tvOS App Store

---

## Android TV Build

Android TV uses the same Android project with additional configurations.

### Step 1: Update AndroidManifest.xml

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add TV features -->
    <uses-feature android:name="android.software.leanback" android:required="false" />
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:banner="@drawable/tv_banner"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        
        <!-- Main Activity for Mobile -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            
            <!-- Mobile launcher -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- TV Leanback launcher -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### Step 2: Add Leanback Dependencies

Edit `android/app/build.gradle`:

```gradle
dependencies {
    // Existing dependencies...
    
    // Leanback for Android TV
    implementation 'androidx.leanback:leanback:1.0.0'
}
```

### Step 3: Create TV Banner Image

Create `android/app/src/main/res/drawable/tv_banner.png`:
- Dimensions: 320x180px
- Used as the app icon on Android TV home screen

### Step 4: Add TV-Specific Drawables

Create launcher icons for TV in:
```
android/app/src/main/res/
├── drawable-xhdpi/tv_banner.png (320x180)
├── mipmap-xhdpi/ic_launcher_leanback.png (320x180)
```

### Step 5: Handle D-Pad Navigation

The web app already includes TV navigation support via `useTVNavigation` hook. Ensure your MainActivity handles key events:

Edit `android/app/src/main/java/.../MainActivity.java`:

```java
import android.view.KeyEvent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // Let WebView handle D-pad navigation
        return super.onKeyDown(keyCode, event);
    }
}
```

### Step 6: Build for Android TV

```bash
cd android

# Build debug APK for testing
./gradlew assembleDebug

# Install on connected Android TV
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Step 7: Test on Android TV Emulator

1. In Android Studio, go to **Tools > Device Manager**
2. Click **Create Device**
3. Select **TV** category
4. Choose **Android TV (1080p)**
5. Select system image (API 33+)
6. Run the emulator and install the app

### Step 8: Build for Play Store

```bash
cd android
./gradlew bundleRelease
```

Upload `app/build/outputs/bundle/release/app-release.aab` to Play Console.

---

## Troubleshooting

### Common Issues

#### iOS: "Signing requires a development team"
- Open Xcode, select project > Signing & Capabilities
- Select your Apple Developer team

#### Android: "SDK location not found"
- Create `android/local.properties` with:
  ```
  sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
  ```

#### Build fails after Lovable changes
```bash
git pull origin main
npm install
npm run build
npx cap sync
```

#### White screen on TV platforms
- Check network connectivity
- Verify the URL in `capacitor.config.ts` is accessible
- Check browser console for JavaScript errors

#### D-Pad navigation not working
- Ensure elements have `tabIndex={0}` or `data-tv-focusable` attribute
- Check that `useTVNavigation` hook is initialized

### Useful Commands

```bash
# Sync changes to native projects
npx cap sync

# Update native dependencies
npx cap update

# Check Capacitor doctor
npx cap doctor

# View Android logs
adb logcat | grep -i capacitor

# View iOS logs (in Xcode)
# Window > Devices and Simulators > View Device Logs
```

---

## Build Checklist

### Before Release

- [ ] Update version in `package.json`
- [ ] Update version in iOS `Info.plist`
- [ ] Update version in Android `build.gradle`
- [ ] Test on physical devices
- [ ] Test D-Pad navigation on TV platforms
- [ ] Verify video playback works
- [ ] Check all icons are properly configured
- [ ] Remove debug/development URLs
- [ ] Create release builds
- [ ] Test release builds before submission

### App Store Submission

- [ ] Screenshots for all device sizes
- [ ] App description and keywords
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Age rating questionnaire
- [ ] Review notes (if needed)

---

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Android Developer Documentation](https://developer.android.com/docs)
- [tvOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/tvos)
- [Android TV Design Guidelines](https://developer.android.com/design/ui/tv)
