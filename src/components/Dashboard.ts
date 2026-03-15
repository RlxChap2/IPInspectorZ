/**
 * Dashboard UI: builds all sections and fills them with data.
 */

import { createSection, addRow, setSectionRaw } from './Section';
import { createCopyButton } from './CopyButton';
import type { DashboardData } from '../types';

export function buildDashboardSections(): Map<string, HTMLElement> {
    const sections = new Map<string, HTMLElement>();

    const publicNet = createSection({
        title: 'Public Network Information',
        id: 'public-network',
        rawLabel: 'Raw API response',
    });
    sections.set('publicIP', publicNet);

    const localNet = createSection({
        title: 'Local Network Details',
        id: 'local-network',
        rawLabel: 'Raw ICE candidates',
    });
    sections.set('localNetwork', localNet);

    const device = createSection({
        title: 'Device Specifications',
        id: 'device',
        rawLabel: 'Device info JSON',
    });
    sections.set('device', device);

    const browser = createSection({
        title: 'Browser / Runtime Information',
        id: 'browser',
        rawLabel: 'Runtime info JSON',
    });
    sections.set('browser', browser);

    const leak = createSection({
        title: 'Leak Detection Results',
        id: 'leak-detection',
        rawLabel: 'Headers & hints',
    });
    sections.set('leakDetection', leak);

    const anonymity = createSection({
        title: 'Connection Anonymity Analysis',
        id: 'anonymity-analysis',
        rawLabel: 'Anonymity analysis JSON',
    });
    sections.set('anonymityAnalysis', anonymity);

    return sections;
}

export function renderPublicNetwork(section: HTMLElement, data: DashboardData): void {
    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = '';

    const pub = data.publicIP;
    if (!pub) return;

    const primary = pub.ipv4 ?? pub.ipv6 ?? pub.raw;
    if (primary) {
        const row = document.createElement('div');
        row.className = 'info-row highlight';
        const lbl = document.createElement('span');
        lbl.className = 'info-label';
        lbl.textContent = 'Public IP';
        const val = document.createElement('span');
        val.className = 'info-value mono';
        val.textContent = primary;
        row.appendChild(lbl);
        row.appendChild(val);
        row.appendChild(createCopyButton(primary));
        body.appendChild(row);
    }

    if (pub.ipv4) addRow(body, 'IPv4', pub.ipv4, true);
    if (pub.ipv6) addRow(body, 'IPv6', pub.ipv6, true);

    const geo = data.geoIP;
    if (geo) {
        addRow(body, 'ISP / Org', geo.org ?? geo.isp);
        addRow(body, 'ASN', geo.asn ?? geo.as);
        addRow(body, 'Country', geo.country);
        addRow(body, 'Region', geo.region);
        addRow(body, 'City', geo.city);
        addRow(body, 'Timezone', geo.timezone);
        addRow(body, 'Network type', geo.type);
    }

    const raw = data.geoIP ? JSON.stringify(data.geoIP, null, 2) : data.publicIP ? JSON.stringify(data.publicIP, null, 2) : '';
    setSectionRaw(section, raw || '');
}

export function renderLocalNetwork(section: HTMLElement, data: DashboardData): void {
    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = '';

    const loc = data.localNetwork;
    if (!loc) return;

    addRow(body, 'Connection', loc.connectionType);
    if (loc.localIPs.length > 0) {
        loc.localIPs.forEach((ip) => {
            const row = document.createElement('div');
            row.className = 'info-row';
            const lbl = document.createElement('span');
            lbl.className = 'info-label';
            lbl.textContent = 'Local IP';
            const val = document.createElement('span');
            val.className = 'info-value mono';
            val.textContent = ip;
            row.appendChild(lbl);
            row.appendChild(val);
            row.appendChild(createCopyButton(ip));
            body.appendChild(row);
        });
    } else {
        addRow(body, 'Local IPs', 'None detected (or WebRTC blocked)');
    }

    if (loc.rawCandidates?.length) {
        setSectionRaw(section, loc.rawCandidates.join('\n'));
    }
}

export function renderDevice(section: HTMLElement, data: DashboardData): void {
    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = '';

    const dev = data.device;
    if (!dev) return;

    addRow(body, 'Platform', dev.platform);
    addRow(body, 'CPU cores', dev.cpuCores);
    addRow(body, 'Architecture', dev.architecture);
    addRow(body, 'Screen', `${dev.screenWidth} × ${dev.screenHeight}`);
    addRow(body, 'Language', dev.language);
    addRow(body, 'Languages', dev.languages.join(', '));
    addRow(body, 'Timezone', dev.timezone);
    addRow(body, 'UTC offset', `${dev.timezoneOffset >= 0 ? '+' : ''}${dev.timezoneOffset} min`);
    const uaRow = document.createElement('div');
    uaRow.className = 'info-row';
    const uaLbl = document.createElement('span');
    uaLbl.className = 'info-label';
    uaLbl.textContent = 'User-Agent';
    const uaVal = document.createElement('span');
    uaVal.className = 'info-value mono small';
    uaVal.textContent = dev.userAgent;
    uaRow.appendChild(uaLbl);
    uaRow.appendChild(uaVal);
    uaRow.appendChild(createCopyButton(dev.userAgent));
    body.appendChild(uaRow);

    setSectionRaw(section, JSON.stringify(dev, null, 2));
}

