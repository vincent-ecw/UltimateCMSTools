import Plugin from 'src/plugin-system/plugin.class';

export default class SingleProductPlugin extends Plugin {
    static options = { url: '', slotId: '', errorMessage: '' };

    init() {
        this.card = this.el.querySelector('[data-single-product-card]');
        this.error = this.el.querySelector('[data-single-product-error]');
        this.onChange = this.changeVariant.bind(this);
        this.el.addEventListener('change', this.onChange);
    }

    async changeVariant(event) {
        const select = event.target.closest('[data-single-product-option]');
        if (!select || !this.el.contains(select)) return;
        const group = select.dataset.singleProductOption;
        const url = new URL(this.options.url, window.location.origin);
        url.searchParams.set('slotId', this.options.slotId);
        url.searchParams.set('switched', group);
        this.el.querySelectorAll('[data-single-product-option]').forEach(input => {
            url.searchParams.set('options[' + input.dataset.singleProductOption + ']', input.value);
        });
        this.request?.abort();
        const request = new AbortController();
        this.request = request;
        this.error.hidden = true;
        this.card.setAttribute('aria-busy', 'true');
        const controls = [...this.card.querySelectorAll('select, button')];
        const disabled = controls.map(control => control.disabled);
        controls.forEach(control => { control.disabled = true; });
        try {
            const response = await fetch(url, { signal: request.signal, headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' });
            if (!response.ok) throw new Error('Variant request failed');
            const html = await response.text();
            if (request !== this.request) return;
            const parsed = new DOMParser().parseFromString(html, 'text/html');
            const card = parsed.querySelector('.product-box');
            if (!card) throw new Error('Missing product card');
            this.card.replaceChildren(card);
            await window.PluginManager.initializePlugins();
            this.card.querySelector('[data-single-product-option="' + group + '"]')?.focus({ preventScroll: true });
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const image = this.card.querySelector('.product-image');
                const animate = () => {
                    if (request !== this.request || !image?.isConnected) return;
                    image.animate([
                        { opacity: 0, transform: 'translateY(10px) scale(.97)' },
                        { opacity: 1, transform: 'translateY(0) scale(1)' },
                    ], { duration: 300, easing: 'ease-out' });
                };
                if (image?.complete) animate();
                else image?.addEventListener('load', animate, { once: true });
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.error.textContent = this.options.errorMessage;
                this.error.hidden = false;
                // Keep the previous product and restore its selected combination.
                this.card.querySelectorAll('select').forEach(input => {
                    const selected = [...input.options].find(option => option.defaultSelected);
                    if (selected) input.value = selected.value;
                });
            }
        } finally {
            if (request === this.request) {
                this.card.removeAttribute('aria-busy');
                controls.forEach((control, index) => { control.disabled = disabled[index]; });
            }
        }
    }

    destroy() {
        this.request?.abort();
        this.el.removeEventListener('change', this.onChange);
    }
}
