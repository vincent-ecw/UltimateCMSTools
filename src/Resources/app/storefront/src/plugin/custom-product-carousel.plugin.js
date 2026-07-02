import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class CustomProductCarouselPlugin extends Plugin {
    static options = {
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000
    };

    init() {
        try {
            this.container = DomAccess.querySelector(this.el, '.custom-product-carousel-container');
            this.prevBtn = this.options.arrows ? DomAccess.querySelector(this.el, '.custom-product-carousel-control.prev') : null;
            this.nextBtn = this.options.arrows ? DomAccess.querySelector(this.el, '.custom-product-carousel-control.next') : null;
            this.dots = this.options.dots ? DomAccess.querySelectorAll(this.el, '.custom-product-carousel-dot') : [];
            this.cards = DomAccess.querySelectorAll(this.container, '.product-slider-item');
        } catch (e) {
            return;
        }

        this.autoplayInterval = null;
        this._onResize = this.updateControls.bind(this);

        this.registerEvents();
        this.updateControls();
        this.startAutoplay();
    }

    registerEvents() {
        if (this.options.arrows) {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.stopAutoplay();
                    this.scrollPrev();
                    this.startAutoplay();
                });
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.stopAutoplay();
                    this.scrollNext();
                    this.startAutoplay();
                });
            }
        }

        this.container.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        window.addEventListener('resize', this._onResize);

        if (this.options.dots && this.dots.length > 0) {
            this.dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    this.stopAutoplay();
                    const index = parseInt(e.target.dataset.index, 10);
                    this.scrollToIndex(index);
                    this.startAutoplay();
                });
            });
        }

        // Pause on hover
        this.el.addEventListener('mouseenter', () => this.stopAutoplay());
        this.el.addEventListener('mouseleave', () => this.startAutoplay());
    }

    scrollPrev() {
        if (this.cards.length === 0) return;
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.container).gap) || 20;
        this.container.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }

    scrollNext() {
        if (this.cards.length === 0) return;
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.container).gap) || 20;
        this.container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }

    scrollToIndex(index) {
        if (this.cards[index]) {
            const cardWidth = this.cards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(this.container).gap) || 20;
            const targetScroll = index * (cardWidth + gap);
            this.container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    }

    onScroll() {
        this.updateControls();
    }

    updateControls() {
        if (this.cards.length === 0) return;
        
        const scrollLeft = this.container.scrollLeft;
        const maxScroll = this.container.scrollWidth - this.container.clientWidth;
        
        if (this.prevBtn) {
            this.prevBtn.disabled = scrollLeft <= 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = scrollLeft >= (maxScroll - 1);
        }

        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.container).gap) || 20;
        const itemWidth = cardWidth + gap;
        
        const activeIndex = Math.round(scrollLeft / itemWidth);

        if (this.options.dots && this.dots.length > 0) {
            this.dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    startAutoplay() {
        if (!this.options.autoplay) return;
        this.stopAutoplay();

        if (this.options.autoplaySpeed && this.options.autoplaySpeed > 0 && this.cards.length > 1) {
            this.autoplayInterval = setInterval(() => {
                const scrollLeft = this.container.scrollLeft;
                const maxScroll = this.container.scrollWidth - this.container.clientWidth;
                
                if (scrollLeft >= (maxScroll - 1)) {
                    this.container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    this.scrollNext();
                }
            }, this.options.autoplaySpeed);
        }
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this.stopAutoplay();
        window.removeEventListener('resize', this._onResize);
    }
}
