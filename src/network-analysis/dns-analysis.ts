/**
 * DNS resolver identification.
 * In browser context the system DNS resolver is not exposed; we can only
 * infer or use external services that report DNS/forwarding info.
 */

export type DnsCategory = 'public' | 'ISP' | 'custom' | null;

const KNOWN_PUBLIC_DNS: Record<string, { provider: string; category: 'public' }> = {
    '1.1.1.1': { provider: 'Cloudflare DNS', category: 'public' },
    '1.0.0.1': { provider: 'Cloudflare DNS', category: 'public' },
    '8.8.8.8': { provider: 'Google Public DNS', category: 'public' },
    '8.8.4.4': { provider: 'Google Public DNS', category: 'public' },
    '9.9.9.9': { provider: 'Quad9', category: 'public' },
    '208.67.222.222': { provider: 'OpenDNS', category: 'public' },
    '208.67.220.220': { provider: 'OpenDNS', category: 'public' },
};

export interface DnsInfo {
    resolverIp: string | null;
    provider: string | null;
    category: DnsCategory;
}

/**
 * Browser cannot expose system DNS resolver. Return placeholder.
 * Could be extended with a backend that runs e.g. `nslookup` or an API
 * that returns "resolver" info for the client (if any service provides it).
 */
export function getDnsInfo(): DnsInfo {
    return {
        resolverIp: null,
        provider: null,
        category: null,
    };
}

export function classifyKnownDns(ip: string | null): { provider: string; category: DnsCategory } | null {
    if (!ip) return null;
    return KNOWN_PUBLIC_DNS[ip] ?? null;
}
