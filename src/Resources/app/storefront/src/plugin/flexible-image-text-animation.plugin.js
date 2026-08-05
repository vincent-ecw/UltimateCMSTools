import Plugin from 'src/plugin-system/plugin.class';

export default class FlexibleImageTextAnimationPlugin extends Plugin {
    init() {
        this.animationType = this.el.getAttribute('data-flexible-image-text-animation') || 'none';

        if (this.animationType === 'none') {
            return;
        }

        this._registerObserver();
    }

    _registerObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.el.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(this.el);
    }
}
