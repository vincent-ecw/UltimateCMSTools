import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class SubcategoryCarouselPlugin extends Plugin {
    static options = {
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000
    };

    init() {
        try {
            this.container = DomAccess.querySelector(this.el, '.subcategory-carousel-container');
            this.prevBtn = this.options.arrows ? DomAccess.querySelector(this.el, '.subcategory-carousel-control.prev', false) : null;
            this.nextBtn = this.options.arrows ? DomAccess.querySelector(this.el, '.subcategory-carousel-control.next', false) : null;
            this.dots = this.options.dots ? DomAccess.querySelectorAll(this.el, '.subcategory-carousel-dot', false) : [];
            this.cards = DomAccess.querySelectorAll(this.container, '.subcategory-card', false);
        } catch (e) {
            return;
        }

        if (!this.cards || this.cards.length === 0) return;

        this.originalCount = this.cards.length;

        if (this.originalCount > 1) {
            this.setupClones();
            this.cards = DomAccess.querySelectorAll(this.container, '.subcategory-card', false);
            const itemWidth = this.getItemWidth();
            if (itemWidth > 0) {
                this.container.scrollLeft = this.originalCount * itemWidth;
            }
        }

        this.autoplayInterval = null;
        this._onResize = this.updateControls.bind(this);

        this.registerEvents();
        this.updateControls();
        this.startAutoplay();
    }

    setupClones() {
        if (this.container.querySelector('[data-clone]')) return;

        const originalCards = Array.from(this.cards);
        const preFragment = document.createDocumentFragment();
        const postFragment = document.createDocumentFragment();

        originalCards.forEach(card => {
            const preClone = card.cloneNode(true);
            this.cleanClone(preClone, 'pre');
            preFragment.appendChild(preClone);

            const postClone = card.cloneNode(true);
            this.cleanClone(postClone, 'post');
            postFragment.appendChild(postClone);
        });

        this.container.insertBefore(preFragment, originalCards[0]);
        this.container.appendChild(postFragment);
    }

    cleanClone(clone, type) {
        if (clone.id) clone.removeAttribute('id');
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('data-clone', type);
        clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(el => {
            el.setAttribute('tabindex', '-1');
        });
        if (clone.matches('a, button, input, select, textarea, [tabindex]')) {
            clone.setAttribute('tabindex', '-1');
        }
    }

    getItemWidth() {
        if (!this.cards || this.cards.length === 0) return 0;
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.container).gap, 10) || 20;
        return cardWidth + gap;
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
        this.container.addEventListener('scrollend', () => this.checkScrollLoop(true));
        window.addEventListener('resize', this._onResize);

        if (this.options.dots && this.dots && this.dots.length > 0) {
            this.dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    this.stopAutoplay();
                    const index = parseInt(e.target.dataset.index, 10);
                    this.scrollToIndex(index);
                    this.startAutoplay();
                });
            });
        }

        this.el.addEventListener('mouseenter', () => this.stopAutoplay());
        this.el.addEventListener('mouseleave', () => this.startAutoplay());
    }

    scrollPrev() {
        if (!this.cards || this.cards.length === 0) return;
        const itemWidth = this.getItemWidth();
        if (itemWidth <= 0) return;

        let currentIdx = Math.round(this.container.scrollLeft / itemWidth);
        if (this.originalCount && currentIdx < this.originalCount) {
            this.container.scrollLeft += this.originalCount * itemWidth;
            currentIdx += this.originalCount;
        }

        const targetScroll = (currentIdx - 1) * itemWidth;
        this.container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }

    scrollNext() {
        if (!this.cards || this.cards.length === 0) return;
        const itemWidth = this.getItemWidth();
        if (itemWidth <= 0) return;

        let currentIdx = Math.round(this.container.scrollLeft / itemWidth);
        if (this.originalCount && currentIdx >= 2 * this.originalCount) {
            this.container.scrollLeft -= this.originalCount * itemWidth;
            currentIdx -= this.originalCount;
        }

        const targetScroll = (currentIdx + 1) * itemWidth;
        this.container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }

    scrollToIndex(index) {
        if (!this.cards || this.cards.length === 0) return;
        const itemWidth = this.getItemWidth();
        if (itemWidth <= 0) return;

        const baseIndex = this.originalCount ? this.originalCount : 0;
        const targetScroll = (baseIndex + index) * itemWidth;
        this.container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }

    onScroll() {
        this.updateControls();
        this.checkScrollLoop(false);
    }

    checkScrollLoop(force = false) {
        if (!this.originalCount || this.originalCount <= 1) return;
        const itemWidth = this.getItemWidth();
        if (itemWidth <= 0) return;

        const scrollLeft = this.container.scrollLeft;
        const currentIdx = Math.round(scrollLeft / itemWidth);
        const targetOffset = currentIdx * itemWidth;

        if (force || Math.abs(scrollLeft - targetOffset) < 5) {
            if (currentIdx >= 2 * this.originalCount) {
                this.container.scrollLeft -= this.originalCount * itemWidth;
            } else if (currentIdx < this.originalCount) {
                this.container.scrollLeft += this.originalCount * itemWidth;
            }
        }
    }

    updateControls() {
        if (!this.cards || this.cards.length === 0) return;
        const itemWidth = this.getItemWidth();
        if (itemWidth <= 0) return;

        const scrollLeft = this.container.scrollLeft;
        const currentIdx = Math.round(scrollLeft / itemWidth);

        if (this.originalCount && this.originalCount <= 1) {
            if (this.prevBtn) this.prevBtn.disabled = true;
            if (this.nextBtn) this.nextBtn.disabled = true;
        } else {
            if (this.prevBtn) this.prevBtn.disabled = false;
            if (this.nextBtn) this.nextBtn.disabled = false;
        }

        if (this.options.dots && this.dots && this.dots.length > 0) {
            const N = this.originalCount || this.cards.length;
            const activeIndex = ((currentIdx % N) + N) % N;
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

        if (this.options.autoplaySpeed && this.options.autoplaySpeed > 0 && this.originalCount && this.originalCount > 1) {
            this.autoplayInterval = setInterval(() => {
                this.scrollNext();
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
