/**
 * Expandable section card for dashboard panels.
 */

import { createCopyButton } from './CopyButton';

export interface SectionOptions {
    title: string;
    id: string;
    rawContent?: string;
    rawLabel?: string;
}

export function createSection(opts: SectionOptions): HTMLElement {
    const section = document.createElement('section');
    section.className = 'dashboard-section';
    section.id = opts.id;

    const header = document.createElement('div');
    header.className = 'section-header';
    const title = document.createElement('h2');
    title.textContent = opts.title;
    header.appendChild(title);

    const content = document.createElement('div');
    content.className = 'section-content';

    const body = document.createElement('div');
    body.className = 'section-body';

    content.appendChild(body);
    section.appendChild(header);
    section.appendChild(content);

    if (opts.rawContent !== undefined && opts.rawContent !== '') {
        const expand = document.createElement('details');
        expand.className = 'raw-expand';
        const summary = document.createElement('summary');
        summary.textContent = opts.rawLabel ?? 'Raw data';
        const pre = document.createElement('pre');
        pre.textContent = opts.rawContent;
        expand.appendChild(summary);
        expand.appendChild(pre);
        content.appendChild(expand);
    }

    return section;
}

export function addRow(parent: Element, label: string, value: string | number | null | undefined, copyable = false): void {
    const row = document.createElement('div');
    row.className = 'info-row';
    const lbl = document.createElement('span');
    lbl.className = 'info-label';
    lbl.textContent = label;
    const val = document.createElement('span');
    val.className = 'info-value';
    val.textContent = value == null ? '—' : String(value);
    row.appendChild(lbl);
    row.appendChild(val);
    if (copyable && value != null && String(value).trim() !== '') {
        const copyBtn = createCopyButton(String(value));
        row.appendChild(copyBtn);
    }
    parent.appendChild(row);
}

export function setSectionBody(section: HTMLElement, htmlOrElement: string | HTMLElement): void {
    const body = section.querySelector('.section-body');
    if (!body) return;
    body.innerHTML = '';
    if (typeof htmlOrElement === 'string') {
        body.innerHTML = htmlOrElement;
    } else {
        body.appendChild(htmlOrElement);
    }
}

export function setSectionRaw(section: HTMLElement, rawContent: string): void {
    let details = section.querySelector('.raw-expand');
    if (!details) {
        details = document.createElement('details');
        details.className = 'raw-expand';
        const summary = document.createElement('summary');
        summary.textContent = 'Raw data';
        const pre = document.createElement('pre');
        details.appendChild(summary);
        details.appendChild(pre);
        section.querySelector('.section-content')?.appendChild(details);
    }
    const pre = details.querySelector('pre');
    if (pre) pre.textContent = rawContent;
}
