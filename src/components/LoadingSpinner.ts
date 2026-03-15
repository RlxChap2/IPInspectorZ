/**
 * Inline loading indicator.
 */

export function createSpinner(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'loading-spinner';
    el.setAttribute('aria-label', 'Loading');
    return el;
}

export function setLoading(section: HTMLElement, loading: boolean): void {
    const content = section.querySelector('.section-body');
    if (!content) return;
    let spinner = content.querySelector('.loading-spinner');
    if (loading) {
        if (!spinner) {
            spinner = createSpinner();
            content.innerHTML = '';
            content.appendChild(spinner);
        }
    } else if (spinner) {
        spinner.remove();
    }
}
