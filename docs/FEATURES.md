# IPInspectorZ — Feature Documentation

## Dashboard Sections

### 1. Public Network Information

| Field                   | Source                                     |
| ----------------------- | ------------------------------------------ |
| Public IPv4             | [ipify](https://api.ipify.org/)            |
| Public IPv6             | [ipify64](https://api64.ipify.org/)        |
| Country / Region / City | [IPinfo](https://ipinfo.io/)               |
| Timezone                | IPinfo                                     |
| ISP / Organization      | IPinfo                                     |
| ASN                     | IPinfo                                     |
| Network type            | IPinfo (e.g. hosting, mobile, residential) |

---

### 2. Local Network Details

| Field           | Method                                             |
| --------------- | -------------------------------------------------- |
| Local IPs       | WebRTC ICE candidates (host candidates only)       |
| Connection type | Detected from local addresses (IPv4 / IPv6 / dual) |

> These are the IPs that could be exposed to websites that use WebRTC, regardless of VPN usage.

---

### 3. Device Specifications

| Field             | Source                                             |
| ----------------- | -------------------------------------------------- |
| Platform / OS     | `navigator.platform`                               |
| CPU cores         | `navigator.hardwareConcurrency`                    |
| Architecture      | Inferred from user agent (e.g. x64, arm64)         |
| Screen resolution | `screen.width` / `screen.height`                   |
| User-Agent        | Browser/runtime environment                        |
| Language          | `navigator.language` / `navigator.languages`       |
| Timezone          | `Intl.DateTimeFormat().resolvedOptions().timeZone` |

---

### 4. Browser / Runtime Information

| Field                | Notes                                 |
| -------------------- | ------------------------------------- |
| WebGL support        | Renderer string if available          |
| Hardware concurrency | Same as device CPU                    |
| Device memory        | `navigator.deviceMemory` (if exposed) |
| Parsed user agent    | Browser name, version, OS             |

---

### 5. Leak Detection

| Check           | How                                             |
| --------------- | ----------------------------------------------- |
| WebRTC leak     | Whether local IPs were exposed via WebRTC       |
| Proxy hints     | IPinfo org/type (e.g. datacenter, hosting)      |
| VPN hints       | Heuristics from org name ("vpn", "proxy", etc.) |
| Header overview | User-Agent and available request headers        |

---

### 6. Connection Anonymity Analysis

| Field                       | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| Connection Type             | Direct Residential, VPN, Proxy, Tor Exit Node, Hosting Network, or Unknown   |
| Anonymity Status            | Detected / Not Detected                                                      |
| Risk Classification         | Residential Network, Hosting Infrastructure, Anonymous Network, or Unknown   |
| Network Ownership           | Provider, organization, ASN, country (from IPinfo)                           |
| DNS Information             | Resolver IP, provider, category (when available)                             |
| Detections                  | VPN, proxy, Tor exit, hosting (IPinfo + Tor Project exit list + header echo) |
| WebRTC / Public IP mismatch | Detected when public IP differs from WebRTC IPs (possible VPN routing)       |

**Data sources:** IPinfo response (ASN, org), Tor Project bulk exit list (cached), optional header-echo request (e.g. httpbin) for proxy header detection.

---

## Platform Availability

| Platform                | Status                     |
| ----------------------- | -------------------------- |
| Windows 10/11 (desktop) | Available                  |
| macOS 12+ (desktop)     | Available                  |
| Linux (desktop)         | Available (AppImage / deb) |
| Android 8.0+            | Available                  |
| iOS 16+                 | Available                  |

---

## Future Expansion

The following features are planned or under consideration. The codebase is structured so they can be added as separate modules without breaking existing functionality.

- DNS leak testing
- IPv6-only path analysis
- Latency measurement (to configurable hosts)
- Traceroute visualization
- Simple network speed test
- Stricter proxy / datacenter detection heuristics
- Store-specific UI polish for Microsoft Store / Google Play guidelines
