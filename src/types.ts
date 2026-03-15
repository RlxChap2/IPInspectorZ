/** Shared types for IP Inspector Z */

export interface PublicIPResult {
    ipv4: string | null;
    ipv6: string | null;
    raw: string;
    source: string;
}

export interface GeoIPResult {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    timezone?: string;
    isp?: string;
    org?: string;
    asn?: string;
    as?: string;
    type?: string; // mobile, hosting, etc.
    [key: string]: unknown;
}

export interface LocalNetworkInfo {
    localIPs: string[];
    connectionType: 'IPv4' | 'IPv6' | 'dual';
    rawCandidates?: string[];
}

export interface DeviceInfo {
    platform: string;
    cpuCores: number;
    architecture: string;
    screenWidth: number;
    screenHeight: number;
    userAgent: string;
    language: string;
    languages: string[];
    timezone: string;
    timezoneOffset: number;
}

export interface BrowserRuntimeInfo {
    webglSupport: boolean;
    webglRenderer?: string;
    hardwareConcurrency: number;
    deviceMemory?: number;
    userAgent: string;
    parsedUA?: Record<string, string>;
}

export interface LeakDetectionResult {
    webrtcLeak: boolean;
    localIPsExposed: string[];
    proxyHints: string[];
    vpnHints: string[];
    headers: Record<string, string>;
}

/** Connection anonymity analysis result */
export type ConnectionType = 'Direct Residential' | 'VPN' | 'Proxy' | 'Tor Exit Node' | 'Hosting Network' | 'Unknown';

export type AnonymityRiskLevel = 'Residential Network' | 'Hosting Infrastructure' | 'Anonymous Network' | 'Unknown';

export interface AnonymityAnalysis {
    connectionType: ConnectionType;
    anonymityStatus: 'Detected' | 'Not Detected';
    vpnDetected: boolean;
    proxyDetected: boolean;
    torDetected: boolean;
    hostingNetwork: boolean;
    asn: string | null;
    organization: string | null;
    networkProvider: string | null;
    country: string | null;
    dnsResolver: string | null;
    dnsProvider: string | null;
    dnsCategory: 'public' | 'ISP' | 'custom' | null;
    anonymityRiskLevel: AnonymityRiskLevel;
    webrtcMismatch: boolean; // public IP differs from WebRTC local → possible VPN/proxy
}

export interface DashboardData {
    publicIP: PublicIPResult | null;
    geoIP: GeoIPResult | null;
    localNetwork: LocalNetworkInfo | null;
    device: DeviceInfo | null;
    browser: BrowserRuntimeInfo | null;
    leakDetection: LeakDetectionResult | null;
    anonymityAnalysis: AnonymityAnalysis | null;
    loaded: Partial<Record<keyof Omit<DashboardData, 'loaded'>, boolean>>;
}
