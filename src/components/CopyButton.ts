/**
 * Copy-to-clipboard button for IP and values.
 */

export function createCopyButton(value: string, label = 'Copy'): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = label;
    btn.title = 'Copy to clipboard';
    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(value);
            const prev = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = prev;
                btn.classList.remove('copied');
            }, 1500);
        } catch {
            btn.textContent = 'Failed';
        }
    });
    return btn;
}
