# IPInspectorZ — Publishing Guide

This guide covers how to build and distribute IPInspectorZ on all supported platforms: **Microsoft Store**, **Google Play**, **Apple App Store**, **Mac App Store**, and **direct download (GitHub Releases)**.

---

## 1. Build the App

> Complete build prerequisites and signing setup are in [BUILD.md](BUILD.md).

### Desktop (Windows / macOS / Linux)

```bash
npm install
npm run icon
npm run build
npm run tauri build
```

**Output:** `src-tauri/target/release/bundle/`

| Platform          | File                                   |
| ----------------- | -------------------------------------- |
| Windows installer | `nsis/IPInspectorZ_x64-setup.exe`      |
| Windows MSI       | `msi/IPInspectorZ_x64.msi`             |
| macOS .app        | `macos/IPInspectorZ.app`               |
| macOS .dmg        | `dmg/IPInspectorZ_x64.dmg`             |
| Linux AppImage    | `appimage/IPInspectorZ_amd64.AppImage` |
| Linux .deb        | `deb/IPInspectorZ_amd64.deb`           |

### Android

```bash
npm run tauri android build
```

**Output:** `src-tauri/gen/android/app/build/outputs/`

- `.apk` — sideload / direct download
- `.aab` — Android App Bundle for **Google Play**

### iOS

```bash
npm run tauri ios build    # macOS only
```

**Output:** `src-tauri/gen/apple/`

- `.ipa` — for **TestFlight** and **Apple App Store**

---

## 2. Direct Download (GitHub Releases)

1. **Bump version** in `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`.
2. **Build** on each target OS (or via CI — see `.github/workflows/build.yml`).
3. **Tag and push:**
    ```bash
    git tag v1.0.0
    git push origin v1.0.0
    ```
4. **Create a GitHub Release**, attach:
    - `IPInspectorZ_x64-setup.exe` (Windows)
    - `IPInspectorZ_x64.dmg` (macOS)
    - `IPInspectorZ_amd64.AppImage` (Linux)
    - `IPInspectorZ.apk` (Android sideload)
    - `SHA256SUMS` (optional checksum file)

---

## 3. Microsoft Store (MSIX)

### Requirements

