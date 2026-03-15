# IPInspectorZ — Build & Release

## Prerequisites

| Tool                | Requirement                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| Node.js             | 18+ ([nodejs.org](https://nodejs.org/))                                                                   |
| Rust                | Latest stable ([rustup.rs](https://rustup.rs/))                                                           |
| Windows build tools | Microsoft C++ Build Tools ("Desktop development with C++")                                                |
| macOS build tools   | `xcode-select --install`                                                                                  |
| Linux packages      | `libwebkit2gtk-4.1-dev build-essential libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev` |
| Android             | Android Studio + NDK (via `sdkmanager`)                                                                   |
| iOS                 | Xcode 14+ on macOS                                                                                        |

---

## First-Time Setup

```bash
npm install
npm run icons:generate           # generate placeholder icons
npx tauri icon app-icon.png      # or use your own 512×512 PNG icon

# Mobile — run once and commit the generated projects:
npm run tauri android init
npm run tauri ios init            # macOS only
```

---

## Development

```bash
# Desktop (current OS)
npm run tauri dev

# Android (device or emulator)
npm run tauri android dev

# iOS simulator (macOS only)
npm run tauri ios dev
```

---

## Production Build

### Desktop

```bash
npm run build
npm run tauri build
```

| Platform               | Output path                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| Windows NSIS installer | `src-tauri/target/release/bundle/nsis/IPInspectorZ_x64-setup.exe` |
| Windows MSI            | `src-tauri/target/release/bundle/msi/`                            |
| macOS .app             | `src-tauri/target/release/bundle/macos/IPInspectorZ.app`          |
| macOS .dmg             | `src-tauri/target/release/bundle/dmg/`                            |
| Linux AppImage         | `src-tauri/target/release/bundle/appimage/`                       |
| Linux .deb             | `src-tauri/target/release/bundle/deb/`                            |

### Android

```bash
npm run tauri android build
# Output: src-tauri/gen/android/app/build/outputs/
```

Produces an `.apk` (sideload) and an `.aab` (Android App Bundle for Google Play).

### iOS

```bash
npm run tauri ios build     # macOS only
# Output: src-tauri/gen/apple/
```

Produces an `.ipa` for TestFlight / App Store Connect.

---

## Versioning

Bump the version in **all three** places before a release:

1. `package.json` — `"version": "X.Y.Z"`
2. `src-tauri/tauri.conf.json` — `"version": "X.Y.Z"`
3. `src-tauri/Cargo.toml` — `version = "X.Y.Z"`

---

## CI / CD (GitHub Actions)

`.github/workflows/build.yml` builds **Windows, macOS, Linux, iOS, and Android** on push/PR and creates a GitHub Release when you push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Performance Targets

| Metric                | Target                          |
| --------------------- | ------------------------------- |
| Startup time          | < 1 second                      |
| Binary size (desktop) | < 10 MB                         |
| RAM usage             | Minimal; no background services |

---

## Related

- [PRIVACY.md](PRIVACY.md) — Privacy policy
