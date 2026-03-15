/**
 * IP Inspector Z — Entry point.
 * Loads all diagnostic data and renders the dashboard.
 */

import { buildDashboardSections, renderPublicNetwork, renderLocalNetwork, renderDevice, renderBrowser, renderLeakDetection, renderAnonymityAnalysis } from "./components/Dashboard";
import { setLoading } from './components/LoadingSpinner';
import { getPublicIP, getGeoIP, getLocalIPsViaWebRTC } from './network';
import { getDeviceInfo } from './device';
import { getBrowserRuntimeInfo, buildLeakDetection } from './fingerprint';
import { runAnonymityAnalysis } from './network-analysis';
import type { DashboardData } from './types';

const app = document.getElementById('app');
if (!app) throw new Error('No #app');

const data: DashboardData = {
    publicIP: null,
    geoIP: null,
    localNetwork: null,
    device: null,
    browser: null,
    leakDetection: null,
    anonymityAnalysis: null,
    loaded: {},
};

const sections = buildDashboardSections();

// Header
const header = document.createElement('header');
header.className = 'app-header';
header.innerHTML = `
  <h1>IP Inspector Z</h1>
  <p class="tagline">Network &amp; device diagnostics</p>
`;
app.appendChild(header);

// Container
const container = document.createElement('div');
container.className = 'dashboard-grid';
const order = ['publicIP', 'localNetwork', 'device', 'browser', 'leakDetection', 'anonymityAnalysis'];
order.forEach((key) => {
    const el = sections.get(key);
    if (el) container.appendChild(el);
});
app.appendChild(container);

async function loadPublicAndGeo(): Promise<void> {
    const section = sections.get('publicIP')!;
    setLoading(section, true);
    try {
        data.publicIP = await getPublicIP();
        data.geoIP = await getGeoIP(data.publicIP.raw || undefined);
        data.loaded.publicIP = true;
        renderPublicNetwork(section, data);
    } catch (e) {
        const body = section.querySelector('.section-body');
        if (body) body.innerHTML = `<p class="error">Failed to load: ${String(e)}</p>`;
    } finally {
        setLoading(section, false);
    }
}

async function loadLocalNetwork(): Promise<void> {
    const section = sections.get('localNetwork')!;
    setLoading(section, true);
    try {
        data.localNetwork = await getLocalIPsViaWebRTC();
        data.loaded.localNetwork = true;
        renderLocalNetwork(section, data);
    } catch (e) {
        const body = section.querySelector('.section-body');
        if (body) body.innerHTML = `<p class="error">Failed: ${String(e)}</p>`;
    } finally {
        setLoading(section, false);
    }
}

function loadDeviceAndBrowser(): void {
    data.device = getDeviceInfo();
    data.browser = getBrowserRuntimeInfo();
    data.loaded.device = true;
    data.loaded.browser = true;
    renderDevice(sections.get('device')!, data);
    renderBrowser(sections.get('browser')!, data);
}

function loadLeakDetection(): void {
    const localIPs = data.localNetwork?.localIPs ?? [];
    data.leakDetection = buildLeakDetection(localIPs, data.geoIP);
    data.loaded.leakDetection = true;
    renderLeakDetection(sections.get('leakDetection')!, data);
}

async function loadAnonymityAnalysis(): Promise<void> {
    const section = sections.get('anonymityAnalysis')!;
    setLoading(section, true);
    try {
        data.anonymityAnalysis = await runAnonymityAnalysis({
            publicIP: data.publicIP,
            geoIP: data.geoIP,
            localNetwork: data.localNetwork,
        });
        data.loaded.anonymityAnalysis = true;
        renderAnonymityAnalysis(section, data);
    } catch (e) {
        const body = section.querySelector('.section-body');
        if (body) body.innerHTML = `<p class="error">Analysis failed: ${String(e)}</p>`;
    } finally {
        setLoading(section, false);
    }
}

async function run(): Promise<void> {
    loadDeviceAndBrowser();
    await Promise.all([loadPublicAndGeo(), loadLocalNetwork()]);
    loadLeakDetection();
    await loadAnonymityAnalysis();
}

run();
