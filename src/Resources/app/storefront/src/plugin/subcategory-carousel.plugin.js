import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class SubcategoryCarouselPlugin extends Plugin {
    init() {
        try {
            this.container = DomAccess.querySelector(this.el, '.subcategory-carousel-container');
            this.prevBtn = DomAccess.querySelector(this.el, '.subcategory-carousel-control.prev');
            this.nextBtn = DomAccess.querySelector(this.el, '.subcategory-carousel-control.next');
            this.dots = DomAccess.querySelectorAll(this.el, '.subcategory-carousel-dot');
            this.cards = DomAccess.querySelectorAll(this.container, '.subcategory-card');
        } catch (e) {
            return;
        }

        this.registerEvents();
        this.updateControls();
    }

    registerEvents() {
        this.prevBtn.addEventListener('click', this.scrollPrev.bind(this));
        this.nextBtn.addEventListener('click', this.scrollNext.bind(this));
        this.container.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        
        // Update controls on resize as the number of visible cards changes
        window.addEventListener('resize', this.updateControls.bind(this));

        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index, 10);
                this.scrollToIndex(index);
            });
        });
    }

    scrollPrev() {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.container).gap) || 20;
        this.container.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }

    scrollNext() {
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
        // Throttle or requestAnimationFrame could be added if performance is an issue
        this.updateControls();
    }

    updateControls() {
        const scrollLeft = this.container.scrollLeft;
        const maxScroll = this.container.scrollWidth - this.container.clientWidth;
        
        // Tolerance for floating point pixel values
        this.prevBtn.disabled = scrollLeft <= 1;
        this.nextBtn.disabled = scrollLeft >= (maxScroll - 1);

        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.container).gap) || 20;
        const itemWidth = cardWidth + gap;
        
        // Calculate which item is currently most visible
        const activeIndex = Math.round(scrollLeft / itemWidth);

        this.dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}
