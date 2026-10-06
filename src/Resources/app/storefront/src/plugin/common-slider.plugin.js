import Plugin from 'src/plugin-system/plugin.class';

export default class CommonSliderPlugin extends Plugin {
    static options = { effect: 'slide', arrows: true, dots: true, autoplay: true, autoplaySpeed: 5000 };

    init() {
        this.currentIndex = 0;
        this.items = Array.from(this.el.querySelectorAll('.common-slider-item'));
        this.dots = Array.from(this.el.querySelectorAll('.common-slider-dot'));
        this.wrapper = this.el.querySelector('.common-slider-wrapper');
        this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.keyboardStopped = false;
        this.hovered = false;
        this.listeners = [];
        this.el.setAttribute('data-effect', this.options.effect);
        this._syncState();
        this._listen(this.el.querySelector('.common-slider-prev'), 'click', () => this.prev());
        this._listen(this.el.querySelector('.common-slider-next'), 'click', () => this.next());
        this.dots.forEach((dot, index) => this._listen(dot, 'click', () => this.goTo(index)));
        this._listen(this.el, 'focusin', () => {
            this.keyboardStopped = true;
            this._stopAutoplay();
        });
        this._listen(this.el, 'mouseenter', () => { this.hovered = true; this._stopAutoplay(); });
        this._listen(this.el, 'mouseleave', () => { this.hovered = false; this._startAutoplay(); });
        this._listen(this.motion, 'change', () => {
            this._finishTransition();
            this._startAutoplay();
        });
        this._listen(document, 'visibilitychange', () => this._startAutoplay());
        this._startAutoplay();
    }

    _listen(target, event, callback) {
        if (!target) return;
        target.addEventListener(event, callback);
        this.listeners.push(() => target.removeEventListener(event, callback));
    }

    _startAutoplay() {
        this._stopAutoplay();
        if (!this.options.autoplay || this.options.autoplaySpeed <= 0 || this.items.length < 2 ||
            this.motion.matches || this.keyboardStopped || this.hovered || document.hidden) return;
        this.wrapper.setAttribute('aria-live', 'off');
        this.autoplayInterval = window.setInterval(() => this.next(), this.options.autoplaySpeed);
    }

    _stopAutoplay() {
        window.clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
        this.wrapper?.setAttribute('aria-live', 'polite');
    }

    _syncState() {
        this.items.forEach((item, index) => {
            const active = index === this.currentIndex;
            item.inert = !active;
            item.setAttribute('aria-hidden', String(!active));
        });
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
            dot.setAttribute('aria-current', String(index === this.currentIndex));
        });
    }

    _finishTransition() {
        window.clearTimeout(this.transitionTimeout);
        this.items.forEach((item, index) => {
            item.classList.remove('prev', 'slide-to-right', 'slide-from-left');
            item.classList.toggle('active', index === this.currentIndex);
        });
        this.transitioning = false;
    }

    next() { this.goTo((this.currentIndex + 1) % this.items.length, 'next'); }
    prev() { this.goTo((this.currentIndex + this.items.length - 1) % this.items.length, 'prev'); }

    goTo(index, direction = null) {
        if (!Number.isInteger(index) || index < 0 || index >= this.items.length ||
            index === this.currentIndex || this.transitioning) return;
        const current = this.items[this.currentIndex];
        const next = this.items[index];
        direction = direction || (index > this.currentIndex ? 'next' : 'prev');
        this.currentIndex = index;
        this._syncState();
        if (this.options.effect === 'slide' && !this.motion.matches) {
            this.transitioning = true;
            next.classList.add('prev', direction === 'next' ? 'slide-to-right' : 'slide-from-left');
            void next.offsetWidth;
            next.classList.remove('slide-to-right', 'slide-from-left');
            this.transitionTimeout = window.setTimeout(() => this._finishTransition(), 600);
        } else {
            current.classList.remove('active');
            next.classList.add('active');
        }
    }

    destroy() {
        this._stopAutoplay();
        window.clearTimeout(this.transitionTimeout);
        this.listeners.forEach(remove => remove());
    }
}
