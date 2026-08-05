import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class CustomCarouselPlugin extends Plugin {
    static options = {
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        highlightActiveItem: false
    };

    init() {
        try {
            this.container = DomAccess.querySelector(this.el, '.custom-carousel-container');
            this.prevBtn = this.options.arrows ? DomAccess.querySelector(this.el, '.custom-carousel-control.prev', false) : null;
            this.nextBtn = this.options.arrows ? DomAccess.querySelector(this.el, '.custom-carousel-control.next', false) : null;
            this.dots = this.options.dots ? DomAccess.querySelectorAll(this.el, '.custom-carousel-dot', false) : [];
            this.cards = DomAccess.querySelectorAll(this.container, '.custom-card', false);
        } catch (e) {
            return;
        }

        if (!this.cards || this.cards.length === 0) return;

        this.originalCount = this.cards.length;
        this.currentCardIndex = 0;

        if (this.originalCount > 1) {
            this.setupClones();
            this.cards = DomAccess.querySelectorAll(this.container, '.custom-card', false);
            this.currentCardIndex = 2 * this.originalCount;
            this.scrollToCard(this.currentCardIndex, false);
        } else {
            this.scrollToCard(0, false);
        }

        this.autoplayInterval = null;
        this._onResize = () => {
            this.scrollToCard(this.currentCardIndex, false);
            this.updateControls();
        };

        this.registerEvents();
        this.updateControls();
        this.startAutoplay();
    }

    setupClones() {
        if (this.container.querySelector('[data-clone]')) return;

        const originalCards = Array.from(this.cards);
        const preFragment = document.createDocumentFragment();
        const postFragment = document.createDocumentFragment();

        [1, 2].forEach(() => {
            originalCards.forEach(card => {
                const preClone = card.cloneNode(true);
                this.cleanClone(preClone, 'pre');
                preFragment.appendChild(preClone);
            });
        });

        [1, 2].forEach(() => {
            originalCards.forEach(card => {
                const postClone = card.cloneNode(true);
                this.cleanClone(postClone, 'post');
                postFragment.appendChild(postClone);
            });
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

    scrollToCard(index, smooth = true) {
        if (!this.cards || !this.cards[index]) return;
        this.currentCardIndex = index;
        const card = this.cards[index];
        const containerWidth = this.container.clientWidth;
        const targetScroll = card.offsetLeft - (containerWidth / 2) + (card.offsetWidth / 2);

        this.container.scrollTo({
            left: Math.max(0, targetScroll),
            behavior: smooth ? 'smooth' : 'auto'
        });
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
                    const targetIndex = (this.originalCount * 2) + index;
                    this.scrollToCard(targetIndex, true);
                    this.startAutoplay();
                });
            });
        }

        this.el.addEventListener('mouseenter', () => this.stopAutoplay());
        this.el.addEventListener('mouseleave', () => this.startAutoplay());
    }

    scrollPrev() {
        if (!this.cards || this.cards.length === 0) return;
        this.scrollToCard(this.currentCardIndex - 1, true);
    }

    scrollNext() {
        if (!this.cards || this.cards.length === 0) return;
        this.scrollToCard(this.currentCardIndex + 1, true);
    }

    onScroll() {
        this.updateControls();
        this.checkScrollLoop(false);
    }

    getClosestCardIndex() {
        if (!this.cards || this.cards.length === 0) return 0;
        const containerCenter = this.container.scrollLeft + (this.container.clientWidth / 2);
        let minDiff = Infinity;
        let closestIndex = 0;

        this.cards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const diff = Math.abs(containerCenter - cardCenter);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    checkScrollLoop(force = false) {
        if (!this.originalCount || this.originalCount <= 1) return;
        const N = this.originalCount;
        const closestIndex = this.getClosestCardIndex();

        if (closestIndex >= 3 * N) {
            const jumpIndex = closestIndex - N;
            this.scrollToCard(jumpIndex, false);
        } else if (closestIndex < 2 * N) {
            const jumpIndex = closestIndex + N;
            this.scrollToCard(jumpIndex, false);
        }
    }

    updateControls() {
        if (!this.cards || this.cards.length === 0) return;

        const N = this.originalCount || this.cards.length;
        const closestIndex = this.getClosestCardIndex();
        this.currentCardIndex = closestIndex;
        const activeIndex = ((closestIndex % N) + N) % N;

        if (this.options.dots && this.dots && this.dots.length > 0) {
            this.dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        if (this.cards && this.cards.length > 0) {
            this.cards.forEach((card, index) => {
                if (index === closestIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
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
