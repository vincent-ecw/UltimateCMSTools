import Plugin from 'src/plugin-system/plugin.class';

export default class UctReadMorePlugin extends Plugin {
    init() {
        this.button = this.el.querySelector('[data-uct-read-more-toggle]');
        this.panel = this.el.querySelector('[data-uct-read-more-panel]');
        if (!this.button || !this.panel) {
            return;
        }

        this.button.hidden = false;
        this._onClick = this._toggle.bind(this);
        this.button.addEventListener('click', this._onClick);
    }

    _toggle() {
        const expanded = this.button.getAttribute('aria-expanded') !== 'true';
        if (!expanded && this.panel.contains(document.activeElement)) {
            this.button.focus();
        }
        this.button.setAttribute('aria-expanded', String(expanded));
        this.panel.setAttribute('aria-hidden', String(!expanded));
        this.panel.inert = !expanded;
        this.el.classList.toggle('is-expanded', expanded);
        this.button.textContent = expanded ? this.button.dataset.labelLess : this.button.dataset.labelMore;
    }

    destroy() {
        this.button?.removeEventListener('click', this._onClick);
        super.destroy();
    }
}
