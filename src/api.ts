/**
 * External API clients for IP and geo data.
 * All endpoints are documented and used only for the stated purpose.
 *
 * APIs used:
 * - https://api.ipify.org — Public IPv4 (no key, rate limited)
 * - https://api64.ipify.org — Public IPv6
 * - https://ipinfo.io — Geo + ISP (free tier: 50k/mo)
 */

const IPIFY_V4 = 'https://api.ipify.org?format=json';
const IPIFY_V6 = 'https://api64.ipify.org?format=json';
const IPINFO_BASE = 'https://ipinfo.io';

export interface IpifyResponse {
    ip: string;
}

export async function fetchPublicIPv4(): Promise<string> {
    const res = await fetch(IPIFY_V4, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`ipify v4: ${res.status}`);
    const data = (await res.json()) as IpifyResponse;
    return data.ip;
}

export async function fetchPublicIPv6(): Promise<string | null> {
    try {
        const res = await fetch(IPIFY_V6, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        const data = (await res.json()) as IpifyResponse;
        return data.ip || null;
    } catch {
        return null;
    }
}

export interface IPinfoResponse {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
    timezone?: string;
    hostname?: string;
    [key: string]: unknown;
}

/** Optional: set IPINFO_TOKEN in env for higher rate limits. */
export async function fetchIPinfo(ip?: string): Promise<IPinfoResponse> {
    const url = ip ? `${IPINFO_BASE}/${ip}/json` : `${IPINFO_BASE}/json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`ipinfo: ${res.status}`);
    return (await res.json()) as IPinfoResponse;
}