- Windows 10/11 MSIX package (Tauri generates one via `bundle.windows.wix` or NSIS; for Store you need MSIX).
- [Microsoft Partner Center](https://partner.microsoft.com/dashboard) account.
- Code-signed with a trusted certificate for Store submission.

### Steps

1. **Enable MSIX output** — In `src-tauri/tauri.conf.json`:

    ```json
    "bundle": {
      "windows": {
        "wix": {},
        "nsis": {}
      }
    }
    ```

    Tauri 2 can produce MSIX-compatible packages. Confirm with the [Tauri Windows packaging docs](https://v2.tauri.app/distribute/windows-installer/).

2. **Build the package:**

    ```bash
    npm run tauri build
    ```

3. **Sign the package** with your code-signing certificate (EV recommended for Store).

4. **Submit via Partner Center:**
    - Create a new app listing → upload the `.msix` / installer.
    - Fill in: app name **IPInspectorZ**, description, screenshots, privacy policy URL (link to `docs/PRIVACY.md` hosted publicly).
    - Set age rating (this app: **Everyone / General**).
    - Set pricing (Free).
    - Provide the privacy policy URL — required for Store approval.

5. **Review and publish** — Microsoft review typically takes 1–3 business days.

---

## 4. Google Play (Android)

### Requirements

- [Google Play Console](https://play.google.com/console) account ($25 one-time fee).
- Signed `.aab` (Android App Bundle).
- A keystore for signing (keep it safe — you cannot change it after publishing).

### Steps

1. **Generate your keystore** (one-time):

    ```bash
    keytool -genkey -v -keystore ipinspectorz.keystore \
      -alias ipinspectorz -keyalg RSA -keysize 2048 -validity 10000
    ```

2. **Configure signing** in `src-tauri/gen/android/app/build.gradle`:

    ```groovy
    signingConfigs {
      release {
        storeFile file("path/to/ipinspectorz.keystore")
        storePassword "YOUR_STORE_PASSWORD"
        keyAlias "ipinspectorz"
        keyPassword "YOUR_KEY_PASSWORD"
      }
    }
    buildTypes {
      release {
        signingConfig signingConfigs.release
      }
    }
    ```

3. **Build the release bundle:**

    ```bash
    npm run tauri android build
    ```

4. **Submit via Play Console:**
    - Create a new app → set app name **IPInspectorZ**.
    - Upload the `.aab` to the **Production** (or Internal Testing) track.
    - Fill in: short description, full description, screenshots (phone + tablet), feature graphic (1024×500).
    - Set content rating — fill the questionnaire (this app: no violence, no personal data collection).
    - Add privacy policy URL (required) — link to your hosted `PRIVACY.md`.
    - Set pricing to **Free**.
    - Set target API level (33+ recommended for 2024+).

5. **Review and publish** — Internal/Closed testing is instant; Production review takes 1–7 days.

---

## 5. Apple App Store (iOS)

### Requirements

- [Apple Developer Program](https://developer.apple.com/programs/) account ($99/year).
- macOS machine with Xcode 14+.
- App Store Connect account.

### Steps

1. **Initialize iOS project** (one-time):

    ```bash
    npm run tauri ios init
    git add src-tauri/gen/apple
    git commit -m "chore: initialize iOS project"
    ```

2. **Configure in Xcode:**
    - Open `src-tauri/gen/apple/IPInspectorZ.xcodeproj`.
    - Set Bundle ID (e.g. `com.yourname.ipinspectorz`).
    - Set signing team and provisioning profile under **Signing & Capabilities**.

3. **Build and archive:**

    ```bash
    npm run tauri ios build
    ```

    Or in Xcode: **Product → Archive**.

4. **Submit via App Store Connect:**
    - Upload via Xcode Organizer or `xcrun altool`.
    - Create a new app listing → set app name **IPInspectorZ**.
    - Add screenshots (6.7", 5.5", iPad if needed), app description, keywords, privacy policy URL.
    - Complete privacy nutrition labels (this app: no data collected).
    - Submit for review — typically 1–3 days.

---

## 6. Mac App Store

### Requirements

- Same Apple Developer account as iOS.
- macOS Tauri build signed and notarized.

### Steps

1. **Build the macOS app** with hardened runtime and notarization:
    - Set `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID` env vars.
    - `npm run tauri build` — Tauri handles signing and notarization automatically.

2. **Package for Mac App Store** using a **Mac App Distribution** certificate and submit via App Store Connect (same process as iOS, select macOS platform).

---

## 7. Windows SmartScreen Notice

Unsigned or newly signed installers may show a **"Windows protected your PC"** warning. Users can click **"More info" → "Run anyway"**. To prevent this:

- Use an **EV (Extended Validation) code signing certificate** — builds reputation fastest.
- Or accumulate download reputation over time with a standard certificate.

See [BUILD.md](BUILD.md#code-signing) for signing configuration details.

---

## 8. Privacy Policy Hosting

All store listings require a publicly accessible privacy policy URL. Host the contents of `docs/PRIVACY.md` at a stable URL, for example:

- GitHub Pages: `https://yourusername.github.io/IPInspectorZ/privacy`
- Or a raw GitHub URL: `https://raw.githubusercontent.com/yourusername/IPInspectorZ/main/docs/PRIVACY.md`

Use this URL in all store listing forms.

---

## Quick Reference

| Store                 | Build artifact                      | Submission portal                                         |
| --------------------- | ----------------------------------- | --------------------------------------------------------- |
| Microsoft Store       | `.msix` / NSIS installer            | [Partner Center](https://partner.microsoft.com/dashboard) |
| Google Play           | `.aab`                              | [Play Console](https://play.google.com/console)           |
| Apple App Store (iOS) | `.ipa`                              | [App Store Connect](https://appstoreconnect.apple.com/)   |
| Mac App Store         | `.pkg` / signed `.app`              | [App Store Connect](https://appstoreconnect.apple.com/)   |
| GitHub Releases       | `.exe`, `.dmg`, `.AppImage`, `.apk` | GitHub.com                                                |
