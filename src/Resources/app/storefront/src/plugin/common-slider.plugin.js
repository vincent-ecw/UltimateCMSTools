import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class CommonSliderPlugin extends Plugin {
    static options = {
        effect: 'slide',
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000
    };

    init() {
        this.currentIndex = 0;
        this.items = this.el.querySelectorAll('.common-slider-item');
        
        if (this.items.length <= 1) {
            this.options.arrows = false;
            this.options.dots = false;
            this.options.autoplay = false;
        }

        if (this.options.autoplaySpeed <= 0) {
            this.options.autoplay = false;
        }

        if (this.items.length > 0) {
            this.items[0].classList.add('active');
            this.el.setAttribute('data-effect', this.options.effect);
        }

        this._registerEvents();
        
        if (this.options.autoplay) {
            this._startAutoplay();
        }
    }

    _registerEvents() {
        if (this.options.arrows) {
            const prevBtn = this.el.querySelector('.common-slider-prev');
            const nextBtn = this.el.querySelector('.common-slider-next');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this._stopAutoplay();
                    this.prev();
                    this._startAutoplay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this._stopAutoplay();
                    this.next();
                    this._startAutoplay();
                });
            }
        }

        if (this.options.dots) {
            const dots = this.el.querySelectorAll('.common-slider-dot');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this._stopAutoplay();
                    this.goTo(index);
                    this._startAutoplay();
                });
            });
        }
        
        // Pause on hover
        this.el.addEventListener('mouseenter', () => this._stopAutoplay());
        this.el.addEventListener('mouseleave', () => this._startAutoplay());
    }

    _startAutoplay() {
        if (!this.options.autoplay) return;
        this._stopAutoplay();
        
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.options.autoplaySpeed);
    }

    _stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this._stopAutoplay();
    }

    next() {
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.items.length) {
            nextIndex = 0;
        }
        this.goTo(nextIndex, 'next');
    }

    prev() {
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.items.length - 1;
        }
        this.goTo(prevIndex, 'prev');
    }

    goTo(index, direction = null) {
        if (index === this.currentIndex) return;

        const currentItem = this.items[this.currentIndex];
        const nextItem = this.items[index];

        if (this.options.effect === 'slide') {
            // Determine direction based on index if not provided
            if (!direction) {
                direction = index > this.currentIndex ? 'next' : 'prev';
            }
            
            // Setup for transition
            nextItem.classList.add('prev');
            if (direction === 'next') {
                nextItem.classList.add('slide-to-right');
            } else {
                nextItem.classList.add('slide-from-left');
            }
            
            // Force reflow
            void nextItem.offsetWidth;
            
            // Start transition
            nextItem.classList.remove('slide-to-right', 'slide-from-left');
            
            setTimeout(() => {
                currentItem.classList.remove('active');
                nextItem.classList.remove('prev');
                nextItem.classList.add('active');
            }, 600); // match CSS transition duration
        } else {
            currentItem.classList.remove('active');
            nextItem.classList.add('active');
        }

        this.currentIndex = index;
        this._updateDots();
    }

    _updateDots() {
        if (!this.options.dots) return;
        
        const dots = this.el.querySelectorAll('.common-slider-dot');
        dots.forEach((dot, idx) => {
            if (idx === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}
