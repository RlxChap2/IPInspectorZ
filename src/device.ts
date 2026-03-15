/**
 * Device and environment information from browser / runtime.
 */

import type { DeviceInfo } from './types';

export function getDeviceInfo(): DeviceInfo {
    const nav = typeof navigator !== 'undefined' ? navigator : ({} as Navigator);
    const scr = typeof screen !== 'undefined' ? screen : ({} as Screen);
    const now = new Date();
    const tzOffset = -now.getTimezoneOffset();

    return {
        platform: nav.platform ?? 'unknown',
        cpuCores: nav.hardwareConcurrency ?? 0,
        architecture: getArchitecture(),
        screenWidth: scr.width ?? 0,
        screenHeight: scr.height ?? 0,
        userAgent: nav.userAgent ?? '',
        language: nav.language ?? '',
        languages: Array.isArray(nav.languages) ? [...nav.languages] : [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'unknown',
        timezoneOffset: tzOffset,
    };
}

function getArchitecture(): string {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (/Win64|WOW64|x64|x86_64/i.test(ua)) return 'x64';
    if (/Win32|WOW32/i.test(ua)) return 'x86';
    if (/arm64|aarch64/i.test(ua)) return 'arm64';
    if (/arm/i.test(ua)) return 'arm';
    if (/Macintosh|Intel Mac/i.test(ua)) return 'x64';
    return 'unknown';
}
