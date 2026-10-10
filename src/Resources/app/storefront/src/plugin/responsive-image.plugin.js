import Plugin from 'src/plugin-system/plugin.class';
import { requiredImageWidth } from './responsive-image-size';

/** Refine native srcset selection using the actual theme frame, including cover crops. */
export default class UctResponsiveImagePlugin extends Plugin {
    init() {
        this._update = this._updateSizes.bind(this);
        this.el.addEventListener('load', this._update);
        this._observer = new ResizeObserver(this._update);
        this._observer.observe(this.el);
        this._updateSizes();
    }

    _updateSizes() {
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;
        if (!width) return;

        const fit = window.getComputedStyle(this.el).objectFit;
        const sources = this.el.parentElement?.tagName === 'PICTURE'
            ? this.el.parentElement.querySelectorAll('source[srcset]')
            : [];

        // Different art-directed sources may have different aspect ratios.
        for (const source of sources) {
            this._setSize(source, requiredImageWidth(
                width, height,
                Number(source.getAttribute('width')),
                Number(source.getAttribute('height')),
                fit,
            ));
        }

        if (this.el.hasAttribute('srcset')) {
            this._setSize(this.el, requiredImageWidth(
                width, height,
                Number(this.el.dataset.uctSourceWidth) || this.el.naturalWidth,
                Number(this.el.dataset.uctSourceHeight) || this.el.naturalHeight,
                fit,
            ));
        }
    }

    _setSize(image, width) {
        const sizes = `${width}px`;
        if (width > 0 && image.getAttribute('sizes') !== sizes) {
            image.setAttribute('sizes', sizes);
        }
    }

    destroy() {
        this._observer?.disconnect();
        this.el.removeEventListener('load', this._update);
        super.destroy();
    }
}
