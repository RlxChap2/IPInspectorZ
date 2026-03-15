/**
 * Tor exit node detection using the Tor Project bulk exit list.
 * List: https://check.torproject.org/torbulkexitlist
 */

const TOR_EXIT_LIST_URL = 'https://check.torproject.org/torbulkexitlist';
const CACHE_MS = 30 * 60 * 1000; // 30 minutes

let cachedIps: Set<string> | null = null;
let cacheTime = 0;

function isCacheValid(): boolean {
    return cachedIps !== null && Date.now() - cacheTime < CACHE_MS;
}

export async function getTorExitList(): Promise<Set<string>> {
    if (isCacheValid() && cachedIps) return cachedIps;

    try {
        const res = await fetch(TOR_EXIT_LIST_URL, {
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return cachedIps ?? new Set();
        const text = await res.text();
        const ips = new Set(
            text
                .split(/\s+/)
                .map((s) => s.trim())
                .filter((s) => /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(s)),
        );
        cachedIps = ips;
        cacheTime = Date.now();
        return ips;
    } catch {
        return cachedIps ?? new Set();
    }
}

export async function isTorExitNode(ip: string): Promise<boolean> {
    if (!ip || ip.includes(':')) return false; // list is IPv4 only
    const set = await getTorExitList();
    return set.has(ip);
}
