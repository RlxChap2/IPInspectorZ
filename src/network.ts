/**
 * Network module: public IP, geo, and local network detection.
 */

import { fetchPublicIPv4, fetchPublicIPv6, fetchIPinfo, IPinfoResponse } from './api';
import type { PublicIPResult, GeoIPResult, LocalNetworkInfo } from './types';

export async function getPublicIP(): Promise<PublicIPResult> {
    const [v4, v6] = await Promise.all([fetchPublicIPv4().catch(() => null), fetchPublicIPv6()]);
    const raw = v4 ?? v6 ?? '';
    return {
        ipv4: v4,
        ipv6: v6 ?? null,
        raw,
        source: 'ipify',
    };
}

function mapIPinfoToGeoIP(data: IPinfoResponse): GeoIPResult {
    const org = (data.org as string) || '';
    const asMatch = org.match(/^AS(\d+)\s/);
    return {
        ip: data.ip ?? '',
        city: data.city,
        region: data.region,
        country: data.country,
        countryCode: data.country,
        timezone: data.timezone,
        org,
        isp: org ? org.replace(/^AS\d+\s+/, '') : undefined,
        asn: asMatch ? asMatch[1] : undefined,
        as: data.org as string | undefined,
        type: data.type as string | undefined,
    };
}

export async function getGeoIP(ip?: string): Promise<GeoIPResult | null> {
    try {
        const data = await fetchIPinfo(ip);
        return mapIPinfoToGeoIP(data);
    } catch {
        return null;
    }
}

/** Detect local IPs via WebRTC ICE candidates (browser-only). */
export function getLocalIPsViaWebRTC(): Promise<LocalNetworkInfo> {
    return new Promise((resolve) => {
        const ips = new Set<string>();
        const rawCandidates: string[] = [];
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pc.createDataChannel('');
        pc.onicecandidate = (e) => {
            if (!e.candidate) {
                pc.close();
                const list = Array.from(ips);
                const hasV6 = list.some((ip) => ip.includes(':'));
                const hasV4 = list.some((ip) => !ip.includes(':'));
                let connectionType: 'IPv4' | 'IPv6' | 'dual' = 'IPv4';
                if (hasV4 && hasV6) connectionType = 'dual';
                else if (hasV6) connectionType = 'IPv6';
                resolve({
                    localIPs: list,
                    connectionType,
                    rawCandidates,
                });
                return;
            }
            const c = e.candidate;
            rawCandidates.push(c.candidate);
            const match = c.candidate.match(/^candidate:\d+\s+\d+\s+(\S+)\s+(\d+)\s+typ/);
            if (match) {
                const type = match[1];
                if (type === 'host') {
                    const addrMatch = c.candidate.match(/(\d+\.\d+\.\d+\.\d+|[0-9a-fA-F:]+)/);
                    if (addrMatch) {
                        const ip = addrMatch[1];
                        if (ip !== '0.0.0.0' && ip !== '::' && !ip.startsWith('127.')) {
                            ips.add(ip);
                        }
                    }
                }
            }
        };
        pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .catch(() => {
                pc.close();
                resolve({
                    localIPs: [],
                    connectionType: 'IPv4',
                    rawCandidates: [],
                });
            });
        setTimeout(() => {
            if (ips.size === 0) {
                pc.close();
                resolve({
                    localIPs: [],
                    connectionType: 'IPv4',
                    rawCandidates,
                });
            }
        }, 3000);
    });
}
