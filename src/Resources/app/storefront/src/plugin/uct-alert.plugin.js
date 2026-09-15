import Plugin from 'src/plugin-system/plugin.class';

export default class UctAlertPlugin extends Plugin {
    init() {
        this.closeButton = this.el.querySelector('[data-uct-alert-close]');
        this.onClose = () => this.el.remove();
        this.closeButton?.addEventListener('click', this.onClose);
    }

    destroy() {
        this.closeButton?.removeEventListener('click', this.onClose);
    }
}
