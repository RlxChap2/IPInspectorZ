/**
 * Browser / runtime fingerprint: WebGL, concurrency, UA parsing.
 */

import type { BrowserRuntimeInfo, LeakDetectionResult } from './types';

export function getBrowserRuntimeInfo(): BrowserRuntimeInfo {
    const nav = typeof navigator !== 'undefined' ? navigator : ({} as Navigator);
    const ua = nav.userAgent ?? '';
    let webglSupport = false;
    let webglRenderer: string | undefined;
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
        if (gl) {
            webglSupport = true;
            const debug = (gl as WebGLRenderingContext & { getExtension: (n: string) => unknown }).getExtension('WEBGL_debug_renderer_info');
            if (debug) {
                const renderer = (gl as WebGLRenderingContext & { getParameter: (p: number) => string }).getParameter(0x9246);
                webglRenderer = renderer as string;
            }
        }
    } catch {
        // ignore
    }

    const deviceMemory = (nav as Navigator & { deviceMemory?: number }).deviceMemory;

    return {
        webglSupport,
        webglRenderer,
        hardwareConcurrency: nav.hardwareConcurrency ?? 0,
        deviceMemory,
        userAgent: ua,
        parsedUA: parseUserAgent(ua),
    };
}

function parseUserAgent(ua: string): Record<string, string> {
    const out: Record<string, string> = {};
    if (/Edge\//i.test(ua)) out.browser = 'Edge';
    else if (/Edg\//i.test(ua)) out.browser = 'Edge Chromium';
    else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) out.browser = 'Chrome';
    else if (/Firefox\//i.test(ua)) out.browser = 'Firefox';
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) out.browser = 'Safari';
    else out.browser = 'Other';

    if (/Windows NT 10/i.test(ua)) out.os = 'Windows 10/11';
    else if (/Windows/i.test(ua)) out.os = 'Windows';
    else if (/Mac OS X/i.test(ua)) out.os = 'macOS';
    else if (/Linux/i.test(ua)) out.os = 'Linux';
    else out.os = 'Other';

    return out;
}

/** Build leak/proxy hints from local IPs and geo data. */
export function buildLeakDetection(localIPs: string[], geoIP: { asn?: string; org?: string; type?: string } | null): LeakDetectionResult {
    const webrtcLeak = localIPs.length > 0;
    const proxyHints: string[] = [];
    const vpnHints: string[] = [];

    const org = (geoIP?.org ?? '').toLowerCase();
    const type = (geoIP?.type ?? '').toLowerCase();
    if (type === 'hosting' || /hosting|datacenter|vps|cloud|aws|gcp|azure|digitalocean|linode|vultr/i.test(org)) {
        proxyHints.push('IP may be from a hosting/datacenter provider.');
    }
    if (/vpn|proxy|tor|exit/i.test(org)) {
        vpnHints.push('Organization name suggests VPN/proxy/Tor.');
    }

    const headers: Record<string, string> = {};
    // In browser we don't have raw request headers; we can only show what we infer.
    headers['User-Agent'] = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    return {
        webrtcLeak,
        localIPsExposed: localIPs,
        proxyHints,
        vpnHints,
        headers,
    };
}
