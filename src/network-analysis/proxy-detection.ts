/**
 * Proxy detection via request headers.
 * In browser we cannot see our own request headers; we use an echo service
 * to get the headers the server sees (X-Forwarded-For, Via, etc.).
 */

const HEADER_ECHO_URL = 'https://httpbin.org/headers';

const PROXY_HEADERS = ['x-forwarded-for', 'forwarded', 'via', 'client-ip', 'x-real-ip'];

export interface ProxyHeadersResult {
    proxyDetected: boolean;
    headers: Record<string, string>;
    rawForwarded: string | null;
}

export async function detectProxyHeaders(): Promise<ProxyHeadersResult> {
    const headers: Record<string, string> = {};
    let rawForwarded: string | null = null;

    try {
        const res = await fetch(HEADER_ECHO_URL, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return { proxyDetected: false, headers: {}, rawForwarded: null };
        const data = (await res.json()) as { headers?: Record<string, string> };
        const received = data.headers ?? {};
        for (const [k, v] of Object.entries(received)) {
            if (typeof v === 'string') {
                headers[k] = v;
                const lower = k.toLowerCase();
                if (PROXY_HEADERS.includes(lower)) rawForwarded = rawForwarded ? `${rawForwarded}; ${k}: ${v}` : `${k}: ${v}`;
            }
        }
        const hasProxyHeader = PROXY_HEADERS.some((h) => Object.keys(received).some((k) => k.toLowerCase() === h));
        const multipleAddresses =
            (headers['x-forwarded-for'] ?? headers['forwarded'] ?? '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean).length > 1;
        const proxyDetected = hasProxyHeader || multipleAddresses;
        return { proxyDetected, headers, rawForwarded };
    } catch {
        return { proxyDetected: false, headers: {}, rawForwarded: null };
    }
}
