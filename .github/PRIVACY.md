# Privacy Policy — IPInspectorZ

**Last updated:** March 2026

---

## Summary

IPInspectorZ is a **local-first** diagnostic tool. It does not require an account, does not send your data to our servers, and does not collect telemetry. This policy applies to all versions of IPInspectorZ, including the direct download.

---

## Data Processed on Your Device

All data displayed by IPInspectorZ is processed **locally on your device**. Specifically:

| Data                     | What happens                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Public IP address**    | Fetched from third-party APIs (ipify, IPinfo) to show your public address. This is the same data any website can see when you visit it.     |
| **Local/private IPs**    | Detected via WebRTC in the app's WebView — on your device only. Not transmitted to us.                                                      |
| **Device & system info** | OS, screen size, language, user agent, etc. are read from your environment and displayed in the app UI only. Not transmitted to developers. |

---

## Third-Party Services

When you use IPInspectorZ, it contacts the following services on your behalf:

| Service                                    | What is sent                                  | Purpose                                         |
| ------------------------------------------ | --------------------------------------------- | ----------------------------------------------- |
| **ipify** (api.ipify.org, api64.ipify.org) | Your public IP request (no other identifiers) | Returns your public IPv4 / IPv6                 |
| **IPinfo** (ipinfo.io)                     | Your public IP address                        | Returns geographic and ISP/ASN data for that IP |
| **Google STUN** (stun.l.google.com)        | Standard WebRTC signaling                     | Discovers local IP addresses via WebRTC ICE     |

No audio, video, or custom data is sent over WebRTC. We do not control these third-party services — their own privacy policies apply.

---

## What We Do Not Do

- We do **not** collect, store, or analyze your data on our servers.
- We do **not** use analytics, advertising SDKs, tracking, or telemetry.
- We do **not** scan your files or run hidden background services.
- We do **not** require a login or any personal information.
- We do **not** share or sell any data.

---

## Store-Specific Notes

IPInspectorZ is distributed through the direct download. In each case:

- No store-specific analytics or advertising identifiers are used by the app.
- The app does not request any device permissions beyond what is needed to display network information.
- No in-app purchases or subscriptions collect financial data.

---

## Open Source & Transparency

IPInspectorZ is open source. All network requests and data usage are visible in the code (`src/api.ts`, `src/network.ts`). You can build and run the app yourself to verify behavior. See the [project repository](../../) for source code.

---

## Children's Privacy

IPInspectorZ does not knowingly collect any personal information from children under 13 (or applicable local age threshold). The app collects no personal data from any user.

---

## Changes to This Policy

Any important change to how data is used will be reflected in this document and in the repository (e.g. changelog or release notes). The "Last updated" date at the top will be updated accordingly.

---

## Contact

For privacy-related questions, please open an issue in the project repository or contact the developer through the app's store listing page.
