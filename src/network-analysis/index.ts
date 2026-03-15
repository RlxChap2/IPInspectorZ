/**
 * Connection Anonymity Analysis — orchestrator.
 * Reuses existing publicIP, geoIP, localNetwork; runs Tor list and optional
 * header check asynchronously without blocking startup.
 */

import type { AnonymityAnalysis, GeoIPResult, LocalNetworkInfo, PublicIPResult } from '../types';
import { classifyAsn } from './asn-analysis';
import { isTorExitNode } from './tor-detection';
import { detectProxyHeaders } from './proxy-detection';
import { getDnsInfo } from './dns-analysis';
import { classifyConnectionType, classifyRiskLevel, anonymityStatus } from './risk-classification';

export interface AnonymityInput {
    publicIP: PublicIPResult | null;
    geoIP: GeoIPResult | null;
    localNetwork: LocalNetworkInfo | null;
}

function webrtcMismatch(publicIp: string | null, localIPs: string[]): boolean {
    if (!publicIp || localIPs.length === 0) return false;
    const norm = (s: string) => s.trim().toLowerCase();
    const pub = norm(publicIp);
    return !localIPs.some((local) => norm(local) === pub);
}

export async function runAnonymityAnalysis(input: AnonymityInput): Promise<AnonymityAnalysis> {
    const { publicIP, geoIP, localNetwork } = input;
    const publicIp = publicIP?.raw ?? publicIP?.ipv4 ?? publicIP?.ipv6 ?? null;

    const asn = classifyAsn(geoIP?.org, geoIP?.asn ?? (geoIP?.as as string | undefined));

    const [torDetected, proxyResult] = await Promise.all([publicIp ? isTorExitNode(publicIp) : Promise.resolve(false), detectProxyHeaders()]);

    const localIPs = localNetwork?.localIPs ?? [];
    const webrtcMismatchFlag = webrtcMismatch(publicIp, localIPs);

    const riskInput = {
        torDetected,
        proxyDetected: proxyResult.proxyDetected,
        asn,
        webrtcMismatch: webrtcMismatchFlag,
    };

    const connectionType = classifyConnectionType(riskInput);
    const anonymityRiskLevel = classifyRiskLevel(connectionType, webrtcMismatchFlag);
    const anonymityStatusResult = anonymityStatus(connectionType);

    const dns = getDnsInfo();

    const orgStr = asn.organization ?? geoIP?.org ?? null;
    const providerStr = orgStr; // network provider from IPinfo org

    return {
        connectionType,
        anonymityStatus: anonymityStatusResult,
        vpnDetected: asn.isVpnOrProxy && connectionType === 'VPN',
        proxyDetected: proxyResult.proxyDetected,
        torDetected: torDetected,
        hostingNetwork: asn.isHosting,
        asn: asn.asn,
        organization: asn.organization,
        networkProvider: providerStr,
        country: geoIP?.country ?? null,
        dnsResolver: dns.resolverIp,
        dnsProvider: dns.provider,
        dnsCategory: dns.category,
        anonymityRiskLevel,
        webrtcMismatch: webrtcMismatchFlag,
    };
}
