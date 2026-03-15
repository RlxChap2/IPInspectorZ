/**
 * Risk classification and connection type from all anonymity signals.
 */

import type { ConnectionType, AnonymityRiskLevel } from '../types';
import type { AsnClassification } from './asn-analysis';

export interface RiskInput {
    torDetected: boolean;
    proxyDetected: boolean;
    asn: AsnClassification;
    webrtcMismatch: boolean;
}

export function classifyConnectionType(input: RiskInput): ConnectionType {
    if (input.torDetected) return 'Tor Exit Node';
    if (input.proxyDetected) return 'Proxy';
    if (input.asn.isVpnOrProxy) return 'VPN';
    if (input.asn.isHosting) return 'Hosting Network';
    if (input.asn.isResidential) return 'Direct Residential';
    if (input.webrtcMismatch) return 'Unknown'; // could be VPN/proxy
    return 'Unknown';
}

export function classifyRiskLevel(connectionType: ConnectionType, webrtcMismatch: boolean): AnonymityRiskLevel {
    switch (connectionType) {
        case 'Direct Residential':
            return webrtcMismatch ? 'Unknown' : 'Residential Network';
        case 'Hosting Network':
        case 'VPN':
            return 'Hosting Infrastructure';
        case 'Proxy':
        case 'Tor Exit Node':
            return 'Anonymous Network';
        default:
            return webrtcMismatch ? 'Unknown' : 'Unknown';
    }
}

export function anonymityStatus(connectionType: ConnectionType): 'Detected' | 'Not Detected' {
    switch (connectionType) {
        case 'Tor Exit Node':
        case 'Proxy':
        case 'VPN':
        case 'Hosting Network':
            return 'Detected';
        default:
            return 'Not Detected';
    }
}
