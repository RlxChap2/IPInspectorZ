/**
 * ASN and network ownership analysis for anonymity detection.
 * Classifies by organization string from IPinfo (ASN owner).
 */

const HOSTING_PATTERNS = [
    /amazon\s*(web\s*services|aws)/i,
    /google\s*(cloud|compute)/i,
    /microsoft\s*(azure|corporation)/i,
    /digitalocean/i,
    /linode/i,
    /vultr/i,
    /ovh/i,
    /hetzner/i,
    /choopa|vpn\.com/i,
    /cloudflare/i,
    /incapsula|imperva/i,
    /akamai/i,
    /fastly/i,
    /leaseweb/i,
    /ramnode/i,
    /buyvm|frantech/i,
    /hostinger|hosting/i,
    /datacenter|data\s*center/i,
    /colocation|colo\s*/i,
    /server\s*host|dedicated\s*server/i,
    /vps\s*|virtual\s*private\s*server/i,
    /cloud\s*hosting/i,
    /aws|gcp|azure/i,
];

const VPN_PROXY_PATTERNS = [
    /vpn\s*|virtual\s*private\s*network/i,
    /proxy\s*|proxies/i,
    /tor\s*exit|tor\s*project/i,
    /nordvpn|expressvpn|surfshark|cyberghost|private\s*internet\s*access|mullvad|proton\s*vpn/i,
    /anonymous\s*vpn|anonymizer/i,
];

export interface AsnClassification {
    isHosting: boolean;
    isVpnOrProxy: boolean;
    isResidential: boolean;
    organization: string | null;
    asn: string | null;
}

export function classifyAsn(org: string | undefined, asn: string | undefined): AsnClassification {
    const orgNorm = (org ?? '').trim();
    const asnNorm = (asn ?? '').toString().trim();

    let isHosting = false;
    let isVpnOrProxy = false;

    if (orgNorm) {
        isHosting = HOSTING_PATTERNS.some((p) => p.test(orgNorm));
        isVpnOrProxy = VPN_PROXY_PATTERNS.some((p) => p.test(orgNorm));
    }

    const isResidential = !isHosting && !isVpnOrProxy && orgNorm.length > 0;

    return {
        isHosting,
        isVpnOrProxy,
        isResidential,
        organization: orgNorm || null,
        asn: asnNorm || null,
    };
}