export function renderBrowser(section: HTMLElement, data: DashboardData): void {
    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = '';

    const br = data.browser;
    if (!br) return;

    addRow(body, 'WebGL', br.webglSupport ? 'Yes' : 'No');
    if (br.webglRenderer) addRow(body, 'WebGL renderer', br.webglRenderer);
    addRow(body, 'Hardware concurrency', br.hardwareConcurrency);
    if (br.deviceMemory != null) addRow(body, 'Device memory (approx)', `${br.deviceMemory} GB`);
    if (br.parsedUA) {
        addRow(body, 'Browser (parsed)', br.parsedUA.browser ?? '—');
        addRow(body, 'OS (parsed)', br.parsedUA.os ?? '—');
    }

    setSectionRaw(section, JSON.stringify(br, null, 2));
}

export function renderLeakDetection(section: HTMLElement, data: DashboardData): void {
    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = '';

    const leak = data.leakDetection;
    if (!leak) return;

    addRow(body, 'WebRTC local IPs exposed', leak.webrtcLeak ? 'Yes' : 'No');
    if (leak.localIPsExposed.length > 0) {
        addRow(body, 'Exposed IPs', leak.localIPsExposed.join(', '));
    }
    if (leak.proxyHints.length > 0) {
        const div = document.createElement('div');
        div.className = 'info-row';
        div.innerHTML = `<span class="info-label">Proxy hints</span><span class="info-value">${leak.proxyHints.join(' ')}</span>`;
        body.appendChild(div);
    }
    if (leak.vpnHints.length > 0) {
        const div = document.createElement('div');
        div.className = 'info-row';
        div.innerHTML = `<span class="info-label">VPN hints</span><span class="info-value">${leak.vpnHints.join(' ')}</span>`;
        body.appendChild(div);
    }
    const headersStr = Object.entries(leak.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    setSectionRaw(section, headersStr || 'No request headers available (browser context).');
}

export function renderAnonymityAnalysis(section: HTMLElement, data: DashboardData): void {
    const body = section.querySelector('.section-body');
    if (!body) return;

    const a = data.anonymityAnalysis;
    if (!a) return;

    body.innerHTML = '';

    addRow(body, 'Connection Type', a.connectionType);
    addRow(body, 'Anonymity Status', a.anonymityStatus);
    addRow(body, 'Risk Classification', a.anonymityRiskLevel);

    const netDiv = document.createElement('div');
    netDiv.className = 'info-block';
    const netTitle = document.createElement('div');
    netTitle.className = 'info-block-title';
    netTitle.textContent = 'Network Ownership';
    netDiv.appendChild(netTitle);
    addRow(netDiv, 'Provider', a.networkProvider);
    addRow(netDiv, 'Organization', a.organization);
    addRow(netDiv, 'ASN', a.asn);
    addRow(netDiv, 'Country', a.country);
    body.appendChild(netDiv);

    const dnsDiv = document.createElement('div');
    dnsDiv.className = 'info-block';
    const dnsTitle = document.createElement('div');
    dnsTitle.className = 'info-block-title';
    dnsTitle.textContent = 'DNS Information';
    dnsDiv.appendChild(dnsTitle);
    addRow(dnsDiv, 'Resolver IP', a.dnsResolver ?? '—');
    addRow(dnsDiv, 'Resolver Provider', a.dnsProvider ?? '—');
    addRow(dnsDiv, 'Resolver Category', a.dnsCategory ?? '—');
    body.appendChild(dnsDiv);

    addRow(body, 'VPN detected', a.vpnDetected ? 'Yes' : 'No');
    addRow(body, 'Proxy detected', a.proxyDetected ? 'Yes' : 'No');
    addRow(body, 'Tor exit node', a.torDetected ? 'Yes' : 'No');
    addRow(body, 'Hosting network', a.hostingNetwork ? 'Yes' : 'No');
    addRow(body, 'WebRTC / public IP mismatch', a.webrtcMismatch ? 'Yes (possible VPN/proxy)' : 'No');

    setSectionRaw(section, JSON.stringify(a, null, 2));
}
