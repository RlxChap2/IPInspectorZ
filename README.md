# IPInspectorZ

A lightweight, cross-platform desktop application that displays **network and device information** derived from your connection and system environment. No login, no telemetry, no file scanning — just a clear diagnostic dashboard.

Available on **Microsoft Store** and as a **direct download** for Windows, macOS, and Linux.

---

## Features

- **Public Network** — Public IP (IPv4/IPv6), ISP, ASN, country/region/city, timezone, network type
- **Local Network** — Local IPs via WebRTC, connection protocol (IPv4/IPv6)
- **Device** — OS, CPU cores, architecture, screen resolution, user agent, language, timezone
- **Browser / Runtime** — WebGL support, hardware concurrency, device memory, parsed user agent
- **Leak Detection** — WebRTC local IP exposure, VPN/proxy hints from ASN, header overview
- **Anonymity Analysis** — Connection type classification (Residential, VPN, Proxy, Tor, Hosting)

See [docs/FEATURES.md](docs/FEATURES.md) for full feature documentation.

---

## Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Desktop shell  | **Tauri 2** (Rust)              |
| Frontend       | **TypeScript** + **Vite**       |
| Public IP      | [ipify](https://www.ipify.org/) |
| Geo + ISP data | [IPinfo](https://ipinfo.io/)    |

---

## Getting IPInspectorZ

### Store installs (recommended for end users)

| Platform      | Store                                |
| ------------- | ------------------------------------ |
| Windows 10/11 | Microsoft Store _(listing link TBD)_ |

### Direct download (GitHub Releases)

Pre-built binaries are attached to each [GitHub Release](../../releases):

| OS      | File                                          |
| ------- | --------------------------------------------- |
| Windows | `IPInspectorZ_x64-setup.exe` (NSIS installer) |
| macOS   | `IPInspectorZ_x64.dmg`                        |
| Linux   | `IPInspectorZ_amd64.AppImage` or `.deb`       |

---

## Prerequisites (developers only)

- [Node.js](https://nodejs.org/) v18+
- [Rust](https://rustup.rs/)
- Platform-specific: [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

---

## Development

```bash
# Install dependencies
npm install

# Generate placeholder icons (first run)
npm run icons:generate

# Run desktop app in development
npm run tauri dev
```

---

## Build

```bash
# Desktop (current OS)
npm run build && npm run tauri build
```

Built artifacts are placed in `src-tauri/target/release/bundle/`.

See [docs/BUILD.md](docs/BUILD.md) for full build and code-signing instructions.

---

## Custom App Icon

1. Prepare a **512×512** or **1024×1024** square PNG/SVG.
2. From the project root:
    ```bash
    npm run icon path/to/your-icon.png
    # or: npx tauri icon ./my-logo.png
    ```
3. Icons are written to `src-tauri/icons/`. Rebuild the app to apply.

---

## Project Structure

```
IPInspectorZ/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.ts              # Entry point; loads data and renders dashboard
│   ├── styles.css
│   ├── types.ts             # Shared types
│   ├── api.ts               # ipify & IPinfo clients
│   ├── network.ts           # Public IP, geo, WebRTC local IPs
│   ├── device.ts            # Device/environment info
│   ├── fingerprint.ts       # Browser runtime & leak hints
│   └── components/
│       ├── Dashboard.ts     # Section renderers
│       ├── Section.ts       # Expandable cards
│       ├── CopyButton.ts
│       └── LoadingSpinner.ts
├── src-tauri/               # Rust / Tauri backend
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   └── src/
├── docs/
│   ├── BUILD.md
│   ├── FEATURES.md
│   └── PRIVACY.md
├── scripts/
└── README.md
```

---

## External APIs

| Service | Purpose                     | Notes                                                  |
| ------- | --------------------------- | ------------------------------------------------------ |
| ipify   | Public IPv4 / IPv6          | No key required; rate limited                          |
| IPinfo  | Geo, ISP, ASN, network type | Free tier available; optional token via `IPINFO_TOKEN` |

---

## Security & Privacy

- No hidden background services
- No file system scanning
- No data collection or telemetry
- All network requests are visible in source (`src/api.ts`, `src/network.ts`)
- Runs fully locally; no login required

Full policy: [docs/PRIVACY.md](docs/PRIVACY.md)

---

## Documentation

| Doc                                  | Description             |
| ------------------------------------ | ----------------------- |
| [docs/FEATURES.md](docs/FEATURES.md) | Full feature reference  |
| [docs/BUILD.md](docs/BUILD.md)       | Build, code signing, CI |
| [docs/PRIVACY.md](docs/PRIVACY.md)   | Privacy policy          |

---

## License

[MIT](LICENSE) — free for personal and commercial use, including distribution on Microsoft Store and other stores.
